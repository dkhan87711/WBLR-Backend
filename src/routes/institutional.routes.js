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
 *     responses:
 *       200:
 *         description: Login Successful
 */
router.post(
    "/login",
    controller.login
);

module.exports = router;