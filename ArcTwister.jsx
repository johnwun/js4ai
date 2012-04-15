/////////////////////////////////////////////////////////////////
//Arc Twister v2.0 -- CS, CS2, CS3, CS4
//>=--------------------------------------
//
//  This script will twist an objects selected control handles 
//  by the same amounts.  
// 
//   <b>Current tweakable options are:</b>
//    1) Left handles only
//    2) Right handles only
//	   3) Mirror Angles (i.e.; rotates left handle x deg, right handle -x deg.)
//	   4) Rotate Angles (Fixed relative to each other)
//	   5) Change angles to Smooth (180 deg) and rotate.
// 
//   <b>Please Note:</b>
//			I've created 3 interfaces for this script, and this is the most flexible and functional. 
//			The first was using a kludgy basic 'prompt' dialog,
//			The second version used a swf interface that was slick, but encountered various issues during install.
//			This version uses Adobes JXS UI tools, so you get a dialog widget that is both easy to use, and works.
//			If you're using pre CS2, this script will gracefully fall back on the "prompt" interface.
//			
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
////////////////////////////////////////////////////////////////// 

//#includepath "C:/Program Files/Adobe/Adobe Illustrator CS3/Presets/Scripts/_includes/"
//#include "runWith.jsxinc"

function runWith(){
	
	// var aLen = arguments.length;
	var cmd=arguments[0];

	var a=cmd.toString().split(" ");		
	var selLimit = a[0];
	var obj = a[1];
	var precision = a[2];
	if (precision == undefined)
	{
		precision= "=";
	}else {
		precision=precision.toLowerCase();
	
	}

	if (selLimit == undefined)
	{
		selLimit = "0";
	}

	if (obj == undefined)
	{
		obj = "object";
	}


	//==================
	if (precision ==  "max")
	{
		prec= "less than";
	} else 	if (precision ==  "min")
	{
		prec="at least";
	} else {
		prec = "exactly"
	};

	//=======Define messages=======
	var contents = prec+" "+selLimit+" "+obj;
	var noDocs = "Please open a document containing "+contents;
	var  selectProb = "Please select "+contents;
	//========Handle Situation============
	try{
			if (documents.length<1)
		{
			throw(noDocs);
		}
		// === set globals ===
		doc = activeDocument;
		sel = doc.selection;
		selLen = sel.length;
		//=== test==
		//alert(selLen+","+selLimit+","+precision);
		if ((selLen < selLimit && precision == "min") || (selLen > selLimit && precision == "max") || (selLen !=  selLimit && precision == "="))
		{
			// If below max, abov min, or not exactly selLimit, then complain...
			throw(selectProb);
		} 
		
	}
	catch(e){
				alert(e)
			return;
	}

	main();
}
//Convenient Global vars...
var doc = undefined;
var sel = undefined;
var selLen = undefined;

var versionNum=app.version.split(".")[0] ;

//set up global vars:
var testmode=0;
var dchange=0;
var achange=0;
var changed=0;
//var mod = 'M';
var modUI= 'M';
var chUI='""' ;

runWith("1 object min");


