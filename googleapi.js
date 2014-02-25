var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var current_location;
var clicktime_location = "282 2nd St, San Francisco, CA 94105";
var locations = [];


// Initialize the map
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(37.7856372, -122.3970422)
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var control = document.getElementById('control');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  
  // from here is auto complete
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
	
	// push the chosen address to the locations array
	locations.push(address);

  });
	update_content("testing123");
    // chek the current location
	set_current_location();
}

// add new location to the locations array
function add_location(location){
	locations.push(location);
}

// update current text in direction panel
function update_content(content){
	fieldNameElement = document.getElementById('directions-panel');
	fieldNameElement.innerHTML =content;
}

// set current location and initialize first route
function set_current_location(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      current_location = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
	  calcRoute();
    });
  } else {
    alert("Geolocation is not supported by this browser.");
    calcRoute();
  }
}

//build the waypoints
//free api allows a max of 9 total stops including the start and end address
//premier allows a total of 25 stops. 
function build_waypoints(){
	for (var i = 0; i < locations.length; i++) {
		var address = locations[i];
		if (address !== "") {
			waypnts.push({
				location: address,
				stopover: true
			});
		}
	}
}

// Routing 


function calcRoute() {
	var waypoints = [];
	for (var i = 0; i < locations.length; i++) {
		var address = locations[i];
		if (address !== "") {
			waypoints.push({
				location: address,
				stopover: true
			});
		}
	}
	update_content(waypoints);
	
	//set the starting address and destination address
	var originAddress = current_location;
	var destinationAddress = clicktime_location;
	var selectedMode = document.getElementById('mode').value;
	
	//build directions request
	var request = {
				origin: originAddress,
				destination: destinationAddress,
				waypoints: waypoints, //an array of waypoints
				optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
				travelMode: google.maps.TravelMode.TRANSIT
			};
	
	//get the route from the directions service
	directionsService.route(request, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
		else {
			alert('Cannot make it');
		}
	});
} 

function calcRoute2() {
  start = current_location;
  var end = clicktime_location;
  var selectedMode = document.getElementById('mode').value;
  
  var waypnts = [];
	for (var i = 0; i < locations.length; i++) {
		var address = locations[i];
		if (address !== "") {
			waypnts.push({
				location: address,
				stopover: true
			});
		}
	}
	
  update_content(waypnts);
  
  if (waypnts.length > 0){
	  var request = {
		origin: start,
		destination: end,
		waypoints: waypnts, //an array of waypoints
		optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
		travelMode: google.maps.TravelMode[selectedMode]
	  };
  } else {
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode[selectedMode]
  };
  }
  
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
	  alert('Cannot make it');
	}
  });
} 

google.maps.event.addDomListener(window, 'load', initialize);