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
		this.Focus();

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
			context.focus({
				type: "end",
				x: x,
				y: y
			});

			if (x < -1/3*2 && y < 0) {
				context.Focus();
			}
		});
	}

	static Focus() {
		this.setFocus(function(...args) {AR.RadialMenu.input(...args)});

		if (this.unFocus) {
			this.unFocus();
		}
	}

	static setFocus(callback) {
		this.focus = callback;

		this.focus({});
	}

	static setUnFocus(callback) {
		this.unFocus = callback;
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