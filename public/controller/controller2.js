document.documentElement.addEventListener("click", function() {

var one = false;

SocketIO.socket.on("connect", function() {	
	if (one) {
		return
	} else {
		one = true;
	}

	SocketIO.socket.emit("registry", "controller-start");
	SocketIO.socket.emit("registry", "controller-move");
	SocketIO.socket.emit("registry", "controller-end");
	SocketIO.socket.emit("registry", "controller-battery");

	var pX;
	var pY;

	document.documentElement.addEventListener("touchstart", function(event) {
		event.preventDefault();

		var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
		var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

		SocketIO.socket.emit("controller-start", x, y);

		pX = x;
		pY = y;
	});

	document.documentElement.addEventListener("touchmove", function(event) {
		event.preventDefault();

		var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
		var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

		SocketIO.socket.emit("controller-move", x, y);

		pX = x;
		pY = y;
	});

	document.documentElement.addEventListener("touchend", function(event) {
		SocketIO.socket.emit("controller-end", pX, pY);
	});

	navigator.getBattery().then(function(battery) {
		SocketIO.socket.emit("controller-battery", battery.level);

		battery.addEventListener("levelchange", function(event) {
			SocketIO.socket.emit("controller-battery", battery.level);
		});

		setInterval(function() {
			SocketIO.socket.emit("controller-battery", battery.level);
		}, 1000 * 10);
	});
});