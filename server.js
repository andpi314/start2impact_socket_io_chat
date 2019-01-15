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
  socket.on('join', function(name){
    people[socket.id] = name;
    //update only client x
    socket.emit('com', "Your are now in the most elegant socket.io chat on the planet. Use it wise.");
    //update all clients except x
    socket.broadcast.emit('com', name + " has joined the chat");
    //updae only client x
    socket.emit('com', "Your are now online");
    io.sockets.emit('update-people', people);
  });
  socket.on('send', function(msg, name){
    console.log("Nome: "+name);
    //update only client x
    socket.emit('private', msg);
    //update all clients except x
    socket.broadcast.emit('update', msg, name);
  });
  socket.on('typing', function(name){
    socket.broadcast.emit('typing-form', name);
  });
  socket.on('disconnect', function(){
    if(isNaN(people[socket.id])){
      socket.broadcast.emit('com', "Someone has left the chat");
    }else{
      socket.broadcast.emit('com', people[socket.id] + " has left the chat");
    }
		delete people[socket.id];
    io.sockets.emit('update-people', people);
  })
});

http.listen(14234, function(){
  console.log('listen on *:14234');
});

/*

socket.emit() only update the client you are looking at
socket.broadcast.emit() update all clients excpet client you are looking at
io.socket.emit() update all clients


*/
