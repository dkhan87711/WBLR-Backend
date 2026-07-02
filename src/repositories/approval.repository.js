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

const getTxnById = async (txnId) => {
    const [rows] = await db.query(
        `SELECT txn_id, status FROM public.land_txn_request WHERE txn_id = :txnId LIMIT 1`,
        { replacements: { txnId } }
    );
    return rows[0];
};

const fetchRequestsByRole = async () => {

    const query = `
        SELECT 
            txn_id,
            MIN(txn_type) AS txn_type,
            STRING_AGG(DISTINCT old_val, ',') AS plot_no,
            STRING_AGG(DISTINCT new_plot_no, ',') AS new_plot_no,
            MIN(owner_name) AS owner_name,
            MIN(created_by) AS requested_by,
            MIN(created_date) AS requested_date,
            MIN(mouza) AS mouza,
            ROUND(SUM(ror_area)::NUMERIC, 4) AS ror_area,
            ROUND(SUM(gis_area)::NUMERIC, 4) AS gis_area,
            MIN(status) AS status
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
                status,
                unnest(string_to_array(old_plot_no, ',')) AS old_val
            FROM public.land_txn_request
        ) t
        GROUP BY txn_id
        ORDER BY txn_id DESC
    `;

    const [rows] = await db.query(query);
    return rows;
};

const fetchOriginalGeometry = async (txnId) => {

    const [rows] = await db.query(
        `
        SELECT DISTINCT old_plot_no
        FROM public.land_txn_request
        WHERE txn_id = :txnId
        `,
        { replacements: { txnId } }
    );

    if (!rows.length) return [];

    let plotNumbers = [];

    rows.forEach(r => {

        if (!r.old_plot_no) return;

        const val = r.old_plot_no.toString();

        // ✅ SPLIT CASE
        if (val.includes(",")) {
            plotNumbers.push(...val.split(",").map(p => parseInt(p)));
        }

        // ✅ MERGE CASE
        else if (val.length > 3) {
            const parts = val.match(/.{1,3}/g);
            plotNumbers.push(...parts.map(p => parseInt(p)));
        }

        // ✅ NORMAL
        else {
            plotNumbers.push(parseInt(val));
        }
    });

    plotNumbers = [...new Set(plotNumbers)];

    console.log("Final Plot Numbers:", plotNumbers);

    if (!plotNumbers.length) return [];

    const [geomRows] = await db.query(
        `
        SELECT 
            plot_no, 
            ST_AsGeoJSON(shape) AS geometry
        FROM public.rajarhat_plot_v2
        WHERE plot_no IN (:plotNumbers)   -- ✅ FIXED
        `,
        {
            replacements: { plotNumbers }
        }
    );

    return geomRows;
};

const importGeoJson = async (features) => {

    let inserted = 0;

    for (const feature of features) {

        const p = feature.properties;

        const [result] = await db.query(
            `
            INSERT INTO public.land_txn_request(
                id,
                txn_id,
                txn_type,
                old_plot_no,
                new_plot_no,
                shape,
                owner_name,
                father_name,
                address,
                khatian_no,
                landuse,
                total_area,
                shared_area,
                created_by,
                created_date,
                ror_area,
                gis_area,
                mouza,
                status
            )
            VALUES (
                :id,
                :txn_id,
                :txn_type,
                :old_plot_no,
                :new_plot_no,
                ST_SetSRID(ST_GeomFromGeoJSON(:geometry),4326),
                :owner_name,
                :father_name,
                :address,
                :khatian_no,
                :landuse,
                :total_area,
                :shared_area,
                :created_by,
                :created_date,
                :ror_area,
                :gis_area,
                :mouza,
                :status
            )
            ON CONFLICT (id) DO NOTHING
            RETURNING id
            `,
            {
                replacements: {
                    id: p.id,
                    txn_id: p.txn_id,
                    txn_type: p.txn_type,
                    old_plot_no: p.old_plot_no,
                    new_plot_no: p.new_plot_no,
                    geometry: JSON.stringify(feature.geometry),
                    owner_name: p.owner_name,
                    father_name: p.father_name,
                    address: p.address,
                    khatian_no: p.khatian_no,
                    landuse: p.landuse,
                    total_area: p.total_area,
                    shared_area: p.shared_area,
                    created_by: p.created_by,
                    created_date: p.created_date,
                    ror_area: p.ror_area,
                    gis_area: p.gis_area,
                    mouza: p.mouza,
                    status: p.status
                }
            }
        );

        if (result?.length) {
            inserted++;
        }
    }

    return {
        imported: inserted > 0,
        inserted,
        skipped: features.length - inserted,
        message:
            inserted > 0
                ? `${inserted} records imported, ${features.length - inserted} skipped`
                : "All records already exist"
    };
};


module.exports = {
    fetchPendingRequests,
    fetchRequestDetails,
    insertApproval,
    updateTxnStatus,
    getTxnById,
    fetchRequestsByRole,
    fetchOriginalGeometry,
    importGeoJson
};