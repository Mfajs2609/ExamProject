//Setting up express library from NPM to create a server
const express = require('express');
const app = express();
const session = require('express-session')

const chatServer = require('http').createServer(app);
const io = require('socket.io')(chatServer);

//Port
const PORT = process.argv[2];

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
const authRoute = require('./routes/loginAuth/authRouter.js');
app.use(authRoute);

const userRoute = require('./routes/user/userRouter.js');
app.use(userRoute);

const chatRoute = require('./routes/chat/chatRouter.js');
app.use(chatRoute);

const roomRoute = require('./routes/room/roomRouter.js');
app.use(roomRoute);

//Getting access to static files such as CSS, images, videos etc.
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/chat'));
app.use(express.static(__dirname + "/public/navbar"));
app.use(express.static(__dirname + "/public/user"));



//Socket setup
io.on("connection", socket => {
    socket.on("User wrote:", (data) => {
        io.emit("User:", { comment: data.comment }); 
    });
});


//Server
chatServer.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", chatServer.address().port);
});