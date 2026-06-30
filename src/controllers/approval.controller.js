const approvalService = require("../services/approval.service");

const getRequests = async (req, res) => {
    try {
        const data = await approvalService.getRequests();

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
        const { txnId, role, status, remarks, userId } = req.body;

        const data = await approvalService.takeAction(
            txnId, role, status, remarks, userId
        );

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
    takeAction
};
