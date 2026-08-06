const router = require("express").Router();

const digipinController =
    require("../controllers/digipin.controller");

/**
 * @swagger
 * tags:
 *   name: DIGIPIN
 *   description: DIGIPIN Generation APIs
 */

/**
 * @swagger
 * /api/digipin/generate:
 *   get:
 *     summary: Generate DIGIPIN from Latitude and Longitude
 *     tags: [DIGIPIN]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 28.622788
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 77.213033
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: DIGIPIN generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: string
 *                       example: "28.622788"
 *                     longitude:
 *                       type: string
 *                       example: "77.213033"
 *                     digipin:
 *                       type: string
 *                       example: "39J-49L-L8T4"
 *       400:
 *         description: Missing latitude or longitude
 *       500:
 *         description: Internal Server Error
 */
router.get(
    "/generate",
    digipinController.generateDigipin
);

module.exports = router;