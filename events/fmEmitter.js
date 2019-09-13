const SystemConfig = require('../config/models/system');
const FmConfig = require('../config/models/fm');
const FM = require('../API/stm32API').fm;
const crc32 = require('crc-32');
const MINUTE = 1000 * 60;
const Emitter = {
    startScan: async () => {
        const freqs = (await FmConfig.all()).map(station => station.freq);
        const scanOrder=(await SystemConfig.all())[0]['fmScanOrder'];
        let order = 0;
        if (scanOrder.length===0) return;   //No tuning or FM off
        if (scanOrder.length===1) {
            FM.setFreq(freqs[scanOrder[order]]);
        }
        if (!this.timer) {
            this.timer = setInterval(() => {
                FM.setFreq(freqs[scanOrder[order]]);
                order++;
                if (order>scanOrder.length-1)
                    order=0;
            }, (await SystemConfig.all())[0]['fmScanInterval'])
        }
    },
    stopScan: () => {
        if (this.timer) clearInterval(this.timer);
    },
    saveText: async (RDS_Data) => {
        const crcNew = crc32.str(RDS_Data.payload.text);
        const stationsRT = (await FmConfig.all()).map(station => station['RT']);
        let test =1;
        test++;
    }
};
module.exports = Emitter;