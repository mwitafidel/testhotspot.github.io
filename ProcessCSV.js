

ProcessCSV.prototype = new EventTarget();
ProcessCSV.prototype.constructor = ProcessCSV();

function ProcessCSV() {

	var csvArray = [];
	var months = [];
	EventTarget.call(this);	


	this.process = function(csv) {
		//Load the CSV data
		var that = this;
		var req = new XMLHttpRequest();
		//feature check! (workaround for old versions of IE)
		if (window.XMLHttpRequest){
			req = new XMLHttpRequest();
		} else if (window.ActiveXObject){
			req = new ActiveXObject("Microsoft.XMLHTTP");
		}
		var arr = [];
		req.onreadystatechange = function(){
			if (req.readyState === 4){
				var text = req.responseText;
				arr.push(parseCSV(text)); //->
				that.fire("complete");
			}	
		}
		
		this.getCSV = function() {
			return csvArray;
		}
		this.getYears = function() {
			return months;
		}
		
		req.open('GET', csv, true);
		req.send(null);
	}

	parseCSV = function(text) {
		
		var lines = CSVToArray(text)
		
		var fields = lines[0];
		
		var values;	
		var arr = [];
		for (var i = 1; i < lines.length-1; i++) {
			var obj = {};	
			
			values = lines[i];
			
			//create an object attribute for each csv column
			for (var a = 0; a < fields.length; a++) {
				var field = fields[a];
				obj[field] = values[a];
			};
			
			csvArray.push(obj);
		};
	};
	
	function CSVToArray( strData, strDelimiter ){
		
		strDelimiter = (strDelimiter || ",");
		 
		var objPattern = new RegExp(
		(
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
		 
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		 
		// Standard fields.
		"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);
		 
		 
		var arrData = [[]];
		 
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		 
		 
		while (arrMatches = objPattern.exec( strData )){
		 
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];
		 

			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
		 

				arrData.push( [] );
		 
			}
		 

			if (arrMatches[ 2 ]){
	
				var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),"\"");
		 
			} else {
		 
			var strMatchedValue = arrMatches[ 3 ];
		 
			}

			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
		 
	return( arrData );
	}
 	
}