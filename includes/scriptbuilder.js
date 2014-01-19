module.exports = function() {
	var progress = 0;
	var script = [];
	this.settings = {};

	this.reset = function() {
		progress = -1;
		script = [];
	}

	this.restart = function() {
		progress = 0;
	}

	this.getScript = function() {
		return script;
	}

	this.text = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : true;
		script.push({'type': 'text', 'data': data, 'wait': wait});
	}

	this.appendText = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : true;
		script.push({'type': 'append', 'data': data, 'wait': wait});
	}

	this.speaker = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'speaker', 'data': data, 'wait': wait});
	}

	this.music = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'music', 'data': data, 'wait': wait});
	}

	this.buttonOn = function(data, id, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		if (data == "next") {
			script.push({'type': 'nextOn', 'wait': wait});
		} else {
			script.push({'type': 'buttonOn', 'data': data, 'wait': wait});
		}
	}

	this.buttonOff = function(data, id, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		if (data == "next") {
			script.push({'type': 'nextOff', 'wait': wait});
		} else {
			script.push({'type': 'buttonOff', 'data': data, 'wait': wait});
		}
	}

	this.changeBG = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'background', 'data': data, 'wait': wait});
	}

	this.pause = function(data) {
		script.push({'type': 'pause', 'data': data});
	}

	this.HP = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'hp', 'data': data, 'wait': wait});
	}

	this.itemAdd = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'itemAdd', 'data': data, 'wait': wait});
	}

	this.itemRemove = function(data, wait) {
		wait = typeof wait !== "undefined" ? wait : false;
		script.push({'type': 'itemRemove', 'data': data, 'wait': wait});
	}

	this.function = function(data) {
		script.push({'type': 'function', 'data': data});
	}

	this.run = function(io, socket) {
		var story = this;

		while (progress < script.length) {
			switch(script[progress].type) {
				case "text":
					socket.emit('changeDialog', {'message': processText(script[progress].data, socket)});
					break;
				case "speaker":
					socket.emit('changeSpeaker', {'message': processText(script[progress].data, socket)});
					break;
				case "music":
					socket.emit('changeMusic', {'message': script[progress].data});
					break;
				case "background":
					socket.emit('changeBG', {'message': script[progress].data});
					break;
				case "buttonOff":
					socket.emit('buttonOff', {'message': script[progress].data});
					break;
				case "buttonOn":
					socket.emit('buttonOn', {'message': script[progress].data});
					break;
				case "nextOn": // this should probably never be used
					socket.emit('nextOn', {});
					break;
				case "nextOff": // nor should this one
					socket.emit('nextOff', {});
					break;
				case "itemAdd":
					socket.d.items.push(script[progress].data);
					break;
				case "itemRemove":
					socket.d.items.splice(socket.d.items.indexOf(script[progress].data));
					break;
				case "hp":
					socket.d.hp += script[progress].data;
					if (socket.d.hp <= 0) {
						socket.d.status = 0;
					}
					break;
				case "pause":
					progress++;
					setTimeout(story.run, script[progress].data * 1000, [io, socket]);
					break;
				case "function":
					script[progress].data(io, socket, story);

					progress++;
					story.run(io, socket);
					return true;
				default:
					console.log("INVALID SCRIPT OBJECT: " + script[progress].type);
					break;
			}

			if (progress == script.length - 1) {
				// END OF SCRIPT REACHED, GAME OVER
				return false;
			}

			if (script[progress].wait == true) {
				progress++;
				return true;
			}
			progress++;
		}
		return false;
	}
}

function processText(string, socket) {
	if (typeof string != "string") return string;
	return string.replace(/PLAYERNAME/g, socket.d.name).replace(/VAR_([^ ]+)/g, function(match, p1) {
		return socket.d[p1];
	});
}
