class Controller {
	static Init() {
		this.addKeyboard();
		
		this.addCursor();

		this.addBattery();
	}

	static addKeyboard() {
		var context = this;

		AR.SocketIO.socket.on("controller-keyboard", function(key) {
			context.focus({
				type: "key",
				key: key
			});
		});
	}

	static addCursor() {
		this.setFocus(function(...args) {AR.RadialMenu.input(...args)});

		var context = this;

		AR.SocketIO.socket.on("controller-start", function(x, y) {
			context.focus({
				type: "start",
				x: x,
				y: y
			});
		});

		AR.SocketIO.socket.on("controller-move", function(x, y) {
			context.focus({
				type: "move",
				x: x,
				y: y
			});
		});

		AR.SocketIO.socket.on("controller-end", function(x, y) {
			var d = Math.sqrt(x*x + y*y);

			if (d < 0.25) {
				context.setFocus(function(...args) {AR.RadialMenu.input(...args)});
			} else {
				context.focus({
					type: "end",
					x: x,
					y: y
				});
			}
		});
	}

	static setFocus(callback) {
		this.focus = callback;
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