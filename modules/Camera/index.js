class Camera {
	static Init() {
		var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.01, 100);

		camera.position.set(0, 0, 0);

		camera.lookAt(0, 0, 0);

		window.addEventListener("resize", function() {
			camera.aspect = window.innerWidth/window.innerHeight;
			camera.updateProjectionMatrix();

			AR.Renderer.setSize(window.innerWidth, window.innerHeight);
		});

		AR.Scene.add(camera);
		
		AR.Camera = camera;
	}
}

Camera.Init();