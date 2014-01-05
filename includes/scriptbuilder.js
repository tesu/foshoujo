function scriptBuilder() {
	this.output = new Object();
	this.output.script = [];
	this.output.settings = new Object();
}

scriptBuilder.prototype.text = function(data, wait) {
	wait = typeof wait !== "undefined" ? wait : true;
	this.output.script.push({'type': 'text', 'data': data, 'wait': wait});
}

scriptBuilder.prototype.speaker = function(data, wait) {
	wait = typeof wait !== "undefined" ? wait : false;
	this.output.script.push({'type': 'speaker', 'data': data, 'wait': wait});
}

scriptBuilder.prototype.music = function(data, wait) {
	wait = typeof wait !== "undefined" ? wait : false;
	this.output.script.push({'type': 'music', 'data': data, 'wait': wait});
}

scriptBuilder.prototype.buttonOn = function(data, id, wait) {
	wait = typeof wait !== "undefined" ? wait : false;
	if (data == "next") {
		this.output.script.push({'type': 'nextOn', 'wait': wait});
	} else {
		this.output.script.push({'type': 'buttonOn', 'data': data, 'wait': wait});
	}
}

scriptBuilder.prototype.buttonOff = function(data, id, wait) {
	wait = typeof wait !== "undefined" ? wait : false;
	if (data == "next") {
		this.output.script.push({'type': 'nextOff', 'wait': wait});
	} else {
		this.output.script.push({'type': 'buttonOff', 'data': data, 'wait': wait});
	}
}

scriptBuilder.prototype.changeBG = function(data, wait) {
	wait = typeof wait !== "undefined" ? wait : false;
	this.output.script.push({'type': 'background', 'data': data, 'wait': wait})
}

module.exports = new scriptBuilder();