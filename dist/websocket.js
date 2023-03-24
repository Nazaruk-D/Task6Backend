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
const index_1 = require("./index");
const PORT = process.env.PORT || 8080;
exports.wss = new WebSocket.Server({ port: PORT });
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
        if (obj.action === 'fetchUsers') {
            fetchUsers(ws);
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
function fetchUsers(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = `SELECT name FROM Users;`;
            index_1.connection.query(users, (error, results) => {
                if (error)
                    throw error;
                ws.send(JSON.stringify({ action: "fetchUsers", message: 'Users transfer was successful', data: results, statusCode: 200 }));
            });
        }
        catch (e) {
            console.log(e);
            ws.send(JSON.stringify({ message: 'Get users error', statusCode: 400 }));
        }
    });
}
function newMessage(ws, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderName, recipientName, subject, message } = obj.newObj;
            const userQuery = `SELECT * FROM Users WHERE name = '${recipientName}'`;
            const userResults = yield new Promise((resolve, reject) => {
                index_1.connection.query(userQuery, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
            if (userResults.length === 0) {
                const newUser = `INSERT INTO Users (name) VALUES ('${recipientName}')`;
                yield new Promise((resolve, reject) => {
                    index_1.connection.query(newUser, (error, res) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(res);
                        }
                    });
                });
            }
            const newMessage = `INSERT INTO Messages (sender_name, recipient_name, subject, message) VALUES ('${senderName}', '${recipientName}', '${subject}', '${message}')`;
            const results = yield new Promise((resolve, reject) => {
                index_1.connection.query(newMessage, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
            const messageQuery = `SELECT * FROM Messages WHERE id = ${results.insertId}`;
            const messageResults = yield new Promise((resolve, reject) => {
                index_1.connection.query(messageQuery, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
            if (messageResults.length > 0) {
                const message = messageResults[0];
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
        }
        catch (e) {
            console.log(e);
            ws.send(JSON.stringify({ message: 'Send messages error', statusCode: 400 }));
        }
    });
}
