/////////////////////////////////////////////////////////////////
//Select Paths By Size v.4.1.1.0 -- CS, CS2, CS3,CS4 (Change extension from 'jsx' to 'js' to run in CS)
//>=--------------------------------------
//   Selects all Path Objects, smaller/larger than given threshold
//   Only works for path and compound path objects.
//
//    If paths are selected, script runs on selected items only,
//    If nothing is selected, script runs on all paths in document.
//		::: Updates in V2 :::
//		&bull; Rebuilt to select based on Size,  Area,  Width or by Height.
//		&bull; Added "same size as" option
//		&bull; If one object is selected, starts threshold at that size.
//		&bull; Added Tool Tips
//		::: Updates in V3 :::
//		&bull; Added status indicator
//		&bull; Rebuilt processing engine so it's faster and more accurate
//		::: Updates in V4 :::
//		&bull; Added  progress bar  (CS3 and above)
//	    &bull; Speed increase
//		::: Update v4.1 :::
//		&bull; Select by stroke weight (patched in 4.1.1)
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

/*   Notes:

*/
 function Loadbar(x){
		this.versionNum= app.version.split(".")[0] ;
	 if (this.versionNum >= 13){
		this.w = new Window('window', "Processing...", undefined, {independent:true});
		this.w.frameLocation = [600,500];
		this.w.tracker = this.w.add ('statictext' , [15,15,250,35], "processing");
		this.w.prog = this.w.add ('progressbar' , [15,15,250,35], 0, x);
		//this.w.show();
	}
 }
 
Loadbar.prototype.close = function(){
	 if (this.versionNum >= 13){
			this.w.close();
	 }
}
Loadbar.prototype.hide=function(){
	 if (this.versionNum >= 13){
			this.w.hide();
	 }
}
Loadbar.prototype.show=function(){
	 if (this.versionNum >= 13){
			this.w.show();
	 }
}
Loadbar.prototype.update=function(x){
	 if (this.versionNum >= 13){
		this.w.prog.value = x; 
	}
}
Loadbar.prototype.label=function(x){
	 if (this.versionNum >= 13){
 		this.w.tracker.text = x; 
	 }
}

