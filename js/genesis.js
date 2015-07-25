  // earth's a new World
  // it's theBall wearing theMap
  // when you click theBall, you get a theBall event
  // that has latitude and longitude
  // we can use the event details to spin the globe,
  // or to stop the globe and send the lat / longitude to google

function initialize(){
  earth = new World;

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
          $("#welcome").slideUp();
          earth.spin(event);
        }
    });

    setTimeout(function(){$("#welcome").slideUp();}, 3000);
    setTimeout(function(){$(".overlay").slideUp();}, 3000);

  })

  // $("#reset").on('click', function(){
  //     alert("CLICKED");
  //     earth = new World;
  //     $(function(){earth.theBall.on('dblclick', earth.spinStop);})
      
  //     // toggleStreetView(); 
  // });

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

World.prototype.spin = function(event){
  var before = null;

  requestAnimationFrame(function animate(now) {
      var coordinates = earth.theBall.getPosition();
      var timePassed = before? now - before: 0;
      before = now;
      earth.theBall.setCenter([coordinates[0], coordinates[1] + (timePassed/-30)]);
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
  // var x = $('#map-canvas')[0].attributes.style;

  var currentPlace = { lat: lt, lng: lg};
  var mapOptions = {
    center: currentPlace,
    zoom: 10,
    panControl: false,
    zoomControl: true,
    scaleControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    }
  };
    //set up the map
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //get streetview
    var sv = new google.maps.StreetViewService();


    var centerControlDiv = document.createElement('div');
    centerControlDiv.index = 1;
    var centerControl = new CenterControl(centerControlDiv, map);
   
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
    // map.controls[google.maps.ZoomControlStyle.LARGE].push(centerControlDiv);

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
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'RESET';
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to our currentlocation.
      google.maps.event.addDomListener(controlUI, 'click', function() {
        $('#map-canvas').toggle();
        // $('#earth_div').toggle();
          initialize();
      });
    }





      // Set the initial Street View camera to the center of the map
      sv.getPanorama({location: currentPlace, radius: 500000}, processSVData);

      // Look for a nearby Street View panorama when the map is clicked.
      // getPanoramaByLocation will return the nearest pano when the
      // given radius is 50 meters or less.
      google.maps.event.addListener(map, 'click', function(event) {
        sv.getPanorama({location: currentPlace, radius: 500000}, processSVData);
      });

    panorama = map.getStreetView();
    panorama.setPosition(currentPlace);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
      heading: 265,
      pitch: 0
    }));

    function processSVData(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var marker = new google.maps.Marker({
          position: data.location.latLng,
          map: map,
          title: data.location.description
        });

        panorama.setPano(data.location.pano);
        panorama.setPov({
          heading: 270,
          pitch: 0
        });
        panorama.setVisible(true);

        google.maps.event.addListener(marker, 'click', function() {
          var markerPanoID = data.location.pano;
          // Set the Pano to use the passed panoID.
          panorama.setPano(markerPanoID);
          panorama.setPov({
            heading: 270,
            pitch: 0
          });
          panorama.setVisible(true);
        });
      } else {
        console.error('Street View data not found for this location.');
      }
    };   
}
//  Ezra's old map code
//   var lt = lt,
//       lg = lg,
//       mapOptions = {
//         center: { lat: lt, lng: lg},
//         zoom: 8,
//         mapTypeId: google.maps.MapTypeId.SATELLITE
//       };

//   var map = new google.maps.Map(document.getElementById('map-canvas'),
//       mapOptions);
// }

