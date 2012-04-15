/////////////////////////////////////////////////////////////////
//Extrude Faces  v.1.0.0.0 -- CS2, CS3, CS4
//>=--------------------------------------
//		Select any face or group of faces on a pathItem, 
//		and this script will duplicate the anchor points on either side of the selected anchors,
//		allowing you then manually extrude the selection from the object. 
//		
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

//Notes: change to false, or just comment out the following line to turn off the "success" message.
var displaySuccessMessage= true;

 

//==============Prep code above this line===================

Array.prototype.shuffle = function(){		// shuffles an array...  
	//this.sort(function(a,b){return (Math.random()>.5)});	// <----  this works but causes massive memory leaks ..why???
 /*
	this.sort(function() {Math.random() - 0.5});
	 	 */
	var len=this.length;
	 for (var e=0;e<(len*2) ;e++ )
	 {
		 var p = this.pop();
		 var rand = Math.floor(Math.random()*len-1);
		  this.splice(rand,0,p);

	 }

 
}
function Pt(a,left,pT,right,selected){		// Pt object constructor: makes a "virtual" point that can be added to an array.
	this.anchor = [a[0],a[1]];					//	 Adds a 'state' property for per-point tracking.
	this.leftDirection = [left[0],left[1]];
	this.pointType = pT;
	this.rightDirection= [right[0],right[1]];
	this.selected=selected;//PathPointSelection.ANCHORPOINT;//selected;
	//if selected
	if (selected==PathPointSelection.ANCHORPOINT)
	{
		this.state="selected";
	}else{
		this.state="unselected";
	}
}
Pt.prototype.toString = function(){	// re-defines the behavior of the "Pt.toString" function.
	var o="";
	o+= "anchor:"+this.anchor+"\n";
	o+= "left:"+this.leftDirection+"\n";
	o+= "pointType:"+this.pointType+"\n";
	o+= "rightDirection:"+this.rightDirection+"\n";
	o+= "selected:"+this.selected+"\n";
	o+= "state:"+this.state;
	o+="\n-----------------------------\n";
	return o;
}
Pt.Make = function(p){	 // shortcut to create a point object from a single pathObject point.
	//alert(p.parent);
	var np=new Pt(p.anchor,p.leftDirection,p.pointType,p.rightDirection,p.selected);
	return np;
}
Pt.MakeAll=function(obj){			// Translates a pathObjects points to a far more manipulable Array of points.
		myPoints = [];
		var ppl=obj.pathPoints.length;
		for (each=0;each<ppl;each++)
		{
			try{
				var tempPt = Pt.Make(obj.pathPoints[each]);
				//alert(tempPt);
				myPoints.push(tempPt);
			}
			catch(e){
			alert("fail:"+e);
			}
		}
	return myPoints;
}
Pt.Assign = function(obj,pt_arr){	//   Translates the  custom Array of points back into a pathObjects points.
	
	var len = pt_arr.length;
	
	while(obj.pathPoints.length<len){	//make sure we have enough points first
		obj.pathPoints.add();
	}
	for (each =0;each<len ;each++ )
	{
		var e = obj.pathPoints[each];
		var a = pt_arr[each].anchor;
		var left = pt_arr[each].leftDirection;
		var pT= pt_arr[each].pointType;
		var right = pt_arr[each].rightDirection;
		var selected = pt_arr[each].selected;
		// ==========assign new values====================
		e.anchor = [a[0],a[1]];
		e.leftDirection = [left[0],left[1]];
		e.pointType = pT;
		e.rightDirection= [right[0],right[1]];
		e.selected=selected;
		
	}

}
//===================end Object Definitions====================


//runWith("1 pathObject");
main();

