const ConfigAPI = require('../../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');

const SystemConfig = ConfigAPI('system');
module.exports = ModelFactory(SystemConfig);
