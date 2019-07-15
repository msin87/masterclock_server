const HEX_PREFIX='\\\\x';
let dataEmulated='0005011002150320';
const nvram_IO = {
    write: async data => dataEmulated=data,
    read: async () => dataEmulated
};

const nvramAPI = {
    writeLinesTime: async linesTime => {
       // let data = linesTime.reduce((acc, time) => acc+time.split(':').map(number=>HEX_PREFIX+number).join(''),'');
        let data = linesTime.reduce((acc, time) => acc+time.split(':').map(number=>HEX_PREFIX+number).join(''),'');

        await nvram_IO.write(data);
        return 'NVRAM: Write success'
    },
    readLinesTime: async () => {
        let data = await nvram_IO.read();
        return data.match(/.{1,4}/g).map(string=>string.match(/.{1,2}/g).join(':'));
    }
};

module.exports = nvramAPI;