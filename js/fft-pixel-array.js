var img;
var fftimg;
var canvas;
var pixelData = [];
var brightnessData;
var brightnessCats = [];
var brightnessRange = 0.4;

let testimg;
let pink;

function preload() {
  // img = loadImage('../images/IMG_20200317_170411_hori.jpg');
  img = loadImage('../images/ohzone/ohzonelores.png');
}

function setup() {
  frameRate(30);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id="booklet";
  canvas.mousePressed(startBuf);
  canvas.mouseReleased(freeImg);

  frameP = createP();

  for(let i=0; i<windowSize; i++) {
    brightnessCats[i] = [];
  }

  img.loadPixels();
  pixelData = img.pixels;
  brightnessData = findBrightness(pixelData);
  pixelsToBins(brightnessData);

  fftimg = createImage(img.width, img.height);
  fftimg.loadPixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function findBrightness(pixArray) {
  var data = [];
  for(let i=0; i<pixArray.length; i+= 4){
    var r = pixArray[i];
    var g = pixArray[i+1];
    var b = pixArray[i+2];
    var hsv = RGBtoHSV(r, g, b);
    var c = color(hsv.h, hsv.s, hsv.v);
    var val = brightness(c);
    data.push(val);
  }
  return data;
}

function RGBtoHSV(r, g, b) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return { h: h, s: s, v: v };
}




function pixelsToBins(brightnessData) {
  var bandSize = brightnessRange/windowSize;

  for (let i=0; i<brightnessData.length; i++){

    for (let j=0; j<windowSize; j++){
      var lowbound = bandSize*j;
      var highbound = bandSize*(j+1);
      if(lowbound<brightnessData[i] && brightnessData[i]<highbound){
        brightnessCats[j].push(i);
        break;
      }
    }

  }
  console.log(brightnessCats);
}


function draw() {
  background(0);

  var mess1 = random([-3,3]);
  var mess2 = random([-3,3]);
  var mess3 = random([-3,3]);
  for (let j=0; j<brightnessCats.length; j++) {
    for(let i=0; i<brightnessCats[j].length; i++) {
      var index = brightnessCats[j][i]*4;
      fftimg.pixels[index] = pixelData[index] + mess1;
      fftimg.pixels[index+1] = pixelData[index+1] + mess2;
      fftimg.pixels[index+2] = pixelData[index+2] + mess3;
      fftimg.pixels[index+3] = bins[j]*255;
    }
  }

  fftimg.updatePixels();
  image(fftimg, 0, 0, windowWidth, windowHeight);

  frameP.html(floor(frameRate()));
}
