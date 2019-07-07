let SystemConfig = require('../models/config');

exports.all = (req, res) => {
    SystemConfig.all()
        .then(data => res.send(data))
        .catch(err => res.status(err.code).send(err.msg))
};