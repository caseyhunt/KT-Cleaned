var socket = io();

var button = document.getElementById('button');

let rcUID;
let rcUID2;
var name;
var rcname1;
var rcname2;
var isconnected1 = false;
var isconnected2 = false;
let connecting1 = false;
let connecting2 = false;

var slider2 = document.getElementById("slider2");
var slider1 = document.getElementById("slider1");
var speed = 0x64;
var speed1 = 0x64;
var speed2 = 0x64;

let ygo;
let xgo;

let cubeControl = false;

var angle = [0x5a,0x00];

let activeCube = 0;

let crem = false;

let char; //0: move -- 1: sound -- 2: light -- 3:position

var toiomax = [420, 420];
var toiomin = [70, 70];

var xmax = 308;
var ymax = 212;
let toiox = [0];
let toioy = [0];

let pUID = [];

let directControl = false;

let activeColor = "red";


const domain = 'meet.jit.si';
const options = {
roomName: 'JitsiMeetAPIExample',
width: "100%",
height: "100%",
parentNode: document.querySelector('#meet'),
lang: 'en',
};
const api = new JitsiMeetExternalAPI(domain, options);



api.addListener("videoConferenceJoined", function(res)
{
  console.log('participant joined');
  console.log(res.displayName);
  name = res.displayName;
  socket.emit('namesubmit',  name);
  for(let i=0; i < document.getElementsByClassName("controls").length; i++){
  document.getElementsByClassName("controls")[i].style.visibility = "visible";
}
}
);

 const CUBE_ID_ARRAY = [ 0, 1 ];
 const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

 // Global Variables.
 const gCubes = [ undefined, undefined, undefined ];





   const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
   const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
   const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
   const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';
   const POSITION_CHARACTERISTICS_UUID = '10b20101-5b3b-4571-9508-cf3efcd7bbae';


   const connectNewCube = () => {
       const cube = {
           device:undefined,
           sever:undefined,
           service:undefined,
           soundChar:undefined,
           moveChar:undefined,
           lightChar:undefined,
           posChar: undefined

       };

       // Scan only toio Core Cubes
       const options = {
           filters: [
               { services: [ SERVICE_UUID ] },
           ],
       }

       navigator.bluetooth.requestDevice( options ).then( device => {
           cube.device = device;
           if( cube === gCubes[0] ){
               const cubeID = 1;
               changeConnectCubeButtonStatus( cubeID, undefined, true );
           }else if( cube === gCubes[1] ){
               const cubeID = 2;
               changeConnectCubeButtonStatus( cubeID, undefined, true );
           }
           return device.gatt.connect();
       }).then( server => {
           cube.server = server;
           return server.getPrimaryService( SERVICE_UUID );
       }).then(service => {
           cube.service = service;
           return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
           console.log("writing service characteristic");
       }).then( characteristic => {
           cube.moveChar = characteristic;
           return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
       }).then( characteristic => {
           cube.soundChar = characteristic;
           return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
       }).then( characteristic => {
           cube.lightChar = characteristic;
           return cube.service.getCharacteristic( POSITION_CHARACTERISTICS_UUID );
       }).then( characteristic => {
           cube.posChar = characteristic;
           if( cube === gCubes[0] ){
             console.log("connecting cube 0");
             turnOnLightCian( cube );
             startCube( cube );
             document.getElementById('canvas').innerHTML = "<div id='toio'></div>";
             document.getElementById('toio').style.backgroundColor = activeColor;
           }else if( cube === gCubes[1] ){
             console.log("connecting cube 1");
             document.getElementById('canvas1').innerHTML = "<div id='toio3'></div>";
             document.getElementById('toio3').style.backgroundColor = activeColor;
             turnOnLightRed( cube );
             startCube( cube );
             //spin cube needs to be changed to startCube
             // spinCube(cube);
           }
       });

       return cube;
   }


   // Cube Commands
   // -- Light Commands
   const turnOffLight = ( cube ) => {

       const CMD_TURN_OFF = 0x01;
       const buf = new Uint8Array([ CMD_TURN_OFF ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
       }

   }


   const turnOnLightGreen = ( cube ) => {

       // Green light
       const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
           console.log('green');
       }

   }

   const turnOnLightCian = ( cube ) => {

       // Cian light
     const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
           console.log('cyan');

       }

   }

   const turnOnLightRed = ( cube ) => {

       // Red light
       const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
       if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
           cube.lightChar.writeValue( buf );
       }

   }


   const startCube = ( cube ) => {

     console.log('cube connected successfully!');
     console.log(cube);
       // Green light
       spinCube(cube);


        onStartButtonClick( cube );
   }

   const spinCube = ( cube ) => {

       // Green light
       const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           cube.moveChar.writeValue( buf );
           console.log('spin');
       }

   }

   const partyCube = (cube) => {



     if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) && (cube.lightChar !== undefined)){
         doTheDance(cube, 0);
         console.log('party!');
     }

   }

   function doTheDance(cube, count){
     setTimeout(function(){
       if(count<6){
     let buf1 = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
     let buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x64, 0x0A]);
   cube.lightChar.writeValue( buf1 );
     cube.moveChar.writeValue( buf );
     if(count%2 == 0){
    setTimeout(function() {
      buf = new Uint8Array([ 0x02, 0x01, 0x02, 0x64, 0x02, 0x01, 0x64, 0x0A]);
      cube.moveChar.writeValue( buf );
      buf1 = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0x00]);
      cube.lightChar.writeValue(buf1);
    },400);
  }else{
    setTimeout(function() {
      buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64, 0x0A]);
      cube.moveChar.writeValue( buf );
      buf1 = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
      cube.lightChar.writeValue(buf1);
    },400);
  }

  count++;
    doTheDance(cube, count);
}}, 400);
   }

   const cubeShuffle = (cube) =>{
     doTheShuffle(cube, 0);
   }

   function doTheShuffle(cube, count){
     if(count<6){

     setTimeout(function(){
        if(count%2==0){
     let buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64, 0x0A]);
     cube.moveChar.writeValue( buf );
   }else{
     buf = new Uint8Array([ 0x02, 0x01, 0x02, 0x3C, 0x02, 0x02, 0x3C, 0x0A]);
     cube.moveChar.writeValue( buf );
   }
   count++;
   doTheShuffle(cube,count);
 },350);
}
   }

   // const changeButtonStatus = ( btID, enabled ) => {
   //     //document.getElementById( btID ).disabled = !enabled;
   //     document.getElementById( 'btConnectCube' + btID).src="images/Group 46.svg";
   // }




   const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {
     console.log('change button status' + 'btConnectCube' + idButton);
     document.getElementById( 'btConnectCube' + idButton).src="images/Group 46.svg";

       // if( idButton ){
       //     changeButtonStatus( 'btConnectCube' + ( idButton), enabled );
       // }else{
           if( idButton === 1 ){
               // changeButtonStatus( 'btConnectCube1', enabled );
               socket.emit('bt', name, 0);
           }else if( idButton === 2 ){
               socket.emit('bt', name, 1);
           }
       // }

   }


   function enableCube(cubeno) {
     if(cubeno == 0){
       console.log('enable cube 1');
       // document.getElementById('mycube1').classList.toggle('disabled');
     }else if(cubeno == 1){
       console.log('enable cube 2');
       // document.getElementById('mycube2').classList.toggle('disabled');
     }
   }






   const cubeMove = ( moveID, cubeno,speed ) => {
       const cube = gCubes[cubeno];
       var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
       // forward

       console.log(speed);
       if(moveID==1){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x01, speed]);
       console.log('cube ' + cubeno + " moving forward");
     }else if (moveID==2){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x02, speed]);
     }else if (moveID==3){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x14, 0x02, 0x01, speed]);
     }else if (moveID==4){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x02, 0x14]);
     }else if (moveID==5){
       buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x50]);
     }
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           cube.moveChar.writeValue( buf );
           console.log('move');
       }

   }

   const cubeStop = ( cubeno ) =>{
       const cube = gCubes[cubeno];
       const buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x00, 0x02, 0x01, 0x00]);
       if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
           setTimeout(() => {cube.moveChar.writeValue( buf )},100);
           console.log('stop');
           if(cubeno==0){
             console.log('cube 1 stopping');
           }else if(cubeno==1){
             console.log('cube 2 stopping');
           }
       }
   }


