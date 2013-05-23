// Main drawing class

// This pseudo class function needs:
//  - The canvas element to draw the fractal on.
//  - The angle of rotation for each '+' or '-' step.
//  - A number to be used as a stroke length factor when drawing the fractal.
function Cesaro(canvas, angle, iterations, strokeLength) {

    // First, we set:

    // Our pen.
    this.pen = new Pen(canvas);

    // The length factor of each stroke, if given.
    this.strokeLength = (typeof strokeLength === "undefined") ? 1.5 : strokeLength;

    // We use the stroke length factor to determine the final stroke length.
    this.pen.strokeLength /= iterations * this.strokeLength;

    // The width of the strokes.
    this.pen.width = 1/iterations;

    // The original stroke length.
    this.originalPenStrokeLenght = this.pen.strokeLength;

    // The angle of rotation and number of iterations.
    this.angle = angle;
    this.iterations = iterations;

    // The length factor of the fractal.
    this.x = 2 - (1/60) * this.angle;


    // Now, to draw the fractal.

    // We start assuming a number of iterations > 1, so our first processable
    // instruction set will be:
    this.string = 'F+@xF--@xF+F'

    // And the we apply the grammar to ourselves an iteration number of times...
    while(--iterations)
        this.string = this.string.replace(/F/gi, '(F+@xF--@xF+F)');


    // Before replacing the X factor in the resulting string we break it into
    // pieces and replace as needed.
    this.string = this.string.split('');

    for(i=0; i<this.string.length; ++i) {
        if(this.string[i] === 'x')
            this.string[i] = this.x.toFixed(2);
    }

    // We copy the resulting string and create a stack of stroke lengths to use
    // when parsing the string.
    stringTemp = this.string.slice().reverse();
    strokeLenStack = [this.originalPenStrokeLenght];

    // We also set a flag to point when do we need to immediately pop the stack
    pop = false;

    // Before anything to be done, we clean the canvas.
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;

    // Start processing each character in the instruction set.
    while(stringTemp.length > 0) {
        element = stringTemp.pop();
        if(element === 'F'){
            // We set the last length in our stack and draw a line.
            this.pen.strokeLength = strokeLenStack[strokeLenStack.length - 1]
            this.pen.draw();

            // Pop the last length if needed.
            if(pop) {
                strokeLenStack.pop();
                pop = false;
            }
        }

        if(element === '+'){
            this.pen.rotate(this.angle);
        }

        if(element === '-'){
            this.pen.rotate(-this.angle);
        }

        if(element === '@'){
            // We're about to change the stroke length, so we get the factor
            // and push it to the stack (being multiplied by the last value on
            // it):
            number = stringTemp.pop();
            strokeLenStack.push(parseFloat(number) * strokeLenStack[strokeLenStack.length-1]);

            // Then, if we're about to enter into a subset of instructions
            // "(...)" we keep the length in our stack until the group ends,
            // (closing parentheses) otherwise we prepare it's deletion on the
            // next iteration.
            if(stringTemp[stringTemp - 1] === '(')
                stringTemp.pop();
            else
                pop = true;
        }

        if(element === '(') {
            // We re-push the last value into our stack, to avoid losing it
            // when we detect a closing parentheses.
            strokeLenStack.push(strokeLenStack[strokeLenStack.length-1]);
        }

        if(element === ')') {
            // We get rid of the top of the stack as we're done with this group.
            strokeLenStack.pop();
        }
    }

}

