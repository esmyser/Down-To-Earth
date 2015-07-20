function initialize() {
  var options = {
    sky: false,
    atmosphere: true,
    dragging: true,
    tilting: true,
    zooming: false,
    center: [46.8011, 8.2266],
    zoom: 3
  };
  earth = new WE.map('earth_div', options);
  var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
    tileSize: 256,
    tms: true
  });
  natural.addTo(earth);

  var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
    opacity: 0.3
  });
  toner.addTo(earth);

  var before = null;
        requestAnimationFrame(function animate(now) {
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;
            earth.setCenter([c[0], c[1] + 0.9*(elapsed/30)]);
            requestAnimationFrame(animate);
        });

  recordInfo = function(e) {
    this.latitude = e.latitude;
    this.longitude = e.longitude;
    // trying to zoom into spot
    // var bounds = [[this.latitude, this.longitude], [this.latitude + 1, this.longitude + 1]];
    // earth.panInsideBounds(bounds)
    // initialize_map(Number(this.latitude), Number(this.longitude));
    earth.hide()
    }

  earth.on('click', recordInfo)


  function initialize_map(lt, lg) {
    debugger
    var lt = lt
    var lg = lg
    var mapOptions = {
      center: { lat: lt, lng: lg},
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }

}








// take this info from recordInfo and pass to google maps
// need to record num clicks and only pass even clicks