class Controller {
	static Init() {
		this.addFullscreen();

		this.addSocket();

		this.addBattery();

		this.addCallback();

		this.shift = true;

		this.toggleKeys();
	}

	static addFullscreen() {
		document.documentElement.addEventListener("click", function() {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
			}
		});
	}

	static toggleKeyboard() {
		var keyboard = document.querySelector(".keyboard");

		if (keyboard.style.display != "flex") {
			keyboard.style.display = "flex";
		} else {
			keyboard.style.display = "none";
		}
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

			context.toggleKeyboard();

			SocketIO.socket.emit("registry", "controller-keyboard");
			SocketIO.socket.emit("registry", "controller-battery");
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
			}, 1000 * 10);
		});
	}

	static addCallback() {
		var list = document.querySelectorAll(".key");

		var context = this;

		for (var i = 0; i < list.length; i++) {
			// list[i].onclick = function(event) {
			list[i].ontouchstart = function(event) {
				var key = event.target.textContent;

				if (key == "SHIFT") {
					context.toggleKeys();
				} else {
					SocketIO.socket.emit("controller-keyboard", key);
				}
			};
		}
	}

	static toggleKeys() {
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
}

Controller.Init();