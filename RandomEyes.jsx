/////////////////////////////////////////////////////////////////
//RandomEyes v.1.0.0.3 -- CS2, CS3, CS4
//>=--------------------------------------
// 
//   "Gimmie an Eye!" 
//   Sometimes you just need eyes, so this script generates random critter eyes. 
//   
//   There are no manual settings for this script. 
//   Just run it, and you get a pair of eyes.
//   The colors of the irises are pulled from the swatches palate.
//   Eye variations are randomized within predefined tolerances.
//   If a single pathItem is selected, that object will be used as the source structure for the eye shape.
// 
//   Each eye is grouped, and both eyes are grouped together.
//   If you don't like the output, just make another set until you find something you like.
// 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 


var doc = app.activeDocument;
var cLayer = doc.activeLayer;
var len = doc.selection.length;
var srcObj  = doc.selection[0];
var outer =null;
var white =null;
var iris =null;
var reflect1 = null;
var pupil = null;
var reflect2  =null;
var loc = [0,0];
var artLayer = doc.activeLayer;
var refSize = null;
var parts = new Array();
var swatchLen = doc.swatches.length;

var BLACK = new RGBColor();
BLACK.red = 0;
BLACK.green = 0;
BLACK.blue = 0;
var WHITE = new RGBColor();
WHITE.red = 255;
WHITE.green = 255;
WHITE.blue = 255;

if (len==1 && doc.selection[0].typename == "PathItem")
{
	 
	go();
} else {
	var sLen = doc.selection.length;
	for (var s=0;s<sLen;s++)
	{
		doc.selection[s].selected=false;
	}
	srcObj = artLayer.pathItems.ellipse(range(30,60),range(30,60),range(90,120),range(90,120), false,true);

	//activeDocument.pathItems.getByName("src").selected = true;
	srcObj.selected = true;
	go();
	srcObj.remove();
}
//
 //-----------------------------------functions------------------------------------------

function go(){
	outer = drawOuter();
	refSize = outer.width;

	var whiteShift = 2;
	white = drawWhite(about(12),pRange(0,whiteShift)-about(whiteShift)/2,pRange(0,whiteShift)-about(whiteShift)/2,about(5));
	refSize = white.width;
	iris = drawIris(pRange(0,50));
	refSize = iris.width;
	var refRangeMax = 92;
	reflect1 = drawIrisReflection(pRange(10,25),pRange(10,25),(pRange(22,refRangeMax)-refRangeMax/2),(pRange(22,refRangeMax)-refRangeMax/2));
	var pHeight = pRange(10,80);
	pupil = drawPupil(pRange(10,80),pHeight);
	reflect2 = drawReflection();
	parts.push(outer,white,iris,reflect1,pupil,reflect2);
	pLen = parts.length;
	// done drawing, now group reflect and copy
	var leftEye = cLayer.groupItems.add();
	for (var x=0;x<pLen;x++)
	{
		parts[x].move(leftEye,ElementPlacement.INSIDE);
	}
	//grouped...
	leftEye.selected=true;
	app.copy();
	app.paste();
	var rightEye = doc.selection[0];
	reflectX(rightEye);
	rightEye.left = leftEye.left+leftEye.width* (1+(range(1,150)/100));
	leftEye.selected=true;
	var rightReflection = doc.selection[0].pathItems[0];
	var rightIris= doc.selection[0].pathItems[2];
	reflectX(rightReflection);
	rightReflection.left = rightIris.left+(reflect2.left-iris.left);
	var r = range(0,15);
	leftEye.rotate(-r);
	rightEye.rotate(r);
	var eyes = cLayer.groupItems.add();
	leftEye.move(eyes,ElementPlacement.INSIDE);
	rightEye.move(eyes,ElementPlacement.INSIDE);
	eyes.height *= (range(100,150)/100)-.5;

}
function drawOuter(){
	// copy outer shape will be mask for entire eye
	app.copy();
	app.paste();
	o = doc.selection[0];
	//o.selected = false;
	//srcObj.selected = true;
	o.fillColor = BLACK;
	o.stroked = false;
	return o;
}
function drawWhite(inset,offsetX,offsetY,scaleH){
	// white area for eye.
	app.copy();
	app.paste();
	w = doc.selection[0];

 //-----------colorizing it is cooler than hiding it---------------
	if(range(0,10)>5){
		w.fillColor = WHITE;
	} else {
	//  colorize
		w.fillColor = randomSwatch();
	}
 
	shrinkBy(w,inset);
	w.height-=scaleH;
	centerTo(w,outer);
	w.top+=offsetY;
	w.left+=offsetX;

	w.selected = false;
	return w;
} 
function drawIris(inset){
//must be referent to white.

var width = white.height-inset;
var tempH = white.width-inset;
if (width> tempH)
{
	width = tempH;
}
var height = width;
var ellipse = artLayer.pathItems.ellipse(0,0,width,height, false,true );
//alert(artLayer.pathItems.length);
ellipse.fillColor = randomSwatch();
centerTo(ellipse,white);
	// copy outer shape will be mask for entire eye
	return ellipse;
} 
function drawIrisReflection(insetX,insetY,top,left){
	var subIris = cLayer.groupItems.add();
	iris1 = iris.duplicate(subIris,ElementPlacement.INSIDE);

	centerTo(iris1,iris);
	irisMask = iris.duplicate(subIris,ElementPlacement.INSIDE);

	irisMask.width -=insetX;
	irisMask.height -=insetY;
	iris1.width/=range(1,2);
	centerTo(irisMask,iris);
	iris1.top -= top;
	iris1.left -= left;

	iris1.fillColor = randomSwatch();
	irisMask.clipping=true;
	subIris.clipped = true;
	subIris.opacity=range(15,50);
	return subIris;

}
function drawPupil(width,height){
	var mypup = iris.duplicate(doc.activeLayer,ElementPlacement.PLACEATBEGINNING);
	mypup.fillColor=doc.swatches[3].color;

	mypup.width=width;
	mypup.height=height;
	centerTo(mypup,iris);
	return mypup;
}

