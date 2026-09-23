"use strict";
const V6_MODES = {
  normal: "Обычный вид",
  "comms-only": "Только коммуникации",
  xray: "X-Ray",
  landscape: "Ландшафт",
  fence: "Ограждения",
  construction: "Этапы строительства",
  "clean-plan": "Чистый план",
  winter: "Зима",
  privacy: "Приватность",
  "night-facade": "Ночной фасад",
};
const V6_CATEGORIES = {
  sun: ["☀", "Солнце"],
  layout: ["✎", "Планировка"],
  measure: ["↔", "Измерения"],
  layers: ["▱", "Слои"],
  view: ["◈", "Вид"],
  analysis: ["◎", "Анализ"],
  drawings: ["▦", "Чертежи"],
  project: ["▣", "Проект"],
  export: ["↗", "Экспорт"],
};
const esc = escapeHtml;
function actionButton(id) {
  const a = UI_ACTIONS.find((x) => x.id === id);
  return a
    ? `<button class="v6-action" data-action="${esc(id)}" title="${esc(a.label)}" aria-label="${esc(a.label)}">${a.icon || ""} ${esc(a.label)}</button>`
    : "";
}
function registerLegacy(id, label, category, target, icon = "") {
  BernV6.registerAction({
    id,
    label,
    category,
    icon,
    run: () => document.getElementById(target)?.click(),
  });
}
[
  ["edit", "Перемещение объектов", "layout", "edit-mode-btn", "✋"],
  ["autofix", "Авторасстановка по нормам", "layout", "autofix-btn", "↗"],
  ["fix", "Исправить нарушения", "layout", "fixviol-btn", "✚"],
  ["undo", "Отменить", "layout", "undo-btn", "↶"],
  ["redo", "Вернуть", "layout", "redo-btn", "↷"],
  ["variants", "Варианты и сравнение", "layout", "variants-btn", "◫"],
  ["catalog", "Каталог объектов", "layout", "catalog-btn", "▦"],
  ["save", "Сохранить проект", "project", "save-layout-btn", "↓"],
  ["reset", "Сброс планировки", "project", "reset-layout-btn", "↺"],
  ["error", "Отчёт об ошибке", "analysis", "report-error-btn", "!"],
  ["distance", "Измерить расстояние", "measure", "toggle-measure", "↔"],
  ["area", "Измерить площадь", "measure", "toggle-area", "▧"],
  ["report", "Доклад по проекту", "analysis", "open-report", "▤"],
  ["houseplan", "Планы дома", "drawings", "open-plan-modal", "⌂"],
  ["legacy-budget", "Исходная смета", "analysis", "smeta-btn", "₽"],
  ["backup", "Статусы и резервные копии", "project", "project-data-btn", "▣"],
  ["json", "Скачать полный JSON", "export", "export-project-json", "↓"],
  ["import", "Загрузить JSON", "project", "import-project-json", "↑"],
  ["png", "PNG текущего вида", "export", "export-png", "▧"],
  ["pdf", "PDF выбранного комплекта", "export", "export-pdf", "▤"],
  ["solar", "Солнечные панели", "sun", "solar-btn", "▦"],
  ["insolation", "Теневой анализ", "sun", "insolation-btn", "☀"],
  ["play-day", "Проиграть день", "sun", "sun-play-btn", "▷"],
].forEach((a) => registerLegacy(...a));
BernV6.registerAction({
  id: "norms",
  label: "Проверка норм",
  category: "analysis",
  run: openNorms,
});
BernV6.registerAction({
  id: "gps",
  label: "GPS координаты",
  category: "measure",
  run: showGPS,
});
for (const [id, label] of Object.entries(V6_MODES))
  BernV6.registerAction({
    id: "mode-" + id,
    label,
    category: "view",
    run: () => {
      setSceneMode(id);
      if (["fence", "night-facade"].includes(id)) setCameraV6("facade");
    },
  });
for (const [id, cat] of Object.entries(V6_CATEGORIES))
  BernV6.registerAction({
    id: "drawer-" + id,
    label: "Открыть: " + cat[1],
    category: cat[1],
    run: () => setDrawer(id),
  });
