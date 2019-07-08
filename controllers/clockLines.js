let SystemConfig = require('../models/clockLines');

exports.all = (req, res) => {
    SystemConfig.all()
        .then(data => res.send(data))
        .catch(err => res.status(err.code).send(err.msg))
};
exports.findById = (req, res) => {
    SystemConfig.findById(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.status(err.code).send(err.msg));
};
exports.push = (req, res) => {
    SystemConfig.push(req.body)
        .then(msg => res.send(msg))
        .catch(err => res.status(err.code).send(err.msg));
};
exports.update = (req, res) => {
    SystemConfig.update(req.body, req.params.id)
        .then(msg => res.send(msg))
        .catch(err => res.status(err.code).send(err.msg))
};
exports.delete = (req, res) => {
    SystemConfig.delete(req.params.id)
        .then(msg => res.send(msg))
        .catch(err => res.status(err.code).send(err.msg))
};
