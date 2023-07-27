class Controller {
	static Init() {
		AR.SocketIO.socket.on("controller-start", function(x, y) {
			console.log("start:", x, y);
		});

		AR.SocketIO.socket.on("controller-move", function(x, y) {
			console.log("move:", x, y);

			var angle = Math.atan2(x, -y) / (Math.PI/180);

			console.log("angle:", angle);
		});

		AR.SocketIO.socket.on("controller-end", function(x, y) {
			console.log("end:", x, y);
		});

		AR.SocketIO.socket.on("controller-battery", function(level) {
			console.log("battery:", level);
		});
	}
}

AR.Controller = Controller;

Controller.Init();