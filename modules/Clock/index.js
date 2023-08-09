class Clock {
	static Init() {
		var clock = new AR.LeftItem();
		var date = new AR.LeftItem();
		var spent = new AR.LeftItem();

		clock.setTitle("Clock:");
		date.setTitle("Date:");
		spent.setTitle("Spent:");

		var d = 1000 - parseInt(Date.now().toString().slice(-3));

		var context = this;

		setTimeout(function() {
			setInterval(function() {
				context.updateClock();
				context.updateDate();
				context.updateSpent();
			}, 1000);
		}, d);

		this.clock = clock;
		this.date = date;
		this.spent = spent;

		this.startTime = Date.now();
	}

	static format(str) {
		str = str.toString();

		while (str.length < 2) {
			str = "0" + str;
		}

		return str;
	}

	static updateClock() {
		var t = new Date();

		this.clock.setText([this.format(t.getHours()), this.format(t.getMinutes()), this.format(t.getSeconds())].join(" : "));
	}

	static updateDate() {
		var t = new Date();

		this.date.setText([this.format(t.getDate()), this.format(t.getMonth()), this.format(t.getFullYear())].join(" : "));
	}

	static updateSpent() {
		var d = Date.now() - this.startTime;

		var t = [];

		var s = 1000;
		var m = 60 * s;
		var h = 60 * m;

		var a = Math.floor(d/h);

		t.push(this.format(a));

		d -= a * h;

		var b = Math.floor(d/m);

		t.push(this.format(b));

		d -= b * m;

		var c = Math.floor(d/s);

		d -= c * s;

		t.push(this.format(c));

		this.spent.setText(t.join(" : "));
	}
}

AR.Clock = Clock;

Clock.Init();