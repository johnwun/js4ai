/////////////////////////////////////////////////////////////////
//  Set All The Things v.1.2 -- CS,CS2,CS3,CS4
//>=--------------------------------------
// Wanna Batch Transform objects?  Illustrator has built in tools to resize each selected item, 
// but only by percentage, not by hard values. I made this script because I could find no
// native way to set the width of all selected objects to 100px at once.
//
// This script can accept multiple parameters at once.
// To change, for instance, both width and height at the same time, 
// at the 'attributes' prompt, enter <b>width,height</b>
// then at the 'values' prompt, enter a comma separated value list like <b>20,30</b>
//  If a single value is passed for 'values', that value will be applied to all chosen properties. 
//
// Common legal parameter names include, but are not limited to: <b>width,height,top,left</b>.
// Install and use <a href='http://wundes.com/JS4AI/#explore.js'>explore.js</a> on an object to see what other properties can be set.
//  
// Update: Based on feedback from user Jode, You are now given the option to transform objects from center. 
// You can now also use whatever standard units you like and the script will convert them into pixels.
//  e.g., you can enter "30mm" or "12in" and the script will know what you mean.
//  v1.2 adds decimal support and explicit 'px' and 'pt' units to the regex. (thanks to Cristofer Cruz for noticing the bug)
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
var centerObjects= false;
function main(){
	var item,center_point;
	var toPixels=function(v){
	
	var units={
						'in':72,
						'mm':2.8346455078125,
                           'px':1,
                           'pt':1,
			},re = /(\d*[.]*\d+)(mm|in|ft|cm|px|pt)/i,m,u,rep;
		//derivitave
		units['cm'] = units['mm']*10;
		units['ft'] = units['in']*12;

		while(m=v.match(re)){
			u = m[2].toLowerCase();
			if (units[u]){
				rep = (m[1]*units[u]);
				v = v.replace(re,rep);
			}
		}
		return v;
	}

    var trace = function (m){alert(m)};
    if(activeDocument == null){trace("No open document found. Please open a document.");return;}
    if(activeDocument.selection.length == 0){trace("Nothing selected. Please select one or more items.");return;}
    var i = prompt("What attribute(s) do you want to set?","width,height");
    if( i===null ){return false;}
    var v = prompt("What value(s) do you want to assign?","100,50");
    if (v === null ){return false;}
	centerObjects=confirm("Transform Objects around center?");
	v=toPixels(v);
    // here's where we walk through all objects.
    var assign = function (i,v){
        for (var x=0 ; x < activeDocument.selection.length ; x++){
		 
				item = activeDocument.selection[x];
				//get top and left width and height values
				center_point = [item.top-(item.height/2),item.left+(item.width/2)];
		 
			item[i] = eval(v);
			//redraw();
			if(centerObjects){
				//center_point = [item.top+(item.height/2),item.left+(item.width/2)];
				item.top = center_point[0] + (item.height/2);
				item.left = center_point[1] - (item.width/2);
			}
        };
    }
    if(  i.indexOf(',') !== -1){  i =  i.split(',');}
    //split if a list, but not if function is found.
    if( v.indexOf(',') !== -1){ v = v.split(',');}
    
    if(typeof i !== "string")
    {
        for ( var len=i.length,c=0;c<len;c++)
        {
            assign(i[c],typeof v !== 'string' ? v[c] : v);
        }
    } else
    {
        assign(i,v);
    }
	redraw();
	return true;
	
}
main();
 