class RadialMenu {
	static Init() {
		this.addParent();

		this.addBackground();
	}

	static addParent() {
		var parent = new THREE.Group();

		AR.Scene.add(parent);

		parent.position.set(0, 0, -0.8);

		this.parent = parent;
	}

	static addBackground() {
		var shape = new THREE.Shape();

		var t = 64;

		var r = 0.5/2;

		for (var i = 0; i <= t; i++) {
			shape.lineTo(Math.sin(RAD * i * 360/t) * r, Math.cos(RAD * i * 360/t) * r);
		}

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Background,
			transparent: true,
			opacity: 0.2
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, 0, -0.01);

		this.parent.add(mesh);
	}
}

AR.RadialMenu = RadialMenu;

RadialMenu.Init();