function main(){
	

	 if (versionNum >= 13){
		var dlg = new Window('dialog', 'ArcTwister',[100,100,460,260]); 
		dlg.radioPnl = dlg.add('panel', [15,15,100,150], 'Handle Types'); 
		dlg.sliderPnl = dlg.add('group', [105,15,375,115], ''); 
		dlg.btnPnl = dlg.add('group', [105,120,375,155]); 

		//	 -------------	Radio Panel ---------------------------------
		//dlg.radioPnl.orientation = 'column';
		//dlg.radioPnl.alignChildren='left';
		dlg.radioPnl.leftHandRb = dlg.radioPnl.add('radiobutton', 		[5,25,95,45], 'Left'); 
		dlg.radioPnl.rightHandRb = dlg.radioPnl.add('radiobutton', 		[5,45,95,65], 'Right'); 
		dlg.radioPnl.mirrorHandRb = dlg.radioPnl.add('radiobutton',		[5,65,95,85], 'Mirror'); 
		dlg.radioPnl.fixedHandRb = dlg.radioPnl.add('radiobutton', 		[5,85,95,105], 'Fixed'); 
		dlg.radioPnl.smoothHandRb = dlg.radioPnl.add('radiobutton', 	[5,105,95,125], 'Smooth'); 
		dlg.radioPnl.mirrorHandRb.value = true; 

		//							-------------Slider Panel-------------------
	 
													dlg.sliderPnl.add ('statictext', [15,5,200,25], 'Adjust Handle Lengths (by Pixels)'); 
		dlg.sliderPnl.lengthSlider =	dlg.sliderPnl.add ('slider', [5,25,195,45], 0, -100, 100); 
		dlg.sliderPnl.lengthSlider_txt =	dlg.sliderPnl.add ('edittext', [200,20,245,40], '0'); 

													dlg.sliderPnl.add ('statictext', [15,55,200,75], 'Adjust Handle Angles (by Degrees)'); 
		dlg.sliderPnl.angleSlider =	dlg.sliderPnl.add ('slider', [5,75,195,95], 0,-90,90); 
		dlg.sliderPnl.angleSlider_txt =	dlg.sliderPnl.add ('edittext', [200,70,245,90], '0'); 


		//							-------------Buttton Panel-------------------
		//dlg.btnPnl.cancelBtn = dlg.btnPnl.add('button', [35,3,85,27], 'Cancel', {name:'cancel'}); 
		dlg.btnPnl.buildBtn = dlg.btnPnl.add('button', [100,3,145,27], 'Done', {name:'ok'}); 


		//-----------------event Handlers:----------------------------
		dlg.radioPnl.leftHandRb.onClick = radioSwitch;
		dlg.radioPnl.rightHandRb.onClick = radioSwitch;
		dlg.radioPnl.mirrorHandRb.onClick = radioSwitch;
		dlg.radioPnl.fixedHandRb.onClick = radioSwitch;
		dlg.radioPnl.smoothHandRb.onClick = radioSwitch;
		//===
		dlg.sliderPnl.lengthSlider.onChanging = sliderLength;
		dlg.sliderPnl.lengthSlider.onChange = sliderLengthReset;
		//
		dlg.sliderPnl.angleSlider.onChanging = sliderAngle;
		dlg.sliderPnl.angleSlider.onChange = sliderAngleReset;



		//dlg.msgPnl.titleSt = dlg.msgPnl.add('statictext', [15,15,105,35], 	'Alert box title:'); 
		//dlg.msgPnl.msgSt = dlg.msgPnl.add('statictext', [15,65,105,85], 	'Alert message:'); 
		dlg.center();
		dlg.show(); 

		dchange = -dlg.sliderPnl.lengthSlider_txt.text;
		achange = dlg.sliderPnl.angleSlider_txt.text;
	 } else {
		// pre CS2
		var mod = 0;
		modUI= prompt('(L)eft Only, (R)ight Only, (F)ixed angle,(M)irror angle or (S)mooth 180 deg.:',mod).toUpperCase();
		chUI= prompt('change angle,distance:',achange+','+dchange);
 
		var chUI_arr = chUI.split(',');
		if(chUI_arr.length==2){
			achange = Number(chUI_arr[0]);
			dchange = -Number(chUI_arr[1]);
		}else{
			achange = Number(chUI);
		}

	 }
	processUI();

//--------------JSX UI functions

function radioSwitch(){
	modUI = this.text.substr(0,1);
	//alert ( this.text+":"+modUI);
	
}

function sliderLength(){
	//alert("slider Length called");
	dlg.sliderPnl.lengthSlider_txt.text = Math.round(this.value);
}
function sliderLengthReset(){
	//alert("slider Length called");
	var val = this.value;
	dchange = -val;
	achange =  dlg.sliderPnl.angleSlider_txt.text ;
	processUI();
	redraw();
	this.value=0;
	dlg.sliderPnl.lengthSlider_txt.text = Math.round(this.value);
	//alert(this+" set to "+val);


}
function sliderAngle(){
	//alert("slider Length called");
	dlg.sliderPnl.angleSlider_txt.text = Math.round(this.value);
}
function sliderAngleReset(){
	//alert("slider Length called");
	var val = this.value;
		achange = val;
		dchange = dlg.sliderPnl.lengthSlider_txt.text;
		processUI();
		redraw();
	this.value=0;
	dlg.sliderPnl.angleSlider_txt.text = Math.round(this.value);
		//alert(this+" set to "+val);

}
	
 


};// end Main

