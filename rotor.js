class Rotor {
  constructor(rotorNumber) {
    let wiringString = "";
    switch(rotorNumber) {
      case 1:
        wiringString = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
        this.notchSpot = 17;
        break;
      case 2:
        wiringString = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
        this.notchSpot = 5;
        break;
      case 3:
        wiringString = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
        this.notchSpot = 22;
        break;
      case 4:
        wiringString = "ESOVPZJAYQUIRHXLNFTGKDCMWB";
        break;
      case 5:
        wiringString = "VZBRGITYUPSDNHLXAWMJQOFECK";
        break;
      default:
        wiringString = "incorrect rotor input";
    }
    this.wiring = wiringString.toLowerCase().split("");
    this.rotorNo = rotorNumber;
  }

  sendSignal(direction, letter) {
    if (direction) {
      const index = letters.indexOf(letter);
      const output = this.wiring[index];

      return output;
    } else { 
      const index = letters.indexOf(letter);
      return letters[this.wiring.indexOf(letter)];
    }
  }
  
  updatePosition() {
    for (let i = 0; i < this.position; i++) {
      this.wiring.push(this.wiring.shift());
    }
  }
  
  downPosition() {
    this.position--;
    this.wiring.push(this.wiring.shift());
  }

  shiftPosition() {
    this.position++;
    for (let i = 0; i < this.wiring.length - 1; i++) {
      this.wiring.push(this.wiring.shift());
    }
  }
}
