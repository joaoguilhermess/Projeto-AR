class Reload {
	static Init() {
		this.addButton();
	}

	static addButton() {
		var button = new AR.RadialButton();

		var context = this;

		button.setCallback(function() {
			window.location.reload();
		});

		button.setText("RETRY");

		this.button = button;
	}
}

Reload.Init();