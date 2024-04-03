//------------------------------------------
// Preload sounds

function preloadSounds() {
  // Claps
  clapEDM = loadSound("assets/EDM/Clap.mp3");
  clapHiphop = loadSound("assets/Hiphop/Clap.mp3");
  clapLofi = loadSound("assets/Lofi/Clap.mp3");
  clapRock = loadSound("assets/Rock/Clap.mp3");
  // Cymbals
  cymbalEDM = loadSound("assets/EDM/Cymbal.mp3");
  cymbalHiphop = loadSound("assets/Hiphop/Cymbal.mp3");
  cymbalLofi = loadSound("assets/Lofi/Cymbal.mp3");
  cymbalRock = loadSound("assets/Rock/Cymbal.mp3");
  // Kick drum
  kickEDM = loadSound("assets/EDM/Kick.mp3");
  kickHiphop = loadSound("assets/Hiphop/Kick.mp3");
  kickLofi = loadSound("assets/Lofi/Kick.mp3");
  kickRock = loadSound("assets/Rock/Kick.mp3");
  // Snare
  snareEDM = loadSound("assets/EDM/Snare.mp3");
  snareHiphop = loadSound("assets/Hiphop/Snare.mp3");
  snareLofi = loadSound("assets/Lofi/Snare.mp3");
  snareRock = loadSound("assets/Rock/Snare.mp3");
  // Special
  specialEDM = loadSound("assets/EDM/Special.mp3");
  specialHiphop = loadSound("assets/Hiphop/Special.mp3");
  specialLofi = loadSound("assets/Lofi/Special.mp3");
  specialRock = loadSound("assets/Rock/Special.mp3");
}

//------------------------------------------
// Set drum style

function setDrumStyle() {
  let drumStyle = styleSelect.selected();
  if (drumStyle == "EDM") {
    kick = kickEDM;
    clap = clapEDM;
    special = specialEDM;
    snare = snareEDM;
    cymbal = cymbalEDM;
  } else if (drumStyle == "Hiphop") {
    kick = kickHiphop;
    clap = clapHiphop;
    special = specialHiphop;
    snare = snareHiphop;
    cymbal = cymbalHiphop;
  } else if (drumStyle == "Lofi") {
    kick = kickLofi;
    clap = clapLofi;
    special = specialLofi;
    snare = snareLofi;
    cymbal = cymbalLofi;
  } else if (drumStyle == "Rock") {
    kick = kickRock;
    clap = clapRock;
    special = specialRock;
    snare = snareRock;
    cymbal = cymbalRock;
  }
}
//------------------------------------------
// Dropdown menu
function dropdownMenu() {
  // Create a dropdown menu and place it on the canvas.
  styleSelect = createSelect();
  styleSelect.parent('styleSelect-container');

  // Add style options.
  styleSelect.option("Rock");
  styleSelect.option("Lofi");
  styleSelect.option("Hiphop");
  styleSelect.option("EDM");

  // Set the selected option to "Rock/Punk".
  styleSelect.selected("EDM");
}

//------------------------------------------
// Suspend audio until mouse press in canvas
function mousePressed() {
  // Start audio on user gesture
  if (!p5jsAudio) {
    userStartAudio();
    p5jsAudio = true;
  }
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
  fill("white");
  textFont("Verdana");
  textSize(12);
  text("FPS: " + int(frameRate()), 75, 15);
}
