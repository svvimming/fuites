var video, bubbles, cam, scene, renderer, material;
var rotationRates = [];
var thingies;

for(let i=0; i<20; i++) {
  rotationRates[i] = Math.floor(Math.random()*5);
}

init();
animate();

function init() {

  cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  cam.position.y = 400;

  scene = new THREE.Scene();

  var object;
  thingies = new THREE.Object3D();


  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  cam.add( pointLight );
  scene.add( cam );

  video = document.getElementById( 'bubbly' );
  video.play();

  bubbles = new THREE.VideoTexture( video );

  var parameters = { color: 0xffffff, map: bubbles };

  var material = new THREE.MeshPhongMaterial( parameters );

  for(let i=0; i<20; i++) {
    object = new THREE.Mesh( new THREE.SphereBufferGeometry( 75, 20, 10 ), material );
    object.position.set( Math.floor(Math.random()*400), Math.floor(Math.random()*100), Math.floor(Math.random()*400) );
    var size = (Math.random()) + 0.01;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    object.scale.x = size;
    object.scale.y = size;
    object.scale.z = size;
    thingies.add( object );
  }
  scene.add( thingies);

  container = document.getElementById( 'container' );
  document.body.appendChild( container );

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );


  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  var timer = Date.now() * 0.0001;

  cam.position.x = Math.cos( timer ) * 800;
  cam.position.z = Math.sin( timer ) * 800;

  cam.lookAt( scene.position );

  for(var i=0; i<20; i++) {
    thingies.children[i].rotation.x = timer * rotationRates[i];
    thingies.children[i].rotation.y = timer * rotationRates[i] *2;
  }
  renderer.render( scene, cam );
}
