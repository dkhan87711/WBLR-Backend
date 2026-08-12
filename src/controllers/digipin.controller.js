const digipinService = require("../services/digipin.service");

const generateDigipin = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "latitude and longitude are required",
            });
        }

        const digipin = await digipinService.getDigipin(
            latitude,
            longitude
        );

        return res.status(200).json({
            success: true,
            data: {
                latitude,
                longitude,
                digipin,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const decodeDigipin = async (req, res) => {
    try {
        const { digipin } = req.query;

        if (!digipin) {
            return res.status(400).json({
                success: false,
                message: "digipin is required",
            });
        }

        const coordinates =
            await digipinService.getCoordinates(digipin);

        return res.status(200).json({
            success: true,
            data: {
                digipin,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    generateDigipin,
    decodeDigipin,
};