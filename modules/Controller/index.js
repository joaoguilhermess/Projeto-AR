class Controller {
	static Init() {
		this.addKeyboard();
		
		this.addCursor();

		this.addBattery();
	}

	static addKeyboard() {
		AR.SocketIO.socket.on("controller-keyboard", function(key) {
			console.log(key);
		});
	}

	static addCursor() {
		AR.SocketIO.socket.on("controller-start", function(x, y) {
			if (Math.max(x, y) < 0.25) {
				AR.RadialMenu.toggle();
			}
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
			
			AR.RadialMenu.toggle();
		});
	}

	static addBattery() {
		var item;

		AR.SocketIO.socket.on("controller-battery", function(level) {
			if (!item) {
				item = new AR.LeftItem();

				item.setTitle("Controller:");
			}

			item.setText(Math.round(level * 100) + "%");
		});
	}
}

AR.Controller = Controller;

Controller.Init();