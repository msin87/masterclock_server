const express = require('express');
const bodyParser = require('body-parser');
const es = express();
const clockLinesRouter = require('./routes/clockLines');
const systemConfigRouter = require('./routes/system');
const scheduleRouter = require('./routes/schedule');
const fmRouter = require('./routes/fm');
const ClockLines = require('./Events/clockLinesEmitter');
const FM = require('./Events/fmEmitter');
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
es.use(fmRouter);

ClockLines.tuneArrows().then(
    console.log);
ClockLines.startArrowsTick().then(
    console.log);
FM.startScan();

ClockLines.events.on('minuteAddTick', lines => {

    console.log('tick');
    stm32API.pulseCounter.incrementPulseCounter(lines.filter(line => line.status === 'RUN'));
});

stm32API.events.on('response', async data => {
    switch (data.type) {
        case 'pulseCounter':
            const newLines=await ClockLines.storeMinuteAdd(data.payload[0].id);
            ws.sendToUI({type: 'time', payload: newLines});
            break;
        case 'fmTextA':
            await FM.saveText(data);
            break;
        case 'fmTextB':
            break;
        case 'fmTuneStatus':
            break;
        case 'fmTime':
            break;
        default:
            break;
    }
    ws.sendToUI(data);
});
es.listen(3001, () => console.log('Express started at port 3001! Folder: ' + __dirname));
