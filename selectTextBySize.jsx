/////////////////////////////////////////////////////////////////
//Select Text by size v.1 -- CS,CS5
//>=--------------------------------------
//  Script prompts user for a text size (in pixels), 
//  and selects all text items in document at chosen pixel size.
//  Note: script also unlocks and unhides all instances of chosen text size.
// change variables at top of script if your use case requires ignoring certain cases.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var doc = activeDocument;
var inputSize = prompt("what size text do you want to select?","12"); 

//Edit these variables to change default behavior...
var unlockText = true;
var unhideText = true;
var unlockLayers = true;
var unhideLayers = true;

for(var e = 0,max=doc.textFrames.length;e<max;e++){
    var frame =  doc.textFrames[e];
       frame.selected = false;

    //unlock if locked:
    if(frame.locked && unlockText){
        frame.locked=false;
    }
    //make visible if hidden
    if(frame.hidden && unhideText){
        frame.hidden=false;
    }
    //unlock layer if layer is locked
    if(frame.layer.locked && unlockLayers){
        frame.layer.locked=false;
    }
    //make layer visible if hidden
    if(!frame.layer.visible && unhideLayers){
        frame.layer.visible=true;
    }
      
    if(frame.textRange.size==inputSize && (!frame.locked) &&  (!frame.hidden) && (!frame.layer.locked) && (frame.layer.visible) ){
           frame.selected = true;
    }
};
