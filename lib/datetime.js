let systemDate = () => new Date(Date.now());
let getMinutes =date => date.getUTCHours() * 60 + date.getUTCMinutes();
let getUTCHoursFromDate = time => time.getUTCHours() % 12 || 12;
let get12UTCDiffMinutes = lineDate => getUTCHoursFromDate(systemDate()) * 60 + systemDate().getUTCMinutes() -
    (getUTCHoursFromDate(lineDate) * 60 + lineDate.getUTCMinutes());
let get24UTCDiffMinutes= lineDate => getMinutes(systemDate()) - getMinutes(lineDate);
let getMinutesLag = (lineDate, waitMinutes = 10) => {
    let correctedLineTime = {hours: lineDate.getHours(), minutes: lineDate.getMinutes()};
    let diffMin12 = get12UTCDiffMinutes(lineDate); //get diff (system 12hTime - line 12hTime) in minutes
    let diffMin24 = get24UTCDiffMinutes(lineDate); //get diff (system 24hTime - line 24hTime) in minutes
    diffMin12 = (diffMin12 < -waitMinutes) ? 720 + diffMin12 : diffMin12;
    if (diffMin24 >= 720) {
        correctedLineTime.hours += 12;
    }
    else if (diffMin24 >= -720 && diffMin24 < -waitMinutes) {
        correctedLineTime.hours += 12;
    }
    correctedLineTime.hours %= 24;
    return {diff: diffMin12, correctedLineTime};
};
module.exports = {
    getTime: (unixTime) => {
        let date = new Date(unixTime);
        let hours = ('0' + date.getHours()).substr(-2);
        let minutes = ('0' + date.getMinutes()).substr(-2);
        return (hours + ':' + minutes);
    },
    getMinutesLag
};