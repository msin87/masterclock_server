const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();


const ConfigAPI = require('./API/configAPI.js').ConfigAPI(['system', 'clockLines', 'schedule']);
ConfigAPI.init();
es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended: true})));
es.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


es.get('/config', (req, res) => {
    ConfigAPI.getConfig()
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.get('/config/clockLines', (req, res) => {
    ConfigAPI.getConfig('clockLines')
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.get('/config/clockLines/:id', (req, res) => {
    ConfigAPI.getConfig('clockLines', req.params.id)
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.post('/config/clockLines', (req, res) => {
    ConfigAPI.push('clockLines', req.body)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));

});
es.put('/config/clockLines', (req, res) => {
    ConfigAPI.update('clockLines', req.body)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));
});
es.delete('/config/clockLines/:id', (req, res) => {
    ConfigAPI.eraseConfigElementByID('clockLines', req.params.id).then(res.sendStatus(200));
});
//system config section
es.get('/config/system', (req, res) => {
    ConfigAPI.getConfig('system')
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.put('/config/system', (req, res) => {
    ConfigAPI.update('system', req.body)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));
});
// //schedule config section

es.get('/config/schedule/:id', (req, res) => {
    ConfigAPI.getConfig('schedule', req.params.id)
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.get('/config/schedule', (req, res) => {
    ConfigAPI.getConfig('schedule')
        .then(data => res.json(data))
        .catch((err => res.status(404).send(err)));
});
es.put('/config/schedule', (req, res) => {
    ConfigAPI.update('schedule', req.body)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));
});
es.post('/config/schedule', (req, res) => {
    ConfigAPI.push('schedule', req.body)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));
});
es.delete('/config/schedule/:id', (req, res) => {
    ConfigAPI.eraseConfigElementByID('schedule', req.params.id)
        .then(msg => res.status(200).send(msg))
        .catch((err => res.status(400).send(err)));
});

es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