function drawReflection(){
	var myref = iris.duplicate(doc.activeLayer,ElementPlacement.PLACEATBEGINNING);
	myref.fillColor=  WHITE;
	myref.width = pRange(10,30) ;
	myref.height = pRange(10,30);
	myref.rotate(range(0,90));
	centerTo(myref,iris);
	myref.top+=pRange(10,25);
	myref.left+=pRange(20,40)-10;
	myref.opacity = (range(50,100));
	return myref;
}
//---------------------------------------------manipualtors-----------------------------------
function shrinkBy(ob,inset){
	ob.width = ob.width-inset;
	ob.height = ob.height-inset;
}
function centerTo(obj,targ){
	var top = targ.top-((targ.height/2)-(obj.height/2));
	var left = targ.left+(targ.width/2)-(obj.width/2);
	obj.top = top;
	obj.left = left;
}
function pRange(from,to){
	return percent(range(from,to));
}

function range(from,to){
	return Math.floor(Math.random()*(to-from))+from;
}
function about(num){
	return  range(num-5,num+5);
}

function percent(x){
	return refSize*(x/100);
}


function reflectX(obj){
	var reflectMatrix = app.getScaleMatrix(-100,100);
	obj.transform( reflectMatrix );
}
/*
for (var i=0;i<len; i++)
{
	if (Math.abs(doc.pathItems[i].area )<.01)
	{
		doc.pathItems[i].selected = true;
	}
}

if( webaccesslib == undefined ) {
if( Folder.fs == "Windows" ) {
var pathToLib = Folder.startup.fsName + "/webaccesslib.dll";
} else {
var pathToLib = Folder.startup.fsName + "/webaccesslib.bundle";
// verify that the path is valid
}
var libfile = new File( pathToLib );
var webaccesslib = new ExternalObject("lib:" + pathToLib );
}


var http = new HttpConnection("http://www.clanmills.com/robin.shtml") ;
http.response = new File("/c/temp/robin.shtml") ;
// Get is the default method
http.execute() ;
http.response.close() ;

/http://www.qwikcast.net/xml/qwikcast_feed0.xml

*/
function randomSwatch(){
return doc.swatches[range(4,swatchLen-1)].color;

}