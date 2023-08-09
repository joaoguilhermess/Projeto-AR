class Terminal {
	static Init() {
		this.x = 1;
		this.y = 0.65;

		this.rows = 22;
		this.columns = 54;

		this.lines = 10;

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
	
		this.addInput();

		this.addOutput();
	}

	static Focus() {
		var context = this;

		AR.Controller.setFocus(function(event) {
			context.parent.visible = true;

			if (event.type == "key") {
				if (event.key == "BACKSPACE") {
					if (context.input.text[context.input.text.length - 1] == "\n") {
						context.input.text = context.input.text.slice(0, -2);
					} else {
						context.input.text = context.input.text.slice(0, -1);
					}
				} else if (event.key == "TAB") {
					context.input.text += "\t";
				} else if (event.key == "SPACE") {
					context.input.text += " ";
				} else if (event.key == "ENTER") {
					var text = context.input.text;

					if (text.length > 0) {
						try {
							context.output.text = eval(text);
							context.input.text = "";
						} catch (e) {
							context.output.text = e;
						}
					}
				} else {
					context.input.text += event.key;
				}

				var t = 0;

				for (var i = 0; i < context.input.text.length; i++) {
					if (context.input.text[i] != "\n") {
						t += 1;
					}

					if (t == context.columns) {
						if (context.input.text[i + 1] != "\n") {
							context.input.text = context.input.text.slice(0, i + 1) + "\n" + context.input.text.slice(i + 1);
						}

						t = 0;
					}
				}

				context.input.sync(function() {
					context.input.anchorY = -context.input.geometry.boundingBox.getSize(new THREE.Vector3()).y + 0.06 * 3;

					context.input.sync();
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

		mesh.position.set(0, 0, -0.01);

		this.parent.add(mesh);

		this.background = mesh;
	}

	static addOutput() {
		var text = new TroikaText();

		text.fontSize = 0.05;
		text.textAlign = "left";

		text.anchorX = "left";
		text.anchorY = 0;

		text.whiteSpace = "prewrap";
		text.overflowWrap = "break-word";

		text.letterSpacing = 0;
		text.lineHeight = 1;

		text.clipRect = [0, text.fontSize * -17, 2, 0];

		text.font = "/resources/fonts/RobotoMono/RobotoMono-Medium.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(-this.x + text.fontSize/3, this.y - text.fontSize/3, 0);

		text.maxWidth = 2;

		text.sync();

		this.parent.add(text);

		this.output = text;
	}

	static addInput() {
		var text = new TroikaText();

		text.fontSize = 0.05;
		text.textAlign = "left";

		text.anchorX = "left";
		text.anchorY = 0;

		text.whiteSpace = "prewrap";

		text.letterSpacing = 0;
		text.lineHeight = 1;

		text.clipRect = [0, text.fontSize * -4, 2, 0];

		text.font = "/resources/fonts/RobotoMono/RobotoMono-Medium.ttf";

		text.material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Text
		});

		text.position.set(-this.x + 0.03, -this.y + 0.21, 0);

		text.sync();

		this.parent.add(text);

		this.input = text;
	}

	static Stop() {
		this.started = false;

		this.button.toggle();

		AR.Camera.remove(this.parent);
		delete this.parent;

		this.background.geometry.dispose();
		this.background.material.dispose();
		delete this.background;

		this.input.dispose();
		delete this.input;

		this.output.dispose();
		delete this.output;
	}
}

AR.Terminal = Terminal;

Terminal.Init();