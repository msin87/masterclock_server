const Emitter = require('events');
const ClockLinesModel = require('../config/models/clockLines');
const MINUTE = 60 * 1000;
let emitter = new Emitter();

emitter.on('addMinute', async (ws) => {
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
        if (ws)
            ws.send(JSON.stringify(newLines));

    }
    catch (err) {
        console.log(err);
    }
});


module.exports = emitter;