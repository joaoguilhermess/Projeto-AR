class Log {
	static Init() {
		this.addLog();

		this.addSocket();
	}

	static addLog() {
		this.log = document.querySelector(".log");
	}

	static addSocket() {
		var context = this;

		SocketIO.socket.on("log-log", function(...args) {
			context.write(args);
		});

		SocketIO.socket.on("log-error", function(...args) {
			context.write(args);
		});
	}

	static write(content) {
		for (var i = 0; i < content.length; i++) {
			content[i] = JSON.stringify(content[i], null, "\t");

			this.log.textContent += content[i] + " ";
		}

		this.log.textContent += "\n";

		this.log.scrollTop = this.log.scrollHeight;
	}
}

Log.Init();