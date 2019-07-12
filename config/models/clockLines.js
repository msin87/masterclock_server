const ConfigAPI = require('../../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');

ClockLinesConfig = ConfigAPI('clockLines');
module.exports = ModelFactory(ClockLinesConfig);
