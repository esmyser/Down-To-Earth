// key my MAPS API::::::: AIzaSyDEFlHNtb2j5Jlixac6I3_vpX_SRAdYqxw


var panorama;
// figure out Street view. and figure out how to find close streetviews given longitude and latitude.
function initialize() {
  var currentPlace = { lat: 40.7484, lng: -73.9857};
  var mapOptions = {
    center: currentPlace,
    zoom: 15,
    panControl: false,
    zoomControl: true,
    scaleControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    }
  };
  var map = new google.maps.Map(document.getElementById('the_actual_map'),
      mapOptions);
  

    

    google.maps.event.addListener(map, 'click', function(event) {
    sv.getPanorama({location: currentPlace, radius: 50}, processSVData);
    });

    panorama = map.getStreetView();
    panorama.setPosition(currentPlace);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
      heading: 265,
      pitch: 0
    }));
    
    

}
function toggleStreetView() {
  var toggle = panorama.getVisible();
  if (toggle == false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);


