/* Sketch manages the user interaction by using P5.js. */
/* Those declaration should be here. */
const events = require('events');

const toSketchEmitter = new events.EventEmitter();  // used in the renderer.
const toRendererEmitter = new events.EventEmitter();  // used in the libraries.

/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't allow the cache
    so that we can immediately see the updated sketch. */

/* For WebSocket */
// const serverIP = location.hostname
// const webSocket = new WebSocket("ws://" + serverIP + ":8080/message");

/* Location delimiter for the GUI components */
let yType;
let yR, yG, yB;

/* These variables will be used for GUI components */
let btnAll;
let btnPartial;
let btnSingle;
let txtR, valR, sliderR;
let txtG, valG, sliderG;
let txtB, valB, sliderB;

/* Events */
let eBtnAll = new Event('btnAllPressed');
let eBtnPartial = new Event('btnPartialPressed');
let eBtnSingle = new Event('btnSinglePressed');
let eSliderR = new Event('sliderRChanged');
let eSliderG = new Event('sliderGChanged');
let eSliderB = new Event('sliderBChanged');

/* variables for the draw handler */
let drawCnt = 0;

/* P5.js reserved fuctions
    - setup
    - draw
    - mouseClicked
    - windowResized */

function setup() {
    /* To make a P5 canvas that fits the entire screen
    that has 16:9 screen ratio */
    // createCanvas(displayWidth, displayWidth*1.6)
    createCanvas(windowWidth, windowWidth)

    /* This block makes the 3 buttons - All, Partial, and Single.
    These button can be used to pick the target circles */
    yType = 50;
    btnAll = new Button('All');
    btnAll.setPosition(50, yType);
    btnAll.setSize(100, 40);
    btnAll.setEvent(eBtnAll);

    btnPartial = new Button('Partial');
    btnPartial.setPosition(155, yType);
    btnPartial.setSize(100, 40);
    btnPartial.setEvent(eBtnPartial);

    btnSingle = new Button('Single');
    btnSingle.setPosition(260, yType);
    btnSingle.setSize(100, 40);
    btnSingle.setEvent(eBtnSingle);

    /* These 3 blocks below make the 3 sliders - R, G, and B. 
    Each slider changes the color of the selected circles at a moment. */
    yR = 100;
    txtR = new P("R:");
    txtR.setPosition(60, yR);
    txtR.setNormal();

    valR = new P("250");
    valR.setPosition(130, yR);
    valR.setNormal();

    sliderR = new Slider();
    sliderR.setRange(0, 255, 250, 10);    // Min, Max, Init, Step
    sliderR.setPosition(215, yR+15);
    sliderR.setEvent(eSliderR);

    /* ============================== */
    yG = yR + 40;
    txtG = new P("G:");
    txtG.setPosition(60, yG);
    txtG.setNormal();

    valG = new P("250");
    valG.setPosition(130, yG);
    valG.setNormal();

    sliderG = new Slider();
    sliderG.setRange(0, 255, 250, 10);
    sliderG.setPosition(215, yG+15);
    sliderG.setEvent(eSliderG);

    /* ============================== */
    yB = yG + 40;
    txtB = new P("B:");
    txtB.setPosition(60, yB);
    txtB.setNormal();

    valB = new P("250");
    valB.setPosition(130, yB);
    valB.setNormal();

    sliderB = new Slider();
    sliderB.setRange(0, 255, 250, 10);
    sliderB.setPosition(215, yB+15);
    sliderB.setEvent(eSliderB);

     /* To apply the sliders' state to all the circles. */
    slidersUpdated();
}

/* This function can be (typically) called 60 times per second */
function draw() {
    /* drawCnt limits the number of drawing in a second for the efficiency */
    drawCnt += 1;
    if (drawCnt > 10) {
        drawCnt = 0;
        background('#ffffff')

        // To reset the font-weight of each button
        btnAll.setNormal();
        btnPartial.setNormal();
        btnSingle.setNormal();
    }
}

/* This function checks where a click/touch happened
so that the app can know which circle was chosen. */
function mouseClicked () {
}

/* To fix the size of the canvas 
even if the window size is changed. */
function windowResized() {
    createCanvas(windowWidth, windowWidth)
}

/* Event Handlers =========================== */

/* This handler resets all the circles' color to be white and chosen */
document.addEventListener('btnAllPressed', function(e){
    sliderR.setValue(250);
    sliderG.setValue(250);
    sliderB.setValue(250);
    slidersUpdated();
    btnAll.setBold();
    btnPartial.setNormal();
    btnSingle.setNormal();

    toRendererEmitter.emit('aaa', 'aaa')
});

/* This handler sets the mode to be partial. 
This makes all the circles to be unchosen first 
so that users can start to chose. */
document.addEventListener('btnPartialPressed', function(e){
    btnAll.setNormal();
    btnPartial.setBold();
    btnSingle.setNormal();
});

/* This handler sets the mode to be single. 
This makes all the circles to be unchosen first 
so that users can start to chose. */
document.addEventListener('btnSinglePressed', function(e){
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setBold();
});

// document.addEventListener('btnApplyPressed', function(e){
//     /* To send the arrays to the server */
//     axios.post('/api', matrixCurrentState)
//         .then(function (response) {
//             console.log(`POST's result: ${response.statusText}`);  // template literal
//         })
//         .catch(function (error) {
//             console.log(`POST's result: ${error}`);
//     });

//     /* Just in case WebSocket connection is needed.
//     For example, if someone wants to develop their own application 
//     for the motion sensor on Sense Hat. */
//     console.log("sent a WS message");
//     webSocket.send(
//         JSON.stringify({message: "hello server!"}))
// });

/* A handler for the R slider */
document.addEventListener('sliderRChanged', function(e){
    slidersUpdated();
});

/* A handler for the G slider */
document.addEventListener('sliderGChanged', function(e){
    slidersUpdated();
});

/* A handler for the B slider */
document.addEventListener('sliderBChanged', function(e){
    slidersUpdated();
});

/* Helper functions =================== */

/* This function gets the sliders' status 
and applies the value to the circles chosen at a moment (+label). */
function slidersUpdated() {
    valR.update(sliderR.getValue());
    valG.update(sliderG.getValue());
    valB.update(sliderB.getValue());
}

/* Web Socket Handlers =================== */

// /* To check if the socket is opened properly */
// webSocket.onopen = function () {
//     console.log('socket is opened');
// };

// /* A handler for the web socket. */
// webSocket.onmessage = function (e) {
//     console.log('got a WS message: ' + JSON.parse(e.data).message);
// };

/* Handlers from the renderer */

toSketchEmitter.on('bbb', (arg) => {
    console.log('got a signal from renderer')
});

