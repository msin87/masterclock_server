const Emitter = require('events');
const ClockLinesModel = require('../config/models/clockLines');
const MINUTE = 60 * 1000;
const EVENT_LOOP_TIME = 1000;
let emitter = new Emitter();

emitter.on('addMinute', async () => {
    try {
        let lines = await ClockLinesModel.all();
        let newLines = lines.map((line, id) => {
            if (line['status'] === 'RUN') {
                let date = new Date(Date.parse(`2000-01-01T${line['time']}`) + MINUTE);
                line['time'] = date.toLocaleTimeString().slice(0, 5);
                console.log(`${(new Date()).toLocaleString()} Event: Success! 'addMinute', Clock Line ID = '${id}'`);
                return line;
            }
            else return line;
        });
        await ClockLinesModel.update(newLines);
    }
    catch (err) {
        console.log(err);
    }
});

let Events = {
    startMinuteTick: () => {
        if (!this.timer) {
            this.timer = setInterval(() => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    emitter.emit('addMinute');
                }
                this.oldMinutes = date.getMinutes();
            }, EVENT_LOOP_TIME);
            console.log('EVENT: Success! Minute Tick started')
        }
        else
        {
            console.log('EVENT: Warning! Minute Tick is already started')
        }
    },
    stopMinuteTick: () => {
        if (this.timer) clearInterval(this.timer);
        console.log('EVENT: Success! Minute Tick stopped')
    }
};
module.exports = Events;