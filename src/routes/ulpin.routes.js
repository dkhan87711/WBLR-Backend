const router = require('express').Router();

const ulpinController = require('../controllers/ulpin.controller');
const ulpinDecodeController = require('../controllers/reverse_ulpin.controller')

/**
 * @swagger
 * tags:
 *   name: ULPIN
 *   description: ULPIN Generation APIs
 */

/**
 * @swagger
 * /api/ulpin/generate:
 *   post:
 *     summary: Generate ULPIN from Polygon/MultiPolygon Geometry
 *     tags: [ULPIN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - geometry
 *             properties:
 *               geometry:
 *                 type: object
 *                 description: GeoJSON Polygon or MultiPolygon
 *                 example:
 *                   type: Polygon
 *                   coordinates:
 *                     - - [77.5946, 12.9716]
 *                       - [77.5948, 12.9716]
 *                       - [77.5948, 12.9718]
 *                       - [77.5946, 12.9718]
 *                       - [77.5946, 12.9716]
 *     responses:
 *       200:
 *         description: ULPIN generated successfully
 *       400:
 *         description: Invalid geometry supplied
 *       500:
 *         description: Internal Server Error
 */
router.post(
    '/generate',
    ulpinController.generateUlpin
);

/**
 * @swagger
 * /api/ulpin/decode:
 *   post:
 *     summary: Decode ULPIN/eNLI into Latitude, Longitude and Floor
 *     tags: [ULPIN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ulpin
 *             properties:
 *               ulpin:
 *                 type: string
 *                 example: "80HZHP-E2DG37-H0"
 *                 description: ULPIN/eNLI code
 *     responses:
 *       200:
 *         description: ULPIN decoded successfully
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
 *                       type: number
 *                       example: 22.568569
 *                     longitude:
 *                       type: number
 *                       example: 88.432103
 *                     floor:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Invalid ULPIN supplied
 *       500:
 *         description: Internal Server Error
 */
router.post(
    '/decode',
    ulpinDecodeController.decodeUlpin
);

module.exports = router;