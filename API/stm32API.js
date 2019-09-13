const SERIAL_PORT = 'COM8';
const CMD_START = 0x0000;
const CMD_CNT_SET = 0x0001;
const CMD_CNT_INCREASE = 0x0002;
const CMD_CNT_RESET = 0x0003;
const CMD_CNT_SUSPEND = 0x0004;
const CMD_CNT_RESUME = 0x0005;
const CMD_PULSE_WIDTH = 0x0006;
const CMD_PULSE_POL = 0x0007;
const CMD_RELAY_SET = 0x0008;
const CMD_FM_POWER = 0x0F00;
const CMD_FM_SET_FREQ = 0x0F01;
const CMD_FM_SEEK = 0x0F02;
const RESP_CNT = 0x0001;
const RESP_ADC_LINES = 0x0002;
const RESP_LINES_POL = 0x0007;
const RESP_FM_TEXTA0 = 0x0F00;
const RESP_FM_TEXTA1 = 0x0F01;
const RESP_FM_TEXTA2 = 0x0F02;
const RESP_FM_TEXTB0 = 0x0F10;
const RESP_FM_TEXTB1 = 0x0F11;
const RESP_FM_TIME = 0x0F03;
const RESP_FM_TUNE_STATUS = 0x0F04;
const HEADDATA_SIZE = 28;
const CRC_SIZE = 4;
const HEAD_BYTES = 4;
const ADC_MULT = 3 / 255; // Vref/255
const CURRENT_MULT_MA = 1000;
const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const buffer_crc32 = require('buffer-crc32');
const nvramAPI = require('../API/nvramAPI');
const Events = require('events');
const events = new Events;
let RDS_Data= {PI:0,freq:0,text:'',time:0};
const getIDs = (data) => {
    const idField = (data.readUInt8(2) << 8) | data.readUInt8(3);
    const IDs = [];
    for (let i = 0; i < 16; i++) {
        if ((1 << i) & idField) {
            IDs.push({id: i})
        }
    }
    return IDs;
};
const serialPort = new SerialPort(SERIAL_PORT, {baudRate: 115200});
const serialPipe = serialPort.pipe(new ByteLength({length: 32}));
const responses = {
    pulseCounters: (data) => {
        const IDs = getIDs(data);
        return IDs.map((val, index) => ({id: IDs[index].id, pulseCounter: data.readUInt16BE(4 + 2 * index)}));
    },
    currentConsumption: (data) => {
        const IDs = getIDs(data);
        return IDs.map((val, index) => ({id: IDs[index].id, currentConsumption: data.readUInt16BE(4 + 2 * index)}
        ));
    },
    fmText0: (data) => {
        RDS_Data.PI = data.readUInt16BE(2);
        RDS_Data.text = data.toString('ascii', 4).replace(/[\n\r]+/g,'');
    },
    fmText12: (data) => {
        RDS_Data.freq = data.readUInt16BE(2);
        RDS_Data.text += data.toString('ascii', 4).replace(/[\n\r]+/g,'');
        return RDS_Data
    },
    fmTuneStatus: (data) => {

    }
    ,
    fmTime: (data) => {
        const year=data.readUInt16BE(6);
        const month=data.readUInt16BE(8);
        const day = data.readUInt16BE(10);
        const hours = data.readUInt16BE(12);
        const minutes = data.readUInt16BE(14);
        const timeZone = data.readUInt16BE(16);
        const time = new Date(2000+year,month,day,hours+timeZone,minutes,0,0);
        RDS_Data.PI = data.readUInt16BE(2);
        RDS_Data.freq = data.readUInt16BE(4);
        RDS_Data.time = time.getTime();
        return RDS_Data;
    }
};

