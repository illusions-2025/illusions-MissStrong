let drawGridCheckBox;
let drawDotsCheckBox;
let gridLength = 15;
let smallSquareLength = 16;
let largeSquareLength = 60;
let margin = 30;
let padding = 16;
let dotRowsStart = [15, 6, 4, 3, 2, 2, 1, 1, 1, 2, 2, 3, 4, 6, 15];
let dotRowsEnd = [15, 8, 10, 11, 12, 12, 13, 13, 13, 12, 12, 11, 10, 8, 15];

//this function is called once at the start of a sketch
function setup() {


    //create a drawing surface on to the web page
    canvas = createCanvas(900,900);
    canvas.position(20,20);

    //create the checkbox for drawing 
    //checkerbox and dots.  if both on, then illusion is formed    
    drawGridCheckBox = createCheckbox("Draw Checkboard ",true);
    drawGridCheckBox.position(920,20);
    drawDotsCheckBox = createCheckbox("Draw Dots ", true);
    drawDotsCheckBox.position(920,40);

    //by default positional information in processing
    //are defined as the position of the top left "corner"
    //of the shape.  For our purposes it is much simpler
    //to view the position as the centre of the shape
    //thus we need to shift the rec/ellipse modes to
    //refer to centre
    rectMode(CENTER);
    ellipseMode(CENTER);

}

function drawGrid(){
    noStroke();
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            fill(255*((i+j)%2));
            rect(i*largeSquareLength+margin, j*largeSquareLength+margin, largeSquareLength);
        }
    }
}

function drawDots(){
    noStroke();
    
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            fill(255*((i+j)%2));
            if (dotRowsStart[i] <= j && j <= dotRowsEnd[i]) {
                fill(255*((i+j+1)%2));
            } else {
                continue; // boxes with no dots
            } if (i == 7 && j == 7) { // ignore center
                continue;
            } if (i == 7) { // middle vertical
                let up = j < 7 ? 1: -1;
                rect(i*largeSquareLength+margin+(padding*up), j*largeSquareLength+margin+(padding*up), smallSquareLength);
                rect(i*largeSquareLength+margin-(padding*up), j*largeSquareLength+margin+(padding*up), smallSquareLength);
            } if (j == 7) { // middle horizontal
                let left = i < 7 ? 1: -1;
                rect(i*largeSquareLength+margin+(padding*left), j*largeSquareLength+margin-(padding*left), smallSquareLength);
                rect(i*largeSquareLength+margin+(padding*left), j*largeSquareLength+margin+(padding*left), smallSquareLength);
            } else if (i < 7 && j < 7) { // upper left quadrant
                rect(i*largeSquareLength+margin-padding, j*largeSquareLength+margin+padding, smallSquareLength);
                rect(i*largeSquareLength+margin+padding, j*largeSquareLength+margin-padding, smallSquareLength);
            } else if (i > 7 && j < 7) { // upper right quadrant
                rect(i*largeSquareLength+margin-padding, j*largeSquareLength+margin-padding, smallSquareLength);
                rect(i*largeSquareLength+margin+padding, j*largeSquareLength+margin+padding, smallSquareLength);
            } else if (i < 7 && j > 7) { // lower left quadrant
                rect(i*largeSquareLength+margin-padding, j*largeSquareLength+margin-padding, smallSquareLength);
                rect(i*largeSquareLength+margin+padding, j*largeSquareLength+margin+padding, smallSquareLength);
            } else if (i > 7 && j > 7) { // lower right quadrant
                rect(i*largeSquareLength+margin-padding, j*largeSquareLength+margin+padding, smallSquareLength);
                rect(i*largeSquareLength+margin+padding, j*largeSquareLength+margin-padding, smallSquareLength);
            }
        }
    }

}
//this function is called once every 60 seconds unless
//the noLoop() function is called
//if we were just creating an illusion I would recommend putting in a noLoop()
//to reduce processor load. All examples except reverse-phi can be modified with a noLoop()
//However, as this code is used for breaking down the illusion, the noLoop() is commented out
//so that the illusion can be redrawn correctly after user input interaction
function draw() {
    background(255);
    if(drawGridCheckBox.checked()){
        drawGrid();
    }
    if(drawDotsCheckBox.checked()){
        drawDots();
    }
    //noLoop();
}
