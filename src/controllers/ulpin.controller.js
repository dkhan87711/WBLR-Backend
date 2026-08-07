const ulpinService = require('../services/ulpin.service');

const generateUlpin = async (req, res) => {
    try {
        const { geometry } = req.body;

        if (!geometry) {
            return res.status(400).json({
                success: false,
                message: 'geometry is required'
            });
        }

        if (
            geometry.type !== 'Polygon' &&
            geometry.type !== 'MultiPolygon'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'geometry type must be Polygon or MultiPolygon'
            });
        }

        const result =
            await ulpinService.generateFromGeometry(
                geometry
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
    generateUlpin
};