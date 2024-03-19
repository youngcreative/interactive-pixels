// Don't change the names of these global variables.
let myHandLandmarker;
let myPoseLandmarker;
let myFaceLandmarker;
let handLandmarks;
let poseLandmarks;
let faceLandmarks;
let myCapture;
let lastVideoTime = -1;
let song;

// For landmarks you want, set to true; set false the ones you don't.
// Works best with just one or two sets of landmarks.
const trackingConfig = {
  doAcquireHandLandmarks: true,
  doAcquirePoseLandmarks: false,
  doAcquireFaceLandmarks: true,
  doAcquireFaceMetrics: true,
  poseModelLiteOrFull: "lite", /* "lite" (3MB) or "full" (6MB) */
  cpuOrGpuString: "GPU", /* "GPU" or "CPU" */
  maxNumHands: 2,
  maxNumPoses: 1,
  maxNumFaces: 1,
};

//------------------------------------------
async function preload() {
  const mediapipe_module = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js');
  
  HandLandmarker = mediapipe_module.HandLandmarker
  PoseLandmarker = mediapipe_module.PoseLandmarker
  FaceLandmarker = mediapipe_module.FaceLandmarker
  FilesetResolver = mediapipe_module.FilesetResolver
  
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm"
  );

  if (trackingConfig.doAcquireHandLandmarks){
    myHandLandmarker = await HandLandmarker.createFromOptions(vision, {
      numHands: trackingConfig.maxNumHands,
      runningMode: "VIDEO",
      baseOptions: {
        delegate: trackingConfig.cpuOrGpuString,
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      },
    });
  }
  
  if (trackingConfig.doAcquireFaceLandmarks){
    myFaceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      numFaces: trackingConfig.maxNumFaces,
      runningMode: "VIDEO",
      outputFaceBlendshapes:trackingConfig.doAcquireFaceMetrics,
      baseOptions: {
        delegate: trackingConfig.cpuOrGpuString,
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
    });
  }
}

//------------------------------------------
async function predictWebcam() {
  let startTimeMs = performance.now();
  if (lastVideoTime !== myCapture.elt.currentTime) {
    if (trackingConfig.doAcquireHandLandmarks && myHandLandmarker) {
      handLandmarks = myHandLandmarker.detectForVideo(myCapture.elt,startTimeMs);
    }
    if (trackingConfig.doAcquireFaceLandmarks && myFaceLandmarker) {
      faceLandmarks = myFaceLandmarker.detectForVideo(myCapture.elt,startTimeMs);
    }
    lastVideoTime = myCapture.elt.currentTime;
  }
  window.requestAnimationFrame(predictWebcam);
}

function setup() {
  createCanvas(640, 480);
  myCapture = createCapture(VIDEO);
  myCapture.size(320, 240);
  myCapture.hide();
  song = loadSound('assets/lucky_dragons_-_power_melody.mp3'); // 加载音频文件
}

function draw() {
  background("black");
  predictWebcam();
  drawVideoBackground();
  drawHandPoints();
  drawFacePoints();
  drawFaceMetrics();
  drawDiagnosticInfo();
}

//------------------------------------------
function drawVideoBackground() {
  push();
  translate(width, 0);
  scale(-1, 1);
  tint(255, 255, 255, 20);
  image(myCapture, 0, 0, width, height);
  tint(255);
  pop();
}

//------------------------------------------
function setup() {
  createCanvas(640, 480);
  myCapture = createCapture(VIDEO);
  myCapture.size(320, 240); 
  myCapture.hide();
  song = loadSound('assets/lucky_dragons_-_power_melody.mp3'); // Load audio file
}

function draw() {
  background(20); 
  predictWebcam();
  drawVideoBackground();
  drawHandPoints();
  drawFacePoints();
  drawFaceMetrics();
  drawDiagnosticInfo();
}

