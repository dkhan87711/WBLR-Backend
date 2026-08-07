const router = require("express").Router();

const digipinController =
    require("../controllers/digipin.controller");

/**
 * @swagger
 * tags:
 *   name: DIGIPIN
 *   description: DIGIPIN Generation and Reverse Lookup APIs
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
 *         description: Latitude of the location
 *         schema:
 *           type: number
 *           example: 28.622788
 *       - in: query
 *         name: longitude
 *         required: true
 *         description: Longitude of the location
 *         schema:
 *           type: number
 *           example: 77.213033
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

/**
 * @swagger
 * /api/digipin/decode:
 *   get:
 *     summary: Get Latitude and Longitude from DIGIPIN
 *     tags: [DIGIPIN]
 *     parameters:
 *       - in: query
 *         name: digipin
 *         required: true
 *         description: DIGIPIN code
 *         schema:
 *           type: string
 *           example: "39J-49L-L8T4"
 *     responses:
 *       200:
 *         description: Coordinates fetched successfully
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
 *                     digipin:
 *                       type: string
 *                       example: "39J-49L-L8T4"
 *                     latitude:
 *                       type: number
 *                       example: 28.622788
 *                     longitude:
 *                       type: number
 *                       example: 77.213033
 *       400:
 *         description: Invalid DIGIPIN
 *       500:
 *         description: Internal Server Error
 */
router.get(
    "/decode",
    digipinController.decodeDigipin
);

module.exports = router;