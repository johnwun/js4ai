/////////////////////////////////////////////////////////////////
//Organify 2.0 -- CS, CS2
//>=--------------------------------------
//Randomizes all selected anchors by a selected number of points.
//
//  Enter small numbers to make objects look hand drawn.
//  Enter larger numbers to make objects look organic.
//  Enter even larger numbers to distort beyond recognition.
//
// V.2 now offers a choice for randomizing 'Anchors Only', 'Control Handles Only' or both.
//  <a href='http://www.wundes.com/js4ai/images/organifyDetail.gif'>(click here to view sample image.)</a>
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var docRef= app.activeDocument;

if ( app.documents.length > 0)
{	
	sel = activeDocument.selection;
	max = sel.length;

	rvar  = prompt("How much stray? (in points)",30); 
	uchoice= prompt("Enter\t'1' for anchors only (Spikey),\n\t'2' for handles only (Bulbous), or\n\t'3' for both anchors and handles (Chaotic)",3); 

	for(var cpi=0;cpi<max;cpi++){
        currentObj = sel[cpi];
        testObj(currentObj);
	}
}
		 
function tweakPath(obj){
		try{	//activeDocument.Selection.SelectedPathPoints		 
			var adsspp = obj.selectedPathPoints;
			var adssppLen = adsspp.length;
			for (var x = 0;x<adssppLen;x++){
			var spp = obj.selectedPathPoints[x];
			if(uchoice!=2){
			//Randomizes Anchors
				va = spp.anchor[0]+((Math.random()*rvar)-(rvar/2));
				vb = spp.anchor[1]+((Math.random()*rvar)-(rvar/2))
				spp.anchor = Array(va,vb);
			}

			//Randomizes handles too
			 if(uchoice!=1){
				la = spp.leftDirection[0]+((Math.random()*rvar)-(rvar/2));
				lb = spp.leftDirection[1]+((Math.random()*rvar)-(rvar/2))
				spp.leftDirection = Array(la,lb);
				 
				ra = spp.rightDirection[0]+((Math.random()*rvar)-(rvar/2));
				rb = spp.rightDirection[1]+((Math.random()*rvar)-(rvar/2))
				spp.rightDirection = Array(ra,rb);
			 }
			}
			



		}
		catch(e) {
			alert("Problem Found:\n"+e);
		}
}
function testObj(curr){
		if(curr.typename =="PathItem" ){
			tweakPath(curr);
		} else if(curr.typename =="GroupItem"){
			//can't tweak grouped items yet.
			//activeDocument.selection[0]==activeDocument.groupItems[0]
			//activeDocument.groupItems[0].pathItems
			//activeDocument.selection[0].groupItems[0].pathItems[0]
			//
			//hit all path items in group...
			var gpMax = curr.pathItems.length;
			for(var gpi=0;gpi<gpMax;gpi++){
				tweakPath(curr.pathItems[gpi]);
			}
			//hit all group items in group...
			var grMax = curr.groupItems.length
			for(var gri=0;gri<grMax;gri++){
				testObj(curr.groupItems[gri]);
			}
		}
		else{
			//aint nothing to select.
		}
}