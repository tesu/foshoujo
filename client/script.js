var socket = new io.connect();

var ready = true;
var dialog = '';

socket.on('ready', function(){
	$("body").css("visibility", "visible");
	$("#pregame").css("display", "block"); 
	$("#serverstatus").text("Waiting for host to start");
});

socket.on('readyspec', function(){
	$("body").css("visibility", "visible");
	$("#serverstatus").text("Spectating");
});

socket.on('disconnect', function(){
	$("#serverstatus").text("Disconnected");
});

socket.on('gamestart', function() {
	socket.emit('gamestart', {});
	$('#pregame').css("display", "none");
	$("#serverstatus").text("In-game");
});

socket.on('admincommand', function() {
	$("#admincommands").css("display", "block");
});

socket.on('usersonline', function(data){
	$("#usersonline").html("");
	for (var i = 0; i < data.array.length; i++) {
		$("#usersonline").append("<li>" + data.array[i] + "</li>");
	}
});

socket.on('namechangesuccess', function(){
	$('#pregame').css("display", "none");
});

socket.on('error', function(data){
	alert(data.message); // make this nicer later
	console.log(data);
});

socket.on('chat', function(data){
	$("#chatbox").append("<b>" + data.user + "</b>: " + data.message + "<br />");
	$("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
});

socket.on('changeBG', function(data){
	$("#content").css("background-image", "url(bg.png?q=" + data.message + ")"); // redo this later
});

socket.on('changeMusic', function(data){
	if(data.message != "") {
		$("#bgmusic").css("display", "block");
		$("#bgmusic").prop("src", "http://www.youtube.com/embed/" + data.message + "?autoplay=1&loop=1&rel=0");
	} else {
		$("#bgmusic").css("display", "none");
		$("#bgmusic").prop("src", "");
	}
})

socket.on('changeSpeaker', function(data){
	if (data.message != '') {
		$("#speaker").css("display", "block");
		$("#speaker").text(data.message);
	} else {
		$("#speaker").css("display", "none");
	}
});

socket.on('changeDialog', function(data){
	$("#nextbutton").css("display", "none");
	ready = false;
	$("#dialog").text("");
	dialog = data.message;
	var charcount = 0;
	var timer;

	(function animateType() {
		timer = setTimeout(function() {
			if ($("#dialog").text() == dialog) {
				clearTimeout(timer);
				$("#nextbutton").css("display", "block");
				ready = true;
				return;
			}

			charcount++;
			$("#dialog").text(dialog.substr(0, charcount));
			animateType();

			if (charcount == dialog.length) {
				clearTimeout(timer);
				$("#nextbutton").css("display", "block");
				ready = true;
				return;
			}
			return;
		}, 50)
	}());
});

socket.on('buttonOn', function(data){
	$("#button" + data.id).css("display", "block");
	$("#button" + data.id).text = data.message;
})

socket.on('buttonOff', function(data){
	$("#button" + data.id).css("display", "none");
})

/*socket.on('nextOn', function(data){
	$("#nextbutton").css("display", "block");
})

socket.on('nextOff', function(data){
	$("#nextbutton").css("display", "none");
})*/

$("document").ready(function(){
	$(document).keypress(function(e){
		if($(e.target).is('input, textarea, select')) return;

		if(e.charCode == 13 || e.keyCode == 13 || e.which == 13 || e.charCode == 32 || e.keyCode == 32 || e.which == 32) {
			if (ready) {
				socket.emit('next', {});
			} else {
				$("#dialog").text(dialog)
				ready = true;
			}
		}
		return;
	})

	$("#chatinput").keydown(function(e){
		if(e.charCode == 13 || e.keyCode == 13 || e.which == 13) {
			socket.emit('chat', {'message': $('#chatinput').val()});
			$("#chatinput").val('');
		}
		return;
	});

	$("#nameinput").keydown(function(e){
		if(e.charCode == 13 || e.keyCode == 13 || e.which == 13) {
			socket.emit('namechange', {'message': $('#nameinput').val()});
			$("#nameinput").val('');
		}
		return;
	});

	$("#admincommands").keydown(function(e){
		if(e.charCode == 13 || e.keyCode == 13 || e.which == 13) {
			socket.emit('admincommand', {'message': $('#admincommands').val()});
			$("#admincommands").val('');
			$('#admincommands').blur();
			return;
		}
	});

	$("#button1").click(function(e){
		socket.emit('button', {'id': 1});
	});
	$("#button2").click(function(e){
		socket.emit('button', {'id': 2});
	});
	$("#button3").click(function(e){
		socket.emit('button', {'id': 3});
	});
	$("#button4").click(function(e){
		socket.emit('button', {'id': 4});
	});
	$("#button5").click(function(e){
		socket.emit('button', {'id': 5});
	});
	$("#button6").click(function(e){
		socket.emit('button', {'id': 6});
	});
	$("#button7").click(function(e){
		socket.emit('button', {'id': 7});
	});
	$("#button8").click(function(e){
		socket.emit('button', {'id': 8});
	});
	$("#button9").click(function(e){
		socket.emit('button', {'id': 9});
	});
	$("#button10").click(function(e){
		socket.emit('button', {'id': 10});
	});
	$("#nextbutton").click(function(e){
		socket.emit('next', {});
	});
});