class RadialButton {
	constructor(slot) {
		this.slot = slot;

		this.t = 8;
		this.t2 = 8;

		this.a = 360/this.t/this.t2;
		
		this.r = 0.5/2;

		this.wB = 0.96;
		this.wT = 0.7;

		this.addParent();

		this.addBorder();

		this.addText();
	}

	addParent() {
		var parent = new THREE.Group();

		AR.RadialMenu.parent.add(parent);

		this.parent = parent;
	}

	addBorder() {
		var shape = new THREE.Shape();

		var o = -this.t/2 + (this.t * this.slot);

		shape.moveTo(Math.sin(RAD * o * this.a) * this.r * this.wB, Math.cos(RAD * o * this.a) * this.r * this.wB);

		for (var i = 0; i <= this.t; i++) {
			shape.lineTo(Math.sin(RAD * (i + o) * this.a) * this.r, Math.cos(RAD * (i + o) * this.a) * this.r);
		}

		for (var i = this.t; i >= 0; i--) {
			shape.lineTo(Math.sin(RAD * (i + o) * this.a) * this.r * this.wB, Math.cos(RAD * (i + o) * this.a) * this.r * this.wB);
		}

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.BackgroundLight
		});

		var mesh = new THREE.Mesh(geometry, material);

		this.parent.add(mesh);

		this.border = mesh;
	}

	addText(content) {
		var text = new TroikaText();

		text.fontSize = 0.03;
		text.textAlign = "center";

		text.anchorX = "center";
		text.anchorY = "middle";

		text.font = "/resources/fonts/Poppins/Poppins-Black.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(Math.sin(RAD * (this.t * this.slot) * this.a) * this.r * this.wT, Math.cos(RAD * (this.t * this.slot) * this.a) * this.r * this.wT, 0.01);

		this.parent.add(text);

		this.text = text;
	}

	setText(content) {
		this.text.text = content;

		this.text.sync();
	}

	setActive(active) {
		if (active) {
			this.border.material.color.setHex(AR.Palette.Primary);
		} else {
			this.border.material.color.setHex(AR.Palette.BackgroundLight);
		}
	}
}

window.AR.RadialButton = RadialButton;