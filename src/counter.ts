export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

interface shield {
  health: number;
  max: number;
  missing: number;
}
const shieldMax = 10;

const shieldEvents = new EventTarget();

function shieldSnap(): shield {
  return {
    health: count,
    max: shieldMax,
    missing: shieldMax - count,
  };
}

shieldEvents.addEventListener("shield-changed", (event) => {
  const shield = (event as CustomEvent<shield>).detail;
  drawMeter(shield);
});

function drawMeter(snapshot: shield) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shieldMax; i++) {
    ctx.fillStyle = i < snapshot.health ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.health} / ${snapshot.max} shield`, 12, 100);
  readout.textContent = `Shield charge: ${snapshot.health} / 10`;
}

function updateStats(snapshot: shield) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: shield) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.health} · Missing charge: ${snapshot.missing}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(shieldMax, next));
  if (bounded === count) return;
  count = bounded;
  const snapshot = shieldSnap();
  shieldEvents.dispatchEvent(
    new CustomEvent("shield-changed", {
      detail: snapshot,
    }),
  );
  if (panel) updateStats(snapshot);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(shieldSnap());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(shieldSnap());
