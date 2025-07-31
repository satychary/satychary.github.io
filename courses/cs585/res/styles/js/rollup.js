/*
   $Revision: 1.18 $          $Author: web $
	$Source: /home/web/public_html/gilesorr.com/bashprompt/jsb/RCS/prompt.js,v $
	$Date: 2003/11/20 02:24:23 $

	$Log: prompt.js,v $
	Revision 1.18  2003/11/20 02:24:23  web
	Extended the time/day formatinting nicely.  More extensible, easier.

	Revision 1.17  2003/11/20 01:19:26  web
	Added "Add space" and my comment in the text view.

	Revision 1.16  2003/11/16 20:45:55  web
	Seems to work well in both Konqueror and Firebird.  Good time to check in.

	Revision 1.15  2003/11/16 16:38:25  web
	Getting somewhere.  Tracked and cleaned up most problems that were stopping
	this working in Firebird, still seems to work fully in Konqueror.

	Revision 1.14  2003/11/16 05:05:38  web
	Experimented with "bgcolour2.html" and finally got the DOM to behave
	to change the BG colour of the Code Display.  Works in both browsers!

	Revision 1.13  2003/11/08 02:52:31  web
	Changed chgColour and chgBack rather impetuously.  May have helped.  Using
	Koch's "if (!e) var e = window.event;" to access events.  Working with
	Firebird, and accessing HTML elements (id tags) isn't working.  Konqueror
	gets at them with "tagname.property" but that doesn't work with Firebird,
	which says they're undefined.

	Revision 1.12  2003/08/13 01:59:24  web
	Commented out "blocking" in favour of a separate version in
	the /include/ dir called "blocking.js" that works for all browsers.

	Revision 1.11  2002/09/23 00:41:52  web
	Some major additions over my work weekend.  Can't remember what,
	but it's mostly good and mostly works.  :-)

	Revision 1.10  2002/09/19 01:22:09  web
	"blocking" function works - two tables can pop in and out of existence.

	Revision 1.9  2002/09/18 03:02:48  web
	Added the very ugly power element.  Some quoting issues, works now.

	Revision 1.8  2002/09/17 02:19:25  web
	Background colours mostly work, some issues, see "Debugging"
	section of commentary.  Fix it later.

	Revision 1.7  2002/09/17 01:40:32  web
	Everything working, about to attempt background colours.

	Revision 1.6  2002/09/16 23:47:23  web
	Previous addition was "uptime," very ugly code - but works.

	Revision 1.5  2002/09/15 03:26:23  web
	Tried to fix chgColour (no) and added $PWD.

	Revision 1.4  2002/09/15 02:41:44  web
	Added several (as yet untested) functions for adding various bash
	escape sequences.

	Revision 1.3  2002/09/13 02:02:06  web
	switch for colour selection, works.


*/

/*******************************************************************
 *    Debug issues:
 * 20031116: bg colours don't show up in Prompt View if there's 
 * more than one in sequence (Konqueror only)
 * 20031116: function addTime(clock, length) is awkward.  Pass only
 * one param, a "type" of date/time.
 *******************************************************************
 */

//  Create a date stamp (variable GODateStamp) in a format I like:
currentTime = new Date();
var year = currentTime.getFullYear();
//  Bizarrely, the month (but nothing else?) is zero-based:
var month = currentTime.getMonth() + 1;
var date = currentTime.getDate();
if (month < 10)
{
	month = "0" + month;
}
if (date < 10)
{
	date = "0" + date;
}
//  Fake it out slightly, with "" so it doesn't do addition but treats
//  them as chars:
GODateStamp = year + "" + month + "" + date;

// Current Shell versions used later on:
shortCurrentShellVersion = "2.05a";
longCurrentShellVersion = "2.05a.0";

// Max size of the Array of code elements:
var arraySize = 100;
// The User Friendly name of the element - intended for display!:
var elementUFName = new Array(arraySize);
// The required bash code for the element - gets printed in the code view:
var elementCode = new Array(arraySize);
// What to show in the "Prompt View" section:
var elementAppearance = new Array(arraySize);
// Number of elements in use:
var elementCount = 0;

