const approvalService = require("../services/approval.service");

const getRequests = async (req, res) => {
    try {
        const role = req.query.role;

        const data = await approvalService.getRequests(role);

        res.status(200).json({ success: true, data });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getRequestDetails = async (req, res) => {
    try {
        const { txnId } = req.params;

        const data = await approvalService.getRequestDetails(txnId);

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const takeAction = async (req, res) => {
    try {
        const { txnId, role, status, remarks } = req.body;

        const data = await approvalService.takeAction(
            txnId, role, status, remarks
        );

        res.status(200).json({ success: true, data });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const sendForApproval = async (req, res) => {
    try {
        const { txnId } = req.body;

        const data = await approvalService.sendForApproval(txnId);

        res.status(200).json({ success: true, data });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const importGeoJson = async (req, res) => {
    try {
        const { features } = req.body;

        const data = await approvalService.importGeoJson(features);

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    getRequests,
    getRequestDetails,
    takeAction,
    sendForApproval,
    importGeoJson
};
