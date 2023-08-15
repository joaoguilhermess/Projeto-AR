import Server from "../../server.js";
import Util from "../../util.js";

export function Init() {
	Server.registryFile("/log", Util.resolvePath("public", "log", "index.html"));
}