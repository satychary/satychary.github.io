hljs.initHighlightingOnLoad();

var slides = document.getElementsByClassName("slide");
//alert(JSON.stringify(slides));
for (var i = 0; i < slides.length; i++) {
  slides[i].style.pageBreakAfter = "always";
}
// IF not tablet/phablet/phone, load slidy.js!
//alert(screen.width);
//alert(screen.height);
if ((screen.width>=1000)||(screen.height>=1000)) {
   // load bts/slidy.js
   var head= document.getElementsByTagName('head')[0];
   var script= document.createElement('script');
   script.type= 'text/javascript';
   script.src= 'https://dl.dropboxusercontent.com/u/91263185/styles/slides/myslidy/bts/slidy.js';
   head.appendChild(script);
}// if 
// fit imgs..
var imgs = document.getElementsByTagName("img");
if ((screen.width>=1000)||(screen.height>=1000)) {
  //alert("bigger");
  for (var i = 0; i < imgs.length; i++) {
   var imgHt=imgs[i].clientHeight;
   var reqHt=(screen.height*0.55), reqWd=(screen.width*0.55);
   if(imgHt>reqHt) {
     imgs[i].style.height = reqHt+"px"; // else leave it as-is!
     imgs[i].style.width= reqWd+"px"; // else leave it as-is!
   }
  }
}// not small 
else if (window.matchMedia("(orientation: portrait)").matches) {
  //alert("port");
  //alert(screen.width);
  for (var i = 0; i < imgs.length; i++) {
    var imgWd=imgs[i].clientWidth, imgHt=imgs[i].clientHeight;
    var reqWd=(window.width*0.99), reqHt=(window.height*0.99);
    if(imgWd>reqWd) {
      imgs[i].style.width = imgWd+"px";
      imgs[i].style.height = imgHt+"px";
    }
    //alert(imgs[i].style.width);
  }
}// portrait
else {
  //alert("lands");
  for (var i = 0; i < imgs.length; i++) {
    var reqHt=(window.height*0.99), reqWd=(window.width*0.99);
    var imgHt=imgs[i].clientHeight;
    if(imgHt>reqHt) {
      imgs[i].style.height = reqHt+"px";
      imgs[i].style.width =   reqWd+"px";
    }
  }
}// landscape


