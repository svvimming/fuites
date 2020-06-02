var scl = 50;
var rows, cols;
var lattice = [];
var fr;
var sandpile = 700;
var imgRatio;

function preload() {
  purplePatch = loadImage('assets/light-purple-patch.png'); //1
  bluePatch = loadImage('assets/blue-patch.png'); //2
  yellowPatch = loadImage('assets/yello-patch.png'); //3
  redPatch = loadImage('assets/rednesspatch.png'); //4
}

function setup() {
  frameRate(200);
  let cnv = createCanvas(sandpile, sandpile);
  cnv.parent('sketch-holder');
  cols = floor(sandpile/scl);
  rows = floor(sandpile/scl);
  // fr = createP('');
  // fr.parent('links');

  for (let x = 0; x < cols; x++) {
    lattice[x] = []; // create nested array
    for (let y = 0; y < rows; y++) {
      lattice[x][y] = 0;
    }
  }

  imgRatio = floor(purplePatch.width/sandpile);
}


function addgrain() {
  genX = floor(random(0, cols));
  genY = floor(random(0, rows));
  lattice[genX][genY] += 1;
}

function colorLattice() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (lattice[x][y]==1){
        push();
        image(purplePatch, x*scl, y*scl, scl, scl, x*scl*imgRatio, y*scl*imgRatio, scl*imgRatio, scl*imgRatio);
        pop();
      } else if (lattice[x][y]==2){
        push();
        image(bluePatch, x*scl, y*scl, scl, scl, x*scl*imgRatio, y*scl*imgRatio, scl*imgRatio, scl*imgRatio);
        pop();
      } else if (lattice[x][y]==3){
        push();
        image(yellowPatch, x*scl, y*scl, scl, scl, x*scl*imgRatio, y*scl*imgRatio, scl*imgRatio, scl*imgRatio);
        pop();
      } else if (lattice[x][y]==4){
        push();
        image(redPatch, x*scl, y*scl, scl, scl, x*scl*imgRatio, y*scl*imgRatio, scl*imgRatio, scl*imgRatio);
        pop();
      } else if (lattice[x][y]==0){
        push();
        fill('#ffffff');
        noStroke();
        rect(x*scl, y*scl, scl, scl);
        pop();
      }
    }
  }
}

function draw() {
  lattice[0]= new Array(rows).fill(0);
  lattice[cols-1] = new Array(rows).fill(0);

  for(i=0;i<cols; i++){
    lattice[i][0] = 0;
    lattice[i][rows-1] = 0;
  }
  var merged = [].concat.apply([], lattice);
  if (merged.includes(4)){
    for (let x = 1; x < cols-1; x++) {
      for (let y = 1; y < rows-1; y++) {
        if (3<lattice[x][y]){
          lattice[x][y]=0;
          lattice[x-1][y]+=1;
          lattice[x][y-1]+=1;
          lattice[x+1][y]+=1;
          lattice[x][y+1]+=1;
        }
      }
    }
  } else {
    addgrain();
  }

  colorLattice();
  // fr.html("frames/second: "+floor(frameRate()));
}
