function initialize(){
  earth = new World;

  $(function(){
    $("#explore").click(earth.explore);
    $("#lucky").click(earth.lucky);
  })
};

function World(){
  var options = {
    sky: true,
    atmosphere: true,
    dragging: true,
    tilting: false,
    zooming: true,
    center: [0, 100],
    zoom: 3.5
  };

  this.theBall = WE.map('earth_div', options);

  this.theMap = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
      tileSize: 256,
      tms: true
    });

  this.theMap.addTo(this.theBall);
};

World.prototype.lucky = function(){
  $(function(){
    earth.theBall.on('mousedown', function(){
        dragging = false;
    });

    earth.theBall.on('mousemove', function(){
        dragging = true;
    });

    earth.theBall.on('click', function(event){
        event.preventDefault(); 
        if(dragging === false){
          earth.spinStop(event);
        }
        else if(dragging === true){
          earth.spin(event);
        }
    });

    $("#welcome").slideUp();
    $(".overlay").slideUp();
  })
}

World.prototype.explore = function(){
  $(function(){
    earth.theBall.on("mousedown", function(){
        dragging = false;
    });

    earth.theBall.on("mousemove", function(){
        dragging = true;
    });

    earth.theBall.on("click", function(event){
        if(dragging === false){
          earth.spinStop(event);
        }
    });

    $("#welcome").slideUp();
    $(".overlay").slideUp();
  })
}

World.prototype.spin = function(event){
  var before = null;

  requestAnimationFrame(function animate(now) {
      var coordinates = earth.theBall.getPosition();
      var timePassed = before? now - before: 0;
      before = now;
      earth.theBall.setCenter([coordinates[0], coordinates[1] + (timePassed/-15)]);
      requestAnimationFrame(animate);
  });
};

World.prototype.spinStop = function(event){
  var lt = Number(event.latitude),
      lg = Number(event.longitude),
      before = null

  requestAnimationFrame(function animate(now) {
      var coordinates = earth.theBall.getPosition();
      var timePassed = before? now - before: 0;
      before = now;
      earth.theBall.setCenter([coordinates[0], lg]);
      requestAnimationFrame(animate);
  });

  googleMe(lt, lg);
  $("#map-canvas").fadeToggle(800);
};

function googleMe(lt, lg) {
  var currentPlace = {lat: lt, lng: lg};

  var mapOptions = {
      center: currentPlace,
      zoom: 8,
      panControl: false,
      zoomControl: true,
      scaleControl: true,
      zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  var mapCanvas = document.getElementById('map-canvas');

  var map = new google.maps.Map(mapCanvas, mapOptions);

  var controlDiv = document.createElement('div');
      controlDiv.index = 1;
      centerControl = new CenterControl(controlDiv, map);

  var panorama = map.getStreetView();
      panorama.setPosition(currentPlace);
      panorama.setOptions({enableCloseButton: false});
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
      panorama.setPov({heading: 265, pitch: 0});

  //get streetview
  var sv = new google.maps.StreetViewService();
      sv.getPanorama({location: currentPlace, radius: 5000000}, processSVData);

    function processSVData(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var marker = new google.maps.Marker({
            position: data.location.latLng,
            map: map,
            title: data.location.description,
            visible: false
            });

        panorama.setPano(data.location.pano);
        panorama.setPov({heading: 270, pitch: 0});

        // getting the location data from the marker
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {

                // check if we can get city info
                for (var i=0; i<results.length; i++) {
                    if (results[i].types[0]=='locality') { 
                      var result = results[i];
                      break; 
                  }
                };

                // if we don't have a city, we look for state
                if (!result) {
                  for (var i=0; i<results.length; i++) {
                      if (results[i].types[0]=='administrative_area_level_1') { 
                        var result = results[i];
                        break; 
                    }
                  };
                };

                // if we don't have a state, we look for country
                if (!result) {
                  for (var i=0; i<results.length; i++) {
                      if (results[i].types[0]=='country') { 
                        var result = results[i];
                        break; 
                    }
                  };
                };

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
                console.log(result.city + ", " + result.region + ", " + result.country)
            }
          } 
          else { console.log("Geocoder failed due to: " + status); }
          
          var myTitle = document.createElement('h4');
          myTitle.style.color = 'white';
          myTitle.innerHTML = "<p>" + result.city + ', ' + result.region + ', ' + result.country + "</p>";
          var myTextDiv = document.createElement('div');
          myTextDiv.appendChild(myTitle);
          setTimeout(function(){ map.controls[google.maps.ControlPosition.TOP_CENTER].push(myTextDiv);}, 1000)
        });

        setTimeout(function(){ marker.setVisible(true); }, 1000);
        setTimeout(function(){ map.panTo(marker.getPosition()); }, 1000);
        setTimeout(function(){ panorama.setVisible(true); }, 2500);
      } 
      else {
        console.error('Street View data not found for this location.');
      }
    };   
};

function CenterControl(controlDiv, map) {
  // Set CSS for the control border
  var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'reset button';

  // Set CSS for the control interior
  var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'RESET';

  // Combine Text and UI, add UI to DOM
  controlUI.appendChild(controlText);
  controlDiv.appendChild(controlUI);

  // Listen for Reset click
  google.maps.event.addDomListener(controlUI, 'click', function() {
    window.location.reload();
  });
};