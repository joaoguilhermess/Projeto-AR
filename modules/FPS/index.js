class FPS {
	static Init() {
		var item = new AR.LeftItem();

		item.setTitle("FPS:");

		var last = [];

		AR.Loop.addCallback(function() {
			var t = performance.now();

			while (last.length > 0 && last[0] <= t - 1000) {
				last.shift();
			}

			last.push(t);
		});

		setInterval(function() {
			item.setText(last.length);
		});
	}
}

AR.FPS = FPS;

FPS.Init();