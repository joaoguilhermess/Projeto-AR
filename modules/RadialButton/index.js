class RadialButton {
	constructor() {
		AR.RadialMenu.addButton(this);

		this.t = AR.RadialMenu.t;
		this.t2 = AR.RadialMenu.t2;

		this.a = 360/this.t/this.t2;
		
		this.o = -this.t/2 + (this.t * this.slot);

		this.r = AR.RadialMenu.r;

		this.wB = 0.96;
		this.wT = 0.7;

		this.active = false;

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

		shape.moveTo(Math.sin(RAD * this.o * this.a) * this.r * this.wB, Math.cos(RAD * this.o * this.a) * this.r * this.wB);

		for (var i = 0; i <= this.t; i++) {
			shape.lineTo(Math.sin(RAD * (i + this.o) * this.a) * this.r, Math.cos(RAD * (i + this.o) * this.a) * this.r);
		}

		for (var i = this.t; i >= 0; i--) {
			shape.lineTo(Math.sin(RAD * (i + this.o) * this.a) * this.r * this.wB, Math.cos(RAD * (i + this.o) * this.a) * this.r * this.wB);
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

		text.fontSize = 0.004;
		text.textAlign = "center";

		text.anchorX = "center";
		text.anchorY = "middle";

		text.font = "/resources/fonts/Poppins/Poppins-Medium.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(Math.sin(RAD * (this.t * this.slot) * this.a) * this.r * this.wT, Math.cos(RAD * (this.t * this.slot) * this.a) * this.r * this.wT, 0);

		this.parent.add(text);

		this.text = text;
	}

	setText(content) {
		this.text.text = content;

		this.text.sync();
	}

	setHover(hover) {
		if (hover) {
			this.border.material.color.setHex(AR.Palette.BackgroundDark);
			this.text.material.color.setHex(AR.Palette.TextDark);
		} else {
			if (this.active) {
				this.border.material.color.setHex(AR.Palette.Primary);
				this.text.material.color.setHex(AR.Palette.TextLight);
			} else {
				this.border.material.color.setHex(AR.Palette.BackgroundLight);
				this.text.material.color.setHex(AR.Palette.Text);
			}
		}
	}

	toggle() {
		this.active = !this.active;

		if (this.active) {
			this.border.material.color.setHex(AR.Palette.Primary);
			this.text.material.color.setHex(AR.Palette.TextLight);
		} else {
			this.border.material.color.setHex(AR.Palette.BackgroundLight);
			this.text.material.color.setHex(AR.Palette.Text);
		}
	}

	click() {
		if (this.callback) {
			this.callback();
		}
	}

	setCallback(callback) {
		this.callback = callback;
	}
}

AR.RadialButton = RadialButton;