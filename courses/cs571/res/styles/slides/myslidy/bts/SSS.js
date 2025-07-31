  	 
/**
  SSS - canvas-based slideshow
  Saty, 9/09
*/


// turn on and off, any o'lay :)
function togDiv(id) {
     if(document.getElementById(id).style.visibility== "hidden"){
       document.getElementById(id).style.visibility= "visible";
     }
     else {
       document.getElementById(id).style.visibility = "hidden";
     }
 }

// resize the img, to fit canvas, if nec.
// also, compute offsets!
function newWdHt(cw,ch,iw,ih)
{
   var w,h;

  // if both iw and ih are smaller, no resizing..
  if((iw<=cw)&&(ih<=ch))
  {
      w = iw;
      h = ih;
      ow = 0.5*(cw-iw);
      oh = 0.5*(ch-ih);
      var nwh = new Array(w,h,ow,oh);
      return nwh;
  }

  var car = cw/ch, iar=iw/ih;
  if(car<=iar)
  {
     // w=cw, derive new ht
     w = cw;
     h = cw/iar;
     ow=0;
     oh = 0.5*(ch-h);
     var nwh = new Array(w,h,ow,oh);
     return nwh;
  }
  else
  {
     // // h=ch, derive new wd
     h = ch;
     w = ch*iar;
     oh=0;
     ow=0.5*(cw-w);
     var nwh = new Array(w,h,ow,oh);
     return nwh;
  }

  
}

// test, not used..
function onepic(id,first)
{
   canvas = document.getElementById(id);
   context = canvas.getContext("2d");
   img = new Image();
   // img.src = "http://www.smartcg.com/tech/cg/courses/TDC_Math/misc/myPics.2.jpg";
   img.src = first;
   context.clearRect(0,0,canvas.width,canvas.height);  
   var newwh = newWdHt(canvas.width,canvas.height,img.width,img.height);
   context.drawImage(img, newwh[2], newwh[3],newwh[0],newwh[1]);
}


