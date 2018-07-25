let mongoose = require('mongoose');

let User = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    chats: []
});

mongoose.model('User', User);