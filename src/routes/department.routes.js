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
 *                 example: "duser"
 *               email:
 *                 type: string
 *                 example: "department@gmail.com"
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