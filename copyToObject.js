/////////////////////////////////////////////////////////////////
//Copy to Single Object -- 10,CS,CS2
//>=--------------------------------------
//User selects two (or more) objects:
// this script copies the top-most object to the position 
// and size of the second object. 
//
//Version 2 update: now adjusts stroke based on difference in area. 
// This script is mostly made obsolete by "copy to multiple objects" 
// This version is kept for primarily for posterity, 
// and for use on systems that won't run the "multiple copy" script.
// 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
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
				var propDiff = (wdiff+whght)/2;
			} else {
				var propDiff = 1;
			}
			//mark stroked Items
			//apply transforms
			var newGroup = docRef.groupItems.add();
			//modify move behavior for changes in JS for CS...
			if (version == "10.0") {
				newGroup.moveToEnd(docRef);
				var tempObj = mySelection[0].duplicate();
				tempObj.moveToEnd(newGroup);
			} else {
				newGroup.move(docRef, ElementPlacement.PLACEATEND);
				mySelection[0].duplicate(newGroup, ElementPlacement.PLACEATEND);
			}
			markStroked(newGroup);
			newGroup.height = mySelHeight;
			newGroup.width = mySelWidth;
			newGroup.position = mySelPos;
			mySelection[1].remove();
			//restroke with new proportions
			scaleStroke(strokeArray, propDiff);
			 newGroup.selected = false;
		} else {
			alert(selObjs);
		}
	} else {
		alert(selObjs);
	}
}
//Create the stroke Object that goes into the stroke Array.
//   contains the items colorObject, and it's initial stroke weight.
function strokeObj(pName, strokeWt) {
	this.pName = pName;
	this.strokeWt = strokeWt;
}
function markStroked(Sel) {
	var slen = Sel.length;
	// if selected is a single object...
	if (Sel.typename == "GroupItem") {
		markStroked(Sel.pageItems);
	} else if (Sel.typename == "CompoundPathItem") {
		//add object and stroke weight to the array...
		myColor = Sel.pathItems[0];
		myWt = myColor.strokeWidth;
		bob = new strokeObj(myColor, myWt);
		strokeArray.push(bob);
	} else if (Sel.typename == "TextFrame") {
		if (Sel.textRange.characterAttributes.strokeColor.typename != "NoColor") {
			var clMax = Sel.textRange.characters.length;
			for (var cl=0; cl<clMax; cl++) {
				myColor = Sel.textRange.characters[0].characterAttributes;
				myWt = myColor.strokeWeight;
				bob = new strokeObj(myColor, myWt);
				strokeArray.push(bob);
			}
		}
	}
	// if selected contains more than one object...
	for (var a=0; a<slen; a++) {
		if (Sel[a].typename == "GroupItem") {
			//alert("a group in markStroke");
			markStroked(Sel[a].pageItems);
		} else if (Sel[a].typename == "CompoundPathItem") {
			myColor = Sel[a].pathItems[0];
			myWt = myColor.strokeWidth;
			bob = new strokeObj(myColor, myWt);
			strokeArray.push(bob);
		} else if (Sel[a].typename == "PathItem") {
			if (Sel[a].stroked == true) {
				myColor = Sel[a];
				myWt = myColor.strokeWidth;
				bob = new strokeObj(myColor, myWt);
				strokeArray.push(bob);
			}
		} else if (Sel[a].typename == "TextFrame") {
			if (Sel[a].textRange.characterAttributes.strokeColor.typename != "NoColor") {
				var clMax = Sel[a].textRange.characters.length;
				for (var cl=0; cl<clMax; cl++) {
					myColor = Sel[a].textRange.characters[cl].characterAttributes;
					myWt = myColor.strokeWeight;
					bob = new strokeObj(myColor, myWt);
					strokeArray.push(bob);
				}
			}
		}
	}
}
function scaleStroke(mySlx, strokeScale) {
	var slen = mySlx.length;
	for (var a=0; a<slen; a++) {
		//set it's strokeweight or strokewidth, whatever... :)
		mySlx[a].pName.strokeWidth = mySlx[a].strokeWt*strokeScale;
		mySlx[a].pName.strokeWeight = mySlx[a].strokeWt*strokeScale;
	}
}
