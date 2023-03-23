const WebSocket = require('ws');


export const wss = new WebSocket.Server({port: 8080});
import {connection} from "./index";


wss.on('connection', function connection(ws: any) {
    console.log('client connected');

    ws.on('message', function incoming(data: any) {
        const obj = JSON.parse(data);
        if (obj.action === 'fetchMessages') {
            fetchMessages(ws, obj.userName);
        }
        if (obj.action === 'sendMessage') {
            newMessage(ws, obj)
        }
        if (obj.action === 'setUserName') {
            ws.userName = obj.userName
        }
    });
    ws.send(JSON.stringify('Hello, client!'));
});


async function fetchMessages(ws: WebSocket, userName: string) {
    try {
        const messages = `SELECT * FROM Messages WHERE recipient_name='${userName}'`;

        connection.query(messages, (error: any, results: any) => {
            if (error) throw error;
            ws.send(JSON.stringify({
                action: "fetchMessages",
                message: 'Message transfer was successful',
                data: results,
                statusCode: 200
            }));
        });
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({message: 'Get messages error', statusCode: 400}));
    }
}


async function newMessage(ws: WebSocket, obj: any) {
    try {
        const {senderName, recipientName, subject, message} = obj.newObj;
        const newMessage = `INSERT INTO Messages (sender_name, recipient_name, subject, message) VALUES ('${senderName}', '${recipientName}', '${subject}', '${message}')`;
        connection.query(newMessage, async (error: any, res: any) => {

            const query = `SELECT * FROM Messages WHERE id = ${res.insertId}`;
            const results: any = await new Promise((resolve, reject) => {
                connection.query(query, (error: any, results: any) => {
                    if (error) {
                        reject(error);
                    } else {
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
                }

                wss.clients.forEach(function each(client: any) {
                    if (client.userName === message.recipient_name) {
                        client.send(JSON.stringify({action: "sendMessage", message: 'New message', data: newMessage, statusCode: 200}));
                    }
                });

            } else {
                ws.send(JSON.stringify({action: "getMessage", message: "Message not found", statusCode: 404}));
            }
        })
    } catch (e) {
        console.log(e);
        ws.send(JSON.stringify({message: 'Send messages error', statusCode: 400}));
    }
}