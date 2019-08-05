const HEX_PREFIX = '\\\\x';
//emulation for clock lines time, stored in NVRAM:
// id |  time
// 0  | 03:56
// 1  | 20:09
// 2  | 21:09
// 3  | 22:09
const dataStore = data => {
    this.data = this.data||data;
    return {
        get: ()=>
            this.data,
        set: newData=>
            this.data=newData
    }
};
let nvramEmulated = dataStore('0356200921092209');
const removeDots = linesTime => linesTime.reduce((acc, time) =>
    acc + time.split(':').join(''), '');

const nvram_IO = {
    write: async data => {
        nvramEmulated.set(data);
        return nvramEmulated.get();
    },
    read: async () => nvramEmulated.get()
};
const readLinesTime = async () => {
    let data = await nvram_IO.read();
    return data.match(/.{1,4}/g).map(string => string.match(/.{1,2}/g).join(':'));
};
const writeLinesTime= async linesTime => {
    // let data = linesTime.reduce((acc, time) => acc+time.split(':').map(number=>HEX_PREFIX+number).join(''),'');
    await nvram_IO.write(removeDots(linesTime));
    return 'NVRAM: Write success'
};
const nvramAPI = {
    writeLinesTime,
    readLinesTime,
    updateLinesTime: async (linesTime) => {
        let nvramTime = await readLinesTime();
        for (let line of linesTime){
            nvramTime[line.id]=line.time;
        }
       return await writeLinesTime(nvramTime);
    }
};

module.exports = nvramAPI;