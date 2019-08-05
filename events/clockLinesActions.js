const getTime = require('../lib/datetime').getTimeString;
const MINUTE = 60 * 1000;

let getAddedTime = (dateString) => getTime(Date.parse(dateString) + MINUTE);
let Events = {
    addMinute: (lines) => {
            return lines.map((line, id) => {
                if (line['status'] === 'RUN') {
                    line['time'] = getAddedTime((`2000-01-01T${line['time']}`));
                    console.log(`${(new Date()).toLocaleString()} Event: Success! 'addMinute', Clock Line ID = '${line['id']}', time = ${line['time']}`);
                    return line;
                }
                else return line;
            });
    }
};
module.exports = Events;