function main(){
	//put your code here
	var AnchorSelFlag = 1;
	doc=activeDocument;
	sel=doc.selection;
	selLen=sel.length;
	var p_arr =Pt.MakeAll(sel[0]);
	//----------------------------------------

	//processObjects(sel,shuffleObj);
	var mySel = sel[0];
	var pp = mySel.pathPoints;
	var spp = sel[0].selectedPathPoints;

var anchorPointsSelected = countAttsInX(spp,"selected",PathPointSelection.ANCHORPOINT);
var directions = "select either a line segment, or multiple Anchor Points with the direct selection arrow.";
if (anchorPointsSelected==1)
{
	var AnchorSelFlag = 0;
}else if (anchorPointsSelected == pp.length  )
{
	alert("You cannot extrude the entire object silly! \n"+directions);
	return;
}


	if ( (spp.length < 4))  // nothing selected, or entire object is selected (unless object is a line)
	{
		AnchorSelFlag=0;
		//alert("Use the \"Direct Selection\" Arrow to select at least two anchor points to define the segment for extrusion.");  // +spp.length+" were found.");
		//return;
	}
	
	var p_len = p_arr.length;	// get point array length
	for (var e=0;e<p_len ;e++ )	//walk through points 
	{
		//alert(p_arr[e].selected);
		if(p_arr[e].selected == PathPointSelection.RIGHTDIRECTION || p_arr[e].selected == PathPointSelection.LEFTRIGHTPOINT){	// to find the first selected point.
				if (e==0)		// no need to shuffle if we got it on the first try...
				{
					break;
				} else{
					//split the array at the first point 
					var preSelPt = p_arr.slice(0,e);
					var selPtOn = p_arr.slice(e);
					p_arr = selPtOn.concat(preSelPt); //  rejoin so that RIGHTDIRECTION point is the first item in the array.
																		  // this relocates the objects start point which 
																		  //prevents the selected points from wrapping across the start point.
					break;
				}
		}
	}	// end for...

// now, RE walk the NEW ordered array to find the LEFT DIRECTION
// We now know that p1 has to be p_arr[0]. (so we start at 1)
//alert(p_len+" == "+p_arr.length+"??");
	for (var e=1;e<p_len ;e++ )	//walk through points 
	{
		//alert(p_arr[e].selected);
		if(p_arr[e].selected == PathPointSelection.LEFTDIRECTION || p_arr[e].selected == PathPointSelection.LEFTRIGHTPOINT)
			{	// to find the first selected point.
			 
			 // now we've found our second point.
			var pt2Loc = e;
			break;
			}
	}	// end for...


 


	var p1 = p_arr[0+AnchorSelFlag];	//AnchorSelFlag is defined by whether user selected a line or a set of points.
	var newPt1 = Pt.Make(p1);			
	//alert(p1);
	
																		/*
																 		 newPt1.anchor[0]+=5;			//For testing
																		newPt1.anchor[1]+=5;			
																		//	 */
	// fix control handles;
	if (AnchorSelFlag==1)
	{
		setDir2Anc(p1,"left");
		setDir2Anc(newPt1,"right");
		newPt1.selected = PathPointSelection.NOSELECTION;
	}else{
		setDir2Anc(p1,"right");
		setDir2Anc(newPt1,"left");
		newPt1.selected = PathPointSelection.ANCHORPOINT;
	}

	

	var p2 = p_arr[pt2Loc-AnchorSelFlag];	// p2Loc  is defined from above loop
	//alert(p2);
	var newPt2 = Pt.Make(p2) ;		
	
																		/*
															 			newPt2.anchor[0]+=5;			//For testing
																		newPt2.anchor[1]+=5;		
																		//	 */
	
	if (AnchorSelFlag==1)
	{
		setDir2Anc(p2,"right");
		setDir2Anc(newPt2,"left");
		p2.selected = PathPointSelection.ANCHORPOINT;
		p_arr[pt2Loc].selected = PathPointSelection.NOSELECTION;
	}else{
		setDir2Anc(p2,"left");
		setDir2Anc(newPt2,"right");
		//p2.selected = PathPointSelection.ANCHORPOINT;
		//p_arr[pt2Loc].selected = PathPointSelection.NOSELECTION;
				 newPt2.selected = PathPointSelection.ANCHORPOINT;	//newPt2.anchor[0]+=15;	
	}

	if (newPt1.anchor[0] == newPt2.anchor[0] && newPt1.anchor[1] == newPt2.anchor[1]  )
	{
		alert("You cannot extrude overlapping points.");
		return;
	} else{
		p_arr.splice(1,0,newPt1);			//add the 2 new points to the array			
		p_arr.splice(pt2Loc+1,0,newPt2);	
	}
	

	// 
	Pt.Assign(sel[0],p_arr);		//reassign points to object
	if(displaySuccessMessage== true){
		alert("2 points Added!\n=================================\n Now just drag the selected path to extrude.\n\nNote: You can hide this message\n by commenting out the \"displaySuccessMessage\" variable\n at the top of the script.");
	}
	return;
 
 
}

function processObjects(sel,func){
	var selLen = sel.length;
	for (var e=0;e<selLen;e++)		//walk through the array
	{
			if(sel[e].typename =="PathItem" ){	//Got something we can use...
					func(sel[e]);
			}else if (sel[e].typename=="GroupItem")
			{
					processObjects( sel[e].pageItems,func);			//	 send back to recursive loop
			}else if (sel[e].typename=="CompoundPathItem")
			{
				processObjects(sel[e].pathItems,func );	//	 send back to recursive loop
			}
	}
}

function lenLine(a1,a2){
return lineLength(a1[0],a1[1],a2[0],a2[1]);

}
function lineLength(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};



function shuffleObj(item){
	 
		var newObj_arr = Pt.MakeAll(item);
		newObj_arr.shuffle();
		Pt.Assign(item,newObj_arr);

}

function setAttsToX(arr,att,x){
	var len = arr.length;
	for (var e=0;e<len;e++)
	{
		arr[e][att] = x;
	}

}

function countAttsInX(arr,att,x){
	var len = arr.length;
	var count=0;
	for (var e=0;e<len;e++)
	{
		if (arr[e][att] == x)
		{
			count++;
		};
	}
return count;
}

function setDir2Anc(obj,dir){
	obj[dir+"Direction"][0] = obj.anchor[0];		
	obj[dir+"Direction"][1] = obj.anchor[1];
}