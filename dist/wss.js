"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
index_1.wss.on('connection', function connection(ws) {
    console.log('client connected');
    ws.on('message', function incoming(data) {
        const obj = JSON.parse(data);
        console.log(obj);
    });
    ws.send('Hello, client!');
});
