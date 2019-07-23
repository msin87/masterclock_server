const SerialPort = require('serialport');
const buffer_crc32 = require('buffer-crc32');
const SERIAL_PORT='COM6';
const HEAD_BYTES=3;
const serialPort = new SerialPort(SERIAL_PORT,{baudRate: 57600});
const Commands = {
    restart: 0x00,
    setPulseCounter: (lines)=>{
        const CMD=0x01;
        let idMask=0,buffSize=HEAD_BYTES+lines.length*2;
        let buffer = Buffer.alloc(buffSize);
        buffer.writeUInt8(CMD,0);
        lines.forEach((line,index)=>{
            idMask|=1<<line.id;
            buffer.writeUInt16BE(line.diff,3+index*2);
        });
        buffer.writeUInt16BE(idMask,1);
        serialPort.write(Buffer.concat([buffer,buffer_crc32(buffer)],buffSize+4),err=>{
            if (err) {
                return console.log(err.message);
            }
            console.log('COM6 written');
        });
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