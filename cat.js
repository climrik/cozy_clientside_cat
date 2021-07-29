//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");

stage.width = 600;
stage.height = 600;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = "bold 20px sans-serif";

var audio = new Audio('res/purr.mp3');
var scratch = new Audio('res/scratch.mp3');


//--------------------
//scale to window size
//--------------------

var IMG_SCALE = 1;
function scale()
{

    var w = window.innerWidth;
    var h = window.innerHeight;

    if(h < w)
    {
        IMG_SCALE = h/600
    }
    else
    {
        IMG_SCALE=  w/600
    }

    console.log(w, h)
    stage.width = w;
    stage.height = h;

}
window.addEventListener('resize', scale);




//-----------------
//Browser Detection
//-----------------
navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];

    return M;
})();

var browser;
if (navigator.sayswho[0] == "Firefox")
	browser="f";
else if (navigator.sayswho[0] == "Chrome")
	browser="c";
else if (navigator.sayswho[0] == "Safari")
	browser="s";
else  if (navigator.sayswho[0] == "Microsoft")
	browser="m";
else
	browser="f";

//---------------
//Preloading ...
//---------------
//Preload Art Assets
// - Sprite Sheet
var imgCatH = new Image();
imgCatH.ready = false;
imgCatH.onload = setAssetReady;
imgCatH.src = "res/cat_head.png";

function setAssetReady()
{
	this.ready = true;
}

var imgCatB = new Image();
imgCatB.ready = false;
imgCatB.onload = setAssetReady;
imgCatB.src = "res/cat_body.png";

var imgCatP = new Image();
imgCatP.ready = false;
imgCatP.onload = setAssetReady;
imgCatP.src = "res/paw.png";

function setAssetReady()
{
	this.ready = true;
}


//------------
//Key Handlers
//------------
function keyDownHandler(event)
{
    console.log(event.keyCode)
	if (event.keyCode == 32)
	{		

	}
}

mouseX = 300; //default values
mouseY = 300; //default values
onmousemove = function(e)
{
    mouseX = e.clientX
    mouseY = e.clientY

}

has_interacted = false
function interacted(e)
{
    has_interacted = true

}
document.addEventListener("click",interacted, false);	


function interacted_iphone(e)
{

    has_interacted = true
}
document.addEventListener("touchstart",interacted_iphone, false);


var TIME_PER_FRAME = 33;
//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText("Loading...", 200, 200);
var preloader = setInterval(preloading, TIME_PER_FRAME);
var gameloop;

function imagesReady()
{
    return (imgCatB.ready && imgCatH.ready);
}

var click_to_start_print_once = false

function preloading()
{	
	if (imagesReady())
	{
        if (has_interacted)
        {
            scale()
            clearInterval(preloader);
            
            document.addEventListener("keydown",keyDownHandler, false);	

            //document.addEventListener("keyup",keyUpHandler, false);	
            gameloop = setInterval(update, TIME_PER_FRAME);	
        }
        if (!click_to_start_print_once)
        {
            ctx.fillText("Click to start", 200, 400);
            click_to_start_print_once = true
        }
    }

}






//----------------
//draw
//----------------

catX = 300;
catY = 600;


//----------
///mOVE cat
//--------

function move()
{
    diffX = -catX + mouseX - 0.1*(IMG_RADIUS)*IMG_SCALE;;
    diffY = -catY + mouseY + 1/3*(IMG_RADIUS)*IMG_SCALE;;
    catX = catX + diffX / 20;
    catY = catY + diffY / 30;
}

is_scratch = false
is_scratch_done = false




var IMG_FROM_X = 0;
var IMG_FROM_Y = 0;
var IMG_RADIUS = 100;
var IMG_SCALE = 1;
var IMG_ALIGN_X = 0;
var IMG_ALIGN_Y = 0;

head_align_y = -1.6
head_align_x = 0.05
eye_align_y = -1.22
eye_align_x = 0.04
eye_split = 0.15
eye_radius = 0.12


