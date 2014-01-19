var url = require("url");
var fs = require("fs");

module.exports = function(request, response) {
	var filename = url.parse(request.url).pathname.replace(/\.\.+/g, '');
	if (filename == '/') filename = '/index.html';

	fs.readFile("client" + filename, function(error, data) {
		if (error) {
			fs.readFile("story/" + SETTINGS.STORYFOLDER + filename, function(error, data) {
				if (error) {
					response.writeHead(404, {'Content-Type': 'text'});
					response.end("fuck you");
				}
				if (filename.split('.').length < 2) return;
				returnFile(response, filename, data);
			});
			return;
		}
		if (filename.split('.').length < 2) return;
		returnFile(response, filename, data);
		return;
	});

	return;
}

function returnFile(response, filename, data) {
	switch (filename.split('.') [1]) {
		case "html":
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end(data);
			break;
		case "css":
			response.writeHead(200, {'Content-Type': 'text/css'});
			response.end(data);
			break;
		case "png":
			response.writeHead(200, {'Content-Type': 'image/png'});
			response.end(data, 'binary');
			break;
		case "jpg":
			response.writeHead(200, {'Content-Type': 'image/jpeg'});
			response.end(data, 'binary');
			break;
		case "gif":
			response.writeHead(200, {'Content-Type': 'image/gif'});
			response.end(data, 'binary');
			break;
		case "ico":
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end(data, 'binary');
			break;
		case "js":
			response.writeHead(200, {'Content-Type': 'application/javascript'});
			response.end(data);
			break;
		case "woff":
			response.writeHead(200, {'Content-Type': 'application/font-woff'});
			response.end(data, 'binary');
			break;
		default:
			console.log("FILENAME ERROR " + filename.split('.') [1]);
			break;
	}
}