/////////////////////////////////////////////////////////////////
//Pixel Align v.1.1 -- CS, CS5
//>=--------------------------------------
// A super simple script that snaps selected objects to their nearest pixel values.
// Used for aligning artwork for exporting as raster art.
// Note: Can have issues with stroked objects.
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var doc = activeDocument;
var sel = doc.selection;

var selLen = sel.length;

while(selLen--)
{
    fidget(sel[selLen]);    
}

function fidget(item)
{
    item.height = pixAlign(item.height);
    item.width = pixAlign(item.width);
    
    item.top = pixAlign(item.top);
    item.left = pixAlign(item.left);
 }

function pixAlign(n)
{
    return Math.round(n)
 }
    