// let prevtab = document.getElementsByClassName("activetab")[0].id;
   function setActive(e){
     console.log('clicked');

     document.getElementsByClassName("activetab")[0].classList.toggle("inactivetab");
     document.getElementsByClassName("activetab")[0].classList.toggle("activetab");


     e.target.classList.toggle("activetab");
     e.target.classList.toggle('inactivetab');

      activeCube = e.target.id;
      console.log(activeCube);
     if(activeCube == 'mycube1'){
       activeCube = 0;
       console.log(activeCube);
     }else if(activeCube == 'mycube2'){
       activeCube = 1;
     }else{
       activeCube = 2;
       console.log(activeCube);
       document.getElementById('remoteconnect').classList.toggle('inactive');
       document.getElementById('remoteconnect').classList.toggle('active');

     }

     // console.log("previous meal: " + prevmeal);
     // prevmeal.classList.toggle('active');


   }

   function setActiveColor(e){
     console.log('clicked');
     document.getElementsByClassName("active")[0].classList.toggle("active");
     e.target.classList.toggle("active");
     activeColor = e.target.id;
     console.log('active color: ' + activeColor);
   }


let cubepos;

const onStartButtonClick = (cube) => {
  console.log("start button click");
  const buf1 = new Uint8Array([ 0x18, 0x00, 0x01, 0x01 ]);
  const buf2 = new Uint8Array([ 0x1d, 0x00, 0x01, 0x01, 0x01 ]);
  if(cube != undefined){
  cube.posChar.writeValue(buf1);
  //posCharacteristic = gCubes[0].posChar.readValue();
  //console.log(posCharacteristic);
  return cube.posChar.startNotifications().then(_ => {
    console.log('> Notifications started');
    cube.posChar.addEventListener('characteristicvaluechanged', function(event)
    {
      handleNotifications.call(this, event, cube, 0);
    }, false);

})
.catch(error => {
  console.log('Argh! There seems to be an issue with incoming notifications from cube. ' + error);
});

// gCubes[0].moveChar.writeValue(buf2);

// return gCubes[0].moveChar.startNotifications().then(_ => {
//   console.log('> Notifications started');
//   gCubes[0].moveChar.addEventListener('characteristicvaluechanged', function(event)
//   {
//     handleNotifications.call(this, event, 0);
//   }, false);
//
// })
// .catch(error => {
// console.log('Argh! ' + error);
// });
}
}


let a;
function handleNotifications(event, cube, cubeno) {
  // console.log("handleNotifications", cubeno);

  //this is the response from the event (bluetooth emitting cube position)
  let value = event.target.value;

  //this array will hold the data from the response (it is currently one giant string)
  a = [];


  console.log(cube);


  // convert raw data bytes to hex values
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }


  let xrem;
  let yrem;

  cube.xpos = [a[7], a[8]];
  cube.ypos = [a[9], a[10]];

  xrem = [a[7], a[8]];
  yrem = [a[9], a[10]];

cubepos = [a[7], a[8], a[9], a[10]];

// console.log(cube);

//this is the offset from the mat not starting at 0, 0
var xoff = 32;
xoff = toiomin[0];
var yoff = 44;
yoff = toiomin[1];

if (toiox[0] != undefined){
toiox[1] = toiox[0];
toioy[1] = toioy[0];
}

toiox[0] = value.getInt16(1, true)-xoff;
toioy[0] = value.getInt16(3, true)-yoff;

var xpos = (value.getInt16(1, true)).toString();
var ypos = (value.getInt16(3, true)).toString();
var angle = value.getInt16(5, true).toString();

document.getElementById("xpos").innerHTML = "x position: " + xpos;
document.getElementById("ypos").innerHTML = "y position: " + ypos;
document.getElementById("angle").innerHTML = "angle (degrees): " + angle;

if(toiox[1] != toiox[0] || toioy[1] != toioy[0]){
//^^ don't send data if there is not a change in position
if(cube == gCubes[0]){
  drawToio(0, toiox[0], toioy[0]);
}else if(cube == gCubes[1]){
  drawToio(3, toiox[0], toioy[0]);
}
  if(directControl == true){
    socket.emit('dc', xrem, yrem, ang, name, rcUID, directControl, speed1);
  }
  if(pUID.length>0){
    for(i=0; i<pUID.length; i++){
  socket.emit('rpos', toiox[0], toioy[0], 0, name, pUID[i], directControl, a);

  }
  }
}

}


