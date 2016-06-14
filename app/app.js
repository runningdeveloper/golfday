//Using pixijs
var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container(),
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
    Graphics = PIXI.Graphics;
    TextureCache = PIXI.utils.TextureCache;
    Rectangle = PIXI.Rectangle;
    Text = PIXI.Text;

var ball, fire, wall;
var frameCount = 0;
//when should the end hole show up
var endTime = 45;
var endFlag = false;
var holeFlag = false;
var green = null;

var walls = [];
var wallReady = true;

var infoMessage;

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

//Tell the `renderer` to `render` the `stage`
//renderer.render(stage);

var b = new Bump(PIXI);

var state = play;
var holdUp = false;
var holdRight = false;
var holdLeft = false;
var crashFlag = false;

//keyboard function for pixijs
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function getFramesForTime(time){
  var frames = 60*time;
  return frames;
}

//promise to load images, probably overdone with promise
var loadImages = function (urls) {
  return new Promise(function(resolve, reject) {
    loader
      .add(urls)
      .load(function () {
          console.log(urls);
          resolve(urls);
      });
  });
};

var makeNewImage = function (img) {
    return new Sprite(resources[img].texture);
};

function setup() {
  console.log('im in setup');
  ball = makeNewImage('img/ball.png');
  fire = makeNewImage('img/fire.png');

  var message = new Text(
    "Reload Here",
    {font: "42px sans-serif", fill: "red"}
  );
  message.position.set(0, 0 );
  message.interactive = true;
  message.on('mousedown', function (val) {
    reload();
  });
  stage.addChild(message);

  var infoMessage = new Text(
    "Use up, left, right\nWatch out for walls, sides and bottom\nAim for the green hole",
    {font: "42px sans-serif", fill: "white"}
  );
  infoMessage.position.set(200, 300 );
  stage.addChild(infoMessage);

  stage.addChild(ball);

  stage.addChild(fire);

  ball.anchor.x = 0.5;
  ball.anchor.y = 0.5;
  ball.position.set(200, ball.height);
  fire.anchor.x = 0.5;
  fire.position.set(ball.x, ball.y + ball.height/2);
  fire.visible = false;

   //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Up
  up.press = function() {
    holdUp = true;
    fire.visible = true;
    fire.rotation = 0;
  };

  up.release = function() {
    fire.visible = false;
    holdUp = false;
  };

  left.press = function() {
    holdLeft = true;
    fire.visible = true;
    fire.rotation = -0.5;
  };

  left.release = function() {
    holdLeft = false;
    fire.visible = false;
  };

  right.press = function() {
    holdRight = true;
    fire.visible = true;
    fire.rotation = 0.5;
  };

  right.release = function() {
    holdRight = false;
    fire.visible = false;
  };

  gameLoop();
}

function gameLoop() {

  requestAnimationFrame(gameLoop);

  state();

  //Render the stage to see the animation
  renderer.render(stage);
}

function play(){
  frameCount++;
  if(frameCount > getFramesForTime(endTime) && !endFlag){
    //show the end
    console.log('at the end');
    green = makeNewImage('img/green.png');
    green.position.set(renderer.width-green.width, _.random(renderer.height-green.height));
    stage.addChild(green);
    endFlag = true;
  }

  if(_.random(10)>5 && wallReady && green === null){
    //make a wall wallsRow
    var wall = makeNewImage('img/wall.png');
    wall.position.set(renderer.width-wall.width, _.random(renderer.height));
    walls.push(wall);
    stage.addChild(wall);
  }

  if(green !== null){
    ball.circular = true;
    green.circular = true;
    if(b.hit(ball, green)){
      state = hole;
      return;
    }
  }

  var wallFull = 0;
  _.forEach(walls, function(aWall, index){
    ball.circular = true;
    if(b.hit(ball, aWall)){
      console.log("hit this");
      state = crash;
      return;
    }
    aWall.x -= 0.5;
    if(aWall.x < 0 ){
      stage.removeChild(aWall);
      walls.splice(index, 1);
    }
    if(aWall.x + aWall.width > renderer.width-aWall.width){
      wallFull++;
    }
    // wallReady = true
  });
  if(wallFull===0){
    wallReady = true;
  }else{
    wallReady = false;
  }

  ball.rotation += 0.1;
  ball.y += 1;
  fire.position.set(ball.x, ball.y + ball.height/2);
  //infoMessage.x -= 2;

  if(ball.x + ball.width/2 > renderer.width-200){
    console.log("Hit right");
    ball.x -= 2;
    return;
  }

  if(holdUp === true){
    ball.y -= 2;
  }
  if(holdRight === true){
    ball.x += 2;
    ball.y -= 2;
  }
  if(holdLeft === true){
    ball.x -= 2;
    ball.y -= 2;
  }

  if(ball.y < 0){
    console.log("Hit the top");
    state = crash;
  }

  if(ball.y > renderer.height){
    console.log("Hit the bottom");
    state = crash;
  }

  if(ball.x < 0){
    console.log("Hit the left");
    state = crash;
  }

}

function reload() {
  var jqxhr = $.ajax( "http://localhost:3800/api/reset" )
    .done(function() {
      console.log("reset done");
    })
    .fail(function() {
      console.log("reset error");
    });
  location.reload();
}

function crash(){
  if(crashFlag !== true){
    var message = new Text(
      "Crash!\n(Ball Drop - far away haha)",
      {font: "62px sans-serif", fill: "white"}
    );
    message.position.set(renderer.width/2 - message.width/2, renderer.height/2 );
    stage.addChild(message);
      var jqxhr = $.ajax( "http://localhost:3800/api/servo-two/180" )
        .done(function() {
          console.log("reset done");
        })
        .fail(function() {
          console.log("reset error");
        });
  }else{
    crashFlag = true;
    return;
  }
}

function hole(){
  if(holeFlag !== true){
    var message = new Text(
      "Nice!!\n(Ball Drop)",
      {font: "62px sans-serif", fill: "white"}
    );
    message.position.set(renderer.width/2 - message.width/2, renderer.height/2 );
    stage.addChild(message);
      var jqxhr = $.ajax( "http://localhost:3800/api/servo-one/180" )
        .done(function() {
          console.log("reset done");
        })
        .fail(function() {
          console.log("reset error");
        });
  }else{
    holeFlag = true;
    return;
  }
}

loadImages(['img/ball.png', 'img/fire.png', 'img/wall.png', 'img/green.png']).then(function (value) {
  setup(value);
});
