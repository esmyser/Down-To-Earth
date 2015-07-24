function initialize() {
  if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(initialLocation);
      });
  }

  var mapOptions = {
    center: { lat: 40.705329, lng: -74.0139696},
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);


