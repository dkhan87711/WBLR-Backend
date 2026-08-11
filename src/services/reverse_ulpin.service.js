const ANCHOR_ALPHABET =
    '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Observed refinement ordering from eNLI tests
 */
const REFINEMENT_MAP = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,

    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,

    'G': 16,
    'H': 17,
    'Y': 18,
    'J': 19,
    'K': 20,
    'L': 21,
    'M': 22,
    'N': 23,
    'Z': 24,
    'P': 25,
    'Q': 26,
    'R': 27,
    'S': 28,
    'T': 29,
    'U': 30,
    'V': 31
};

const ANCHOR_MAP = {};

for (
    let i = 0;
    i < ANCHOR_ALPHABET.length;
    i++
) {
    ANCHOR_MAP[
        ANCHOR_ALPHABET[i]
    ] = i;
}

function getAnchorValue(char) {
    const value =
        ANCHOR_MAP[
            char.toUpperCase()
        ];

    if (value === undefined) {
        throw new Error(
            `Invalid anchor character: ${char}`
        );
    }

    return value;
}

function getRefinementValue(char) {
    const value =
        REFINEMENT_MAP[
            char.toUpperCase()
        ];

    if (value === undefined) {
        throw new Error(
            `Invalid refinement character: ${char}`
        );
    }

    return value;
}

/**
 * Latitude
 *
 * Example
 * 80HZHP
 * -> 22.568569
 */
function decodeLatitude(latCode) {

    const chars =
        latCode.toUpperCase().split('');

    const anchor =
        22 +
        (
            getAnchorValue(chars[0]) -
            8
        ) * 14 +
        getAnchorValue(chars[1]);

    return Number(
        (
            anchor +
            getRefinementValue(chars[2]) *
                0.032 +
            getRefinementValue(chars[3]) *
                0.001 +
            getRefinementValue(chars[4]) *
                0.000032 +
            getRefinementValue(chars[5]) *
                0.000001
        ).toFixed(6)
    );
}

/**
 * Longitude
 *
 * Example
 * E2DG37
 * -> 88.432103
 */
function decodeLongitude(lonCode) {

    const chars =
        lonCode.toUpperCase().split('');

    const anchor =
        67 +
        (
            getAnchorValue(chars[0]) -
            getAnchorValue('D')
        ) * 19 +
        getAnchorValue(chars[1]);

    return Number(
        (
            anchor +
            getRefinementValue(chars[2]) *
                0.032 +
            getRefinementValue(chars[3]) *
                0.001 +
            getRefinementValue(chars[4]) *
                0.000032 +
            getRefinementValue(chars[5]) *
                0.000001
        ).toFixed(6)
    );
}

function decodeFloor(floorCode) {

    if (!floorCode) {
        return 0;
    }

    return Number(
        floorCode.replace(/^H/i, '')
    );
}

function decodeUlpin(ulpin) {

    const [
        latitudeCode,
        longitudeCode,
        floorCode
    ] =
        ulpin
            .toUpperCase()
            .trim()
            .split('-');

    if (
        !latitudeCode ||
        !longitudeCode
    ) {
        throw new Error(
            'Invalid ULPIN format'
        );
    }

    return {
        latitude:
            decodeLatitude(
                latitudeCode
            ).toFixed(6),

        longitude:
            decodeLongitude(
                longitudeCode
            ).toFixed(6),

        floor:
            decodeFloor(
                floorCode
            )
    };
}

module.exports = {
    decodeUlpin
};