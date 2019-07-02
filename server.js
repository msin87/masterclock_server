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
    res.json(ConfigAPI.getConfig());
});
es.get('/config/clockLines', (req, res) => {
    res.json(ConfigAPI.getConfig('clockLines'));
    console.log('REQUEST: clockLines',req.body);
});
es.get('/config/clockLines/:id', (req, res) => {
    let line = ConfigAPI.getConfig('clockLines', req.params.id);
    line ? res.json(line) : res.sendStatus(404);
});
es.post('/config/clockLines', (req, res) => {
    ConfigAPI.getConfig('clockLines', req.body.id) ?
        res.status(400).send(`Clock line with id "${req.body.id}" is already exist.`)
        : ConfigAPI.updateConfig('clockLines', req.body).then(res.sendStatus(200));

});
es.put('/config/clockLines', (req, res) => {
    ConfigAPI.getConfig('clockLines', req.body.id) ?
        ConfigAPI.updateConfig('clockLines', req.body).then(res.sendStatus(200))
        : res.status(404).send(`Cannot find clock line with id "${req.body.id}"`);
});
es.delete('/config/clockLines/:id', (req, res) => {
    ConfigAPI.eraseConfigElementByID('clockLines', req.params.id).then(res.sendStatus(200));
});
//system config section
es.get('/config/system', (req, res) => {
    res.json(ConfigAPI.getConfig('system'));
});
es.put('/config/system', (req, res) => {
    ConfigAPI.updateConfig('system', req.body).then(res.sendStatus(200));
});
// //schedule config section

es.get('/config/schedule/:id', (req, res) => {
    let schedule=ConfigAPI.getConfig('schedule', req.params.id);
    schedule?res.json(schedule):res.sendStatus(404);
});
es.get('/config/schedule', (req, res) => {
    res.json(ConfigAPI.getConfig('schedule'));
});
es.put('/config/schedule', (req, res) => {
    ConfigAPI.getConfig('schedule', req.body.id)?
        ConfigAPI.updateConfig('schedule', req.body).then(res.sendStatus(200))
        : res.status(404).send(`Cannot find schedule with id "${req.body.id}"`);
});
es.post('/config/schedule', (req, res) => {
    if (ConfigAPI.getConfig('schedule', req.body.id)) {
        res.status(400).send(`Schedule with id '${req.body.id}' is already exist.`);
    }
    else if ((+req.body.id) >= +ConfigAPI.getConfig('system')['maxScheduleEvents']) {
        res.status(400).send('Maximum schedule events is reached');
    }
    else {
        ConfigAPI.updateConfig('schedule', req.body).then(res.sendStatus(200));
    }
});
es.delete('/config/schedule/:id', (req, res) => {
    ConfigAPI.eraseConfigElementByID('schedule',req.params.id).then(res.sendStatus(200));
});

es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
