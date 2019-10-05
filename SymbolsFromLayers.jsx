
var doc = app.activeDocument;  
  
var lays = doc.layers;  
  
for ( var i = 0; i &lt; lays.length; i++ ) {  
  
          var grp = lays[i].groupItems.add();  
  
          var items = lays[i].pageItems;  
  
          for ( var j = items.length-1; j > 0; j-- ) {  
  
                   // items[j].move( grp, ElementPlacement.PLACEATBEGINNING );  
                 items[j].moveToBeginning( grp );  
          };  
  
          doc.symbols.add( grp );  
  
};  