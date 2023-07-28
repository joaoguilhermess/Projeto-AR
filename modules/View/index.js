class View {
	static Init() {
		this.scale = 2;

		this.addButton();
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

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(function(active) {
			if (active) {
				context.Start();
			} else {
				context.Stop();
			}
		});

		button.setText("VIEW");
	}

	static async Start() {
		await this.addSource();

		this.addVideo();
	}

	static Stop() {
		if (this.source) {
			var tracks = this.source.srcObject.getTracks();

			for (var i = 0; i < tracks.length; i++) {
				tracks[i].stop();
			}

			this.source.remove();

			AR.Camera.remove(this.video);
			
			this.video.geometry.dispose();

			this.video.material.dispose();

			delete this.video;

			delete this.source;
		}
	}
}

AR.View = View;

View.Init();