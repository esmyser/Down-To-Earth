require('../index.js')();

window.onload = function () {
	var ul = document.querySelector('ul');
	setInterval(function () {
		var li = document.createElement('li');
		li.classList.add('inserted');
		li.innerHTML = ul.childNodes.length + ' item';

		ul.appendChild(li);
	}, 1000);


	document.addEventListener('inserted', function (event) {
		console.log(event)
		var b = document.createElement('b');
		b.innerHTML = ', from document inserted';
		event.inserted.appendChild(b);
	}, false);

	ul.addEventListener('inserted', function (event) {
		console.log(event)
		var b = document.createElement('b');
		b.innerHTML = ', from parent inserted';
		event.inserted.appendChild(b);
	}, false);
};