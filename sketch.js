const letters = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z"
];

let lights = [];

let activeLight;

let rotor1;
let rotor2;
let rotor3;

let reflector;

let plugBoard;
let plugLetters = [];
let activePlugLetter;

const rotor1Start = 0,
	rotor2Start = 0,
	rotor3Start = 0;

let keyIsPressed = false;
let mouseCount = 0;
let showPlugDrawer = false;

let messages = [];
let currentMessage = "";

function setup() {
	createCanvas(windowWidth, windowHeight);

	setRotors();

	reflector = new Reflector();
	plugBoard = new PlugBoard();

	// create lights & plug letters
	for (let i = 0; i < letters.length; i++) {
		const xMult = width / 13;
		let lightX = i <= 12 ? i * xMult + 60 : (i - 13) * xMult + 60;
		let lightY = i <= 12 ? 150 : 250;

		lights[lights.length] = new Light(lightX, lightY, letters[i]);

		let plugX = i <= 12 ? width * 0.85 : width * 0.95;
		let plugY = i <= 12 ? 400 + i * 30 : 400 + (i - 13) * 30;
		plugLetters[plugLetters.length] = new PlugLetter(
			letters[i],
			plugX,
			plugY
		);
	}

	for (let i = 0; i < plugLetters.length; i++) {
		if (plugBoard.plugLetters.indexOf(plugLetters[i].letter) >= 0) {
			let otherLetter = plugBoard.passSignal(plugLetters[i].letter);
			let otherPlug = plugLetters[letters.indexOf(otherLetter)];
			plugLetters[i].connect(otherPlug);
		}
	}
}

function draw() {
	background(0);
	noStroke();

	for (let i of lights) {
		i.show();
	}

	let rotorText =
		"Rotor 3: " +
		(rotor3.position + 1) +
		" +  -\n" +
		rotor3.wiring.toString() +
		"\nRotor 2: " +
		(rotor2.position + 1) +
		" +  -\n" +
		rotor2.wiring.toString() +
		"\nRotor 1: " +
		(rotor1.position + 1) +
		" +  -\n" +
		rotor1.wiring.toString();

	textAlign(CENTER);
	fill(225);
	textSize(25);

	text(rotorText, width / 2, height * 0.65);

	textAlign(CENTER);
	fill(255);
	text("Message:", width * 0.3, height * 0.5);
	fill(0, 255, 0);
	text(currentMessage, width * 0.5, height * 0.5);

	if (messages.length >= 1) {
		fill(225);
		text(messages[0], width * 0.5, height * 0.55);
	}

	if (showPlugDrawer) {
		fill(50);
		rect(width * 0.8, 380, width * 0.9, 800);

		for (let i of plugLetters) {
			i.show();
		}
	}
}

function setRotors() {
	rotor1 = new Rotor(3);
	rotor1.position = rotor1Start;

	rotor2 = new Rotor(2);
	rotor2.position = rotor2Start;

	rotor3 = new Rotor(1);
	rotor3.position = rotor3Start;

	rotor1.updatePosition();
	rotor2.updatePosition();
	rotor3.updatePosition();
}

function keyPressed() {
	if (keyCode === ENTER) {
		setRotors();
		messages[0] = currentMessage;
		currentMessage = "";
		return;
	}

	if (!keyIsPressed) {
		keyIsPressed = true;

		if (key === " ") {
			currentMessage += " ";
			return;
		} else if (keyCode === BACKSPACE) {
			currentMessage = currentMessage.substr(
				0,
				currentMessage.length - 1
			);
			rotor1.downPosition();

			return;
		} else if (letters.indexOf(key) < 0) {
			return;
		}

		let input = key;

		if (plugBoard.plugLetters.indexOf(input) >= 0) {
			input = plugBoard.passSignal(input);
		}

		const firstR = rotor1.sendSignal(true, input);
		const secondR = rotor2.sendSignal(true, firstR);
		const thirdR = rotor3.sendSignal(true, secondR);
		reflect = reflector.reflect(thirdR);
		const fourthR = rotor3.sendSignal(false, reflect);
		const fithR = rotor2.sendSignal(false, fourthR);
		let finalR = rotor1.sendSignal(false, fithR);

		if (plugBoard.plugLetters.indexOf(finalR) >= 0) {
			finalR = plugBoard.passSignal(finalR);
		}

		let lightLetter = finalR;
		currentMessage += finalR;

		rotor1.shiftPosition();
		if (rotor1.position >= 26) {
			rotor2.shiftPosition();
			rotor1.position = 0;
		}
		if (rotor2.position >= 26) {
			rotor3.shiftPosition();
			rotor2.position = 0;
		}

		for (let i of lights) {
			if (lightLetter === i.letter) {
				i.on = true;
				activeLight = i;
			}
		}
	}
}

function mousePressed() {
	for (let i of plugLetters) {
		if (mouseX < i.x + 10 && mouseX > i.x - 10) {
			if (mouseY < i.y + 10 && mouseY > i.y - 10) {
				mouseCount++;
				if (mouseCount % 2 === 0) {
					activePlugLetter.connect(i);
					i.connect(activePlugLetter);
					activePlugLetter.wireForTrack = false;
					return;
				} else {
					activePlugLetter = i;
					i.disconnect();
					i.wireForTrack = true;
					return;
				}
			}
		}
	}

	if (mouseX > width * 0.75 && mouseY > 450) {
		showPlugDrawer = !showPlugDrawer ? true : false;
		return;
	} else if (mouseX > 835 && mouseX < 860) {
		if (mouseY > 500 && mouseY < 520) {
			rotor3.shiftPosition();
			return;
		} else if (mouseY > 566 && mouseY < 586) {
			rotor2.shiftPosition();
			return;
		} else if (mouseY > 630 && mouseY < 650) {
			rotor1.shiftPosition();
			return;
		}
	} else if (mouseX > 860 && mouseX < 880) {
		if (mouseY > 500 && mouseY < 520) {
			rotor3.downPosition();
			return;
		} else if (mouseY > 566 && mouseY < 586) {
			rotor2.downPosition();
			return;
		} else if (mouseY > 630 && mouseY < 650) {
			rotor1.downPosition();
			return;
		}
	}
}

function keyReleased() {
	activeLight.on = false;
	keyIsPressed = false;
}
