//global variables
var map; //map object
var hData; //array of objects

var markersLayer; //markers layer group object

var timestamp = 1; //initial timestamp
var scaleFactor = 300; //scale factor for marker area

var timer; //timer object for animation
var timerInterval = 1000; //initial animation speed in milliseconds


//begin script when window loads 
window.onload = initialize();

//the first function called once the html is loaded
function initialize(){
	//window.onload
	setMap();
};

//set basemap parameters
function setMap() {
	//initialize()
	
	//create the map and set its initial view
        map = new L.Map('map',{scrollWheelZoom:true,minZoom: 12,maxZoom: 20}).setView([-1.28141,36.83111], 13);
	
	//add the tile layer to the map
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
		{attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		
	//call the function to process the csv with the data
	processCSV();
};

function processCSV() {
	//setMap()

	//process the healthData csv file
	var processCSV = new ProcessCSV(); // to ProcessCSV.js
	var csv = './hotspots.csv'; // set location of csv file

	processCSV.addListener("complete", function(){
		hData = processCSV.getCSV(); // to ProcessCSV.js; returns array object
		createMarkers(); //->
                console.log(hData);
	});
	
	processCSV.process(csv); //-> to ProcessCSV.js
};

function createMarkers() {
	//processCSV()
	//radius of markers
	var radius = 5000;

	//marker style object
	var markerStyle = {
		radius: radius,
		fillColor: "#29F",
	};

	//create array to hold markers
	var markersArray = [];
		
	//create a circle marker for each feature object in the csvData array
	for (var i=0; i<hData.length; i++) {
		var feature = {};
		feature.properties = hData[i];
		var lat = Number(feature.properties.latitude);
		var lng = Number(feature.properties.longitude);
		var marker = L.circleMarker([lat,lng], markerStyle);
		marker.feature = feature;
		markersArray.push(marker);
	};
	
	//create a markers layer with all of the circle markers
	markersLayer = L.featureGroup(markersArray);
	
	//add the markers layer to the map
	markersLayer.addTo(map);
	
	//call the function to size each marker and add its popup
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);//->
	})
	
	animateMap();//->
}

function onEachFeature(layer) {
	//<-createMarkers()
	
	//calculate the area based on the data for that timestamp
	var area = layer.feature.properties[timestamp] * scaleFactor;
	
	//calculate the radius
	var radius = Math.sqrt(area/Math.PI);
	
	//set the symbol radius
	layer.setRadius(radius);
        
        //create and style the HTML in the information popup
	var popupHTML = "<b>" + layer.feature.properties[timestamp] + 
                        " Fire incidence case(s)</b><br>" + "<i> " + 
                        "</i> in <i>" + timestamp + "</i>";
                        
	//bind the popup to the feature
	layer.bindPopup(popupHTML, {
		offset: new L.Point(0,-radius)
	});
	
	//information popup on hover
	layer.on({
		mouseover: function(){
			layer.openPopup();
			this.setStyle({radius: radius, color: 'yellow'});
		},
		mouseout: function(){
			layer.closePopup();
			this.setStyle({color: 'blue'});
		}
	});
}

function animateMap() {
	//<-setMap();
	
	timer = setInterval(function(){
		step();//->
	},timerInterval);
}

function step(){
	//<-animateMap()
	
	//cycle through years
	if (timestamp < 12){ //update with last timestamp header
		timestamp++;
	} else {
		timestamp = 1; //update with first timestampe header
	};
	
	//upon changing the timestamp, call onEachFeature to update the display
	markersLayer.eachLayer(function(layer) {
		onEachFeature(layer);//->
	});
}


