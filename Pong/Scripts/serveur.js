var express = require('express'),
app = express(),
ids = [],
i = 0

server = require('http').createServer(app),

io = require('socket.io').listen(server),
ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
session = require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
})
fs = require('fs');
app.set('trust proxy', 1)
app.use(session);

// Chargement de la page index.html
app.get('/', function (req, res) {
    ids[i] = req.session.id;
	console.log(ids[i]);
	i++;
	res.sendfile(__dirname + '/platform.html');
	
  
});


	io.sockets.on('connection', function (socket, pseudo) {
	
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('telebool',function(teleportationsend){
		teleportationse = teleportationsend;
		socket.broadcast.emit('ReceiveDate', teleportationse);
	});
	socket.on('doit',function(doitbool){
		
		console.log(doitbool);
		socket.broadcast.to(ids[1]).emit('alertt', doitbool);
	});
	  socket.on('positiony',function(y){
		  yse = y;
		socket.broadcast.emit('ReceiveDate', yse);
	});
	  socket.on('direc',function(direction){
		directionse = direction;
		socket.broadcast.emit('ReceiveDate', directionse);
		
	});
	


	
});

server.listen(8080, "172.16.50.181");