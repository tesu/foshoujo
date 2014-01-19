var clients = new Object();
clients.id = [];
clients.name = [];
clients.status = [];

var spectators = new Object();
spectators.id = [];
spectators.name = [];

var spectatorCount = 0;
var banlist = [];

var server = new Object();
server.stage = 0;

module.exports = function(io) {
	io.set('log level', 1);

	io.sockets.on('connection', function(socket){
		console.log(socket.handshake.address.address + " connection");

		if (server.stage == 0) {
			if (clients.id.length >= SETTINGS.MAXPLAYERS) {
				socket.emit('error', {'message': 'The player maximum has been reached.'});
				spectatorJoin(io, socket);
				return;
			}
			if (banlist.indexOf(socket.handshake.address.address) != -1) {
				socket.emit('error', {'message': 'You have been banned from the server.'});
				spectatorJoin(io, socket);
				return;
			}

			playerJoin(io, socket);
			return;
		} else if (server.stage == 1) {
			socket.emit('error', {'message': 'The game has already started.'});
			spectatorJoin(io, socket);
			return;
		}
		return;
	})
}

function Player(ip) {
	this.ip = ip;
	this.name = "";
	this.items = [];
	this.hp = 100;
	this.story = require("../story/" + SETTINGS.STORYFOLDER + "/story.js");
	this.status = 1;
	this.itemCheck = function(data) {
		if (this.items.indexOf(data) != -1) return true;
		return false
	}
}

function playerJoin(io, socket) {
	socket.emit('ready', {});
	socket.d = new Player(socket.handshake.address.address);

	if (clients.name.indexOf(socket.d.ip) == -1) {
		socket.d.name = socket.d.ip;
	} else {
		var i = 2;
		while(true) {
			if (clients.name.indexOf(socket.d.ip + " (" + i + ")") == -1) {
				socket.d.name = socket.d.ip + " (" + i + ")";
				break;
			}
			i++;
		}
	}

	if (socket.d.ip == SETTINGS.ADMINIP) {
		socket.emit('admincommand', {});
	}
	socket.d.namechanged = false;

	clients.id.push(socket.id);
	clients.name.push(socket.d['name']);
	clients.status.push(1);

	io.sockets.emit('usersonline', {'array': clients.name});

	socket.on('namechange', function(data) {
		if (socket.d['namechanged'] == true) return;
		if (typeof data.message != 'string') return;
		var newname = data.message.replace(/[<>]/g, '');

		if(clients.name.indexOf(newname) != -1) {
			socket.emit('error', {'message': 'Someone else already has that name.'})
			return;
		}

		if(newname.length >= 20) {
			socket.emit('error', {'message': 'Your name is too long.'})
			return;
		}

		clients.name[clients.name.indexOf(socket.d['name'])] = newname;
		socket.d.name = newname;
		socket.d.namechanged = true;
		io.sockets.emit('usersonline', {'array': clients.name});
		socket.emit('namechangesuccess', {});
		return;
	})

	socket.on('chat', function(data) {
		if (typeof data.message != 'string') return;

		var message = data.message.replace(/[<>]/g, '&gt;').substring(0, 30);
		if (message == '') {
			socket.emit('error', {'message': 'You cannot send an empty string.'});
			return;
		}
		io.sockets.emit('chat', {'user': socket.d.name, 'message': message});
		return;
	})

	socket.on('admincommand', function(data) {
		if (typeof data.message != 'string') return;
		if (socket.d['ip'] != SETTINGS.ADMINIP) return;

		switch(data.message.split(' ') [0]) {
			case "start":
				server.stage = 1;
				io.sockets.emit('gamestart', {});
				break;
			case "restart":
				server.stage = 0;
				io.sockets.emit('ready', {});
				break;
			case "kick":
				var user = io.sockets.socket(clients.id[clients.name.indexOf(data.message.replace(/^kick /, ''))]);
				if (typeof user == "undefined") {
					user = io.sockets.socket(spectators.id[spectators.name.indexOf(data.message.replace(/^kick /, ''))])
				}
				if (typeof user == "undefined") break;
				user.disconnect();
				break;
			case "ban":
				var user = io.sockets.socket(clients.id[clients.name.indexOf(data.message.replace(/^ban /, ''))]);
				if (typeof user == "undefined") {
					user = io.sockets.socket(spectators.id[spectators.name.indexOf(data.message.replace(/^ban /, ''))])
				};
				if (typeof user == "undefined") break;
				user.disconnect();
				console.log(user.d.ip + " b&");
				banlist.push(user.d.ip);
				break;
			case "music":
				var url = data.message.replace(/^music/, '')
				if (typeof url == "") {
					io.sockets.emit('changeMusic', {'message': ''});
					break;
				} else {
					url = url.replace(/^ /, '');
					io.sockets.emit('changeMusic', {'message': url});
					break;
				}
			case "text":
				var arg = data.message.replace(/^text/, '')
				if (typeof arg == "") {
					io.sockets.emit('changeDialog', {'message': ''});
					break;
				} else {
					arg = arg.replace(/^ /, '');
					io.sockets.emit('changeDialog', {'message': arg});
					break;
				}
			case "speaker":
				var arg = data.message.replace(/^speaker/, '')
				if (typeof arg == "") {
					io.sockets.emit('changeSpeaker', {'message': ''});
					break;
				} else {
					arg = arg.replace(/^ /, '');
					io.sockets.emit('changeSpeaker', {'message': arg});
					break;
				}
			case "shutdown":
				io.server.close();
				process.exit();
				break;
			default:
				break;
		}
		return;
	})

	socket.on('gamestart', function() {
		if (server.stage != 1) return;

		gameStart(io, socket, socket.d.story);
		return;
	})

	socket.on('disconnect', function() {
		clients.id.splice(clients.id.indexOf(socket.id), 1);
		clients.name.splice(clients.name.indexOf(socket.d.name), 1);
		clients.status.splice(clients.id.indexOf(socket.id), 1);
		socket.d.story.restart();

		socket.broadcast.emit('usersonline', {'array': clients.name});
		console.log(socket.d.ip + " disconnection");
		if (clients.id.length == 0) {
			server.stage = 0;
		}
		return;
	})
}

function gameStart(io, socket) {
	socket.on('gamestart', function() {});
	socket.on('namechange', function() {});

	// deal with settings
	var ready = socket.d.story.run(io, socket);
	socket.on('next', function() { 
		if (!ready) return;
		ready = socket.d.story.run(io, socket);
	});
	return;
}

function spectatorJoin(io, socket) {
	socket.emit('readyspec', {});
	spectatorCount++;

	socket.d = new Object();
	socket.d.ip = socket.handshake.address.address;
	socket.d.name = "Spectator " + spectatorCount;

	spectators.id.push(socket.id);
	spectators.name.push(socket.d.name);

	socket.emit('usersonline', {'array': clients.name});

	socket.on('chat', function(data) {
		if (typeof data.message != 'string') return;

		var message = data.message.replace(/[<>]/g, '&gt;').substring(0, 30);
		if (message == '') {
			socket.emit('error', {'message': 'You cannot send an empty string.'});
			return;
		}
		io.sockets.emit('chat', {'user': socket.d.name, 'message': message});
		return;
	});

	socket.on('disconnect', function() {
		spectators.id.splice(spectators.id.indexOf(socket.id), 1);
		spectators.name.splice(spectators.id.indexOf(socket.id), 1);

		console.log(socket.d.ip + " disconnection");
	})
	return;
}
