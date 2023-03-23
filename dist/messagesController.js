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
const index_1 = require("./index");
class messagesController {
    // async fetchMessages(req: any, res: any) {
    //     const { userName } = req.params
    //     try {
    //         const messages = `SELECT * FROM Messages WHERE recipient_name='${userName}'`
    //
    //         connection.query(messages, (error: any, results: any) => {
    //             if (error) throw error;
    //             res.status(201).json({message: 'User registered and login successfully', data: results, statusCode: 201,});
    //         })
    //     } catch (e) {
    //         console.log(e)
    //         res.status(400).json({message: 'Get messages error', statusCode: 400})
    //     }
    // }
    // async fetchMessages(ws: any, userName: string) {
    //     try {
    //         const messages = `SELECT * FROM Messages WHERE recipient_name='${userName}'`
    //
    //         connection.query(messages, (error: any, results: any) => {
    //             if (error) throw error;
    //             ws.send(JSON.stringify({message: 'Message transfer was successful', data: results, statusCode: 200}));
    //         })
    //     } catch (e) {
    //         console.log(e)
    //         ws.send(JSON.stringify({message: 'Get messages error', statusCode: 400}))
    //     }
    // }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderName, recipientName, subject, message } = req.body;
                const sender = `SELECT name FROM Users WHERE name='${senderName}'`;
                index_1.connection.query(sender, (error, results) => {
                    if (error)
                        throw error;
                    console.log("RESULT: ", results);
                    if (results.length === 1) {
                        const newMessage = `INSERT INTO Messages (sender_name, recipient_name, subject, message) VALUES ('${senderName}', '${recipientName}', '${subject}', '${message}')`;
                        index_1.connection.query(newMessage, (error, results) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({ error: 'Error adding new message', statusCode: 500 });
                            }
                            else {
                                res.status(201).json({ message: 'Message sent', statusCode: 201 });
                            }
                        }));
                    }
                });
                return console.log('Connection closed');
            }
            catch (e) {
                res.status(400).json({ message: 'Update data error', statusCode: 400 });
            }
        });
    }
}
module.exports = new messagesController();
