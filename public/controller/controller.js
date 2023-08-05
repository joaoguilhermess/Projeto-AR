class Controller {
	static Init() {
		this.addFullscreen();

		this.addSocket();

		this.shift = false;
		this.agudo = false;
		this.agudoInverso = false;
		this.chapeu = false;
		this.tiu = false;

		this.addBattery();

		this.addKeyboard();

		this.addCursor();
	}

	static addFullscreen() {
		var context = this;

		document.documentElement.addEventListener("click", function() {
			if (!document.fullscreenElement) {
				// document.documentElement.requestFullscreen();
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

		this.update();

		var context = this;

		for (var i = 0; i < list.length; i++) {
			list[i].addEventListener("touchstart", function(event) {
				var key = event.target.textContent;

				if (key == "SHIFT") {
					context.toggleShift();
				} else if (key == "´") {
					context.toggleAgudo(true);
					context.toggleAgudoInverso(false);
					context.toggleChapeu(false);
					context.toggleTiu(false);
				} else if (key == "`") {
					context.toggleAgudo(false);
					context.toggleAgudoInverso(true);
					context.toggleChapeu(false);
					context.toggleTiu(false);
				} else if (key == "^") {
					context.toggleAgudo(false);
					context.toggleAgudoInverso(false);
					context.toggleChapeu(true);
					context.toggleTiu(false);
				} else if (key == "~") {
					context.toggleAgudo(false);
					context.toggleAgudoInverso(false);
					context.toggleChapeu(false);
					context.toggleTiu(true);
				} else {
					SocketIO.socket.emit("controller-keyboard", key);
				}

				context.update();
			});
		}
	}

	static toggleShift() {
		this.shift = !this.shift;
	}

	static toggleAgudo(value) {
		this.agudo = value;
	}

	static toggleAgudoInverso(value) {
		this.agudoInverso = value;
	}

	static toggleChapeu(value) {
		this.chapeu = value;
	}

	static toggleTiu(value) {
		this.tiu = value;
	}

	static update() {
		var list = document.querySelectorAll(".key");

		for (var i = 0; i < list.length; i++) {
			if (this.shift) {
				if (this.agudo) {
					if (list[i].getAttribute("agudoshift") != null) {
						list[i].textContent = list[i].getAttribute("agudoshift");
					} else {
						if (list[i].getAttribute("shift") != null) {
							list[i].textContent = list[i].getAttribute("shift");
						} else {
							list[i].textContent = list[i].getAttribute("key");
						}
					}
				} else if (this.agudoInverso) {
					if (list[i].getAttribute("agudoinversoshift") != null) {
						list[i].textContent = list[i].getAttribute("agudoinversoshift");
					} else {
						if (list[i].getAttribute("shift") != null) {
							list[i].textContent = list[i].getAttribute("shift");
						} else {
							list[i].textContent = list[i].getAttribute("key");
						}
					}
				} else if (this.chapeu) {
					if (list[i].getAttribute("chapeushift") != null) {
						list[i].textContent = list[i].getAttribute("chapeushift");
					} else {
						if (list[i].getAttribute("shift") != null) {
							list[i].textContent = list[i].getAttribute("shift");
						} else {
							list[i].textContent = list[i].getAttribute("key");
						}
					}
				} else if (this.tiu) {
					if (list[i].getAttribute("tiushift") != null) {
						list[i].textContent = list[i].getAttribute("tiushift");
					} else {
						if (list[i].getAttribute("shift") != null) {
							list[i].textContent = list[i].getAttribute("shift");
						} else {
							list[i].textContent = list[i].getAttribute("key");
						}
					}
				} else {
					if (list[i].getAttribute("shift") != null) {
						list[i].textContent = list[i].getAttribute("shift");
					} else {
						list[i].textContent = list[i].getAttribute("key");
					}
				}
			} else {
				if (this.agudo) {
					if (list[i].getAttribute("agudo") != null) {
						list[i].textContent = list[i].getAttribute("agudo");
					} else {
						list[i].textContent = list[i].getAttribute("key");
					}
				} else if (this.agudoInverso) {
					if (list[i].getAttribute("agudoinverso") != null) {
						list[i].textContent = list[i].getAttribute("agudoinverso");
					} else {
						list[i].textContent = list[i].getAttribute("key");
					}
				} else if (this.chapeu) {
					if (list[i].getAttribute("chapeu") != null) {
						list[i].textContent = list[i].getAttribute("chapeu");
					} else {
						list[i].textContent = list[i].getAttribute("key");
					}
				} else if (this.tiu) {
					if (list[i].getAttribute("tiu") != null) {
						list[i].textContent = list[i].getAttribute("tiu");
					} else {
						list[i].textContent = list[i].getAttribute("key");
					}
				} else {
					list[i].textContent = list[i].getAttribute("key");
				}
			}
		}
	}

	static addCursor() {
		var context = this;

		this.cursor = false;

		document.documentElement.addEventListener("touchstart", function(event) {
			if (!event.target.classList.contains("key")) {
				context.cursor = true;

				event.preventDefault();

				var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
				var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

				SocketIO.socket.emit("controller-start", x, y);
				
				context.pX = x;
				context.pY = y;
			} else {
				context.cursor = false;
			}
		});

		document.documentElement.addEventListener("touchmove", function(event) {
			if (context.cursor) {
				event.preventDefault();

				var y = (event.touches[0].pageY/window.innerHeight - 0.5) * 2;
				var x = (event.touches[0].pageX/window.innerWidth - 0.5) * 2;

				SocketIO.socket.emit("controller-move", x, y);

				context.pX = x;
				context.pY = y;
			}
		});

		document.documentElement.addEventListener("touchend", function(event) {
			if (context.cursor) {
				SocketIO.socket.emit("controller-end", context.pX, context.pY);

				context.cursor = false;
			}
		});
	}
}

Controller.Init();