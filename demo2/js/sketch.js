//------------------------------------------
// Global variables
let video;
let poseNet;
let pose;
let skeleton;
let animCanvas;

// Sound
let osc, fft;
let synth = true;

// Colour overlay
let overlayOpac = 127;
let overlayCol = 0;

// Options
let logPoses = false;
let drawSkeleton = true;
let drawAllPoints = false;

//------------------------------------------
// Setup

function setup() {
  createCanvas(640, 480);

  // Create extra layer for animation
  animCanvas = createGraphics(640, 480);
  animCanvas.clear();

  // Load video
  video = createCapture(VIDEO);
  video.style("transform", "scale(-1,1)");
  video.hide();

  // Load ml5
  poseNet = ml5.poseNet(video, { flipHorizontal: true }, modelLoaded);
  poseNet.on("pose", gotPoses);

  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(0.5);

  fft = new p5.FFT();
  osc.start();
}

//------------------------------------------
// Confirm PoseNet model is working

function gotPoses(poses) {
  if (logPoses == true) {
    console.log(poses);
  }
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("PoseNet ready");
}

//------------------------------------------
// Draw

function draw() {
  drawMirroredVideo(0, 0);

  if (pose) {
    // Determine distance from camera by measuring distance between eyes
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    // Draw circle on nose
    // fill("red");
    // ellipse(pose.nose.x, pose.nose.y, d);

    // Draw circles on wrists
    // fill("blue");
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, d / 3);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, d / 3);

    // Estimate position of hands
    let rightElbowV1 = createVector(pose.rightElbow.x, pose.rightElbow.y);
    let rightWristV2 = createVector(pose.rightWrist.x, pose.rightWrist.y);
    let leftElbowV1 = createVector(pose.leftElbow.x, pose.leftElbow.y);
    let leftWristV2 = createVector(pose.leftWrist.x, pose.leftWrist.y);

    let rightHand = p5.Vector.lerp(rightElbowV1, rightWristV2, 1.6);
    let leftHand = p5.Vector.lerp(leftElbowV1, leftWristV2, 1.6);

    // Draw colour overlay on canvas
    overlayCol = map(leftHand.x, 0, height, 0, 100);
    overlayOpac = map(rightHand.y, 0, width, 0, 100);

    push();
    colorMode(HSL, 100);
    fill(overlayCol, 100, 50, overlayOpac);
    rect(0, 0, 640, 480);
    pop();

    // Draw circles on hands
    fill("blue");
    strokeWeight(0);
    ellipse(rightHand.x, rightHand.y, d / 3);
    ellipse(leftHand.x, leftHand.y, d / 3);

    // Draw all possible PoseNet points on body
    if (drawAllPoints == true) {
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill("lime");
        ellipse(x, y, d / 3);
      }
    }

    // Draw skeleton on body
    if (drawSkeleton == true) {
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke("white");
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }

  image(animCanvas, 0, 0);

  if (pose) {
    if (synth == true) {
      playOscillator();
    }
  }
  drawDiagnosticInfo(); // Call framerate function
}

//------------------------------------------
// Oscillator functions

function playOscillator() {
  let freq = map(pose.rightWrist.x, 0, width, 600, 40);
  osc.freq(freq);

  let amp = map(pose.rightWrist.y, 0, height, 1, 0.01);
  osc.amp(amp);
}

//------------------------------------------
// Mirror video
// function from https://editor.p5js.org/MOQN/sketches/wqwqgf--h

function drawMirroredVideo(x, y) {
  push();
  // Position the video
  translate(x, y);
  // Flip it horizontally
  translate(video.width, 0);
  scale(-1, 1);
  // Draw the video at the origin position
  image(video, 0, 0);
  pop();
}

//------------------------------------------
// Draw framerate

function drawDiagnosticInfo() {
  noStroke();
  fill("black");
  textFont("Verdana");
  textSize(12);
  text("FPS: " + int(frameRate()), 40, 30);
}
