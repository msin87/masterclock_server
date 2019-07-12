const HEX_PREFIX='\\\\x';
const nvram_IO = {
    write: async data => console.log(data),
    read: async () => 0x0005011002150320042505300635
};

const nvramAPI = {
    writeLinesTime: async linesTime => {
        let data = linesTime.reduce((acc, time) => acc+time.split(':').map(number=>HEX_PREFIX+number).join(''),'');
        await nvram_IO.write(data);
        return 'NVRAM: Write success'
    },
    readClockLines: async () => {
        let data = await nvram_IO.read();

    }
};

module.exports = nvramAPI;