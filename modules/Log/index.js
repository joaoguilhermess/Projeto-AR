class Log {
	static Init() {
		AR.SocketIO.socket.emit("registry", "log-log");
		AR.SocketIO.socket.emit("registry", "log-error");
	
		var original = {
			log: console.log,
			error: console.error
		};

		console.log = function(...args) {
			original.log(...args);

			AR.SocketIO.socket.emit("log-log", ...args);
		}

		console.error = function(...args) {
			original.error(...args);

			AR.SocketIO.socket.emit("log-error", ...args);
		}

		this.original = original;
	}
}

AR.Log = Log;

Log.Init();