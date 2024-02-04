const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const mongoose = require('mongoose')
const Users = require('./models/users')
const Messages = require('./models/messages')
const AppError = require('./utils/AppError')
const session = require('express-session')
const userRouter = require('./routes/userRouter')
const messageRouter = require('./routes/messageRouter')
mongoose.connect('mongodb://127.0.0.1:27017/Messenger').then(() => console.log('Connected to DB'))
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}))
app.use(express.json())
app.use(session({ secret: 'jedi' }))
app.use((req, res, next) => {
    res.locals.user_id = req.session.user_id;
    next()
})
app.use('/users', userRouter)
app.use('/messages', messageRouter)
app.get('/', (req, res) => {
    // res.send("HELLO WORLD!!")
    // res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

app.use((err, req, res, next) => {
    const { message = 'Internal Server Error', status = 505 } = err;
    res.json({ error: { status, message } })
})

server.listen(3000, () => {
    console.log('Listening on Port 3000!!')
})