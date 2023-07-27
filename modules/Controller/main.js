import Server from "../../server.js";
import Util from "../../util.js";

export function Init() {
	Server.registryFile("/controller", Util.resolvePath("public", "controller", "index.html"));
}