let canvas = document.getElementById("screen");
let context = canvas.getContext("2d");

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

let player = {
  position:[2.5, 2.5],
  direction:[1, 0],
  plane:[0, 0.5],
  fov:30
};

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let data = {1:[255, 255, 255]};

let heldKeys = [];

function handleKeyUp(e) {
  while (heldKeys.includes(e.keyCode)) {
    heldKeys.splice(heldKeys.indexOf(e.keyCode));
  }
}

function handleKeyDown(e) {
  if (!heldKeys.includes(e.keyCode)) {
    heldKeys.push(e.keyCode);
  }
}

function handleControls() {
  let angle = 0
  if (heldKeys.includes(37)) {
    angle = -0.01
  }
  if (heldKeys.includes(39)) {
    angle = 0.01
  }
  if (angle !== 0) {
    player.direction = rotateVector(player.direction, angle);
    player.plane = rotateVector(player.plane, angle);
  }
  //player.direction = rotateVector(player.direction, Math.PI / 4);
  //player.plane = rotateVector(player.plane, Math.PI / 4);
}

function rotateVector(v, angle) {
  [x, y] = v;
  angle = Math.atan2(y, x) + angle;
  magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return [Math.cos(angle) * magnitude, Math.sin(angle) * magnitude];
}

function addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function subtractVectors(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function multiplyVector(v, c) {
  return [v[0] * c, v[1] * c];
}

function render() {
  const width = canvas.width;
  const height = canvas.height;

  let step = multiplyVector(player.direction, 0.01);

  //console.log("position: " + player.position)
  //console.log("direction: " + player.direction);
  //console.log("step: " + step);
  //console.log("plane: " + player.plane);

  context.fillStyle = "black"
  context.fillRect(0, 0, width, height);

  for (let x = 0; x < width; x++) {
    let ratio = 2 * (x / width) - 1;
    let step = multiplyVector(rotateVector(player.direction, player.fov * ratio / 100), 0.01);
    //console.log("ratio " + ratio);
    //[startX, startY] = addVectors(player.position, multiplyVector(player.plane, ratio))
    [startX, startY] = player.position;
    //console.log(startX, startY);

    let rx = startX;
    let ry = startY;

    while (map[Math.floor(rx)][Math.floor(ry)] == 0) {
      rx += step[0];
      ry += step[1];
      //console.log(rx, ry);
    }

    let dist = Math.sqrt(Math.pow(startX - rx, 2) + Math.pow(startY - ry, 2));
    let distFactor = (1 / dist);
    //console.log("dist " + dist)
    let columnHeight = Math.floor(height * distFactor);
    let padding = Math.floor(Math.max(height - columnHeight, 0) / 2);

    [r, g, b] = data[map[Math.floor(rx)][Math.floor(ry)]];
    r *= distFactor;
    g *= distFactor;
    b *= distFactor;

    context.beginPath();
    context.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    context.moveTo(x, padding);
    context.lineTo(x, height - padding);
    context.stroke();
  }

}

function gameLoop() {

  handleControls();

  render();

  requestAnimationFrame(gameLoop);
}

gameLoop();
