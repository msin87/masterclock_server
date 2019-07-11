module.exports = Model => ({
    all: (req, res) => {
        Model.all()
            .then(data => res.send(data))
            .catch(err => res.status(err.code).send(err.msg))
    },
    findById: (req, res) => {
        Model.findById(req.params.id)
            .then(data => res.send(data))
            .catch(err => res.status(err.code).send(err.msg));
    },
    push: (req, res) => {
        Model.push(req.body)
            .then(msg => res.send(msg))
            .catch(err => res.status(err.code).send(err.msg));
    },
    update: (req, res) => {
        Model.update(req.body, req.params.id)
            .then(msg => res.send(msg))
            .catch(err => res.status(err.code).send(err.msg))
    },
    delete: (req, res) => {
        Model.delete(req.params.id)
            .then(msg => res.send(msg))
            .catch(err => res.status(err.code).send(err.msg))
    }

});