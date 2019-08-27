class PlugLetter {
  constructor(letter, x, y) {
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.hasWire = false;
    this.wireForTrack = false;
  }
  
  connect(notThatPlug) { 
    this.hasWire = true;
    this.connectedPlug = notThatPlug;
    plugBoard.reassign(this.letter, notThatPlug.letter);
  }
  
  disconnect() {
    this.hasWire = false;
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
    
    if (this.hasWire) {
      stroke(66, 135, 245);
      line(this.x, this.y, this.connectedPlug.x, this.connectedPlug.y);
    } else if (this.wireForTrack) {
      stroke(66, 135, 245);
      line(this.x, this.y, mouseX, mouseY);
    }
  }
}
