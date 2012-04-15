/////////////////////////////////////////////////////////////////
// Sharpen Corners -- CS,CS2
//>=--------------------------------------
//
// Removes control handles from selected path points.
// Works same as clicking a point with the convert anchor point tool, 
// but enmass on all selected points.
//
// An option is provided for zeroing the control handles of adjacent points.
//
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//////////////////////////////////////////////////////////////////
var doc = activeDocument;
var sel = doc.selection;
var sellen = sel.length;
//
var ignoredItemCount = 0;
// 
var adjacentHandlesToo=1;
//	The 'adjacentHandlesToo' variable is a toggle for zeroing the handles of adjacent points.
// I default this to true because in most cases, I assume this will
// be the expected behavior. If not, set to 0.
var ui = confirm("Remove shared control handles from adjacent points?");
if( ui == true){
	adjacentHandlesToo=ui;
}

//
//---------------------------------------main code:
//
for(var x=0;x<sellen;x++){
	
	if(sel[x].typename == "PathItem"){
		// hose control points of selected path items
		hoseHandles(sel[x]);
	
	
	}else if(sel[x].typename == "CompoundPathItem"){
		//hose control points of selected compound path items
		var cpiLen = sel[x].pathItems.length;
		for (var j=0;j<cpiLen;j++){
			hoseHandles(sel[x].pathItems[j]);
		}
	
	}else{
			ignoredItemCount ++;
		}

}
if(ignoredItemCount>0){
	alert("Just so you know:\n"+ignoredItemCount+" Item(s) ignored. \nTry selecting objects individually or ungrouping.");
}

//------------------------------functions below:
function hoseThisAnchor(ptOb,deets){
	var anch = ptOb.anchor;
	var cntr_arr = Array(anch[0],anch[1]);
	if(deets=='l'){
		ptOb.leftDirection = cntr_arr;
	} else if(deets=="r"){
		ptOb.rightDirection = cntr_arr;
	} else {
		ptOb.leftDirection = cntr_arr;
		ptOb.rightDirection = cntr_arr;
	}		
}

function hoseHandles(ob){
	
		
			var ppl = ob.pathPoints.length;
			for(var y=0;y<ppl;y++){
					//This 
					if(ob.pathPoints[y].selected==PathPointSelection.ANCHORPOINT){
						hoseThisAnchor(ob.pathPoints[y]);
					}
				 if(adjacentHandlesToo==1){
					if(ob.pathPoints[y].selected==PathPointSelection.LEFTDIRECTION){
						hoseThisAnchor(ob.pathPoints[y],'l');
					}
					if(ob.pathPoints[y].selected==PathPointSelection.RIGHTDIRECTION){
						hoseThisAnchor(ob.pathPoints[y],'r');
					}
				}
			}	 
	
}