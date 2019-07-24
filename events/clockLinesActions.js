const getTime = require('../lib/datetime').getTime;
const MINUTE = 60 * 1000;

let getAddedTime = (dateString) => getTime(Date.parse(dateString) + MINUTE);
let Events = {
    addMinute: async (lines) => {
        try {
            return lines.map((line, id) => {
                if (line['status'] === 'RUN') {
                    line['time'] = getAddedTime((`2000-01-01T${line['time']}`));
                    console.log(`${(new Date()).toLocaleString()} Event: Success! 'addMinute', Clock Line ID = '${id}'`);
                    return line;
                }
                else return line;
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};
module.exports = Events;