import path from "path";
import url from "url";
import fs from "fs";

export default class Util {
	static joinPath(...args) {
		return path.join(...args);
	}

	static resolvePath(...args) {
		return this.joinPath(path.dirname(url.fileURLToPath(import.meta.url)), this.joinPath(...args));
	}

	static verifyPath(path) {
		return fs.existsSync(path);
	}

	static readFile(path) {
		return fs.readFileSync(path);
	}

	static readFolder(path) {
		return fs.readdirSync(path);
	}

	static readStream(path) {
		return fs.createReadStream(path);
	}

	static writeStream(path) {
		return fs.createWriteStream(path);
	}

	static readJSON(path) {
		return JSON.parse(fs.readFileSync(path).toString());
	}

	static writeJSON(path, content) {
		return fs.writeFileSync(path, JSON.stringify(content, null, "\t"));
	}

	static createFolder(path) {
		return fs.mkdirSync(path);
	}
}