function drawToio(cnum, x, y){
  var ypos = (y/toiomax[1])*(170-(45/2));
  var xpos = (x/toiomax[0])*(170-(45/2));
  if(cnum == 0){
    //console.log("toio moving");
    document.getElementById("toio").style.left = (xpos).toString() + "px";
    document.getElementById('toio').style.top = (ypos).toString() + "px";
    //console.log("moving to: x: " + xpos + " y: " + ypos);
  }else if(cnum == 1){
    // console.log("toio moving remote");
    // var topoff = document.getElementById('toio').style.height;
    // var leftoff = document.getElementById('toio').style.width;
    if(gCubes[0] == undefined){
    xpos = xpos;
    ypos = ypos;
  }else{
    xpos = xpos;
    ypos = ypos-45;
  }
    document.getElementById("toio2").style.left = (xpos).toString() + "px";
    document.getElementById('toio2').style.top = (ypos).toString() + "px";
    // console.log("moving to: x: " + xpos + " y: " + ypos);
  }else if(cnum = 2){
    document.getElementById("toio3").style.left = (xpos).toString() + "px";
    document.getElementById('toio3').style.top = (ypos).toString() + "px";
  }

}



 function getMousePos(canvas){
  const rect = event.target.getBoundingClientRect();

  var x = (event.clientX - rect.left)/rect.height;
  var y = (event.clientY- rect.top)/rect.width;
  if(isNaN(event.clientX)!=true && isNaN(event.clientY) !=true){
  console.log("mouse click x : " + x + " y : " + y);


  var xdiff = toiomax[0]-toiomin[0];
  var xmove = parseInt(x*xdiff);
  var ydiff = toiomax[1] - toiomin[1];
  var ymove = parseInt(y*ydiff);

  console.log('x move: ' + xmove + " , " + "y move: " + ymove);
  if(isconnected1 != false){
    xmove = xmove - (document.getElementsByClassName('toio')[0].style.width/2);
    ymove = ymove - (document.getElementsByClassName('toio')[0].style.height/2);
  }
  if((xmove + toiomin[0]) > 255){
    // xmove = xmove.toString();
    xgo = [(xmove+toiomin[0])-255, "0x01"];
    xgo = [xgo[0].toString(16), xgo[1]];
      if(xgo[0] == 'NaN'){
        xgo[0] = "0x00";
      }else if(xgo[0].length ==1){
      xgo[0] = "0x0" + xgo[0];
    }else if(xgo[0].length >= 2){
      xgo[0] = "0x" + xgo[0];
    }
    console.log(xgo);
  }else{
    xgo = [xmove+toiomin[0], "0x00"];
    xgo = [xgo[0].toString(16), xgo[1]];
    if(xgo[0] == 'NaN'){
      xgo[0] = "0x00";
    }else if(xgo[0].length ==1){
    xgo[0] = "0x0" + xgo[0];
  }else if(xgo[0].length >= 2){
    xgo[0] = "0x" + xgo[0];
  }
  console.log(xgo);
  }

  if((ymove + toiomin[1]) > 255){
    // xmove = xmove.toString();
    ygo = [(ymove+toiomin[1])-255, "0x01"];
    ygo = [ygo[0].toString(16), ygo[1]];
      if(ygo[0] == 'NaN'){
        ygo[0] = "0x00";
      }else if(ygo[0].length ==1){
      ygo[0] = "0x0" + ygo[0];
    }else if(ygo[0].length >= 2){
      ygo[0] = "0x" + ygo[0];
    }
    console.log(ygo);
  }else{
    ygo = [ymove+toiomin[1], "0x00"];
    ygo = [ygo[0].toString(16), ygo[1]];
    if(ygo[0] == 'NaN'){
      ygo[0] = "0x00";
    }else if(ygo[0].length ==1){
    ygo[0] = "0x0" + ygo[0];
  }else if(ygo[0].length >= 2){
    ygo[0] = "0x" + ygo[0];
  }
  console.log(ygo);
  }


var buf = new ArrayBuffer(10)
var a8 = new Uint8Array(buf);
var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,xgo[0], xgo[1],ygo[0],ygo[1],ang[0],ang[1]]);

   if (gCubes[0] != undefined && canvas == 0){
       console.log("move cube 1 to position");
       // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
       cube = gCubes[0];
      console.log(buf4);
}else if(gCubes[1] != undefined && canvas == 1){
  console.log("move cube 2 to position");
  // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
  cube = gCubes[1];
 console.log(buf4);
}

if(isconnected1 != false){
  //btCube(nCube, characteristic, rbuf)

  var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,xgo[0], xgo[1],ygo[0],ygo[1],ang[0],ang[1]]);
  socket.emit( 'r' , rcUID , 0 , 0 , buf4 , name );
}else if(isconnected1 ==false && gCubes[0] != undefined){
  cube.moveChar.writeValue(buf4);
}
}else{
  console.log('canvas click is not a number.');
}
}

function changeAngle(a){
  angle[0]=a[0];
  angle[1] = a[1];
  console.log(angle);
  console.log(xgo);
  console.log(ygo);
  console.log(speed1);
  var buf = new ArrayBuffer(10)
  var a8 = new Uint8Array(buf);
  //var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,xgo[0], xgo[1],ygo[0],ygo[1],angle[0],angle[1]]);
  var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,cubepos[0], cubepos[1],cubepos[2],cubepos[3],angle[0],angle[1]]);

     if (gCubes[0] != undefined){
         console.log("move cube to position");
         // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
         cube = gCubes[0];
        console.log(buf4);
  }
  //socket.emit('rpos', toiox[0], toioy[0], 0, name, pUID[i], directControl, a);

  if(isconnected1 != false){
    //btCube(nCube, characteristic, rbuf)

    var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,xgo[0], xgo[1],ygo[0],ygo[1],angle[0],angle[1]]);
    socket.emit( 'r' , rcUID , 0 , 0 , buf4 , name );
  }else if(isconnected1 ==false && gCubes[0] != undefined){
    cube.moveChar.writeValue(buf4);
  }
}


 function calculateSpeed(){
   speed1 = Math.floor(slideval*160);
   speed1 = '0x' + speed1.toString(16);
   console.log(speed1);
 }

