const ControllerFactory = require('../factory/controllerfactory');
const ClockLinesModel = require('../models/clockLines');
const ClockLinesEmitter =require('../../events/clockLinesEmitter');
module.exports = ControllerFactory(ClockLinesModel);
module.exports.tune = (req, res) => {
    ClockLinesEmitter.tuneArrows((req.params.id))
        .then( msg => res.send(msg))
        .catch(err => res.status(404).send(err.message))
};