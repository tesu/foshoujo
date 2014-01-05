var url = require("url");
var fs = require("fs");

module.exports = function(request, response) {
	filename = url.parse(request.url).pathname;
	switch (filename) {
		case "/styles.css":
			fs.readFile("client/styles.css", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'text/css'});
				response.end(data);
			})
			return;
		case "/gradient.png":
			fs.readFile("client/images/gradient.png", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'image/png'})
				response.end(data, 'binary');
			})
			return;
		case "/favicon.ico":
			fs.readFile("client/images/favicon.ico", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'image/ico'})
				response.end(data, 'binary');
			})
			return;
		case "/sample.png":
			fs.readFile("client/images/sample.png", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'image/png'})
				response.end(data, 'binary');
			})
			return;
		case "/script.js":
			fs.readFile("client/script.js", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'application/javascript'})
				response.end(data);
			})
			return;
		case "/edgemaster.woff":
			fs.readFile("client/edgemaster.woff", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'application/font-woff'})
				response.end(data, 'binary');
			})
			return;
		case "/fuckyou":
			response.writeHead(200, {'Content-Type': 'text'})
			response.end("fuck you");
			return;
		default:
			fs.readFile("client/index.html", function(error, data) {
				if (error) throw error;
				response.writeHead(200, {'Content-Type': 'text/html'})
				response.end(data);
			})
			return;
	}
}