import express from "express";
import https from "https";
import Util from "./util.js";

export default class Server {
	static Init(port, callback) {
		var app = express();

		var server = https.createServer({
			key: Util.readFile(Util.joinPath("credentials", "private.key")),
			cert: Util.readFile(Util.joinPath("credentials", "certificate.pem"))
		}, app);

		server.listen(port, callback);

		this.app = app;

		this.server = server;
	}

	static registryScript(path, script) {
		this.app.get(path, script);
	}

	static registryPostScript(path, script) {
		this.app.post(path, script);
	}

	static registryFile(path, file) {
		this.app.get(path, function(req, res) {
			res.sendFile(file);
		});
	}

	static registryFolder(path) {
		this.app.get(path + "/*", function(req, res) {
			var args = decodeURI(req.url).split("/");

			var file = Util.joinPath("." + path, args.slice(2).join("/"));

			if (Util.verifyPath(file)) {
				res.sendFile(Util.resolvePath(file));
			} else {
				res.sendStatus(404);
			}
		});
	}
}