// Variables to display, changeable in the "Defaults" section:
var directory = "/usr/local/bin";
var userName = "username";
var machName = "machine";
var domain   = "domain";

function unameh(element)
{
	// When userName is changed in the Defaults section, handle it:
	//
	userName = element.value;
	// This refers to a dynamically generated tag (ie. it's created by this
	// script and may not exist when the script makes this reference) so we
	// need to check it exists:
	if (document.getElementById('userNameTag'))
	{
		changeMe = document.getElementById('userNameTag');
		changeMe.innerHTML = element.value;
	}
}
function machnameh(element)
{
	machName = element.value;
	if (document.getElementById('machNameTag'))
	{
		changeMe = document.getElementById('machNameTag');
		changeMe.innerHTML = element.value;
	}
}
function domainh(element)
{
	domain = element.value;
	if (document.getElementById('domainTag'))
	{
		changeMe = document.getElementById('domainTag');
		changeMe.innerHTML = element.value;
	}
}
function directoryh(element)
{
	directory = element.value;
	if (document.getElementById('directoryTag'))
	{
		changeMe = document.getElementById('directoryTag');
		changeMe.innerHTML = element.value;
	}
}

function codebgh()
{
	// promptView.style.backgroundColor = window.event.srcElement.value;
	element = document.getElementById('promptView');
	element.style.backgroundColor = document.promptform.codebg.value;
}
function assembleCode()
{
	// Put the code pieces together, adding my usual TITLEBAR code at the
	// beginning, and a ${NOCOLOUR} equivalent at the end.
	// the JavaScript escape \n doesn't seem to work in this context.

	var code = "case $TERM in" + "\n";
	code = code + '	xterm*|rxvt*)' + "\n";
	code = code + "		TITLEBAR='\\[\\033]0;\\u@\\h:\\w\\007\\]'" + "\n";
	code = code + "		;;" + "\n";
	code = code + '	*)' + "\n";
	code = code + "		TITLEBAR=\"\"" + "\n";
	code = code + "		;;" + "\n";
	code = code + "esac;" + "\n";
	code = code + "#  Prompt generated by Giles's Prompt-o-matic, " + GODateStamp + "\n";
	code = code + "#  http://www.gilesorr.com/bashprompt/jsb/prompt.html" + "\n";
	code = code + "\n" + "PS1=\"${TITLEBAR}";
	
	var i = 0;
	while ( i < elementCount )
	{
		code = code + elementCode[i];
		i++;
	}
	// This last addition kills all colours (and it's not optional):
	code = code + '\\[\\033[0;0m\\]"';
	return code;
}
function assembleText()
{
/* Create a text/html string to output to the "textView" table data section */
	var i = 0;
	var text = "";
	while ( i < elementCount )
	{
		text += elementUFName[i] + "<br />\n";
		i++;
	}
	return text;
}
function assemblePrompt()
{
/* Create a text/html string to output to the "promptViewTD" table data
 * section */
	var i = 0;
	// The span tags are for colours: every time I insert a colour
	// element, I close two spans (and then open two - fg and bg)
	// so it's good HTML to open them here!
	// 20031116: started the colour as "lightGray" in case they don't set one.
	var prompt = "<pre>\n\n\n\n\n\n<span><span class=\"lightGray\">";
	while ( i < elementCount )
	{
		prompt += elementAppearance[i];
		i++;
	}
	prompt = prompt + "</span></span>\n\n</pre>";
	return prompt;
}
function addUserName()
{
	elementUFName[elementCount] = "User Name";
	elementCode[elementCount] = "\\u";
	// uname tag is sought by function unameh
	elementAppearance[elementCount] = "<span id=\"userNameTag\">" + userName + "</span>";
	elementCount++;
}
function addPwd()
{
	elementUFName[elementCount] = "Working Directory";
	elementCode[elementCount] = "\\w";
	elementAppearance[elementCount] = "<span id=\"directoryTag\">" + directory + "</span>";
	elementCount++;
}
function addBNamePwd()
{
	elementUFName[elementCount] = "add Basename of Working Directory";
	elementCode[elementCount] = "\\W";
	var regex = '(.*/)(.*)';
	var result = directory.match(regex);
	elementAppearance[elementCount] = result[2];
	elementCount++;
}
function addNewLine()
{
	elementUFName[elementCount] = "New Line";
	elementCode[elementCount] = "\\n";
	// elementAppearance[elementCount] = "<span id=\"prompt\">\n";
	elementAppearance[elementCount] = "\n";
	elementCount++;
}
function addTime(timeType)
{
	currentTime = new Date();
	//  Get all the bits we need:
	//  Seconds:
	seconds = currentTime.getSeconds();
	if (seconds < 10)
	{
		seconds = "0" + seconds;
	}
	//  Minutes:
	var minutes = currentTime.getMinutes();
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}
	//  Hours and AM/PM:
	//  Can't add leading zeroes here because it's going to depend on context ...
	var hours24 = currentTime.getHours();
	var newhours = hours24 - 12;
	if (newhours > 0)
	{
		hours12 = newhours;
		dayHalf = "PM";
	} else {
		hours12 = hours24;
		dayHalf = "AM";
	}
	var weekday = currentTime.getDay();
	//  Again, can't add zeroes here because the need depends on context ...
	var date = currentTime.getDate();
	//  Month is zero-based (assigned near the beginning for date stamp):
	//var month = currentTime.getMonth() + 1;
	switch(month) {
		case 1:
			monthText = "January";
			break;
		case 2:
			monthText = "February";
			break;
		case 3:
			monthText = "March";
			break;
		case 4:
			monthText = "April";
			break;
		case 5:
			monthText = "May";
			break;
		case 6:
			monthText = "June";
			break;
		case 7:
			monthText = "July";
			break;
		case 8:
			monthText = "August";
			break;
		case 9:
			monthText = "September";
			break;
		case 10:
			monthText = "October";
			break;
		case 11:
			monthText = "November";
			break;
		case 12:
			monthText = "December";
			break;
		default:
			monthText = "Month isn't 1-12, we have a major problem.";
			break;
	}
	var year = currentTime.getFullYear();

	/*
	 *   Finally start assigning stuff depending on "timeType"
	 */
	switch(timeType) {
		case "t":
			elementUFName[elementCount] = "HH:MM:SS 24 hour time";
			elementAppearance[elementCount] = hours24 + ":" + minutes + ":" + seconds;
			elementCode[elementCount] = "\\t";
			break;
		case "T":
			elementUFName[elementCount] = "HH:MM:SS 12 hour time";
			elementAppearance[elementCount] = hours12 + ":" + minutes + ":" + seconds;
			elementCode[elementCount] = "\\T";
			break;
		case "A":
			elementUFName[elementCount] = "HH:MM 24 hour time";
			elementAppearance[elementCount] = hours24 + ":" + minutes;
			elementCode[elementCount] = "\\A";
			break;
		case "at":
			//  Couldn't use "@" because it's an illegal character ...
			elementUFName[elementCount] = "HH:MM AM/PM time";
			elementAppearance[elementCount] = hours12 + ":" + minutes + " " + dayHalf;
			elementCode[elementCount] = "\\@";
			break;
		case "d":
			elementUFName[elementCount] = "Weekday Month Date";
			elementAppearance[elementCount] = weekday + " " + monthText + " " + date;
			elementCode[elementCount] = "\\@";
			break;
		case "HHMM24":
			elementUFName[elementCount] = "HHMM 24 hour time";
			elementAppearance[elementCount] = hours24 + "" + minutes;
			//  The following needs a very new version of Bash:
			//elementCode[elementCount] = "\\D{%H%M}";
			elementCode[elementCount] = "\\$(date +%H%M)";
			break;
	}
	elementCount++;
}
function showCode()
{
	x = document.getElementById('codeRow');
	x.innerHTML = "<pre>" + assembleCode() + "</pre>";
	/* I'm putting the innerHTML into something that's already a <pre> tag,
	 * but in Konqueror it makes the whole thing a single line, which I
	 * didn't want.  So we're doubling up on <pre> tags.
	 */
}
function showText()
{
	// alert("textView.innerHTML is " + textView.innerHTML);
	// alert("assembleText() returns" + assembleText());
	//textView.innerHTML = assembleText();
	x = document.getElementById('textView');
	x.innerHTML = assembleText();
}
function showPrompt()
{
	//promptViewTD.innerHTML = assemblePrompt();
	x = document.getElementById('promptViewTD');
	x.innerHTML = assemblePrompt();
}
function chgColour(element)
{
	element.style.backgroundColor = "#6bff7c";
}
function chgBack(element)
{
	element.style.backgroundColor = "";
}
function delLast()
{
	// Don't decrement into the negatives - that's not good ...
	if (elementCount > 0)
	{
		elementCount--;
		elementUFName[elementCount] = "";
		elementCode[elementCount] = "";
		elementAppearance[elementCount] = "";
	}
}
function addText()
{
	// Urgh - thorny issue: needs to check for special chars ...
	htelement = document.getElementById('addTextInput');
	elementUFName[elementCount] = "Text element: \"" + htelement.value + "\"";
	elementCode[elementCount] = htelement.value;
	elementAppearance[elementCount] = htelement.value;
	elementCount++;
}
function addSpace()
{
	// Simplified "addText()", just adds a space.
	elementUFName[elementCount] = "Text element: \" \"";
	elementCode[elementCount] = " ";
	elementAppearance[elementCount] = " ";
	elementCount++;
}
function addColour()
{
	fgelement = document.getElementById('colourElement');
	bgelement = document.getElementById('bgColourElement');
	//element.style.backgroundColor = document.promptform.codebg.value;
	elementUFName[elementCount] = "Colour FG " + fgelement.value + ", BG " + bgelement.value;
	switch(fgelement.value)
	{
		case "none":
		elementCode[elementCount] = "\\[\\033[0m\\]";
		break;
		case "white":
		elementCode[elementCount] = "\\[\\033[1;37m\\]";
		break;
		case "lightGray":
		elementCode[elementCount] = "\\[\\033[0;37m\\]";
		break;
		case "gray":
		elementCode[elementCount] = "\\[\\033[1;30m\\]";
		break;
		case "black":
		elementCode[elementCount] = "\\[\\033[0;30m\\]";
		break;
		case "lightRed":
		elementCode[elementCount] = "\\[\\033[1;31m\\]";
		break;
		case "red":
		elementCode[elementCount] = "\\[\\033[0;31m\\]";
		break;
		case "lightGreen":
		elementCode[elementCount] = "\\[\\033[1;32m\\]";
		break;
		case "green":
		elementCode[elementCount] = "\\[\\033[0;32m\\]";
		break;
		case "brown":
		elementCode[elementCount] = "\\[\\033[0;33m\\]";
		break;
		case "yellow":
		elementCode[elementCount] = "\\[\\033[1;33m\\]";
		break;
		case "lightBlue":
		elementCode[elementCount] = "\\[\\033[1;34m\\]";
		break;
		case "blue":
		elementCode[elementCount] = "\\[\\033[0;34m\\]";
		break;
		case "pink":
		elementCode[elementCount] = "\\[\\033[1;35m\\]";
		break;
		case "purple":
		elementCode[elementCount] = "\\[\\033[0;35m\\]";
		break;
		case "lightCyan":
		elementCode[elementCount] = "\\[\\033[1;36m\\]";
		break;
		case "cyan":
		elementCode[elementCount] = "\\[\\033[0;36m\\]";
		break;
	}
	switch(bgelement.value)
	{
		case "none":
			// if both bg and fg are none, you only need one 
			// colour cancellation.  If the fg is set but bg is 
			// none, cancel the bg before setting the fg.
			if (fgelement.value == "none")
			{
				elementCode[elementCount] += "";
			} else {
				elementCode[elementCount] = "\\[\\033[0m\\]" + elementCode[elementCount];
			}
		break;
		case "lightGray":
		elementCode[elementCount] += "\\[\\033[47m\\]";
		break;
		case "black":
		elementCode[elementCount] += "\\[\\033[40m\\]";
		break;
		case "red":
		elementCode[elementCount] += "\\[\\033[41m\\]";
		break;
		case "green":
		elementCode[elementCount] += "\\[\\033[42m\\]";
		break;
		case "brown":
		elementCode[elementCount] += "\\[\\033[43m\\]";
		break;
		case "blue":
		elementCode[elementCount] += "\\[\\033[44m\\]";
		break;
		case "purple":
		elementCode[elementCount] += "\\[\\033[45m\\]";
		break;
		case "cyan":
		elementCode[elementCount] += "\\[\\033[46m\\]";
		break;
	}
	elementAppearance[elementCount] = "</span></span><span class=\"" + fgelement.value + "\"><span class=\"BG" + bgelement.value + "\">";
	elementCount++;
}
function addHostname(length)
{
	elementUFName[elementCount] = length + " hostname";
	if (length == "long")
	{
		elementCode[elementCount] = "\\H";
		elementAppearance[elementCount] = "<span id=\"machNameTag\">" + machName + "</span><span id=\"domainTag\">." + domain + "</span>";
	} else {
		elementCode[elementCount] = "\\h";
		elementAppearance[elementCount] = "<span id=\"machNameTag\">" + machName + "</span>";
	}
	elementCount++;
}
function addJobs()
{
	// Number of jobs managed by the shell (different from suspended jobs)
	//alert("help!");
	elementUFName[elementCount] = "Number of Jobs";
	elementCode[elementCount] = "\\j";
	elementAppearance[elementCount] = "3";
	elementCount++;
}
function addTermBName()
{
	// Terminal basename (ie. /dev/tty/5 = "5")
	elementUFName[elementCount] = "Basename of terminal";
	elementCode[elementCount] = "\\l";
	elementAppearance[elementCount] = "4";
	elementCount++;
}
function addShellBName()
{
	// Shell basename (ie. "bash")
	elementUFName[elementCount] = "Basename of shell";
	elementCode[elementCount] = "\\s";
	elementAppearance[elementCount] = "bash";
	elementCount++;
}
function addShellVerS()
{
	// Short Shell Version Number
	elementUFName[elementCount] = "short shell version";
	elementCode[elementCount] = "\\v";
	elementAppearance[elementCount] = shortCurrentShellVersion ;
	elementCount++;
}
function addShellVerL()
{
	// Long Shell Version Number
	elementUFName[elementCount] = "long shell version";
	elementCode[elementCount] = "\\V";
	elementAppearance[elementCount] = longCurrentShellVersion ;
	elementCount++;
}
function addHistoryNo()
{
	// History Number
	elementUFName[elementCount] = "history number";
	elementCode[elementCount] = "\\!";
	elementAppearance[elementCount] = "1027" ;
	elementCount++;
}
function addFileCount()
{
	// add count of plain files:
	// backslashing gets evil, and hasn't been checked ...
	elementUFName[elementCount] = "count of plain files";
	elementCode[elementCount] = "\\$(ls -l | grep \\\"^-\\\" | wc -l | tr -d \\\" \\\")";
	elementAppearance[elementCount] = "10" ;
	elementCount++;
}
/*
	the above works, the following should too:
	hidden files: \\$(ls -l -d .* | grep \\\"^-\\\" | wc -l | tr -d \\\" \\\"
	executables:  \\$(ls -l | grep \\\"^-..x\\\" | wc -l | tr -d \\\" \\\"
	directories:  \\$(ls -l | grep \\\"^d\\\" | wc -l | tr -d \\\" \\\"
	The following needs to be enclosed in a math op and have two removed ...
	hidden dirs:  \\$(ls -l -d .* | grep \\\"^d\\\" | wc -l | tr -d \\\" \\\"

*/
function addBashPWD()
{
	// Bash PWD - as opposed to the \w or \W
	elementUFName[elementCount] = "bash PWD";
	elementCode[elementCount] = "\\${PWD}";
	elementAppearance[elementCount] = "/home/username" ;
	elementCount++;
}
function addVDirDU()
{
	// Add the size of all visible files in the directory
	// This is how much space they use on disk (not the sum of their actual
	// sizes), thus a 20 byte file occupies 4.1 kb.
	elementUFName[elementCount] = "Visible files disk use";
	elementCode[elementCount] = "\\$(ls --si -s | head -1 | awk '{print \\$2}')";
	elementAppearance[elementCount] = "42k" ;
	elementCount++;
}
function addLoad1()
{
	// Add the one minute load
	elementUFName[elementCount] = "One minute load";
	elementCode[elementCount] = "\\$(temp=\\$(cat /proc/loadavg) && echo \\${temp%% *})";
	elementAppearance[elementCount] = "0.03" ;
	elementCount++;
}
function addUptime()
{
	// needs /proc/uptime
	// Statement is:
	//	\$(temp=\$(cat /proc/uptime) && upSec=\${temp%%.*} ; let secs=\$((\${upSec}%60)) ; let mins=\$((\${upSec}/60%60)) ; let hours=\$((\${upSec}/3600%24)) ; let days=\$((\${upSec}/86400)) ; if [ "\${days}" -ne "0" ]; then echo -n "\${days}d"; fi ; echo -n "\${hours}h\${mins}m")

	elementUFName[elementCount] = "Uptime";
	elementCode[elementCount] = "\\$(temp=\\$(cat /proc/uptime) && upSec=\\${temp%%.*} ; let secs=\\$((\\${upSec}%60)) ; let mins=\\$((\\${upSec}/60%60)) ; let hours=\\$((\\${upSec}/3600%24)) ; let days=\\$((\\${upSec}/86400)) ; if [ \"\\${days}\" -ne \"0\" ]; then echo -n \"\\${days}d\"; fi ; echo -n \"\\${hours}h\\${mins}m\")"
	elementAppearance[elementCount] = "27d4h42m" ;
	elementCount++;
}
function popNewWin(url) {
	// Borrowed from Koch.
	// For the "info" tags.
	newwindow=window.open(url,'name','height=250,width=300');
	if (window.focus) {newwindow.focus()}
}
function addProcCount()
{
	elementUFName[elementCount] = "Process count";
	elementCode[elementCount] = "\\$(ps ax | wc -l | tr -d ' ')";
	elementAppearance[elementCount] = "85" ;
	elementCount++;
}
function addNewMail()
{
	elementUFName[elementCount] = "New Mail Count";
	elementCode[elementCount] = "\\$(cat $MAIL |grep -c ^Message-)";
	elementAppearance[elementCount] = "7" ;
	elementCount++;
}
function addStoppedJobs()
{
	// Doesn't work in Bash 2.02 (see HOWTO for issues)
	elementUFName[elementCount] = "Stopped Jobs Count";
	elementCode[elementCount] = "\\$(jobs -s | wc -l | sed -e \\\"s/ //g\\\")";
	elementAppearance[elementCount] = "2" ;
	elementCount++;
}
function addPower()
{
	// Bails if there's no APM
	elementUFName[elementCount] = "Power% and on/off-line";
	elementCode[elementCount] = "\\$(if which apm 2> /dev/null > /dev/null; then apmRes=\\$(apm); apmRip=\\${apmRes//AC off/};if [ \\\"\\${apmRes}\\\" == \\\"\\${apmRip}\\\" ]; then ACstat=\"^\"; else ACstat=\"v\"; fi; echo \\${ACstat}\\${apmRes##* }; fi)";
	elementAppearance[elementCount] = "^87%" ;
	elementCount++;
}
function addSC(octopod)
{
	// An experiment to see what happens with escape sequences and JS
	octal = "\\" + octopod;
	elementUFName[elementCount] = "\243" + octopod;
	elementCode[elementCount] = octal;
	elementAppearance[elementCount] = octal ;
	elementCount++;
}
/*
 *
 * Removing this version of blocking 20030812, including new one
 * as a normal .js file.

function blocking(tag)
{
	// This toggles the display status of the associated ID/element
	var state = document.all[tag].style.display;
	var newState = "";
	if ( state == "block")
	{
		newState = "none";
	} else {
		newState = "block";
	}
	document.all[tag].style.display = newState;
}

*/

