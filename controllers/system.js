let SystemConfig = require('../models/system');

exports.all = (req, res) => {
    SystemConfig.all()
        .then(data => res.send(data))
        .catch(err => res.status(err.code).send(err.msg))
};
exports.update = (req, res) => {
    SystemConfig.update(req.body)
        .then(msg => res.send(msg))
        .catch(err => res.status(err.code).send(err.msg))
};
