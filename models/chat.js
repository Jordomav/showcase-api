let mongoose = require('mongoose');

let Chat = new mongoose.Schema({
    name: {type: String, required: true},
    users: [],
    messages: [
        {
            user: {type: String},
            message: {type: String}
        }
    ]
});

mongoose.model('Chat', Chat);