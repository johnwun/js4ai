/////////////////////////////////////////////////////////////////
//Group Overlapping (Beta) -- CS, CS2, CS3
//>=--------------------------------------
//
//	Groups all overlapping objects in selection into discreet groups.
//  The definition for 'overlaping' is based on objects bounding boxes, not their actual geometry.
//	Each new groups zOrder is determined by the depth of the front-most object in each group.
//  There is no limit to the number of groups created.
//  Any non-overlapping objects are ignored.
//
// Note: Currently, this is not very efficient code. It works well on small groups (less than 120 objects)
// and works faster on smaller groupings. Running this on a huge number of objects will likely crash illustrator.
// It serves my purposes, but test it's limits on your machine, and use at your own risk. 
// On a 2.53GHz P4, a group of 100 objects took 20 seconds with 2 groups.
//  
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

//this little section is just for testing
//the number of times each function is called.
var testmode = 0;
var t1=t2=t3=t4=t5=t6=t7=0;
var testmsg="";
//
//
//
var go=true;
if(selection.length>120){
go = confirm("You have selected "+selection.length+" objects. It is highly recommended that you select less than 120 objects at a time. Do you want to continue anyway?");

}
if(selection.length>1 && go == true){
	var groups=0;
	var slen = selection.length;
	var hitList= new Array(slen);
	var groupArr = new Array(slen);
	// for each element in selection
	for (var sx=0;sx<slen;sx++){ 
	//t6++; //---------------------------------------------loop tracker
		var tArr = new Array(0);
			// for each element in selection (again)
		for (var si=0;si<slen;si++){
		  	//t7++; //-------------------------------------loop tracker
			groupArr[sx] = tArr;
			//note each object hits itself once.
			if(hitTest(selection[sx],selection[si])){
					groupArr[sx].push(selection[si]);
			}
		}
	} 

minimize(groupArr);
var zError = 0;
var gaLen = groupArr.length;
for(var each=0;each<gaLen;each++){
	if(groupArr[each].length>1){
		groupArr[each].sort(sortBy_zOrder);
	}
if(zError==1){
	alert("cannot read some objects zOrderPosition");
}
//alert("halftime");
for(var each =0;each<gaLen;each++){	
	t1++; //----------------------------------------------loop tracker
	if(groupArr[each].length>1){
		groups++;
	groupAll(groupArr[each]);
	}
}
//
//---all done with main code, now display statistics if you care...
//

testmsg="\nObjects processed: "+t1+"\nObjects grouped: "+t2+"\nObjects ignored: "+(t1-t2);

if(testmode==1){
testmsg+="\n\n---testmode data---\nhits compared: "+t5+"\nfunction 'minimize' called: "+t3+
"\nitems tested within 'minimize': "+t4;
"\nelements: "+t6+
"\nelements*elements: "+t7;
}

var x=0;

while(x<selection.length){

	if(selection[x].name == "wundes_GO_group"){
		 selection[x].name = "";
	}else{
		selection[x].selected = false;
		  x--;
	}
	x++;
}
redraw();
alert(groups+" groups created.\n----------------"+testmsg);
}
 
 
}
//----------------------------------------------------------->
//--------------------------------functions------------------<
//----------------------------------------------------------->
function sortBy_zOrder(a, b) {
		if(a.zOrderPosition==undefined){
			alert(a.zOrderPosition);
			zError = 1;
			 return 0;
		}
		var x = Number(a.zOrderPosition);
		var y = Number(b.zOrderPosition);


return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function groupAll(arr){
	var tempGroup = arr[0].parent.groupItems.add();
	
	tempGroup.move(arr[0],ElementPlacement.PLACEBEFORE);
	var max = arr.length;
	for(var i=max-1;i>=0;i--){
		t2++; //-----------------------------------------loop tracker
		arr[i].move(tempGroup,ElementPlacement.INSIDE);
	}
		//name the object for selection at end... (will be removed later)
		tempGroup.name = "wundes_GO_group";
		tempGroup.selected = true;
		 
}
//---------------hitTest functions ---------------
function hitTest(a,b){
	var OK=0;
	if(isWithinX(a,b) || isWithinX(b,a)){
		OK++;	
	}
	if(isWithinY(a,b) || isWithinY(b,a)){
		OK++;
	}
	if (OK<2){
		//alert("miss.");
		return false;
	}else{
		//alert("Hit!")
			return true;
	}
}
function isWithinX(a,b){
	var p1 = a.geometricBounds[0];
	var p2 = b.geometricBounds[0];
	if(p2<=p1 && p1<=p2+b.width){
		 return true;
	}else{
		return false;
	} 
}
function isWithinY(a,b){
	var p3 = a.geometricBounds[1];
	var p4 = b.geometricBounds[1];
	if(p3>=p4 && p4>=(p3-a.height)){
		return true;
	} 
		return false;
}

/*
//-----------------------------------OK, finding groups is done, now do the grouping---------------
*/

function itemize(a){
 var out="";
 return(a.join("\n"));
}
function minimize(arr){
for(var e in arr){
	t3++; //-----------------------------------------loop tracker
	for (ot in arr){
		t4++; //-------------------------------------loop tracker
		if(arr[e]!=arr[ot]){
		//if it's not THIS element,
		//test for overlaps
		if(overlaps(arr[e],arr[ot])){
			merge(arr[e],arr[ot]);
			arr[e] = new Array(0);
			minimize(arr);
			break;
		}
		}
	}
}

}
function merge(a,b){
	var alen = a.length;
	for (var all=0;all<alen;all++){
		if(contains(b,a[all])){
			//do nothing
		}else{
		
		 b.push(a[all]);
		  
		}
	}

}
function contains(ar,i){
	for (var all in ar){
		if (ar[all] == i){
			return true;
		}
	}
return false;
}


function overlaps(ar1,ar2){
	for (var each in ar1){
		t5++; //------------------------------------loop tracker
		if(contains(ar2,ar1[each])){//
			return true;
		}
	}
return false;
}