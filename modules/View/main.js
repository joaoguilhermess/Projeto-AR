import Server from "../../server.js";
import Util from "../../util.js";

export function Init() {
	Server.registryPostScript("/photos", async function(req, res) {
		fixFolder();

		var d = new Date(Date.now());

		var name = format(d.getFullYear(), 4) + format(d.getMonth()) + format(d.getDate()) + "_" + format(d.getHours()) + format(d.getMinutes()) + format(d.getSeconds()) + ".png";

		var path = Util.joinPath("./", "resources", "photos", name);

		var stream = Util.writeStream(path);

		req.pipe(stream);
	});
}

function fixFolder() {
	var path = Util.joinPath("./", "resources", "photos");

	if (!Util.verifyPath(path)) {
		Util.createFolder(path);
	}
}

function format(str, length = 2) {
	str = str.toString();

	while (str.length < length) {
		str = "0" + str;
	}

	return str
}