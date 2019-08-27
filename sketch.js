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

let currentLight;

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

let keyPressedYes = false;
let mouseCount = 0;
let showPlugDrawer = false;

let messages = [];
let messageRN = "";

function setup() {
	createCanvas(1500, 800);

	setRotors();

	reflector = new Reflector();
	plugBoard = new PlugBoard();

	for (let i = 0; i < letters.length; i++) {
		const xMult = width / 13;
		let lightX = i <= 12 ? i * xMult + 75 : (i - 13) * xMult + 75;
		let lightY = i <= 12 ? 150 : 250;

		lights[lights.length] = new Light(lightX, lightY, letters[i]);

		// dude just learn how to place ellipses
		let plugX = i <= 12 ? width * 0.85 : width * 0.95;
		let plugY = i <= 12 ? 400 + i * 30 : 400 + (i - 13) * 30;
		plugLetters[plugLetters.length] = new PlugLetter(
			letters[i],
			plugX,
			plugY
		);

		// y am i so retarded
	}

	for (let i = 0; i < plugLetters.length; i++) {
		if (plugBoard.plugLetters.indexOf(plugLetters[i].letter) >= 0) {
			let otherLetter = plugBoard.passSignal(plugLetters[i].letter);

			// bro none of this shit works
			let otherPlug = plugLetters[letters.indexOf(otherLetter)];
			plugLetters[i].connect(otherPlug);
		}
		// nvm it works now
	}
}

function draw() {
	background(0);
	noStroke();

	for (let i of lights) {
		i.show();
	}

	let rotorText =
		"Rotor 3 Position: " +
		(rotor3.position + 1) +
		" +  -\n" +
		rotor3.wiring.toString() +
		"\nRotor 2 Position: " +
		(rotor2.position + 1) +
		" +  -\n" +
		rotor2.wiring.toString() +
		"\nRotor 1 Position: " +
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
	text(messageRN, width * 0.5, height * 0.5);

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
		messages[0] = messageRN;
		messageRN = "";
		return;
	}

	if (!keyPressedYes) {
		// ehhh stupif system. Fs with backspacing
		keyPressedYes = true;

		if (key === " ") {
			// maybe make this work better idk your call fam
			messageRN += " ";
			return;
		} else if (keyCode === BACKSPACE) {
			messageRN = messageRN.substr(0, messageRN.length - 1);
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
		messageRN += finalR;

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
				currentLight = i;
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
					//i.disconnect();
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
	currentLight.on = false;
	keyPressedYes = false;
}

window.onload = function() {
	if (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
			navigator.userAgent
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
			navigator.userAgent.substr(0, 4)
		)
	)
		alert("Please visit this website on a desktop browser.");
};
