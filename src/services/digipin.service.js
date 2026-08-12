const {
    generateDigipin,
    decodeDigipin,
} = require("../utils/digipin.util");

const getDigipin = async (latitude, longitude) => {
    return generateDigipin(latitude, longitude);
};

const getCoordinates = async (digipin) => {
    return decodeDigipin(digipin);
};

module.exports = {
    getDigipin,
    getCoordinates,
};