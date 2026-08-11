const turf = require('@turf/turf');

const ANCHOR_ALPHABET =
    '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const CHAR_MAP = {};

for (
    let i = 0;
    i < ANCHOR_ALPHABET.length;
    i++
) {
    CHAR_MAP[
        ANCHOR_ALPHABET[i]
    ] = i;
}

/**
 * Reverse-engineered refinement ordering
 * validated against Indian eNLI samples.
 */
const REFINEMENT_ENCODE = [
    '0', // 0
    '1', // 1
    '2', // 2
    '3', // 3
    '4', // 4
    '5', // 5
    '6', // 6
    '7', // 7
    '8', // 8
    '9', // 9

    'A', // 10
    'B', // 11
    'C', // 12
    'D', // 13
    'E', // 14
    'F', // 15

    'G', // 16
    'H', // 17
    'Y', // 18
    'J', // 19
    'K', // 20
    'L', // 21
    'M', // 22
    'N', // 23
    'Z', // 24
    'P', // 25
    'Q', // 26
    'R', // 27
    'S', // 28
    'T', // 29
    'U', // 30
    'V'  // 31
];

function extractFloor(geometry) {

    const floors = [];

    const scan = coords => {

        if (
            Array.isArray(coords) &&
            typeof coords[0] === 'number'
        ) {

            if (
                coords.length >= 3 &&
                coords[2] !== null &&
                coords[2] !== undefined
            ) {
                floors.push(
                    Number(coords[2])
                );
            }

            return;
        }

        if (Array.isArray(coords)) {
            coords.forEach(scan);
        }
    };

    scan(geometry.coordinates);

    if (!floors.length) {
        return 0;
    }

    return floors[0];
}

function encodeLatitude(latitude) {

    const degree =
        Math.floor(latitude);

    const firstValue =
        Math.floor(
            (degree - 22) / 14
        ) + 8;

    const secondValue =
        degree -
        (
            22 +
            ((firstValue - 8) * 14)
        );

    const firstChar =
        ANCHOR_ALPHABET[firstValue];

    const secondChar =
        ANCHOR_ALPHABET[secondValue];

    let remainder =
        Number(
            (
                latitude - degree
            ).toFixed(6)
        );

    const thirdValue =
        Math.floor(
            remainder / 0.032
        );

    remainder -=
        thirdValue * 0.032;

    const fourthValue =
        Math.floor(
            remainder / 0.001
        );

    remainder -=
        fourthValue * 0.001;

    const fifthValue =
        Math.floor(
            remainder /
            0.000032
        );

    remainder -=
        fifthValue *
        0.000032;

    let sixthValue =
        Math.round(
            remainder /
            0.000001
        );

    if (sixthValue > 31) {
        sixthValue = 31;
    }

    return (
        firstChar +
        secondChar +
        REFINEMENT_ENCODE[
            thirdValue
        ] +
        REFINEMENT_ENCODE[
            fourthValue
        ] +
        REFINEMENT_ENCODE[
            fifthValue
        ] +
        REFINEMENT_ENCODE[
            sixthValue
        ]
    );
}

function encodeLongitude(longitude) {

    const firstValue =
        Math.floor(
            (longitude - 67) / 19
        ) +
        CHAR_MAP['D'];

    const anchor =
        67 +
        (
            firstValue -
            CHAR_MAP['D']
        ) * 19;

    const secondValue =
        Math.floor(
            longitude - anchor
        );

    let remainder =
        Number(
            (
                longitude -
                anchor -
                secondValue
            ).toFixed(6)
        );

    const thirdValue =
        Math.floor(
            remainder / 0.032
        );

    remainder -=
        thirdValue * 0.032;

    const fourthValue =
        Math.floor(
            remainder / 0.001
        );

    remainder -=
        fourthValue * 0.001;

    const fifthValue =
        Math.floor(
            remainder /
            0.000032
        );

    remainder -=
        fifthValue *
        0.000032;

    let sixthValue =
        Math.round(
            remainder /
            0.000001
        );

    if (sixthValue > 31) {
        sixthValue = 31;
    }

    return (
        ANCHOR_ALPHABET[
            firstValue
        ] +
        ANCHOR_ALPHABET[
            secondValue
        ] +
        REFINEMENT_ENCODE[
            thirdValue
        ] +
        REFINEMENT_ENCODE[
            fourthValue
        ] +
        REFINEMENT_ENCODE[
            fifthValue
        ] +
        REFINEMENT_ENCODE[
            sixthValue
        ]
    );
}

function encodeENLI(
    latitude,
    longitude,
    floor = 0
) {

    const latCode =
        encodeLatitude(latitude);

    const lonCode =
        encodeLongitude(longitude);

    return `${latCode}-${lonCode}-H${floor}`;
}

async function generateFromGeometry(
    geometry
) {

    if (
        geometry.type !== 'Polygon' &&
        geometry.type !== 'MultiPolygon'
    ) {
        throw new Error(
            'Geometry must be Polygon or MultiPolygon'
        );
    }

    const feature =
        turf.feature(geometry);

    const point =
        turf.pointOnFeature(feature);

    const [
        longitude,
        latitude
    ] =
        point.geometry.coordinates;

    const floor =
        extractFloor(geometry);

    const ulpin =
        encodeENLI(
            latitude,
            longitude,
            floor
        );

    return {
        ulpin,
        latitude:
            latitude.toFixed(6),
        longitude:
            longitude.toFixed(6),
        floor
    };
}

module.exports = {
    generateFromGeometry
};