const responseParser = income => {
    const data = income.slice(0, 28);
    const cmd = income.readUInt16BE(0);
    const date = new Date().toLocaleString();
    let payload;

    switch (cmd) {
        case RESP_CNT:
            payload = responses.pulseCounters(data);
            // console.log(`${date}: ${SERIAL_PORT}: Pulse counter: ID=${payload[0].id}, pulses: ${payload[0]['pulseCounter']} `);
            events.emit('response', {type: 'pulseCounter', payload});
            break;
        case RESP_ADC_LINES:
            payload = responses.currentConsumption(data);
            // console.log(`${date}: ${SERIAL_PORT}: Current sensor: ID=${payload[0].id}, current: ${payload[0]['currentConsumption']} mA `);
            events.emit('response', {type: 'currentConsumption', payload});
            break;
        case RESP_FM_TEXTA0:
            responses.fmText0(data);
            break;
        case RESP_FM_TEXTA1:
            responses.fmText12(data);
            break;
        case RESP_FM_TEXTA2:
            payload = responses.fmText12(data);
            events.emit('response', {type: 'fmTextA', payload});
            break;
        case RESP_FM_TEXTB0:
            payload = responses.fmText0(data);
            break;
        case RESP_FM_TEXTB1:
            payload = responses.fmText12(data);
            events.emit('response', {type: 'fmTextB', payload});
            break;
        case RESP_FM_TUNE_STATUS:
            payload = responses.fmTuneStatus(data);
            events.emit('response', {type: 'fmTuneStatus', payload});
            break;
        case RESP_FM_TIME:
            payload = responses.fmTime(data);
            events.emit('response', {type: 'fmTime', payload});
            break;

    }
};
serialPipe.on('data', data => {
    if (!Buffer.compare(buffer_crc32(data.slice(0, 28)), data.slice(28))) {
        responseParser(data);
    }

});
const makeHead = (cmd, lines) => {
    const buffer = Buffer.alloc(HEAD_BYTES);
    let idMask = 0;
    buffer.writeUInt16BE(cmd, 0);
    if (lines !== undefined)
        lines.forEach((line) => {
            idMask |= 1 << line.id;
        });
    buffer.writeUInt16BE(idMask, 2);
    return buffer;
};
const makeData_u16 = (data = [0]) => {
    const buffer = Buffer.alloc(data.length * 2);
    if (Array.isArray(data)) {
        data.forEach((val, index) => {
            buffer.writeUInt16BE(val, index * 2);
        });
    }
    return buffer;
};
const makeData_u8 = (data = [0]) => {
    const buffer = Buffer.alloc(data.length);
    if (Array.isArray(data)) {
        data.forEach((val, index) => {
            buffer.writeUInt8(val, index);
        });
    }
    return buffer;
};

const logCb = (err) => err ?
    console.log(err.message) :
    console.log(`${(new Date()).toLocaleString()} ${SERIAL_PORT}: data sent.`);
const send = (port, buffer) => {
    const out = Buffer.concat([buffer, buffer_crc32(buffer)])
    port.write(out, HEADDATA_SIZE + CRC_SIZE);
};
const makeHeadDataBuffer = (cmd, lines, data, type = 16) =>
    Buffer.concat([makeHead(cmd, lines), type === 16 ? makeData_u16(data) : makeData_u8(data)], HEADDATA_SIZE);
const API = {
    restart: () => {
        const buffer = Buffer.alloc(HEADDATA_SIZE);
        send(serialPort, buffer);
    },
    setPulseWidth: lines => {
        const CMD = 0x06;
        send(serialPort, makeHeadDataBuffer(CMD, lines, lines.map(line => line.width / 250 - 1), 8));
    },
    events: events,
    pulseCounter: {
        setPulseCounter: (lines) => {
            const CMD = 0x01;
            const correctedTime = lines.map(line => ({
                id: line.id,
                time: `0${line.correctedLineTime.hours}`.substr(-2) + ':' + `0${line.correctedLineTime.minutes}`.substr(-2)
            }));
            nvramAPI.updateLinesTime(correctedTime);
            lines = lines.filter(val =>
                val.diff >= 0);
            send(serialPort, makeHeadDataBuffer(CMD, lines, lines.map(line => line.diff)));
        },
        incrementPulseCounter: (lines) => {
            const CMD = 0x02;
            send(serialPort, makeHeadDataBuffer(CMD, lines));
        },
        resetPulseCounter: (lines) => {
            const CMD = 0x03;
            send(serialPort, makeHeadDataBuffer(CMD, lines));
        },
        suspendPulseCounter: (lines) => {
            const CMD = 0x04;
            send(serialPort, makeHeadDataBuffer(CMD, lines));
        },
        resumePulseCounter: (lines) => {
            const CMD = 0x05;
            send(serialPort, makeHeadDataBuffer(CMD, lines));
        }
    },
    fm: {
        setFreq: freq => {
            send(serialPort, makeHeadDataBuffer(CMD_FM_SET_FREQ, undefined, [freq]));
        }
    }
};

