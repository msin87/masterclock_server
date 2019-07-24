const SerialPort = require('serialport');
const buffer_crc32 = require('buffer-crc32');
const SERIAL_PORT = 'COM6';
const HEADDATA_SIZE = 29;
const HEAD_BYTES = 3;
const serialPort = new SerialPort(SERIAL_PORT, {baudRate: 57600});
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
const Commands = {
    restart: () => {
        const buffer = Buffer.alloc(HEADDATA_SIZE);
        send(buffer);
    },
    setPulseWidth: lines => {
        const CMD = 0x01;
        send(makeHeadDataBuffer(CMD, lines, lines.map(line => line.width / 250 - 1), 8));
    },
    pulseCounter: {
        setPulseCounter: (lines) => {
            const CMD = 0x01;
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
module.exports = Commands;
// serialPort.write(JSON.stringify(serialMsg),err=>{
//     if (err)
//     {
//         return console.log(err.message);
//     }
//     console.log('COM6 written');
// })