function addCharPWD()
{
	// Keep a set number of characters of the PWD
	elementUFName[elementCount] = dirCharCount.value + " characters of $PWD";
	elementCode[elementCount] = "\\$(lPWD=\\${#PWD} ; len=" + dirCharCount.value + "; if [ \\${lPWD} -gt \\${len} ]; then echo \\\"<\\${PWD:\\$((\\${#PWD}-" + dirCharCount.value + "))}\\\"; else echo \\${PWD}; fi)";
	// This is NOT a good appearance - I need to do some parsing ...
	// JS really doesn't seem to like either "<" or "\<" leading the appearance:
	// it doesn't print it.  But it doesn't break the rest of the function.
	//elementAppearance[elementCount] = "\<local/bin" ;
	elementAppearance[elementCount] = "local/bin" ;
	elementCount++;
}
function addDirPWD()
{
	// Keep a set number of directories of the PWD
	elementUFName[elementCount] = dirDirCount.value + " characters of $PWD";
	// Some seriously excessive backslashing of quotes was apparently
	// necessary here.  I don't know why!
	elementCode[elementCount] = "\\$(ppd=\\\"\\${PWD}\\\"; let keep=" + dirDirCount.value + "; let i=0; while [ \\\"\\${ppd}\\\" != \\\"\\\" ]; do ppd=\\\"\\${ppd%/*}\\\" ; let i=\\$i+1; done; if [ \\${keep} -ge \\${i} ]; then echo \\${PWD}; else newPWD=\\\"\\${PWD}\\\"; while [ \\${i} -ge \\${keep} ]; do newPWD=\\\"\\${newPWD#*/}\\\"; let i=\\$i-1; done; echo \\\"<\\${newPWD}\\\"; fi)";
	// This is NOT a good appearance - I need to do some parsing ...
	elementAppearance[elementCount] = "local/bin" ;
	elementCount++;
}



