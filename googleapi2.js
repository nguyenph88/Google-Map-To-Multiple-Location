var map;
var markers;
var infowindow;
var directionsService = new google.maps.DirectionsService();
var renderOptions = { draggable: true };
var directionDisplay = new google.maps.DirectionsRenderer(renderOptions);
var locations = [];

// initialze the maps/markers/locations
function initialize() {
    infowindow = new google.maps.InfoWindow();
	var myOptions = {
		zoom: 10,
		mapTypeControl: true,
		navigationControl: true,
	  }
    map = new google.maps.Map(document.getElementById("map"), myOptions);
	
	add_location('<strong>Clicktime</strong><br>I want to work here<br>', 37.7856372, -122.3970422);
	set_current_location();
	set_markers(new google.maps.LatLngBounds(), map);
	find_direction();
}

// add new location to the locations array
function add_location(description, lastitude, longtitude){
	locations.push([description, lastitude, longtitude]);
}
	
// Set all the markers in the location arrays and bound/frame the map
function set_markers(bounds, map){
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });
        bounds.extend(marker.position);
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
	 map.fitBounds(bounds);   
}

// Get current location based on the IP Address
function set_current_location(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
	  var myLat = position.coords.latitude;
	  var myLong = position.coords.longitude;
	  add_location('My location', position.coords.latitude, position.coords.longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
  //add_location('My location', position.coords.latitude, position.coords.longitude);
}

// Let's find an optimal route
function find_direction(){
	//set the directions display service to the map
	directionDisplay.setMap(map);
	//set the directions display panel
	//panel is usually just and empty div.  
	//This is where the turn by turn directions appear.
	directionDisplay.setPanel(directionsPanel); 
	
	//build the waypoints
	//free api allows a max of 9 total stops including the start and end address
	//premier allows a total of 25 stops. 
	var items = ["Los Angeles, CA", "phoenix, AZ", "Greer, SC"];
	var waypoints = [];
	for (var i = 0; i < items.length; i++) {
		var address = items[i];
		if (address !== "") {
			waypoints.push({
				location: address,
				stopover: true
			});
		}
	}
	
	//set the starting address and destination address
	var originAddress = "chicago, IL";
	var destinationAddress = "San Francisco, CA";
	
	//build directions request
	var request = {
				origin: originAddress,
				destination: destinationAddress,
				waypoints: waypoints, //an array of waypoints
				optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
	
	//get the route from the directions service
	directionsService.route(request, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionDisplay.setDirections(response);
		}
		else {
			//handle error
		}
	});
}
google.maps.event.addDomListener(window, 'load', initialize);// JavaScript Document