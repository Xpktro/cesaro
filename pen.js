// Pen helper class: made by me.
// Takes the canvas element it will draw on as the only parameter for its construction.
function Pen(canvas) {
    this.context = canvas.getContext('2d');

    // We assume the pen will start drawing at the lower-left corner of the canvas
    // We also give a little offset to show it right.
    this.x = 0;
    this.y = canvas.height - 9.5;
    this.strokeLength = canvas.width/2;
    this.angle = 0;
    this.width = 3;

    // Simple deg-to-rad conversion function
    this.deg_to_rad = function(angle) { return angle * (Math.PI/180); }

    // Draw a line of a given length in the position the pen is pointing to.
    this.draw = function() {
        this.context.moveTo(this.x, this.y);
        this.x += this.strokeLength * Math.cos(this.angle)
        this.y += this.strokeLength * Math.sin(this.angle)
        this.context.lineTo(this.x, this.y);
        this.context.lineWidth = this.width;
        this.context.stroke();

        // Hacky way to get rid of the fadeout issue.
        this.context.stroke();
    }

    // Rotate the pen from its position to a certain amount of degrees.
    this.rotate = function(angle) { this.angle -= this.deg_to_rad(angle); }
}
