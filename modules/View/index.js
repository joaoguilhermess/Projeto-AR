class View {
	static Init() {
		var button = new AR.RadialButton();

		button.setText("VIEW");

		button.setCallback(function(active) {
			if (active) {
				console.log("CUM");
			}
		});
	}
}

AR.View = View;

View.Init();
View.Init();