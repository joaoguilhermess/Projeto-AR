class View {
	static Init() {
		this.scale = 2.5;

		this.started = false;

		this.addButton();
	}

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(function() {
			if (!context.started) {
				context.Start();

				button.toggle();
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

		video.position.set(0, 0, -1);

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

	static Focus() {
		var context = this;

		AR.Controller.setFocus(function(event) {
			if (event.type == "key") {
				if (event.key == "c" || event.key == "C") {
					context.takePhoto();
				}
			}
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