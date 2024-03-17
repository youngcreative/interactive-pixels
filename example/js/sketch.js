//------------------------------------------
// Global variables
let video;
let poseNet;
let pose;
let skeleton;
let animCanvas;

// Sound
let song;

// Options
let logPoses = false;
let drawSkeleton = false;
let drawAllPoints = false;

//------------------------------------------
// Setup

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('sketch-container');

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

  // Load music
  song = loadSound("assets/lucky_dragons_-_power_melody.mp3");
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

    // Draw black overlay on canvas
    fill(0, 0, 0, 215);
    rect(0, 0, 640, 480);

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
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke("white");
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }


  image(animCanvas, 0, 0); // Draw animation canvas
  if (random(1) < 0.08) {
    // Clear randomly
    animCanvas.clear();
  }
  drawDiagnosticInfo(); // Call framerate function
}


//------------------------------------------
// Toggle song when mouse is pressed.

  function mousePressed() {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
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
  fill("grey");
  textFont("Verdana");
  textSize(12);
  text("FPS: " + int(frameRate()), 40, 30);
}
