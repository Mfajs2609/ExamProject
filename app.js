//Setting up express library from NPM to create a server
const express = require('express');
const app = express();
const session = require('express-session')
 
//Port
const PORT = 3000;

//Passing jSON-objects and form data in HTML-files.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Session
const config = require('./config/config.json');

app.use(session({
    secret: config.sessionSecret, //'secret value'
    resave: false,
    saveUninitialized: true
}));


//Setup Knex with objection
const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

//Creating connection to database
const knex = Knex(knexfile.development);
Model.knex(knex);

//router references
const authRoute = require('./routes/loginAuth/auth.js');
app.use(authRoute);

const userRoute = require('./routes/user/user.js');
app.use(userRoute);

//Getting access to static files such as CSS, images, videos etc.
app.use(express.static(__dirname + '/public'));






//Server
const server = app.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);
});