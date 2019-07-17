const Actions = require('./clockLinesActions');
const ClockLinesConfig = require('../config/models/clockLines');
const SystemConfig = require('../config/models/system');
const EVENT_LOOP_TIME = 3000;
let getDiff = (time)=>{
    /* from C library https://github.com/msin87/masterclock/blob/master/Src/lines.c
    uint16_t get_sTimeLinesDiff(Lines* lineToCheck, uint8_t waitMinutes)
{
	int16_t diff_Min12 = 0;
	uint8_t sHour12 = 0, lHour12 = 0;
	int16_t sMinutes = 0, lMinutes = 0;
	sHour12 = hoursToUTC(sTime.Hours, masterClock.daylightSaving->timeZone) % 12;
	if (sHour12 == 0)
	{
		sHour12 = 12;
	}
	lHour12 = hoursToUTC(lineToCheck->Hours, lineToCheck->TimeZone) % 12;
	if (lHour12 == 0)
	{
		lHour12 = 12;
	}
	diff_Min12 = sHour12 * 60 + sTime.Minutes - (lHour12 * 60 + lineToCheck->Minutes);

	if (diff_Min12 < -waitMinutes)
	{

		diff_Min12 = 720 + diff_Min12;
	}
	sMinutes = hoursToUTC(sTime.Hours, masterClock.daylightSaving->timeZone) * 60 + sTime.Minutes;
	lMinutes = hoursToUTC(lineToCheck->Hours, lineToCheck->TimeZone) * 60 + lineToCheck->Minutes;
	if ((sMinutes - lMinutes >= 720))
	{
		lineToCheck->Hours += 12;
	}
	else
		if ((sMinutes - lMinutes) >= -720 && (sMinutes - lMinutes) < -waitMinutes)
	{
		lineToCheck->Hours += 12;
		if (lineToCheck->Hours < 0) lineToCheck->Hours = -lineToCheck->Hours;
	}
	lineToCheck->Hours %= 24;
	return diff_Min12;
}
     */

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