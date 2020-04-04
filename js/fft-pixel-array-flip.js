var source;
var divisions = 3;
var subsections = Math.pow(divisions, 2);
var imgBufs = [];
var imgPixels = [];
var fftimg;
var canvas;
var pixelData = [];
var brightnessData = [];
var brightnessCats = [];
var brightnessRange = 0.4;
var ssIndex = 0;
var imgIndex = 0;
var hold = false;
var trackID;
var idLetters = [];
//all
var reggie =  /^[a-z0-9]+$/i;
//none
var regged =  /[^a-z0-9]+$/i;

function preload() {
  source = loadImage(imagePath);
}

function setup() {
  frameRate(30);
  canvas = createCanvas(600, 600);
  canvas.parent('sketch-holder');
  canvas.id="booklet";
  canvas.mousePressed(holdImg);
  canvas.mouseReleased(freeImg);

  // var metaDataWords = trackID.split(" ");

  // for(let i=0; i<metaDataWords.length; i++){
  //   idLetters = metaDataWords[i][0].push;
  // }

  console.log(trackID);

  // frameP = createP();
  // source.loadPixels();

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
  }

  fftimg = createImage(imgBufs[0].width, imgBufs[0].height);
  fftimg.loadPixels();

  pixelData = imgPixels[0];

  showButtons();
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
function reeg(n){
    var fl = reggie.exec(n);
    return fl;
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

function fetchMetaData() {
  $.getJSON( 'https://mondayfiles.airtime.pro/api/live-info', function( data ) {
    trackID = data.current.name;
  });
  if (typeof trackID == 'string' || typeof trackID == "string") {
    idLetters = [];
    var words = split(trackID, " ");
    for (let i=0; i<words.length; i++){
      var tarrr = [];
      var fl = reeg(words[i]);
      console.log("ola" + fl);
      if(fl === null){
        break;
      } else {
        var t = split(words[i], "");
        tarrr.push(t[0]);

          
        console.log("tarra " + tarrr);
      }
      idLetters.push(tarrr[0]);
      console.log("idLetters " + idLetters)

      // idLetters[i] =
    }
  } else {
    console.log('not a string');
  }
  console.log([trackID, words]);
}

function holdImg() {
  hold = true;
}

function freeImg() {
  hold = false;
}

function draw() {
  clear();

  if(frameCount % 150 == 0) {
    fetchMetaData();
  }

  if(!hold){
    imgIndex = floor(constrain(level*9, 0, 8.999));
  }
  pixelData = imgPixels[imgIndex];

  for (let j=0; j<brightnessCats[imgIndex].length; j++) {
    for(let i=0; i<brightnessCats[imgIndex][j].length; i++) {
      var index = brightnessCats[imgIndex][j][i]*4;
      fftimg.pixels[index] = pixelData[index];
      fftimg.pixels[index+1] = pixelData[index+1];
      fftimg.pixels[index+2] = pixelData[index+2];
      fftimg.pixels[index+3] = bins[j]*255;
    }
  }

  fftimg.updatePixels();
  image(fftimg, 0, 0, 600, 600);
}
