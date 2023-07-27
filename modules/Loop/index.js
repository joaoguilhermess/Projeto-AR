class Loop {
	static Init() {
		var list = [];

		var clock = new THREE.Clock();

		AR.Renderer.setAnimationLoop(function() {
			var delta = clock.getDelta();

			for (var i = 0; i < list.length; i++) {
				try {
					list[i](delta);
				} catch {}
			}

			AR.Renderer.render(AR.Scene, AR.Camera);
		});

		this.list = list;
	}

	static addCallback(callback) {
		this.list.push(callback);
	}

	static removeCallback(callback) {
		this.list.splice(this.list.indexOf(callback), 1);
	}
}

AR.Loop = Loop;

Loop.Init();