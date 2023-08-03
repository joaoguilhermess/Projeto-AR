import Server from "../../server.js";
import Util from "../../util.js";
import fetch from "node-fetch";

export function Init() {
	Server.registryScript("/proxy/*", async function(req, res) {
		var args = decodeURI(req.url).split("/").slice(2).join("/");

		var c = new AbortController();

		var f = await fetch(args, {signal: c.signal});

		f.body.pipe(res);

		res.on("end", function() {
			c.abort();
		});
	});
}