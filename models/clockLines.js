const ConfigAPI = require('../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');

const ClockLinesConfig = ConfigAPI('clockLines');
module.exports = ModelFactory(ClockLinesConfig);
