var img;
var image_array;
var canvas;
var dwidth = 1200;
var dheight = 800;

function preload() {
  img = loadImage('../images/IMG_20200320_195336.jpg');
  frameRate(30);
}

function setup() {
  canvas = createCanvas(dwidth, dheight);
  // imageMode(CENTER);
}

function draw() {
  background(255);
  var pixels = random(2, 25);
  image(img, 0, 0, dwidth, dheight, level*floor(1456/2), level*floor(2562/2), level*2000, level*2000);
}
