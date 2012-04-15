/////////////////////////////////////////////////////////////////
//organize v1.4 -- CS,CS2,CS3,CS4,CS5
//>=--------------------------------------
// A quick way to sort selected items by a given attribute.
// For example, use this script to arrange items from left to right based on their height.
// Another example is to change a group of items z-order position based on volumetric area.
// More complexly, you can re-assign height based on x position.
// Items can be sorted on (h)eight, (w)idth, (a)rea, (x)-axis, (y)-axis, (o)pacity, (z)-order)
// Sort directions are small-to-large, large-to-small, and random. 
// Use most effectively in combination with the align palette to redistribute objects in new
// powerful ways. 
//
// v1.1: changed wording for clarity, 
//  added option to keep existing values, vs. align evenly.
//  and fixed prompt values displaying correctly. (thanks Egor) 
// v1.2: Fixed inconsistant spacing issue with autoAlign option
// v 1.3: added a shortcut option in the first prompt.
// v 1.4: Much better error handling.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 
var warn,notValid,attrPrompt,orderPrompt,sortPrompt,dist,alert_fail, createItemSort, getInterval, go, isBad, numericSort, randomSort, rearrange, revNumericSort,getFirstPrompt,prompt_attr, prompt_order1, prompt_order2, prompt_sort,prompt_dist, attrParams, validDistVals,sortParams ;

  prompt_attr = "Sorting BY: What attribute would you like to use for input?\n(h)eight, (w)idth, (a)rea, (x)-axis, (y)-axis, (o)pacity, (z)-order)\n Alternately, you can enter a 4 letter sequence here, like \"hxsy\"";
  prompt_order1 = "Sort ALONG: Align your '";
  prompt_order2 = "' sorted items by: \n(h)eight, (w)idth, (a)rea, (x)-axis, (y)-axis, (o)pacity, (z)-order)";
  prompt_sort = "Sort DIRECTION: (L)arge to small, (S)mall to large, or (R)andom?";
  prompt_dist = "Distribute objects evenly (y), or just shuffle existing values (n)?";
    attrParams = {
    'h': "height",
    'w': "width",
    'a': "area",
    'x': "left",'l':"left",
    'y': "top",'t':"top",
    'o': "opacity",
    'z': "zOrderPosition"
  };
    numericSort = function(a, b) {
      return a - b;
    };
    revNumericSort = function(a, b) {
      return b - a;
    };
    randomSort = function(a, b) {
      return Math.random() - .5;
    };
  sortParams = {
    's': numericSort,
    "ns":numericSort,
    'l': revNumericSort,
    "ls":revNumericSort,
    'r': randomSort,
    "rs":randomSort
  };
  validDistVals = { y:true,n:false,t:true,f:false,'0':false,'1':true};

isBad = function(val) {
  return val === "" || !(val != null);
};
//rearrange(selArr, createItemSort(attrParam), sortOrder, sortParam,dist);
rearrange = function(_arr, _byFilter, _sortDirection, _alongParameter, _interpolate) {
  var fin, max, selArrLen, start, tempAtts, _results, _results2;
  _arr.sort(_byFilter);
  selArrLen = _arr.length;
  tempAtts = [];
  while (selArrLen--) {
    tempAtts.push(_arr[selArrLen][_alongParameter]);
  }
  tempAtts.sort(_sortDirection);
  selArrLen = _arr.length;
  if (_alongParameter === "zOrderPosition") {
    _results = [];
    while (selArrLen--) {
      _results.push((function() {
        var _results2;
        _results2 = [];
        while (_arr[selArrLen][_alongParameter] !== tempAtts[selArrLen]) {
          _results2.push(_arr[selArrLen][_alongParameter] > tempAtts[selArrLen] ? _arr[selArrLen].zOrder(ZOrderMethod.SENDBACKWARD) : _arr[selArrLen].zOrder(ZOrderMethod.BRINGFORWARD));
        }
        return _results2;
      })());
    }
    return _results;
  } else {
    if(_alongParameter === 'top'){tempAtts.reverse();}
    start = tempAtts[0];  // arr[0][_alongParameter];//
    fin = tempAtts[selArrLen - 1];  // arr[selArrLen-1][_alongParameter];//
    max = selArrLen;
 
    while (selArrLen--) {
        _arr[selArrLen][_alongParameter] = ((_sortDirection === randomSort  || !_interpolate )? tempAtts[selArrLen] : getInterval(start, fin, max-1, selArrLen));
    }
 
  }
};
createItemSort = function(attrStr) {
  var attr = attrStr;
  return function(a, b) {
    return Number(a[attr]) - Number(b[attr]);
  };
};

