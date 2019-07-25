const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const SystemConfig = require('../config/models/system');
const dtLib = require('../lib/datetime');
const EVENT_LOOP_TIME = 3000;
const events = new (require('events'));
let Emitter = {
    events,
    startMinuteTick: () => new Promise(resolve => {
        if (!this.timer) {
            this.timer = setInterval(async () => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    let newLines = await Actions.addMinute((await ClockLinesConfig.all()).filter(line => line.status === 'RUN'));
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
    handleArrows: async (...linesId) => {
        const lines = await ClockLinesConfig.all();
        const filteredLines = lines.filter(line => line.status === 'RUN');
        const linesTime = filteredLines.map(line => new Date(Date
            .parse(`2000-01-01T${line['time']}:00.000${line['zone']
                .match(/[+-]\d{1,2}/)}:00`)));
        linesId = linesId.length ? linesId : filteredLines.map((val) =>
            val.id);
        return linesTime.map((time, index) => (
            {id: linesId[index], ...dtLib.getMinutesLag(time, 10)}));

    }
};

module.exports = Emitter;