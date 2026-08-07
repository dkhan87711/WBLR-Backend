const turf = require('@turf/turf');

// Correct Base-34 Alphabet for ISO 8000-118 (Excludes 'I' and 'O')
const ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const BASE = BigInt(ALPHABET.length);
const SCALE_FACTOR = 10000000n; // Standard 10^7 scaling for sub-meter grid accuracy

/**
 * Interleaves the binary bits of two scaled BigInt numbers (Morton Z-order curve)
 */
function interleaveBits(x, y) {
    let interleaved = 0n;
    // 32 loops safely covers up to 10^7 scale coordinate values
    for (let i = 0n; i < 32n; i++) {
        interleaved |= ((x >> i) & 1n) << (2n * i);
        interleaved |= ((y >> i) & 1n) << (2n * i + 1n);
    }
    return interleaved;
}

/**
 * ISO 8000-118 Compliant Base-34 Alphanumeric Encoder
 */
function encodeBase34(bigintValue, length) {
    let result = '';
    let temp = bigintValue;

    while (temp > 0n) {
        let remainder = temp % BASE;
        result = ALPHABET[Number(remainder)] + result;
        temp = temp / BASE;
    }

    return result.padStart(length, '0');
}

/**
 * Extract floor from Polygon/MultiPolygon.
 * Uses Z coordinate when available. Defaults to 0 when missing.
 */
function extractFloor(geometry) {
    const floors = [];

    const checkCoords = (coord) => {
        if (Array.isArray(coord) && coord.length >= 3 && coord[2] !== null && coord[2] !== undefined) {
            floors.push(Number(coord[2]));
        }
    };

    if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(ring => ring.forEach(checkCoords));
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(poly => poly.forEach(ring => ring.forEach(checkCoords)));
    }

    if (!floors.length) return 0;

    const uniqueFloors = [...new Set(floors)];
    if (uniqueFloors.length > 1) {
        throw new Error(`Multiple floor values found within target geometry: ${uniqueFloors.join(', ')}`);
    }

    return uniqueFloors[0];
}

/**
 * Generate accurate ISO 8000-118 / eNLI location string
 */
function encodeENLI(latitude, longitude, floor = 0) {
    // 1. Shift coordinates to eliminate negative bounds and apply big integer scalar scaling
    const latValue = BigInt(Math.round((latitude + 90.0) * Number(SCALE_FACTOR)));
    const lonValue = BigInt(Math.round((longitude + 180.0) * Number(SCALE_FACTOR)));

    // 2. Interleave the lat/lon values sequentially (Z-Curve architecture)
    const spatialIndex = interleaveBits(latValue, lonValue);

    // 3. Compress the composite spatial value to standard 13-character base space string
    const geoCode = encodeBase34(spatialIndex, 13);

    // 4. Format and append storey level extension (Strict 14th character)
    const cleanedFloorStr = String(floor).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const floorCode = cleanedFloorStr.padStart(1, '0').slice(-1);

    return `${geoCode}${floorCode}`;
}

/**
 * Generate ULPIN string directly from spatial geometry structures
 */
async function generateFromGeometry(geometry) {
    if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
        throw new Error('Geometry asset must be designated as a Polygon or MultiPolygon array');
    }

    const feature = turf.feature(geometry);

    // Guarantees an internal geographic centroid anchor point regardless of shape curves
    const point = turf.pointOnFeature(feature);
    const [longitude, latitude] = point.geometry.coordinates;

    const floor = extractFloor(geometry);
    const ulpin = encodeENLI(latitude, longitude, floor);

    return {
        ulpin,
        latitude,
        longitude,
        floor
    };
}

module.exports = {
    generateFromGeometry
};
