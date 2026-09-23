"use strict";
const DRAWING_PRESETS = {
  current: { title: "Текущие слои" },
  general: {
    title: "Общестроительный генплан",
    layers: {
      buildings: true,
      paths: true,
      fence: true,
      reference: true,
      dimensions: true,
      objectLabels: true,
    },
  },
  electrician: {
    title: "Электрик",
    layers: {
      reference: true,
      nodes: true,
      comms: true,
      electric: true,
      lighting: true,
      lowvoltage: true,
      sleeves: true,
      servicePoints: true,
      engineeringLabels: true,
    },
  },
  watersewer: {
    title: "Вода / канализация",
    layers: {
      reference: true,
      nodes: true,
      comms: true,
      water: true,
      sewer: true,
      stormwater: true,
      drainage: true,
      serviceZones: true,
      engineeringLabels: true,
    },
  },
  fence: {
    title: "Заборщики",
    layers: {
      reference: true,
      fence: true,
      fenceLabels: true,
      dimensions: true,
      snow: true,
      sleeves: true,
      comms: true,
      electric: true,
      lowvoltage: true,
    },
  },
  landscape: {
    title: "Ландшафт / полив",
    layers: {
      reference: true,
      landscape: true,
      landscapeLabels: true,
      hangingBeds: true,
      comms: true,
      irrigation: true,
      rootZones: true,
      serviceZones: true,
      paths: true,
    },
  },
};
function withSceneLayers(layers, fn) {
  const saved = {
    layers: { ...appState.layers },
    sceneMode: appState.sceneMode,
    xray: appState.xray,
  };
  appState.layers = Object.fromEntries(
    Object.keys(LAYER_DEFS).map((k) => [k, !!layers[k]]),
  );
  appState.sceneMode = "normal";
  appState.xray = false;
  applySceneState();
  try {
    return fn();
  } finally {
    Object.assign(appState, saved);
    applySceneState();
  }
}
function drawingDimensions() {
  const h = Norms.bodyBounds(Norms.obj("house")),
    b = Norms.bodyBounds(Norms.obj("bath")),
    s = Norms.bodyBounds(Norms.obj("shed")),
    gh = Norms.bodyBounds(Norms.obj("greenhouse")),
    gd = Norms.bodyBounds(Norms.obj("garden")),
    g = gateGeometry(),
    w = FRONT_SERVICE_PLAN.wicket;
  return [
    ["Дом — слева", [0, h.maxZ], [h.minX, h.maxZ]],
    ["Дом — сзади", [h.maxX, h.maxZ], [h.maxX, CONFIG.plot.d]],
    ["Дом — справа", [h.maxX, h.maxZ], [CONFIG.plot.w, h.maxZ]],
    ["Баня — справа", [b.maxX, b.maxZ], [CONFIG.plot.w, b.maxZ]],
    ["Хозблок — справа", [s.maxX, s.minZ], [CONFIG.plot.w, s.minZ]],
    ["Хозблок — фасад", [s.minX, 0], [s.minX, s.minZ]],
    ["Ворота", [g.start, -0.4], [g.end, -0.4]],
    ["Калитка", [w.start, -0.7], [w.start + w.width, -0.7]],
    ["Парковка", [12.5, 9], [16.5, 9]],
    ["Проход баня / хозблок", [22, s.maxZ], [22, b.minZ]],
    [
      "Терраса дома",
      rotateLocalPoint(
        Norms.obj("house"),
        Norms.obj("house").terrace.w / 2,
        -Norms.obj("house").d / 2 - Norms.obj("house").terrace.d,
      ),
      rotateLocalPoint(
        Norms.obj("house"),
        Norms.obj("house").terrace.w / 2,
        -Norms.obj("house").d / 2,
      ),
    ],
    ["Огород — фасад", [gd.minX, 0], [gd.minX, gd.minZ]],
    ["Теплица — слева", [0, gh.maxZ], [gh.minX, gh.maxZ]],
  ].map(([label, a, b]) => ({
    label,
    a,
    b,
    value: Math.hypot(a[0] - b[0], a[1] - b[1]),
  }));
}
function surveyRows() {
  const objects = CONFIG.objects.map((o) => {
    const b = Norms.bounds(o);
    return {
      id: o.id,
      label: o.label,
      x: o.x,
      z: o.z,
      w: o.w,
      d: o.d,
      radius: o.radius,
      rot: o.rot || 0,
      bounds: b,
    };
  });
  const p = CONFIG.infrastructure.rainCollector,
    g = gateGeometry(),
    wk = FRONT_SERVICE_PLAN.wicket;
  objects.push(
    {
      id: "gate",
      label: "Ворота",
      x: (g.start + g.end) / 2,
      z: 0,
      w: FRONT_SERVICE_PLAN.gate.opening,
      d: 0.2,
      rot: 0,
    },
    {
      id: "wicket",
      label: "Калитка",
      x: wk.start + wk.width / 2,
      z: 0,
      w: wk.width,
      d: 0.2,
      rot: 0,
    },
    {
      id: "rainCollector",
      label: "Резерв дождевой воды",
      x: p.x,
      z: p.z,
      rot: 0,
    },
  );
  const points = new Map();
  LAYOUT_PATHS.forEach((seg) =>
    [seg.a, seg.b].forEach((pt) => points.set(pt.join(","), pt)),
  );
  [...points.values()].forEach((pt, i) =>
    objects.push({
      id: "path-" + i,
      label: "Узел дорожки " + (i + 1),
      x: pt[0],
      z: pt[1],
      rot: 0,
    }),
  );
  return objects.map((o) => {
    const b = o.bounds || { minX: o.x, maxX: o.x, minZ: o.z, maxZ: o.z };
    const nearest = [
      ["слева", b.minX],
      ["справа", CONFIG.plot.w - b.maxX],
      ["фасад", b.minZ],
      ["сзади", CONFIG.plot.d - b.maxZ],
    ]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2);
    return { ...o, nearest };
  });
}
function drawScenePlan(l = effectiveLayers()) {
  const canvas = document.getElementById("drawing-canvas"),
    S = 18,
    ML = 110,
    MT = 75,
    D = CONFIG.plot.d,
    W = CONFIG.plot.w,
    cw = ML + W * S + 110,
    ch = MT + D * S + (l.nodes ? 215 : 105),
    dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = cw + "px";
  canvas.style.height = ch + "px";
  const c = canvas.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = "#fff";
  c.fillRect(0, 0, cw, ch);
  const X = (x) => ML + x * S,
    Z = (z) => MT + (D - z) * S;
  const text = (s, x, z, color = "#314747") => {
    c.fillStyle = color;
    c.font = "10px Arial";
    c.textAlign = "center";
    c.fillText(s, X(x), Z(z));
  };
  const line = (points, color, width = 1, dashed = false) => {
    c.beginPath();
    points.forEach((p, i) =>
      i ? c.lineTo(X(p[0]), Z(p[1])) : c.moveTo(X(p[0]), Z(p[1])),
    );
    c.strokeStyle = color;
    c.lineWidth = width;
    c.setLineDash(dashed ? [4, 3] : []);
    c.stroke();
    c.setLineDash([]);
  };
  const box = (z, color) => {
    c.fillStyle = color;
    c.fillRect(X(z.x - z.w / 2), Z(z.z + z.d / 2), z.w * S, z.d * S);
  };
  c.fillStyle = "#25473f";
  c.font = "bold 18px Arial";
  c.fillText("ПРОЕКТ БЕРН / MASTER v6", ML, 28);
  c.font = "11px Arial";
  c.fillText(
    (DRAWING_PRESETS[appState.drawingPreset]?.title || appState.sceneMode) +
      " • " +
      appState.sceneMode +
      " • " +
      new Date().toLocaleDateString("ru-RU"),
    ML,
    47,
  );
  if (l.reference) {
    line(
      [
        [0, 0],
        [W, 0],
        [W, D],
        [0, D],
        [0, 0],
      ],
      "#59716b",
      1.4,
    );
    text("УЛ. РАССВЕТНАЯ · 25,001 м", W / 2, -3);
    drawNorthArrow(c, cw - 47, 45);
    drawPerimeterDims(c, X, Z);
  }
  if (l.paths && phaseOpacity(5) > 0) {
    c.globalAlpha = phaseOpacity(5);
    for (const z of [
      LAYOUT_ZONES.driveway,
      LAYOUT_ZONES.parking,
      LAYOUT_ZONES.shedServicePad,
    ])
      box(z, "#d7d8d3");
    LAYOUT_PATHS.forEach((p) => line([p.a, p.b], "#c3b394", p.width * S));
    c.globalAlpha = 1;
  }
  if (l.landscape && phaseOpacity(7) > 0) {
    c.globalAlpha = phaseOpacity(7);
    box(LAYOUT_ZONES.lawn, "#dcebd6");
    LANDSCAPE_PLAN.shrubZones.forEach((z) => box(z, "#abc69b"));
    LANDSCAPE_PLAN.containers.forEach((z) => box(z, "#aa9279"));
    LANDSCAPE_PLAN.screens.forEach((z) => box(z, "#83aa87"));
    LANDSCAPE_PLAN.trees.forEach((t) => {
      c.fillStyle = "#c0dab0";
      c.beginPath();
      c.arc(X(t.x), Z(t.z), t.radius * S, 0, 2 * Math.PI);
      c.fill();
      if (l.landscapeLabels) text(t.label, t.x, t.z);
    });
    c.globalAlpha = 1;
  }
  if (l.hangingBeds && phaseOpacity(6) > 0)
    HANGING_BEDS.zones.forEach((z) => box(z, "#99b673"));
  if (l.snow) {
    [FRONT_SERVICE_PLAN.snowMain, FRONT_SERVICE_PLAN.snowRight].forEach((z) =>
      box(z, "#c3e8f6"),
    );
    box(gateGeometry().clear, "#f4dab1");
    text("Снег без соли", 2, 2.5);
    text("Откат свободен", 19.5, 0.7);
  }
  if (l.snowRoute) line(snowBlowerRoute(), "#247bc2", 2, true);
  if (l.rootZones)
    CONFIG.utilities.forEach((u) =>
      line(
        utilityPoints(u),
        "#ead7b9",
        (BernV6.project.rootBuffer ?? 0.4) * 2 * S,
      ),
    );
  if (l.serviceZones)
    serviceZones().forEach((z) => {
      c.beginPath();
      c.arc(X(z.x), Z(z.z), (z.radius ?? z.previewRadius) * S, 0, Math.PI * 2);
      c.strokeStyle = "#c59040";
      c.setLineDash([4, 3]);
      c.stroke();
      c.setLineDash([]);
      text(z.id + " · радиус " + (z.radius ?? "?"), z.x, z.z);
    });
  BernV6.drawingLayers = l;
  CONFIG.objects.forEach((o) => {
    if (!l[["well", "septic"].includes(o.id) ? "nodes" : "buildings"]) return;
    const op = phaseOpacity(PHASE_BY_ID[o.id] ?? 7);
    if (!op) return;
    c.globalAlpha =
      appState.xray && !["well", "septic"].includes(o.id) ? 0.2 : op;
    drawObject2D(c, o, X, Z, S);
    c.globalAlpha = 1;
  });
  BernV6.drawingLayers = null;
  if (l.buildings) {
    const e = houseEntry();
    line(
      [
        rotateLocalPoint(Norms.obj("house"), 0.2, -Norms.obj("house").d / 2),
        rotateLocalPoint(Norms.obj("house"), 1.2, -Norms.obj("house").d / 2),
      ],
      "#684d31",
      4,
    );
    if (l.objectLabels)
      text("Вход через террасу", e.terrace[0] + 1.5, e.terrace[1] + 0.5);
  }
  if (l.fence && phaseOpacity(5) > 0) {
    c.globalAlpha = phaseOpacity(5);
    const g = gateGeometry(),
      w = FRONT_SERVICE_PLAN.wicket;
    line(
      [
        [0, D],
        [0, 0],
      ],
      "#245442",
      2,
    );
    line(
      [
        [0, D],
        [W, D],
        [W, 0],
      ],
      "#245442",
      2,
    );
    line(
      [
        [0, 0],
        [w.start, 0],
      ],
      "#403a3a",
      4,
    );
    line(
      [
        [g.end, 0],
        [FRONT_SERVICE_PLAN.trash.x - FRONT_SERVICE_PLAN.trash.w / 2, 0],
      ],
      "#403a3a",
      4,
    );
    line(
      [
        [FRONT_SERVICE_PLAN.trash.x + FRONT_SERVICE_PLAN.trash.w / 2, 0],
        [W, 0],
      ],
      "#403a3a",
      4,
    );
    const tx = FRONT_SERVICE_PLAN.trash.x - FRONT_SERVICE_PLAN.trash.w / 2;
    line(
      [
        [tx, 0],
        appState.trashOpen
          ? [tx, -FRONT_SERVICE_PLAN.trash.w]
          : [tx + FRONT_SERVICE_PLAN.trash.w, 0],
      ],
      "#403a3a",
      2,
    );
    line(
      [
        [w.start, 0],
        [w.start + w.width, 0],
      ],
      "#403a3a",
      2,
    );
    const shift = appState.gateOpen ? FRONT_SERVICE_PLAN.gate.opening : 0;
    line(
      [
        [g.start + shift, 0.18],
        [g.end + shift, 0.18],
        [g.end + FRONT_SERVICE_PLAN.gate.tail + shift, 0.18],
      ],
      "#403a3a",
      2,
    );
    box(FRONT_SERVICE_PLAN.trash, "#9aab9f");
    box({ ...FRONT_SERVICE_PLAN.pillar, x: 12.3, z: 0 }, "#403a3a");
    if (l.fenceLabels)
      text(
        "2 слоя / " + currentFenceDimensions().frontHeight + " м · RAL 8019",
        5,
        1,
      );
    c.globalAlpha = 1;
  }
  if (l.nodes) {
    const pp = CONFIG.infrastructure.powerPole;
    text("⚡", pp.x, pp.z);
    const rc = CONFIG.infrastructure.rainCollector;
    c.beginPath();
    c.arc(X(rc.x), Z(rc.z), 0.6 * S, 0, Math.PI * 2);
    c.strokeStyle = "#008a99";
    c.stroke();
    if (l.engineeringLabels) text("Дождевой резерв", rc.x, rc.z + 1);
  }
  CONFIG.utilities
    .filter((u) => l[u.system])
    .forEach((u) => {
      line(
        utilityPoints(u),
        "#" + u.color.toString(16).padStart(6, "0"),
        1.5,
        u.status === "assumption",
      );
      if (l.engineeringLabels) {
        const m = routeMidPoint(utilityPoints(u));
        text(u.name, m[0], m[1]);
      }
    });
  if (l.sleeves)
    SLEEVES.filter((s) => l[s.system]).forEach((s) => {
      line([s.start, s.end], "#967fc3", 2, true);
      if (l.engineeringLabels) text(s.id, s.end[0], s.end[1]);
    });
  if (l.servicePoints)
    SERVICE_POINTS.forEach((p) => {
      const a = objectAnchorPoint(Norms.obj(p.obj), { side: p.side });
      text("●", ...a, "#b18b38");
    });
  if (l.lighting)
    SITE_LIGHT_POINTS.forEach((p) => text("●", p.x, p.z, "#a77813"));
  if (l.lowvoltage)
    SECURITY_POINTS.forEach((p) => text("■", p.x, p.z, "#7653a3"));
  if (l.dimensions)
    drawingDimensions().forEach((d, i) => {
      line([d.a, d.b], "#876c63", 0.6);
      text(
        d.value.toFixed(2),
        (d.a[0] + d.b[0]) / 2 + 0.25,
        (d.a[1] + d.b[1]) / 2 + 0.25,
      );
    });
  if (l.vehicle) {
    const v = BernV6.project.vehicle;
    [-3, 2, 6].forEach((z) =>
      box({ x: 14.5, z, w: v.width ?? 1.9, d: v.length ?? 4.7 }, "#badde188"),
    );
  }
  for (const key of ["privacy", "cameraSectors", "diff"])
    if (l[key])
      v6Groups[key].traverse((o) => {
        if (!o.isLine) return;
        const a = o.geometry.attributes.position;
        const pts = [];
        for (let i = 0; i < a.count; i++) pts.push([a.getX(i), a.getZ(i)]);
        line(pts, key === "diff" ? "#9a9a9a" : "#977ab0", 1, true);
      });
  if (l.notes) BernV6.project.userNotes.forEach((n) => text(n.text, n.x, n.z));
  c.textAlign = "left";
  c.fillStyle = "#666";
  c.font = "10px Arial";
  c.fillText(
    "Локальные X/Z в метрах. Не геодезический вынос. Схемы и резервы требуют рабочего проекта.",
    30,
    ch - 25,
  );
  return canvas;
}
BernV6.drawPlan = drawScenePlan;
function openDrawingPreset(id) {
  const elevation = document.getElementById("v6-facade-sheet");
  if (elevation) elevation.remove();
  appState.drawingPreset = id;
  const p = DRAWING_PRESETS[id];
  if (p.layers) {
    appState.previousScene ??= {
      layers: { ...appState.layers },
      activeView: appState.activeView,
    };
    appState.sceneMode = "normal";
    appState.layers = {
      ...Object.fromEntries(Object.keys(LAYER_DEFS).map((k) => [k, false])),
      ...p.layers,
    };
    applySceneState();
  }
  openDrawingModal();
}
function budgetRows() {
  return buildSmeta().map((r, i) => {
    const id = r.name;
    const saved = BernV6.project.budget[id] || {};
    const phase = /Дом «/.test(r.name)
      ? 3
      : /Баня|Хозблок|Навес/.test(r.name)
        ? 4
        : /Забор|Ворота|Калитка|Дорожки/.test(r.name)
          ? 5
          : /Огород|Теплица|Полив/.test(r.name)
            ? 6
            : /Газон|Детская|Костров/.test(r.name)
              ? 7
              : 2;
    return {
      ...r,
      id,
      phase,
      plannedCost: r.total,
      actualCost: null,
      status: "assumption",
      source:
        "Ориентировочные цены существующей модели; не предложение подрядчика",
      ...saved,
    };
  });
}
function budgetTotals(rows = budgetRows()) {
  const plan = rows.reduce((n, r) => n + r.plannedCost, 0),
    fact = rows.reduce((n, r) => n + (r.actualCost ?? 0), 0),
    withFact = rows.filter((r) => r.actualCost != null);
  return {
    plan,
    fact,
    remaining: Math.max(0, plan - fact),
    delta: withFact.reduce((n, r) => n + r.actualCost - r.plannedCost, 0),
    coverage: withFact.length + "/" + rows.length,
  };
}
function variantDiff(snapshot) {
  const before = snapshotObjectList(snapshot),
    rows = [];
  const after = CONFIG.objects;
  for (const id of new Set([
    ...before.map((o) => o.id),
    ...after.map((o) => o.id),
  ])) {
    const a = before.find((o) => o.id === id),
      b = after.find((o) => o.id === id);
    const delta = {
      id,
      status: !a ? "added" : !b ? "removed" : "changed",
      dx: a && b ? b.x - a.x : null,
      dz: a && b ? b.z - a.z : null,
      size: a && b ? [b.w - a.w, b.d - a.d] : null,
      rotation: a && b ? (b.rot || 0) - (a.rot || 0) : null,
    };
    if (!a || !b || objectSignature(a) !== objectSignature(b)) rows.push(delta);
  }
  return rows;
}
function compareVariant(name) {
  const snap = loadVariants()[name]?.snapshot || loadVariants()[name];
  if (!snap) {
    toast("Вариант не найден");
    return;
  }
  clearV6(v6Groups.diff);
  const before = snapshotObjectList(snap);
  before.forEach((o) => {
    const current = Norms.obj(o.id);
    const merged = { ...current, ...o };
    if (merged.radius) {
      v6Line(
        v6Groups.diff,
        Array.from({ length: 49 }, (_, i) => [
          merged.x + merged.radius * Math.cos((i * Math.PI) / 24),
          merged.z + merged.radius * Math.sin((i * Math.PI) / 24),
        ]),
        0x949b9c,
        0.2,
        true,
      );
    } else {
      const pts = Norms.bodyCorners(merged).map((p) => [p.x, p.z]);
      v6Line(v6Groups.diff, [...pts, pts[0]], 0x949b9c, 0.2, true);
    }
  });
  BernV6.diffRows = variantDiff(snap);
  BernV6.utilityDiff = (snap.utilities || []).map((u) => {
    const pts = u.route.map((a) =>
      a.obj
        ? objectAnchorPoint(
            before.find((o) => o.id === a.obj) || Norms.obj(a.obj),
            a,
          )
        : a.infrastructure
          ? [
              (snap.infrastructure || CONFIG.infrastructure)[a.infrastructure]
                .x,
              (snap.infrastructure || CONFIG.infrastructure)[a.infrastructure]
                .z,
            ]
          : [a.x, a.z],
    );
    const old = pts.reduce(
        (n, p, i) =>
          n + (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0),
        0,
      ),
      live = CONFIG.utilities.find((x) => x.name === u.name);
    v6Line(v6Groups.diff, pts, 0xaaaaaa, 0.15, true);
    return {
      name: u.name,
      before: old,
      after: live ? utilityLength(live) : null,
    };
  });
  setLayer("diff", true);
}
BernV6.exportPDF = async function () {
  const snapshot = { ...appState, layers: { ...appState.layers } };
  DOM.pdfLoader.classList.add("active");
  try {
    const scope = appState.pdfScope,
      preset = DRAWING_PRESETS[scope];
    if (scope === "master")
      appState.layers = {
        ...SCENE_PRESETS.normal,
        comms: true,
        engineeringLabels: false,
        dimensions: true,
      };
    else if (preset?.layers)
      appState.layers = {
        ...Object.fromEntries(Object.keys(LAYER_DEFS).map((k) => [k, false])),
        ...preset.layers,
      };
    if (scope !== "current") {
      appState.sceneMode = "normal";
      appState.xray = false;
    }
    applySceneState();
    const c = drawScenePlan(),
      doc = new window.jspdf.jsPDF("p", "mm", "a4");
    doc.addImage(
      c.toDataURL("image/png"),
      "PNG",
      10,
      10,
      190,
      (190 * c.height) / c.width,
    );
    renderer.render(scene, camera);
    doc.addPage("a4", "l");
    doc.addImage(
      renderer.domElement.toDataURL("image/png"),
      "PNG",
      10,
      12,
      277,
      Math.min(
        180,
        (277 * renderer.domElement.height) / renderer.domElement.width,
      ),
    );
    // Keep the existing detailed report available in the full MASTER package.
    if (scope === "master") {
      DOM.pdfReport.innerHTML = buildReportHTML();
      const report = await html2canvas(DOM.pdfReport, {
        scale: 1.5,
        backgroundColor: "#fff",
        width: 780,
        logging: false,
      });
      const sliceH = Math.floor((report.width * 277) / 190);
      for (let y = 0; y < report.height; y += sliceH) {
        const page = document.createElement("canvas");
        page.width = report.width;
        page.height = Math.min(sliceH, report.height - y);
        page
          .getContext("2d")
          .drawImage(
            report,
            0,
            y,
            page.width,
            page.height,
            0,
            0,
            page.width,
            page.height,
          );
        doc.addPage("a4", "p");
        doc.addImage(
          page.toDataURL("image/png"),
          "PNG",
          10,
          10,
          190,
          (190 * page.height) / page.width,
        );
      }
    }
    doc.save("Bern-v6-" + scope + ".pdf");
    return true;
  } catch (e) {
    toast("PDF не создан: " + e.message, 5000);
    throw e;
  } finally {
    Object.assign(appState, snapshot);
    applySceneState();
    DOM.pdfLoader.classList.remove("active");
  }
};