function processUI(){

	var solen = activeDocument.selection.length;
	//for each item in selection
	for (var so=0;so<solen;so++){
		var sob = activeDocument.selection[so];
		if(sob.typename=='PathItem'){
			//alert("pathitem found");
			transformObject(sob,modUI,achange,dchange);
		}else if(sob.typename=='GroupItem'){
			alert('GroupItem found. Please select ungrouped pathitems.');
			break;
		}else if(sob.typename=='CompoundPathItem'){
			var colen =sob.pathItems.length;
			for (var co=0;co<colen;co++){
				transformObject(sob.pathItems[co],modUI,achange,dchange);
			}
		}
	}
	if (changed==0){
		alert('Nothing was changed. Either no path items were selected, or items had no curves to tweak.');
	}
}


//----------------arcTwister Functions

function transformObject(sob,modUI,achange,dchange){
	//alert(modUI);
		var slen = sob.selectedPathPoints.length;
		// for each pathpoint in selection 0:
		for (var sc=0;sc<slen;sc++){
			var pt = sob.selectedPathPoints[sc];
			var ptA = pt.anchor;
			var ptB = pt.leftDirection;
			var ptC = pt.rightDirection;
			pt.pointType =PointType.CORNER;
			//alert(diff(10,15));
			//left handle
			var a = getAngle(ptA,ptB);
			var d = getDist(ptA,ptB);
			//right handle
			var a_r = getAngle(ptA,ptC);
			var d_r = getDist(ptA,ptC);
			if(modUI!='R') {
				a+=Number(achange);
			}
			if(modUI=='M' || modUI=='R' ){
				a_r-=Number(achange);
			}else if(modUI=='F') {
				a_r+=Number(achange);
			}else if(modUI=='S'){
				a_r=180+a;
				pt.pointType =PointType.SMOOTH;
			}
			changed=1
			var n = newCoords(ptA,a,d+dchange);
			var n_r = newCoords(ptA,a_r,d_r+dchange);
			//reposition left direction
			if(d!=0 && modUI!='R'){setLeftCoords(pt,n);}	
			if(d_r!=0 && modUI!='L'){setRightCoords(pt,n_r);}
		}
}
//
//--------------------------functions--------------------
//
function getAngle(pt1,pt2){
	var p1x = pt1[0];
	var p1y = pt1[1];
	var p2x = pt2[0];
	var p2y = pt2[1];
	var ln = (p2x-p1x);
	var ht =  (p1y-p2y); 
	//alert(ln+'+'+ht);
	return(-Math.atan2(ht,ln) * 180 / Math.PI);
}
function getDist(pt1,pt2){
	var p1x = pt1[0];
	var p1y = pt1[1];
	var p2x = pt2[0];
	var p2y = pt2[1];
	var ln = Math.abs(p2x-p1x);
	var ht = Math.abs(p1y-p2y);
	//alert(ln+' and '+ht);
	return(-Math.sqrt((ln*ln)+(ht*ht)));	
}
function newCoords(pt1, angle, dist){
	
	var startx = pt1[0];
	var starty = pt1[1];
	var hyp=dist;
	//ratio of length to width
	//var ratio = (Math.tan(angle * Math.PI / 180));
		var w = getw(hyp,angle)
		var h = geth(hyp,angle)
		//this prevents handles of 0 length from being created
		if(startx-w==0){
			getw(hyp+1,angle);
		}
		if(starty-h==0){
			geth(hyp+1,angle);
		}
		return([startx-w,starty-h]);
	}
function getw(hyp,ang){
	return(hyp*Math.cos(ang * Math.PI / 180));
}
function geth(hyp,ang){
	return(hyp*Math.sin(ang * Math.PI / 180));
}
function setLeftCoords(pt,c_arr){
	pt.leftDirection=c_arr;
}
function setRightCoords(pt,c_arr){
	pt.rightDirection=c_arr;
}