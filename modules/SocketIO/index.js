class SocketIO {
	static Init() {
		var socket = io();

		socket.on("registry", function(type) {
			console.log("registry", type);
		});

		socket.on("unregistry", function(type) {
			console.log("unregistry", type);
		});

		this.socket = socket;
	}
}

SocketIO.Init();

if (window.AR) {
	AR.SocketIO = SocketIO;
}