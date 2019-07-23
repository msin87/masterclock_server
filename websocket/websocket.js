const WebSocket = require('ws');
const Events = require('events');
let socketEvents = new Events;
const wss = new WebSocket.Server({port: 3002});

wss.on('connection', (socket) => {
    console.log(`WEBSOCKET: Success connection!`);
    socketEvents.emit('connected', socket);
    socket.on('close', () => {
        console.log('WEBSOCKET: Disconnected!');
        socketEvents.emit('close', socket);
    })
});


let WS = ((socketEvents, socket) => {
    socketEvents.on('connected', wsSocket => socket = wsSocket);
    socketEvents.on('close', () => socket = undefined);
    return {
        sendJsonToUI: json => {
            socket ? socket.send(JSON.stringify(json)) : console.log('WEBSOCKET: Warning! Attempt to send without connection.')
        }
    }
})(socketEvents);

module.exports = WS;

