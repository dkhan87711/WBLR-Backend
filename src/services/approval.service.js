const approvalRepo = require("../repositories/approval.repository");
const arcgisService =
    require("./arcgis.service");

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

    await approvalRepo.updateTxnStatus(
        txnId,
        nextStatus
    );

    if (
        role === "DISTRICT_EDITOR" &&
        nextStatus === "DISTRICT_APPROVED"
    ) {

       
        console.log(
                `Starting Hosted Layer Sync for txn ${txnId}`
            );

        await syncApprovedHostedLayer(txnId);

        console.log(
            `Hosted Layer Sync completed for txn ${txnId}`
        );
;
    }

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

const syncApprovedHostedLayer = async (txnId) => {

    console.log(
        `[syncApprovedHostedLayer] Started. txnId=${txnId}`
    );

    const transactions =
        await approvalRepo.getApprovedTxnGeometry(txnId);

    if (!transactions.length) {
        return;
    }

    //
    // GROUP BY old_plot_no
    //
    const grouped = {};

    transactions.forEach(txn => {

        if (!grouped[txn.old_plot_no]) {
            grouped[txn.old_plot_no] = [];
        }

        grouped[txn.old_plot_no].push(txn);
    });

    for (const oldPlotNo of Object.keys(grouped)) {

        const txns = grouped[oldPlotNo];

        //
        // SPLIT
        //
        if (txns.length > 1) {

            console.log(
                `SPLIT detected for plot ${oldPlotNo}`
            );

            const feature =
                await arcgisService.getFeatureByPlotNo(
                    oldPlotNo
                );

            if (!feature) {

                throw new Error(
                    `Plot ${oldPlotNo} not found in ArcGIS`
                );
            }

            const objectId =
                feature.attributes.OBJECTID ||
                feature.attributes.ObjectID ||
                feature.attributes.objectid;

            //
            // UPDATE FIRST SPLIT
            //
            await arcgisService.updateFeature(
                objectId,
                txns[0]
            );

            console.log(
                `Updated existing feature to ${txns[0].new_plot_no}`
            );

            //
            // ADD REMAINING SPLITS
            //
            for (
                let i = 1;
                i < txns.length;
                i++
            ) {

                console.log(
                    `Adding split feature ${txns[i].new_plot_no}`
                );

                const result =
                    await arcgisService.addFeature(
                        txns[i]
                    );

                console.log(
                    "Add Result:",
                    JSON.stringify(
                        result,
                        null,
                        2
                    )
                );
            }

            continue;
        }

        const txn = txns[0];

        const oldPlots =
            txn.old_plot_no
                .split(",")
                .map(v => v.trim());

        //
        // MERGE
        //
        if (oldPlots.length > 1) {

            console.log(
                `MERGE detected : ${txn.old_plot_no} -> ${txn.new_plot_no}`
            );

            const primaryFeature =
                await arcgisService.getFeatureByPlotNo(
                    oldPlots[0]
                );

            if (!primaryFeature) {

                throw new Error(
                    `Plot ${oldPlots[0]} not found`
                );
            }

            const objectId =
                primaryFeature.attributes.OBJECTID ||
                primaryFeature.attributes.ObjectID ||
                primaryFeature.attributes.objectid;

            await arcgisService.updateFeature(
                objectId,
                txn
            );

            for (
                let i = 1;
                i < oldPlots.length;
                i++
            ) {

                const feature =
                    await arcgisService.getFeatureByPlotNo(
                        oldPlots[i]
                    );

                if (!feature) {
                    continue;
                }

                const deleteId =
                    feature.attributes.OBJECTID ||
                    feature.attributes.ObjectID ||
                    feature.attributes.objectid;

                await arcgisService.deleteFeature(
                    deleteId
                );
            }

            continue;
        }

        //
        // GEOMETRY UPDATE
        //
        console.log(
            `UPDATE detected : ${oldPlotNo}`
        );

        const feature =
            await arcgisService.getFeatureByPlotNo(
                oldPlotNo
            );

        if (!feature) {

            throw new Error(
                `Plot ${oldPlotNo} not found`
            );
        }

        const objectId =
            feature.attributes.OBJECTID ||
            feature.attributes.ObjectID ||
            feature.attributes.objectid;

        await arcgisService.updateFeature(
            objectId,
            txn
        );
    }

    console.log(
        `[syncApprovedHostedLayer] Completed`
    );
};

module.exports = {
    getRequests,
    getRequestDetails,
    takeAction,
    sendForApproval,
    importGeoJson
};