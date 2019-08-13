const SERIAL_PORT = 'COM6';
const HEADDATA_SIZE = 28;
const CRC_SIZE=4;
const HEAD_BYTES = 4;
const ADC_MULT = 3 / 255; // Vref/255
const CURRENT_MULT_MA = 1000;
const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const buffer_crc32 = require('buffer-crc32');
const nvramAPI = require('../API/nvramAPI');
const Events = require('events');
const events = new Events;

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
const serialPort = new SerialPort(SERIAL_PORT, {baudRate: 57600});
const serialPipe = serialPort.pipe(new ByteLength({length: 33}));
const responses = {
    pulseCounters: (data) => {
        const IDs = getIDs(data);
        return IDs.map((val, index) => ({id: IDs[index].id, pulseCounter: data.readUInt16BE(4 + 2 * index)}));
    },
    currentConsumption: (data) => {
        const IDs = getIDs(data);
        return IDs.map((val, index) => ({id: IDs[index].id, currentConsumption: data.readUInt16BE(4 + 2 * index)}
        ));
    }
};

const responseParser = income => {
    const data = income.slice(0, 28);
    const cmd = income.readUInt16BE(0);
    const date = new Date().toLocaleString();
    let payload;

    switch (cmd) {
        case 0x01:

            payload = responses.pulseCounters(data);
            // console.log(`${date}: ${SERIAL_PORT}: Pulse counter: ID=${payload[0].id}, pulses: ${payload[0]['pulseCounter']} `);
            events.emit('response', {type: 'pulseCounter', payload});
            break;
        case 0x02:
            payload = responses.currentConsumption(data);
            // console.log(`${date}: ${SERIAL_PORT}: Current sensor: ID=${payload[0].id}, current: ${payload[0]['currentConsumption']} mA `);
            events.emit('response', {type: 'currentConsumption', payload});
            break;

    }
};
serialPipe.on('data', data => {
    if (!Buffer.compare(buffer_crc32(data.slice(0, 29)), data.slice(29))) {
        responseParser(data);
    }

});
const makeHead = (cmd, lines) => {
    const buffer = Buffer.alloc(HEAD_BYTES);
    let idMask = 0;
    buffer.writeUInt16BE(cmd, 0);
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
    port.write(Buffer.concat([buffer, buffer_crc32(buffer)], HEADDATA_SIZE + CRC_SIZE));
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
            const correctedTime=lines.map(line=>({
                id:line.id,
                time: `0${line.correctedLineTime.hours}`.substr(-2)+':'+`0${line.correctedLineTime.minutes}`.substr(-2)
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