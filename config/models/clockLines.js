const ConfigAPI = require('../../API/configAPI.js');
const ModelFactory = require('../factory/modelfactory');
const NVRAM = require('../../API/nvramAPI');
let ClockLinesConfig = ConfigAPI('clockLines');
let model = ModelFactory(ClockLinesConfig);
const getLinesWOTime = lines => {
    if (Array.isArray(lines)) {
        return lines.map(data => {
            const {time, ...woTime} = data;
            return woTime;
        });
    }
    else{
        const {time, ...woTime} = lines;
        return woTime;
    }
};
module.exports.all = async () => {
    try {
        let config = await model.all();
        let allTime = await NVRAM.readLinesTime();
        return config.map((item, id) => ({...item, time: allTime[id]}));
    }
    catch (err) {
        throw err;
    }

};
module.exports.findById = async (id = 0) => {
    try {
        return {...await model.findById(id), time: await NVRAM.readLinesTime()[id]};
    }
    catch (err) {
        throw err;
    }
};
module.exports.push = async (newData) => {
    try {
        let allTime = await NVRAM.readLinesTime().push(newData['time']);
        allTime.push(newData['time']);
        await NVRAM.writeLinesTime(allTime);
        delete newData['time'];
        return model.push(newData);
    }
    catch (err) {
        throw err
    }
};
module.exports.update = async (newData, id) => {
    const withoutTime = getLinesWOTime(newData);
    try {
        let allTime;
        if (id >= 0) {
            allTime = await NVRAM.readLinesTime();
            allTime[id] = newData.time;
        }
        else {
            allTime = newData.map(line => line.time);
        }
        await NVRAM.writeLinesTime(allTime);

        return model.update(withoutTime, id);
    }
    catch (err) {
        throw new Error(err);
    }
};
module.exports.delete = async (id) => {
    try {
        let allTime = await NVRAM.readLinesTime();
        allTime.splice(+id, 1)
        await NVRAM.writeLinesTime(allTime);
        return model.delete(id);
    }
    catch (err) {
        throw err;
    }
};