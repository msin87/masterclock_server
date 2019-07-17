const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const SystemConfig = require('../config/models/system');
const dtLib = require('../lib/datetime');
const EVENT_LOOP_TIME = 3000;
let getDiff = (lineDate, waitMinutes = 10) => {
    let correctedLineTime = {hours: lineDate.getHours(), minutes: lineDate.getMinutes()};
    let diffMin12 = dtLib.formatUTC12h.getDiffMinutes(lineDate); //get diff (system 12hTime - line 12hTime) in minutes
    let diffMin24 = dtLib.formatUTC24h.getDiffMinutes(lineDate); //get diff (system 24hTime - line 24hTime) in minutes
    diffMin12 = (diffMin12 < -waitMinutes) ? 720 + diffMin12 : diffMin12;
    if (diffMin24 >= 720) {
        correctedLineTime.hours += 12;
    }
    else if (diffMin24 >= -720 && diffMin24 < -waitMinutes) {
        correctedLineTime.hours += 12;
    }
    correctedLineTime.hours %= 24;
    return {diff: diffMin12, correctedLineTime};
};
let Emitter = {
    startMinuteTick: (socketQueue) => {
        if (!this.timer) {
            this.timer = setInterval(async () => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    let lines = await ClockLinesConfig.all();
                    let newLines = await Actions.addMinute(lines);
                    await ClockLinesConfig.update(newLines);
                    socketQueue.push({type: 'time', payload: newLines.map(l => l.time)});
                }
                this.oldMinutes = date.getMinutes();
            }, EVENT_LOOP_TIME);
            console.log('EVENT: Success! Minute Tick started')
        }
        else {
            console.log('EVENT: Warning! Minute Tick is already started')
        }
    },
    stopMinuteTick: () => {
        if (this.timer) clearInterval(this.timer);
        console.log('EVENT: Success! Minute Tick stopped')
    },
    handleArrows: async (socketQueue) => {
        clearInterval(this.timer);
        const {pulse} = (await SystemConfig.all())[0];
        let linesTime = (await ClockLinesConfig.all()).map(line => new Date(Date.parse(`2000-01-01T${line['time']}:00.000${line['zone'].match(/[+-]\d{1,2}/)}:00`)));
        let diff = getDiff(linesTime[0], 10);
        console.log(diff);
    }
};

module.exports = Emitter;