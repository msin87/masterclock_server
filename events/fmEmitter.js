const SystemConfig = require('../config/models/system');
const FmConfig = require('../config/models/fm');
const FM = require('../API/stm32API').fm;
const MINUTE = 1000 * 60;
const Emitter = {
    startScan: async () => {
        const freqs = (await FmConfig.all()).map(station => station.freq);
        let stationNumber = 0;
        if (!this.timer) {
            this.timer = setInterval(() => {
                FM.setFreq(freqs[stationNumber]);
                stationNumber = stationNumber < freqs.length ? ++stationNumber : 0;
            }, (await SystemConfig.all())[0]['fmScanInterval'])
        }
    },
    stopScan: () => {
        if (this.timer) clearInterval(this.timer);
    }
};
module.exports = Emitter;