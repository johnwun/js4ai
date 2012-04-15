/////////////////////////////////////////////////////////////////
//Copy to Object(s) v4.5 -- CS,CS2
//>=--------------------------------------
// User selects two (or more) objects:
// This script copies the top most object to the position and size of 
// all other selected objects.
//
//Version 2 update: Now adjusts stroke based on difference in area.
//Version 3 update: Now accepts multiple targets. 
//	-- thanks to an awesome hack by Iain Henderson (iain@addition.com.au)
//Version 4 update: Deselects everything but source object 
//  --this makes it easy to delete the source object if you wish,
//  -- also this makes the older "Replace-Object" script obsolete.
//  -- now allows user to choose whether to resize to target. (copies are centered to target.)
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var selObjs = "Please select at least two objects on the page.";
var docRef = activeDocument;
if (documents.length>0) {
	if (docRef.selection.length > 1) {
		mySelection = docRef.selection;
		var sourceObj = docRef.selection[0];
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
			//********************************************************
			var origBounds = mySelection[0].geometricBounds;
			
			//define paramaters of top object
			var oul_x = origBounds[0];
			var oul_y = origBounds[1];
			var olr_x = origBounds[2];
			var olr_y = origBounds[3];
			var oSelWidth = (olr_x-oul_x);
			var oSelHeight = (oul_y-olr_y);
			var oSelPos = [oul_x, oul_y];
			// *********************************************************
			var initBounds;
			var ul_x;
			var ul_y;
			var lr_x;
			var lr_y;
			var mySelWidth;
			var mySelHeight;
			var mySelPos;
			var scaleObjects = confirm("Scale Objects?"); //false;
			var centerObjects = true; // confirm("Center copies to targets?");
			var newX = 0;
			var newY = 0;
			var alterObjectArray = new Array();
			
			for (var i=0; i < mySelection.length; i++) {
				eval('subArray' + i + '=' + 'new Array()');
				eval('subArray' + i + '["object"]' +  '=' + mySelection[i]);
				initBounds = mySelection[i].geometricBounds;
				ul_x = initBounds[0];
				ul_y = initBounds[1];
				lr_x = initBounds[2];
				lr_y = initBounds[3];
				mySelWidth = (lr_x-ul_x);
				mySelHeight = (ul_y-lr_y);
				mySelPos = [ul_x, ul_y];
				eval('subArray' + i + '["width"]=' + mySelWidth);
				eval('subArray' + i + '["xpos"]=' + ul_x);
				eval('subArray' + i + '["ypos"]=' + ul_y);
				eval('subArray' + i + '["height"]=' + mySelHeight);
				
				eval('alterObjectArray.push(subArray' + i + ')');
			}
			
			for (var i=1; i < alterObjectArray.length; i++) {
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
		

				if (scaleObjects)
				{
					eval('newGroup.position = [alterObjectArray['+i+']["xpos"], alterObjectArray['+i+']["ypos"]]');
					eval('newGroup.height = alterObjectArray['+ i +']["height"]');
					eval('newGroup.width = alterObjectArray[' + i +']["width"]');
					//restroke with new proportions
					scaleStroke(strokeArray, propDiff);
				}	 else {
	
					if(centerObjects){
						newX = (alterObjectArray[i].width/2);
						newY = (alterObjectArray[i].height/2);
						newX -= newGroup.width/2;
						newY -= newGroup.height/2;
					}

					eval('newGroup.position = [alterObjectArray['+i+']["xpos"]+newX, alterObjectArray['+i+']["ypos"]-newY]');
				
				}
				//move object

			mySelection[i].remove();
			}
			slen = selection.length;

			for (var s= slen-1;s>=0;s-- )
			{
				selection[s].selected = false;
			}
			sourceObj.selected = true;
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
