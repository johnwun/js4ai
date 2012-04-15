/////////////////////////////////////////////////////////////////
//Fleurify -- CS,CS2,CS3
//>=--------------------------------------
// Named after the "Fleur de Lis" as in "flower", 
// this script is the bastard love child of a Spirograph and the "Punk & Bloat" filter.
//
// Enter a percentage to "fleurify" and the script turns basic geometry into flowery shapes.
// Warning: the fleurified objects paths will self intersect.  This shouldn't matter in print media, but 
// for cutable shapes you'll have to use the pathfinder palate to break and merge it.
//
// Note: The anchors are never modified, only the control handles,
// so you can always "un-fleurify" an object using my "sharpen corners" script.
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
//var ui = confirm('Remove shared control handles from adjacent points?');
//if( ui == true){
//	adjacentHandlesToo=ui;
//}
var pct=prompt("Fleurify by what percentage?","100");
//
//---------------------------------------main code:
//
for(var x=0;x<sellen;x++){
	
	if(sel[x].typename == 'PathItem'){
		// hose control points of selected path items
		knotHandles(sel[x]);
	
	
	}else if(sel[x].typename == 'CompoundPathItem'){
		//hose control points of selected compound path items
		var cpiLen = sel[x].pathItems.length;
		for (var j=0;j<cpiLen;j++){
			knotHandles(sel[x].pathItems[j]);
		}
	
	}else{
			ignoredItemCount ++;
		}

}
if(ignoredItemCount>0){
	alert('Just so you know:\n'+ignoredItemCount+' Item(s) ignored. \nTry selecting objects individually or ungrouping.');
}

//------------------------------functions below:
function hoseThisAnchor(ptOb,deets){
	var anch = ptOb.anchor;
	var cntr_arr = Array(anch[0],anch[1]);
	if(deets=='l'){
		ptOb.leftDirection = cntr_arr;
	} else if(deets=='r'){
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
function knotThisAnchor(ptOb,prevOb,nextOb){
	//var pct = 90;
	var anch = ptOb.anchor;
	var anchp = prevOb.anchor;
	var anchn = nextOb.anchor;
	var cntr_arr = Array(anch[0],anch[1]);
	var next_arr = Array(anchp[0],anchp[1]); 
	var prev_arr = Array(anchn[0],anchn[1]); 
	var nextpos = calculatePos(cntr_arr,next_arr,pct)
	var prevpos = calculatePos(cntr_arr,prev_arr,pct)
	ptOb.leftDirection = prevpos;
	ptOb.rightDirection = nextpos;
	 		
}
function knotHandles(ob){
			var ppl = ob.pathPoints.length;
		 
			for(var y=0;y<ppl;y++){
				if(ob.pathPoints[y].selected==PathPointSelection.ANCHORPOINT){

					if(y==0){
						knotThisAnchor(ob.pathPoints[y],ob.pathPoints[ppl-1],ob.pathPoints[y+1]);
					} else if (y==ppl-1){
						knotThisAnchor(ob.pathPoints[y],ob.pathPoints[y-1],ob.pathPoints[0]);
					} else{ 
						 
						knotThisAnchor(ob.pathPoints[y],ob.pathPoints[(y-1)],ob.pathPoints[(y+1)]);
					}
				}
			}	 
	
}
 
function calculatePos(pt1,pt2,pct){

var xsq = Math.pow(Math.max(pt1[0],pt2[0]) - Math.min(pt1[0],pt2[0]),2);
var ysq = Math.pow(Math.max(pt1[1],pt2[1]) - Math.min(pt1[1],pt2[1]),2);
var z = Math.sqrt(xsq+ysq);
//
var dx = (Math.max(pt1[0],pt2[0]) - Math.min(pt1[0],pt2[0]));
var dy = (Math.max(pt1[1],pt2[1]) - Math.min(pt1[1],pt2[1]));
//get ratio of width to height...
//var ratio = w/h;
//90+10*.5)
if(pt1[0] < pt2[0]){
	var nux = pt1[0]+(dx*(pct/100));
} else {
	var nux = pt1[0]-(dx*(pct/100));
}
//120
if(pt1[1]<pt2[1]){
	var nuy = pt1[1]+(dy*(pct/100));
}else{
	var nuy = pt1[1]-(dy*(pct/100));}
return([nux,nuy]);
}
