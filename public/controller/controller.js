document.documentElement.addEventListener("click", function() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	}
});

SocketIO.socket.on("connect", function() {	
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

		document.body.textContent = "start: " + x.toFixed(2) + "/" + y.toFixed(2);

		pX = x;
		pY = y;
	});

	document.documentElement.addEventListener("touchmove", function(event) {
		event.preventDefault();

		var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
		var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

		SocketIO.socket.emit("controller-move", x, y);

		document.body.textContent = "move: " + x.toFixed(2) + "/" + y.toFixed(2);

		pX = x;
		pY = y;
	});

	document.documentElement.addEventListener("touchend", function(event) {
		SocketIO.socket.emit("controller-end", pX, pY);

		document.body.textContent = "end: " + pX.toFixed(2) + "/" + pY.toFixed(2);
	});

	navigator.getBattery().then(function(battery) {
		SocketIO.socket.emit("controller-battery", battery.level);

		battery.addEventListener("levelchange", function(event) {
			SocketIO.socket.emit("controller-battery", battery.level);
		});
	});
});