function Globe(){
  var options = {
    sky        : true,
    atmosphere : true,
    dragging   : true,
    tilting    : false,
    zooming    : true,
    center     : [0, 100],
    zoom       : 3.2
  };

  this.ball = WE.map('earth_div', options);
  this.map  = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
                  tileSize : 256,
                  tms      : true
              });
    

  this.map.addTo(this.ball);
}

function GoogleMap(){
  var mapDiv = document.getElementById('map-canvas');
  var mapOptions = {
      center             : { lat: -34, lng: 151 },
      zoom               : 8,
      panControl         : false,
      scaleControl       : true,
      zoomControl        : true,
      zoomControlOptions : { style : google.maps.ZoomControlStyle.SMALL },
      mapTypeId          : google.maps.MapTypeId.SATELLITE
  };

  this.map        = new google.maps.Map(mapDiv, mapOptions);
  this.streetview = new google.maps.StreetViewService();
  this.controlDiv = document.createElement('div');
  this.controlDiv.index = 1;
}

run = function(){
  var earth = new Globe();
  var dragging; 

  earth.ball.on("mousedown", function(){
    dragging = false;
    $("#welcome").slideUp();
  });

  earth.ball.on("mousemove", function(){
    dragging = true;
  });

  earth.ball.on("click", function(e){
    if (dragging) return;
    mapIt(e);
  });
};

mapIt = function(e) {
  var gMap = new GoogleMap();

  var currentPlace = getPlace(e);
  gMap.map.setCenter(currentPlace);

  $("#map-canvas").fadeToggle(900);

  getStreetview(gMap, currentPlace);
  addResetButton(gMap.controlDiv);
};

getPlace = function(e){
  var currentPlace = {
    lat : Number(e.latitude), 
    lng : Number(e.longitude)
  };

  return currentPlace;
};

getStreetview = function(gMap, currentPlace){
  var controlDiv = gMap.controlDiv;
  var streetview = gMap.streetview;
  var map        = gMap.map;

  streetview.getPanorama({ 
    location : currentPlace, 
    radius   : 5000000 
  }, processSVData);

  function processSVData(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      setupAndRenderStreetView(data, status, gMap, currentPlace);
    } else {
      console.error('Street View data not found for earth location.');
    }
  }
};

setupAndRenderStreetView = function(data, status, gMap, currentPlace){
  var map        = gMap.map;
  var controlDiv = gMap.controlDiv;
  var position   = data.location.latLng;
  var marker     = new google.maps.Marker({
      position : position,
      map      : map,
      title    : data.location.description,
      visible  : false
  });

  var panorama = map.getStreetView();
      panorama.setPosition(currentPlace);
      panorama.setOptions({ enableCloseButton : false });
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
      panorama.setPano(data.location.pano);
      panorama.setPov({heading: 270, pitch: 0});

  reverseGeocodeLocation(map, position);

  setTimeout(function(){ marker.setVisible(true);         }, 1000);
  setTimeout(function(){ map.panTo(marker.getPosition()); }, 1000);
  setTimeout(function(){ panorama.setVisible(true);       }, 2500);
};

reverseGeocodeLocation = function(map, position){
  var geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ 'location': position }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var location = getLocation(results);
      appendLocationToDOM(map, location);
      console.log(location);
    } else { 
      console.log("Geocoder failed due to: " + status); 
    }
  });
};

getLocation = function(results){
  var location = getLocationData(results);
  var name     = getLocationName(location);

  return name;
};

getLocationData = function(results){
  var location; 

  // see if there's city level data
  for (i=0; i<results.length; i++) {
      if (results[i].types[0]=='locality') { 
        location = results[i];
        break; 
    }
  }

  // if we don't have city level info, check for state level
  if (!location) {
    for (i=0; i<results.length; i++) {
        if (results[i].types[0]=='administrative_area_level_1') { 
          location = results[i];
          break; 
      }
    }
  }

  // if we don't have a state level info, check for country level
  if (!location) {
    for (i=0; i<results.length; i++) {
        if (results[i].types[0]=='country') { 
          location = results[i];
          break; 
      }
    }
  }

  return location;
};

getLocationName = function(location){
  var city, region, country;

  for (i=0; i<location.address_components.length; i++) {
    if (location.address_components[i].types[0] == "locality") {
            city    = location.address_components[i].long_name;
    }
    if (location.address_components[i].types[0] == "administrative_area_level_1") {
            region  = location.address_components[i].long_name;
    }
    if (location.address_components[i].types[0] == "country") {
            country = location.address_components[i].long_name;
    }
  }

  var name = createName(city, region, country);

  return name;
};

createName = function(city, region, country){
  var name = "";

  if (city) 
    { name += city; }

  if (city && region) 
    { name += ", " + region; }
  else if (region)    
    { name += region; }

  if ((city || region) && country) 
    { name += ", " + country; }
  else if (country)                
    { name += country; }

  return name;
};

appendLocationToDOM = function(map, location){
  var myTitle = document.createElement('h4');
      myTitle.style.color = 'white';
      myTitle.innerHTML = "<p id='big_font'>" + location + "</p>";

  var myTextDiv = document.createElement('div');
      myTextDiv.appendChild(myTitle);

  setTimeout(function(){ 
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(myTextDiv);
  }, 1000);
};

addResetButton = function(controlDiv) {
  var buttonDiv = document.createElement('div');
      buttonDiv = styleButton(buttonDiv);
  var textDiv   = document.createElement('div');
      textDiv   = styleText(textDiv);

  buttonDiv.appendChild(textDiv);
  controlDiv.appendChild(buttonDiv);

  google.maps.event.addDomListener(buttonDiv, 'click', function() {
    window.location.reload();
  });
};

styleButton = function(buttonDiv) {
  buttonDiv.style.backgroundColor = '#fff';
  buttonDiv.style.border          = '2px solid #fff';
  buttonDiv.style.borderRadius    = '3px';
  buttonDiv.style.boxShadow       = '0 2px 6px rgba(0,0,0,.3)';
  buttonDiv.style.cursor          = 'pointer';
  buttonDiv.style.marginBottom    = '22px';
  buttonDiv.style.textAlign       = 'center';
  buttonDiv.title                 = 'reset button';
  return buttonDiv;
};

styleText = function(textDiv){
  textDiv.style.color         = 'rgb(25,25,25)';
  textDiv.style.fontFamily    = 'Roboto,Arial,sans-serif';
  textDiv.style.fontSize      = '16px';
  textDiv.style.lineHeight    = '38px';
  textDiv.style.paddingLeft   = '5px';
  textDiv.style.paddingRight  = '5px';
  textDiv.innerHTML           = 'RESET';
  return textDiv;
};