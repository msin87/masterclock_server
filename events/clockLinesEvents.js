const Events = require('events');
const ClockLinesModel = require('../config/models/clockLines');
const MINUTE = 60 * 1000;
let events = new Events();
let getAddedTime = (dateString) => {
    let date = new Date(Date.parse(dateString) + MINUTE);
    let hours = ('0' + date.getHours()).substr(-2);
    let minutes = ('0' + date.getMinutes()).substr(-2);
    return (hours + ':' + minutes);
};
events.on('addMinute', async (ws) => {
    try {
        let lines = await ClockLinesModel.all();
        let newLines = lines.map((line, id) => {
            if (line['status'] === 'RUN') {
                line['time'] = getAddedTime((`2000-01-01T${line['time']}`));
                console.log(`${(new Date()).toLocaleString()} Event: Success! 'addMinute', Clock Line ID = '${id}'`);
                return line;
            }
            else return line;
        });
        if (ws) ws.send(JSON.stringify({clockLines: newLines}));
        await ClockLinesModel.update(newLines);
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = events;