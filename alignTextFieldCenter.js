/////////////////////////////////////////////////////////////////
//Align Ungrouped Textfields to Center (Without Shifting Text) v.1 -- CS 
//>=--------------------------------------
// When a user clicks the "Align" buttons on the Paragraph tab, 
// Illustrator shifts the text visually from it's original position.
//
// I wanted to be able to quickly change the paragraph alignment to center
// without having to reposition the text.
//
// Here's the script to do it.
//
// At the top of the code is a list of acceptable variables to substitute if you
// want to adapt the script to always justify to some other alignment than center.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

myJust = Justification.CENTER;
// or set to whatever you want:
// Justification.CENTER
// Justification.FULLJUSTIFY
// Justification.FULLJUSTIFYLASTLINECENTER
// Justification.FULLJUSTIFYLASTLINELEFT
// Justification.FULLJUSTIFYLASTLINERIGHT
// Justification.LEFT
// Justification.RIGHT



//Array for storing text x,y coordinates.
locArr = new Array();
 


try
{
	// Check current document for textFrames.
	if ( app.documents.length < 1 ) {
		alert ( "open a document with paragraphs that contain TabStops." );
	}
	else {
		docRef = app.activeDocument;
		if ( docRef.textFrames.length < 1 ) {
			alert ( "open a document with paragraphs that contain TabStops." );
		}
		else { 
			sel = docRef.selection;
			var slen = sel.length;
			for (var x=0;x<slen ;x++)
			{
				if(sel[x].typename == "TextFrame"){
					addtoList(sel[x]);
				}
			}
			
			for (all in locArr)
			{
			  locArr[all][0].story.textRange.justification = myJust;
			  locArr[all][0].top = locArr[all][1];
		      locArr[all][0].left = locArr[all][2];
			}

		}
	}
	 
	 
		
}
catch (e)
{
	alert("Script Failed! Here's why:\n"+e);
}
//creates a mini-object to add to the locArr array.
 function addtoList(obj){
	 var temp  = new Array();
	temp[0] = obj;
	temp[1] = obj.top;
	temp[2] = obj.left;
	locArr.push(temp);
 }