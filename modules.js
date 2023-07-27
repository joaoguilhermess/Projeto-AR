import Server from "./server.js";
import Util from "./util.js";

export default class Modules {
	static Init() {
		var context = this;

		Server.registryScript("/modules", function(req, res) {
			var files = context.getModules();

			var list = [];

			for (var i = 0; i < files.length; i++) {
				if (Util.verifyPath(Util.joinPath("./modules", files[i], "index.js"))) {
					list.push(files[i]);
				}
			}

			res.send(list);
		});

		Server.registryScript("/modules/*", function(req, res) {
			var args = decodeURI(req.url).split("/");

			var file = Util.joinPath("./modules/" + args[2], args[3]);

			if (Util.verifyPath(file)) {
				res.sendFile(Util.resolvePath(file));
			} else {
				res.sendStatus(404);
			}
		});

		this.InitModules();
	}

	static async InitModules() {
		var files = this.getModules();

		for (var i = 0; i < files.length; i++) {
			var path = Util.joinPath("./modules", files[i], "main.js");

			if (Util.verifyPath(path)) {
				var file = await import("./" + path);

				try {
					file.Init();
				} catch {}
			}
		}
	}

	static getModules() {
		var list = Util.readFolder("./modules");

		var order = {
			enabled: [],
			disabled: []
		};

		if (Util.verifyPath("./order.json")) {
			try {
				order = Util.readJSON("./order.json");
			} catch {}
		}

		for (var i = 0; i < list.length; i++) {
			if (!order.enabled.includes(list[i]) && !order.disabled.includes(list[i])) {
				order.enabled.push(list[i]);
			}
		}

		for (var i = 0; i < order.enabled.length; i++) {
			if (!list.includes(order.enabled[i])) {
				order.enabled.splice(i, 1);
			}
		}

		for (var i = 0; i < order.disabled.length; i++) {
			if (!list.includes(order.disabled[i])) {
				order.disabled.splice(i, 1);
			}
		}

		if (Util.verifyPath("./order.json")) {
			if (Util.readJSON("./order.json") != order) {
				Util.writeJSON("./order.json", order);
			}
		} else {
			Util.writeJSON("./order.json", order);
		}

		return order.enabled;
	}
}