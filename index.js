var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var cors = require('cors');
var _ = require('lodash');
var Q = require('q');
var openurl = require("openurl");

//leaving everything in 1 main file
var five = require("johnny-five"),
    board = new five.Board();

var ledPin = 8, inPin = 9, servoOnePin = 10, servoTwoPin = 11;

var servoOne, servoTwo;

board.on("fail", function(event) {
  console.log("%s sent a 'fail' message: %s", event.class, event.message);
});

var app = express();

var port = process.env.PORT || 3800;

var router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//frontend in public
app.use(express.static('public'));

//simple route to see if we all good
router.route('/info').get(function(req, res) {
  res.send({error: false, message:'Hello World'});
});

//center the servos for testing
router.route('/center').get(function(req, res) {
  servoOne.center(true);
  servoTwo.center(true);
  res.send({error: false, message:'Servos centered'});
});

//zero things to be ready for the golf to start
router.route('/reset').get(function(req, res) {
  servoOne.to(20);
  servoTwo.to(10);
  res.send({error: false, message:'Hole reset!'});
});

//general route to move the servo
router.route('/servo-one/:arg').get(function(req, res) {
  if(req.params.arg === 'sweep'){
    servoOne.sweep();
    res.send({error: false, message:'Sweeping!!'});
  }else if (isNaN(req.params.arg) === false) {
    servoOne.to(req.params.arg);
    res.send({error: false, message:'Moving to ' + req.params.arg});
  }else{
    res.send({error: true, message:'Nothing happening ' + req.params.arg});
  }
});

//general route to move the servo
router.route('/servo-two/:arg').get(function(req, res) {
  if(req.params.arg === 'sweep'){
    servoTwo.sweep();
    res.send({error: false, message:'Sweeping!!'});
  }else if (isNaN(req.params.arg) === false) {
    servoTwo.to(req.params.arg);
    res.send({error: false, message:'Moving to ' + req.params.arg});
  }else{
    res.send({error: true, message:'Nothing happening ' + req.params.arg});
  }
});

board.on("ready", function() {
  console.log("board good to go, look for stobe");
  var led = new five.Led(ledPin);
  led.strobe();

  servoOne = new five.Servo({
    id: "servoOne",     // User defined id
    pin: servoOnePin,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"]
    }
  });

  servoTwo = new five.Servo({
    id: "servoTwo",     // User defined id
    pin: servoTwoPin,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"]
    }
  });

  var button = new five.Button(inPin);

  button.on("press", function() {
    console.log( "Button pressed" );
    //open the game on the screen, probably could do it better with socketio
    openurl.open('http://localhost:'+port);
  });


  app.use('/api', router);
  app.listen(port);
  console.log('server running on port ' + port);

});
