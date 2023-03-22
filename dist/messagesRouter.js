"use strict";
const RouterMessages = require('express');
const messagesController = require('./messagesController');
const messagesRouter = new RouterMessages();
const usersEndPoints = {
    fetchMessages: '/fetch',
    deleteMessages: '/delete',
};
messagesRouter.get(usersEndPoints.fetchMessages, messagesController.fetchMessages);
messagesRouter.delete(usersEndPoints.deleteMessages, messagesController.deleteMessages);
module.exports = messagesRouter;