function drawHandPoints() {
  if (trackingConfig.doAcquireHandLandmarks) {
    if (handLandmarks && handLandmarks.landmarks) {
      const nHands = handLandmarks.landmarks.length;
      if (nHands > 0) {
        for (let h = 0; h < nHands; h++) {
          let joints = handLandmarks.landmarks[h];
          for (let i = 0; i <= 20; i++) {
            let px = joints[i].x;
            let py = joints[i].y;
            px = map(px, 0, 1, width, 0);
            py = map(py, 0, 1, 0, height);

            
            let randomSize = random(5, 20);

            // Draw glowing effect
            let glowColor = color(255, 255, 255, 100);
            fill(glowColor);
            noStroke();
            let glowRadius = randomSize + 10;
            ellipse(px, py, glowRadius);

          
            let pointColor = color(255);
            fill(pointColor);
            noStroke();
            let pointRadius = randomSize;
            ellipse(px, py, pointRadius);
          }
        }
      }
    }
  }
}



//------------------------------------------
function drawFacePoints() {
  if (trackingConfig.doAcquireFaceLandmarks) {
    if (faceLandmarks && faceLandmarks.faceLandmarks) {
      const nFaces = faceLandmarks.faceLandmarks.length;
      if (nFaces > 0) {
        for (let f = 0; f < nFaces; f++) {
          let aFace = faceLandmarks.faceLandmarks[f];
          if (aFace) {
            let nFaceLandmarks = aFace.length;
            
            noFill();
            stroke("white");
            strokeWeight(1.0);
            for (let i = 0; i < nFaceLandmarks; i++) {
              let px = aFace[i].x;
              let py = aFace[i].y
 px = map(px, 0, 1, width, 0);
              py = map(py, 0, 1, 0, height);
              circle(px, py, 1);
            }
            
            noFill();
            stroke("white");
            strokeWeight(2.0);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LIPS);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS);
            drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS);
          
          }
        }
      }
    }
  }
}

function drawFaceMetrics(){
  if (trackingConfig.doAcquireFaceLandmarks && 
      trackingConfig.doAcquireFaceMetrics){
    if (faceLandmarks && faceLandmarks.faceBlendshapes) {
      const nFaces = faceLandmarks.faceLandmarks.length;
      for (let f = 0; f < nFaces; f++) {
        let aFaceMetrics = faceLandmarks.faceBlendshapes[f];
        if (aFaceMetrics){
          
          fill('white'); 
          textSize(7); 
          let tx = 40; 
          let ty = 40; 
          let dy = 8.5;
          let vx0 = tx-5; 
          let vx1 = tx-35;
          
          let nMetrics = aFaceMetrics.categories.length; 
          for (let i=1; i<nMetrics; i++){
            let metricName = aFaceMetrics.categories[i].categoryName;
            noStroke();
            text(metricName, tx,ty); 
            
            let metricValue = aFaceMetrics.categories[i].score;
            let vx = map(metricValue,0,1,vx0,vx1);
            stroke(0,0,0); 
            strokeWeight(2.0); 
            line(vx0,ty-2, vx,ty-2); 
            stroke(0,0,0,20);
            line(vx0,ty-2, vx1,ty-2); 
            ty+=dy;
          }
        }
      }
    }
  }
}

function drawConnectors(landmarks, connectorSet) {
  if (landmarks) {
    let nConnectors = connectorSet.length;
    for (let i=0; i<nConnectors; i++){
      let index0 = connectorSet[i].start; 
      let index1 = connectorSet[i].end;
      let x0 = map(landmarks[index0].x, 0,1, width,0);
      let y0 = map(landmarks[index0].y, 0,1, 0,height);
      let x1 = map(landmarks[index1].x, 0,1, width,0);
      let y1 = map(landmarks[index1].y, 0,1, 0,height);
      line(x0,y0, x1,y1); 
    }
  }
}

//------------------------------------------
function drawDiagnosticInfo() {
  noStroke();
  fill("white");
  textSize(12); 
  text("FPS: " + int(frameRate()), 40, 30);
}