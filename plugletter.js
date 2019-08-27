class PlugLetter {
  constructor(letter, x, y) {
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.itHaveWire = false;
    this.wireForTrack = false;
  }
  
  connect(otherPlug) { 
    this.itHaveWire = true;
    this.connectedPlug = otherPlug;
    plugBoard.reassign(this.letter, otherPlug.letter);
  }
  
  disconnect() {
    this.itHaveWire = false;
    if (this.connectedPlug !== undefined) {
      this.connectedPlug.connectedPlug = undefined;
      this.connectedPlug.disconnect();
      this.connectedPlug = undefined;
    }
  }
  
  show() {
    stroke(0);
    fill(0);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, 20, 20);
    
    fill(255);
    textAlign(RIGHT);
    text(this.letter, this.x - 10, this.y + 5);
    
    if (this.itHaveWire) {
      stroke(66, 135, 245);
      line(this.x, this.y, this.connectedPlug.x, this.connectedPlug.y);
    } else if (this.wireForTrack) {
      stroke(66, 135, 245);
      line(this.x, this.y, mouseX, mouseY);
    }
  }
}
