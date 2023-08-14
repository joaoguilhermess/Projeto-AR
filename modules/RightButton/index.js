class RightButton {
	constructor(menu) {
		this.menu = menu;

		this.menu.addButton(this);

		this.y = 0.01;

		this.addParent();

		this.addTitle();

		this.addText();
	}

	addParent() {
		var parent = new THREE.Group();

		parent.position.set(0, (this.slot + 1) * -this.y, 0);

		this.menu.parent.add(parent);

		this.parent = parent;
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
}

AR.RightButton = RightButton;