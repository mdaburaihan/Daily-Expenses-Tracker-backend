const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '/public');
//console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath));

//let count = 0;
io.on('connection', (socket) => {
    console.log("New web socket connection...");

    //socket.emit('countUpdated', count);

    // socket.on("increment", () => {
    //     count++;
    //     //socket.emit("countUpdated", count);
    //     io.emit("countUpdated", count);
    // })
    socket.emit("welcomeMessage", "Welcome!!");
    socket.broadcast.emit("welcomeMessage", "A new user has joined")
    socket.on("sendMessage", (message, callback) => {
        io.emit("message", message);
        callback("Delivered");
    });

    socket.on("sendLocation", (coords) => {
        io.emit("message", "https://google.com/maps?q="+coords.latitude +","+ coords.longitude);
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left.");
    });
});


server.listen(port,  () => console.log(`Listening to port ${port}...`));