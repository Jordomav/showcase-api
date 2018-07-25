const express = require('express'),
    app = express(),
    mongo = require('./modules/db'),
    routing = require('./modules/routing'),
    passportMiddleware = require('./modules/passport'),
    jwt = require('./modules/jwt'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors');

// Require env file
require('dotenv').config();

// Set up cors
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Initialize jwt
app.use(jwt.authCheck());

// Initialize and set up passport
app.use(passport.initialize());
passport.use(passportMiddleware.setup());

// Require all mongoose models
var models = __dirname + '/models/';
mongo.start(models);

// Require all routing files
var routesPath = __dirname + '/router/';
routing.build(routesPath, app);

// Finally Start the server
app.listen(process.env.PORT,  () => {
    console.log('Server running');
});