if (app.documents.length > 0)
{
	var doc = app.activeDocument;
	
	var sel = doc.selection;
	var defaultValue = .05;
    var isStrokeSelected = false;
	if (sel.length == 1)
	{
		var seed =  (sel[0].width + sel[0].height) /2;
		if (seed != 0 || seed != null)
		{
			defaultValue = seed;
		}
	}

	var OK = 1;
	var by = "none";// flag for what method to walk objects selection/doc
	var tolerance = .005;
	var DISP_COLOR = new RGBColor();
		  DISP_COLOR.red = 0;
		  DISP_COLOR.green = 100;
		  DISP_COLOR.blue = 0;


var myVersion = Math.floor(version.split(".")[0]);

if (myVersion == 12 || myVersion == 11)
{
	try{
	//if version is CS2
		var tVar = prompt("Enter the numeric threshold, use '>' for greater than and '<' for less than,\n i.e.; '>50' would mean 'greater than 50', to match exactly, just enter a number.","<"+defaultValue);// dlg.alertBtnsPnl2.slide.value;
		if (tVar == null)
		{
			OK=3;
			throw("end");
		}
		var tArr = tVar.split("");
		var threshold = tVar;
		var GT = false;
		var LT = false;
		var EQ = false;
		if (tArr[0] == "<")
		{
			LT =  true;
			threshold = tVar.substr(1);
		} else if (tArr[0] == ">")
		{
			GT =  true;
			threshold = tVar.substr(1);
		} else {
			EQ = true;
		} 
		var CP_on = confirm("Include compound path objects?");
		var includeLocked = confirm("Include locked objects?");
		var dVal = prompt("Enter method for comparison, ('s'=size,'w'=width,'h'=height,'a'=area,'k'=stroke)","s");
		if (dVal == null)
		{
			OK=3;
			throw("end");
		}		
		
		var dims = "size";
		if (dVal == "w")
		{
			dims = "width";
		} else if (dVal == "h")
		{
			dims = "height";
		}else if (dVal == "a")
		{
			dims = "area";
		}
        else if (dVal == "k")
		{
			dims = "strokeWidth";
             isStrokeSelected=true;
		}
	}
	catch(e){
		// use "OK" values instead... 
	}

} else if (myVersion > 12)
{
	//use advanced functionality
	//--------------------------Dialog Box Code --------------------------------------------------------
	var dlg = new Window('dialog', 'Select Path Items:'); 
	dlg.location = [500,50];
	//																										[startX, StartY, EndX, EndY]
	dlg.alertBtnsPnl1 = dlg.add('group', undefined, 'Path Objects Size:');
	// Radio Buttons for Larger than, or smaller than
	(dlg.alertBtnsPnl1.selectLT = dlg.alertBtnsPnl1.add('radiobutton', [15,15,95,35], 'Smaller than' )).helpTip = "Select all  Path Items\nSmaller than\n the Slider Value."; 
	(dlg.alertBtnsPnl1.selectSS = dlg.alertBtnsPnl1.add('radiobutton', [15,15,75,35], 'Exactly' )).helpTip = "Select all Path Items\nThe Same value as\n the Slider Value."; 
	(dlg.alertBtnsPnl1.selectGT = dlg.alertBtnsPnl1.add('radiobutton', [15,15,95,35], 'Larger than' )).helpTip = "Select all Path Items\nLarger than \n the Slider Value."; 

	dlg.alertBtnsPnl1.selectLT.value = true; 
	dlg.alertBtnsPnl1.orientation='row';
	// Set Size of threshold
	 dlg.alertBtnsPnl2 = dlg.add('group',undefined, 'Threshold:');
	(dlg.alertBtnsPnl2.slide = dlg.alertBtnsPnl2.add('slider', [25,15,165,39], 'Set size of threshold object:')).helpTip = "Use Slider to set a threshold value."; 
	 dlg.alertBtnsPnl2.slide.value = defaultValue; 
	(dlg.alertBtnsPnl2.titleEt = dlg.alertBtnsPnl2.add('edittext', [100,15,160,35], dlg.alertBtnsPnl2.slide.value)).helpTip = "Enter a threshold value."; 
     dlg.alertBtnsPnl2.titleEt.text = roundOff(defaultValue); 
	(dlg.alertBtnsPnl2.titleSt = dlg.alertBtnsPnl2.add('statictext', [15,15,35,35], 'px')).helpTip = "Pixels."; 
	 dlg.alertBtnsPnl2.orientation='row';
	

	(dlg.dimsPnl = dlg.add('panel', undefined, 'In:')).helpTip = "How paths will be compared"; 
	dlg.dimsPnl.orientation='row';
	(dlg.dimsPnl.selectS = dlg.dimsPnl.add('radiobutton', [15,15,65,35], 'Size' )).helpTip = "(Width * Height) / 2"; 
	(dlg.dimsPnl.selectA = dlg.dimsPnl.add('radiobutton', [15,15,65,35], 'Area' )).helpTip = "The Items (internal) Area Value.\n Note: Open paths have no area.";
	(dlg.dimsPnl.selectW = dlg.dimsPnl.add('radiobutton', [15,15,70,35], 'Width' )).helpTip = "Select by Width ONLY";
	(dlg.dimsPnl.selectH = dlg.dimsPnl.add('radiobutton', [15,15,65,35], 'Height' )).helpTip = "Select by Height ONLY";
    (dlg.dimsPnl.selectStroke = dlg.dimsPnl.add('radiobutton', [15,15,65,35], 'Stroke' )).helpTip = "Select by Stroke Width ONLY";
	dlg.dimsPnl.selectA.value = true; 

	dlg.dimsPnl.selectS.onClick= setTextS;
	dlg.dimsPnl.selectH.onClick= setTextH;
	dlg.dimsPnl.selectA.onClick= setTextA;
	dlg.dimsPnl.selectW.onClick= setTextW;
    dlg.dimsPnl.selectStroke.onClick= setTextStk;


	// Add a checkbox to control selection
	dlg.alertBtnsPnl3 = dlg.add('group', undefined, '');
	(dlg.hasBtnsCb = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'Include Compound Path Items?')).helpTip=" Select items within compound paths too."; 
	(dlg.incLocked = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'Include Locked Items?')).helpTip=" Note: This unlocks everything."; 
	dlg.hasBtnsCb.value = true; 
	dlg.incLocked.value = false; 
	dlg.alertBtnsPnl3.orientation='column';

	dlg.btnPnl = dlg.add('group', undefined, 'Do It!'); 
	dlg.btnPnl.orientation='row';
	dlg.btnPnl.buildBtn1= dlg.btnPnl.add('button',[15,15,115,35], 'Cancel', {name:'cancel'}); 
	dlg.btnPnl.buildBtn2 = dlg.btnPnl.add('button', [125,15,225,35], 'OK', {name:'ok'}); 
	dlg.alertBtnsPnl2.slide.onChange= sliderChanged;
	dlg.alertBtnsPnl2.titleEt.onChanging = eTextChanged;
	dlg.btnPnl.buildBtn1.onClick= actionCanceled;
	dlg.show();

		// Translate dialog here:
		var threshold =  1*(dlg.alertBtnsPnl2.titleEt.text);// dlg.alertBtnsPnl2.slide.value;
		var CP_on = dlg.hasBtnsCb.value; //false; // !  confirm("Ignore compound path objects?");
		var GT = dlg.alertBtnsPnl1.selectGT.value;
		var EQ =  dlg.alertBtnsPnl1.selectSS.value;
		var LT =  dlg.alertBtnsPnl1.selectLT.value;
		var includeLocked = dlg.incLocked.value;
		var dims = "size";
		if (dlg.dimsPnl.selectW.value)
		{
			dims = "width";
            isStrokeSelected=false;
		} else if (dlg.dimsPnl.selectH.value)
		{
			dims = "height";
            isStrokeSelected=false;
		}else if (dlg.dimsPnl.selectA.value)
		{
			dims = "area";
            isStrokeSelected=false;
		}else if (dlg.dimsPnl.selectStroke.value)
		{
			dims = "strokeWidth";
              isStrokeSelected=true;
		}
	}  else {
	OK = 2; // alert and close with "version" message
	}// end version check

	//--------------------------Main Code Section --------------------------------------------------------

 	var dObj = new Date();
	var start = dObj.getTime();
	var niceTime = (dObj.getMonth( )+1)+"-"+dObj.getDay( )+"-"+dObj.getFullYear( ).toString().substr(2)+"_"+dObj.getHours( )+"."+dObj.getMinutes( )+"."+dObj.getSeconds( );
	var topLocked = doc.layers[0].locked;
		if(OK==1){
			//add a temporary layer for tracking
			/*  //too slow
			var dispLayer = doc.layers.add();
			var pointTextRef = dispLayer.textFrames.add();
			pointTextRef.textRange.fillColor = DISP_COLOR;
			pointTextRef.selected = false;
			pointTextRef.top = doc.height/2;
			pointTextRef.left = doc.width/2;
			*/
			var selItems = new Array();
			//pointTextRef.contents = "Pre-Processing!!!";
			//redraw();

			var selLen = sel.length;
			if(selLen >1){
				
				by = "selection";
				//
				var b = new Loadbar(selLen);
				b.label("Preprocessing Data...");
				b.show();
				// pointTextRef.top = selection[0].top;
				// pointTextRef.left =selection[0].left;
				// redraw();
			// deselect Compound path items if not included
				var cpLen = doc.compoundPathItems.length;
				for (var cp=0;cp<cpLen ;cp++ )
				{
					b.label("Deselecting Compound Pathitem "+cp+" of "+cpLen);
					b.update(cp);
					if(!CP_on){
						doc.compoundPathItems[cp].selected = false;
					}
				}
			var plen = doc.pathItems.length;
			// Add selected path items to Array

				 var i = null;
				 for (var x=0;x<plen ;x++ )
				 {
					b.label("Pre-Processing item "+x+" of "+plen);
					b.update(x);
					 i = doc.pathItems[x];
					if (i.selected== true   )
					{
						selItems.push(i);
					}
				 }
				
			} else {
				by = "doc";
				//

				// copy pathitems array to selItems
				// if they arent part of a compoundPath
		 
				var plen = doc.pathItems.length;
				var b = new Loadbar(plen);
				b.label("Preprocessing Data...");
				b.show();
				// Add selected path items to Array
				 var i = null;
				 for (var x=0;x<plen ;x++ )
				 {
					 i = doc.pathItems[x];
					if (!CP_on && i.parent.typename == "CompoundPathItem")
					{
						continue;
					}else if (!includeLocked && (i.layer.locked == true || i.locked==true))
					{
						continue;
					}	else {
						selItems.push(i);
					} // end 'if'
				
				} // end 'for'
			 
			} // end else

			 if (myVersion <= 12 && selItems.length > 1000)
			{
                alert(" Go get a coffee, this is going to take a while...");
			}
			selectBelow(selItems);
		 

			// -----------------cleanup and analytics--------------------------
             //pointTextRef.remove();
             //	redraw();
			b.close();
			var fObj = new Date();
			var finish= fObj.getTime();
			var totalSeconds = (finish-start)/1000;
			var minutes = Math.floor(totalSeconds/60); 
			var seconds = totalSeconds%60;
			alert(doc.selection.length+" Paths Selected in "+minutes+" minutes, "+Math.round(seconds)+" seconds.");
			//dispLayer.remove();
		} // end cancel test
} else {
	if (OK==2)
	{
		alert("You must have at least Illustrator CS to run this script!");
	} else if(OK ==3){
			//die quitly
	
	}
	
	else {
	 alert("You must have a document open to run this script!");
	
	}
	
}

