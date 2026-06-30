const approvalRepo = require("../repositories/approval.repository");

const getRequests = async () => {
    return await approvalRepo.fetchPendingRequests();
};

const getRequestDetails = async (txnId) => {
    return await approvalRepo.fetchRequestDetails(txnId);
};

const takeAction = async (txnId, role, status, remarks, userId) => {

    // Insert approval record
    await approvalRepo.insertApproval({
        txnId,
        role,
        status,
        remarks,
        userId
    });

    // Update transaction status (optional)
    await approvalRepo.updateTxnStatus(txnId, status);

    return { message: "Action recorded successfully" };
};

module.exports = {
    getRequests,
    getRequestDetails,
    takeAction
};