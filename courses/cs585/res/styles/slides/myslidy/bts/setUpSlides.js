// highlighting, page break, slidy, image fitting

slidyOn = true;


 
var slides = document.getElementsByClassName("slide");
//alert(JSON.stringify(slides));
for (var i = 0; i < slides.length; i++) {
  slides[i].style.pageBreakAfter = "always";
}

// IF not tablet/phablet/phone, load slidy.js!
//alert(screen.width);
//alert(screen.height);
// 8/2016 on: load slidy ALWAYS! This DOES cause a scrolling problem in mobile devices
// [scrolling up jumps to the top instantly], but this can be 'fixed' by having the user 
// start out in slideshow mode!
//if ((screen.width>=1000)||(screen.height>=1000)) {
   var head= document.getElementsByTagName('head')[0];
   script= document.createElement('script');
   script.type= 'text/javascript';
   script.src= 'slidy.js'; // was ./, omg
   head.appendChild(script);
//}// if

// fit imgs..
var imgs = document.getElementsByTagName("img");
if ((screen.width>=1000)||(screen.height>=1000)) {
  //alert("bigger");
  for (var i = 0; i < imgs.length; i++) {
   var imgHt=imgs[i].clientHeight;
   var reqHt=(screen.height*0.55);
   if(imgHt>reqHt)
     imgs[i].style.height = reqHt+"px"; // else leave it as-is!
  }
}// not small
else if (window.matchMedia("(orientation: portrait)").matches) {
  //alert("port");
  //alert(screen.width);
  for (var i = 0; i < imgs.length; i++) {
    var imgWd=imgs[i].clientWidth;
    var reqWd=(window.width*0.99);
    if(imgWd>reqWd)
      imgs[i].style.width = imgWd+"px";
    //alert(imgs[i].style.width);
  }
}// portrait
else {
  //alert("lands");
  for (var i = 0; i < imgs.length; i++) {
    var reqHt=(window.height*0.99);
    var imgHt=imgs[i].clientHeight;
    if(imgHt>reqHt)
      imgs[i].style.height = reqHt+"px";
  }
}// landscape

// F11 eqvt :)
// doesn't work on Chrome on the iPh, so, won't use it :(
function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}// toggleFullScreen()

// create a bunch of img divs called slh, then call setupCarousel(slh,transitionTimeInMillisec); :)
function setupCarousel(slh,tm) {
var myIndex=0;
function carousel() {
    var i;
    var x = document.getElementsByClassName(slh);
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, tm);    
}
carousel();
}// setupCarousel


if(hljs!==undefined)hljs.initHighlightingOnLoad();


