/////////////////////////////////////////////////////////////////
//Swap Objects -- CS
//>=--------------------------------------
//User selects two objects:
// this script swaps position and size of the two objects. 
// 
//Version 2 update: now adjusts stroke based on difference in area. 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

try { 
var selObjs = "Please select two objects on the page.";
var docRef = activeDocument;
if (documents.length>0) {
	if (docRef.selection.length == 2) {
		mySelection = docRef.selection;
		//if object is a (collection of) object(s) not a text field.
		if (mySelection instanceof Array) {
			//initialize vars
			//
			//*******************************************************
			//toggle for scaling stroke: set to true to scale stroke.
			var scaled = true;
			//*******************************************************
			//create stroke Array
			var strokeArray = new Array();
			//create bounding objects 
			var origBounds = mySelection[0].geometricBounds;
			var initBounds = mySelection[1].geometricBounds;
			//define paramaters of top object
			var oul_x = origBounds[0];
			var oul_y = origBounds[1];
			var olr_x = origBounds[2];
			var olr_y = origBounds[3];
			var oSelWidth = (olr_x-oul_x);
			var oSelHeight = (oul_y-olr_y);
			var oSelPos = [oul_x, oul_y];
			//define paramaters of bottom object
			var ul_x = initBounds[0];
			var ul_y = initBounds[1];
			var lr_x = initBounds[2];
			var lr_y = initBounds[3];
			var mySelWidth = (lr_x-ul_x);
			var mySelHeight = (ul_y-lr_y);
			var mySelPos = [ul_x, ul_y];
			//find proportional Difference
			//average height and width to find new stroke
			if (scaled == true) {
				var wdiff = mySelWidth/oSelWidth;
				var whght = mySelHeight/oSelHeight;
				var cdiff = oSelWidth/mySelWidth;
				var chght = oSelHeight/mySelHeight;
				var propDiff = (wdiff+whght)/2;
				var revDiff = (cdiff+chght)/2;
			} else {
				var propDiff = 1;
			}
			//mark stroked Items
		
			markStroked(mySelection[0], propDiff);	
			markStroked(mySelection[1], revDiff);
			//apply transforms to selection[0]
			mySelWidth = (lr_x-ul_x);
			mySelHeight = (ul_y-lr_y);
			mySelPos = [ul_x, ul_y];
			mySelection[0].height = mySelHeight;
			mySelection[0].width = mySelWidth;
			mySelection[0].position = mySelPos;
			//apply transforms to selection[1]
			oSelWidth = (olr_x-oul_x);
			oSelHeight = (oul_y-olr_y);
			oSelPos = [oul_x, oul_y];
			mySelection[1].height = oSelHeight;
			mySelection[1].width = oSelWidth;
			mySelection[1].position = oSelPos;
			//restroke with new proportions
			//scaleStroke(mySelection[0], propDiff);
			//scaleStroke(mySelection[1], revDiff);
			scaleStroke(strokeArray);
		} else {
			alert(mySelection+" is not an array!\n"+selObjs);
		}
	} else {
		alert("Selection is not 2 objects!\n"+selObjs);
	}
}
} catch(e){
alert("problem:\n"+e); }
//Create the stroke Object that goes into the stroke Array.
//   contains the items colorObject, it's initial stroke weight 
//   and the multiplier used to shift the stroke scale.
function strokeObj(pName, strokeWt, diff) {
	this.pName = pName;
	this.strokeWt = strokeWt;
	this.diff = diff;
}
//assigns the stroke weight to each object in the selection
function markStroked(Sel, mydiff) {
	var strokdiff = mydiff;
	//alert(strokdiff+"for obj:"+Sel);
	//alert(Sel.typename);
	var slen = Sel.length;
	// if selected is a single object...
	if (Sel.typename == "GroupItem") {
		//alert("object is a group in markStroke");
		markStroked(Sel.pageItems, mydiff);
	} else if (Sel.typename == "CompoundPathItem") {
		//add object and stroke weight to the array...
		myColor = Sel.pathItems[0];
		myWt = myColor.strokeWidth;
		bob = new strokeObj(myColor, myWt, strokdiff);
		strokeArray.push(bob);
	} else if (Sel.typename == "TextFrame") {
		//alert("it's a TextFrame");
		if (Sel.textRange.characterAttributes.strokeColor.typename != "NoColor") {
			var clMax = Sel.textRange.characters.length;
			for (var cl=0; cl<clMax; cl++) {
				myColor = Sel.textRange.characters[cl].characterAttributes;
				myWt = myColor.strokeWeight;
				bob = new strokeObj(myColor, myWt, strokdiff);
				strokeArray.push(bob);
			}
		}
	}else if (Sel.typename == "PathItem") {
		//add object and stroke weight to the array...
		myColor = Sel;
		myWt = myColor.strokeWidth;
		bob = new strokeObj(myColor, myWt, strokdiff);
		strokeArray.push(bob);
	}
	// if selected contains more than one object...   alert(Sel.length+" good so far");
	if(Sel.typename == "GroupItem"){
		for (var a=0; a<slen; a++) {
			if (Sel[a].typename == "GroupItem") {
				//alert("a group in markStroke");
				markStroked(Sel[a].pageItems, mydiff);
			} else if (Sel[a].typename == "CompoundPathItem") {
				myColor = Sel[a].pathItems[0];
				myWt = myColor.strokeWidth;
				bob = new strokeObj(myColor, myWt, strokdiff);
				strokeArray.push(bob);
				
			} else if (Sel[a].typename == "PathItem") {
				if (Sel[a].stroked == true) {
					myColor = Sel[a];
					myWt = myColor.strokeWidth;
					bob = new strokeObj(myColor, myWt, strokdiff);
					strokeArray.push(bob);
				}
			} else if (Sel[a].typename == "TextFrame") {
				if (Sel[a].textRange.characterAttributes.strokeColor.typename != "NoColor") {
					var clMax = Sel[a].textRange.characters.length;
					for (var cl=0; cl<clMax; cl++) {
						myColor = Sel[a].textRange.characters[cl].characterAttributes;
						myWt = myColor.strokeWeight;
						bob = new strokeObj(myColor, myWt, strokdiff);
						strokeArray.push(bob);
					}
				}
			}
		}
	}
}
//goes through stroked array and resets stroke for each object.
function scaleStroke(mySlx) {
	var slen = mySlx.length;
	for (var a=0; a<slen; a++) {
		//set it's strokeweight or strokewidth, whatever... :)
		mySlx[a].pName.strokeWidth = mySlx[a].strokeWt*mySlx[a].diff;
		mySlx[a].pName.strokeWeight = mySlx[a].strokeWt*mySlx[a].diff;
		//alert(mySlx[a].diff);
	}
}
