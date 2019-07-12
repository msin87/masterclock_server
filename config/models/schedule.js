const ConfigAPI = require('../../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');

const ScheduleConfig = ConfigAPI('schedule');
module.exports = ModelFactory(ScheduleConfig);