const moveJoystick = (n, x, y, remote, speed) => {
if(n==0 && remote == true){
   if(isconnected1== 0 && rcUID!= undefined){
     socket.emit('remotejoystick',  rcUID, 0, x,y, speed1, name, socket.id);
     console.log('remote joystick control');
   }else if(isconnected1== 1 && rcUID!= undefined){
     socket.emit('remotejoystick',  rcUID, 1, x,y, speed1, name, socket.id);
     console.log('remote joystick control');
   }}

   else if(n==1  && remote == true){
     if(isconnected2== 0 && rcUID2!= undefined){
     socket.emit('remotejoystick',  rcUID2, 0, x,y, speed2, name, socket.id);
     console.log('remote joystick control');
   }else if(isconnected2== 1 && rcUID2!= undefined){
     socket.emit('remotejoystick',  rcUID2, 1, x,y, speed2, name, socket.id);
     console.log('remote joystick control');
   }}
   else{
     console.log("local joystick control");
     let cube = gCubes[n];
     let maxspeed;
     if(speed ==undefined){
     if(n==0){
     maxspeed = speed1;
   }else if(n==1 ){
   maxspeed = speed2;
   }
 }else{
   maxspeed = speed;
 }
   console.log(maxspeed);
     var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);

     let stopmot = 0;

     console.log("x: "+x);
     console.log("y: "+y);
   //calculate whether the motor should go forward or backward.
   //motor speeds are encoded as -.5 to .5 so if it's over 0 then it should go forward.
     let m1fw;
     let m2fw;

     if(y<0){
       console.log("forward");
       m1fw = true;
       m2fw = true
     }else{
       console.log("backward")
       m1fw = false;
       m2fw = false
     }

     let motor1;
     let motor2;
     if(x>0 && Math.abs(y)>0.07){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
         motor1 = Math.floor(Math.abs(y)*maxspeed);
         motor2 = Math.floor(motor1-Math.abs(motor1*x));
         //motor2 = Math.floor(motor1/Math.abs(x*maxspeed*.25));
         motor1 = motor1.toString(16);
         motor1 = "0x" + motor1;
         motor2 = motor2.toString(16);
         motor2 = "0x" + motor2;


     }else if(x==0 && Math.abs(y)>0.07){

   console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
     motor1 = Math.floor(Math.abs(y)*maxspeed);
     motor1 = motor1.toString(16);
     motor1 = "0x" + motor1;
     motor2 = motor1;
   }else if(x<=0 && Math.abs(y)>0.07){
     console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor2 = Math.floor(Math.abs(y)*maxspeed);
       motor1 = Math.floor(motor2-Math.abs(motor2*x));
       //motor1 = Math.floor(motor2/Math.abs(x*maxspeed*.25));
       motor2 = motor2.toString(16);
       motor2 = "0x" + motor2;
       motor1 = motor1.toString(16);
       motor1 = "0x" + motor1;
     }else if(Math.abs(y)<=0.07 && x>0){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor1 = Math.floor(Math.abs(x)*maxspeed*0.2);
       motor2 = motor1;
       m2fw = false;
       m1fw = true;
     }else if(Math.abs(y)<=0.07 && x<=0){
       console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
       motor2 = Math.floor(Math.abs(x)*maxspeed*0.2);
       motor1 = motor2;
       m1fw = false;
       m2fw = true;
     }


     //write forward and backward values
     if(m1fw == true && m2fw==true){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x01, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x32, 0x01, 0x01, 0x32]);
     }else if(m1fw == false && m2fw==true){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x01, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x01, 0x01, 0x32]);
   }else if(m1fw == true && m2fw == false){
     buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x02, motor2]);
     //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x96, 0x02, 0x01, 0x64]);

   }else{
      buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x02, motor2]);
       //  buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x02, 0x02, 0x64]);
   }

     if( ( cube !== undefined ) && ( cube.moveChar !== undefined )){
       console.log(buf);
         cube.moveChar.writeValue( buf );
         console.log('move');

     }
   }

 }

function btCube(nCube, characteristic, rbuf){
  cube= gCubes[nCube];
  //0: move -- 1: sound -- 2: light -- 3:position

  if(cube != undefined){

  if(characteristic == 0){
    //used to move both with motors and with mat
    cube.moveChar.writeValue( rbuf );
  }else if(characteristic == 1){
    cube.soundChar.writeValue( rbuf );
  }else if(characteristic == 2){
    cube.lightChar.writeValue( rbuf );
  }else if(characteristic == 3){
    cube.posChar.writeValue( rbuf );
  }
}

 }

function littleEndian(num){
  let outarr = [];
  num = parseInt(num);
  if(num<65,535){
    if(num<255){
      outarr = [num, "0x00"];
      outarr = [outarr[0].toString(16), outarr[1]];
      if(outarr[0] == 'NaN'){
        outarr[0] = "0x00";
      }else if(outarr[0].length ==1){
      outarr[0] = "0x0" + outarr[0];
    }else if(outarr[0].length >= 2){
      outarr[0] = "0x" + outarr[0];
    }
  }else{
    outarr = [num-255, "0x01"];
    outarr = [outarr[0].toString(16), outarr[1]];
      if(outarr[0] == 'NaN'){
      outarr[0] = "0x00";
    }else if(outarr[0].length ==1){
      outarr[0] = "0x0" + outarr[0];
    }else if(outarr[0].length >= 2){
      outarr[0] = "0x" + outarr[0];
    }
    }

    return outarr;


  }else{
    console.log('ERROR: You are trying to encode a little endian number greater than two bits.');
    console.log('please see function littleEndian() for more information');
    return false;
  }

}

