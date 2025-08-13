let drawGridCheckBox;
let drawDotsCheckBox;
let shapeFunction = "rect";
let dotLength = 8;
let alphaGrowth = 255;
let alphaGrowing = true;
let dotsGrowing = true;
let playAlphaMode = false;
let playDotsMode = false;
const alphaAcceleration = 0.0005;
const dotsAcceleration = 0.003;
const gridLength = 15;
const mid = Math.floor(gridLength/2);
const minDotLength = 8;
const maxDotLength = 31;
const boxLength = 60;
const margin = 30;
const padding = 16;
const fudgeFactor = 1.2;
const minAlphaGrowth = 0;
const maxAlphaGrowth = 24;
const maxAlpha = 255;
const dotRowsStart = [15, 6, 4, 3, 2, 2, 1, 1, 1, 2, 2, 3, 4, 6, 15];
const dotRowsEnd = [15, 8, 10, 11, 12, 12, 13, 13, 13, 12, 12, 11, 10, 8, 15];
const edge = 940;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(20, 20);

    // main box colour
    mainColourPicker = createColorPicker("black");
    mainColourPicker.position(edge, 20);
    
    // slider for main colour transparency
    alphaSlider = createSlider(minAlphaGrowth, maxAlphaGrowth, minAlphaGrowth, 0);
    alphaSlider.position(edge, 50);
    
    // animation for autoplaying transparency
    alphaButton = createButton("Start Transparency Animation");
    alphaButton.position(edge, 80);
    alphaButton.mousePressed(playAlpha);
    
    // checkbox to draw the grid
    drawGridCheckBox = createCheckbox("Draw Checkboard ",true);
    drawGridCheckBox.position(edge, 110);
    
    // checkbox to draw the dots
    drawDotsCheckBox = createCheckbox("Draw Dots ", true);
    drawDotsCheckBox.position(edge, 130);
    
    // checkbox to swap the positions of white boxes and non-white boxes
    invertCheckBox = createCheckbox("Invert ", false);
    invertCheckBox.position(edge, 150);
    
    // checkbox to swap the positions of white boxes and non-white boxes
    shapeButton = createRadio();
    shapeButton.option('Squares');
    shapeButton.option('Circles');
    shapeButton.option('Diamonds');
    shapeButton.position(edge, 170);
    shapeButton.selected('Squares');
    
    // slider for dot size
    dotLengthSlider = createSlider(minDotLength, maxDotLength, (minDotLength+maxDotLength)/2, 0);
    dotLengthSlider.position(edge, 190);
    
    // animation for autoplaying dot size changes
    dotsButton = createButton("Start Dot Animation");
    dotsButton.position(edge, 210);
    dotsButton.mousePressed(playDots);

    rectMode(CENTER);
    ellipseMode(CENTER);
}

function drawGrid(){
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            let fillColour = color(255); // white by default
            setAlpha();
            if ((!invertCheckBox.checked() && (i+j+1)%2 == 1) || (invertCheckBox.checked() && (i+j+1)%2 == 0)) {
                // non-white boxes
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

function playAlpha() {
    alphaGrowth = minAlphaGrowth;
    alphaGrowing = true;
    if (playAlphaMode) {
        alphaButton.html('Start Transparency Animation');
    } else {
        alphaButton.html('Stop Transparency Animation');
    }
    playAlphaMode = !playAlphaMode;
}


function playDots() {
    dotGrowth = minDotLength;
    dotsGrowing = true;
    if (playDotsMode) {
        dotsButton.html('Start Dots Animation');
    } else {
        dotsButton.html('Stop Dots Animation');
    }
    playDotsMode = !playDotsMode;
}

function setAlpha() {
    if (!playAlphaMode) {
        alphaGrowth = alphaSlider.value();
    } else {
        if (alphaGrowing && alphaGrowth >= maxAlphaGrowth) {
            alphaGrowth = maxAlphaGrowth;
            alphaGrowing = false;
        } else if (!alphaGrowing && alphaGrowth <= minAlphaGrowth) {
            alphaGrowth = minAlphaGrowth;
            alphaGrowing = true;
        }
        if (alphaGrowing) {
            alphaGrowth += alphaAcceleration;
        } else {
            alphaGrowth -= alphaAcceleration;
        }
    }
}

function setDots() {
    if (!playDotsMode) {
        dotLength = dotLengthSlider.value();
    } else {
        if (dotsGrowing && dotLength >= maxDotLength) {
            dotLength = maxDotLength;
            dotsGrowing = false;
        } if (!dotsGrowing && dotLength <= minDotLength) {
            dotLength = minDotLength;
            dotsGrowing = true;
        }
        if (dotsGrowing) {
            dotLength += dotsAcceleration;
        } else {
            dotLength -= dotsAcceleration;
        }
    }
}

function drawDots(){
    for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
            if (dotRowsStart[i] <= j && j <= dotRowsEnd[i]) {
                let fillColour = color(255); // white by default
                if ((!invertCheckBox.checked() && (i+j+1)%2 == 0) || (invertCheckBox.checked() && (i+j+1)%2 == 1)) {
                    // non-white boxes
                    let layer = Math.max(Math.abs(mid - i), Math.abs(mid - j));
                    alpha = maxAlpha - fudgeFactor*alphaGrowth*layer;
                    fillColour = mainColourPicker.color();
                    fillColour.setAlpha(alpha);
                }
                fill(fillColour);
            } else {
                // skip boxes with no dots
                continue; 
            } 
            
            setDots();
            
            if (i == mid && j == mid) { 
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
    } else if (shapeFunction == "quad")  {
        quad(x-size/2, y, x, y-size/2, x+size/2, y, x, y+size/2);
    }
}

function draw() {
    background(255);
    noStroke();
    if (shapeButton.value() == "Squares") {
        shapeFunction = "rect";
    } else if (shapeButton.value() == "Circles") {
        shapeFunction = "ellipse";
    } else if (shapeButton.value() == "Diamonds") {
        shapeFunction = "quad";
    }
    
    if (drawGridCheckBox.checked()){
        drawGrid();
    } if (drawDotsCheckBox.checked()){
        drawDots();
    }
}