/*  Change the visibility of an object on and off.  I use this primarily so
 *  the user can click on a <dt> tag and the associated <dd> tag toggles
 *  visibility.
 *
 *  <dt onClick="blocking('idtag')"> ...
 *     <dd class="noshow" id="idtag"> ...
 *
 *  In this case, "noshow" is a style that starts the element as invisible.
 */

function blocking(tag)
{
	if (document.getElementById) //  Netscape, Mozilla, etc.
	{
		var state = document.getElementById(tag).style.display;
	}
	else if (document.all)      //  IE, Konqueror, etc.
	{
		var state = document.all[tag].style.display;
	}

	var newState = "";

	if ( state == "block")
	{
		newState = "none";
	} else {
		newState = "block";
	}


	if (document.getElementById)
	{
		document.getElementById(tag).style.display = newState;
	}
	else if (document.all)
	{
		document.all[tag].style.display = newState;
	}
}

// Added by Saty
function showURL(id,url)
  {
          if(document.all[id].src=="")
          {
          document.all[id].src=url;
          document.all[id].style.visibility="visible";
          }

  } 

  function showURLEachTime(id,url)
  {
          
          document.all[id].src=url;
          document.all[id].style.visibility="visible";
         

  } 


function onOffStates(tags)
{
      var nTags = tags.length;
      alert(nTags);
      for(i=0;i<nTags;i++)
      {
      var tag=tags[i];
	
	var newState = "";

      if(i==0)
        newState="block";
      else
        newState="none";


	if (document.getElementById)
	{
		document.getElementById(tag).style.display = newState;
	}
	else if (document.all)
	{
		document.all[tag].style.display = newState;
	}
      }// next tag
}

function tester(msg)
{
  alert(msg);
}

function toggleDisplay(me){
if (me.style.display=="block"){
me.style.display="none";
}
else {
if (me.style.display=="none"){
me.style.display="block";

}
}
}

function turnOn(me){

if (document.getElementById)
	{
		document.getElementById(me).style.display = "block";
	}
	else if (document.all)
	{
		document.all[me].style.display = "block";
	}
}

function turnOff(me){

if (document.getElementById)
	{
		document.getElementById(me).style.display = "none";
	}
	else if (document.all)
	{
		document.all[me].style.display = "none";
	}
}


