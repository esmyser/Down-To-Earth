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
  addRules(earth);
};

addRules = function(earth){
  var dragging; 

  earth.ball.on("mousedown", function(){
    dragging = false;
    $("#welcome").slideUp();
  });

  earth.ball.on("mousemove", function(){
    dragging = true;
  });

  earth.ball.on("click", function(e){
    if (dragging) { return; }
    mapIt(e);
  });
};

mapIt = function(e) {
  var gMap = new GoogleMap();

  var map          = gMap.map;
  var controlDiv   = gMap.controlDiv;
  var currentPlace = getPlace(e);

  map.setCenter(currentPlace);
  $("#map-canvas").fadeToggle(900);
  getStreetview(gMap, currentPlace);
  addResetButton(controlDiv);
};

getPlace = function(e){
  var lat = Number(e.latitude);
  var lng = Number(e.longitude);
  var currentPlace = {
    lat : lat, 
    lng : lng
  };

  return currentPlace;
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
      something(data, status, gMap, currentPlace);
    } else {
      console.error('Street View data not found for earth location.');
    }
  }
};

something = function(data, status, gMap, currentPlace){
  var map = gMap.map;
  var controlDiv = gMap.controlDiv;
  var marker = new google.maps.Marker({
      position : data.location.latLng,
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

  // getting the location data from the marker
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var result;

      // check if we can get city info
      for (var i = 0; i < results.length; i++) {
          if (results[i].types[0]=='locality') { 
            result = results[i];
            break; 
        }
      }

      // if we don't have a city, we look for state
      if (!result) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].types[0]=='administrative_area_level_1') { 
              result = results[i];
              break; 
          }
        }
      }

      // if we don't have a state, we look for country
      if (!result) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].types[0]=='country') { 
              result = results[i];
              break; 
          }
        }
      }

      // making some easier variables, result.city, result.region, result.country
      for (i=0; i<result.address_components.length; i++) {
        if (result.address_components[i].types[0] == "locality") {
                result.city = result.address_components[i].long_name;
            }
        if (result.address_components[i].types[0] == "administrative_area_level_1") {
                result.region = result.address_components[i].long_name;
            }
        if (result.address_components[i].types[0] == "country") {
                result.country = result.address_components[i].long_name;
            }
      }

      var city     = result.city;
      var region   = result.region;
      var country  = result.country;
      var location = "";

      if (city) 
        { location += city; }

      if (city && region) 
        { location += ", " + region; }
      else if (region)    
        { location += region; }

      if ((city || region) && country) 
        { location += ", " + country; }
      else if (country)                
        { location += country; }

      console.log(location);

      var myTitle = document.createElement('h4');
      myTitle.style.color = 'white';
      myTitle.innerHTML = "<p id='big_font'>" + location + "</p>";
      var myTextDiv = document.createElement('div');
      myTextDiv.appendChild(myTitle);
      setTimeout(function(){ map.controls[google.maps.ControlPosition.TOP_CENTER].push(myTextDiv);}, 1000);

    } else { 
      console.log("Geocoder failed due to: " + status); 
    }
  });

  setTimeout(function(){ marker.setVisible(true); }, 1000);
  setTimeout(function(){ map.panTo(marker.getPosition()); }, 1000);
  setTimeout(function(){ panorama.setVisible(true); }, 2500);
};