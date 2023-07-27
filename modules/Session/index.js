navigator.xr.isSessionSupported("immersive-vr").then(function(status) {
	if (status) {
		document.body.addEventListener("click", async function() {
			if (!AR.Session) {
				var session = await navigator.xr.requestSession("immersive-vr");

				AR.Renderer.xr.setSession(session);

				AR.Session = session;
			}
		});
	}
});