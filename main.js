import Server from "./server.js";
import Util from "./util.js";
import Modules from "./modules.js";

class Main {
	static Init() {
		Server.Init(3000, function() {
			console.log("Ready");
		});

		Server.registryFile("/", Util.resolvePath("public", "index.html"));

		Server.registryFolder("/public");
		Server.registryFolder("/resources");

		Modules.Init();
	}
}

Main.Init();