function stopping(n){
  if (n==0){
    if(isconnected1== 0 && rcUID!= undefined){
     socket.emit('remote', 1, rcUID, 0, 0,name, socket.id);
   }else if(isconnected1 == 1 && rcUID!= undefined){
     socket.emit("remote", 1, rcUID, 1, 0, name, socket.id);
   }else if(gCubes[0] !==undefined){
     cubeStop(0);
   }else{
     console.log("error stopping cube 0, either an issue with remote cube connection or gCubes[0] is undefined.")
   }}else if(n==1){
     if(isconnected2== 0 && rcUID2!= undefined){
      socket.emit('remote', 1, rcUID2, 0, 0,name, socket.id);
    }else if(isconnected2 == 1 && rcUID2!= undefined){
      socket.emit("remote", 1, rcUID2, 1, 0, name, socket.id);
    }else if(gCubes[0] !== undefined){
      cubeStop(1);
    }else{
      console.log("error stopping cube 1, either an issue with remote cube connection or gCubes[1] is undefined.")
    }
  }else{
    console.log("error with stopping function, n!=0 or 1.")
   }
 };


 function movingForward(n){
      console.log('moving forward');
      if(n==0){
        if(rcUID!=undefined && isconnected1 == 0){
          console.log(rcUID);
          socket.emit('remote', 0, rcUID, 0, speed1, name, socket.id);
        }else if(rcUID!=undefined && isconnected1 == 1){
          socket.emit('remote', 0, rcUID, 1, speed1, name, socket.id);
        }else if(gCubes[0]!==undefined){
          cubeMove( 1 ,0 , speed1);
        }else{
          console.log('error moving cube 0 forward, either an issue with remote connection or gCubes[0] is undefined.')
        }
      }else if(n==1){
            if(rcUID2!=undefined && isconnected2 == 0){
              console.log(rcUID2);
              socket.emit('remote', 0, rcUID2, 0, speed2, name, socket.id);
            }else if(rcUID2!=undefined && isconnected2 == 1){
              socket.emit('remote', 0, rcUID2, 1, speed2, name, socket.id);
            }else if(gCubes[1]!==undefined){
              cubeMove( 1 ,1 , speed2);
            }else{
              console.log('error moving cube 1 forward, either an issue with remote connection or gCubes[1] is undefined.')
            }
          }
        else{
              console.log("error with movingForward function, n!=0 or 1.")
        }

    };

  function movingBack(n){

    console.log('moving back');
    if(n==0){
      if(rcUID!=undefined && isconnected1 == 0){
        console.log(rcUID);
        socket.emit('remote', 2, rcUID, 0, speed1, name, socket.id);
      }else if(rcUID!=undefined && isconnected1 == 1){
        socket.emit('remote', 2, rcUID, 1, speed1, name, socket.id);
      }else if(gCubes[0]!==undefined){
        cubeMove( 2 ,0 , speed1);
      }else{
        console.log('error moving cube 0 movingBack, either an issue with remote connection or gCubes[0] is undefined.')
      }
    }else if(n==1){
          if(rcUID2!=undefined && isconnected2 == 0){
            console.log(rcUID2);
            socket.emit('remote', 2, rcUID2, 0, speed2, name, socket.id);
          }else if(rcUID2!=undefined && isconnected2 == 1){
            socket.emit('remote', 2, rcUID2, 1, speed2, name, socket.id);
          }else if(gCubes[1]!==undefined){
            cubeMove( 2 ,1 , speed2);
          }else{
            console.log('error moving cube 1 movingBack, either an issue with remote connection or gCubes[1] is undefined.')
          }
        }
      else{
            console.log("error with movingBack, n!=0 or 1.")
      }


     };

 function movingR(n){



   let turnspeed1 = Math.floor(parseInt(speed1)*0.5);
   turnspeed1 = '0x' + turnspeed1.toString(16);

   let turnspeed2 = Math.floor(parseInt(speed2)*0.5);
   turnspeed2 = '0x' + turnspeed2.toString(16);

   console.log('moving right');
   if(n==0){
     if(rcUID!=undefined && isconnected1 == 0){
       console.log(rcUID);
       socket.emit('remote', 4, rcUID, 0, turnspeed1, name, socket.id);
     }else if(rcUID!=undefined && isconnected1 == 1){
       socket.emit('remote', 4, rcUID, 1, turnspeed1, name, socket.id);
     }else if(gCubes[0]!==undefined){
       cubeMove( 4 ,0 , turnspeed1);
     }else{
       console.log('error moving cube 0 movingR, either an issue with remote connection or gCubes[0] is undefined.')
     }
   }else if(n==1){
         if(rcUID2!=undefined && isconnected2 == 0){
           console.log(rcUID2);
           socket.emit('remote', 4, rcUID2, 0, turnspeed2, name, socket.id);
         }else if(rcUID2!=undefined && isconnected2 == 1){
           socket.emit('remote', 4, rcUID2, 1, turnspeed2, name, socket.id);
         }else if(gCubes[1]!==undefined){
           cubeMove( 4 ,1 , turnspeed2);
         }else{
           console.log('error moving cube 1 movingR, either an issue with remote connection or gCubes[1] is undefined.')
         }
       }
     else{
           console.log("error with movingR, n!=0 or 1.")
     }

    };

    function movingL(n){


         let turnspeed1 = Math.floor(parseInt(speed1)*0.5);
         turnspeed1 = '0x' + turnspeed1.toString(16);

         let turnspeed2 = Math.floor(parseInt(speed2)*0.5);
         turnspeed2 = '0x' + turnspeed2.toString(16);

         console.log('moving left');
         if(n==0){
           if(rcUID!=undefined && isconnected1 == 0){
             console.log(rcUID);
             socket.emit('remote', 3, rcUID, 0, turnspeed1, name, socket.id);
           }else if(rcUID!=undefined && isconnected1 == 1){
             socket.emit('remote', 3, rcUID, 1, turnspeed1, name, socket.id);
           }else if(gCubes[0]!==undefined){
             cubeMove( 3 ,0 , turnspeed1);
           }else{
             console.log('error moving cube 0 movingR, either an issue with remote connection or gCubes[0] is undefined.')
           }
         }else if(n==1){
               if(rcUID2!=undefined && isconnected2 == 0){
                 console.log(rcUID2);
                 socket.emit('remote', 3, rcUID2, 0, turnspeed2, name, socket.id);
               }else if(rcUID2!=undefined && isconnected2 == 1){
                 socket.emit('remote', 3, rcUID2, 1, turnspeed2, name, socket.id);
               }else if(gCubes[1]!==undefined){
                 cubeMove( 3 ,1 , turnspeed2);
               }else{
                 console.log('error moving cube 1 movingR, either an issue with remote connection or gCubes[1] is undefined.')
               }
             }
           else{
                 console.log("error with movingR, n!=0 or 1.")
           }

       };




   const initialize = () => {

     // Event Listning for GUI buttons.
     for( let cubeId of CUBE_ID_ARRAY ){
         document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {
           console.log('clicked to connect cube');
             if( cubeId === 0 ){
                 console.log("attempting to connect cube 1");
                 gCubes[0] = connectNewCube();
                 console.log('cube 0 connected (cyan)');
             }else if( cubeId === 1 ){
               console.log("attempting to connect cube 2");
                 gCubes[1] = connectNewCube();
                 console.log('cube 1 connected (green)');
             }

           });
       }




       // document.getElementById('back').addEventListener('click', async ev=>{
       //   document.getElementById('cube-connect').className = 'active';
       //   document.getElementById('cube-control').className = 'inactive';
       // })
       for(i=0;i<document.getElementsByClassName('tabitem').length;i++){
       document.getElementsByClassName('tabitem')[i].addEventListener('click', setActive, false);
     }

     // document.getElementById('close').addEventListener('click', async ev=>{
     //   document.getElementById('remoteconnect').classList.toggle('inactive');
     //   document.getElementById('remoteconnect').classList.toggle('active');
     //
     // })
     document.getElementById('toggle').addEventListener('click', async ev =>{
       document.getElementById('cube-control').classList.toggle('bbg');
        document.getElementById('canvas').classList.toggle('inactive');
        document.getElementById('dial').classList.toggle('inactive');
        document.getElementById('spd').classList.toggle('inactive');
       directControl = !directControl;
       console.log(directControl);
     })
     document.getElementById( 'connect' ).addEventListener('click', async ev=>{
       if(typeof isconnected1 == "boolean" && connecting1 == true){
         var user = document.getElementById( 'user' ).value;
         rcname1 = document.getElementById( user ).innerHTML;
         console.log(user);
         if( user != undefined && user != 0){
           document.getElementById( 'connected' ).style.display = 'block';
           document.getElementById('connected').innerHTML = "Connected to " + rcname1;
           document.getElementById('connect').innerHTML = "Disconnect";
           document.getElementById('user').style.visibility = 'hidden';
           socket.emit('user rc',  user, name, activeColor);

           if(connecting1 == true){
             console.log('user slice = ' + user.slice(-2));
             if(user.slice(-2) == "_2"){
               isconnected1 = 1;
               rcUID = user.slice(0, -2);
               document.getElementById( 'RemoteConnected1').src="images/Group 30.svg";

             }else{
               isconnected1 = 0;
               rcUID = user;
               document.getElementById( 'RemoteConnected1').src="images/Group 30.svg";

             }

             console.log("rcuid = " + rcUID);
             console.log("isconnected1 = " + isconnected1 + " ' connecting1 = '" + connecting1);
             document.getElementById("canvas").innerHTML += "<div id='toio2' class='toio'></div> "
           }
         }

       }else if(typeof isconnected2 == "boolean"  && connecting2 == true){

         var user = document.getElementById( 'user' ).value;
         rcname2 = document.getElementById( user ).innerHTML;
         console.log(user);
         if( user != undefined && user != 0){
           document.getElementById( 'connected' ).style.display = 'block';
           document.getElementById('connected').innerHTML = "Connected to " + rcname2;
           document.getElementById('connect').innerHTML = "Disconnect";
           document.getElementById('user').style.visibility = 'hidden';
           socket.emit('user rc',  user, name, activeColor);
           if(user.slice(-2) == "_2"){
             isconnected2 = 1;
              rcUID2 = user.slice(0, -2);
              document.getElementById( 'RemoteConnected2').src="images/Group 30.svg";

           }else{
             isconnected2 = 0;
             rcUID2 = user;
             document.getElementById( 'RemoteConnected2').src="images/Group 30.svg";

           }

           console.log("rcuid2 = " + rcUID2);

           document.getElementById("canvas1").innerHTML += "<div id='toio2' class='toio'></div> "


         }
       }else if(typeof isconnected1 != "boolean" && connecting1 == true){
         console.log('attempting to disconnect');
         var user = document.getElementById( 'user' ).value;
         document.getElementById('connect').innerHTML = "Connect";
         document.getElementById('user').style.visibility = 'visible';
         document.getElementById('connected').style.display = 'none';
         if(connecting1 == true){
           isconnected1 = false;
           socket.emit('rc end', rcUID);
           document.getElementById("canvas").innerHTML = "<div id='toio'> </div>";
           rcUID = undefined;
           document.getElementById( 'RemoteConnected1').src="images/Group 28.svg";

         }
       }else if(typeof isconnected2 != "boolean" && connecting2 == true){
         console.log('attempting to disconnect');
         var user = document.getElementById( 'user' ).value;
         document.getElementById('connect').innerHTML = "Connect";
         document.getElementById('user').style.visibility = 'visible';
         document.getElementById('connected').style.display = 'none';
         if(connecting2 == true){
           isconnected2 = false;
           socket.emit('rc end', rcUID2);
           document.getElementById("canvas1").innerHTML = "<div id='toio'> </div>";
           rcUID2 = undefined;
           document.getElementById( 'RemoteConnected2').src="images/Group 28.svg";

         }
         var user = null;
       }
     })


            document.getElementById('canvas').addEventListener('click', async ev => {
              getMousePos(0);
            });

            document.getElementById('canvas').addEventListener('touchstart', async ev => {
              getMousePos(0);
            });

            document.getElementById('canvas1').addEventListener('click', async ev => {
              getMousePos(1);
            });

            document.getElementById('canvas1').addEventListener('touchstart', async ev => {
              getMousePos(1);
            });

            document.getElementById('spin').addEventListener('touchstart', async ev=> {

              if(isconnected1 == 0){
                  socket.emit('spinCube',  rcUID, name, 0);
                  console.log('remote spin');
                }else if(isconnected1 == 1){
                  socket.emit('spinCube',  rcUID, name, 0);
                  console.log('remote spin');
                }
                  else{
                  spinCube( gCubes[0] );
                }
            })

            document.getElementById('spin').addEventListener('click', async ev=> {

              if(isconnected1 == 0){
                  socket.emit('spinCube',  rcUID, name, 0);
                  console.log('remote spin');
                }else if(isconnected1 == 1){
                  socket.emit('spinCube',  rcUID, name, 0);
                  console.log('remote spin');
                }
                  else{
                  spinCube( gCubes[0] );
                }
            })
            document.getElementById('party').addEventListener('touchstart', async ev=>{
              if(isconnected1 == true){
                socket.emit('party', rcUID, name);
                console.log('remote party');
              }else{

              partyCube(gCubes[0]);
            }
            })
            document.getElementById('party').addEventListener('click', async ev=>{
              if(isconnected1 == true){
                socket.emit('party', rcUID, name);
                console.log('remote party');
              }else{

              partyCube(gCubes[0]);
            }
            })

            document.getElementById('shuffle').addEventListener('touchstart', async ev=>{
              if(isconnected1 == true){
                socket.emit('shuffle', rcUID, name);
                console.log('remote shuffle');
              }else{
              cubeShuffle(gCubes[0]);
            }
            })
            document.getElementById('shuffle').addEventListener('click', async ev=>{
              if(isconnected1 == true){
                socket.emit('shuffle', rcUID, name);
                console.log('remote shuffle');
              }else{
              cubeShuffle(gCubes[0]);
            }
            })

            for(i=0;i<document.getElementsByClassName('colors').length;i++){
            document.getElementsByClassName('colors')[i].addEventListener('click', setActiveColor, false);
            document.getElementsByClassName('colors')[i].addEventListener('touchstart', setActiveColor, false);
          }

          document.getElementById('RemoteConnected1').addEventListener('click', async ev=>{
            document.getElementById('modalbg').style.display = "block";
            connecting1 = true;
            if(typeof isconnected1 != "boolean"){
              document.getElementById( 'connected' ).style.display = 'block';
              document.getElementById('connected').innerHTML = "Connected to " + rcname1;
              document.getElementById('connect').innerHTML = "Disconnect";
              document.getElementById('user').style.visibility = 'hidden';
            }else{
              var user = document.getElementById( 'user' ).value;
              document.getElementById('connect').innerHTML = "Connect";
              document.getElementById('user').style.visibility = 'visible';
              document.getElementById('connected').style.display = 'none';
            }
          })

          document.getElementById('RemoteConnected1').addEventListener('touchstart', async ev=>{
            document.getElementById('modalbg').style.display = "block";
            connecting1 = true;
            if(typeof isconnected1 != "boolean"){
              document.getElementById( 'connected' ).style.display = 'block';
              document.getElementById('connected').innerHTML = "Connected to " + rcname1;
              document.getElementById('connect').innerHTML = "Disconnect";
              document.getElementById('user').style.visibility = 'hidden';
            }else{
              var user = document.getElementById( 'user' ).value;
              document.getElementById('connect').innerHTML = "Connect";
              document.getElementById('user').style.visibility = 'visible';
              document.getElementById('connected').style.display = 'none';
            }
          })

          document.getElementById('RemoteConnected2').addEventListener('click', async ev=>{
            document.getElementById('modalbg').style.display = "block";
            connecting2 = true;
            console.log(isconnected2);
            if(typeof isconnected2 != "boolean"){
              document.getElementById( 'connected' ).style.display = 'block';
              document.getElementById('connected').innerHTML = "Connected to " + rcname2;
              document.getElementById('connect').innerHTML = "Disconnect";
              document.getElementById('user').style.visibility = 'hidden';
            }else{
              var user = document.getElementById( 'user' ).value;
              document.getElementById('connect').innerHTML = "Connect";
              document.getElementById('user').style.visibility = 'visible';
              document.getElementById('connected').style.display = 'none';
            }
          })

          document.getElementById('RemoteConnected2').addEventListener('touchstart', async ev=>{
            document.getElementById('modalbg').style.display = "block";
            connecting2 = true;
            if(typeof isconnected2 != "boolean"){
              document.getElementById( 'connected' ).style.display = 'block';
              document.getElementById('connected').innerHTML = "Connected to " + rcname2;
              document.getElementById('connect').innerHTML = "Disconnect";
              document.getElementById('user').style.visibility = 'hidden';
            }else{
              var user = document.getElementById( 'user' ).value;
              document.getElementById('connect').innerHTML = "Connect";
              document.getElementById('user').style.visibility = 'visible';
              document.getElementById('connected').style.display = 'none';
            }
          })

          document.getElementById('modalbg').addEventListener('click', closeModal);

          document.getElementById('modalbg').addEventListener('touchstart', closeModal);

          document.getElementById('x').addEventListener('click', closeModal);

          document.getElementById('x').addEventListener('touchstart', closeModal);


   }

