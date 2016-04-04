var http = require('http');
var fs = require('fs');
var browserify = require('browserify');

http.createServer(function (req, res) {
	console.log(req.url);
	if (req.url === '/') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		fs.createReadStream('./index.html').pipe(res);
	}
	else if (req.url === '/bundle.js') {

		res.writeHead(200, {
			'Content-Type': 'text/javascript'
		});
		var b = browserify('./main.js');
		
		b.bundle().pipe(res);
	}
	else if (req.url !== '/favicon.ico') {
		fs.createReadStream(__dirname + req.url).pipe(res);
	}
}).listen(8080);
console.log('Listening on port 8080.');