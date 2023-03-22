import {connection} from "./index";

class messagesController {
    async fetchMessages(req: any, res: any) {
        try {
            const getUsersQuery = "SELECT * FROM Users"
            connection.query(getUsersQuery, (error: any, results: any) => {
                if (error) {
                    return res.status(400).json({message: 'Error getting users', statusCode: 400});
                } else {
                    const users = results.map((u: any) => ({
                        ...u,
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        createdAt: u.created_at,
                        loginData: u.last_online,
                        status: u.status,
                    }))
                    return res.status(200).send({message: 'Getting users successfully', data: users, statusCode: 200});
                }
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Get users error', statusCode: 400})
        }
    }

    async changeStatusUsers(req: any, res: any) {
        try {
            const {ids, status} = req.body;
            for (const id of ids) {
                await new Promise(resolve => {
                    connection.query(`UPDATE Users SET status='${status}' WHERE id=${id}`, (error: any, results: any) => {
                        if (error) {
                            return res.status(500).send({message: 'Error updating blocked status', statusCode: 500});
                        } else {
                            resolve(id);
                        }
                    });
                });
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            res.status(200).json({message: `Users ${status}`, data: {ids, status}, statusCode: 201});
        } catch (e) {
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }
    async deleteMessages(req: any, res: any) {
        try {
            const {ids} = req.body;
            for (const id of ids) {
                await new Promise(resolve => {
                    connection.query(`DELETE FROM Users WHERE id=${id}`, (error: any, results: any) => {
                        if (error) {
                            return res.status(500).send({message: 'Error deleting users', statusCode: 500});
                        } else {
                            resolve(id);
                        }
                    });
                });
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            res.status(200).json({message: `Users deleting`, data: {ids}, statusCode: 201});
        } catch (e) {
            res.status(400).json({message: 'Update data error', statusCode: 400})
        }
    }
}

module.exports = new messagesController()