// function SSS(id,basenm,numframe,delay)
// there are two ways to use the constructor:
// 1. provide a basedir [MUST end w/ a slash!], an image list [with arbitrary names!], delay indx - nfr is IGNORED
// 2. provide a basenm (dir+img), EMPTY image list, delay indx, img count 
// Note - imgs MUST be named <nm>.0.jpg, <nm>.1.jpg..
// 1 or 2 depends on how the images are named..
function SSS(id,basedir,imglist,dly,nfr)
{

    var sId=0; /* session ID */
    var currframe = -1;
    var cId = id; /* canvas id */
    var numframe = imglist.length; 

    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    var playstate=0; // -2,-1,0,1,2
    var delayIndx=dly; // user passes in 0..11
    var delayArray = [0.125,0.25,0.5,1,5,7,10,12,15,18,20,24,28,30];
    var delay = 1000.0/delayArray[delayIndx]; 
    var hud=0; // heads-up display :)
    var startStop=0; // toggled via spacebar
  


    // method decl., for external ones.. In other words, map public to internal ones
    this.startF = startF;
    this.startB = startB;
    this.stop = stop;
    this.resetS = resetS;
    this.resetE = resetE;
    this.stepF = stepF;
    this.stepB = stepB;
    this.setDelay = setDelay;
    this.stepDelay = stepDelay;
    this.fpsLess = fpsLess;
    this.fpsMore = fpsMore;
    this.fpsWhat = fpsWhat;
    this.doSS = doSS;
    this.startFO = startFO; // O - once
    this.startBO = startBO;

    // preload imgs
    var imgNames=[]; 
    var imgArray=[];
    if(imglist.length!=0)
    {
     for (i=0; i<numframe; i++)
     {
        imgArray[i]=new Image();
        imgArray[i].src = basedir + imglist[i];
        imgNames[i] = basedir + imglist[i];
     }
    }
    else
    {
     numframe = nfr;
     for (i=0; i<numframe; i++)
     {
        imgArray[i]=new Image();
        imgArray[i].src=basedir + i+ ".jpg";
        imgNames[i] = basedir + imglist[i];
     }       
    }//else

    // init -help on controls
    set_textRenderContext(context);
    if(check_textRenderContext(context)) {
      var sz1=11, sz2=8; // work well for a 300 width frame..
      if(canvas.width<300) {
        sz1 = ((canvas.width)/300.0)*11;
        sz2 = ((canvas.width)/300.0)*8;
      }
     context.strokeText("Click anywhere to show/hide controls:", 4,10,sz1);
     context.strokeText("* <<, >>: first/last frame", 4,25,sz1);
     context.strokeText("* <*1, >*1: play once from curr, rev/fwd", 4,40,sz1);
     context.strokeText("* <, >: play (loop) rev/fwd", 4,55,sz1);
     context.strokeText("* <|, >|: prev/next frame", 4,70,sz1);
     context.strokeText("* fps -/+: decr/incr fps", 4,85,sz1);
     context.strokeText("* ??: HUD toggle",4,100,sz1);
     context.strokeText("* ||: halt", 4,115,sz1);
     context.strokeText("Note - fps steps: 0.125,0.25,0.5,1,5,7,10,12,15,18,20,24,28,30", 4,130,sz2);
    }
    /////////////////////
    
    function stop()
    {
        clearInterval(sId);
        playstate=0;
    }

    // frame num set to start or end
    function resetS()
    {
        currframe=-1;
        playFwd();
    }

    function resetE()
    {
        currframe=-1;
        playBwd();
    }


    function startF()
    {
        stop(sId);
        sId = setInterval(playFwd, delay);
        playstate=2;
    }


    function startB()
    {
        stop(sId);
        sId = setInterval(playBwd, delay);
        playstate=-2;
    }

    function startFO()
    {
        stop(sId);
        sId = setInterval(playFwdO, delay);
        playstate=3;
    }


    function startBO()
    {
        stop(sId);
        sId = setInterval(playBwdO, delay);
        playstate=-3;
    }


    function stepF()
    {
        clearInterval(sId);
        playFwd();
        playstate=1;
    }


    function stepB()
    {
        clearInterval(sId);
        playBwd();
        playstate=-1;
    }


    function playFwd()
    {
        currframe++;
        if(currframe==numframe)currframe=0;  // wraparound
        context.clearRect(0,0,canvas.width,canvas.height);  
        //context.drawImage(imgArray[currframe], 0, 0);
        var newwh = newWdHt(canvas.width,canvas.height,imgArray[currframe].width,imgArray[currframe].height);
        context.drawImage(imgArray[currframe], newwh[2], newwh[3], newwh[0],newwh[1]);

        if(hud) {
        // overlay img# etc
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.fillStyle = "rgba(60,60,60, 0.35)";
        context.lineWidth   = 1;
        context.strokeRect(1,1,100,15);
        context.fillRect  (1,1,100,15);
        fr = (currframe+1) + "/" + numframe + ", " + delayArray[delayIndx] + " fps";
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.strokeText(fr,2,2,10);
        }
    }


    function playBwd()
    {
        currframe--;
        if(currframe<0)currframe=numframe-1; // wraparound
        context.clearRect(0,0,canvas.width,canvas.height); 
        //context.drawImage(imgArray[currframe], 0, 0); 
        var newwh = newWdHt(canvas.width,canvas.height,imgArray[currframe].width,imgArray[currframe].height);
        context.drawImage(imgArray[currframe], newwh[2], newwh[3], newwh[0],newwh[1]);


        if(hud) {
        // overlay img# etc
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.fillStyle = "rgba(60,60,60, 0.35)";
        context.lineWidth   = 1;
        context.strokeRect(1,1,100,15);
        context.fillRect  (1,1,100,15);
        fr = (currframe+1) + "/" + numframe + ", " + delayArray[delayIndx] + " fps";
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.strokeText(fr,2,2,10);
        }
    }


    function playFwdO()
    {
        currframe++;
        if(currframe==numframe){currframe--;stop();return;}
        context.clearRect(0,0,canvas.width,canvas.height);  
        //context.drawImage(imgArray[currframe], 0, 0); 
        var newwh = newWdHt(canvas.width,canvas.height,imgArray[currframe].width,imgArray[currframe].height);
        context.drawImage(imgArray[currframe], newwh[2], newwh[3], newwh[0],newwh[1]);

        if(hud) {
        // overlay img# etc
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.fillStyle = "rgba(60,60,60, 0.35)";
        context.lineWidth   = 1;
        context.strokeRect(1,1,100,15);
        context.fillRect  (1,1,100,15);
        fr = (currframe+1) + "/" + numframe + ", " + delayArray[delayIndx] + " fps";
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.strokeText(fr,2,2,10);
        }
    }

    function playBwdO()
    {
        currframe--;
        if(currframe<0){currframe=0;stop();return;}
        context.clearRect(0,0,canvas.width,canvas.height); 
        // context.drawImage(imgArray[currframe], 0, 0); 
        var newwh = newWdHt(canvas.width,canvas.height,imgArray[currframe].width,imgArray[currframe].height);
        context.drawImage(imgArray[currframe], newwh[2], newwh[3] ,newwh[0],newwh[1]);

        if(hud) {
        // overlay img# etc
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.fillStyle = "rgba(60,60,60, 0.35)";
        context.lineWidth   = 1;
        context.strokeRect(1,1,100,15);
        context.fillRect  (1,1,100,15);
        fr = (currframe+1) + "/" + numframe + ", " + delayArray[delayIndx] + " fps";
        context.strokeStyle = 'rgba(255,255,255,255)'; 
        context.strokeText(fr,2,2,10);
        }
    }

    // UI buttons can help vary these during playback
    function setDelay(dly)
    {
        delay = dly;
        // stop();
        if(playstate==-2)
        {
            startB();
        }
        else if(playstate==-3)
        {
            startBO();
        }
        else if(playstate==3)
        {
            startFO();
        }
        else if(playstate==2)
        {
            startF();
        }
    }
    // not used anymore, still works - instead, use fps{Less,More}
    function stepDelay()
    {
        fps = 1000.0/delay;
        fps += 1.0;
        delay = 1000.0/fps;
        if(delay<=25)
        {
            delay = 4000;
        }
        setDelay(delay);
    }

   function fpsLess()
   {
      delayIndx--;
      if(delayIndx < 0)delayIndx=0;
      delay = 1000.0/delayArray[delayIndx];
      setDelay(delay);
   }
   function fpsMore()
   {
      delayIndx++;
      if(delayIndx > (delayArray.length-1))delayIndx=delayArray.length-1;
      delay = 1000.0/delayArray[delayIndx];
      setDelay(delay);
   }
   
   function fpsWhat()
   {
      //alert("FPS: "+ delayArray[delayIndx]+ ".  Steps are 0.25,0.5,1,5,7,10,12,15,18,20,24,28,30");
      // fr = (currframe+1) + "/" + numframe + ", " + delayArray[delayIndx] + " fps";
      // alert(fr);

      hud = 1-hud; // :)
   }

   // ONLY works (stops playing) when play{F,B} btn is pressed
   function doSS()
   {
     startStop = 1-startStop;
     // alert(startStop);

     if(playstate==-2) {
        if(startStop){
         startB();
        }
        else {
         stop();
        }
     }
     if(playstate==2) {
        if(startStop){
         startF();
        }
        else {
         stop();
        }
     }
     
   }// doSS()

}// SSS