function closeModal(e){
  if((e.target.id == "modalbg" || e.target.id == "close") && (connecting1 == true || connecting2 ==true)){
  document.getElementById('modalbg').style.display = "none";
  connecting2 = false;
  connecting1 = false;
}
}

   socket.on("connect", () => {
     console.log(socket.connected); // true
     socket.emit("handshake");
   });

   socket.on("ulist connect", (activeUsers) => {
     userlist = activeUsers;
     console.log(userlist);
     console.log(userlist.length);
   });



   socket.on('handshake', (activeUsers) =>{
     console.log(activeUsers);
     document.getElementById('user').length = 0;
     for(let i=0;i<activeUsers.length;  i++){
    if(activeUsers[i].name !== undefined && activeUsers[i].userID != socket.id){
    if(activeUsers[i].bt1 == true){
     console.log(i, " ", activeUsers[i].name);
     select = document.getElementById('user');
     var opt = document.createElement('option');

     opt.setAttribute('id', activeUsers[i].userID);
     opt.value = activeUsers[i].userID;
     opt.innerHTML = activeUsers[i].name + " (1)";
     select.appendChild(opt);
     console.log('added ' + activeUsers[i].name);
   }

   if(activeUsers[i].bt2 == true){

     console.log(i, " ", activeUsers[i].name);
     select = document.getElementById('user');
     var opt = document.createElement('option');
     //fix this, it's wrong
     opt.setAttribute('id', activeUsers[i].userID + "_2");
     opt.value = activeUsers[i].userID + "_2";
     opt.innerHTML = activeUsers[i].name + " (2)";
     select.appendChild(opt);
     console.log('added ' + activeUsers[i].name);
   }
   }
   }

   })

    socket.on('user list', (activeUsers, newUser, cube) => {
      let usersList = activeUsers;
      console.log(name);
      console.log(newUser);
      const sessionID = socket.id;
      console.log("session ID " + sessionID);
      if(sessionID !== newUser.userID){
        if(cube==0){
      select = document.getElementById('user');
      var opt = document.createElement('option');
      opt.setAttribute('id', newUser.userID);
      opt.value = newUser.userID;
      opt.innerHTML = newUser.name + " (1)";
      select.appendChild(opt);
      console.log('adding cube 1');
      console.log(activeUsers);
    }
       else if(cube==1){
         select = document.getElementById('user');
         var opt = document.createElement('option');
         opt.setAttribute('id', newUser.userID + "_2");
         opt.value = newUser.userID + "_2";
         opt.innerHTML = newUser.name + " (2)";
         select.appendChild(opt);
         console.log('adding cube 2');
         console.log(activeUsers);
         }
    }
   console.log(usersList, " ", newUser);
     });



    socket.on('user left', (userName, UID) => {
    console.log(userName, " left the room");
    if(document.getElementById(UID) !=null){
      var x = document.getElementById(UID);
      x.remove(x.selectedIndex);
    }
    if(document.getElementById(UID + "_2") !=null){
     var x= document.getElementById(UID + "_2");
     x.remove(x.selectedIndex);
    }
    if(document.getElementById(userName) != null){
    var x = document.getElementById(userName);
    x.remove(x.selectedIndex);
  }
  var un2 = userName + " 2";
  if(document.getElementById(un2) != null){
    var y = document.getElementById(un2);
    console.log("remove " + y);
    y.remove(y.selectedIndex);
  }


      });

      socket.on('user rc', (userID, ruser, rname, rcolor) =>{
          //rcUID = userID;
          if(socket.id == userID){
            //rcUID = undefined;

          }else{

          }
          console.log(userID);
          pUID.push(ruser);
          console.log("remote connection");
          socket.emit('rpos', toiox[0], toioy[0], 0, name, pUID[i], directControl, a);
      });

      socket.on('user rc 2', (userID2) =>{
          rcUID2 = userID2;
          if(socket.id == userID2){
            rcUID2 = undefined;
          }
          console.log(rcUID2);
      });

