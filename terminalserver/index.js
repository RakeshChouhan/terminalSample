var express = require('express');
var http = require('http');
var fs = require('fs');
var pty = require('node-pty');
const WebSocket = require('ws');

var app = express();

app.use("/", express.static("./"));

const socketServer = new WebSocket.Server({ port: 3030 });
socketServer.on('connection', (socketClient) => {
    var term = pty.spawn("C:\\Program Files\\Git\\bin\\bash.exe", [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });
    console.log('client Set length: ', socketServer.clients.size);
    term.on("data", function (data) {
        socketClient.send(data);
    });
    socketClient.on("message", function (message) {
        term.write(message);
    });


    socketServer.on('close', (socket) => {
        console.log('closed');
        term.destroy();
        console.log('Number of clients: ', socketServer.clients.size);
    });
});