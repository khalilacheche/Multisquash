// Multiplayer Pong
// Scripted and thought of by Khalil Acheche and Jasser Rouis

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();
var i=0;
var PlayerLatch=false;
var p1S={id:"", x:0, y:0,score:0};
var p2S={id:"", x:0, y:0,score:0};
var ball={x:100,y:100};
var xv=2;
var yv=2;
setInterval (Update,10);
var platformWidth=30;
var p1Move=false;
var p2Move=false;
var origPos = {x:300,y:100};

// Setting up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server succesfully started');
}


app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

function Update(){
  //Veryfing that both of the players are ready
  if (p1Move&&p2Move){
    //If they are, we play the game normally
        moveBall();
        gameManagment();
  }else{
    //Otherwise, the ball is fixed at this position
    ball.x=origPos.x;
    ball.y=origPos.y;
  }
}
function moveBall(){
  //The function that manages the ball movement
  ball.x += xv;
  ball.y += yv;
  if (ball.x<p1S.x+platformWidth&&ball.y>p1S.y-60&& ball.y<p1S.y+60 || ball.x>p2S.x-platformWidth && ball.y>p2S.y-60&& ball.y<p2S.y+60 ){
    xv*=-1
  }
  if (ball.y<0 || ball.y>500){
    yv*=-1;
  }
}
function gameManagment(){
  //The function that manages the scores
  if (ball.x<0) {
    ball.x=origPos.x;
      p2S.score+=1;
  }
  if (ball.x>800) {
    ball.x=origPos.x;
    p1S.score+=1;
  }
}
function Restart(){
  xv=2;
  yv=2;
  p1S.score=0;
  p2S.score=0;
  ball.x=origPos.x;
  ball.y=origPos.y;
}


io.sockets.on('connection',
  function (socket) {
    Restart();
    //Setting the first player each time a new user connects
    var fp;
    PlayerLatch = !PlayerLatch;
    if (PlayerLatch){
      fp=socket.id;
    }
    socket.broadcast.emit('waitMove','');
    //Sending who's the first player to the users
    socket.broadcast.emit('setid',fp);
    //Seeing if the players are ready or not
    socket.on('mousemove',function(data){
    socket.broadcast.emit('finishWait','');  
      if (data.pstate){
        p1Move=true;
      }
      else {
        if (!data.pstate) {
          p2Move=true;
        };
      }
    });
    //
    socket.on('hb',function(){
    var scores = [];
    scores[1]=p1S.score;
    scores[2]=p2S.score;
    io.sockets.emit('ballUpdate', ball);
    io.sockets.emit('scoreUpdate', {
    scoresArr:scores
  });
    });
    socket.on('platformUpdate',
      //Putting each player's coordinates in the right objects
      function(data) {
        if (data.pstate){
          p1S.x=data.x;
          p1S.y=data.y;
        }else{
          p2S.x=data.x;
          p2S.y=data.y;
        }
       //Sending back the data to the other player so that he can draw it 
        socket.broadcast.emit('platformUpdate', data);

      }
    );
    
    socket.on('disconnect', function() {
      //Resetting all the data after a user disconnects
      p1Move=false;
      p2Move=false;
      xv=0;
      yv=0;
      console.log("Client has disconnected");
      io.sockets.emit('disconnect', "disc");
    });
  }
);
