const router = require("express").Router();

const controller =
    require("../controllers/institutional.controller");

/**
 * @swagger
 * tags:
 *   name: Institutional
 *   description: Institutional User APIs
 */

/**
 * @swagger
 * /api/institutional/login:
 *   post:
 *     summary: Institutional Login
 *     tags: [Institutional]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "iuser"
 *               email:
 *                 type: string
 *                 example: "institutional@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345"
 *               loginType:
 *                 type: string
 *                 example: "WEB"
 *     responses:
 *       200:
 *         description: Login Successful
 */
router.post(
    "/login",
    controller.login
);

/**
 * @swagger
 * /api/institutional/logout:
 *   post:
 *     summary: Institutional Logout
 *     tags: [Institutional]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Logout Successful
 */
router.post(
    "/logout",
    controller.logout
);

module.exports = router;