//----------------------------------------------Nobody here but us functions---------------------------------------------------------

//-------------------------------Dialog box functions---------------------------v.13 >
function actionCanceled() { 
	OK = 3;
	dlg.hide();
}
function sliderChanged() { 
	dlg.alertBtnsPnl2.titleEt.text = dlg.alertBtnsPnl2.slide.value;
}

function setTextS() { 
	//if single item selected, change default to items Size
	if (doc.selection.length == 1)
	{
		dlg.alertBtnsPnl2.titleEt.text = roundOff(Math.abs( (doc.selection[0].width+doc.selection[0].height)/2));
        isStrokeSelected=false;
	}

}
function setTextStk() { 
	//if single item selected, change default to items Stroke
	if (doc.selection.length == 1)
	{
		dlg.alertBtnsPnl2.titleEt.text = roundOff(doc.selection[0].strokeWidth);
        isStrokeSelected=true;
	}

}
function setTextH() { 
	//if single item selected, change default to items Height
		if (doc.selection.length == 1)
	{
		dlg.alertBtnsPnl2.titleEt.text = roundOff(doc.selection[0].height);
        isStrokeSelected=false;
	}
}
function setTextA() { 
	//if single item selected, change default to items Area
		if (doc.selection.length == 1)
	{
		dlg.alertBtnsPnl2.titleEt.text = roundOff(Math.abs( doc.selection[0].area));
        isStrokeSelected=false;
	}
}
function setTextW() { 
	//if single item selected, change default to items Width
		if (doc.selection.length == 1)
	{
		dlg.alertBtnsPnl2.titleEt.text = roundOff(doc.selection[0].width);
        isStrokeSelected=false;
	}
}
function eTextChanged() { 
	dlg.alertBtnsPnl2.slide.value = dlg.alertBtnsPnl2.titleEt.text;
}
//-------------------------------End Dialog box functions---------------------------v.13 >
// common functionality: 

 function selectBelow(sel){
	var MAX = sel.length;
	 for (var x=0;x<MAX;x++)
	 {
		// alert("now processing:"+sel[x].typename);
		if(sel[x].locked == true){
			if (includeLocked)
			{
				sel[x].locked = false;
			} else {
				continue;
			}
	
		}
		try{
            sel[x].selected = true;
		}
		catch(e){
            // on a locked layer...
		}

		//=========normal pathitem=============
		if (sel[x].typename == "PathItem")
		{			 
				//pointTextRef.top = sel[x].top;
				//pointTextRef.left = sel[x].left;
				//pointTextRef.contents = "Processing item "+x+" of "+MAX;
					 if (myVersion <= 12){redraw();}
				//redraw();
				b.label("Processing item "+x+" of "+MAX);
				b.update(x);
				b.show();
				checkThreshold(sel[x],dims);
			 
		}  else {
		 
			//not a pathitem, dont care...
			sel[x].selected = false;
		}
	}
 }
 
 function checkThreshold(obj,prop){

    //alert(isStrokeSelected);
    //if stroke selected, and object not stroked, kill it
    if( ( isStrokeSelected  &&  ( obj.stroked == false) )){
        obj.selected=false;
        return;
    } 
     
     //if compound path kill it
	 if(  CP_on == false && obj.parent.typename == "CompoundPathItem"){
			obj.selected=false;
			return;
	 }
 
	var p = 0;
	 if(prop == "size"){
		 //square root of area...  (Need abs because in compound shapes, the area can be negative
		  p = Math.abs( (obj.width+obj.height)/2);
	 } else {
		 p = Math.abs(eval("obj."+prop));
	 }

    // deselect if less than
    if (GT && p < threshold+tolerance) // actually creating a tolerance for DEselection, meaning objects same size will be booted.
    {
        obj.selected=false;
        return;
    }
     // deselect if larger than
    if (LT && p > threshold-tolerance)
    {
        obj.selected=false;
        return;
    }
     // deselect if exactly same size as:
    if (EQ && (p<threshold-tolerance || p > threshold+tolerance) )
    {
 
        obj.selected=false;
        return;
    }
 }

 function copyArr(a){
 var a2 = [];
 var len = a.length;
for (var ca=0; ca<len;ca++ )
{
	a2.push(a[ca]);
}
 
 return a2;
 }
 function roundOff(x){
	var place = 100;
	x = Math.round(x*place);
	x /= place;
	return x;
 }