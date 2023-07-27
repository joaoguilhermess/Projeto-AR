class RadialMenu {
	static Init(d) {
		this.r = d/2;

		this.t = 8;
		this.t2 = 8;
		this.t3 = this.t * this.t2;

		this.a = 360/this.t3;

		this.buttons = [];

		this.addParent();

		this.addBackground();
	}

	static addParent() {
		var parent = new THREE.Group();

		parent.visible = false;

		AR.Scene.add(parent);

		parent.position.set(0, 0, -0.8);

		this.parent = parent;
	}

	static addBackground() {
		var shape = new THREE.Shape();

		for (var i = 0; i <= this.t3; i++) {
			shape.lineTo(Math.sin(RAD * i * this.a) * this.r, Math.cos(RAD * i * this.a) * this.r);
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

	static toggle() {
		this.parent.visible = !this.parent.visible;
	}

	static addButton(button) {
		button.slot = this.buttons.length;

		this.buttons.push(button);
	}

	static updateCursor(angle) {
		var slot = Math.floor(angle/(this.a * this.t));

		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].setHover(false);
		}

		if (this.buttons[slot]) {
			var button = this.buttons[slot];

			button.setHover(true);
		}
	}

	static click(angle) {
		if (!this.parent.visible) {
			return;
		}
		var slot = Math.floor(angle/(this.a * this.t));

		if (this.buttons[slot]) {
			var button = this.buttons[slot];

			button.toggle();
		}
	}
}

AR.RadialMenu = RadialMenu;

RadialMenu.Init(0.5);