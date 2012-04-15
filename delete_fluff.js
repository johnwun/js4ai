/////////////////////////////////////////////////////////////////
//Delete Unused Assets (fluff) v.2 -- CS, CS2
//>=--------------------------------------
//Code is loosely based on a VB script from
//		<a href="http://www.amazon.com/exec/obidos/tg/detail/-/0321112512/qid=1112121623/sr=8-1/ref=sr_8_xs_ap_i1_xgl14/002-3373531-7064044?v=glance&s=books&n=507846">Adobe Illustrator Scripting</a> by Ethan Wilde
//		-------------------------------------------------------
//		This script does the following:
//		1) removes unused swatches.
//		2) removes unused symbols.
//		3) removes ALL styles: 
//				There is no way to check if a style is applied,
//				but this is not critical to me because the styled object
//				will not loose it's appearance, and the style can be re-added
//				if necessary by just dragging a 'styled' object back to the styles pallate.
//
//		This script does <b>NOT</b> do the following:
//		1) remove brushes:
//				The Javascript support just isn't there.
//
//  <b>As of version 2:</b>
//  You can set two variables at the top of the script to
//  delete the "NoColor" and/or the "Registration" swatches.
//  They are ignored by default.
//	
//  <b>THIS SCRIPT HAS BEEN RENDERED 99% OBSOLETE 
//  BY THE "DELETE FLUFF" ACTION </b>
//  which can be found in the "default.aia" file (included with illustrator), 
//  or you can downloaded the action separately <a href='http://www.wundes.com/js4ai/deleteFluff.zip'>HERE</a>
 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var docRef= app.activeDocument;
if ( app.documents.length > 0 )
{	
	//RE: tweaking this script:
	//
	//-----Set 'keepRegistration' to 'false' to remove registration swatch.---
    var keepRegistration = true;
	//-----Set 'keepNoColor' to 'false' to remove NoColor swatch.---
	var keepNoColor = true;
	//-----Set 'brag' to '0' to disable the "Removed:" statistics info.---
	var brag = 1;
	var skipSwatches = 0;
	var swtsRem = 0;
	var smbsRem = 0;
	var stysRem = 0;


	// Now call the "remove" functions (just comment out the ones you don't want to use...)
	deleteUnusedSwatches();
	deleteUnusedSymbols();
	deleteStyles();
	//deleteBrushes();
	//
	//____deleteBrushes() doesn't work.
	//____ You can see them, but you cant remove them..._____

	
	// now assemble the stats regarding what was removed.
	if(brag == 1){
	var msg = "";
	var msg1 = "";
	var msg2 = "";
	var msg3 = "";
	if(swtsRem>0){msg1 = swtsRem+" unused swatches.\n"}
	if(smbsRem>0){msg2 = smbsRem+" unused Symbols.\n"}
	if(stysRem>0){msg3 = "All "+stysRem+" Styles.\n"}
	if(swtsRem>0 || smbsRem>0 || stysRem>0){msg = msg1+msg2+msg3;
	} else {msg = "Nothing.\n(Nothing to Remove.)";}

	alert("Removed:\n"+msg);
	}
}
// ============================
// ====functions start here====
// ============================
 
function deleteUnusedSwatches(){
	killed = "";
	saved = "";
	var usedSwatches = findUsedSwatches();
	//alert("UsedSwatchesLength = "+usedSwatches.length);
	var x = lastIndex = app.activeDocument.swatches.length;
	total = x;
	var isSpotReg = 0;
	/*
			 
				*/
	try
	{
		while(x > skipSwatches){
		var lastIndex = app.activeDocument.swatches.length - 1;
			var swatchToDelete = app.activeDocument.swatches[x-1];
			//initialize vars to 0
			save = ulen = noSwt = regSwt = 0;
			try
			{
				isSpotReg =	swatchToDelete.color.spot.colorType == ColorModel.REGISTRATION;
			}
			catch (e)
			{
				// do nothing, we don't care if it fails, only if it succeeds.
			}
			for (var u in usedSwatches)
			{
				ulen ++;
				if (compareColors(usedSwatches[u],swatchToDelete.color) )
				{
					saved+= swatchToDelete+"\n";
					save = 1;
					x--
				}
			}
			if (isSpotReg && keepRegistration)
			{   // For Registration swatch..
				saved+= swatchToDelete+"\n";
				save = 1;
				x--;
				//resetting variable to 0 because every subsequent "try" will fail
				isSpotReg = 0;
				regSwt=1;

			} else if (swatchToDelete.color.typename == "NoColor" && keepNoColor)
			
			{// for "NoColor" swatch
				saved+= swatchToDelete+"\n";
				save = 1;
				x--;
				noSwt=1;
				 
			} 
			if (save == 0)
			{
				killed += swatchToDelete+"\n";
				swatchToDelete.remove();
				x--; 
				
			}
		}
		// for tracking...
		swtsRem =total-(ulen+noSwt+regSwt);
	}
	catch (e)
	{
		alert( e+"\nThe specified swatch doesn't exist. x = " +x);
	} 
 //}
 }


