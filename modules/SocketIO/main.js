import {Server as IO} from "socket.io";
import Server from "../../server.js";

class SocketIO {
	static Init() {
		var io = new IO(Server.server);

		var registered = [];

		var context = this;

		io.on("connection", function(socket) {
			socket.registered = [];

			for (var i = 0; i < registered.length; i++) {
				socket.emit("registry", registered[i]);
			}

			socket.on("registry", function(type) {
				socket.registered.push(type);

				registered.push(type);

				socket.on(type, function(...args) {
					socket.broadcast.emit(type, ...args);
				});

				socket.broadcast.emit("registry", type);
			});

			socket.on("disconnecting", function() {
				for (var i = 0; i < socket.registered.length; i++) {
					registered.splice(registered.indexOf(socket.registered[i]), 1);

					socket.broadcast.emit("unregistry", socket.registered[i]);
				}
			});
		});

		this.io = io;
		this.registered = registered;
	}
}

export function Init() {
	SocketIO.Init();
}