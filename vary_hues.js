/////////////////////////////////////////////////////////////////
//Vary Hues / Randomize Colors -- CS, CS2
//>=--------------------------------------
// This script is designed to create color variations such as seen in brick walls, or stone walkways.
//
// When one or more objects are selected, 
//     the script provides a prompt to the user with the following three options: 
//
// To vary the object(s) fill colors, enter a number from 0 to 100. 100 is maximum.
// To vary the object(s) strokes, add an 's' after the number like this: 42s
//
// The last option is slightly different, instead of entering a number for the variance,
//	  the user enters an opacity range.
// To vary the object(s) transparencies enter two comma separated numbers
//      representing the minimum and maximum like this: 23,44
//
// Since the color values of spot colors by definition cannot be adjusted, the tint is randomized instead.
// Gradients and Patterns are not affected.
// Grouped, masked, or symbol objects are generally ignored. 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 


//Randomize Colors.
len = app.activeDocument.selection.length;
gradAlert = 0;
strokes = false;
if (len == 0) {
	alert("Please select one or more objects. Grouped objects will not be affected.");
} else {
	ob = app.activeDocument.selection;
	var line1 = "1) To vary FILL COLORS, enter a number: (1-100)\n";
	var line2 = "2) To vary STROKE COLORS, enter a number followed by an 's'\n";
	var line3 = "3) To vary OPACITIES, enter min and max values such as: 30,100\n";

	var data = prompt(line1+line2+line3, "");
	if ( data == null || data.length ==0 )
	{
	//User canceled process or didn't enter anything, so do nothing and end nicely.
	} else{	 
	if (data.indexOf(",")>0) {
		action = data.split(",");
	} else {
		action = data.split(" ");
	}
	//if the 's' is it's own value in the array, detect and snip
	if (action[action.length-1] == "s") {
		action.length = action.length-1;
		strokes = true;
	}
	// or, detect and snip the 's' from the last number in the array 
	if (action[action.length-1].charAt(action[action.length-1].length-1) == "s") {
		action[action.length-1] = action[action.length-1].substr(0,action[action.length-1].length-1)
		//alert(action);
		strokes = true;
	}
	var baseVal = action[0];
	for (j=0; j<len; j++) {
		//
		//change OPACITY here
		if (isNumber(action[0]) && isNumber(action[1]) && action.length == 2) {
			calcNum = ((action[0]*1)+((Math.random(1)*(action[1]-action[0]))));
			ob[j].opacity = setLegal(calcNum);
			//
			//Change COLOR here:
		} else if (isNumber(action[0], 255) && action.length == 1) {
			if(app.activeDocument.documentColorSpace == "DocumentColorSpace.RGB"){
				
			action[0] = Math.round(baseVal*2.55);
			 
			}
			if (strokes == false) {
				if (ob[j].filled == true) {
					setColor(ob[j].fillColor, setLegal(action[0], 255));
				}
			} else {
				if (ob[j].stroked == true) {
					setColor(ob[j].strokeColor, setLegal(action[0],255));
				}
			}
			//
		} else {
			//break
			j = len;
			error(action[0]);
		}
	}
}}
function error(val) {
	alert(val+" was not an accepted value.");
}
function isNumber(num, max) {
	if (max == undefined) {
		max = 100;
	}
	if (num>=0 && num<=max) {
		return true;
	}
	return false;
}
function setLegal(num, max) {
	if (max == undefined) {
		max = 100;
	}
	if (num<0) {
		return -num%max;
	} else if (num>max) {
		return max-(num%max);
	} else {
		return num;
	}
}
function setColor(obj, dev) {
	var d = Math.round(Math.random(1)*dev);
	if (obj == undefined) {
		//do nothing
	} else if (obj.typename == "RGBColor") {
		//alert("RGB");
		d = Math.round(Math.random(1)*dev);
		var r = obj.red;
		obj.red = setLegal((r-dev)+(d*2), 255);
		d = Math.round(Math.random(1)*dev);
		var g = obj.green;
		obj.green = setLegal((g-dev)+(d*2), 255);
		d = Math.round(Math.random(1)*dev);
		var b = obj.blue;
		obj.blue = setLegal((b-dev)+(d*2), 255);
	} else if (obj.typename == "SpotColor") {
		//alert("Spot");
		var d = Math.round(Math.random(1)*dev);
		var t = obj.tint;
		obj.tint = setLegal((t-dev)+(d*2), 100);
	} else if (obj.typename == "GrayColor") {
		//alert("Gray");
		var d = Math.round(Math.random(1)*dev);
		var t = obj.gray;
		obj.gray = (setLegal((t-dev)+(d*2), 100));
	} else if (obj.typename == "CMYKColor") {
		//alert("CMYK");
		d = Math.round(Math.random(1)*dev);
		var c = obj.cyan;
		obj.cyan = setLegal((c-dev)+(d*2), 100);
		d = Math.round(Math.random(1)*dev);
		var m = obj.magenta;
		obj.magenta = setLegal((m-dev)+(d*2), 100);
		d = Math.round(Math.random(1)*dev);
		var y = obj.yellow;
		obj.yellow = setLegal((y-dev)+(d*2), 100);
		d = Math.round(Math.random(1)*dev);
		var k = obj.black;
		obj.black = setLegal((k-dev)+(d*2), 100);
	} else if (gradAlert != 1 && (obj.typename == "PatternColor" || obj.typename == "GradientColor")) {
		gradAlert = 1;
		alert("Patterns and Gradients will not be transformed.");
	} else {
		//alert("Nuthin...");
	}
}