function deleteStyles(){ 
	try
	{
		stylesLen = app.activeDocument.graphicStyles.length;
		if( stylesLen > 1){
			// there is always the one default style...
			stysRem = stylesLen;
			app.activeDocument.graphicStyles.removeAll();
		}	
		 
	}
	catch (e)
	{
		alert( "Cannot Delete Styles." + e);
	} 
}

function deleteUnusedSymbols(){ 
	try
	{
		usedSymbols = testSymbols();
		var x = lastIndex = app.activeDocument.symbols.length;
		while(x >= 1){
				//  here I use x to iterate backwards through the symbols table
				//  instead of reloading the length each time.
			var symbolToDelete = app.activeDocument.symbols[x-1];
			if(!contains(usedSymbols,symbolToDelete)){
			symbolToDelete.remove();
			smbsRem++;
			}
			x--;
		}	
	}
	catch (e)
	{
		alert( "The specified Symbol doesn't exist" +e);
	} 
}

function contains(array,item){
	for (var each in array)
	{
		if (item == array[each])
		{
		return(true);
		}
	}
	return false;
}
function findUsedSwatches(){
	allitems = activeDocument.pageItems.length;

	var found = [];
	while (allitems > 0)
		{
		
		if(activeDocument.pageItems[allitems-1].stroked == true){
			stk = activeDocument.pageItems[allitems-1].strokeColor;
			if (!inList(stk,found))
			{
				found.push(stk);
			}

		}
		if(activeDocument.pageItems[allitems-1].filled == true){
			fil = activeDocument.pageItems[allitems-1].fillColor;
			if (!inList(fil,found))
			{
				found.push(fil);
			}
		} else if(activeDocument.pageItems[allitems-1].typename == "TextFrame"){
			 
			fil = activeDocument.pageItems[allitems-1].textRange.fillColor;
			if (!inList(fil,found))
			{
				found.push(fil);
			}
		}
		//
			
			allitems--;
		}
		

	 return(found);
}
function inList(a,b){
	if (b.length == 0)
	{
		return false;
	}
	
	for (var all in b)
	{
		if(compareColors(a,b[all])){
			return true;
		}
	}
	return false;
}
function compareColors(a,b){
	//	No need to check for "none" because the calling function only passes hits.

	if (a.pattern == b.pattern && a.pattern != undefined)
	{
		//Compare patterns
		return true;
	} 
	else if (a.gradient == b.gradient && a.gradient != undefined)
		{
			//Compare gradients
			return true;
		} 
	else 
	{
		//innocent until proven guilty..
		answer = true;
		//Compare contents...
		for (var each in a)
		{
			if (a[each] != b[each] && each!= "tint")
			{
				//if anything doesn't match:
				answer = false;
			}	
		}

		return answer; 
	
		 
	}
}
function testSymbols(){
	all = activeDocument.pageItems.length;
	safe = 0;
	var found = [];
	while (all > 0)
		{
			var current = activeDocument.pageItems[all-1].symbol
			if(current != undefined){
				found.push(current);
			} 
		all--;
		}
	 return (found);
}
//The following function doesn't work.
//there is no JS support for removing brushes in Illustrator CS... Maybe in CS2... (sigh)

function deleteBrushes(){ 
if(Number(app.version.substr(0,2)) >= 12){
	try
	{
		var x = lastIndex = app.activeDocument.brushes.length;
		while(x >= 1){
		var lastIndex = app.activeDocument.brushes.length - 1;
			var brushToDelete = app.activeDocument.brushes[lastIndex];
			brushToDelete.remove();
			x--;
		}				 
	}
	catch (e)
	{
		alert( "Whoops...\n" + e);
	} }
}