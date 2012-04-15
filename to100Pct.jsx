/////////////////////////////////////////////////////////////////
// to100pct v.1.0 -- CS,CS2,CS3,CS4,CS5
//>=--------------------------------------
// Addresses an issue when images are pasted from the clipboard at 70%
// This script resets the matrix values for pasted RasterItems so they display at 100%.
// Multiple raster items can be transformed at the same time, group items will be introspected, only raster items are affected.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//////////////////////////////////////////////////////////////////

if(activeDocument && activeDocument.selection.length>0){
	testObjects(activeDocument.selection);
}
function testObjects(a)
{
	var selLen = a.length;
		for (var c=0;c<selLen;c++)
	{
		if(a[c].typename == 'GroupItem'){
			testObjects(a[c].pageItems);
		} else if(a[c].typename=='RasterItem')
		{
			fullsize(a[c]);
		}
	}
}
function fullsize(i)
{
       // maintain sign
	  i.matrix.mValueA = i.matrix.mValueA >0 ? 1 : -1;
	  i.matrix.mValueD =  i.matrix.mValueD>0 ? 1 : -1;
}
