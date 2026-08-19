// ═══════════════════════════════════════════════════════════════
// КОНФИГ УЧАСТКА + ХРАНИЛИЩЕ + ЛОВЕЦ ОШИБОК
// ═══════════════════════════════════════════════════════════════
const APP_VERSION = 'v2.1 (каталог + смета + 2D-чертёж + исправление нарушений)';
const errorLog = [];
function captureError(msg, src, line, col, err) {
const entry = { time: new Date().toLocaleTimeString('ru-RU'), msg: String(msg), src: src || '?', line: line, col: col, stack: err && err.stack ? err.stack : '' };
errorLog.push(entry);
if (errorLog.length > 10) errorLog.shift();
console.warn('🐞 Захвачена ошибка:', entry);
}
window.onerror = captureError;
window.addEventListener('unhandledrejection', (e) => captureError('Promise: ' + e.reason, '', 0, 0, e.reason));
window.addEventListener('error', (e) => captureError(e.message, e.filename, e.lineno, e.colno, e.error), true);

const CONFIG = {
plot: { w: 25, d: 40 },
center: { x: 12.5, z: 20 },
gps: { lat: 56.042291, lng: 38.417342, angle: 57.3, latPerM: 0.000009, lngPerM: 0.0000161, solarNoon: 12.44 },
latitude: 56,
camera: { default: [35, 30, 60], top: [12.5, 60, 20], night: [35, 30, 60], gate: [12.5, 2, -2] },
objects: [
{ id: 'house', type: 'house', label: '🏠 Дом "Берн"', x: 12.5, z: 30, y: 6.0, w: 16, d: 10, h: 4.5, rot: 0, color: 0xf5e6d3, roofColor: 0x6d4c41, terrace: { w: 9, d: 3, color: 0xbc8f8f }, labelColor: '#ffaa00', labelSize: 1.2, group: 'house' },
{ id: 'bath', type: 'bath', label: '🧖 Баня', x: 19, z: 11, y: 5.5, w: 6, d: 6, h: 4, rot: 0, color: 0x8d6e63, roofColor: 0x4e342e, terrace: { w: 6, d: 4, color: 0x795548 }, labelColor: '#ff8844', labelSize: 1.0, group: 'site' },
{ id: 'shed', type: 'shed', label: '🛠 Хозблок', x: 21, z: 5, y: 4.0, w: 6, d: 4, h: 3, rot: 0, color: 0x5d4037, roofColor: 0x333333, labelColor: '#cccccc', labelSize: 1.0, group: 'site' },
{ id: 'garden', type: 'garden', label: '🌱 Огород', x: 2.5, z: 3.5, y: 2.0, w: 5, d: 7, rot: 0, color: 0x6b8e23, labelColor: '#66bb66', labelSize: 0.9, group: 'site' },
{ id: 'greenhouse', type: 'greenhouse', label: '🌿 Теплица', x: 1.5, z: 7, y: 3.5, w: 3, d: 6, h: 2.5, rot: 0, color: 0x88ccff, labelColor: '#88dd88', labelSize: 0.9, group: 'site' },
{ id: 'playground', type: 'playground', label: '🧸 Детская площадка', x: 8, z: 16, y: 2.5, w: 2, d: 2, rot: 0, color: 0xf1c40f, labelColor: '#ff66aa', labelSize: 0.9, group: 'site' },
{ id: 'firepit', type: 'firepit', label: '🔥 Костровище', x: 16, z: 6, y: 1.5, radius: 1.25, rot: 0, color: 0x4a3a2a, labelColor: '#ff5500', labelSize: 0.9, group: 'site' },
{ id: 'car', type: 'car', label: '🚗 Машина', x: 22.5, z: 1.0, y: 1.5, w: 5, d: 2, rot: 0, color: 0xc0392b, labelColor: '#88aaff', labelSize: 0.8, group: 'site' },
{ id: 'septic', type: 'septic', label: '🚽 Септик', x: 3, z: 30, y: 2.0, w: 1.5, d: 1.2, rot: 0, color: 0x5d6d7e, labelColor: '#aa66cc', labelSize: 0.8, group: 'site' },
{ id: 'well', type: 'well', label: '💧 Скважина', x: 16, z: 22, y: 2.0, radius: 0.15, rot: 0, color: 0x7f8c8d, labelColor: '#33aaff', labelSize: 0.8, group: 'site' }
],
utilities: [
{ name: 'Гофра к бане', icon: '⚡', color: 0xff6600, pipe: 'гофра Ø20 мм', depth: 0.8, route: [ { obj: 'house', dx: 7.5, dz: -1 }, { x: 24, z: 29 }, { obj: 'bath', dx: 5, dz: 0 } ] },
{ name: 'Гофра к хозблоку', icon: '⚡', color: 0xff9933, pipe: 'гофра Ø20 мм', depth: 0.8, route: [ { obj: 'house', dx: 7.5, dz: -1 }, { x: 24, z: 29 }, { obj: 'shed', dx: 3, dz: 0 } ] },
{ name: 'Вода от скважины', icon: '💧', color: 0x3366ff, pipe: 'ПНД Ø32 мм', depth: 1.5, route: [ { obj: 'well', dx: 0, dz: 0 }, { x: 12.5, z: 22 }, { obj: 'house', dx: 0, dz: -1 } ] },
{ name: 'Вода к бане', icon: '💧', color: 0x3366ff, pipe: 'ПНД Ø25 мм', depth: 1.5, route: [ { obj: 'house', dx: 0, dz: -1 }, { x: 20, z: 29 }, { x: 24, z: 29 }, { obj: 'bath', dx: 5, dz: 0 } ] },
{ name: 'Вода на полив', icon: '💧', color: 0x3366ff, pipe: 'ПНД Ø20 мм', depth: 0.8, route: [ { obj: 'house', dx: 0, dz: -1 }, { x: 2.5, z: 29 }, { obj: 'garden', dx: 0, dz: 0 } ] },
{ name: 'Канализация (дом)', icon: '🚽', color: 0x9900cc, pipe: 'ПВХ Ø110 мм', depth: 1.2, route: [ { obj: 'house', dx: 0, dz: -1 }, { x: 3, z: 29 }, { obj: 'septic', dx: 0, dz: 0 } ] },
{ name: 'Канализация (баня)', icon: '🚽', color: 0x9900cc, pipe: 'ПВХ Ø110 мм', depth: 1.0, route: [ { obj: 'bath', dx: 0, dz: 0 }, { x: 3, z: 11 }, { obj: 'septic', dx: 0, dz: 0 } ] },
{ name: 'Магистральный газ', icon: '🔥', color: 0xffcc00, pipe: 'ПЭ Ø32 мм', depth: 1.2, route: [ { x: 24.5, z: 0 }, { x: 24.5, z: 29 } ] },
{ name: 'Газ к дому', icon: '🔥', color: 0xffcc00, pipe: 'ПЭ Ø32 мм', depth: 1.2, label: false, route: [ { x: 24.5, z: 29 }, { obj: 'house', dx: 7.5, dz: -1 } ] }
],
months: [
{ declination: -20.5, sunrise: 8.85, sunset: 16.10 }, { declination: -13.5, sunrise: 7.80, sunset: 17.30 },
{ declination: -2.5, sunrise: 6.70, sunset: 18.50 }, { declination: 10.5, sunrise: 5.30, sunset: 19.80 },
{ declination: 20.0, sunrise: 4.20, sunset: 20.50 }, { declination: 23.5, sunrise: 3.75, sunset: 21.20 },
{ declination: 21.5, sunrise: 3.90, sunset: 21.00 }, { declination: 15.0, sunrise: 4.70, sunset: 20.20 },
{ declination: 5.0, sunrise: 6.00, sunset: 19.00 }, { declination: -7.0, sunrise: 7.00, sunset: 17.70 },
{ declination: -17.0, sunrise: 8.00, sunset: 16.40 }, { declination: -23.0, sunrise: 8.90, sunset: 15.90 }
],
monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
};

