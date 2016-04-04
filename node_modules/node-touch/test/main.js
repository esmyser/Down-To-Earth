require('../index.js')();

window.onload = function () {

var startY = -2;
document.body.addEventListener('touchstart', function (event) {
	startY = event.changedTouches[0].clientY;
});

document.body.addEventListener('touchmove', function (event) {
	var b = document.querySelector('button');
	b.innerHTML = event.target.scrollTop;
	if (event.target.scrollTop === 0) {
		var y = event.changedTouches[0].clientY;
		if (y > startY) event.preventDefault();
	}
});

for (var i = 0; i < 30;i++) {
	var button = document.createElement('button');
	button.classList.add('touch');
	var div = document.createElement('div');
	div.innerHTML = i + ' item';
	button.appendChild(div);
	document.body.appendChild(button);

	button.addEventListener('tap', function (event) {
		this.classList.toggle('tapped');
		console.log('tap')
	}, false);

	button.addEventListener('swipestart', function (event) {
		if (event.direction !== 'RIGHT') return;

		document.body.ontouchmove = function (event) { event.preventDefault(); };

		var transform = 'translateX(' + event.delta + 'px)';
		this.style.webkitTransform = transform;
	});

	button.addEventListener('swipemove', function (event) {
		if (event.direction !== 'RIGHT') return;

		var transform = 'translateX(' + event.delta + 'px)';
		this.style.webkitTransform = transform;
	});

	button.addEventListener('swipeend', function (event) {
		if (event.direction !== 'RIGHT') return;

		document.body.ontouchmove = null;

		console.log('END');
	});
}

};