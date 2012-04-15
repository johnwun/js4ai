/////////////////////////////////////////////////////////////////
//Save file with timestamp v.3 -- CS, CS2
//>=--------------------------------------
//renames the current open file. 
//Saves file, closes and re-opens the file with new name. 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 


//anything after the separator in the filename is written over.
// the separator variable
var sep = "_last_";
// Be sure to NEVER use the separator elsewhere in the filename, or it will be truncated.

// comment out the next line if you want to display Months as numbers.
nameMonths = true;

if ( app.documents.length > 0 )
{
	//this is the date format, you can move stuff around, 
	// but be careful to not split the variables.
	var Dateformat = "mm-dd-yyyy_hr.Mn.scXX";
	var Bob = activeDocument.fullName
	var today = TodayDate();
	fname = activeDocument.name;
	var nameAndExt = checkAndSnagExt(fname);
	var newName = nameAndExt[0] ;
	
	if(fname.indexOf(sep)!= -1){
		//previous timestamp found so truncate filename
		newName = fname.substring(0,fname.indexOf(sep));
	} 
	if(activeDocument.saved != true && activeDocument.path != -1 ){
		//if the file is not saved and is not a new file
		activeDocument.save();
	}
	if(Bob.rename (newName+sep+today+nameAndExt[1])!= true){
		//if saved document is renamable, then rename it, otherwise, complain.
		//rename returns false if it's a new file.
		alert("You must first SAVE THE FILE to a destination before a rename can be performed.")
	}else{ 
		activeDocument.close();
		open(Bob);
		
	}
	Bob = null;
}
// ------------------------functions-----------------------------
function checkAndSnagExt(data){
//takes a file name and checks if it ends in common file types
//returns an array where array[0] is the name and array[1] is the extension
	matchList = [".pdf",".ai",".eps"];
	retArr = ["",""];
	var lioDot = data.lastIndexOf(".");
	if(lioDot != -1){
		//if indeed there IS a dot...
		var theName = (data.substring(0,data.lastIndexOf(".")));
		retArr[0] = theName;
		var ext = (data.substring(data.lastIndexOf("."),data.length));
		for (all in matchList){
			if(matchList[all] == ext){
				retArr[1] = ext;
			}
		}
	}else{
	retArr[0] = data;
	}

	return retArr;
}

function TodayDate(){
	  var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	  var Today = new Date();
	  var Day = Today.getDate();
	  if(nameMonths == true){
		  var Month = monthNames[Today.getMonth()];
	  } else {
	  var Month = Today.getMonth() + 1;}
	
	  var Year = Today.getYear();
	  var PreMon = "";//((Month < 10) ? "0" : "");
	  var PreDay = ((Day < 10) ? "0" : "");
	  var Hour = Today.getHours();
	  var Min = Today.getMinutes();
	  var Sec = Today.getSeconds();
	  if(Year < 999) Year += 1900;
	  var theDate = Dateformat.replace(/dd/,PreDay+Day);
	  theDate = theDate.replace(/mm/,PreMon+Month);
	  theDate = theDate.replace(/d/,Day);
	  theDate = theDate.replace(/m/,Month);
	  theDate = theDate.replace(/yyyy/,Year);
	  theDate = theDate.replace(/yy/,Year.toString().substr(2,2));
	  if(Hour==0){
		Hour = "12";
		theDate = theDate.replace(/XX/,"AM");
	  }else if(Hour>12){
		  Hour = (Hour-12);
		  theDate = theDate.replace(/XX/,"PM");
	  }else{
		  theDate = theDate.replace(/XX/,"AM");
	  }
	  var preSec = ((Sec < 10) ? "0" : "");
	  var preHour = ((Hour < 10) ? "0" : "");
	  var preMin = ((Min < 10) ? "0" : "");
	  theDate = theDate.replace(/hr/,preHour+Hour);
	  theDate = theDate.replace(/Mn/,preMin+Min);
	  theDate = theDate.replace(/sc/,preSec+Sec);
	  return theDate;
}
//*/