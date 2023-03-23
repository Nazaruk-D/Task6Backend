import {connection} from "./index";


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



    async sendMessage(req: any, res: any) {
        try {
            const {senderName, recipientName, subject, message} = req.body;
            const sender = `SELECT name FROM Users WHERE name='${senderName}'`;
            connection.query(sender, (error: any, results: any) => {
                if (error) throw error;
                console.log("RESULT: ", results)
                if (results.length === 1) {
                    const newMessage = `INSERT INTO Messages (sender_name, recipient_name, subject, message) VALUES ('${senderName}', '${recipientName}', '${subject}', '${message}')`;
                    connection.query(newMessage, async (error: any, results: any) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).send({error: 'Error adding new message', statusCode: 500});
                        } else {
                            res.status(201).json({message: 'Message sent', statusCode: 201});
                        }
                    })
                }
            })
            return console.log('Connection closed')
        } catch (e) {
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }
}

module.exports = new messagesController()



