const router = require("express").Router();
const controller = require("../controllers/approval.controller");

/**
 * @swagger
 * tags:
 *   name: Approval
 *   description: Approval Flow APIs
 */


/**
 * @swagger
 * /api/approval/requests:
 *   get:
 *     summary: Get all approval requests
 *     tags: [Approval]
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/requests", controller.getRequests);


/**
 * @swagger
 * /api/approval/requests/{txnId}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Approval]
 *     parameters:
 *       - in: path
 *         name: txnId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 */
router.get("/requests/:txnId", controller.getRequestDetails);


/**
 * @swagger
 * /api/approval/action:
 *   post:
 *     summary: Approve or reject transaction
 *     tags: [Approval]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               txnId:
 *                 type: integer
 *                 example: 1001
 *               role:
 *                 type: string
 *                 example: BLRO
 *               status:
 *                 type: string
 *                 example: APPROVED
 *               remarks:
 *                 type: string
 *                 example: Verified
 *               userId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Action recorded
 */
router.post("/action", controller.takeAction);

module.exports = router;