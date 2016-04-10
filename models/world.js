function World(){
  var options = {
    sky        : true,
    atmosphere : true,
    dragging   : true,
    tilting    : false,
    zooming    : true,
    center     : [0, 100],
    zoom       : 3.5
  };

  this.ball = WE.map('earth_div', options);

  this.map = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
      tileSize : 256,
      tms      : true
    });

  this.map.addTo(this.ball);
}

World.prototype.stop = function(){
  var before;

  requestAnimationFrame(function animate(now) {
      var coordinates = this.ball.getPosition();
      var timePassed  = before ? (now - before) : 0;
      before = now;
      this.ball.setCenter([coordinates[0], lng]);
      requestAnimationFrame(animate);
  });
};