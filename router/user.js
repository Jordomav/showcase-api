const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    passport = require('passport');
    jwt = require('jsonwebtoken');

module.exports = (app) => {
var saltRounds = 10;

var User = mongoose.model('User');

// Login the user be sending it through the passport middleware
// then send the user back with a Json web token
app.post('/userLogin', passport.authenticate('local', {session: false}), (req, res, next) => {
    res.json({
        user: req.user,
        token: jwt.sign(req.user._id.toHexString(), process.env.JSONSECRET)
    });
});

// Create a user in mongoose and then hash the users password before saving the user
// and sending the user back to the app
app.post('/postUser', (req, res) => {
    user = new User(req.body);
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            user.password = hash;
            user.save();
        });
    });
    res.json({user});
});

    /**
     * Find the user that is creating the new chat
     * create a new chat and add the creators _id
     * to the users array for the chat
     * save the chat into the creators chats array
     */
    app.post('/newChat', (req, res) => {
        User.findOne({'_id': req.body.user_id}, (err, user) => {
            var chat = new Chat;
            chat.name = req.body.name;
            chat.users.push(user._id);
            chat.save();
            user.chats.push(chat);
            user.save();
            res.json({
                chat: chat,
                user: user,
                token: jwt.sign(user._id.toHexString(), process.env.JSONSECRET)
            });
        })
    });

    /**
     * Find that chat that the user is attempting to add someone to,
     * create a new invite instance with the users _id and the chat
     */
    app.post('/inviteFriend', (req, res) => {
        var invite = new Invite;
        Chat.findOne({'_id' : req.body.chat}, (err, chat) => {
            invite.chat = chat;
            User.findOne({'username' : req.body.user}, (err, user) => {
                if(user === null) {
                    res.json({message: 'could not find user'})
                } else {
                    invite.invitee = user.username;
                    invite.save();
                    res.json(invite);
                }
            });
        });
    });

    /**
     * Get all the invites for the signed in user
     */
    app.get('/getInvites/:username', (req, res) => {
        Invite.find({'invitee' : req.params.username}, (err, invites) => {
            res.json(invites);
        });
    });

    /**
     * Remove the invite
     */
    app.get('/declineInvite/:inviteId', (req, res) => {
        Invite.remove({'_id': req.params.inviteId});
        res.json('deleted');
    });

    /**
     * Find the invite in the database,
     * find the user in the database,
     * find the chat in the database,
     * save the chat to the user object,
     * save the user _id to the chat object
     */
    app.get('/acceptInvite/:chatId/:userId', (req, res) => {
        Invite.findOne({'_id' : req.params.chatId}, (err, invite) => {
            User.findOne({'_id' : req.params.userId}, (err, user) => {
                Chat.findOne({'_id' : invite.chat._id}, (err, chat) => {
                    user.chats.push(chat);
                    user.save();
                    chat.users.push(user._id);
                    chat.save();
                    res.json({
                        user: user,
                        token: jwt.sign(user._id.toHexString(), process.env.JSONSECRET)
                    })
                });
            });
        }).remove();
    });
};