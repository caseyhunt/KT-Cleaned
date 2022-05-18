

let inside;
let pressed;
let dragging;
let stickangle;

let touchtol = 10;
let scale = 0.40;


//radius of the base of the joystick
let brad = 200*scale;
let nrad = .36*brad;
let center = [(425*scale)/2, (600*scale)/2]; //x,y
center = [center[0],200];
let outx = 0;
let outy =0;
let circx = 100*scale;
let circy = 100*scale;
let outsidetol = 0.1 * scale;

let direction = ['stop', 'top', 'right', 'bottom', 'left'];
let movedir = 0; //0 = none, 1 = top, 2= right, 3=bottom, 4=left

let prev = [0,0];



//variables for dial
let dcenter;
dcenter = [(425*scale)/2, (250*scale)/2]; //x,y
//let center = [(600*scale)/2, (600*scale)/2]; //x,y
let diam = brad*1.1;
//diameter of dial nub
let dialnub = 35;
let theta;
let mx = 43;
let my = 0;
let ang = 0;
dangle = ang;

function setup() {
var myCanvas = createCanvas(425*scale, 710*scale);
myCanvas.parent('dial');
    theta = 2*PI/4;
}

function draw() {

  //using outx and outy to change the color of the background (to see mapping)
  background(255, 255, 255);
  stroke(210,210,210);
  noFill();

  //draw inner and outer circle joystick
  drawJoystick();

  fill(33, 150, 243);
  noStroke();
  drawTriangles();

  noFill();
  push();
  if(inside==true){
    fill(0,0,0);
  }else{
    fill(100,0,0);
  }

  //draw a circle where the mouse is
  // circle(mouseX, mouseY, 30);
  pop();


  //
  dragging = insideCirc(center[0],center[1],nrad/2);

  //TO DO: If mouse is NEAR the center circle but not necessarily in it
  //wait until there's movement outside the tolerance zone before moving the circle

  fill(26, 134, 219);

  if(mouseX<0 || mouseY<0 || mouseX>width || mouseY>height){
    inCanvas = false;
  }else{
    inCanvas = true;
  }

  //if the mouse is pressed inside the circle
  //then move the circle where the mouse is
  if(inside == true && pressed == true ){
    nubx = mouseX;
    nuby = mouseY;
  circle(mouseX,mouseY,nrad);
}else if(inside == false && pressed == true  && inCanvas == true && mouseY > height/3){
    //if mouse is pressed outside the circle
    //calculate angle of mouse from center circle
    stickangle = atan(abs(mouseY - center[1])/Math.abs(mouseX - center[0]));
    //so you can use trig to
    //calculate displacement from center x
    if(mouseX<center[0]){
      //if x is less than zero
      nubx = -(cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

    }else{
      //or x or greater than zero
    nubx = (cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

    }

    //AND
    //calculate displacement from center y
    if(mouseY<center[1]){
      //if y is less than zero
        nuby = -(sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

      }else{
        //or greater than zero
      nuby = (sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

      }
  }
    else{
      nubx = center[0];
      nuby = center[1];
        circle(center[0],center[1],nrad);
    }

      circle(nubx, nuby, nrad);

  outx = (nubx-center[0])/(brad/2);
  outy = (nuby-center[1])/(brad/2);
  if(outx!=prev[0] || outy!=prev[1]){
  prev = [outx, outy];

  if(outy <0){
    fw1 = true;
    fw2 = true;
  }else if(outy>0){
    fw1 = false;
    fw2 = false;
  }

  if(pressed == true && inCanvas ==true){
  print(outx, outy);
  moveJoystick(outx, outy, true);
}else if(pressed == false&& inCanvas == true){
  stopping();
}

  }







  //this is the output x and y to the console/toios/whatever
  //these values are a number betwen -0.5 and 0.5
  //speed is absolute value
  //left/right motor speed are a function of a fraction of the speed.
  //print(abs(outx*255), abs(outy*255));

  //uncomment this code to check scale for joystick
  //this property is additive so it's for moving things that need fixed position
  //this code is currently factored for objects in the physical world
  //so it needs to send a motor speed instead of a positon :D
  //   circx += outx;
  //   circy += outy;

  //this circle moves around using the above values ^
  //   circle(circx,circy,30);


  //dial
  rectMode(CENTER);
  stroke(210);
  strokeWeight(1);
  fill(250, 220, 210);
  circle(dcenter[0],dcenter[1],diam);
  fill(245, 87, 34);//250, 220, 210
  noStroke();
  if(my>=0){
  circle(dcenter[0]+(diam/4)*sin(theta), dcenter[1]+(diam/4)*cos(theta), dialnub);
    }else{
  circle(dcenter[0]-(diam/4)*sin(theta), dcenter[1]-(diam/4)*cos(theta), dialnub);
    }


  if(mouseIsPressed && mouseY < height/3){

    mx = mouseX-dcenter[0];
    my = mouseY - dcenter[1];

      if(pow(mouseX-dcenter[0], 2) + pow(mouseY-dcenter[1], 2) < pow(diam*2/3,2)){
          print(mx, my);
      theta = atan(mx/my);

    if(my>=0){
      if(mx>=0){
        ang=270+abs(int(degrees(theta)));
  }else{
    ang = 270-abs(int(degrees(theta)));
    // print('bottom left quadrant');
  }
    }else{
        if(mx>=0){
          ang = 90-abs(int(degrees(theta)));
      // print('top right quadrant');
    }else{
      ang = 90+abs(int(degrees(theta)));
      // print('top left quadrant');
    }
    }
    ang = littleEndian(ang);

      if(ang != undefined && cubeControl == true && xgo != undefined){
        print("angle: " + ang[0] + "," + ang[1]);
        dangle = ang;
      changeAngle(ang);
    }
   }
  }
}


//is the cursor inside the circle?
function insideCirc(centerx, centery, crad){
  if(pow(mouseX-centerx,2)+pow(mouseY-centery,2) < pow(crad,2)){
     return true;
     }else{
      return false;
     }
}


function drawTriangles(){
  //top
       triangle(center[0], center[1]-(brad/2.5+ 50), center[0]-25, center[1]-(brad/2.5+ 25), center[0]+25, center[1]-(brad/2.5+ 25));

  //bottom
  triangle(center[0], center[1]+(brad/2.5+ 50), center[0]-25, center[1]+(brad/2.5)+25, center[0]+25, center[1]+(brad/2.5)+25);

  //right
    triangle(center[0]+(brad/2.5+ 50), center[1],center[0]+(brad/2.5)+25, center[1]-25,center[0]+(brad/2.5)+25, center[1]+25);

  //left
  triangle(center[0]-(brad/2.5+ 50), center[1],center[0]-(brad/2.5)-25, center[1]+25,center[0]-(brad/2.5)-25, center[1]-25);
}

function insideTriangles(){
  //it's actually a rectangle but no one cares.
  //top
  ty = [center[1]-(brad/2.5)-25, center[1]-(brad/2.5)-50 ]; //max, min
  tx = [center[0]-25, center[0]+25];

  //right
  ry = [ center[1]+25, center[1]-25]; //max, min
  rx = [center[0]+((brad/2.5)+25), center[0]+((brad/2.5)+50)];

  //left
  lx = [center[0]-((brad/2.5)+25), center[0]-((brad/2.5)+50)];

  //down
  by = [center[1]+(brad/2.5)+50, center[1]+(brad/2.5)+25];

  //print(tx[0]);
  if(mouseY< ty[0] && mouseY> ty[1] && mouseX<tx[1] && mouseX>tx[0]){
    movedir = 1;
    movingForward();
    print('forward');
  }else if(mouseY< ry[0] && mouseY> ry[1] && mouseX<rx[1] && mouseX>rx[0]){
    movedir = 2;
    movingR();
    print('right');
  }else if(mouseY<by[0] && mouseY> by[1]  && mouseX>tx[0] && mouseX<tx[1]){
    movedir = 3;
    movingBack();
    print('back');
  }else if(mouseY< ry[0] && mouseY> ry[1] && mouseX<lx[0] && mouseX>lx[1]){
    movedir = 4;
    movingL();
    print('left');
  }else if(pressed==false && inCanvas == true){
    movedir = 0;
    stopping();

  }
  print('movedir ' + movedir);
  print(direction[movedir]);
}


//is the mouse down?
function mousePressed(){
  pressed = true;
  insideTriangles();
}

function mouseReleased(){
  pressed = false;
  triangles = 0;
  inRect = false;
  if(mouseX<width && mouseX>0 && mouseY<height && mouseY>0){
  stopping();
}
}

function drawJoystick(){
    fill(221, 230, 237);
  circle(center[0], center[1], brad);

    inside = insideCirc(center[0],center[1], (brad/2)-(brad/2)*outsidetol);

    inner = insideCirc(center[0],center[1],(nrad/2)-(nrad/2*outsidetol))
}
