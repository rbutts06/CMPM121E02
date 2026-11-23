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
  balance: number;
}

interface bar {
  text: string;
  quantity: number;
  color: string;
}

function update() {
  const shiftResults: shiftReport = calculateShift(workers);
  ui(shiftResults);
}

function calculateShift(workers: number): shiftReport {
  const production = workers * 3;
  const consumption = 6;
  const supplyBalance = production - consumption;

  const result = {
    production: production,
    consumption: consumption,
    workers: workers,
    balance: supplyBalance,
  };
  return result;
}

function ui(results: shiftReport) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.workers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.workers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.workers} / 6`, 18, 76);
  const bars: bar[] = [
    {
      text: "Production",
      quantity: results.production,
      color: "#27766b",
    },
    {
      text: "Consumption",
      quantity: results.consumption,
      color: "#a44d23",
    },
  ];

  bars.forEach((bar, index) => {
    const textY = 102 + index * 52;
    const barY = textY + 8;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${bar.text}: ${bar.quantity}`, 18, textY);

    ctx.fillStyle = bar.color;
    ctx.fillRect(18, barY, bar.quantity * 14, 20);
  });

  readout.textContent =
    `Assigned: ${workers}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${results.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  workers = Math.max(0, workers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  workers = Math.min(6, workers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    workers = 2;
    update();
  };
update();
