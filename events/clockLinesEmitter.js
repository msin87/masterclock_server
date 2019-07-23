const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const SystemConfig = require('../config/models/system');
const dtLib = require('../lib/datetime');
const EVENT_LOOP_TIME = 3000;
let Emitter = {
    startMinuteTick: () => new Promise(resolve=>{
        if (!this.timer) {
            this.timer = setInterval(async () => {
                let date = new Date();
                if (this.oldMinutes !== undefined && (date.getMinutes() !== this.oldMinutes)) {
                    let newLines = await Actions.addMinute(await ClockLinesConfig.all());
                    await ClockLinesConfig.update(newLines);
                    resolve({type: 'time', payload: newLines.map(l => l.time)});
                }
                this.oldMinutes = date.getMinutes();
            }, EVENT_LOOP_TIME);
            console.log('EVENT: Success! Minute Tick started')
        }
        else {
            console.log('EVENT: Warning! Minute Tick is already started')
        }
    }),
    stopMinuteTick: () => {
        if (this.timer) clearInterval(this.timer);
        console.log('EVENT: Success! Minute Tick stopped')
    },
    handleArrows: async (socketQueue, linesId) => {
        const {pulse} = (await SystemConfig.all())[0];
        let linesTime = (await ClockLinesConfig.all()).map(line => new Date(Date.parse(`2000-01-01T${line['time']}:00.000${line['zone'].match(/[+-]\d{1,2}/)}:00`)));
        linesId = linesId || linesTime.map((val, id) => id);
        let serialMsg = {
            type: 'linesLag',
            payload: linesId.map(id => ({id, ...dtLib.getMinutesLag(linesTime[id], 10)}))
        };
        let command;
        switch (serialMsg.type) {
            case 'linesLag':
                command = 0x00;
        }

    }
};

module.exports = Emitter;