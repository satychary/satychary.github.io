
function animateClock() {
    var theCanvas = document.getElementById('clockHolder');

    /* if (theCanvas.width != document.body.clientWidth) {
        theCanvas.width = document.body.clientWidth;
    }

    if (theCanvas.height != document.body.clientHeight - 30) {
        theCanvas.height = document.body.clientHeight - 30;
    }*/
    //alert(theCanvas.width);
    //alert(theCanvas.height);
    //theCanvas.height=50;

    var context = theCanvas.getContext('2d');
    if (context === "null")alert("UH OH");

    // clear
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);


    // draw
    context.fillStyle = '#9999bb'; //'#313154'; //  '#B5B5FF'; //  '#00f';
    context,fillStyle = '#222244';
    context.textBaseline = 'middle';

    var currentDateTime = new Date();

    var hours = currentDateTime.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (hours > 12) {
        hours -= 12;
    }

    var minutes = currentDateTime.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var seconds = currentDateTime.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var timeString = hours + ':' + minutes + ':' + seconds;

    //context.font = 'bold ' + theCanvas.width/20 + 'px sans-serif';
    context.font = theCanvas.width/20 + 'px sans-serif';

    var dim = context.measureText(timeString);

    var y = (theCanvas.height - 30) / 2;
    var x = (theCanvas.width - dim.width) / 2;


    //alert('x '+x+' y '+y);

    context.fillText(timeString, x, y);
}// animateClock()


