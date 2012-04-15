/////////////////////////////////////////////////////////////////
//Select Replicated (Overlaping) Text Items v.1 -- CS,CS2
//>=--------------------------------------
// This script removes all duplicate overlaping text items from a document.
// The ONLY parameters it checks are top and left coordinates, and text contents.
// Anchor points within one point of each other are considered the same.
// (tolerance can be adjusted by changing the 'tolerance' value.)
//
// The lower duplicate objects are selected for manual removal.
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
var selName = "document";
if(selection.length >0){
	selName = "current selection";
	var sel= activeDocument.selection;
	var selectedTextFrames = new Array(0);
	for (var all in sel){
		if(sel[all].typename == "TextFrame"){
			selectedTextFrames.push(sel[all]);
		}
	}
	sel = selectedTextFrames;

} else{
	var sel= activeDocument.textFrames;
}

var dupeTextFrames= new Array(0);
var tolerance = 1;
var slen = sel.length;
 
for(var all=0; all <slen;all++){
	checkDupe(sel,all); 
}
//
alert(dupeTextFrames.length + " duplicate Text items found in "+selName+".");
if(dupeTextFrames.length>0){
	
activeDocument.selection = [];
	for (all in dupeTextFrames){
		dupeTextFrames[all].selected = true;

	}
} 
//--------------------------------------- 

function checkDupe(ob,n){
	 //t == objects so far

	 for(var t=0; t <n ;t++){
		if(ob[t].typename == "TextFrame"){
			if (isWithin(ob[n].left,ob[t].left,tolerance) &&
				isWithin(ob[n].top,ob[t].top,tolerance) &&
				ob[n].contents == ob[t].contents){
			dupeTextFrames.push(ob[n]);
			break;
			
			} 
		}
	 }
 }
function isWithin(YposA,YposB,tol){
	if(YposA==YposB){return true};
	if(findDiff(YposA,YposB)<tol){
		return true;
	}
	return false;
}
function findDiff(a,b){
	if( a>0 && b>0 && b>a  || 
		a<0 && b>0		   ||  
		a<0 && b<0 && a>b  ){
			return Math.abs(b-a);
	}
	return Math.abs(a-b);
}