var camera = new THREE.PerspectiveCamera(102.5, window.innerWidth/window.innerHeight, 0.01, 100);

camera.position.set(0, 0, 0);

camera.lookAt(0, 0, 0);

window.addEventListener("resize", function() {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	AR.Renderer.setSize(window.innerWidth, window.innerHeight);
});

AR.Scene.add(camera);

AR.Camera = camera;