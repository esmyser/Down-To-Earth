function initialize(){
  globe = new Earth;
  $(function(){$("#earth_div").on('click', globe.spin)})
  $(function(){globe.sphere.on('dblclick', globe.recordInfo);})
};

function Earth(){
  this.sphere = new WE.map('earth_div', options);

  var options = {
    sky: true,
    atmosphere: true,
    dragging: true,
    tilting: true,
    zooming: false,
    center: [0, 0],
    zoom: 3.5
  };

  // overlay globe with earth images
  this.earthMap = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
    tileSize: 256,
    tms: true
  });
  this.globe = this.earthMap.addTo(this.sphere);
};

Earth.prototype.spin = function(e){
  var before = null;
  requestAnimationFrame(function animate(now) {
      var c = globe.sphere.getPosition();
      var elapsed = before? now - before: 0;
      before = now;
      globe.sphere.setCenter([c[0], c[1] + 3*(elapsed/-30)]);
      requestAnimationFrame(animate);
  });
};

Earth.prototype.recordInfo = function(event) {
  var lt = Number(event.latitude),
      lg = Number(event.longitude)

  globe.googleme(lt, lg);
}

Earth.prototype.googleme = function(lt, lg) {
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
