class Battery {
	static async Init() {
		var item = new AR.LeftItem();

		item.setTitle("Battery:");

		var battery = await navigator.getBattery();

		battery.addEventListener("levelchange", this.update);

		this.item = item;

		this.battery = battery;

		this.update();
	}

	static update() {
		this.item.setText(this.battery.level * 100 + "%");
	}
}

AR.Battery = Battery;

Battery.Init();