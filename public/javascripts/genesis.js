function Globe(){
  var options = {
    sky        : true,
    atmosphere : true,
    dragging   : true,
    tilting    : false,
    zooming    : true,
    center     : [0, 100],
    zoom       : 3.5
  };

  this.ball = WE.map('earth_div', options);
  this.map  = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
                  tileSize : 256,
                  tms      : true
              });

  this.map.addTo(this.ball);
}

function GoogleMap(){
  var mapOptions = {
      zoom               : 8,
      panControl         : false,
      zoomControl        : true,
      scaleControl       : true,
      zoomControlOptions : { style : google.maps.ZoomControlStyle.SMALL },
      mapTypeId          : google.maps.MapTypeId.SATELLITE
  };

  var mapCanvas = document.getElementById('map-canvas');

  this.map = new google.maps.Map(mapCanvas, mapOptions);
  this.controlDiv = document.createElement('div');
  this.controlDiv.index = 1;

  addResetButton(this.controlDiv, this.map);
}

run = function(){
  earth = new Globe();

  gMap  = new GoogleMap();

  addRules(earth, gMap);
};

addRules = function(earth, gMap){
  earth.ball.on("mousedown", function(){
    $("#welcome").slideUp();
    dragging = false;
  });

  earth.ball.on("mousemove", function(){
    dragging = true;
  });

  earth.ball.on("click", function(e){
    if (dragging) { return; }
    mapIt(gMap, e);
    $("#map-canvas").fadeToggle(900);
  });
};

mapIt = function(gMap, e) {
  var map = gMap.map;
  var controlDiv = gMap.controlDiv;

  var lt = Number(e.latitude);
  var lg = Number(e.longitude);
  var currentPlace = {lat: lt, lng: lg};

  map.setCenter(currentPlace);

  var panorama = map.getStreetView();
      panorama.setPosition(currentPlace);
      panorama.setOptions({ enableCloseButton : false });
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
      panorama.setPov({
        heading : 265, 
        pitch   : 0
      });

  //get streetview
  var sv = new google.maps.StreetViewService();
      sv.getPanorama({ location : currentPlace, radius : 5000000 }, processSVData);

    function processSVData(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var marker = new google.maps.Marker({
            position : data.location.latLng,
            map      : map,
            title    : data.location.description,
            visible  : false
            });

        panorama.setPano(data.location.pano);
        panorama.setPov({heading: 270, pitch: 0});

        // getting the location data from the marker
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {

                // check if we can get city info
                for (var i = 0; i < results.length; i++) {
                    if (results[i].types[0]=='locality') { 
                      var result = results[i];
                      break; 
                  }
                }

                // if we don't have a city, we look for state
                if (!result) {
                  for (var i = 0; i < results.length; i++) {
                      if (results[i].types[0]=='administrative_area_level_1') { 
                        var result = results[i];
                        break; 
                    }
                  }
                }

                // if we don't have a state, we look for country
                if (!result) {
                  for (var i = 0; i < results.length; i++) {
                      if (results[i].types[0]=='country') { 
                        var result = results[i];
                        break; 
                    }
                  }
                }

                // making some easier variables, result.city, result.region, result.country
                for (var i = 0; i < result.address_components.length; i++) {
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

                //result data
                console.log(result.city + ", " + result.region + ", " + result.country);
            }
          } 
          else { console.log("Geocoder failed due to: " + status); }
          
          var myTitle = document.createElement('h4');
          myTitle.style.color = 'white';
          myTitle.innerHTML = "<p id='big_font'>" + result.city + ', ' + result.region + ', ' + result.country + "</p>";
          var myTextDiv = document.createElement('div');
          myTextDiv.appendChild(myTitle);
          setTimeout(function(){ map.controls[google.maps.ControlPosition.TOP_CENTER].push(myTextDiv);}, 1000);
        });

        setTimeout(function(){ marker.setVisible(true); }, 1000);
        setTimeout(function(){ map.panTo(marker.getPosition()); }, 1000);
        setTimeout(function(){ panorama.setVisible(true); }, 2500);
      } 
      else {
        console.error('Street View data not found for earth location.');
      }
    }
};

addResetButton = function(controlDiv, map) {
  var buttonDiv = document.createElement('div');
  var textDiv   = document.createElement('div');

  styleButton(buttonDiv);
  styleText(textDiv);

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
};

styleText = function(textDiv){
  textDiv.style.color         = 'rgb(25,25,25)';
  textDiv.style.fontFamily    = 'Roboto,Arial,sans-serif';
  textDiv.style.fontSize      = '16px';
  textDiv.style.lineHeight    = '38px';
  textDiv.style.paddingLeft   = '5px';
  textDiv.style.paddingRight  = '5px';
  textDiv.innerHTML           = 'RESET';
};
