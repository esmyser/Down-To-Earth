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
          earth.spin(event);
        }
    });
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
  var lt = lt,
      lg = lg,
      mapOptions = {
        center: { lat: lt, lng: lg},
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}


