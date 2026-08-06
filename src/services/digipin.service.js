const { generateDigipin } = require('../utils/digipin.util');

const getDigipin = async (latitude, longitude) => {
    return generateDigipin(latitude, longitude);
};

module.exports = {
    getDigipin,
};