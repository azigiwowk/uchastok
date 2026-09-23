"use strict";
// An elevation and symbolic section driven by the same facade data as the 3D scene.
// No profile pitch, fixing or structural dimension is a construction specification.
function drawFacadeSheet() {
  const content = document.querySelector("#drawing-modal .modal-content");
  content.style.maxWidth = "1000px";
  const modal = document.getElementById("drawing-modal");
  let sheet = document.getElementById("v6-facade-sheet");
  if (!sheet) {
    sheet = document.createElement("canvas");
    sheet.id = "v6-facade-sheet";
    sheet.style.cssText =
      "display:block;width:100%;max-width:970px;margin:18px auto;border:1px solid #d4dacf;border-radius:8px";
    modal.querySelector("#drawing-canvas").parentElement.before(sheet);
  }
  const dpr = Math.min(devicePixelRatio || 1, 2),
    W = 970,
    H = 430;
  sheet.width = W * dpr;
  sheet.height = H * dpr;
  const c = sheet.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const f = FRONT_SERVICE_PLAN,
    h = currentFenceDimensions(),
    gate = gateGeometry(),
    x = (m) => 30 + (m / CONFIG.plot.w) * 900;
  const floor = 249,
    top = floor - h.frontHeight * 68,
    ral = "#403a3a";
  c.fillStyle = "#f8faf8";
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#263b36";
  c.font = "bold 17px system-ui";
  c.fillText("РАССВЕТНАЯ  /  ФАСАД УЧАСТКА", 30, 31);
  c.font = "12px system-ui";
  c.fillStyle = "#627369";
  c.fillText(
    "25,001 м  ·  рабочий вариант: RAL 8019  ·  высота " +
      h.frontHeight.toFixed(1) +
      " м",
    30,
    53,
  );
  c.fillStyle = "#e3e8e5";
  c.fillRect(0, floor, W, 35);
  c.fillStyle = "#bdc4bb";
  c.fillRect(0, floor + 35, W, 2);
  const slats = (a, b, layers) => {
    const count = Math.max(1, Math.round((h.frontHeight - 0.12) / 0.11));
    for (let layer = layers - 1; layer >= 0; layer--) {
      c.strokeStyle = layer ? "#837a76" : ral;
      c.lineWidth = layer ? 4 : 4.8;
      c.globalAlpha = layer ? 0.68 : 0.95;
      for (let i = 0; i < count; i++) {
        const y =
          floor -
          11 -
          i * ((floor - top - 16) / (count - 1 || 1)) +
          layer * 3.2;
        c.beginPath();
        c.moveTo(x(a) + 2, y);
        c.lineTo(x(b) - 2, y);
        c.stroke();
      }
    }
    c.globalAlpha = 1;
  };
  for (const [a, b] of [
    [0, f.wicket.start],
    [gate.end, f.trash.x - f.trash.w / 2],
    [f.trash.x + f.trash.w / 2, CONFIG.plot.w],
  ])
    slats(a, b, 2);
  const gateShift = appState.gateOpen ? f.gate.opening : 0;
  slats(f.wicket.start, f.wicket.start + f.wicket.width, 1);
  slats(gate.start + gateShift, gate.end + gateShift, 1);
  if (!appState.trashOpen)
    slats(f.trash.x - f.trash.w / 2, f.trash.x + f.trash.w / 2, 1);
  else {
    c.fillStyle = "#315146";
    c.fillRect(x(f.trash.x - 0.38), floor - 57, 20, 57);
    c.fillRect(x(f.trash.x + 0.18), floor - 57, 20, 57);
    c.fillStyle = "#667971";
    c.fillRect(x(f.trash.x - 0.4), floor - 61, 23, 6);
    c.fillRect(x(f.trash.x + 0.16), floor - 61, 23, 6);
  }
  // Structural posts are a planning grid; exact position/foundation remain provisional.
  for (const [a, b] of [
    [0, f.wicket.start],
    [gate.end, f.trash.x - f.trash.w / 2],
    [f.trash.x + f.trash.w / 2, CONFIG.plot.w],
  ])
    for (let i = 0, n = Math.max(1, Math.ceil((b - a) / 2.5)); i <= n; i++) {
      const xx = x(a + ((b - a) * i) / n);
      c.fillStyle = ral;
      c.fillRect(xx - 2, top - 5, 4, floor - top + 5);
    }
  c.fillStyle = ral;
  c.fillRect(
    x(f.pillar.x - f.pillar.w / 2),
    top - 4,
    x(f.pillar.x + f.pillar.w / 2) - x(f.pillar.x - f.pillar.w / 2),
    floor - top + 4,
  );
  c.fillStyle = "#f6e9c8";
  c.font = "bold 13px system-ui";
  c.fillText("7", x(f.pillar.x) - 3, top + 27);
  c.strokeStyle = "#211f1e";
  c.lineWidth = 2;
  for (const a of [
    f.wicket.start,
    f.wicket.start + f.wicket.width,
    gate.start,
    gate.end,
    f.trash.x - f.trash.w / 2,
    f.trash.x + f.trash.w / 2,
  ]) {
    c.beginPath();
    c.moveTo(x(a), top - 11);
    c.lineTo(x(a), floor + 8);
    c.stroke();
  }
  c.font = "11px system-ui";
  c.fillStyle = "#334640";
  c.fillText("КАЛИТКА", x(f.wicket.start) - 10, floor + 18);
  c.fillText("ПИЛОН", x(f.pillar.x) - 17, top - 17);
  c.fillText("ВОРОТА →", x(gate.start) + 37, floor + 18);
  c.fillText("МУСОР / ВЫКАТ", x(f.trash.x) - 47, floor + 18);
  c.setLineDash([5, 4]);
  c.strokeStyle = "#d08b47";
  c.beginPath();
  c.moveTo(x(gate.end), floor - 10);
  c.lineTo(x(gate.openEnd + 0.5), floor - 10);
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = "#8a6547";
  c.font = "11px system-ui";
  c.fillText("Откат + хвост + сервисный запас", x(16.8), floor - 22);
  c.fillStyle = "#334640";
  c.font = "bold 13px system-ui";
  c.fillText("ПРИНЦИП РАЗРЕЗА  /  ДВА СМЕЩЁННЫХ СЛОЯ", 30, 312);
  c.fillStyle = "#718279";
  c.font = "11px system-ui";
  c.fillText(
    "Условная Z-образная ламель · продуваемый зазор · крепления и шаг согласовать",
    30,
    332,
  );
  const lamella = (cx, cy, color) => {
    c.lineWidth = 8;
    c.strokeStyle = color;
    c.lineCap = "square";
    c.beginPath();
    c.moveTo(cx - 54, cy - 20);
    c.lineTo(cx - 12, cy - 20);
    c.lineTo(cx + 17, cy + 14);
    c.lineTo(cx + 54, cy + 14);
    c.stroke();
  };
  lamella(180, 370, "#403a3a");
  lamella(350, 382, "#756963");
  c.strokeStyle = "#92a5a6";
  c.lineWidth = 1;
  c.setLineDash([4, 4]);
  c.beginPath();
  c.moveTo(225, 370);
  c.lineTo(310, 370);
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = "#64736c";
  c.fillText("слой 1", 142, 414);
  c.fillText("воздушный зазор", 229, 355);
  c.fillText("слой 2", 320, 414);
  c.fillText(
    "Забор индивидуальный: проверить ветер, массу, основание и сервисный доступ.",
    515,
    368,
  );
  c.fillText("Рабочая схема · не монтажный чертёж.", 515, 390);
  return sheet;
}
BernV6.showFacade = () => {
  openDrawingModal();
  drawFacadeSheet();
  document
    .getElementById("v6-facade-sheet")
    .scrollIntoView({ block: "nearest" });
};
