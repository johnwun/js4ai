/////////////////////////////////////////////////////////////////
//Resize by Luminance v.1.0.0.0
//>=--------------------------------------
//	 
//	 Resizes all selected objects to a percentage of the objects original size
//  new size is based on the relative brightness of the objects fillColor.
//
//  aka: Make <b>Halftones in Illustrator</b>!!!
//
//  Designed to be used with mosaics generated from 
//  embedded images. 
//	 Good tutorial on making Mosaics <a target="_blank"  href="http://garmahis.com/tutorials/how-to-create-mosaic-in-illustrator/">here</a>
//  Further explanation on my <a href="http://js4ai.blogspot.com/2009/04/size-by-luminance-aka-halftones.html" target="_blank" >blog</a>
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var versionNum = app.version.split(".")[0];
var doc = activeDocument;
var sel = doc.selection;
 var objectFail = 0;
var selLen = sel.length;
// get document colorspace: 
  if (doc.documentColorSpace==DocumentColorSpace.RGB)
	{
		averageColorSpace = averageRGB;
	}else if (doc.documentColorSpace==DocumentColorSpace.CMYK)
	{
		averageColorSpace = averageCMYK;
	}

if ( sel[0].typename == "GroupItem")
{
	alert("You have selected a group item, please ungroup and try again.");
}else { 

	var msg = "Will the image be viewed against a black background?\n"; 
	msg += "    Yes = Lighter is bigger, darker is smaller\n";
	msg += "    No = Darker is bigger, lighter is smaller"
	var whiteHeavy = confirm(msg);

	 if (whiteHeavy)
	 {
		var  match=0;
	 }else{
		var match=255;
	 }
	if (versionNum >= 13)
	{  
		var w = new Window('window', "Resizing Objects", undefined, {independent:true});
		w.frameLocation = [200,200];
		w.tracker = w.add ('statictext' , [15,15,250,35], "processing");
		w.prog = w.add ('progressbar' , [15,15,250,35], 0, selLen);
		w.show();
	}
	//==========START LOOP====================
	//step backwards so we can dynamically remove objects...
	for (var each=selLen-1;each>=0;each--)
	{
		var gray = averageColors(sel[each].fillColor);
		//alert(gray);
		 
		if (versionNum >= 13)
		{  
				w.prog.value++; 
				w.tracker.text ="Resizing "+w.prog.value+" of "+selLen+" objects."; 
		}
	//alert ("gray:"+gray+", match:"+match);
		if (gray==match)
		{	
			sel[each].remove();
		}else{
			//it must be a value:
			// now reduce it to a percentace of 1.
			gray = 1/(gray);

			if ( !whiteHeavy)
			{
				gray = 1-gray;
			}
			// reassign
			var ob = sel[each];
			var otop=ob.top;
			var oleft=ob.left;
			var ow= ob.width;
			var oh = ob.height;

			ob.width *= gray;
			ob.height  *= gray;
			ob.top = otop-(oh/2 - ob.height/2);
			ob.left = oleft+(ow/2 - ob.width/2);
			ob.selected=false;
		}
	}
	//==============END LOOP===================
	if (versionNum >= 13)
	{  
			w.close();	
	}
	if(objectFail ==1){
	alert("Some objects were not understood.");
	}
}//end if not groupitem
//====================END MAIN======================

function averageColors(col){
	try{ 
	if (col.typename=="GrayColor")
	{
		match=whiteHeavy ? 100 :0;
		//invert it because 100 == black, not white like RGB...
		out = 100/(100-col.gray);
				if (out==Infinity)
		{
			out=100;
		}
		return out;
	}else if (col.typename=="SpotColor"){
			match= whiteHeavy? 100:0;
		 //invert it because 100 == tint, not white like RGB...
		var out =  100/(100-col.tint);
		if (out==Infinity)
		{
			out=100;
		}
		return out;
	}
	//if we got this far, it must be RGB or CMYK, otherwise, fail...
	return(averageColorSpace(col));
	
	} catch(e){
		objectFail = 1;
			return 100;
	}
}
 

 function averageRGB(col){
 		 match=whiteHeavy? 0:255;
		return  255/((col.red + col.green + col.blue)/3);
 }
 function averageCMYK(col){
		match= whiteHeavy? 100:0;
		//  inverse because 100 = tint,  not white like RGB 
		var out = 100/(100-((col.cyan + col.magenta + col.yellow + col.black)/4)); 
		if (out==Infinity)
		{
			out=100;
		}
		return  out;
 }