Object.entries(DRAWING_PRESETS).forEach(([id, p]) =>
  BernV6.registerAction({
    id: "drawing-" + id,
    label: p.title + " · 2D",
    category: "drawings",
    run: () => openDrawingPreset(id),
  }),
);
BernV6.registerAction({
  id: "gate-toggle",
  label: "Открыть / закрыть ворота",
  category: "view",
  run: () => {
    appState.gateOpen = !appState.gateOpen;
    BernV6.emit();
  },
});
BernV6.registerAction({
  id: "clear-measure",
  label: "Очистить измерения",
  category: "measure",
  run: () => clearMeasure(false),
});
BernV6.registerAction({
  id: "raw-storage",
  label: "Скачать исходные сохранения",
  category: "project",
  run: () =>
    downloadJson(
      {
        raw: BernV6.legacyRaw,
        backup: localStorage.getItem("bern_pre_v6_backup"),
      },
      "Bern-original-storage.json",
    ),
});
BernV6.registerAction({
  id: "trash-toggle",
  label: "Открыть / закрыть мусорную нишу",
  category: "view",
  run: () => {
    appState.trashOpen = !appState.trashOpen;
    BernV6.emit();
  },
});
BernV6.registerAction({
  id: "facade-sheet",
  label: "Эскиз фасада и два слоя ламелей",
  category: "drawings",
  run: () => BernV6.showFacade(),
});
function setCameraV6(view) {
  appState.activeView = view;
  const positions = {
    default: [35, 30, 60],
    top: [12.5, 62, 20.001],
    facade: [29, 11, -22],
    street: [12.5, 3, -13],
  };
  const pos = positions[view] || positions.default;
  cameraTween.start(
    new THREE.Vector3(...pos),
    new THREE.Vector3(12.5, 0, view === "facade" || view === "street" ? 4 : 20),
  );
  Utils.markDirty();
  BernV6.saveUI();
}
const hiddenControls = document.createElement("div");
hiddenControls.hidden = true;
hiddenControls.id = "v6-preserved-controls";
document.body.append(hiddenControls);
hiddenControls.append(DOM.sun.panel);
DOM.sun.panel.classList.add("v6-sun");
const shell = document.createElement("div");
shell.id = "v6-shell";
shell.innerHTML = `<header class="v6-header"><div class="v6-brand"><span class="v6-mark">⌂</span><div><strong>ПРОЕКТ БЕРН</strong><small>РАССВЕТНАЯ / MASTER 06</small></div></div><div class="v6-header-actions"><span class="v6-review">FEATURE REVIEW</span><select id="v6-mode" aria-label="Режим сцены">${Object.entries(
  V6_MODES,
)
  .map(([k, v]) => `<option value="${k}">${v}</option>`)
  .join(
    "",
  )}</select><button class="v6-icon v6-search-trigger" data-search title="Поиск действий · Ctrl+K" aria-label="Поиск действий">⌕</button><button class="v6-icon v6-mobile" data-menu aria-label="Все инструменты">☰</button></div></header><nav class="v6-rail left" aria-label="Инструменты участка">${Object.entries(
  V6_CATEGORIES,
)
  .slice(0, 4)
  .map(
    ([k, [i, n]]) =>
      `<button data-drawer="${k}" title="${n}" aria-label="${n}" aria-expanded="false">${i}</button>`,
  )
  .join(
    "",
  )}</nav><nav class="v6-rail right" aria-label="Проект и документы">${Object.entries(
  V6_CATEGORIES,
)
  .slice(4)
  .map(
    ([k, [i, n]]) =>
      `<button data-drawer="${k}" title="${n}" aria-label="${n}" aria-expanded="false">${i}</button>`,
  )
  .join(
    "",
  )}</nav><aside class="v6-drawer" hidden aria-label="Панель инструментов"><div class="v6-drawer-head"><h2></h2><button class="v6-small-button" data-close aria-label="Закрыть панель">✕</button></div><div class="v6-drawer-body"></div></aside><div class="v6-footer"><span>25,001 × 40,002 м</span><span>Фасад 25 м · Рассветная</span><span id="v6-foot-status">MASTER защищён</span></div><div class="v6-legend" id="v6-legend"></div><div class="v6-search" hidden role="dialog" aria-modal="true" aria-label="Поиск действий"><div class="v6-search-card"><input id="v6-search-input" aria-label="Найти действие" placeholder="Найти действие…"><small>Ctrl+K — поиск · Escape — закрыть</small><div class="v6-search-results"></div></div></div>`;
document.body.append(shell);
const drawer = shell.querySelector(".v6-drawer"),
  drawerBody = shell.querySelector(".v6-drawer-body");
