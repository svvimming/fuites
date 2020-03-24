var img;
var image_array = [];
var canvas;
var dwidth = 900;
var dheight = 600;
var pathnames = [
  '../images/blurb/IMG_4273.JPG',
  '../images/blurb/IMG_4274.JPG',
  '../images/blurb/IMG_4275.JPG',
  '../images/blurb/IMG_4276.JPG',
  '../images/blurb/IMG_4277.JPG',
  '../images/blurb/IMG_4278.JPG',
  '../images/blurb/IMG_4280.JPG',
  '../images/blurb/IMG_4281.JPG',
  '../images/IMG_20200317_165928.jpg'
];

function preload() {
  for(let i=0; i<pathnames.length; i++){
    image_array[i] = loadImage(pathnames[i]);
  }
  console.log(image_array);
  frameRate(30);
}

function setup() {
  canvas = createCanvas(dwidth, dheight);
  canvas.id="booklet";
  canvas.mousePressed(startBuf);
  canvas.mouseReleased(freeImg);
  // imageMode(CENTER);
}

function draw() {
  clear();

  // index = floor(constrain(8*2*level, 0, 7.999));
  var index = floor(constrain(8*3*level, 0, 8.999));
  // console.log(index);
  image(image_array[index], 0, 0, dwidth, dheight, level*floor(1456/2), level*floor(2562/2), (level*(-1)+1)*4000, (level*(-1)+1)*4000);
}
