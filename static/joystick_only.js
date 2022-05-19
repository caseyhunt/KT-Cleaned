if(typeof myp5 === 'undefined'){

  let joystick = function(p) {
    let touchtol = 10;
    let center;

    let scale;
    if(window.innerWidth<1120){
      scale = 0.15;
      center = [(100)/2, (100)/2]; //x,y
      console.log(scale);
      console.log('changing scale');
    }else{
      scale = 0.4;
      center = [(250)/2, (250)/2]; //x,y
      console.log(scale);
    }
    let triscale = scale*2.5;


    //radius of the base of the joystick
    let brad = 200*scale;
    let nrad = .36*brad;

    //center = [center[0],200];
    let outx = 0;
    let outy =0;
    let circx = 100*scale;
    let circy = 100*scale;
    let outsidetol = 0.1 * scale;

    let direction = ['stop', 'top', 'right', 'bottom', 'left'];
    let movedir = 0; //0 = none, 1 = top, 2= right, 3=bottom, 4=left

    let prev = [0,0];

    let pressed = false;
    let inCanvas;

    let insideTri = false;

    p.setup = function() {
      var myCanvas = p.createCanvas(250,250);
    myCanvas.parent('dial');
    }

    p.draw = function() {

      //using outx and outy to change the color of the background (to see mapping)
      p.background('#e4edec');
      p.stroke(210,210,210);
      p.noFill();

      //draw inner and outer circle joystick
      p.drawJoystick();

      p.fill(33, 150, 243);
      p.noStroke();
      p.drawTriangles();

      p.noFill();
      p.push();

      //wtf below?
      if(inside==true){
        p.fill(0,0,0);
      }else{
        p.fill(100,0,0);
      }

      //draw a circle where the mouse is
      // circle(mouseX, mouseY, 30);
      p.pop();


      //
      dragging = p.insideCirc(center[0],center[1],nrad/2);


      p.fill(26, 134, 219);

      if(p.mouseX<0 || p.mouseY<0 || p.mouseX>p.width || p.mouseY>p.height){
        inCanvas = false;
      }else{
        inCanvas = true;
      }

      //if the mouse is pressed inside the circle
      //then move the circle where the mouse is

      if(inside == true && pressed == true ){
        nubx = p.mouseX;
        nuby = p.mouseY;
      p.circle(p.mouseX,p.mouseY,nrad);


    }else if(inside == false && pressed == true  && inCanvas == true){
        //if mouse is pressed outside the circle
        //calculate angle of mouse from center circle

        stickangle = p.atan(p.abs(p.mouseY - center[1])/p.abs(p.mouseX - center[0]));
        //so you can use trig to
        //calculate displacement from center x
        if(p.mouseX<center[0]){
          //if x is less than zero
          nubx = -(p.cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

        }else{
          //or x or greater than zero
        nubx = (p.cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

        }

        //AND
        //calculate displacement from center y
        if(p.mouseY<center[1]){
          //if y is less than zero
            nuby = -(p.sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

          }else{
            //or greater than zero
          nuby = (p.sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

          }
      }
        else{
          nubx = center[0];
          nuby = center[1];
            p.circle(center[0],center[1],nrad);
        }

          p.circle(nubx, nuby, nrad);

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

      if(pressed == true && inCanvas ==true && insideTri == false){
      p.print(outx, outy);
      if(typeof isconnected1 != 'boolean'){
        moveJoystick(0, outx, outy, true, undefined);
      }else {
        p.print('local joystick')
      moveJoystick(0, outx, outy, false, undefined);
    }
    }else if(pressed == false&& inCanvas == true){
      stopping(0);
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


    }


    //is the cursor inside the circle?
    p.insideCirc = function(centerx, centery, crad){
      if(p.pow(p.mouseX-centerx,2)+p.pow(p.mouseY-centery,2) < p.pow(crad,2)){
         return true;
         }else{
          return false;
         }
    }


    p.drawTriangles = function(){
      //top
      p.triangle(center[0], center[1]-(brad/(2.5)+ 50*triscale), center[0]-25*triscale, center[1]-(brad/(2.5)+ 25*triscale), center[0]+25*triscale, center[1]-(brad/(2.5)+ 25*triscale));

      //bottom
      p.triangle(center[0], center[1]+(brad/2.5+ 50*triscale), center[0]-25*triscale, center[1]+(brad/2.5)+25*triscale, center[0]+25*triscale, center[1]+(brad/2.5)+25*triscale);

      //right
        p.triangle(center[0]+(brad/2.5+ 50*triscale), center[1],center[0]+(brad/2.5)+25*triscale, center[1]-25*triscale,center[0]+(brad/2.5)+25*triscale, center[1]+25*triscale);

      //left
      p.triangle(center[0]-(brad/2.5+ 50*triscale), center[1],center[0]-(brad/2.5)-25*triscale, center[1]+25*triscale,center[0]-(brad/2.5)-25*triscale, center[1]-25*triscale);
    }

    p.insideTriangles = function(){
      //it's actually a rectangle but no one cares.
      //top
      ty = [center[1]-(brad/2.5)-25*triscale, center[1]-(brad/2.5)-50*triscale ]; //max, min
      tx = [center[0]-25*triscale, center[0]+25*triscale];

      //right
      ry = [center[1]+25*triscale, center[1]-25*triscale]; //max, min
      rx = [center[0]+((brad/2.5)+25*triscale), center[0]+((brad/2.5)+50*triscale)];

      //left
      lx = [center[0]-((brad/2.5)+25*triscale), center[0]-((brad/2.5)+50*triscale)];

      //down
      by = [center[1]+(brad/2.5)+50*triscale, center[1]+(brad/2.5)+25*triscale];

      //print(tx[0]);
      if(p.mouseY< ty[0] && p.mouseY> ty[1] && p.mouseX<tx[1] && p.mouseX>tx[0]){
        movedir = 1;
        insideTri = true;
        movingForward(0);
        p.print('forward');
      }else if(p.mouseY< ry[0] && p.mouseY> ry[1] && p.mouseX<rx[1] && p.mouseX>rx[0]){
        movedir = 2;
        insideTri = true;
        movingR(0);
        p.print('right');
      }else if(p.mouseY<by[0] && p.mouseY> by[1]  && p.mouseX>tx[0] && p.mouseX<tx[1]){
        movedir = 3;
        insideTri = true;
        movingBack(0);
        p.print('back');
      }else if(p.mouseY< ry[0] && p.mouseY> ry[1] && p.mouseX<lx[0] && p.mouseX>lx[1]){
        movedir = 4;
        insideTri = true;
        movingL(0);
        p.print('left');
      }else if(pressed==false && inCanvas == true){
        movedir = 0;
        insideTri = false;

        stopping(0);

      }
      p.print('movedir ' + movedir);
      p.print(direction[movedir]);
    }


    //is the mouse down?
    p.mousePressed = function(){
      pressed = true;
      p.insideTriangles();
    }

    p.mouseReleased = function(){
      pressed = false;
      triangles = 0;
      insideTri = false;
      inRect = false;
      if(p.mouseX<p.width && p.mouseX>0 && p.mouseY<p.height && p.mouseY>0){
     stopping(0);
    }
    }

    p.drawJoystick = function(){
      p.fill(255,255,255);
      p.circle(center[0], center[1], brad);

      inside = p.insideCirc(center[0],center[1], (brad/2)-(brad/2)*outsidetol);

      inner = p.insideCirc(center[0],center[1],(nrad/2)-(nrad/2*outsidetol));
    }
  }

let myp5 = new p5(( joystick ));

let joystick1 = function(p) {
      let touchtol = 10;
      let scale;
      let center;
      if(window.innerWidth<1120){
        scale = 0.15;
        console.log(scale);
        center = [(100)/2, (100)/2];
        console.log('changing scale');
      }else{
        scale = 0.4;
        center = [(250)/2, (250)/2];
        console.log(scale);
      }

      //let scale = 0.40;
      let triscale = scale * 2.5;


      //radius of the base of the joystick
      let brad = 200*scale;
      let nrad = .36*brad;
      //center = [center[0],200];
      let outx = 0;
      let outy =0;
      let circx = 100*scale;
      let circy = 100*scale;
      let outsidetol = 0.1 * scale;

      let direction = ['stop', 'top', 'right', 'bottom', 'left'];
      let movedir = 0; //0 = none, 1 = top, 2= right, 3=bottom, 4=left

      let prev = [0,0];

      let pressed = false;
      let inCanvas;
      let insideTri = false;


      p.setup = function() {
        var myCanvas = p.createCanvas(250,250);
      myCanvas.parent('dial1');
      }

      p.draw = function() {

        //using outx and outy to change the color of the background (to see mapping)
        p.background('#e4edec');
        p.stroke(210,210,210);
        p.noFill();

        //draw inner and outer circle joystick
        p.drawJoystick();

        p.fill(33, 150, 243);
        p.noStroke();
        p.drawTriangles();

        p.noFill();
        p.push();

        //wtf below?
        if(inside==true){
          p.fill(0,0,0);
        }else{
          p.fill(100,0,0);
        }

        //draw a circle where the mouse is
        // circle(mouseX, mouseY, 30);
        p.pop();


        //
        dragging = p.insideCirc(center[0],center[1],nrad/2);


        p.fill(26, 134, 219);

        if(p.mouseX<0 || p.mouseY<0 || p.mouseX>p.width || p.mouseY>p.height){
          inCanvas = false;
        }else{
          inCanvas = true;
        }

        //if the mouse is pressed inside the circle
        //then move the circle where the mouse is

        if(inside == true && pressed == true ){
          nubx = p.mouseX;
          nuby = p.mouseY;
        p.circle(p.mouseX,p.mouseY,nrad);


      }else if(inside == false && pressed == true  && inCanvas == true){
          //if mouse is pressed outside the circle
          //calculate angle of mouse from center circle

          stickangle = p.atan(p.abs(p.mouseY - center[1])/p.abs(p.mouseX - center[0]));
          //so you can use trig to
          //calculate displacement from center x
          if(p.mouseX<center[0]){
            //if x is less than zero
            nubx = -(p.cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

          }else{
            //or x or greater than zero
          nubx = (p.cos(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[0];

          }

          //AND
          //calculate displacement from center y
          if(p.mouseY<center[1]){
            //if y is less than zero
              nuby = -(p.sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

            }else{
              //or greater than zero
            nuby = (p.sin(stickangle)*((brad/2)-(brad/2)*outsidetol))+center[1];

            }
        }
          else{
            nubx = center[0];
            nuby = center[1];
              p.circle(center[0],center[1],nrad);
          }

            p.circle(nubx, nuby, nrad);

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

        if(pressed == true && inCanvas ==true && insideTri ==false){
        p.print(outx, outy);
        if(typeof isconnected2 != 'boolean'){
          moveJoystick(1, outx, outy, true, undefined);
        }else {
        moveJoystick(1, outx, outy, false, undefined);
      }
      }else if(pressed == false&& inCanvas == true){
        stopping(1);
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


      }


      //is the cursor inside the circle?
      p.insideCirc = function(centerx, centery, crad){
        if(p.pow(p.mouseX-centerx,2)+p.pow(p.mouseY-centery,2) < p.pow(crad,2)){
           return true;
           }else{
            return false;
           }
      }


      p.drawTriangles = function(){
        //top
        p.triangle(center[0], center[1]-(brad/(2.5)+ 50*triscale), center[0]-25*triscale, center[1]-(brad/(2.5)+ 25*triscale), center[0]+25*triscale, center[1]-(brad/(2.5)+ 25*triscale));

        //bottom
        p.triangle(center[0], center[1]+(brad/2.5+ 50*triscale), center[0]-25*triscale, center[1]+(brad/2.5)+25*triscale, center[0]+25*triscale, center[1]+(brad/2.5)+25*triscale);

        //right
          p.triangle(center[0]+(brad/2.5+ 50*triscale), center[1],center[0]+(brad/2.5)+25*triscale, center[1]-25*triscale,center[0]+(brad/2.5)+25*triscale, center[1]+25*triscale);

        //left
        p.triangle(center[0]-(brad/2.5+ 50*triscale), center[1],center[0]-(brad/2.5)-25*triscale, center[1]+25*triscale,center[0]-(brad/2.5)-25*triscale, center[1]-25*triscale);
      }

      p.insideTriangles = function(){
        //it's actually a rectangle but no one cares.
        //top
        ty = [center[1]-(brad/2.5)-25*triscale, center[1]-(brad/2.5)-50*triscale ]; //max, min
        tx = [center[0]-25*triscale, center[0]+25*triscale];

        //right
        ry = [center[1]+25*triscale, center[1]-25*triscale]; //max, min
        rx = [center[0]+((brad/2.5)+25*triscale), center[0]+((brad/2.5)+50*triscale)];

        //left
        lx = [center[0]-((brad/2.5)+25*triscale), center[0]-((brad/2.5)+50*triscale)];

        //down
        by = [center[1]+(brad/2.5)+50*triscale, center[1]+(brad/2.5)+25*triscale];

        //print(tx[0]);
        if(p.mouseY< ty[0] && p.mouseY> ty[1] && p.mouseX<tx[1] && p.mouseX>tx[0]){
          movedir = 1;
          insideTri = true;
          movingForward(1);
          p.print('forward');
        }else if(p.mouseY< ry[0] && p.mouseY> ry[1] && p.mouseX<rx[1] && p.mouseX>rx[0]){
          movedir = 2;
          insideTri = true;
          movingR(1);
          p.print('right');
        }else if(p.mouseY<by[0] && p.mouseY> by[1]  && p.mouseX>tx[0] && p.mouseX<tx[1]){
          movedir = 3;
          insideTri = true;
          movingBack(1);
          p.print('back');
        }else if(p.mouseY< ry[0] && p.mouseY> ry[1] && p.mouseX<lx[0] && p.mouseX>lx[1]){
          movedir = 4;
          insideTri = true;
          movingL(1);
          p.print('left');
        }else if(pressed==false && inCanvas == true){
          movedir = 0;
          stopping(1);
          insideTri = false;


        }
        p.print('movedir ' + movedir);
        p.print(direction[movedir]);
      }


      //is the mouse down?
      p.mousePressed = function(){
        pressed = true;
        p.insideTriangles();
      }

      p.mouseReleased = function(){
        pressed = false;
        triangles = 0;
        insideTri = false;
        inRect = false;
        if(p.mouseX<p.width && p.mouseX>0 && p.mouseY<p.height && p.mouseY>0){
       stopping(1);
      }
      }

      p.drawJoystick = function(){
        p.fill(255,255,255);
        p.circle(center[0], center[1], brad);

        inside = p.insideCirc(center[0],center[1], (brad/2)-(brad/2)*outsidetol);

        inner = p.insideCirc(center[0],center[1],(nrad/2)-(nrad/2*outsidetol));
      }
    }

      let myp51 = new p5(( joystick1 ));
    }
