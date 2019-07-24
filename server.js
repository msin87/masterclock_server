const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const clockLinesRouter = require('./routes/clockLines');
const systemConfigRouter = require('./routes/system');
const scheduleRouter = require('./routes/schedule');
const ClockLinesActions = require('./Events/clockLinesEmitter');
const ws = require('./websocket/websocket');
const stm32API = require('./API/stm32API');
es.use(bodyParser.json());
es.use(bodyParser.urlencoded(({extended: true})));
es.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

es.use(clockLinesRouter);
es.use(systemConfigRouter);
es.use(scheduleRouter);
ClockLinesActions.startMinuteTick().then(msg => ws.sendJsonToUI(msg));
ClockLinesActions.handleArrows().then(counters => stm32API.pulseCounter.incrementPulseCounter(counters));

es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
