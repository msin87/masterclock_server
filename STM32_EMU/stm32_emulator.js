const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const SERIAL_PORT = 'COM7';
const serialPort = new SerialPort(SERIAL_PORT, {baudRate: 57600});
const serialPipe = serialPort.pipe(new ByteLength({length: 33}));

module.exports={serialPort,serialPipe};