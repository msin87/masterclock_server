const WebSocket = require('ws');
const clockLinesEmitter = require('../Events/clockLinesEmitter');


const wss = new WebSocket.Server({port: 3002});
const Listener = () => {
    this.Handlers = {
        MINUTE_TICK: [],

    }
}
wss.on('connection', (ws) => {
    console.log(`WEBSOCKET: Success connection!`);

    ws.on('message', (message) =>
        console.log(message)
    )
    clockLinesEmitter.startMinuteTick(ws);
});


module.exports = wss;

