  // earth's a new World
  // it's theBall wearing theMap
  // when you click theBall, you get a theBall event
  // that has latitude and longitude
  // we can use the event details to spin the globe,
  // or to stop the globe and send the lat / longitude to google

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
    zooming: false,
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
        else if(dragging === true){
          earth.spin(event);
        }
    });

    earth.theBall.on("dbclick", function(){$('#map-canvas').toggle();});

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

    earth.theBall.on("dbclick", function(){$('#map-canvas').toggle();});

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

  earth.googleMe(lt, lg);
}

World.prototype.googleMe = function(lt, lg) {
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=API_KEY
  // var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lt + "," + lg + "&radius=500&types=airport&key=AIzaSyDEFlHNtb2j5Jlixac6I3_vpX_SRAdYqxw"
  $("#map-canvas").toggle();

  var currentPlace = { lat: lt, lng: lg};
  var mapOptions = {
      center: currentPlace,
      zoom: 8,
      panControl: false,
      zoomControl: true,
      scaleControl: true,
      zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
      mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  var mapCanvas = document.getElementById('map-canvas');

  //set up the map
  var map = new google.maps.Map(mapCanvas, mapOptions);
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
  //  map.controls[google.maps.ZoomControlStyle.LARGE].push(centerControlDiv);

  var centerControlDiv = document.createElement('div');
      centerControlDiv.index = 1;
      centerControl = new CenterControl(centerControlDiv, map);

  var panorama = map.getStreetView();
      panorama.setPosition(currentPlace);
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
      
      panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: 265,
        pitch: 0
      }));

  setTimeout(function(){ 
    //get streetview
    var sv = new google.maps.StreetViewService();
        // Set the initial Street View camera to the center of the maps
        sv.getPanorama({location: currentPlace, radius: 5000000}, processSVData);
        // Look for a nearby Street View panorama when the map is clicked.
        // getPanoramaByLocation will return the nearest pano when the
        // given radius is 500000 meters or less.

        // leaving this commented gives you the ability to interact with the google map.
        // google.maps.event.addListener(map, 'click', function(event) {
        //   sv.getPanorama({location: currentPlace, radius: 500000}, processSVData);
        // });
    }, 300);


    function CenterControl(centerControlDiv, map) {
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
      centerControlDiv.appendChild(controlUI);

      // Listen for Reset click
      google.maps.event.addDomListener(controlUI, 'click', function() {
        $('#map-canvas').toggle();
        initialize();
        $('#earth_div').children().last().remove();
        $('#earth_div').children().last().remove();
      });
    };


    function processSVData(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
          var marker = new google.maps.Marker({
              position: data.location.latLng,
              map: map,
              title: data.location.description
            });

        map.panTo(marker.getPosition());

        panorama.setPano(data.location.pano);
        panorama.setPov({
          heading: 270,
          pitch: 0
        });

        setTimeout(function(){ panorama.setVisible(true);}, 2000);
      } 
      else {
        console.error('Street View data not found for this location.');
      }
    };   
};