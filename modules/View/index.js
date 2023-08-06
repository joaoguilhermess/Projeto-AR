class View {
	static Init() {
		this.scale = 2.5;

		this.started = false;

		this.addParent();

		this.addButton();
	}

	static addParent() {
		var parent = new THREE.Group();

		// parent.visible = false;

		parent.position.set(0, 0, -1);

		AR.Camera.add(parent);

		this.parent = parent;
	}

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(async function() {
			if (!context.started) {
				button.toggle();

				await context.Start();
			}

			context.Focus();
		});

		button.setText("VIEW");

		this.button = button;
	}

	static async Start() {
		this.started = true;

		await this.addSource();

		await this.addVideo();

		this.addCanvas();

		this.addTakeBackground();

		this.addTake();
	}

	static async addSource() {
		var stream = await new Promise(function(resolve, reject) {
			navigator.getUserMedia({
				video: {
					facingMode: "environment",
					height: 2160/2,
					width: 4096/2
				}, audio: false
			}, resolve, reject);
		});

		var source = document.createElement("video");

		source.autoplay = true;
		source.style.display = "none";

		source.srcObject = stream;

		document.body.append(source);

		this.source = source; 
	}

	static async addVideo() {
		var context = this;

		await new Promise(function(resolve, reject) {
			context.source.addEventListener("playing", resolve);
		});

		var geometry = new THREE.PlaneGeometry(this.source.videoWidth/this.source.videoHeight * this.scale, this.scale);

		var texture = new THREE.VideoTexture(this.source);

		texture.encoding = THREE.sRGBEncoding;

		var material = new THREE.MeshBasicMaterial({map: texture});

		var video = new THREE.Mesh(geometry, material);

		video.position.set(0, 0, 0);

		this.parent.add(video);

		this.video = video;
	}

	static addCanvas() {
		var canvas = document.createElement("canvas");

		canvas.style.display = "none";

		canvas.width = this.source.videoWidth;
		canvas.height = this.source.videoHeight;

		var context = canvas.getContext("2d");

		canvas.context = context;

		document.body.append(canvas);

		this.canvas = canvas;
	}

	static addTakeBackground() {
		var shape = new THREE.Shape();

		var t = 64;

		var a = 360/t;

		var r = 0.1;

		shape.moveTo(0, r);

		for (var i = 1; i < t; i++) {
			shape.lineTo(Math.sin(RAD * i * a) * r, Math.cos(RAD * i * a) * r);
		}

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Background,
			transparent: true,
			opacity: 0.8
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, -this.scale * 0.3, 0.2 - 0.01);

		mesh.visible = false;

		this.parent.add(mesh);

		this.takeBackground = mesh;
	}

	static addTake() {
		var shape = new THREE.Shape();

		var t = 64;

		var a = 360/t;

		var r = 0.09;

		shape.moveTo(0, r);

		for (var i = 1; i < t; i++) {
			shape.lineTo(Math.sin(RAD * i * a) * r, Math.cos(RAD * i * a) * r);
		}

		var geometry = new THREE.ShapeGeometry(shape);

		var material = new THREE.MeshBasicMaterial({
			color: AR.Palette.Primary
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0, -this.scale * 0.3 + 0.01, 0.2);

		mesh.visible = false;

		this.parent.add(mesh);

		this.take = mesh;
	}

	static Focus() {
		var context = this;

		AR.Controller.setFocus(function(event) {
			context.takeBackground.visible = true;
			context.take.visible = true;

			if (Math.abs(event.x) < 1/3 && event.y > 0) {
				if (event.type == "move") {
					context.take.material.color.setHex(AR.Palette.PrimaryDark);
				} else if (event.type == "end") {
					context.takePhoto();

					if (context.take.material.timeout) {
						clearTimeout(context.take.material);
					}

					context.take.material.timeout = setTimeout(function() {
						context.take.material.color.setHex(AR.Palette.Primary);
					}, 100);
				}
			} else {
				context.take.material.color.setHex(AR.Palette.Primary);
			}
		});

		AR.Controller.setUnFocus(function() {
			context.takeBackground.visible = false;
			context.take.visible = false;
		});
	}

	static takePhoto() {
		this.canvas.context.drawImage(this.source, 0, 0, this.source.videoWidth, this.source.videoHeight);

		this.canvas.toBlob(function(blob) {
			fetch("/photos", {
				method: "POST",
				body: blob
			});
		});
	}

	static Stop() {
		this.started = true;

		if (this.source) {
			var tracks = this.source.srcObject.getTracks();

			for (var i = 0; i < tracks.length; i++) {
				tracks[i].stop();
			}

			this.source.remove();

			this.canvas.remove();

			AR.Camera.remove(this.video);
			
			this.video.geometry.dispose();

			this.video.material.dispose();

			delete this.video;

			delete this.source;

			delete this.canvas;
		}
	}
}

AR.View = View;

View.Init();