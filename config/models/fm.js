const ConfigAPI = require('../../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');

const FmConfig = ConfigAPI('fm');
module.exports = ModelFactory(FmConfig);