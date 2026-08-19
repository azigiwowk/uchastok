// ═══════════════════════════════════════════════════════════════
// DOM-ССЫЛКИ + УТИЛИТЫ (подписи, форматирование)
// ═══════════════════════════════════════════════════════════════
const DOM = {
viewSelect: document.getElementById('view-select'),
monthSlider: document.getElementById('month-slider'),
hourSlider: document.getElementById('hour-slider'),
monthLabel: document.getElementById('month-label'),
timeLabel: document.getElementById('time-label'),
timeDisplay: document.getElementById('time-display'),
measureHint: document.getElementById('measure-hint'),
commInfo: document.getElementById('comm-info'),
dragHint: document.getElementById('drag-hint'),
toggleComm: document.getElementById('toggle-comm'),
toggleLabels: document.getElementById('toggle-labels'),
exportPng: document.getElementById('export-png'),
exportPdf: document.getElementById('export-pdf'),
openReport: document.getElementById('open-report'),
openPlan: document.getElementById('open-plan-modal'),
reportModal: document.getElementById('report-modal'),
reportBody: document.getElementById('report-body'),
planModal: document.getElementById('plan-modal'),
gpsModal: document.getElementById('gps-modal'),
gpsTbody: document.getElementById('gps-tbody'),
normsModal: document.getElementById('norms-modal'),
normsTbody: document.getElementById('norms-tbody'),
normsSummary: document.getElementById('norms-summary'),
normBadge: document.getElementById('norm-badge'),
variantsModal: document.getElementById('variants-modal'),
variantsWrap: document.getElementById('variants-wrap'),
saveVariantBtn: document.getElementById('save-variant-btn'),
fixViolModalBtn: document.getElementById('fixviol-modal-btn'),
catalogModal: document.getElementById('catalog-modal'),
catalogGrid: document.getElementById('catalog-grid'),
catalogPlaced: document.getElementById('catalog-placed'),
planContainer: document.getElementById('plan-container'),
pdfCover: document.getElementById('pdf-cover-container'),
pdfReport: document.getElementById('pdf-report-container'),
pdfLoader: document.getElementById('pdf-loader'),
hamburger: document.getElementById('hamburger'),
mobileMenu: document.getElementById('mobile-menu'),
closeMenu: document.getElementById('closeMenu'),
objectModal: document.getElementById('object-modal'),
objectCardBody: document.getElementById('object-card-body'),
sun: {
panel: document.getElementById('sun-panel'), fab: document.getElementById('sun-fab'),
toggle: document.getElementById('sun-panel-toggle'),
monthSlider: document.getElementById('sun-month-side'), hourSlider: document.getElementById('sun-hour-side'),
monthLabel: document.getElementById('month-label-side'), hourLabel: document.getElementById('hour-label-side'),
status: document.getElementById('sun-status'), playBtn: document.getElementById('sun-play-btn'),
insolationBtn: document.getElementById('insolation-btn'),
insolationStatus: document.getElementById('insolation-status')
},
edit: {
panel: document.getElementById('edit-panel'), fab: document.getElementById('edit-fab'),
toggle: document.getElementById('edit-panel-toggle'),
modeBtn: document.getElementById('edit-mode-btn'),
violationsBtn: document.getElementById('toggle-violations-btn'),
autofixBtn: document.getElementById('autofix-btn'),
fixViolBtn: document.getElementById('fixviol-btn'),
undoBtn: document.getElementById('undo-btn'),
redoBtn: document.getElementById('redo-btn'),
variantsBtn: document.getElementById('variants-btn'),
catalogBtn: document.getElementById('catalog-btn'),
saveBtn: document.getElementById('save-layout-btn'),
resetBtn: document.getElementById('reset-layout-btn'),
status: document.getElementById('edit-status')
},
mobile: {
comms: document.getElementById('toggleCommsMob'), labels: document.getElementById('toggleLabelsMob'),
measure: document.getElementById('toggleMeasureMob'), area: document.getElementById('toggleAreaMob'),
norms: document.getElementById('showNormsBtnMob'), report: document.getElementById('showReportBtnMob'),
plan: document.getElementById('showHousePlanBtnMob'), png: document.getElementById('exportPngBtnMob'),
pdf: document.getElementById('exportPdfBtnMob'), gps: document.getElementById('showGpsBtnMob'),
catalog: document.getElementById('catalogMob'), drawing: document.getElementById('showDrawingMob')
}
};
const Utils = {
dirty: true,
markDirty() { this.dirty = true; },
ensureRoundRect() {
if (CanvasRenderingContext2D.prototype.roundRect) return;
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
if (r > w/2) r = w/2; if (r > h/2) r = h/2;
this.moveTo(x + r, y); this.lineTo(x + w - r, y);
this.quadraticCurveTo(x + w, y, x + w, y + r); this.lineTo(x + w, y + h - r);
this.quadraticCurveTo(x + w, y + h, x + w - r, y + h); this.lineTo(x + r, y + h);
this.quadraticCurveTo(x, y + h, x, y + h - r); this.lineTo(x, y + r);
this.quadraticCurveTo(x, y, x + r, y); this.closePath(); return this;
};
},
createLabel(text, color = '#fff', size = 0.8, scale = [6, 1.5], canvasW = 512, canvasH = 128, fontSize = 40, bgColor = 'rgba(0,0,0,0.6)', borderRadius = 20) {
const canvas = document.createElement('canvas');
canvas.width = canvasW; canvas.height = canvasH;
const ctx = canvas.getContext('2d');
ctx.fillStyle = bgColor;
ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, borderRadius);
ctx.fill();
ctx.font = `Bold ${fontSize}px Arial`;
ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
ctx.fillText(text, canvas.width/2, canvas.height/2 + 5);
const texture = new THREE.CanvasTexture(canvas);
const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
const sprite = new THREE.Sprite(material);
sprite.scale.set(scale[0] * size, scale[1] * size, 1);
return sprite;
},
fmt(v) { return v.toFixed(1).replace('.', ','); }
};
Utils.ensureRoundRect();
