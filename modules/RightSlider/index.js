class RightSlider {
	constructor(menu) {
		this.menu = menu;

		this.menu.addItem(this);

		this.y = 0.01;

		this.active = false;

		this.addParent();

		this.addBorder();

		this.addTitle();

		this.addText();
	}

	addParent() {
		var parent = new THREE.Group();

		parent.position.set(0, (this.slot + 1) * -this.y, 0);

		this.menu.parent.add(parent);

		this.parent = parent;
	}

	addBorder() {
		var shape = new THREE.Shape();

		var x = this.y/10;

		shape.moveTo(-x, this.y/2);

		shape.lineTo(0, this.y/2);

		shape.lineTo(0, -this.y/2);

		shape.lineTo(-x, -this.y/2);

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.BackgroundLight
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(-this.menu.x, 0, 0);

		this.parent.add(mesh);

		this.border = mesh;
	}

	setHover(hover) {
		if (hover) {
			this.border.material.color.setHex(AR.Palette.BackgroundDark);
		} else {
			if (this.active) {
				this.border.material.color.setHex(AR.Palette.Primary);
			} else {
				this.border.material.color.setHex(AR.Palette.BackgroundLight);
			}
		}
	}

	setActive(active) {
		this.active = active;

		if (this.active) {
			this.border.material.color.setHex(AR.Palette.Primary);
		} else {
			this.border.material.color.setHex(AR.Palette.BackgroundLight);
		}
	}

	addTitle() {
		var text = new TroikaText();

		text.fontSize = this.y/2;
		text.textAlign = "left";

		text.anchorX = "left";
		text.anchorY = "middle";

		text.font = "/resources/fonts/Poppins/Poppins-Regular.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.TextVeryDark
		});

		text.position.set(-this.menu.x + this.y/2, 0, 0);

		this.parent.add(text);

		this.title = text;
	}

	setTitle(content) {
		this.title.text = content;

		this.title.sync();
	}

	addText() {
		var text = new TroikaText();

		text.fontSize = this.y/2;
		text.textAlign = "right";

		text.anchorX = "right";
		text.anchorY = "middle";

		text.font = "/resources/fonts/Poppins/Poppins-Medium.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(-this.y/2, 0, 0);

		this.parent.add(text);

		this.text = text;
	}

	setText(content) {
		this.text.text = content;

		this.text.sync();
	}

	update(value) {
		if (this.callback) {
			this.callback(value);
		}
	}

	setCallback(callback) {
		this.callback = callback;
	}
}

AR.RightSlider = RightSlider;