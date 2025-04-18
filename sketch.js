let faceMesh;
let cam, video;
let playing = false;
let faces = [];
let options = { maxFaces: 2, refineLandmarks: false, flipHorizontal: false };
let hueValue = 0; // Initial hue value
let circleVisible = false; // Flag to check if the circle is visible
let alphaValue = 255; // Alpha (transparency) value, starts fully opaque

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(1080, 1920);
 // colorMode(HSB, 360, 100, 100, 255); // Set color mode to HSB with alpha support
  video = createVideo(['YourGazeCompletesMe_v03.mp4']);
  //video.loop();
  video.hide()


  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  faceMesh.detectStart(cam, gotFaces);
}

function draw() {

  //image(cam, 0, 0, width, height);
  image(video, 0,0,1080,1920);
  fill(0,0,0,255-alphaValue)
  rect(0,0,width,height)

  circleVisible = false; // Reset visibility flag for each frame

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    noStroke();
    //fill(hueValue, 100, 100); // Use hueValue for gradient color

    let noseP = face.keypoints[4];
    let lEye = face.keypoints[33];
    let rEye = face.keypoints[263];
    let topP = face.keypoints[10];

    let mockZ = topP.y - noseP.y;

    if (noseP.x > lEye.x && noseP.x < rEye.x) {
      // circle(noseP.x, noseP.y, mockZ / 5);
      circleVisible = true; // Circle is visible
    }
  }

  // Adjust alpha value based on circle visibility
  if (circleVisible) {

    alphaValue = min(alphaValue + 2, 255); // Gradually increase alpha up to 255
    hueValue = (hueValue + 0.1) % 360; // Increment hueValue for the gradient effect
  } else {
    alphaValue = max(alphaValue - 0.5, 0); // Gradually decrease alpha down to 0
  }

  if(alphaValue <= 0){
    video.pause();
  } else{
    if(!playing){
      video.loop()
    }
  }

  // Draw the center circle with updated alpha
  noStroke();
  // fill(hueValue, 100, 100, alphaValue); // Use alphaValue for transparency
  let centerX = width / 2;
  let centerY = height / 2;
  let circleSize = 300; // Constant size for the circle
 // circle(centerX, centerY, circleSize);
}

function gotFaces(results) {
  faces = results;
}

function mousePressed() {
  // When the canvas is clicked, check to see if the videos are
  // paused or playing. If they are playing, pause the videos.
  if (playing) {
    video.pause();
  } else {
    // If they are paused, play the videos.
    video.loop();
  }

  // Change the playing value to the opposite boolean.
  playing = !playing;
}
