class RightMenu {
	constructor() {
		this.x = 0.045;

		this.buttons = [];

		this.addParent();

		this.addBackground();
	}

	addParent() {
		var parent = new THREE.Group();

		parent.position.set(0.1, 0, -0.25);

		AR.Camera.add(parent);

		this.parent = parent;
	}

	toggle() {
		this.parent.visible = !this.parent.visible;
	}

	addBackground() {
		var shape = new THREE.Shape();

		var y = (this.buttons.length + 2) * 0.007;

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

	addButton(button) {
		button.slot = this.buttons.length;

		this.buttons.push(button);

		this.removeBackground();
		this.addBackground();
	}
}

AR.RightMenu = RightMenu;