const STORAGE_KEY = 'bern_layout_v1';
const VARIANTS_KEY = 'bern_layout_variants';
const CATALOG_KEY = 'bern_catalog_v1';
const DEFAULT_LAYOUT = {};
CONFIG.objects.forEach(o => { DEFAULT_LAYOUT[o.id] = { x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius }; });
let hadSavedLayout = false;
function loadSavedLayout() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (!raw) return;
const data = JSON.parse(raw);
if (data && data.objects) {
CONFIG.objects.forEach(o => {
const s = data.objects[o.id];
if (s && typeof s.x === 'number' && typeof s.z === 'number') { o.x = s.x; o.z = s.z; }
if (s && typeof s.rot === 'number') o.rot = s.rot;
if (s && typeof s.w === 'number') o.w = s.w;
if (s && typeof s.d === 'number') o.d = s.d;
if (s && typeof s.h === 'number') o.h = s.h;
if (s && typeof s.radius === 'number') o.radius = s.radius;
if (s) hadSavedLayout = true;
});
}
} catch (e) { console.warn('Не удалось загрузить сохранённую планировку:', e); }
}
loadSavedLayout();
function saveLayout() {
try {
const objects = {};
CONFIG.objects.forEach(o => { objects[o.id] = { x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius }; });
localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, savedAt: Date.now(), objects }));
if (window.CAT) window.CAT.save();
} catch (e) { console.warn('Не удалось сохранить планировку:', e); }
}
function loadVariants() { try { return JSON.parse(localStorage.getItem(VARIANTS_KEY)) || {}; } catch (e) { return {}; } }
function saveVariants(v) { try { localStorage.setItem(VARIANTS_KEY, JSON.stringify(v)); } catch (e) {} }
