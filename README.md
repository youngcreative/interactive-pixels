# Drumkit.cloud
An interactive motion capture drumkit for DG8002 Digital Media Environments  
by Michael J. Young, Mingao Sun, Kwaku Poku-Dankwa

[View this sketch in the P5js online editor.](https://editor.p5js.org/michaeljyoung/sketches/yWhQSiiDT)  

## Goals
1. Build an interactive motion capture art installation
	- Use motion to drive animation
	- Use motion to control sound / create a simple synthesizer or instrument  
2. Use a digital projector and webcam to capture motion and project the artwork
3. Integrate interactive objects within the scene.

## Technology Stack:
1. [P5js](https://p5js.org) for graphics and sound
2. [ml5 PoseNet](https://learn.ml5js.org/#/reference/posenet) for simplified gesture detection
3. Native web languages (HTML, CSS, JavaScript)

### Initial demos
Demo 1: [https://editor.p5js.org/michaeljyoung/sketches/tHIqARunp](https://editor.p5js.org/michaeljyoung/sketches/tHIqARunp)    
Demo 2: [https://editor.p5js.org/Satomeguri/sketches/O931ktdMR](https://editor.p5js.org/Satomeguri/sketches/O931ktdMR)
Demo 3: [https://editor.p5js.org/michaeljyoung/sketches/flxZAwaVI](https://editor.p5js.org/michaeljyoung/sketches/flxZAwaVI)  

## Reference
- [ml5.js Pose Estimation with PoseNet - The Coding Train](https://www.youtube.com/watch?v=OIo-DIOkNVg) 
- [Particle Emitter System – The Nature of Code by Daniel Shiffman](https://natureofcode.com/particles/) 
- [Use lerp() to estimate hand positions using the elbow and wrist](https://forum.processing.org/two/discussion/21445/given-two-points-vectors-plot-a-3rd-so-all-three-can-be-bisected-by-a-straight-line.html)
- [User interaction to iniate sound in modern browsers](https://stackoverflow.com/questions/63152115/p5-js-wont-working-without-user-interaction)  
- [Particle system following an object](https://editor.p5js.org/MAKE/sketches/cr7tCaAg9)  

## Notes and recommendations
In building this project, we initially planned to use Google Mediapipe as an AI motion capture model (you can see this example in [demo 2](https://editor.p5js.org/Satomeguri/sketches/O931ktdMR)). However, since Mediapipe is best suited for interpreting gestures, we found PoseNet to be a lightweight alternative with a faster response time.

### Issues
Displaying the fullscreen canvas is not working, as the webcam video output is scaled inconsistently with the rest of the canvas. A possible remedy is to [create the canvas using WEBGL](https://p5js.org/reference/#/p5/createCanvas) at VGA or SVGA resolution and then scale it using the [resizeCanvas function](https://p5js.org/reference/#/p5/resizeCanvas). A working example is [karts-posenet-drawing_a](https://editor.p5js.org/sojamo/sketches/03S3DVkFl) by [sojamo](https://editor.p5js.org/sojamo/sketches); however, the PoseNet implementation is different, and the current sketch would require substantial changes.
