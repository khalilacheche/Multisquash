var doitbool = true;
var onen = true;
var one = true;
var viewportWidth = $(window).width();
var viewportHeight = $(window).height();
var context;
var id=2;
var x=100;
var y=200;
var dx=7;
var dy=7;
var minBorderx=0;
var maxBorderx=viewportWidth;
var minBordery=0;
var maxBordery=viewportHeight;
var platHmax;
var platHmin;
var ballRadius=60;
var platWidth=60;
var dirFactor;
var dirExtreme;
var Height=100;
var mousPosx;
var mousePosy;
var handPosxmax;
var handPosxmin;
var handPosymax;
var handPosymin;
var click=false;
var teleportation = false;
var emit = true;
var direction = true
 document.addEventListener('mousemove', function(e) {
        mousPosx=e.clientX ; mousPosy=e.clientY ;
    });
 document.addEventListener('click', function(e) {
        click=true;
    });


function setup()
{
  context= myCanvas.getContext('2d');
  setInterval(telebug,10);
  setInterval(avancer,10);
}

function draw()
{	
	////nthabtou est ce que l'id paire wella impaire
	if(id%2!=0){
		dirFactor=-1;
		dirExtreme=maxBorderx;
	}
	else{
		dirFactor=1;
		dirExtreme=minBorderx;
	}
var platCollider=dirExterme+platWidth*dirFactor;
    platHmax=mousPosy-Height;
    platHmin=mousPosy+Height;
 // Verifying that the ball is touching the platform
	if(x==platCollider &&y<=platHmin && y>=platHmax){
		//Bouncing the Ball
        dx=-dx;
	}
 // Game Over   
    if(x==0){
        alert("You Lost!"); x=maxBorderx/2;
			}
  // Clearing each frame
	context.clearRect(0,0, maxBorderx,maxBordery);
 // Drawing the Ball
	if(teleportation == false){
		context.beginPath();
		context.fillStyle="red";
		context.arc(x,y,ballRadius,0,Math.PI*2,true);
		context.closePath();
		context.fill();
		emit = true;
		onen = true;
		one = true;
	}
	else
		{	
			if (emit == true){
				context.clearRect(0,0, maxBorderx,maxBordery);
				teleportationsend = false;
				socket.emit('telebool', teleportationsend);
				socket.emit('positiony', y);
				socket.emit('direc', direction);
				emit = false;
				}
			dx = 0;
			dy = 0;
		}
		
  // Drawing the platform
    context.beginPath();
    context.strokeStyle="green";
    context.lineWidth=platWidth;
    context.moveTo(dirExtreme,platHmax);
    context.lineTo(dirExtreme,platHmin);
    context.stroke();
  // Boundary Logic
if( x<minBorderx || x>maxBorderx) dx=-dx; 
if( y<minBordery || y>maxBordery){ 
  dy=-dy; 
  direction = !direction;
}
if(mousPosy > 500){

socket.emit('doit', doitbool);
}

if( x > maxBorderx ){
teleportation = true;
}
if( x < maxBorderx ){
teleportation = false;
}

}
            // Connexion à socket.io
            var socket = io.connect('http://172.16.50.181:8080');
			

			
function telebug(){

            document.title = pseudo + ' - ' + direction;			
}
	socket.on('ReceiveDate', function(teleportationse,yse,directionalse) {
				if(one == true){
				y = 700;
				x = 100;

				one = false;
				}
            })
	socket.on('ReceiveDate', function(teleportationse,yse,directionalse) {
	if(teleportationse != 'null' && teleportationse != 'undefined'){
				if(onen == true){
				teleportation = teleportationse;
				dx = 7;
				dy = 7;
				onen = false;
				}
				}
            })
	socket.on('alertt', function(doitbool){
	alert('boom');
	})

	
function avancer()
{
x+=dx; 
y+=dy;
}
