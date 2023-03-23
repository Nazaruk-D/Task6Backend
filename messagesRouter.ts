const RouterMessages = require('express')
const messagesController = require('./messagesController')
const messagesRouter = new RouterMessages()

const usersEndPoints = {
    fetchMessages: '/fetch',
    sendMessage: '/send',
}

messagesRouter.get(usersEndPoints.fetchMessages, messagesController.fetchMessages)
messagesRouter.post(usersEndPoints.sendMessage, messagesController.sendMessage)

module.exports = messagesRouter