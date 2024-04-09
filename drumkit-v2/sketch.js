//------------------------------------------
// Global variables
let video;
let poseNet;
let pose;
let skeleton;
let animCanvas;
let drums = [];

// Sound
let p5jsAudio = false;
let drumStyle;
let styleSelect;
let kickPlayed = false;
let clapPlayed = false;
let cymbalPlayed = false;
let specialPlayed = false;
let snarePlayed = false;

// Options
let logPoses = false;
let drawSkeleton = true;
let drawAllPoints = true;
// let appWidth = windowWidth;
let appWidth = 900;
let appHeight = (appWidth * 0.75);

//------------------------------------------
// Setup

function preload() {
  preloadSounds();
}

function setup() {
  let canvas = createCanvas(appWidth, appHeight);
  canvas.parent('sketch-container');

  // Create extra layer for animation
  animCanvas = createGraphics(appWidth, appHeight);
  animCanvas.clear();

  // Load video
  video = createCapture(VIDEO);
  video.style("transform", "scale(-1,1)");
  video.size(appWidth, appHeight);
  video.hide();

  // Load ml5
  poseNet = ml5.poseNet(video, { flipHorizontal: true }, modelLoaded);
  poseNet.on("pose", gotPoses);

  // Suspend audio until user gesture
  // Turn on for
  getAudioContext().suspend();

  // Create drums
  drums.push(new Drum(width / 2, (height / 5) * 4, 66)); // Kick
  drums.push(new Drum(width / 4, (height / 5) * 2, 66)); // Clap
  drums.push(new Drum((width / 4) * 3, (height / 5) * 2, 66)); // Cymbal
  drums.push(new Drum(width / 4, (height / 5) * 3, 66)); // Snare
  drums.push(new Drum((width / 4) * 3, (height / 5) * 3, 66)); // Special

  // Initiate dropdown menu
  dropdownMenu();
  
  // Accessible description
  describe('Five black elipses are overlayed on webcam output. When your hands touch the elipses they flash white and play a sound.');
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

    // Estimate position of hands
    let rightElbowV1 = createVector(pose.rightElbow.x, pose.rightElbow.y);
    let rightWristV2 = createVector(pose.rightWrist.x, pose.rightWrist.y);
    let leftElbowV1 = createVector(pose.leftElbow.x, pose.leftElbow.y);
    let leftWristV2 = createVector(pose.leftWrist.x, pose.leftWrist.y);

    let rightHand = p5.Vector.lerp(rightElbowV1, rightWristV2, 1.6);
    let leftHand = p5.Vector.lerp(leftElbowV1, leftWristV2, 1.6);

    // Draw black overlay on canvas
    fill(0, 0, 0, 75);
    rect(0, 0, width, height);

    // Draw circles on hands
    animCanvas.fill(255, random(50, 200)); // Set a fill with random opacity
    animCanvas.stroke(255, random(50, 200)); // Set a stroke with random opacity
    let pointRadius = random(5, 20); // Set a random point radius
    animCanvas.strokeWeight(pointRadius);
    animCanvas.ellipse(rightHand.x, rightHand.y, pointRadius);

    animCanvas.fill(255, random(50, 200));
    animCanvas.stroke(255, random(50, 200));
    pointRadius = random(5, 20); // Set a different point radius
    animCanvas.strokeWeight(pointRadius);
    animCanvas.ellipse(leftHand.x, leftHand.y, pointRadius); //

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
        let b = skeleton[i][0];
        strokeWeight(2);
        stroke("white");
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }

    setDrumStyle();

    // Draw kick drum
    drums[0].show();
    if (
      drums[0].contains(rightHand.x, rightHand.y) ||
      drums[0].contains(leftHand.x, leftHand.y)
    ) {
      drums[0].changeColor(255);
      if (kickPlayed == false) {
        kick.play();
      }
      kickPlayed = true;
    } else {
      drums[0].changeColor(0);
      kickPlayed = false;
    }

    // Draw clap
    drums[1].show();
    if (
      drums[1].contains(rightHand.x, rightHand.y) ||
      drums[1].contains(leftHand.x, leftHand.y)
    ) {
      drums[1].changeColor(255);
      if (clapPlayed == false) {
        clap.play();
      }
      clapPlayed = true;
    } else {
      drums[1].changeColor(0);
      clapPlayed = false;
    }

    // Draw cymbal
    drums[2].show();
    if (
      drums[2].contains(rightHand.x, rightHand.y) ||
      drums[2].contains(leftHand.x, leftHand.y)
    ) {
      drums[2].changeColor(255);
      if (cymbalPlayed == false) {
        cymbal.play();
      }
      cymbalPlayed = true;
    } else {
      drums[2].changeColor(0);
      cymbalPlayed = false;
    }

    // Draw snare
    drums[3].show();
    if (
      drums[3].contains(rightHand.x, rightHand.y) ||
      drums[3].contains(leftHand.x, leftHand.y)
    ) {
      drums[3].changeColor(255);
      if (snarePlayed == false) {
        snare.play();
      }
      snarePlayed = true;
    } else {
      drums[3].changeColor(0);
      snarePlayed = false;
    }

    // Draw special
    drums[4].show();
    if (
      drums[4].contains(rightHand.x, rightHand.y) ||
      drums[4].contains(leftHand.x, leftHand.y)
    ) {
      drums[4].changeColor(255);
      if (specialPlayed == false) {
        special.play();
      }
      specialPlayed = true;
    } else {
      drums[4].changeColor(0);
      specialPlayed = false;
    }
  } // Close if (pose loop)

  image(animCanvas, 0, 0); // Draw animation canvas
  if (random(1) < 0.08) {
    // Clear randomly
    animCanvas.clear();
  }

  if (!p5jsAudio) {
    push();
    textSize(21);
    fill("white");
    textAlign(CENTER, CENTER);
    textFont("Arial");
    text("Click or tap the video to enable audio.", width / 2, height / 6);
    pop();

    // Accessible description
    describe('Click or tap the video to enable audio.');
  }

  drawDiagnosticInfo(); // Call framerate function
}