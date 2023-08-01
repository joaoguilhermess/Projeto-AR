async function InitModules() {
	var f = await fetch("/modules");

	var list = await f.json();

	for (var i = 0; i < list.length; i++) {
		try {
			await import("/modules/" + list[i] + "/index.js");
		} catch (e) {
			console.error(e);
		}
	}
}

InitModules();