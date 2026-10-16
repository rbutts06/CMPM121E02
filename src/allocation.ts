export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let workers = 2;

interface shiftReport {
  production: number;
  consumption: number;
  workers: number;
}
const shift: shiftReport = {
  production: workers * 3,
  consumption: 6,
  workers: 2,
};

interface bar {
  text: string;
  fontY: number;
  color: string;
  y: number;
}

const bars: bar[] = [{
  text: `Production: ${shift.production}`,
  fontY: 102,
  color: "#27766b",
  y: 110,
}, {
  text: `Consumption: ${shift.consumption}`,
  fontY: 154,
  color: "#a44d23",
  y: 162,
}];

function resourcePlan(shift: shiftReport) {
  const supplyBalance = shift.production - shift.consumption;

  readout.textContent =
    `Assigned: ${workers}/6 · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      supplyBalance > 0 ? "+" : ""
    }${supplyBalance}`;
  ui();
}

function ui() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < workers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < workers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${workers} / 6`, 18, 76);
  for (let i = 0; i < bars.length; i++) {
    makeBar(bars[i]);
  }
}

function makeBar(bars: bar) {
  ctx.fillStyle = bars.color;
  ctx.fillRect(18, bars.y, shift.consumption * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(bars.text, 18, bars.fontY);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  workers = Math.max(0, workers - 1);
  resourcePlan(shift);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  workers = Math.min(6, workers + 1);
  resourcePlan(shift);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    workers = 2;
    resourcePlan(shift);
  };
resourcePlan(shift);
