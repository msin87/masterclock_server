const Emitter = require('events');
const ClockLinesModel = require('../config/models/clockLines');
const MINUTE = 60 * 1000;
let emitter = new Emitter();

emitter.on('addMinute', () => {
    ClockLinesModel.all()
        .then(lines => {
            let newLines = lines.map((line, id) => {
                if (line['status'] === 'RUN') {
                    let date = new Date(Date.parse(`2000-01-01T${line['time']}`) + MINUTE);
                    line['time'] = date.toLocaleTimeString().slice(0, 5);
                    console.log(`${(new Date()).toLocaleString()} Event: addMinute to Clock Line ID = '${id}'`);
                    return line;
                }
                else return line;

            });
            ClockLinesModel.update(newLines);


        })
        .catch(console.log);

});
module.exports = emitter;