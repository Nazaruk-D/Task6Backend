"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const WebSocket = require('ws');
exports.wss = new WebSocket.Server({ port: 8080 });
const index_1 = require("./index");
exports.wss.on('connection', function connection(ws) {
    console.log('client connected');
    ws.on('message', function incoming(data) {
        const obj = JSON.parse(data);
        if (obj.action === 'fetchMessages') {
            fetchMessages(ws, obj.userName);
        }
        if (obj.action === 'sendMessage') {
            newMessage(ws, obj);
        }
        if (obj.action === 'setUserName') {
            ws.userName = obj.userName;
        }
    });
    ws.send(JSON.stringify('Hello, client!'));
});
function fetchMessages(ws, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messages = `SELECT * FROM Messages WHERE recipient_name='${userName}'`;
            index_1.connection.query(messages, (error, results) => {
                if (error)
                    throw error;
                ws.send(JSON.stringify({
                    action: "fetchMessages",
                    message: 'Message transfer was successful',
                    data: results,
                    statusCode: 200
                }));
            });
        }
        catch (e) {
            console.log(e);
            ws.send(JSON.stringify({ message: 'Get messages error', statusCode: 400 }));
        }
    });
}
function newMessage(ws, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderName, recipientName, subject, message } = obj.newObj;
            const newMessage = `INSERT INTO Messages (sender_name, recipient_name, subject, message) VALUES ('${senderName}', '${recipientName}', '${subject}', '${message}')`;
            index_1.connection.query(newMessage, (error, res) => __awaiter(this, void 0, void 0, function* () {
                const query = `SELECT * FROM Messages WHERE id = ${res.insertId}`;
                const results = yield new Promise((resolve, reject) => {
                    index_1.connection.query(query, (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                if (results.length > 0) {
                    const message = results[0];
                    const newMessage = {
                        id: message.id,
                        sender_name: message.sender_name,
                        recipient_name: message.recipient_name,
                        subject: message.subject,
                        message: message.message,
                        created_at: message.created_at
                    };
                    exports.wss.clients.forEach(function each(client) {
                        if (client.userName === message.recipient_name) {
                            client.send(JSON.stringify({ action: "sendMessage", message: 'New message', data: newMessage, statusCode: 200 }));
                        }
                    });
                }
                else {
                    ws.send(JSON.stringify({ action: "getMessage", message: "Message not found", statusCode: 404 }));
                }
            }));
        }
        catch (e) {
            console.log(e);
            ws.send(JSON.stringify({ message: 'Send messages error', statusCode: 400 }));
        }
    });
}
