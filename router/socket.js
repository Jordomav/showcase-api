module.exports = (app, io) => {
    let http = require('http').Server(app),
        mongoose = require('mongoose');

    let Chat = mongoose.model('Chat');

    /**
     * Get all the messages for the chat the user is on
     */
    app.get('/getMessages/:chatName', function (req, res) {
        Chat.findOne({'name' : req.params.chatName}, function (err, chat) {
            res.json(chat.messages);
        });
    });

    /**
     * Loop over all the chats that are stored in the database
     * take the chat names and set up the instance for each of those chats
     * when a chat message is sent be sure to save in into the database
     * and then send the message to the rest of the chat members
     */
    Chat.find({}, (err, chats) => {
        chats.forEach((chat) => {
        io.of(`/${chat.name}`).on('connection', (socket) => {
        socket.on('chat message', (msg) => {
        Chat.findOne({'name' : msg.chatName}, (err, msgChat) => {
        chat.messages.push({user:msg.user, message:msg.message});
    chat.save();
    io.of(`/${chat.name}`).emit('chat message', {message: msg.message, user:msg.user});
});
});
})
})
});
};