socket.on('joystick', (nCube, x, y,speed, uname, controllingUID) =>{
  const cube = gCubes[nCube];
   console.log('forward');

   if( cube !== undefined && socket.id != controllingUID){
   moveJoystick(nCube, x,y, false);
   }

});


socket.on('r', (nCube, characteristic, rbuf, uname) =>{
  btCube(nCube, characteristic, rbuf);
  console.log('remote control', uname);
  if(rbuf[0] == 0x03){
    console.log(uname + " moved your toio with canvas control");
  }else if(rbuf[0] == 0x01){
    console.log(uname + " moved your toio with dpad");
  }
});

socket.on('rpos', (x, y, an, uname, dirCon, a) =>{
  if(uname != name){
  drawToio(1, x,y);
  cubepos = [a[7], a[8], a[9], a[10]];
  // if(dirCon == true){
  //   let buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed1,0x00, 0x00,x[0], x[1],y[0],y[1],an[0],an[1]]);
  //   console.log(buf4);
  //     btCube(0, 0, buf4);
  // }
}
  // console.log('rpos ' + x + " , " + y);
});

socket.on('dc', (x, y, an, uname, dirCon, speed) =>{
  if(uname != name){
  if(dirCon == true){
    let buf4 = new Uint8Array([0x03,0x00,0x05,0x00,speed,0x00, 0x00,x[0], x[1],y[0],y[1],an[0],an[1]]);
    console.log(uname + ' moved your toio with dc');
    let matx = String(parseInt(x[1])) + String(parseInt(x[0])-70);
    let maty = String(parseInt(y[1])) + String(parseInt(y[0])-70);
    console.log(uname + " moved your toio to x: " + matx + " , y: " + maty);
    // console.log(buf4);
      btCube(0, 0, buf4);
  }
}
  // console.log('dc ' + x + " , " + y);
});

