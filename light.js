class Light {
	constructor(x, y, letter) {
		this.x = x;
		this.y = y;
		this.letter = letter;
		this.on = false;
	}

	show() {
		let onColor = color(252, 238, 83);

		if (!this.on) {
			fill(29, 167, 234);
			ellipse(this.x, this.y, 75, 75);
		} else {
			fill(onColor);
			ellipse(this.x, this.y, 75, 75);
			onColor.setAlpha(128);
			fill(onColor);
			ellipse(this.x, this.y, 100, 100);
		}

		if (!this.on) {
			fill(50);
		} else {
			fill(0);
    }
    fill(255);
		textSize(60);
		textAlign(CENTER);
		text(this.letter, this.x, this.y + 15);
	}
}
