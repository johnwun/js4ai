/////////////////////////////////////////////////////////////////
// All Points v.1.3 -- CS,CS2,CS3,CS4
//>=--------------------------------------
// This script simply draws a line from every point to every other point of your selected pathitem. 
// Handy for making Mandalas. Try on polygons, stars or even freehand shapes.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
 function Loadbar(x){
		this.versionNum= app.version.split(".")[0] ;
	 if (this.versionNum >= 13){
		this.w = new Window('window', "Processing...", undefined, {independent:true});
		this.w.frameLocation = [600,400];
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

Array.prototype.indexOf = function(i){
	var len = this.length;
	for (var a=0;a<len;a++)
	{
		if (this[a]==i)
		{
			return a;
		}
		return -1;
	}
}

Array.prototype.man = function(test, tvars_arr, doThis, dovars_arr) {
	var FUN="function";
	var OBJ="object";
	var UND="undefined";
	var a=typeof test;
	var b=typeof tvars_arr;
	var c=typeof doThis;
	var d=typeof dovars_arr;
	// if only an array is given, it is assumed we wish to copy to it:
	if (a==OBJ && tvars_arr ==undefined && doThis==undefined && dovars_arr==undefined)
	{
		dovars_arr = test;
		test=undefined;
	}
	//if we just want to process all items without any testing:   doThis,[dovars_arr]				fun,ob
	if (a==FUN && b==OBJ && doThis==undefined && dovars_arr==undefined)
	{
		//alert("correct");
		doThis=test;
		test=undefined;
		dovars_arr=tvars_arr;
		tvars_arr=undefined;
	}else if(a==FUN && b==FUN){		//			fun,fun  OR 	fun,fun,ob
		if (c==OBJ)
		{
			dovars_arr=doThis;
		}
		doThis=tvars_arr;
		tvars_arr=undefined;
	} 
// Either case should work as normal:  	fun,ob,fun    OR   	fun,ob,fun,ob 
// Now set defaults if anything is missing:
	test= test==undefined?AMT_exists:test;
	tvars_arr= tvars_arr==undefined?[0]:tvars_arr;
	doThis= doThis==undefined?AMA_exportTo:doThis;
	dovars_arr= dovars_arr==undefined?[0]:dovars_arr;
//
	var sl = this.length;
	for (var ds = 0; ds<(sl-1); ds++) {
		//first referenced function call
		if (test(this[ds], tvars_arr)) {
			// second referenced function call
			var ret = doThis(this[ds], dovars_arr);
			//change original array item if something is returned
			if (ret != undefined) {
				this[ds] = ret;
			}
		}
	}
}
//DEFAULT TEST:
function AMT_exists(item, y_arr) {
	//filler function for arrayMan
	//always true
	return 1;
}
//DEFAULT ACTION:
// exports each tested item to exp_arr
function AMA_exportTo(item, exp_arr) {
	//alert(item);
	exp_arr.unshift(item); //unshift because the array is being processed backwards.
}
function AMA_LinesTo(item, vars_arr) {
	var count = vars_arr[0];
	var group = vars_arr[1];
	var src_arr = vars_arr[2];
	var sal = src_arr.length;
	// draw a line from this point, to every remaining point in the array
	if (count == sal-1)
	{
		//alert("last one");
		return
	}
	
	//

	for (var p=(count+1);p<sal ;p++ )
	{
		var myLine = drawLine(item.anchor, src_arr[p].anchor);
		
		/*											// uncomment for some fun grayscale  action
		var col=255/(sal/(count+1));
		myLine.strokeColor.red = col;
		myLine.strokeColor.green= col;
		myLine.strokeColor.blue = col;
		*/
		
		b.update(p);
		b.label("Item:"+(s+1)+" of "+selLen+". (node "+count+" of "+(sal-1)+")");
		//redraw();
		//alert("drawing count:"+count+"\nindex of "+item+" in:"+src_arr+":"+src_arr.indexOf(item));
	}
	
	vars_arr[0]++; //note: count++ doesnt work
}

function drawLine(anchor1,anchor2) {
	//alert(anchor1+" and "+anchor2);
		//draw a single line from point a to point b
		var linePath = shapeGroup.pathItems.add();
		var offset=0; // [anchor1[0]-offset,anchor1[1]-offset]
		linePath.setEntirePath( Array(anchor1,anchor2) );
		linePath.closed = false;
		linePath.stroked = true;
		linePath.filled = false;
		linePath.strokeWidth = 1;
		return linePath;

}

//----------------main

alert0="Please open a document";
alert1="Please select at least one non-compound PathItem";

if ( app.documents.length == 0 ) {
		alert(alert0);
}else if (app.activeDocument.selection.length == 0){
	alert(alert1);
}else if (app.activeDocument.selection[0].typename != "PathItem"){
	 alert(alert1);
 }else{
	doc=activeDocument;
	 sel=doc.selection;
	selLen=sel.length;
	// walk through each selected item
	for (var s=0;s<selLen ;s++ )
	{
		if (sel[s].typename == "PathItem")
		{
 
			var b = new Loadbar(sel[s].selectedPathPoints.length);
			b.show();
			var obj = sel[s];
			var src_arr = obj.selectedPathPoints;
			var count = 0;
			var shapeGroup = app.activeDocument.groupItems.add();
			src_arr.man(AMA_LinesTo,[count,shapeGroup,src_arr]);
			b.close();

		}

	}

 }