class Controller {
	static Init() {
		AR.SocketIO.socket.on("controller-start", function(x, y) {
			// console.log("start:", x, y);
		});

		AR.SocketIO.socket.on("controller-move", function(x, y) {
			var angle = Math.atan2(x, -y) / (Math.PI/180);

			if (angle < 0) {
				angle = 180 + angle + 180;
			}

			AR.RadialMenu.updateCursor(angle);
		});

		AR.SocketIO.socket.on("controller-end", function(x, y) {
			var angle = Math.atan2(x, -y) / (Math.PI/180);

			if (angle < 0) {
				angle = 180 + angle + 180;
			}

			AR.RadialMenu.click(angle);
		});

		AR.SocketIO.socket.on("controller-battery", function(level) {
			console.log("battery:", level);
		});
	}
}

AR.Controller = Controller;

Controller.Init();