const axios = require("axios");
const https = require("https");

const FEATURE_LAYER_URL =
    process.env.RAJARHAT_FEATURE_LAYER_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

/**
 * Get existing feature by plot no
 */
const getFeatureByPlotNo = async (plotNo) => {

    const response = await axios.get(
        `${FEATURE_LAYER_URL}/query`,
        {
            httpsAgent,
            params: {
                where: `plot_no=${plotNo}`,
                outFields: "*",
                returnGeometry: true,
                f: "json"
            }
        }
    );

    return response.data.features?.[0] || null;
};

/**
 * Update existing feature
 */
const updateFeature = async (
    objectId,
    transaction
) => {

    const geojson =
        JSON.parse(transaction.geometry);

        const effectivePlotNo =
    transaction.new_plot_no &&
    transaction.new_plot_no.trim() !== ""
        ? transaction.new_plot_no
        : transaction.old_plot_no;

    const updates = [
        {
            attributes: {
            OBJECTID: objectId,

            plot_no: Number(
                String(effectivePlotNo)
                    .replaceAll("_", "")
            ),

            idn: effectivePlotNo,

            unique_id: effectivePlotNo,

            mouza_name:
                transaction.mouza
        },

            geometry: {
                rings:
                    geojson.coordinates[0],

                spatialReference: {
                    wkid: 4326
                }
            }
        }
    ];

    const response =
        await axios.post(
            `${FEATURE_LAYER_URL}/applyEdits`,
            new URLSearchParams({
                f: "json",
                updates:
                    JSON.stringify(
                        updates
                    )
            }),
            {
                httpsAgent,
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

    console.log(
        "Update Result:",
        JSON.stringify(
            response.data,
            null,
            2
        )
    );

    return response.data;
};

/**
 * Add new feature
 */
const addFeature = async (transaction) => {

   
console.log(
        "Entering addFeature:",
        transaction.new_plot_no
    );

    const geojson =
        JSON.parse(transaction.geometry);

    const effectivePlotNo =
        transaction.new_plot_no &&
        transaction.new_plot_no.trim() !== ""
            ? transaction.new_plot_no
            : transaction.old_plot_no;


    const adds = [
        {
            attributes: {

                plot_no: Number(
                    String(effectivePlotNo)
                        .replaceAll("_", "")
                ),

                idn: effectivePlotNo,

                unique_id: effectivePlotNo,

                mouza_name:
                    transaction.mouza
            },

            geometry: {
                rings:
                    geojson.coordinates[0],

                spatialReference: {
                    wkid: 4326
                }
            }
        }
    ];

    const response =
        await axios.post(
            `${FEATURE_LAYER_URL}/applyEdits`,
            new URLSearchParams({
                f: "json",
                adds: JSON.stringify(adds)
            }),
            {
                httpsAgent,
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

    return response.data;
};

/**
 * Delete feature
 */
const deleteFeature = async (
    objectId
) => {

    const response =
        await axios.post(
            `${FEATURE_LAYER_URL}/applyEdits`,
            new URLSearchParams({
                f: "json",
                deletes: objectId
            }),
            {
                httpsAgent,
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

    console.log(
        "Delete Result:",
        JSON.stringify(
            response.data,
            null,
            2
        )
    );

    return response.data;
};


const getObjectIdByPlotNo = async (plotNo) => {

    const feature =
        await getFeatureByPlotNo(plotNo);

    if (!feature) {
        return null;
    }

    return feature.attributes.OBJECTID;
};


module.exports = {
    getFeatureByPlotNo,
    getObjectIdByPlotNo,
    updateFeature,
    addFeature,
    deleteFeature
};