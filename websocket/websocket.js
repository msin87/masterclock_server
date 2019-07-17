const WebSocket = require('ws');
const Events = require('events');
let events = new Events;
const wss = new WebSocket.Server({port: 3002});

wss.on('connection', (socket) => {
    console.log(`WEBSOCKET: Success connection!`);
    events.emit('connected', socket);
    socket.on('close', () => {
        console.log('WEBSOCKET: Disconnected!');
        events.emit('close', socket);
    })
});
let IntervalFn = (intervalFn,onStopFn,period) => ({
    run: () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer=setInterval(intervalFn,period);
    },
    stop: () => {
        clearInterval(this.timer);
        onStopFn();
    }
});

let SocketQueue = (period) => {
    this.events = this.events || events;
    this.messages = this.messages || [];
    let checkUpdate = () => {
        if (this.socket) {
            for (let count = 0; count < this.messages.length; count++) {
                this.socket.send(this.messages.pop());
            }
        }
    };
    this.IntervalFn=this.IntervalFn||IntervalFn(checkUpdate,()=>delete this.socket,period)
    this.events.on('connected', socket => {
        this.socket = socket;
        this.IntervalFn.run();
    });
    this.events.on('close', () =>
        this.IntervalFn.stop());


    return {
        push: (data) => {
            let str = JSON.stringify(data);
            this.messages.push(str);
        }
    }
};

module.exports = SocketQueue;

