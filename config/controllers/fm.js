const ControllerFactory = require('../factory/controllerfactory');
const FmModel = require('../models/fm');
const FM = require('../../API/stm32API').fm;
module.exports = ControllerFactory(FmModel);
module.exports.setFreq = (req, res) => {
    FM.setFreq((+req.params.freq));
    res.sendStatus(200);
};