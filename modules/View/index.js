class View {
	static Init() {
		this.x = 0.04;

		this.scale = 2;

		this.items = [];

		this.started = false;

		this.addButton();
	}

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(async function() {
			if (!context.started) {
				await context.Start();
			}

			context.Focus();
		});

		button.setText("VIEW");

		this.button = button;
	}

	static async Start() {
		this.started = true;

		this.button.toggle();

		await this.addSource();

		await this.addVideo();

		this.addCanvas();

		this.addRight();

		this.addZoom();
	}

	static async addSource() {
		var stream = await new Promise(function(resolve, reject) {
			navigator.getUserMedia({
				video: {
					facingMode: "environment",
					height: 2160/2,
					width: 4096/2
				}, audio: false
			}, resolve, resolve);
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

		video.position.set(0, 0, -2);

		AR.Camera.add(video);

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

	static addRight() {
		var menu = new AR.RightMenu();
		this.rightMenu = menu;
	}

	static addZoom() {
		var slider = new AR.RightSlider(this.rightMenu);
		
		slider.setTitle("Zoom:");
		slider.setText("0%");

		var track = this.source.srcObject.getTracks()[0];

		var capabilities = track.getCapabilities();

		slider.setCallback(function(value) {
			slider.setText((value * 100).toFixed(0) + "%");

			if (capabilities.zoom) {
				track.applyConstraints({
					advanced: [{
						zoom: (capabilities.zoom.max * value)
					}]
				});
			}
		});
	}

	static addFlash() {
		var slider = new AR.RightSlider(this.rightMenu);

		slider.setTitle("Flash:");
		slider.setText("OFF");

		var track = this.source.srcObject.getTracks()[0];

		var capabilities = track.getCapabilities();

		console.log(capabilities);

		slider.setCallback(function(value) {
			if (value < 0.5) {
				slider.setText("ON");

				if (capabilities.zoom) {
					track.applyConstraints({
						advanced: [{
							torch: true
						}]
					});
				}
			} else {
				slider.setText("OFF");

				if (capabilities.zoom) {
					track.applyConstraints({
						advanced: [{
							torch: false
						}]
					});
				}
			}
		});
	}

	static Focus() {
		var context = this;

		AR.Controller.setFocus(function(event) {
			context.rightMenu.parent.visible = true;

			for (var i = 0; i < context.rightMenu.items.length; i++) {
				context.rightMenu.items[i].setHover(false);
			}

			if (event.type == "move") {
				if (event.x > 0) {
					var y = (event.y + 1) / 2;

					var slot = Math.floor(y * context.rightMenu.items.length);

					if (context.rightMenu.items[slot]) {
						var item = context.rightMenu.items[slot];

						item.setHover(true);
					}
				} else {
					if (context.rightMenu.active) {
						var y = (event.y + 1) / 2;

						y = Math.floor(y * 100) / 100;

						y -= 0.1;

						y *= 1.2;

						if (y > 1) {
							context.rightMenu.active.update(1);
						} else if (y > 0) {
							context.rightMenu.active.update(y);
						} else {
							context.rightMenu.active.update(0);
						}
					}
				}
			} else if (event.type == "end") {
				if (event.x > 0) {
					var y = (event.y + 1) / 2;

					var slot = Math.floor(y * context.rightMenu.items.length);

					if (context.rightMenu.items[slot]) {
						var item = context.rightMenu.items[slot];

						context.rightMenu.setActive(item);
					}
				}
			}
		});

		AR.Controller.setUnFocus(function() {
			context.rightMenu.parent.visible = false;
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
		this.started = false;

		this.button.toggle();

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