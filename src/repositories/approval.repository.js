const db = require("../config/database");


// ✅ FETCH LIST (1 row per txn_id)
const fetchPendingRequests = async () => {

    const query = `
        SELECT 
            txn_id,

            MIN(txn_type) AS txn_type,

            STRING_AGG(DISTINCT old_val, ',') AS plot_no,
            STRING_AGG(DISTINCT new_plot_no, ',') AS new_plot_no,

            MIN(owner_name) AS owner_name,
            MIN(created_by) AS requested_by,
            MIN(created_date) AS requested_date,

            -- ✅ ADD MOUZA HERE
            MIN(mouza) AS mouza,

            -- ✅ AREA
            ROUND(SUM(ror_area)::NUMERIC, 4) AS ror_area,
            ROUND(SUM(gis_area)::NUMERIC, 4) AS gis_area,

            'Pending' AS status

        FROM (
            SELECT 
                txn_id,
                txn_type,
                new_plot_no,
                owner_name,
                created_by,
                created_date,
                ror_area,
                gis_area,
                mouza,

                unnest(string_to_array(old_plot_no, ',')) AS old_val

            FROM public.land_txn_request
        ) t

        GROUP BY txn_id
        ORDER BY txn_id DESC
    `;

    const [rows] = await db.query(query);

    return rows || [];
};


// ✅ FETCH DETAILS (full transaction rows)
const fetchRequestDetails = async (txnId) => {

    const [txnRows] = await db.query(
        `
        SELECT *
        FROM public.land_txn_request 
        WHERE txn_id = :txnId 
        ORDER BY id
        `,
        {
            replacements: { txnId }
        }
    );

    const [approvalRows] = await db.query(
        `
        SELECT *
        FROM public.land_txn_approval 
        WHERE txn_id = :txnId 
        ORDER BY action_date
        `,
        {
            replacements: { txnId }
        }
    );

    return {
        transaction: txnRows || [],
        approvals: approvalRows || []
    };
};


// ✅ INSERT APPROVAL ENTRY
const insertApproval = async ({
    txnId,
    role,
    status,
    remarks,
    userId
}) => {

    await db.query(
        `
        INSERT INTO public.land_txn_approval
        (txn_id, role, status, remarks, action_by)
        VALUES (:txnId, :role, :status, :remarks, :userId)
        `,
        {
            replacements: { txnId, role, status, remarks, userId }
        }
    );
};


// ✅ UPDATE TRANSACTION STATUS
const updateTxnStatus = async (txnId, status) => {

    await db.query(
        `
        UPDATE public.land_txn_request
        SET status = :status
        WHERE txn_id = :txnId
        `,
        {
            replacements: { txnId, status }
        }
    );
};


module.exports = {
    fetchPendingRequests,
    fetchRequestDetails,
    insertApproval,
    updateTxnStatus
};