# Drumkit.cloud
An interactive motion capture drumkit for DG8002 Digital Media Environments  
by Michael J. Young, Mingao Sun, Kwaku Poku-Dankwa

## Goals
1. Build an interactive motion capture art installation
	- Use motion to drive animation
	- Use motion to control sound / create a simple synthesizer
2. Use a digital projector and webcam to capture motion and project the artwork
3. Integrate other interactive objects within the scene (stretch goal).

## Technology Stack:
1. [P5js](https://p5js.org) for graphics and sound
2. [ml5 PoseNet](https://learn.ml5js.org/#/reference/posenet) for simplified gesture detection
3. Native web languages (HTML, CSS, JavaScript)

## Initial demos
Demo 1: [https://editor.p5js.org/michaeljyoung/sketches/tHIqARunp](https://editor.p5js.org/michaeljyoung/sketches/tHIqARunp)    
Demo 2: [https://editor.p5js.org/Satomeguri/sketches/O931ktdMR](https://editor.p5js.org/Satomeguri/sketches/O931ktdMR)
Demo 3: [https://editor.p5js.org/michaeljyoung/sketches/flxZAwaVI](https://editor.p5js.org/michaeljyoung/sketches/flxZAwaVI)  

## Reference
- [ml5.js Pose Estimation with PoseNet - The Coding Train](https://www.youtube.com/watch?v=OIo-DIOkNVg)  
- [Use lerp() to estimate hand positions using the elbow and wrist](https://forum.processing.org/two/discussion/21445/given-two-points-vectors-plot-a-3rd-so-all-three-can-be-bisected-by-a-straight-line.html)
- [User interaction to iniate sound in modern browsers](https://stackoverflow.com/questions/63152115/p5-js-wont-working-without-user-interaction)

## Notes and recommendations
In building this project, we initially planned on using Google Mediapipe as an AI motion capture model (you can see an example of this in [demo 2](https://editor.p5js.org/Satomeguri/sketches/O931ktdMR)). However, since Mediapipe is intended to interpret gestures, we found PoseNet as a lightweight alternative with a faster response time.
