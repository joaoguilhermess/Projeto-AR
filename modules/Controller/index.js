class Controller {
	static Init() {
		this.addStart();
		
		this.addKeyboard();

		this.addBattery();
	}

	static addKeyboard() {
		AR.SocketIO.socket.on("controller-keyboard", function(key) {
			console.log(key);
		});
	}

	static addStart() {
		AR.SocketIO.socket.on("controller-start", function(x, y) {
			AR.RadialMenu.toggle();
		});
	}

	static addMove() {
		AR.SocketIO.socket.on("controller-move", function(x, y) {
			var angle = Math.atan2(x, -y) / (Math.PI/180);

			if (angle < 0) {
				angle = 180 + angle + 180;
			}

			AR.RadialMenu.updateCursor(angle);
		});
	}

	static addEnd() {
		AR.SocketIO.socket.on("controller-end", function(x, y) {
			var angle = Math.atan2(x, -y) / (Math.PI/180);

			if (angle < 0) {
				angle = 180 + angle + 180;
			}

			AR.RadialMenu.click(angle);
			
			AR.RadialMenu.toggle();
		});
	}

	static addBattery() {
		var item = new AR.LeftItem();

		item.setTitle("Controller:");

		AR.SocketIO.socket.on("controller-battery", function(level) {
			item.setText(level * 100 + "%");
		});
	}
}

AR.Controller = Controller;

Controller.Init();