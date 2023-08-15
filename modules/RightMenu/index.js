class RightMenu {
	constructor() {
		this.x = 0.045;

		this.items = [];

		this.addParent();

		this.addBackground();
	}

	addParent() {
		var parent = new THREE.Group();

		parent.position.set(0.1, 0, -0.25);

		AR.Camera.add(parent);

		this.parent = parent;
	}

	addBackground() {
		var shape = new THREE.Shape();

		var y = (this.items.length + 1) * 0.01;

		shape.lineTo(-this.x, 0);
		shape.lineTo(-this.x, -y);
		shape.lineTo(0, -y);

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Background,
			transparent: true,
			opacity: 0.8
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.renderOrder = -1;

		this.parent.add(mesh);

		this.background = mesh;
	}

	removeBackground() {
		this.parent.remove(this.background);

		this.background.geometry.dispose();

		this.background.material.dispose();
	}

	addItem(item) {
		item.slot = this.items.length;

		this.items.push(item);

		this.removeBackground();
		this.addBackground();
	}

	setActive(item, active) {
		if (this.active) {
			this.active.setActive(false);
		}

		item.setActive(true);

		this.active = item;
	}
}

AR.RightMenu = RightMenu;