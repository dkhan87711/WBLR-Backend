const approvalRepo = require("../repositories/approval.repository");

const getRequests = async (role) => {
    return await approvalRepo.fetchRequestsByRole(role);
};

const getRequestDetails = async (txnId) => {
    const data = await approvalRepo.fetchRequestDetails(txnId);
    // ✅ ADD THIS
    const originalGeometry = await approvalRepo.fetchOriginalGeometry(txnId);
    return {
        ...data,
        originalGeometry
    };
};

const takeAction = async (txnId, role, status, remarks) => {

    const txn = await approvalRepo.getTxnById(txnId);

    if (!txn) throw new Error("Transaction not found");

    const currentStatus = txn.status;
    let nextStatus = currentStatus;

    if (status === "REJECTED") {
        nextStatus = "REJECTED";
    }

    else if (status === "APPROVED") {

        if (role === "SUBDIVISION_EDITOR") {

            if (currentStatus !== "SUBMITTED") {
                throw new Error("Invalid stage");
            }

            nextStatus = "SUBDIVISION_APPROVED";
        }

        else if (role === "DISTRICT_EDITOR") {

            if (currentStatus !== "SUBDIVISION_APPROVED") {
                throw new Error("Pending at Subdivision");
            }

            nextStatus = "DISTRICT_APPROVED";
        }

        else {
            throw new Error("Unauthorized role");
        }
    }

    else {
        throw new Error("Invalid status");
    }

    await approvalRepo.insertApproval({
        txnId,
        role,
        status,
        remarks,
        userId: null // ✅ since no user
    });

    await approvalRepo.updateTxnStatus(txnId, nextStatus);

    return {
        message: "Action recorded successfully",
        nextStatus
    };
};

const sendForApproval = async (txnId) => {

    const txn = await approvalRepo.getTxnById(txnId);

    if (!txn) throw new Error("Transaction not found");

    if (txn.status && txn.status !== "DRAFT") {
        throw new Error("Already submitted");
    }

    await approvalRepo.updateTxnStatus(txnId, "SUBMITTED");

    return { message: "Sent for approval" };
};

const importGeoJson = async (features) => {
    return await approvalRepo.importGeoJson(features);
};

module.exports = {
    getRequests,
    getRequestDetails,
    takeAction,
    sendForApproval,
    importGeoJson
};