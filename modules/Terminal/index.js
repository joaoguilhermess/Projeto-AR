class Terminal {
	static Init() {
		this.x = 1;
		this.y = 0.65;

		this.rows = 25;
		this.columns = 0;

		this.prefix = "> ";

		this.started = false;

		this.addButton();
	}

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(function() {
			if (!context.started) {
				context.Start();
			}

			context.Focus();
		});

		button.setText("RUN");

		this.button = button;
	}

	static Start() {
		this.started = true;

		this.button.toggle();

		this.addParent();

		this.addBackground();
	
		this.addStd();

		this.std.text = this.prefix;
		this.offset = this.std.text.length;

		this.history = [];
		this.index = 0;
	}

	static Focus() {
		var context = this;

		AR.Controller.setFocus(function(event) {
			context.parent.visible = true;

			if (event.type == "key") {
				if (event.key == "BACKSPACE") {
					if (context.std.text.length > context.offset) {
						context.std.text = context.std.text.slice(0, -1);
					}
				} else if (event.key == "TAB") {
					context.std.text += "\t";
				} else if (event.key == "SPACE") {
					context.std.text += " ";
				} else if (event.key == "NEW LINE") {
					context.std.text += "\n";
				} else if (event.key == "TOP") {
					if (context.history.length > 0) {
						while (context.std.text.length > context.offset) {
							context.std.text = context.std.text.slice(0, -1);
						}

						context.std.text += context.history[context.history.length - 1 - context.index];

						if (context.index < context.history.length - 1) {
							context.index += 1;
						}
					}
				} else if (event.key == "BOTTOM") {
					if (context.history.length > 0) {
						while (context.std.text.length > context.offset) {
							context.std.text = context.std.text.slice(0, -1);
						}

						context.std.text += context.history[context.history.length - 1 - context.index];

						if (context.index > 0) {
							context.index -= 1;
						}
					}
				} else if (event.key == "ENTER") {
					context.index = 0;

					var text = context.std.text;

					text = text.slice(context.offset);

					if (text == "clear") {
						context.std.text = context.prefix;
						context.offset = context.std.text.length;
					} else if (text == "exit") {
						context.Stop();
					} else if (text.length > 0) {
						context.std.text += "\n";
						context.offset = context.std.text.length;

						try {
							context.std.text += eval(text);
						} catch (e) {
							context.std.text += e;
						}

						context.std.text += "\n";

						context.std.text += context.prefix;

						context.offset = context.std.text.length;
					} else {
						context.std.text += "\n";

						context.std.text += context.prefix;
						context.offset = context.std.text.length;
					}

					if (context.history[context.history.length - 1] != text) {
						context.history.push(text);
					}
				} else {
					context.std.text += event.key;
				}

				context.std.sync(function() {
					var r = context.std.geometry.boundingBox.getSize(new THREE.Vector3()).y/0.05;

					if (r > context.rows) {
						context.std.anchorY = -(r - context.rows) * 0.05;
					} else {
						context.std.anchorY = 0;
					}

					context.std.sync();
				});
			}
		});

		AR.Controller.setUnFocus(function() {
			context.parent.visible = false;
		});
	}

	static addParent() {
		var parent = new THREE.Group();

		AR.Camera.add(parent);

		parent.position.set(0, 0, -0.9);

		this.parent = parent;
	}

	static addBackground() {
		var shape = new THREE.Shape();

		shape.moveTo(-this.x, -this.y);

		shape.lineTo(-this.x, this.y);
		shape.lineTo(this.x, this.y);
		shape.lineTo(this.x, -this.y);

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Background,
			transparent: true,
			opacity: 0.8
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, 0, 0);

		mesh.renderOrder = -1;

		this.parent.add(mesh);

		this.background = mesh;
	}

	static addStd() {
		var text = new TroikaText();

		text.fontSize = 0.05;
		text.textAlign = "left";

		text.anchorX = "left";
		text.anchorY = 0;

		text.whiteSpace = "prewrap";
		text.overflowWrap = "break-word";

		text.letterSpacing = 0;
		text.lineHeight = 1;

		text.clipRect = [0, text.fontSize * -this.rows, 2, 0];

		text.font = "/resources/fonts/RobotoMono/RobotoMono-Medium.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(-this.x + text.fontSize/3, this.y - text.fontSize/3, 0);

		text.maxWidth = 2;

		text.sync();

		this.parent.add(text);

		this.std = text;
	}

	static Stop() {
		this.started = false;

		this.button.toggle();

		AR.Camera.remove(this.parent);
		delete this.parent;

		this.background.geometry.dispose();
		this.background.material.dispose();
		delete this.background;

		this.output.dispose();
		delete this.output;

		delete this.history;
		delete this.index;

		AR.Controller.Focus();
	}
}

AR.Terminal = Terminal;

Terminal.Init();