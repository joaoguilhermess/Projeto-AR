class View {
	static Init() {
		var button = new AR.RadialButton(0);

		button.setText("VIEW");

		button.setActive(true);
	}
}

AR.View = View;

View.Init();