// //emulator section
// const STM32_EMU = require('../STM32_EMU/stm32_emulator');
// const getRandomCurrent = (min, max) => Math.floor(Math.random() * (max - min)) + min;
// const Counters = () => {
//     let counters = [];
//     return {
//         set: (id, value) => counters[id] = value,
//         get: (id) => id >= 0 ? counters[id] : counters,
//         decrement: id => {
//             if (id >= 0) {
//                 counters[id] > 0 ? counters[id] -= 1 : 0;
//             }
//             else {
//                 counters = counters.map(val => val > 0 ? val - 1 : val);
//             }
//         },
//         isEmpty: id => !counters[id],
//         increment: id => {
//             if (id >= 0) {
//                 counters[id]++;
//             }
//             else {
//                 counters = counters.map(val => val + 1);
//             }
//         }
//     }
// };
// const Pulse = () => {
//     const width = 500;
//     let pulseTimers = [];
//     const stopTuning = id => {
//         if (id >= 0) {
//             clearInterval(pulseTimers[id]);
//             delete pulseTimers[id];
//         }
//         else {
//             pulseTimers.forEach(timer => clearInterval(timer));
//             pulseTimers = [];
//         }
//     };
//     const tune = id => {
//         pulseTimers[id] = setInterval(() => {
//             counters.decrement(id);
//             send(STM32_EMU.serialPort, makeHeadDataBuffer(0x01, [{id}], [counters.get(id)]));
//             send(STM32_EMU.serialPort, makeHeadDataBuffer(0x02, [{id}], [getRandomCurrent(120, 160)], 8));
//             if (counters.isEmpty(id)) {
//                 stopTuning(id)
//             }
//         }, width)
//     };
//     return {
//         startTuning: () => {
//             counters.get().forEach((counter, id) => {
//                 clearInterval(counter);
//                 tune(id);
//             })
//         },
//         onePulse: (id) => {
//             counters.increment(id);
//             if (!pulseTimers[id]) {
//                 tune(id);
//             }
//         }
//     }
// };
//
// const counters = Counters();
// const pulse = Pulse();
//
// const emuResponseParser = income => {
//     const cmd = income.readUInt8(0);
//
//     switch (cmd) {
//         case 0x00:
//             send(STM32_EMU.serialPort, makeHeadDataBuffer(cmd, 0));
//             break;
//         case 0x01:
//             getIDs(income).forEach((line, index) => {
//                 counters.set(line.id, income.readUInt16BE(4 + 2 * index));
//             });
//             pulse.startTuning();
//             break;
//         case 0x02:
//             getIDs(income).forEach(line => {
//                 pulse.onePulse(line.id)
//             });
//             break;
//     }
// };
// STM32_EMU.serialPipe.on('data', data => {
//     if (!Buffer.compare(buffer_crc32(data.slice(0, 29)), data.slice(29))) {
//         emuResponseParser(data);
//     }
//
// });

module.exports = API;
// serialPort.write(JSON.stringify(serialMsg),err=>{
//     if (err)
//     {
//         return console.log(err.message);
//     }
//     console.log('COM6 written');
// })