let drawGridCheckBox;
let drawDotsCheckBox;
let shapeFunction = "rect";
const gridLength = 15;
const mid = Math.floor(gridLength/2);
const dotLength = 18;
const boxLength = 60;
const margin = 30;
const padding = 16;
const fudgeFactor = 1.2;
const maxAlphaGrowth = 36;
const maxAlpha = 255;
const dotRowsStart = [15, 6, 4, 3, 2, 2, 1, 1, 1, 2, 2, 3, 4, 6, 15];
const dotRowsEnd = [15, 8, 10, 11, 12, 12, 13, 13, 13, 12, 12, 11, 10, 8, 15];

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(20, 20);

    // main box colour
    mainColourPicker = createColorPicker("black");
    mainColourPicker.position(940, 20);
    
    // slider for main colour transparency
    alphaSlider = createSlider(0, maxAlphaGrowth-10, 0, 0);
    alphaSlider.position(940, 50);
    
    // checkbox to draw the grid
    drawGridCheckBox = createCheckbox("Draw Checkboard ",true);
    drawGridCheckBox.position(940, 70);
    
    // checkbox to draw the dots
    drawDotsCheckBox = createCheckbox("Draw Dots ", true);
    drawDotsCheckBox.position(940, 90);
    
    // checkbox to swap the positions of white boxes and non-white boxes
    invertCheckBox = createCheckbox("Invert ", false);
    invertCheckBox.position(940, 110);
    
    // checkbox to swap the positions of white boxes and non-white boxes
    shapeButton = createRadio();
    shapeButton.option('Squares');
    shapeButton.option('Circles');
    shapeButton.position(940, 130);
    shapeButton.selected('Squares');

    rectMode(CENTER);
    ellipseMode(CENTER);

}

function drawGrid(){
    noStroke();
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            let fillColour = color(255); // white by default
            if ((!invertCheckBox.checked() && (i+j+1)%2 == 1) || (invertCheckBox.checked() && (i+j+1)%2 == 0)) {
                // non-white boxes
                let alphaGrowth = alphaSlider.value();
                let layer = Math.max(Math.abs(mid - i), Math.abs(mid - j));
                alpha = maxAlpha - fudgeFactor*alphaGrowth*layer;
                fillColour = mainColourPicker.color();
                fillColour.setAlpha(alpha);
            }
            fill(fillColour);
            drawShape(i*boxLength+margin, j*boxLength+margin, boxLength);
        }
    }
}

function drawDots(){
    noStroke();
    
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            if (dotRowsStart[i] <= j && j <= dotRowsEnd[i]) {
                let fillColour = color(255); // white by default
                if ((!invertCheckBox.checked() && (i+j+1)%2 == 0) || (invertCheckBox.checked() && (i+j+1)%2 == 1)) {
                    // non-white boxes
                    let alphaGrowth = alphaSlider.value();
                    let layer = Math.max(Math.abs(mid - i), Math.abs(mid - j));
                    alpha = maxAlpha - fudgeFactor*alphaGrowth*layer;
                    fillColour = mainColourPicker.color();
                    fillColour.setAlpha(alpha);
                }
                fill(fillColour);
            } else {
                // skip boxes with no dots
                continue; 
            } if (i == mid && j == mid) { 
                // skip center for simplicity
                continue;
            } if (i == mid) { 
                // middle vertical
                let reflect = j < mid ? 1: -1;
                drawShape(i*boxLength+margin+(padding*reflect), j*boxLength+margin+(padding*reflect), dotLength);
                drawShape(i*boxLength+margin-(padding*reflect), j*boxLength+margin+(padding*reflect), dotLength);
            } if (j == mid) { 
                // middle horizontal
                let reflect = i < mid ? 1: -1;
                drawShape(i*boxLength+margin+(padding*reflect), j*boxLength+margin-(padding*reflect), dotLength);
                drawShape(i*boxLength+margin+(padding*reflect), j*boxLength+margin+(padding*reflect), dotLength);
            } else if ((i < mid && j < mid) || (i > mid && j > mid)) { 
                // upper-left and lower-right quadrant
                drawShape(i*boxLength+margin-padding, j*boxLength+margin+padding, dotLength);
                drawShape(i*boxLength+margin+padding, j*boxLength+margin-padding, dotLength);
            } else if ((i > mid && j < mid) || (i < mid && j > mid)) { 
                // upper-right and lower-lefr quadrant
                drawShape(i*boxLength+margin-padding, j*boxLength+margin-padding, dotLength);
                drawShape(i*boxLength+margin+padding, j*boxLength+margin+padding, dotLength);
            } 
        }
    }
}

function drawShape(x, y, size) {
    if (shapeFunction == "rect") {
        rect(x, y, size);
    } else if (shapeFunction == "ellipse")  {
        ellipse(x, y, size);
    }
}

function draw() {
    background(255);
    if (shapeButton.value() == "Squares") {
        shapeFunction = "rect";
    } else if (shapeButton.value() == "Circles") {
        shapeFunction = "ellipse";
    }
    
    if (drawGridCheckBox.checked()){
        drawGrid();
    } if (drawDotsCheckBox.checked()){
        drawDots();
    }
}
