let systemDate = () => new Date(Date.now());
let getMinutes =date => date.getUTCHours() * 60 + date.getUTCMinutes();
let getUTCHoursFromDate = time => time.getUTCHours() % 12 || 12;
let get12UTCDiffMinutes = lineDate => getUTCHoursFromDate(systemDate()) * 60 + systemDate().getUTCMinutes() -
    (getUTCHoursFromDate(lineDate) * 60 + lineDate.getUTCMinutes());
let get24UTCDiffMinutes= lineDate => getMinutes(systemDate()) - getMinutes(lineDate);

module.exports = {
    getTime: (unixTime) => {
        let date = new Date(unixTime);
        let hours = ('0' + date.getHours()).substr(-2);
        let minutes = ('0' + date.getMinutes()).substr(-2);
        return (hours + ':' + minutes);
    },
    formatUTC12h: {
        getDiffMinutes: get12UTCDiffMinutes
    },
    formatUTC24h: {
        getDiffMinutes:get24UTCDiffMinutes,
    }
};