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
    //     try {
    //         const getUsersQuery = "SELECT * FROM Users"
    //         connection.query(getUsersQuery, (error: any, results: any) => {
    //             if (error) {
    //                 return res.status(400).json({message: 'Error getting users', statusCode: 400});
    //             } else {
    //                 const users = results.map((u: any) => ({
    //                     ...u,
    //                     id: u.id,
    //                     name: u.name,
    //                     email: u.email,
    //                     createdAt: u.created_at,
    //                     loginData: u.last_online,
    //                     status: u.status,
    //                 }))
    //                 return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e)
    //         res.status(400).json({message: 'Get users error', statusCode: 400})
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
