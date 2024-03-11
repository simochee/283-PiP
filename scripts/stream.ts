/** @file Canvas を Video にストリーミングする */
const video = document.createElement("video");

// setup
video.id = "__283player";
video.muted = true;

if (document.getElementById(video.id)) {
  throw new Error("video element already exists");
}

// hide
video.style.position = "absolute";
video.style.width = "0";
video.style.height = "0";

// append
document.body.appendChild(video);

// capture canvas
const canvas = document.querySelector("canvas");

video.srcObject = canvas?.captureStream() ?? null;
video.play();
