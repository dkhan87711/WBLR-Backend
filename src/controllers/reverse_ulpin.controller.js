const reverseUlpinService = require(
    '../services/reverse_ulpin.service'
);

const decodeUlpin = async (req, res) => {
    try {
        const { ulpin } = req.body;

        if (!ulpin) {
            return res.status(400).json({
                success: false,
                message: 'ulpin is required'
            });
        }

        const result =
            reverseUlpinService.decodeUlpin(
                ulpin
            );

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    decodeUlpin
};