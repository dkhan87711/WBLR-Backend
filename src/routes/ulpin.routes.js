const router = require('express').Router();

const ulpinController = require('../controllers/ulpin.controller');

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
 *                     ulpin:
 *                       type: string
 *                       example: "03C2P50A0YR3W0"
 *                     latitude:
 *                       type: number
 *                       example: 12.9717
 *                     longitude:
 *                       type: number
 *                       example: 77.5947
 *                     floor:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: Invalid geometry supplied
 *       500:
 *         description: Internal Server Error
 */
router.post(
    '/generate',
    ulpinController.generateUlpin
);

module.exports = router;