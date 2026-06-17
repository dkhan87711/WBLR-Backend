const router = require("express").Router();

const controller =
    require("../controllers/department.controller");

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department User APIs
 */

/**
 * @swagger
 * /api/department/login:
 *   post:
 *     summary: Department Login
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "dlrs_admin"
 *               email:
 *                 type: string
 *                 example: "dlrs@gmail.com"
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
 * /api/department/logout:
 *   post:
 *     summary: Department Logout
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Logout Successful
 */
router.post(
    "/logout",
    controller.logout
);

module.exports = router;