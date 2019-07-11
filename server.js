// const ws = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const clockLinesRouter = require('./routes/clockLines');
const systemConfigRouter = require('./routes/system');
const scheduleRouter = require('./routes/schedule');
const ClockLinesEvents = require('./events/clockLines');
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
setInterval(() => {
    let date = new Date();
    if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
        ClockLinesEvents.emit('addMinute');
    }
    this.oldMinutes = date.getMinutes();
}, 1000);
es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
