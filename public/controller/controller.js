class Controller {
	static Init() {
		this.addFullscreen();

		this.addSocket();

		this.shift = true;

		this.addBattery();

		this.addKeyboard();

		this.toggleShift();

		this.addCursor();
	}

	static addFullscreen() {
		var context = this;

		document.documentElement.addEventListener("click", function() {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();

				context.toggleCursor();
			}
		});
	}

	static addSocket() {
		var one = false;

		var context = this;

		SocketIO.socket.on("connect", function() {
			if (one) {
				return
			} else {
				one = true;
			}

			SocketIO.socket.emit("registry", "controller-battery");
			SocketIO.socket.emit("registry", "controller-keyboard");
			SocketIO.socket.emit("registry", "controller-start");
			SocketIO.socket.emit("registry", "controller-move");
			SocketIO.socket.emit("registry", "controller-end");
		});
	}

	static addBattery() {
		navigator.getBattery().then(function(battery) {
			SocketIO.socket.emit("controller-battery", battery.level);

			battery.addEventListener("levelchange", function(event) {
				SocketIO.socket.emit("controller-battery", battery.level);
			});

			setInterval(function() {
				SocketIO.socket.emit("controller-battery", battery.level);
			}, 1000 * 5);
		});
	}

	static addKeyboard() {
		var list = document.querySelectorAll(".key");

		var context = this;

		for (var i = 0; i < list.length; i++) {
			list[i].addEventListener("touchstart", function(event) {
				var key = event.target.textContent;

				if (key == "SHIFT") {
					context.toggleShift();
				} else {
					SocketIO.socket.emit("controller-keyboard", key);
				}
			});
		}
	}

	static toggleShift() {
		var list = document.querySelectorAll(".key");

		this.shift = !this.shift;

		for (var i = 0; i < list.length; i++) {
			if (this.shift) {
				if (list[i].getAttribute("shift") != null) {
					list[i].textContent = list[i].getAttribute("shift");
				}
			} else {
				list[i].textContent = list[i].getAttribute("key");
			}
		}
	}

	static addCursor() {
		var context = this;

		this.cursor = false;

		document.documentElement.addEventListener("touchstart", function(event) {
			if (!event.target.classList.includes("key")) {
				this.cursor = true;

				event.preventDefault();

				var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
				var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

				SocketIO.socket.emit("controller-start", x, y);
				
				context.pX = x;
				context.pY = y;
			} else {
				this.cursor = false;
			}
		});

		document.documentElement.addEventListener("touchmove", function(event) {
			if (this.cursor) {
				event.preventDefault();

				var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
				var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

				SocketIO.socket.emit("controller-move", x, y);

				context.pX = x;
				context.pY = y;
			}
		});

		document.documentElement.addEventListener("touchend", function(event) {
			if (this.cursor) {
				SocketIO.socket.emit("controller-end", context.pX, context.pY);
			}
		});
	}
}

Controller.Init();