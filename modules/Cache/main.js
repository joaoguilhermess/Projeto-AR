import Server from "../../server.js";
import Util from "../../util.js";
import fetch from "node-fetch";

export function Init() {
	Server.registryScript("/cache/*", async function(req, res) {
		fixFolder();

		var args = decodeURI(req.url).split("/").slice(2).join("/");

		var path = Util.joinPath("./", "resources", "cache", Buffer.from(args).toString("hex"));

		var args2 = args.split(".");

		var extension = args2[args2.length -1];

		if (Util.verifyPath(path)) {
			var stream = Util.readStream(path);

			res.type(extension);

			stream.pipe(res);
		} else {
			var c = new AbortController();

			var f = await fetch(args, {signal: c.signal});

			var stream = Util.writeStream(path);

			f.body.pipe(stream);

			res.type(extension);

			f.body.pipe(res);

			res.on("end", function() {
				c.abort();
			});
		}
	});
}

function fixFolder() {
	var path = Util.joinPath("./", "resources", "cache");

	if (!Util.verifyPath(path)) {
		Util.createFolder(path);
	}
}