let renderedDrawer;
function field(label, id, value, opts = {}) {
  return `<label class="v6-field">${label}<input id="${id}" type="${opts.type || "number"}" value="${value ?? ""}" ${opts.type === "checkbox" ? (value ? "checked" : "") : 'step="' + (opts.step || ".1") + '"'} ${opts.min != null ? 'min="' + opts.min + '"' : ""} ${opts.max != null ? 'max="' + opts.max + '"' : ""} aria-label="${label}" ${opts.extra || ""}></label>`;
}
function section(title, body, open = false) {
  return `<details ${open ? "open" : ""}><summary>${title}</summary>${body}</details>`;
}
function buttons(ids) {
  return ids.map(actionButton).join("");
}
function layerCheckbox(k) {
  return `<label class="v6-field"><span>${LAYER_DEFS[k]}</span><input type="checkbox" data-layer="${k}" ${appState.layers[k] ? "checked" : ""}></label>`;
}
function projectContent() {
  const p = BernV6.project;
  return (
    `<p>Рабочая схема. Неопределённые параметры остаются planned / assumption.</p>${BernV6.storageError ? `<div class="v6-warn">${esc(BernV6.storageError)}</div>` : ""}` +
    section(
      "Объекты · MASTER-lock",
      CONFIG.objects
        .map(
          (o) =>
            `<div class="v6-row">${esc(o.label)} <button class="v6-small-button" data-lock="${o.id}">${isMasterLocked(o.id) ? "🔒 Разблокировать" : "○ Заблокировать"}</button><button class="v6-small-button" data-object="${o.id}">Карточка</button></div>`,
        )
        .join(""),
      true,
    ) +
    section(
      "Что требует перепроверки",
      Object.entries(p.reviews)
        .filter(([, v]) => v.status === "needs-review")
        .map(
          ([k, v]) =>
            `<div class="v6-row"><b>${esc(k)}</b> · needs-review<br><small>${esc(v.reason)}</small><button class="v6-small-button" data-reviewed="${k}">Отметить после проверки</button></div>`,
        )
        .join("") || "<p>Нет новых изменений связанных объектов.</p>",
    ) +
    section(
      "Задачи",
      p.projectTasks
        .map(
          (t) =>
            `<div class="v6-row">${esc(t.title)}<select data-task="${t.id}" aria-label="Статус ${esc(t.title)}">${["todo", "inprogress", "done", "blocked"].map((s) => `<option ${t.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>`,
        )
        .join("") +
        '<form id="v6-task-form"><input name="title" required placeholder="Новая задача" aria-label="Новая задача"><button class="v6-action">Добавить задачу</button></form>',
    ) +
    section(
      "Заметки на плане",
      p.userNotes
        .map(
          (n) =>
            `<div class="v6-row">${esc(n.text)} · X ${n.x}, Z ${n.z}<button class="v6-small-button" data-note-edit="${n.id}">Изменить</button><button class="v6-small-button" data-note-delete="${n.id}">Удалить</button></div>`,
        )
        .join("") +
        '<form id="v6-note-form"><textarea name="text" required placeholder="Текст заметки" aria-label="Текст заметки"></textarea><div class="v6-grid"><input name="x" type="number" step=".1" value="12.5" aria-label="X заметки" required><input name="z" type="number" step=".1" value="20" aria-label="Z заметки" required></div><button class="v6-action">Добавить на план</button></form>',
    ) +
    section(
      "Источники фактов",
      PROJECT_FACTS.map(
        (f) =>
          `<div class="v6-row"><b>${esc(f.label)}</b> ${statusChip(f.status)}<p>${esc(f.note)}</p><small>${esc(f.source?.sourceType || "project-history")} · ${esc(f.source?.sourceLabel || "")} · ${esc(f.source?.sourceDate || "дата неизвестна")}</small><button class="v6-small-button" data-source="${f.id}">Уточнить источник</button></div>`,
      ).join(""),
    ) +
    section(
      "Резервы / исполнительная схема",
      `<p>Design сохранён отдельно. asBuilt заполняется только по факту. Глубины, трубы и мощность EV неизвестны.</p>` +
        SLEEVES.map(
          (s) =>
            `<form class="v6-asbuilt" data-id="${s.id}"><div class="v6-row"><b>${s.id}</b> ${esc(s.purpose)}<br><small>${s.start.join(" / ")} → ${s.end.join(" / ")} · ${s.status}</small><label class="v6-field">Смонтировано<input type="checkbox" name="installed" ${s.asBuilt.installed ? "checked" : ""}></label><label class="v6-field">Фактическая глубина, м<input name="depth" type="number" step=".01" min="0" value="${s.asBuilt.actualDepth ?? ""}"></label><input name="photos" placeholder="Ссылки на фото через пробел" value="${esc(s.asBuilt.photos.join(" "))}" aria-label="Фото ${s.id}"><textarea name="note" aria-label="Примечание ${s.id}" placeholder="Примечание">${esc(s.asBuilt.note)}</textarea><button class="v6-action">Сохранить факт ${s.id}</button></div></form>`,
        ).join(""),
    ) +
    section(
      "Сохранения и перенос",
      buttons(["save", "backup", "json", "import", "raw-storage", "reset"]),
    )
  );
}
function fenceContent() {
  const f = FRONT_SERVICE_PLAN,
    H = currentFenceDimensions();
  return `<p>По улице: <b>RAL 8019 / 2,0 м</b>. Соседи: <b>RAL 6005 / 1,8 м</b>. Матовые рабочие цвета, не заказ.</p><div class="v6-warn">${f.facadeNote}</div>${actionButton("gate-toggle")}${actionButton("trash-toggle")}<p>Калитка слева → пилон → ворота вправо → хозяйственная ниша.</p>${field("Проём ворот, м", "v6-gate-width", f.gate.opening, { min: 3, max: 4.2 })}${field("Хвост, м · assumption", "v6-gate-tail", f.gate.tail, { min: 1, max: 2.5 })}<p>Калитка ${f.wicket.width} м. Хвост и привод не рассчитаны; полотно облегчённое. Открытая створка до X=${gateGeometry().openEnd.toFixed(2)}.</p><h3>Preview высот</h3><label class="v6-field">Фасад<select id="v6-front-height">${[1.8, 2].map((v) => `<option ${H.frontHeight === v ? "selected" : ""}>${v}</option>`).join("")}</select></label><label class="v6-field">Соседи<select id="v6-neighbor-height">${[1.5, 1.8, 2].map((v) => `<option ${H.neighborHeight === v ? "selected" : ""}>${v}</option>`).join("")}</select></label><div class="v6-grid"><button class="v6-action" data-save-heights>Принять высоты</button><button class="v6-action" data-reset-heights>Сброс preview</button></div>${field("Тени ограждений", "v6-fence-shadows", appState.fenceShadows, { type: "checkbox" })}<small>Preview не меняет MASTER до принятия. Тени сетки — консервативный сценарий, не расчёт освещённости.</small>${section("Эксплуатация и безопасность", `<p>Привод справа внутри, ручная разблокировка доступна с участка. Калитка независима. UPS — опция, модель привода не выбрана. Фотоэлементы, остановка/реверс и сигнальная лампа требуют настройки.</p><p>Основания фасада, сетки, ворот и пилона: assumption, нет геологии. Водоотвод: needs-levels. Существующий резерв лотка сохранён.</p><p>${f.maintenance}</p>`)}${section("Подвесные грядки", `<p>${HANGING_BEDS.note}</p>${layerCheckbox("hangingBeds")}`)}`;
}
function operationContent() {
  const a = operationAudit(),
    v = BernV6.project.vehicle;
  return `${section("Зима / снегоуборщик", buttons(["mode-winter"]) + field("Ширина снегоуборщика, м", "v6-snow-width", BernV6.project.snowBlowerWidth, { min: 0.3, max: 2 }) + `<p>Основной снег слева, X 0,5–3,5; Z 0,5–4,5. Не складировать солёный снег у растений. Правый резерв — только снег подхода к хозблоку.</p><p>Минимум основной дорожки: ${a.routeWidth} м. Калитка 1,0 м. ${a.issues.map(esc).join(". ")}</p>`, true)}${section("Въезд автомобиля", field("Ширина автомобиля, м", "v6-car-width", v.width, { min: 1, max: 3 }) + field("Длина автомобиля, м", "v6-car-length", v.length, { min: 2, max: 8 }) + layerCheckbox("vehicle") + "<p>Показаны коридор и три контрольные позиции. Без заданных габаритов используется пример 1,9 × 4,7 м. Поворотная траектория не является транспортным расчётом.</p>")}<div class="v6-warn">Ниша за хвостом: зазор ${a.trashClearance.toFixed(2)} м; из него 0,50 м зарезервировано для обслуживания. Перепроверить после выбора ворот.</div>`;
}
function serviceContent() {
  return (
    section(
      "Сервисные зоны",
      serviceZones()
        .map((z) =>
          field(z.id + " · радиус, м", "v6-radius-" + z.id, z.radius, {
            min: 0.2,
            max: 8,
          }),
        )
        .join("") +
        "<p>Пунктирный радиус при пустом поле — только визуальный резерв, не нормативный отступ.</p>",
    ) +
    section(
      "Корневые коридоры",
      field("Корневой буфер, м", "v6-root-buffer", BernV6.project.rootBuffer, {
        min: 0.1,
        max: 5,
      }) +
        "<p>Неизвестен — посадки требуют проверки. Цветная полоса 0,4 м по умолчанию иллюстративна. Не высаживать крупные корни над трассами без проекта.</p>",
    ) +
    section(
      "Камеры / условные секторы",
      layerCheckbox("cameraSectors") +
        BernV6.project.cameras
          .map(
            (c) =>
              `<h3>${c.id}</h3>${field("Направление, °", "v6-cam-" + c.id + "-angle", c.angle, { min: 0, max: 360 })}${field("Поле зрения, °", "v6-cam-" + c.id + "-fov", c.fov, { min: 10, max: 140 })}${field("Дальность, м", "v6-cam-" + c.id + "-range", c.range, { min: 1, max: 30 })}`,
          )
          .join("") +
        "<p>Условные секторы могут пересекать соседние границы. Уточнить поворот, объектив и маски приватности по месту.</p>",
    )
  );
}
function budgetContent() {
  const total = budgetTotals();
  return `<p>План ${fmtMoney(total.plan)} ₽ · факт ${fmtMoney(total.fact)} ₽<br>Остаток ${fmtMoney(total.remaining)} ₽ · Δ по заполненным статьям ${fmtMoney(total.delta)} ₽<br>Факт заполнен: ${total.coverage}</p><label class="v6-field">Фильтр<select id="v6-budget-filter"><option value="all">Все</option><option value="unconfirmed">Неподтверждённые</option><option value="done">Завершённые</option>${CONSTRUCTION_PHASES.map((p) => `<option value="${p.n}">Этап ${p.n}</option>`).join("")}</select></label><div id="v6-budget-rows">${budgetRows()
    .map(
      (r, i) =>
        `<form class="v6-budget-row v6-row" data-index="${i}" data-phase="${r.phase}" data-status="${r.status}"><b>${esc(r.name)}</b><small> · этап ${r.phase}</small><label class="v6-field">План ₽<input name="plan" type="number" min="0" value="${Math.round(r.plannedCost)}"></label><label class="v6-field">Факт ₽<input name="fact" type="number" min="0" value="${r.actualCost ?? ""}"></label><select name="status" aria-label="Статус статьи">${["assumption", "planned", "confirmed", "done"].map((s) => `<option ${s === r.status ? "selected" : ""}>${s}</option>`).join("")}</select><button class="v6-action">Сохранить статью</button></form>`,
    )
    .join("")}</div>`;
}
function renderDrawer(force = false) {
  const id = appState.openDrawer;
  if (!force && id === renderedDrawer) return;
  renderedDrawer = id;
  if (DOM.sun.panel.parentElement !== hiddenControls)
    hiddenControls.append(DOM.sun.panel);
  drawer.hidden = !id;
  if (!id) return;
  drawer.classList.toggle(
    "right",
    ["view", "analysis", "drawings", "project", "export"].includes(id),
  );
  drawer.querySelector("h2").textContent =
    V6_CATEGORIES[id]?.[1] || "Инструменты";
  let content = "";
  if (id === "menu")
    content =
      '<div class="v6-grid">' +
      Object.entries(V6_CATEGORIES)
        .map(
          ([k, [icon, label]]) =>
            `<button class="v6-action" data-drawer="${k}">${icon} ${label}</button>`,
        )
        .join("") +
      '</div><button class="v6-action" data-search>⌕ Поиск всех действий</button>';
  if (id === "sun")
    content =
      '<div id="v6-sun-slot"></div>' +
      field("Тени ограждений", "v6-fence-shadows", appState.fenceShadows, {
        type: "checkbox",
      }) +
      "<p>Новые слои ограждений не участвуют в исходном анализе, пока сценарные тени выключены.</p>";
  if (id === "layout")
    content =
      section("Редактирование", buttons(["edit", "catalog"]), true) +
      section(
        "Автоматизация",
        buttons(["autofix", "fix"]) +
          "<p>MASTER-объекты пропускаются. Разблокировка — в разделе Проект.</p>",
      ) +
      section(
        "Варианты",
        buttons(["variants"]) +
          `<label class="v6-field">A/B<select id="v6-diff-variant"><option value="">Выберите вариант A</option>${Object.keys(
            loadVariants(),
          )
            .map((n) => `<option>${esc(n)}</option>`)
            .join(
              "",
            )}</select></label><p>Старое — серый пунктир, текущее — цвет. Δ координат, размеров и трасс:</p><div id="v6-diff-result"></div>`,
      ) +
      section(
        "История / сохранение",
        buttons(["undo", "redo", "save", "backup"]),
      );
  if (id === "measure")
    content =
      buttons(["distance", "area", "clear-measure", "gps"]) +
      layerCheckbox("dimensions") +
      "<p>Размерные цепочки показаны на 2D-листе. Координаты X/Z локальные.</p>";
  if (id === "layers")
    content =
      "<p>Одно состояние для 3D, 2D и экспорта.</p>" +
      [
        "buildings",
        "objectLabels",
        "paths",
        "fence",
        "landscape",
        "hangingBeds",
        "nodes",
      ]
        .map(layerCheckbox)
        .join("") +
      section(
        "Коммуникации",
        layerCheckbox("comms") +
          '<div class="v6-subgroup">' +
          Object.keys(SYSTEMS).map(layerCheckbox).join("") +
          "</div>" +
          layerCheckbox("engineeringLabels"),
        true,
      ) +
      section(
        "Подписи",
        ["zoneLabels", "landscapeLabels", "fenceLabels", "reference"]
          .map(layerCheckbox)
          .join(""),
      ) +
      section(
        "Эксплуатация / анализ",
        [
          "serviceZones",
          "rootZones",
          "snow",
          "snowRoute",
          "vehicle",
          "privacy",
          "cameraSectors",
          "sleeves",
          "servicePoints",
          "notes",
          "diff",
          "dimensions",
          "norms",
          "violations",
        ]
          .map(layerCheckbox)
          .join(""),
      );
  if (id === "view")
    content =
      '<div class="v6-grid">' +
      ["default", "top", "facade", "street"]
        .map(
          (k, i) =>
            `<button class="v6-action" data-camera="${k}">${["Общий", "Сверху", "Фасад", "С улицы"][i]}</button>`,
        )
        .join("") +
      "</div>" +
      section(
        "Режимы",
        Object.keys(V6_MODES)
          .map((k) => actionButton("mode-" + k))
          .join(""),
      ) +
      section("Фасад и ограждения", fenceContent(), true) +
      section(
        "Строительные этапы",
        `<label class="v6-field">Этап<select id="v6-phase">${CONSTRUCTION_PHASES.map((p) => `<option value="${p.n}" ${p.n === appState.constructionPhase ? "selected" : ""}>${p.n} · ${p.title}</option>`).join("")}</select></label>${field("Будущее полупрозрачно", "v6-future", appState.futureVisible, { type: "checkbox" })}<p>До этапа — построенное, этап — текущее, позже — прозрачное либо скрытое. MASTER не меняется.</p>`,
      ) +
      operationContent();
  if (id === "analysis")
    content =
      buttons(["norms", "report", "error"]) +
      section(
        "Приватность",
        actionButton("mode-privacy") +
          `<p>${esc(privacyAudit().front.assessment)}</p><p>${esc(privacyAudit().neighbors.assessment)}</p>`,
      ) +
      serviceContent() +
      section("Смета · этапы / план / факт", budgetContent()) +
      actionButton("legacy-budget");
  if (id === "drawings")
    content =
      Object.keys(DRAWING_PRESETS)
        .map((k) => actionButton("drawing-" + k))
        .join("") +
      actionButton("houseplan") +
      section(
        "Разбивочный лист X/Z",
        `<p>Не координаты геодезического выноса. Размеры в метрах; два ближайших отступа от границ.</p><div class="v6-scroll"><table><tr><th>Элемент</th><th>X / Z</th><th>Размер / °</th><th>Отступы</th></tr>${surveyRows()
          .map(
            (r) =>
              `<tr><td>${esc(r.id)}</td><td>${r.x.toFixed(2)} / ${r.z.toFixed(2)}</td><td>${r.w ?? "—"} × ${r.d ?? "—"} / ${r.rot}</td><td>${r.nearest.map(([n, v]) => n + " " + v.toFixed(2)).join("; ")}</td></tr>`,
          )
          .join(
            "",
          )}</table></div><button class="v6-action" data-survey-export>Скачать координатный лист JSON</button>`,
      ) +
      section(
        "Размерные цепочки",
        drawingDimensions()
          .map(
            (d) =>
              `<div class="v6-row">${esc(d.label)}: ${d.value.toFixed(2)} м</div>`,
          )
          .join(""),
      );
  if (id === "project") content = projectContent();
  if (id === "export")
    content =
      buttons(["png", "json"]) +
      `<label class="v6-field">PDF<select id="v6-pdf-scope"><option value="current">Текущие слои</option><option value="master">Полный MASTER + доклад</option>${Object.entries(
        DRAWING_PRESETS,
      )
        .filter(([k]) => k !== "current")
        .map(([k, p]) => `<option value="${k}">${p.title}</option>`)
        .join("")}</select></label>` +
      actionButton("pdf") +
      "<p>PDF содержит 2D-лист и 3D-вид одного набора слоёв. После экспорта вид восстанавливается.</p>";
  drawerBody.innerHTML = content;
  if (id === "sun")
    drawerBody.querySelector("#v6-sun-slot").append(DOM.sun.panel);
  if (id === "export")
    document.getElementById("v6-pdf-scope").value = appState.pdfScope;
}
function updateUI() {
  shell.querySelector("#v6-mode").value = appState.sceneMode;
  shell
    .querySelectorAll("[data-drawer]")
    .forEach((b) =>
      b.setAttribute("aria-expanded", b.dataset.drawer === appState.openDrawer),
    );
  shell
    .querySelectorAll("[data-layer]")
    .forEach((b) => (b.checked = !!appState.layers[b.dataset.layer]));
  const n = Object.values(BernV6.project.reviews).filter(
    (v) => v.status === "needs-review",
  ).length;
  document.getElementById("v6-foot-status").textContent = n
    ? n + " разделов требуют проверки"
    : "MASTER защищён";
  document.getElementById("v6-legend").textContent =
    appState.sceneMode === "comms-only"
      ? "Сети · пунктир = assumption"
      : appState.sceneMode === "winter"
        ? "Синий — снег / маршрут · охра — свободный откат"
        : appState.sceneMode === "xray"
          ? "X-Ray · здания прозрачны"
          : appState.heightPreview
            ? "Preview высот · MASTER не изменён"
            : "RAL 8019 / RAL 6005 · planned";
  renderDrawer();
}
function refreshUI() {
  renderDrawer(true);
  updateUI();
}
function saveV6Change() {
  BernV6.persist();
  rebuildDynamic();
  refreshUI();
}
function openSearch() {
  setDrawer(null);
  const panel = shell.querySelector(".v6-search");
  panel.hidden = false;
  const input = document.getElementById("v6-search-input");
  input.value = "";
  renderSearch("");
  input.focus();
}
function renderSearch(query) {
  const normalized = query.toLocaleLowerCase();
  shell.querySelector(".v6-search-results").innerHTML = UI_ACTIONS.filter((a) =>
    (a.label + " " + a.category + " " + a.id)
      .toLocaleLowerCase()
      .includes(normalized),
  )
    .map((a) => actionButton(a.id))
    .join("");
}
shell.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.drawer) setDrawer(b.dataset.drawer);
  else if (b.hasAttribute("data-menu")) setDrawer("menu");
  else if (b.hasAttribute("data-close")) setDrawer(appState.openDrawer);
  else if (b.hasAttribute("data-search")) openSearch();
  else if (b.dataset.action) {
    shell.querySelector(".v6-search").hidden = true;
    BernV6.run(b.dataset.action);
  } else if (b.dataset.camera) setCameraV6(b.dataset.camera);
  else if (b.dataset.object) showObjectCard(b.dataset.object);
  else if (b.dataset.lock) {
    const id = b.dataset.lock;
    if (
      isMasterLocked(id) &&
      !confirm(
        "Разблокировать " +
          id +
          "? Изменение затронет: " +
          (DEPENDENCIES[id] || ["нормы"]).join(", ") +
          ". Они получат needs-review.",
      )
    )
      return;
    BernV6.project.locks[id] = !isMasterLocked(id);
    BernV6.persist();
    refreshUI();
  } else if (b.dataset.reviewed) {
    BernV6.project.reviews[b.dataset.reviewed].status = "reviewed";
    BernV6.persist();
    refreshUI();
  } else if (b.dataset.noteDelete) {
    BernV6.project.userNotes = BernV6.project.userNotes.filter(
      (n) => n.id !== b.dataset.noteDelete,
    );
    saveV6Change();
  } else if (b.dataset.noteEdit) {
    const n = BernV6.project.userNotes.find((n) => n.id === b.dataset.noteEdit),
      v = prompt("Текст заметки", n.text);
    if (v != null && v.trim()) {
      n.text = v;
      saveV6Change();
    }
  } else if (b.dataset.source) {
    const f = PROJECT_FACTS.find((f) => f.id === b.dataset.source),
      label = prompt("Документ / источник", f.source?.sourceLabel || "");
    if (label != null) {
      const date = prompt(
        "Дата источника YYYY-MM-DD (пусто — неизвестна)",
        f.source?.sourceDate || "",
      );
      f.source = {
        sourceType: "user-input",
        sourceLabel: label,
        sourceDate: date || null,
      };
      BernV6.persist();
      refreshUI();
    }
  } else if (b.hasAttribute("data-save-heights")) {
    if (appState.heightPreview) {
      Object.assign(FENCE_DIMENSIONS, appState.heightPreview);
      appState.heightPreview = null;
      markDependencies("fence");
      BernV6.persist();
      BernV6.emit();
      refreshUI();
    }
  } else if (b.hasAttribute("data-reset-heights")) {
    appState.heightPreview = null;
    BernV6.emit();
    refreshUI();
  } else if (b.hasAttribute("data-survey-export"))
    downloadJson(
      {
        coordinateSystem: "local-XZ-metres",
        survey: false,
        rows: surveyRows(),
      },
      "Bern-setting-out-local.json",
    );
});
shell.addEventListener("change", (e) => {
  const el = e.target,
    id = el.id;
  if (el.dataset.layer) {
    setLayer(el.dataset.layer, el.checked);
    return;
  }
  if (id === "v6-mode") {
    BernV6.run("mode-" + el.value);
    return;
  }
  if (el.dataset.task) {
    BernV6.project.projectTasks.find((t) => t.id === el.dataset.task).status =
      el.value;
    BernV6.persist();
    return;
  }
  if (id === "v6-pdf-scope") {
    appState.pdfScope = el.value;
    return;
  }
  if (id === "v6-phase") {
    appState.constructionPhase = +el.value;
    setSceneMode("construction");
    return;
  }
  if (id === "v6-future") {
    appState.futureVisible = el.checked;
    BernV6.emit();
    return;
  }
  if (id === "v6-fence-shadows") {
    appState.fenceShadows = el.checked;
    if (insolationOn) scheduleInsolation();
    BernV6.emit();
    return;
  }
  if (id === "v6-front-height" || id === "v6-neighbor-height") {
    appState.heightPreview = {
      ...currentFenceDimensions(),
      [id === "v6-front-height" ? "frontHeight" : "neighborHeight"]: +el.value,
    };
    BernV6.emit();
    return;
  }
  if (id === "v6-budget-filter") {
    shell
      .querySelectorAll(".v6-budget-row")
      .forEach(
        (r) =>
          (r.hidden = !(
            el.value === "all" ||
            r.dataset.phase === el.value ||
            (el.value === "unconfirmed" &&
              ["assumption", "planned"].includes(r.dataset.status)) ||
            r.dataset.status === el.value
          )),
      );
    return;
  }
  if (id === "v6-diff-variant") {
    compareVariant(el.value);
    document.getElementById("v6-diff-result").innerHTML =
      (BernV6.diffRows || [])
        .map(
          (r) =>
            `<p>${esc(r.id)} · ${r.status} · ΔX ${r.dx?.toFixed(2) ?? "—"}, ΔZ ${r.dz?.toFixed(2) ?? "—"}, Δ° ${r.rotation ?? "—"}</p>`,
        )
        .join("") +
      (BernV6.utilityDiff || [])
        .map(
          (r) =>
            `<small>${esc(r.name)}: ${r.before.toFixed(1)} → ${r.after?.toFixed(1) ?? "—"} м<br></small>`,
        )
        .join("");
    return;
  }
  if (el.type === "number" && !el.checkValidity()) {
    el.reportValidity();
    return;
  }
  const val = el.value === "" ? null : Number(el.value);
  if (id === "v6-snow-width") BernV6.project.snowBlowerWidth = val;
  else if (id === "v6-car-width") BernV6.project.vehicle.width = val;
  else if (id === "v6-car-length") BernV6.project.vehicle.length = val;
  else if (id === "v6-root-buffer") BernV6.project.rootBuffer = val;
  else if (id.startsWith("v6-radius-"))
    BernV6.project.serviceRadii[id.slice(10)] = val;
  else if (id.startsWith("v6-cam-")) {
    const match = id.match(/^v6-cam-(.+)-(angle|fov|range)$/);
    if (match && val != null)
      BernV6.project.cameras.find((c) => c.id === match[1])[match[2]] = val;
  } else if (id === "v6-gate-width" || id === "v6-gate-tail") {
    if (val == null) return;
    FRONT_SERVICE_PLAN.gate[id.endsWith("width") ? "opening" : "tail"] = val;
    markDependencies("gate");
    lastFenceKey = "";
  } else return;
  saveV6Change();
});
shell.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target,
    fd = new FormData(f);
  if (f.id === "v6-note-form")
    BernV6.project.userNotes.push({
      id: "note-" + Date.now(),
      text: String(fd.get("text")),
      x: Number(fd.get("x")),
      z: Number(fd.get("z")),
      status: "note",
    });
  else if (f.id === "v6-task-form")
    BernV6.project.projectTasks.push({
      id: "task-" + Date.now(),
      title: String(fd.get("title")),
      status: "todo",
    });
  else if (f.classList.contains("v6-asbuilt")) {
    const s = SLEEVES.find((s) => s.id === f.dataset.id);
    s.asBuilt = {
      ...s.asBuilt,
      installed: fd.get("installed") === "on",
      actualDepth: fd.get("depth") === "" ? null : Number(fd.get("depth")),
      photos: String(fd.get("photos")).split(/\s+/).filter(Boolean),
      note: String(fd.get("note")),
    };
  } else if (f.classList.contains("v6-budget-row")) {
    const r = budgetRows()[+f.dataset.index];
    BernV6.project.budget[r.id] = {
      phase: r.phase,
      plannedCost: Number(fd.get("plan")),
      actualCost: fd.get("fact") === "" ? null : Number(fd.get("fact")),
      status: String(fd.get("status")),
      source: r.source,
    };
  } else return;
  saveV6Change();
});
document
  .getElementById("v6-search-input")
  .addEventListener("input", (e) => renderSearch(e.target.value));
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") {
    shell.querySelector(".v6-search").hidden = true;
    if (appState.openDrawer) setDrawer(appState.openDrawer);
  }
  if (
    e.key === "ArrowDown" &&
    !shell.querySelector(".v6-search").hidden &&
    e.target.id === "v6-search-input"
  ) {
    e.preventDefault();
    shell.querySelector(".v6-search-results button")?.focus();
  }
});
document.addEventListener("bern:state", updateUI);
BernV6.ready = true;
previousObjects = new Map(
  CONFIG.objects.map((o) => [o.id, objectSignature(o)]),
);
const reviewParams = new URLSearchParams(location.search);
if (V6_REVIEW) {
  const mode = reviewParams.get("mode") || "normal";
  if (mode in V6_MODES) setSceneMode(mode);
  const filters = reviewParams.get("layers");
  if (filters) {
    Object.keys(SYSTEMS).forEach(
      (k) => (appState.layers[k] = filters.split(",").includes(k)),
    );
    appState.layers.comms = true;
  }
  if (["fence", "night-facade"].includes(mode)) setCameraV6("facade");
  if (mode === "winter") setCameraV6("top");
} else if (appState.activeView !== "default") setCameraV6(appState.activeView);
applySceneState();
updateUI();
if (BernV6.storageError) {
  appState.openDrawer = "project";
  refreshUI();
}
BernV6.persist();
