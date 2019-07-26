const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const stm32API = require('../API/stm32API');
const SystemConfig = require('../config/models/system');
const dtLib = require('../lib/datetime');
const EVENT_LOOP_TIME = 3000;
const events = new (require('events'));
const minutePassed = (timer => {
    if (timer) {
        timer = setInterval
    }
})();
let Emitter = {
    events,
    startArrowsTick: () => new Promise(resolve => {
        if (!this.timer) {
            this.timer = setInterval(async () => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    let newLines = await Actions.addMinute(await ClockLinesConfig.all());
                    await ClockLinesConfig.update(newLines);
                    events.emit('minuteAddTick', newLines);
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
        const linesTime = filteredLines.map(line =>
            new Date(Date
                .parse(`2000-01-01T${line['time']}:00.000${line['zone']
                    .match(/[+-]\d{1,2}/)}:00`)));
        if (typeof(id)==='string'||typeof(id)==='number') {
            id=+id;
            const filteredIDs=filteredLines.map(line=>line.id);

            if (!filteredIDs.filter(val=>val===id)){
              throw new Error(`LINES TUNE: Line with ID ${id} is not found or not started`);
            }
            else{
                stm32API.pulseCounter.setPulseCounter({id: id, ...dtLib.getMinutesLag(linesTime[id], 10)});
            }
        }
        else {
            id = filteredLines.map(val => val.id);
            stm32API.pulseCounter.setPulseCounter(linesTime.map((time, index) => ({id: id[index], ...dtLib.getMinutesLag(time, 10)})));
        }

        return 'LINES TUNE: Started!'
    }
};

module.exports = Emitter;