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
 *     summary: Get approval requests (role-based)
 *     tags: [Approval]
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           example: SUBDIVISION_EDITOR
 *         description: Role of logged in user
 *     responses:
 *       200:
 *         description: List of filtered transactions
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - txn_id: 1001
 *                   txn_type: SPLIT
 *                   plot_no: "353"
 *                   new_plot_no: "353_1,353_2"
 *                   mouza: Rajarhat
 *                   status: SUBMITTED
 */
router.get("/requests", controller.getRequests);


/**
 * @swagger
 * /api/approval/requests/{txnId}:
 *   get:
 *     summary: Get transaction details with approval history
 *     tags: [Approval]
 *     parameters:
 *       - in: path
 *         name: txnId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1001
 *     responses:
 *       200:
 *         description: Transaction with approval logs
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 transaction: []
 *                 approvals: []
 */
router.get("/requests/:txnId", controller.getRequestDetails);


/**
 * @swagger
 * /api/approval/action:
 *   post:
 *     summary: Approve or reject transaction (based on role)
 *     tags: [Approval]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - role
 *               - status
 *             properties:
 *               txnId:
 *                 type: integer
 *                 example: 1001
 *               role:
 *                 type: string
 *                 example: SUBDIVISION_EDITOR
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 example: APPROVED
 *               remarks:
 *                 type: string
 *                 example: Verified successfully
 *     responses:
 *       200:
 *         description: Action recorded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 message: Action recorded successfully
 *                 nextStatus: SUBDIVISION_APPROVED
 */
router.post("/action", controller.takeAction);


/**
 * @swagger
 * /api/approval/submit:
 *   post:
 *     summary: Send transaction for approval (Editor action)
 *     tags: [Approval]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *             properties:
 *               txnId:
 *                 type: integer
 *                 example: 1001
 *     responses:
 *       200:
 *         description: Sent for approval successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 message: Sent for approval
 */
router.post("/submit", controller.sendForApproval);


module.exports = router;