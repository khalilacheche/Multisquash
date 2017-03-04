// September 2016
// Multiplayer Pong
// Khalil Acheche and Jasser Rouis

// Declaring all of our variables
var socket;
var p1={x:0,y:0};
var p2={x:0,y:0};
var thisp = {x:0,y:0};
var otherp = {x:0,y:0};
var ballDraw = {x:100,y:100};
var firstp=true;
var platformWidth=30;
var hasMoved=false;
  var canPlay=true;
var Pscores=[];
var win = new Audio('sounds/clap.wav');
var audio = [];
var waitUserbool=false;
var waitMovebool=false;
var fadeAlpha;
var fadeFactor=0.005;


function setup() {
  setSounds();
  setInterval(Update,10);
  createCanvas(800, 500);
  background(0);
  // Starting a socket connection to the server
  socket = io.connect('http://localhost:3000');
  
  socket.on('setid',function(fp){
    //Seeing if this user is Player 1 or 2
    if(fp===socket.id){ 
      firstp=true;
    }
    else{
      firstp=false;
    }
  }
  
);
    socket.on('scoreUpdate',function(scores){
      //Getting the score updates
      Pscores[1]=scores.scoresArr[1];
      Pscores[2]=scores.scoresArr[2];
  }
  
);
  socket.on('disconnect',function(){
    //Each time a user disconnects, we set back the hasMoved bool to false
    waitUserbool=true;
    waitMovebool=false;
    hasMoved=false;
  });
    socket.on('waitMove',function(){
    //Each time a user disconnects, we set back the hasMoved bool to false
    waitUserbool=false;
    waitMovebool=true;
  });
   socket.on('finishWait',function(){
    //Each time a user disconnects, we set back the hasMoved bool to false
    waitUserbool=false;
    waitMovebool=false;
  });
  // 
  socket.on('platformUpdate',
    //Getting the y coorinates of player 2
    function(data) {
      if (firstp) {
        p2.y=data.y;
      }else{
        p1.y=data.y;
      }
      otherp.y= data.y;

    }
  );

    socket.on('ballUpdate',
    function(ball) {
    //Getting the ball coordinates
      ballDraw.x=ball.x;
      ballDraw.y=ball.y;
    }
  );
}
function waitText(){

}
function setSounds(){
  for (var i=0;i<6;i++){
    audio[i]=new Audio();
    audio[i].src='sounds/pong'+i+'.wav';
  }

}
function Update(){
  //This is the Update function that loops every 10 ms (as we set it in the Setup function)
  playSounds();
  heartbeat();
  SettingxPos();
  Show();
  waitText();

}
function playSounds(){

  if (ballDraw.x===0||ballDraw.x===width) {
    win.play(); 
  }
  if (ballDraw.y===0||ballDraw.y===height||ballDraw.x<p1.x+platformWidth&&ballDraw.y>p1.y-60&& ballDraw.y<p1.y+60||ballDraw.x>p2.x-platformWidth && ballDraw.y>p2.y-60&& ballDraw.y<p2.y+60 ) {
     if (canPlay) { 
          console.log(thisp.x);    
          audio[Math.floor(Math.random()*(5-1))].play();
          canPlay=false;
        setTimeout(function(){
        canPlay=true  //do what you need here
        }, 50);

      }
  }
}

function heartbeat(){
  //Creating a "Heartbeat" function to tell the server we "need" info 
  socket.emit('hb',"sendingheartbeat");
}
function SettingxPos(){
  //Setting the x coordinates for each platform
  if(firstp){
      thisp.x=0;
      otherp.x=width-platformWidth;
      p1.x=thisp.x;
      p2.x=otherp.x;      
  }else{
      thisp.x=width-platformWidth;
      otherp.x=0;      
      p1.x=otherp.x;
      p2.x=thisp.x;

  }
}

function Show(){
  //Clearing each frame
  background(0);
  //Writing the score
  textSize(100);
  fill(255);
  text(Pscores[1], width/2-100, 80);
  text(Pscores[2], width/2+100, 80);
  //Drawing the thisp platform
  fill(255);
  noStroke();
  rect(thisp.x, thisp.y-60,platformWidth , 120);
  //Drawing the otherp platform
  fill(0,0,255);
  noStroke();
  rect(otherp.x,otherp.y-60, platformWidth, 120);
  //Drawing the Ball
  fill(249,38,114);
  noStroke();
  rect(ballDraw.x,ballDraw.y, 30, 30);




}

function mouseMoved() {
  //Telling the server that this user is Ready!
  if (!hasMoved){
    var data = {
      pstate: firstp,
      moveState:true
    }
    socket.emit('mousemove',data);
  }
  //Setting the y position for the user's platform
  thisp.y=mouseY;
  //Sending the x and y coordinates along with the "playernumber" (if this is the player one or player 2) each time the mouse moves
  sendmouse(thisp.x,thisp.y,firstp);
}

function sendmouse(xpos,ypos) {
  // We are sending!
    var data = {
    pstate: firstp,  
    x: xpos,
    y: ypos
  };
  // Send that object to the socket
  socket.emit('platformUpdate',data);
}
