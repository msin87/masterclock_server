const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const SystemConfig = require('../config/models/system');
const EVENT_LOOP_TIME = 3000;
let getDiff = (lineDate,waitMinutes=10)=>{
    let correctedLineTime={hours:lineDate.getHours(), minutes:lineDate.getMinutes()};
    let get12hFromDate = (time) => time.getUTCHours()%12 || 12;
    let systemDate=new Date(Date.now());
    let lineUTCHours12=get12hFromDate(lineDate);
    let systemUTCHours12=get12hFromDate(systemDate);
    let diffMin12=systemUTCHours12*60+systemDate.getUTCMinutes()-(lineUTCHours12*60+lineDate.getUTCMinutes());

    if (diffMin12<-waitMinutes)
    {
        diffMin12 = 720 + diffMin12;
    }
    let systemMinutes=systemDate.getUTCHours()*60+systemDate.getUTCMinutes();
    let lineMinutes=lineDate.getUTCHours()*60+lineDate.getUTCMinutes();
    if ((systemMinutes - lineMinutes >= 720))
    {
        correctedLineTime.hours += 12;
    }
    else
    if ((systemMinutes - lineMinutes) >= -720 && (systemMinutes - lineMinutes) < -waitMinutes)
    {
        correctedLineTime.hours+=12;
        if (correctedLineTime.hours < 0) correctedLineTime.hours = -correctedLineTime.hours;
    }
    correctedLineTime.hours%=24;
    return {diff:diffMin12, correctedLineTime};
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
                    socketQueue.push({type:'time',payload: newLines.map(l=>l.time)});
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
        const {pulse}=(await SystemConfig.all())[0];
        let linesTime = (await ClockLinesConfig.all()).map(line=>new Date(Date.parse(`2000-01-01T${line['time']}:00.000${line['zone'].match(/[+-]\d{1,2}/)}:00`)));
        let localTime = Date.now();
        let test = linesTime[1].getHours();
    }
};

module.exports = Emitter;