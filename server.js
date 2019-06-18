console.log("hello");
const fs = require('fs');
const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const config = {clockLines: []};
const log = console.log;

es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended: true})));

let updateConfigFile = configName => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/config/${configName}.json`, JSON.stringify(config[configName], null, 2), 'utf8', error => {
            if (error) {
                log(error);
                reject(error);
            }
            log(`CONFIG UPDATE: ${configName}.json `);
        });
    })

};

fs.readFile(`./config/clockLines.json`, 'utf8', (err, data) => {
    if (err) log(err + '');
    else {
        let parsedData = JSON.parse(data);
        for (let line of parsedData) {
            if (!line) continue;
            config.clockLines[line.id] = line;
        }
    }
});
fs.readFile(`./config/system.json`, 'utf8', (err, data) => {
    if (err) log(err + '');
    else {
        config.system = JSON.parse(data);
    }
});
fs.readFile(`./config/schedule.json`, 'utf8', (err, data) => {
    if (err) log(err + '');
    else {
        config.schedule = JSON.parse(data).schedule;
    }
});

es.get('/config', (req, res) => {
    res.json(config);
});
es.get('/config/system', (req, res) => {
    res.json(JSON.parse(config.system));
});
es.get('/config/clockLines', (req, res) => {
    res.json(config.clockLines);
});
es.get('/config/clockLines/:id', (req, res) => {

    let line = config.clockLines[Number(req.params.id)];
    if (line) {
        res.json(line);
    }
    else {
        res.sendStatus(404);
    }
});
es.post('/config/clockLines', (req, res) => {
    let request = req.body;
    let id = Number(request.id);
    if (config.clockLines[id]) {
        res.status(400).send(`Clock line with id "${request.id}" is already exist.`);
    }
    else {
        config.clockLines[id] = request;
        updateConfigFile('clockLines').then(res.sendStatus(200));
    }
});
es.put('/config/clockLines', (req, res) => {
    if (!config.clockLines[Number(req.body.id)]) {
        res.status(400).send(`Cannot find clock line with id "${req.body.id}"`);
        return;
    }
    config.clockLines[Number(req.body.id)] = req.body;
    updateConfigFile('clockLines').then(res.sendStatus(200));

});
es.delete('/config/clockLines/:id', (req, res) => {
    config.clockLines[Number(req.params.id)] = null;
    updateConfigFile('clockLines').then(res.sendStatus(200));
});
//system config section


es.listen(3000, () => console.log('Express started at port 3000! Folder: ' + __dirname));
