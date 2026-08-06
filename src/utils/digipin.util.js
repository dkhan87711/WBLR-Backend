const LABEL_GRID = [
    ['F', 'C', '9', '8'],
    ['J', '3', '2', '7'],
    ['K', '4', '5', '6'],
    ['L', 'M', 'P', 'T'],
];

function generateDigipin(lat, lon) {
    lat = Number(lat);
    lon = Number(lon);

    let minLat = 2.5;
    let maxLat = 38.5;
    let minLon = 63.5;
    let maxLon = 99.5;

    if (lat < minLat || lat > maxLat) {
        throw new Error('Latitude out of DIGIPIN range');
    }

    if (lon < minLon || lon > maxLon) {
        throw new Error('Longitude out of DIGIPIN range');
    }

    let digipin = '';

    for (let level = 1; level <= 10; level++) {
        const latDiv = (maxLat - minLat) / 4;
        const lonDiv = (maxLon - minLon) / 4;

        let row = 0;
        let column = 0;

        let nextMaxLat = maxLat;
        let nextMinLat = maxLat - latDiv;

        for (let i = 0; i < 4; i++) {
            if (lat >= nextMinLat && lat < nextMaxLat) {
                row = i;
                break;
            }

            nextMaxLat = nextMinLat;
            nextMinLat = nextMaxLat - latDiv;
        }

        let nextMinLon = minLon;
        let nextMaxLon = minLon + lonDiv;

        for (let i = 0; i < 4; i++) {
            if (lon >= nextMinLon && lon < nextMaxLon) {
                column = i;
                break;
            } else if ((nextMinLon + lonDiv) < maxLon) {
                nextMinLon = nextMaxLon;
                nextMaxLon = nextMinLon + lonDiv;
            } else {
                column = i;
            }
        }

        digipin += LABEL_GRID[row][column];

        minLat = nextMinLat;
        maxLat = nextMaxLat;
        minLon = nextMinLon;
        maxLon = nextMaxLon;
    }

    return `${digipin.slice(0, 3)}-${digipin.slice(3, 6)}-${digipin.slice(6)}`;
}

module.exports = {
    generateDigipin,
};