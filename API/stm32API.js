const SERIAL_PORT = 'COM6';
const HEADDATA_SIZE = 29;
const HEAD_BYTES = 3;
const ADC_MULT = 3 / 255; // Vref/255
const CURRENT_MULT_MA = 1000;
const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const buffer_crc32 = require('buffer-crc32');
const Events = require('events');
const events = new Events;

const serialPort = new SerialPort(SERIAL_PORT, {baudRate: 57600});
const serialPipe = serialPort.pipe(new ByteLength({length: 33}));
const Responses = () => {
    let getIDs = (data) => {
        const idField = (data.readUInt8(1) << 8) | data.readUInt8(2);
        const IDs = [];
        for (let i = 0; i < 16; i++) {
            if ((1 << i) & idField) {
                IDs.push({id: i})
            }
        }
        return IDs;
    };
    return {
        pulseCounters: (data) => {
            const IDs = getIDs(data);
            return IDs.map((val, index) => {
                return {id: IDs[index].id, pulseCounter: data.readUInt16BE(3 + 2 * index)}
            });
        },
        currentConsumption: (data) => {
            const IDs = getIDs(data);
            return IDs.map((val, index) => {
                let current = Math.round(data.readUInt8(3 + index) * ADC_MULT * CURRENT_MULT_MA);
                return {id: IDs[index].id, currentConsumption: current}
            });
        }
    }
};

const responseParser = income => {
    const data = income.slice(0, 29);
    const cmd = income.readUInt8(0);
    const responses = Responses();
    switch (cmd) {
        case 0x01:
            events.emit('response',{type:'pulseCounter', payload: responses.pulseCounters(data) });
            break;
        case 0x02:
            events.emit('response',{type:'currentConsumption', payload: responses.currentConsumption(data) });
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
    buffer.writeUInt8(cmd, 0);
    lines.forEach((line) => {
        idMask |= 1 << line.id;
    });
    buffer.writeUInt16BE(idMask, 1);
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

const logCb = (err) => err ? console.log(err.message) :
    console.log(`${(new Date()).toLocaleString()} ${SERIAL_PORT}: data sent.`);
const send = (buffer) => {
    serialPort.write(Buffer.concat([buffer, buffer_crc32(buffer)], HEADDATA_SIZE + 4), logCb);
};
const makeHeadDataBuffer = (cmd, lines, data, type = 16) =>
    Buffer.concat([makeHead(cmd, lines), type === 16 ? makeData_u16(data) : makeData_u8(data)], HEADDATA_SIZE);
const API = {
    restart: () => {
        const buffer = Buffer.alloc(HEADDATA_SIZE);
        send(buffer);
    },
    setPulseWidth: lines => {
        const CMD = 0x01;
        send(makeHeadDataBuffer(CMD, lines, lines.map(line => line.width / 250 - 1), 8));
    },
    events:events,
    pulseCounter: {
        setPulseCounter: (lines) => {
            const CMD = 0x01;
            lines = lines.filter(val =>
                val.diff >= 0);
            send(makeHeadDataBuffer(CMD, lines, lines.map(line => line.diff)));
        },
        incrementPulseCounter: (lines) => {
            const CMD = 0x02;
            send(makeHeadDataBuffer(CMD, lines));
        },
        resetPulseCounter: (lines) => {
            const CMD = 0x03;
            send(makeHeadDataBuffer(CMD, lines));
        },
        suspendPulseCounter: (lines) => {
            const CMD = 0x04;
            send(makeHeadDataBuffer(CMD, lines));
        },
        resumePulseCounter: (lines) => {
            const CMD = 0x05;
            send(makeHeadDataBuffer(CMD, lines));
        }
    }
};

module.exports = API;
// serialPort.write(JSON.stringify(serialMsg),err=>{
//     if (err)
//     {
//         return console.log(err.message);
//     }
//     console.log('COM6 written');
// })