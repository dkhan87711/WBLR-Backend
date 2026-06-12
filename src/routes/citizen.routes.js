const router = require("express").Router();
const citizenController =
    require("../controllers/citizen.controller");

/**
 * @swagger
 * tags:
 *   name: Citizen
 *   description: Citizen APIs
 */

/**
 * @swagger
 * /api/citizen/register:
 *   post:
 *     summary: Register Citizen
 *     tags: [Citizen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Citizen Registered Successfully
 */
router.post(
    "/register",
    citizenController.register
);

/**
 * @swagger
 * /api/citizen/send-otp:
 *   post:
 *     summary: Send OTP to Mobile Number
 *     tags: [Citizen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNo:
 *                 type: string
 *                 example: "9999999999"
 *     responses:
 *       200:
 *         description: OTP Sent Successfully
 */
router.post(
    "/send-otp",
    citizenController.sendOtp
);

/**
 * @swagger
 * /api/citizen/otp-login:
 *   post:
 *     summary: Citizen Login Using OTP
 *     tags: [Citizen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNo:
 *                 type: string
 *                 example: "9999999999"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Citizen Login Successful
 */
router.post(
    "/otp-login",
    citizenController.citizenOtpLogin
);

module.exports = router;