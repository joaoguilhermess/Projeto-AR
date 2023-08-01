class LeftMenu {
	static Init() {
		this.x = 0.35;

		this.items = [];

		this.addParent();

		this.addBackground();
	}

	static addParent() {
		var parent = new THREE.Group();

		parent.position.set(-1.8, 0, -0.8);

		AR.Camera.add(parent);

		this.parent = parent;
	}

	static addBackground() {
		var shape = new THREE.Shape();

		var y = (this.items.length) * 0.07;

		shape.lineTo(this.x, 0);
		shape.lineTo(this.x, -y);
		shape.lineTo(0, -y);

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Background,
			transparent: true,
			opacity: 0.8
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, 0, -0.01);

		// this.parent.position.y = y/2;

		this.parent.add(mesh);

		this.background = mesh;
	}

	static removeBackground() {
		this.parent.remove(this.background);

		this.background.geometry.dispose();

		this.background.material.dispose();
	}

	static addItem(item) {
		item.slot = this.items.length;
		
		this.items.push(item);

		this.removeBackground();
		this.addBackground();
	}
}

AR.LeftMenu = LeftMenu;

LeftMenu.Init();