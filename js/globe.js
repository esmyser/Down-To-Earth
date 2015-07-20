function initialize() {
  var options = {
    sky: true,
    atmosphere: true,
    dragging: true,
    tilting: false,
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

  recordInfo = function(e) {
    this.latitude = e.latitude;
    this.longitude = e.longitude;
    console.log(latitude, longitude);
    initialize_map(Number(this.latitude), Number(this.longitude));
    }

  earth.on('click', recordInfo)

  function initialize_map(lt, lg) {
    debugger
    var lt = lt
    var lg = lg
    var mapOptions = {
      center: { lat: lt, lng: lg},
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }

}









// take this info from recordInfo and pass to google maps
// need to record num clicks and only pass even clicks