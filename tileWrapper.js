/////////////////////////////////////////////////////////////////
// TileWrapper -- CS
//>=--------------------------------------
//
// This script creates and exports seamless JPG or PNG tiles.
// It's purpose is to help generate quick seamless tiled backgrounds for web pages.
// To use this script: create a crop area, 
// ( Object>Crop Area>Make )
// and draw some objects within it.
// IMPORTANT: Overlap objects to the BOTTOM and the RIGHT side of the crop area only. 
// Objects that extend beyond the top or the left of the crop area will be ignored.
//
// To create a tile: 
// select all items in the crop area, and run the script.
// This will copy all objects that overlap the <b>bottom</b> and <b>right</b> crop 
// areas to the opposite side of the crop area, creating a perfect tile.
//
// To Export as JPG: 
// Re-run the script with nothing selected. The script will ask for a destination. 
// Export options are JPG or PNG.
//
// Notes: Objects are copied to the bottom of the <b>same layer as it's source object.</b> 
// This is so the user can create multiple tiles on other layers without problems.
//
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
 

try{ 

	var doc = activeDocument;
	var crops = doc.cropBox;
	var sel = doc.selection;
	var selLen = sel.length;
	var mySel = new Array();
	var cropW = crops[2] - crops[0];
	var cropH = crops[1]- crops[3];
	// This is the 'save to' directory. Change it to whatever works best for you.
	var dest="C:\\Temp";

	// cropbox is the width of the drawing area if not selected ~ 160000
	if(doc.cropBox[0] > 10000){
	 
			throw("Script aborted: --No Crop Object found.--\n\n This script is designed to create a tiled image by 'wrapping' objects around a cropped area.\n\n To use this script: create a crop area, and then draw objects within it, objects may overlap the crop area on the bottom and right sides only.\nWhen finished, select all items in the tile, and run the script.\nIt will copy all overlaping objects to the opposite side of the crop area, creating a perfect tile.\nRe-run the script with nothing selected to export as JPG or PNG.\nREMEMBER: Only overlap objects on the bottom and right side of the crop area.");
	 
	}
	// copy selection array to a local variable
	for (var x=0;x<selLen;x++)
	{
		mySel.push(sel[x]);
		sel[x].selected=false;
	}
	sel = mySel;
	// now go through and find elements that overlap on the right or bottom.
	// and copy them to the left and top.
	for (var j=0;j<selLen;j++ )
	{
		var newItem = null;
		var isTop=0;
		var isLeft=0;
		var i=sel[j];
		// using visible bounds for objects with dropshadow etc...
		var itlx = i.visibleBounds[0];
		var itly = i.visibleBounds[1];
		var ibrx = i.visibleBounds[2];
		var ibry = i.visibleBounds[3];
		var iw = ibrx-itlx;
		var ih = ibry-itly;
		if( itlx + iw >  crops[2]){
			newItem = i.duplicate(i.layer, ElementPlacement.PLACEATEND );
			newItem.layer = i.layer;
			newItem.left-=cropW;
			isLeft=1;
			newItem.selected=true;
		}
		if(ibry < crops[3]){
			if(newItem!=null){}else{
				 newItem = i.duplicate(i.layer, ElementPlacement.PLACEATEND );
				 newItem.layer = i.layer;
				 newItem.selected=true;
			}
			newItem.top+=cropH;
			isTop=1;
		}
		
		// if both, then copy to all 4 corners.
		if(isTop==isLeft && isLeft==1){
			 newItem = i.duplicate(i.layer, ElementPlacement.PLACEATEND );
			 newItem.layer = i.layer;
			 newItem.top+=cropH;
		  newItem.selected=true;
			 newItem = i.duplicate(i.layer, ElementPlacement.PLACEATEND );
			 newItem.layer = i.layer;
			 newItem.left-=cropW;
		  newItem.selected=true;
		}

	}
//---------------------
// If nothing is selected, 
// then it is assumed that you want to save the image
//----------------------
	// ---------------This is the saving part. 
	//--------Comment it out if you don't want to save.
	// Which OS are we on? 
	if (selLen == 0){
		var f_ext = "";
		while(f_ext!="jpg" && f_ext!="png"){
			dest = File.saveDialog("Export Image as *.jpg or *.png:", "JPG image:*.jpg,Transparent PNG image:*.png");
			  f_ext = dest.toString().split(".")[1].toLowerCase();
			if(f_ext!="jpg" && f_ext!="png"){
				alert("Please include the dot extension ('.jpg' or '.png')of the desired filetype.");
			}
		}
		if(dest!="" && dest!= null){
		
			if( f_ext == "jpg"){
				exportFileToJPEG (dest);
			} else
			if(f_ext == "png"){
				exportFileToPNG24 (dest);
			}
		} else{alert("Save cancelled");}
	}
		//------------------------------end saving part.

}
catch(e){
	alert(" If you're seeing this, the document probably has no Crop Box. \nDraw a square and use 'Object>Crop Box>Make' \nto create one.\n\n If that's not the problem see below:\n"+e);
 
}
//------------------------
//-------- Saving functions: Change line 98 to save as PNG instead...
//------------------------
function exportFileToPNG24 (dest) {
	if ( app.documents.length > 0 ) {
		var exportOptions = new ExportOptionsPNG24();
		var type = ExportType.PNG24;
		var fileSpec = new File(dest);
		exportOptions.antiAliasing = true;
		//exportOptions.transparency = false;
		//exportOptions.saveAsHTML = true;
		app.activeDocument.exportFile( fileSpec, type, exportOptions );
	}
}
function exportFileToJPEG (dest) {
	if ( app.documents.length > 0 ) {
		var exportOptions = new ExportOptionsJPEG();
		var type = ExportType.JPEG;
		var fileSpec = new File(dest);
		exportOptions.antiAliasing = true;
		exportOptions.qualitySetting = 70;
		// Set to false for CS and CS2
		exportOptions.matte = true;
		// ---- This code is commented out because white is the default color
		// ==== but if you want a custom matte, you can reinstate it.
		//var newRGBColor = new RGBColor();
		//newRGBColor.red = 255;
		//newRGBColor.green = 255;
		//newRGBColor.blue = 255;
		//exportOptions.matteColor=newRGBColor;
		app.activeDocument.exportFile( fileSpec, type, exportOptions );
	}
}