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
  recordInfo = function(earth) {
    var lt = Number(earth.latitude),
        lg = Number(earth.longitude)

    // zoom iify
    zoom_in(lt, lg);

    // show map afterwards
    setTimeout(function(){initialize_map(lt, lg)}, 3000);
    // don't think this function works to remove the globe after zoom
    // trying to speed up the street view - it's laggy
    setTimeout(function(){$("#earth_div").remove()}, 3000);
  }

  // start whole process when click somewhere on earth
  earth.on('click', recordInfo)

  // zoom in on globe
  zoom_in = function(lt, lg) {
    var bounds = [[lt, lg], [(lt + 5), (lg + 5)]];
    earth.panInsideBounds(bounds)
  }

  // start google map
  initialize_map = function(lt, lg) {
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

}