global.SETTINGS = require("./settings.json");

server = require("http").createServer(function(request, response) {
	require("./includes/router.js")(request, response);
})

server.listen(SETTINGS.PORT);
require("./includes/socket.js")(require("socket.io").listen(server));