socket.on('spinCube', (user, uname) =>{
  if(uname !=name && gCubes[0] != undefined){
    spinCube(gCubes[0]);
  }
})

socket.on('party', (user, uname) =>{
  if(uname !=name && gCubes[0] != undefined){
    partyCube(gCubes[0]);
  }
})

socket.on('shuffle', (user, uname) =>{
  if(uname !=name && gCubes[0] != undefined){
    cubeShuffle(gCubes[0]);
  }
})

socket.on('forward', (nCube, speed, uname, userid) => {
const cube = gCubes[nCube];
console.log('forward remote');
console.log(socket.id);
console.log(userid);
if( cube !== undefined && userid != socket.id){
cubeMove( 1, nCube, speed);
console.log('forward remote');

}


 });

 socket.on('back', (nCube, speed, uname, userid) => {
 const cube = gCubes[nCube];
 console.log('back');
 if( cube !== undefined && userid != socket.id){
 cubeMove( 2, nCube, speed );
 }
  });

  socket.on('left', (nCube, speed, uname, userid) => {
  const cube = gCubes[nCube];
  console.log('left');
  if( cube !== undefined && userid != socket.id){
  cubeMove( 3, nCube, speed );
  }

   });

   socket.on('right', (nCube, speed, uname) => {
   const cube = gCubes[nCube];
   console.log('right');
   if( cube !== undefined && rcUID != socket.id){
   cubeMove( 4, nCube , speed);
   }

    });

    socket.on('stop', (nCube, speed, uname) => {
    const cube = gCubes[nCube];
    console.log('stop');
    if( cube !== undefined && rcUID != socket.id){
    cubeStop( nCube );
    }

     });

     socket.on('charge', (nCube, speed) => {
     const cube = gCubes[nCube];
     console.log('charge');
     if( cube !== undefined ){
     cubeMove( 5, nCube , 0xFF);
     }

      });

socket.on('remote user', (rUID, rname, rcolor) => {
  pUID.push(rUID);
  console.log("remote user connected " + pUID);
    console.log(rname + " connected remotely");
    console.log(rname + ' connected to your toio ' + rcolor);
    document.getElementsByClassName('connected_user')[0].innerHTML += "<h5 style='color:"+rcolor +"' id='user_" +rUID + "'>"+ rname + "</h5>";
});

socket.on('rc end', (rUID) =>{
  const index = pUID.indexOf(rUID);
if (index > -1) {
  pUID.splice(index, 1);
}
console.log('remote user disconnected, removing ' + rUID +" from list of connected users: " + pUID);
if(document.getElementById('user_' + rUID) !=null){
document.getElementById('user_' + rUID).innerHTML = " ";
}
})

slider1.oninput = function() {
val = parseInt(document.getElementById("slider1").value);
speed1 = littleEndian(val)[0];
// console.log((254).toString(16))
console.log(val);
console.log(speed1);
}

slider2.oninput = function() {
val = parseInt(document.getElementById("slider2").value);
speed2 = littleEndian(val)[0];
// console.log((254).toString(16))
console.log(val);
console.log(speed2);
}


// slider2.oninput = function(){
//   s2val = parseInt(slider2.value);
//   angle = littleEndian(s2val);
//   console.log("angle: " + s2val);
//   console.log("angle: " + angle);
//   changeAngle();
// }

   initialize();
