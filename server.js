// const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();
// const SystemConfig = require('./controllers/system');
const ClockLines = require('./models/clockLines');
// const Schedule = require('./controllers/schedule');
// const AllConfig = require('./controllers/config');

es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended: true})));
es.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// es.get('/config', AllConfig.all);
//
// //clock lines section
// es.get('/config/clockLines', ClockLines.all);
// es.get('/config/clockLines/:id', ClockLines.findById);
// es.post('/config/clockLines', ClockLines.push);
// es.put('/config/clockLines/:id', ClockLines.update);
// es.delete('/config/clockLines/:id', ClockLines.delete);
//
// //system config section
// es.get('/config/system', SystemConfig.all);
// es.put('/config/system', SystemConfig.update);
//
// //schedule config section
// es.get('/config/schedule', Schedule.all);
// es.get('/config/schedule/:id', Schedule.findById);
// es.post('/config/schedule', Schedule.push);
// es.put('/config/schedule/:id', Schedule.update);
// es.delete('/config/schedule/:id', Schedule.delete);
//

es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
