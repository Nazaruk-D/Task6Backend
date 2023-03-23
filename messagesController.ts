import {connection} from "./index";

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