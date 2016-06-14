# Office Golf

We had an office golf day at work ([FiveFriday](http://fivefriday.com)) and I made an over engineered hole.

Video - [https://youtu.be/NmKq1DJiZMA](https://youtu.be/NmKq1DJiZMA)
<iframe width="560" height="315" src="https://www.youtube.com/embed/NmKq1DJiZMA" frameborder="0" allowfullscreen></iframe>

I used some lego, servos, a switch, an arduino and a bit of code. Check out the code, fyi it's a bit rough didn't spend too much time on it.
Used a switch to trigger a basic game people had to play. Then depending on how you did the ball would drop out far or near to the hole.

I used [johnny-five](http://johnny-five.io/) and [http://expressjs.com/](express) to handle the arduino backend. [Pixi.js](https://github.com/pixijs/pixi.js) for the game.

To run the code (why would you?):
- Connect up the arduino and lego inputs and outputs just the way I did it - LOL
- Install [Node](https://nodejs.org/en/)
- Install [arduino IDE](https://www.arduino.cc/en/Main/Software)
- Upload firmata to the arduino
- npm Install
- gulp
- node .
- Then you good to go
