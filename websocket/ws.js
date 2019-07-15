const WebSocket = require('ws');
const clockLinesActions = require('../actions/clockLines');


const wss = new WebSocket.Server({port: 3002});
wss.on('connection', (ws) => {
    console.log(`WEBSOCKET: Success connection!`);

    ws.on('message', (message) =>
        console.log(message)
    )
    clockLinesActions.startMinuteTick(ws);
});


module.exports = wss;