function drawHand(posX, posY)
{

    var RS = (IMG_RADIUS)*IMG_SCALE
    ctx.drawImage(imgCatP,IMG_FROM_X,IMG_FROM_Y,IMG_RADIUS,IMG_RADIUS,
        posX,posY, RS, RS);
    


}

function drawEye(posX ,posY)
{
    var RS = (IMG_RADIUS)*IMG_SCALE;
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(posX, posY, RS*eye_radius*1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    var angle;
    diffX = mouseX - posX 
    diffY = mouseY - posY
    angle = Math.atan(diffY/diffX)
    if(Math.sign(diffX < 0))
    {
        angle = angle + Math.PI
    }

    XY_distance = Math.sqrt(diffX * diffX + diffY * diffY)

    Z_distance = 50
    var pupil_adjustment;
    if (0 && XY_distance > Z_distance)
    {
        var pupil_adjustment = 1.1/2*eye_radius;
    }
    else
    {
        Z_angle = Math.atan(XY_distance/Z_distance)
        pupil_adjustment = Math.sin(Z_angle)*1/2*eye_radius
    }

    pupil_offset_x = Math.cos(angle) * RS * pupil_adjustment
    pupil_offset_y = Math.sin(angle) * RS * pupil_adjustment


    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(posX + pupil_offset_x, posY + pupil_offset_y, RS*eye_radius*1/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    //console.log(timeticker)
    if ( Math.floor(timeticker/7) % 25 == 0)
    {
        ctx.beginPath();
        ctx.fillStyle = "#555555";
        ctx.arc(posX, posY, RS*eye_radius*1.1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

//console.log(Math.sin(Math.PI/6))

function drawCat()
{

    var RS = (IMG_RADIUS)*IMG_SCALE
    ctx.drawImage(imgCatB,IMG_FROM_X,IMG_FROM_Y,IMG_RADIUS,IMG_RADIUS,
        catX - RS/2,catY - RS , RS, RS);
    ctx.drawImage(imgCatH,IMG_FROM_X,IMG_FROM_Y,IMG_RADIUS,IMG_RADIUS,
        catX - RS/2 + head_align_x * RS,catY + head_align_y * RS, RS, RS);

    drawEye(catX + RS*eye_align_x - RS*eye_split, catY + RS*eye_align_y);
    drawEye(catX + RS*eye_align_x + RS*eye_split, catY + RS*eye_align_y);

    var paw_wiggle = 0;
    if (is_scratch && !is_scratch_done)
    {
        paw_wiggle = Math.sin(timeticker/7)*10*IMG_SCALE
    }
    scratch
    drawHand(catX - RS*0.7, catY - RS*0.7 + paw_wiggle)
    drawHand(catX - RS*0.15, catY - RS*0.7 - paw_wiggle)



    

}

//--------
//sound
//-------
time_at_mouse = 0;
function playSound()
{
    if(has_interacted)
    {
        cat_sound_range = IMG_SCALE * 500.0;
        diffX = catX - mouseX
        diffY = catY - mouseY
        catDistance = Math.sqrt(diffX*diffX + diffY*diffY)

        if(audio.paused && (cat_sound_range > catDistance) )
        {
            audio.play()
        }
        if(cat_sound_range < catDistance)
        {
            audio.pause()
        }
        else
        {
            audio.volume = ((cat_sound_range - catDistance) / cat_sound_range)
        }

        cat_scratch_range = IMG_SCALE * 70;
        if(catDistance < cat_scratch_range)
        {
            time_at_mouse += 1
            if (time_at_mouse > 150 && !is_scratch)
            {
                scratch.play();
                is_scratch = true
                is_scratch_done = false

            }
            if (scratch.paused)
            {
                is_scratch_done = true
            }
        }
        else{
            scratch.currentTime = 0
            scratch.pause()
            time_at_mouse = 0
            is_scratch = false
            is_scratch_done = true
        }

    }
}


//------------
//Game Loop
//------------

var timeticker = 0; 
function update()
{	
    timeticker += 1
	//Clear Canvas
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, stage.width, stage.height);	
		
	//Draw Image
	drawCat();
    if(timeticker%16)
    {
        playSound();
    }
    move();
	
}