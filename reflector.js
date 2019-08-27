class Reflector {
  constructor() {
    this.rotor = [
      ["a", "y"],
      ["b", "r"],
      ["c", "u"],
      ["d", "h"],
      ["e", "q"],
      ["f", "s"],
      ["g", "l"],
      ["v", "w"],
      ["i", "p"],
      ["j", "x"],
      ["k", "n"],
      ["z", "t"],
      ["m", "o"]
    ];
  }
  
  reflect(letter) {
    for (let i = 0; i < this.rotor.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (letter === this.rotor[i][j]) {
          return (j === 1) ? this.rotor[i][0] : this.rotor[i][1];
        }
      }
    }
  }
}
