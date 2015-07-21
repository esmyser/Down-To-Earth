function initialize() {
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
  earth = new WE.map('earth_div', options);
  var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
    tileSize: 256,
    tms: true
  });
  natural.addTo(earth);


  // overlay globe with place details
  var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
    opacity: 0.3
  });
  toner.addTo(earth);

  // record latitude, longitude, and pass to googlemaps
  recordInfo = function(e) {
    var lt = Number(e.latitude),
        lg = Number(e.longitude)

    // zoom iify
    zoom_in(lt, lg);

    // show map
    setTimeout(function(){initialize_map(lt, lg)}, 3000);
  }

  earth.on('click', recordInfo)

  zoom_in = function(lt, lg) {
    var bounds = [[lt, lg], [(lt + 5), (lg + 5)]];
    earth.panInsideBounds(bounds)
    
  }

  initialize_map = function(lt, lg) {
    var lt = lt,
        lg = lg
        mapOptions = {
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