notValid = function(arr,val){
    return arr[val.toLowerCase()] === undefined;
}
warn = function (val,dim){
    alert('"'+val+'" is not a valid value for '+dim+'.');
}
getFirstPrompt = function (){ 
    attrPrompt = prompt(prompt_attr, "h");  
    if (isBad(attrPrompt)) {
      return false;
    }
    if(attrPrompt.length==4){ //is shortcut
            
                var pArr = attrPrompt.split(''); 
                // test all are valid:
                if(notValid(attrParams,pArr[0])){ warn(pArr[0],'BY');  return -1;}           
                if(notValid(attrParams,pArr[1])){ warn(pArr[1],'ALONG'); return -1;}  
                if(notValid(sortParams,pArr[2])){ warn(pArr[2],'DIRECTION');return -1;}  
                if(notValid(validDistVals,pArr[3])){ warn(pArr[3],'DISTRIBUTION.'); return -1;}  
                attrPrompt=pArr[0];
                orderPrompt=pArr[1];
                sortPrompt=pArr[2];
                dist=(pArr[3]=='y' || pArr[3]=='t')?true:false;
        } 

  if(attrParams[attrPrompt.toLowerCase()] === undefined){ alert('"'+attrPrompt+'" is not a valid value for (1) BY.');  return -1;}   

 return attrParams[attrPrompt.toLowerCase()];
    
}
getInterval = function(start, fin, len, curr) {
  var f, s;
  s = start;
  f = fin;
  if (start < 0) {
    s = 0;
    f = f - start;
  }
  return start + (((f - s) / len) * curr);
};
alert_fail = "Please open a file in Illustrator, and select some stuff to sort.";
go = function() {
  var attrParam, doc, sel, selArr, selLen, sortOrder, sortParam;
  doc = activeDocument;
  sel = doc.selection;
  selArr = [];
  sortPrompt = void 0;
  orderPrompt = void 0;
  attrPrompt = void 0;
  attrParam = void 0;
  sortParam = void 0;
  sortOrder = void 0;
  dist = void 0;
  /*---------------- get user input ----------------*/
 var invalid = true;
while(invalid)
{
    var fp = getFirstPrompt();
    
     if(fp==false){return false;}
     if(fp !== -1){invalid = false;
          attrParam = fp;
     }
}

  invalid = true;
  if(orderPrompt === undefined){
      while (invalid) {
        orderPrompt = prompt(prompt_order1 + attrParam + prompt_order2, "x");
        if (isBad(orderPrompt)) {
          return false;
        }
        if(notValid(attrParams,orderPrompt)){ warn(orderPrompt,'ALONG'); } else{ invalid = false; }
      }   
}
  sortParam = attrParams[orderPrompt.toLowerCase()];
    
  invalid = true;
  if(sortPrompt === undefined){
  while (invalid) {
    sortPrompt = prompt(prompt_sort, "s");
    if (isBad(sortPrompt)) {
      return false;
    }
    if(notValid(sortParams,sortPrompt)){ warn(sortPrompt,'DIRECTION'); } else{ invalid = false; }
  } 
}
sortOrder = sortParams[sortPrompt.toLowerCase()];
if(dist === undefined){
  dist = confirm(prompt_dist);
}

  selLen = sel.length;
  while (selLen--) {
    selArr.push(sel[selLen]);
  }
  rearrange(selArr, createItemSort(attrParam), sortOrder, sortParam,dist);
  return true;
};

if (app.activeDocument) {
    if (activeDocument.selection.length==0){alert(alert_fail)}else{go();}
 
} else {
  alert(alert_fail);
}