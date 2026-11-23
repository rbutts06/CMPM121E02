export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const queue = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
let x = 2;
let y = 2;
let commandQueue: Command[] = [];
let direction = 0;

interface Command {
  name: string;
  execute(): void;
}

interface Direction {
  heading: string;
  dx: number;
  dy: number;
}

const directions: Direction[] = [
  { heading: "North", dx: 0, dy: -1 },
  { heading: "East", dx: 1, dy: 0 },
  { heading: "South", dx: 0, dy: 1 },
  { heading: "West", dx: -1, dy: 0 },
];

class right implements Command {
  name: string = "Right";
  execute(): void {
    direction = (direction + 1) % 4;
    drawRover();
  }
}

class forward implements Command {
  name: string = "Forward";
  execute(): void {
    const currectDirection: Direction = directions[direction];
    x = Math.max(0, Math.min(4, x + currectDirection.dx));
    y = Math.max(0, Math.min(4, y + currectDirection.dy));
    drawRover();
  }
}

const moveForward: Command = new forward();
const rotateRight: Command = new right();

function clearQueue() {
  commandQueue = [];
  queue.textContent = "Empty";
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].heading
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  if (commandQueue.length == 0) queue.textContent = "";
  commandQueue.push(moveForward);
  queue.textContent += "Forward ";
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  if (commandQueue.length == 0) queue.textContent = "";
  commandQueue.push(rotateRight);
  queue.textContent += "Right ";
};

document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  for (const command of commandQueue) {
    command.execute();
  }
  clearQueue();
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  clearQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  clearQueue();
  drawRover();
};
drawRover();
