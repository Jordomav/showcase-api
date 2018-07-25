var mongoose = require('mongoose');

let User = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String},
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true}
});

mongoose.model('User', User);