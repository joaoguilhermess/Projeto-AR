import Server from "../../server.js";
import Util from "../../util.js";

export function Init() {
	Server.registryFile("/viewer", Util.resolvePath("resources", "viewer", "profile.png"));
}