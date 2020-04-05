var source;
var divisions = 3;
var subsections = Math.pow(divisions, 2);
var imgBufs = [];
var fftBufs = [];
var imgPixels = [];
var canvas;
var pixelData = [];
var brightnessData = [];
var brightnessCats = [];
var brightnessRange = 0.4;
var ssIndex = 0;
var imgIndex = 0;
var flip = 0;

function preload() {
  source = loadImage(imagePath);
}

function setup() {
  frameRate(fr);
  canvas = createCanvas(600, 600);
  canvas.parent('sketch-holder');
  canvas.id="booklet";
  canvas.mousePressed(startBuf);
  canvas.mouseReleased(freeImg);

  frameP = createP();

  for(let j=0; j<sqrt(subsections); j++){
    for(let i=0; i<sqrt(subsections); i++){
      imgBufs[ssIndex] = source.get(
        floor(i*source.width/sqrt(subsections)),
        floor(j*source.height/sqrt(subsections)),
        floor(source.width/sqrt(subsections)),
        floor(source.height/sqrt(subsections))
      );
      ssIndex++;
    }
  }

  for(let i=0; i<imgBufs.length; i++){
    imgBufs[i].loadPixels();
    imgPixels[i] = imgBufs[i].pixels;
    brightnessData[i] = findBrightness(imgPixels[i]);
    brightnessCats[i] = pixelsToBins(brightnessData[i]);
    fftBufs[i] = createImage(imgBufs[0].width, imgBufs[0].height);
    fftBufs[i].loadPixels();
  }
  pixelData = imgPixels[0];
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

function pixelsToBins(arrayIn) {
  var bandSize = brightnessRange/windowSize;
  var array2DOut = [];
  for(let i=0; i<windowSize; i++) {
    array2DOut[i] = [];
  }
  for (let i=0; i<arrayIn.length; i++){

    for (let j=0; j<windowSize; j++){
      var lowbound = bandSize*j;
      var highbound = bandSize*(j+1);
      if(lowbound<arrayIn[i] && arrayIn[i]<highbound){
        array2DOut[j].push(i);
        break;
      }
    }

  }
  return array2DOut;
}

function fftMapping(imageIndex, alpha) {
  var fftbuf;
  fftbuf = fftBufs[imageIndex];
  // fftbuf.loadPixels();
  var pixelDat;
  pixelDat = imgPixels[imageIndex];
  for (let j=0; j<brightnessCats[imageIndex].length; j++) {
    for(let i=0; i<brightnessCats[imageIndex][j].length; i++) {
      var index = brightnessCats[imageIndex][j][i]*4;
      fftbuf.pixels[index] = pixelDat[index];
      fftbuf.pixels[index+1] = pixelDat[index+1];
      fftbuf.pixels[index+2] = pixelDat[index+2];
      fftbuf.pixels[index+3] = floor(bins[j]*255*alpha);
    }
  }
  fftbuf.updatePixels();
  return fftbuf;
}

function draw() {
  clear();

  if(player.state == 'stopped'){
    textSize(24);
    fill(58, 20, 247);
    textStyle(ITALIC);
    text('click', 300, 300);
  }

  if(!hold) {
    flip = constrain(level*9, 0, 8.999);
  }
  for(let i=0; i<imgBufs.length; i++) {
    if(i<=flip && flip<=(i+windowSine)) {
      var alpha = sin((PI/windowSine)*(flip-i));
      var img = fftMapping(i, alpha);
      image(img, 0, 0, 600, 600);
    }
  }

  // frameP.html(letsee);
}
