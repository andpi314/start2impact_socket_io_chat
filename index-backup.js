var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//everything that happend when connection is alive
io.on('connection', function(socket){
  //socket.broadcast.emit('Hi, welcome to the SuperElegantChat');
  socket.on('chat message', function(msg){
    //socket.broadcast.emit('chat message', msg);
    socket.emit("my message", msg); //update client 1
    socket.broadcast.emit('chat message', msg); //update all client except 1
    console.log('New message: '+msg);
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3050, function(){
  console.log('listen on *:3050');
});

/*

socket.emit() only update the client you are looking at
socket.broadcast.emit() update all clients excpet client you are looking at
io.socket.emit() update all clients


*/
