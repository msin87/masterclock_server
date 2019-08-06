const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const stm32API = require('../API/stm32API');
const SystemConfig = require('../config/models/system');
const dtLib = require('../lib/datetime');
const EVENT_LOOP_TIME = 3000;
const events = new (require('events'));
const storeMinuteAdd = async (id) => {
    let lines = await ClockLinesConfig.all();
    let newLines;
    if (id >= 0) {
        newLines = await Actions.addMinute(lines.filter(line => line.id === id));
        await ClockLinesConfig.update(newLines[0], id);
    }
    else {
        newLines = await Actions.addMinute(lines);
        await ClockLinesConfig.update(newLines);
    }
    return newLines;

};
const Emitter = {
    events,
    storeMinuteAdd,
    startArrowsTick: () => new Promise(resolve => {
        if (!this.timer) {
            this.timer = setInterval(async () => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    this.oldMinutes = date.getMinutes();
                    events.emit('minuteAddTick', await ClockLinesConfig.all());
                }
                this.oldMinutes = date.getMinutes();
            }, EVENT_LOOP_TIME);
            resolve('EVENT: Success! Minute Tick started');
        }
        else {
            resolve('EVENT: Warning! Minute Tick is already started');
        }
    }),
    stopMinuteTick: () => {
        if (this.timer) clearInterval(this.timer);
        console.log('EVENT: Success! Minute Tick stopped')
    },
    tuneArrows: async (id) => {
        const lines = await ClockLinesConfig.all();
        const filteredLines = lines.filter(line => line.status === 'RUN');
        const linesTime = filteredLines.map(line => {
            const hours = Number(`${line['time']}`.slice(0, 2));
            const zone = Number(line['zone'].match(/[+-]\d{1,2}/)[0]);
            let utcHours = hours - zone;
            if (utcHours < 0) utcHours += 24;
            return {
                id: line.id,
                time: {
                    getHours: () => Number(`${line['time']}`.slice(0, 2)),
                    getMinutes: () => Number(`${line['time']}`.slice(3)),
                    getUTCHours: () => utcHours
                }
                //getHours: ()=> new Date(`Sat Jun 08 2019 ${line['time']}:00 GMT${line['zone'].match(/[+-]\d{1,2}/)[0]}00`)
            }
        });
        if (typeof(id) === 'string' || typeof(id) === 'number') {
            id = +id;
            const filteredIDs = filteredLines.map(line => line.id);
            if (!filteredIDs.filter(val => val === id).length) {
                throw new Error(`LINES TUNE: Line with ID ${id} is not found or not started`);
            }
            else {
                const line = linesTime.filter(lines => lines.id === id)[0];
                const lag = dtLib.getMinutesLag(line.time, 10);
                stm32API.pulseCounter.setPulseCounter([{id: id, ...lag}]);
            }
        }
        else {
            id = filteredLines.map(val => val.id);
            const newLines = linesTime.map((line) => ({id: line.id, ...dtLib.getMinutesLag(line.time, 10)}));

            stm32API.pulseCounter.setPulseCounter(newLines);
        }

        return 'LINES TUNE: Started!'
    }
};

module.exports = Emitter;