// ═══════════════════════════════════════════════════════════════
// ГЛОБАЛЬНЫЙ ЛОВЕЦ ОШИБОК (для кнопки «Отчёт об ошибке»)
// ═══════════════════════════════════════════════════════════════
const APP_VERSION = 'v6 MASTER UI/FACADE • review';
const errorLog = [];
function captureError(msg, src, line, col, err) {
const entry = {
time: new Date().toLocaleTimeString('ru-RU'),
msg: String(msg),
src: src || '?',
line: line, col: col,
stack: err && err.stack ? err.stack : ''
};
errorLog.push(entry);
if (errorLog.length > 10) errorLog.shift();
console.warn('🐞 Захвачена ошибка:', entry);
}
window.onerror = captureError;
window.addEventListener('unhandledrejection', (e) => captureError('Promise: ' + e.reason, '', 0, 0, e.reason));
window.addEventListener('error', (e) => captureError(e.message, e.filename, e.lineno, e.colno, e.error), true);
const CONFIG = {
plot: {
w: 25.001, d: 40.002,
// Межевые знаки 1–4 из акта выноса границ, МСК-50 зона 2.
boundary: [
{ n: 1, x: 500473.82, y: 2245973.10 },
{ n: 2, x: 500494.85, y: 2245986.62 },
{ n: 3, x: 500473.22, y: 2246020.27 },
{ n: 4, x: 500452.19, y: 2246006.75 }
],
streetSide: 'z=0'
},
center: { x: 12.5005, z: 20.001 },
// angle — поворот локальной оси +Z относительно истинного севера.
gps: { lat: 56.042291, lng: 38.417342, angle: 57.263397, timezone: 3, referenceYear: 2026, latPerM: 0.00000899, lngPerM: 0.00001613 },
infrastructure: {
powerPole: { x: 20.5, z: -9, h: 8, status: 'existing', positionAccuracy: 'approximate', note: 'Существующий столб с электрощитом за Рассветной улицей, ориентировочно напротив начала переднего забора; точное положение требует обмера' },
entrance: { x: 14.5, z: 0, status: 'planned', positionAccuracy: 'preliminary', note: 'Планируемый въезд и калитка на короткой уличной стороне z=0; точное положение уточнить по месту' },
rainCollector: { x: 10.2, z: 9.0, status: 'assumption', positionAccuracy: 'preliminary', note: 'Резерв точки накопления дождевой воды/ливневого колодца между огородом и въездом. Фактическая отметка, объём, перелив и возможность повторного использования воды определяются после вертикальной планировки и расчёта стока.' }
},
latitude: 56,
camera: { default: [35, 30, 60], top: [12.5, 60, 20], night: [35, 30, 60], gate: [14.5, 2, -2] },
objects: [
{ id: 'house', type: 'house', label: '🏠 Дом "Берн"', x: 12.5, z: 30, y: 6.0, w: 16, d: 10, h: 4.5, rot: 0, color: 0xf5e6d3, roofColor: 0x6d4c41, terrace: { w: 9, d: 3, color: 0xbc8f8f }, labelColor: '#ffaa00', labelSize: 1.2, group: 'house' },
{ id: 'bath', type: 'bath', label: '🧖 Баня', x: 20.75, z: 11.5, y: 5.5, w: 6, d: 6, h: 4, rot: 0, entranceSide: 'north', entranceWidth: 1.1, color: 0x8d6e63, roofColor: 0x4e342e, terrace: { w: 6, d: 4, color: 0x795548 }, labelColor: '#ff8844', labelSize: 1.0, group: 'site' },
{ id: 'shed', type: 'shed', label: '🛠 Хозблок', x: 21, z: 5, y: 4.0, w: 6, d: 4, h: 3, rot: 0, entranceSide: 'south', entranceWidth: 1.2, color: 0x5d4037, roofColor: 0x333333, labelColor: '#cccccc', labelSize: 1.0, group: 'site' },
{ id: 'garden', type: 'garden', label: '🌱 Огород', x: 6.5, z: 4, y: 2.0, w: 5, d: 7, rot: 0, color: 0x6b8e23, labelColor: '#66bb66', labelSize: 0.9, group: 'site' },
{ id: 'greenhouse', type: 'greenhouse', label: '🌿 Теплица', x: 2, z: 9, y: 3.5, w: 3, d: 6, h: 2.5, rot: 0, color: 0x88ccff, labelColor: '#88dd88', labelSize: 0.9, group: 'site' },
{ id: 'playground', type: 'playground', label: '🧸 Детская площадка', x: 14, z: 12.5, y: 2.5, w: 2, d: 2, rot: 0, color: 0xf1c40f, labelColor: '#ff66aa', labelSize: 0.9, group: 'site', status: 'planned', note: 'Площадка размещена у переднего края центрального газона с прямой видимостью от дома' },
{ id: 'firepit', type: 'firepit', label: '🔥 Мангальная / костровая зона', x: 10.5, z: 18, y: 1.5, radius: 1.25, rot: 0, color: 0x4a3a2a, labelColor: '#ff5500', labelSize: 0.9, group: 'site', fireMode: 'brazier', status: 'planned', note: 'Функционально относится к бане; в модели соблюдён запас не менее 5 м до дома, бани и хозблока для режима мангала' },
{ id: 'car', type: 'car', label: '🚗 Машина (1 место)', x: 14.5, z: 6, y: 1.5, w: 5, d: 2, rot: 90, color: 0xc0392b, labelColor: '#88aaff', labelSize: 0.8, group: 'site', status: 'assumption', note: 'Одно внутреннее машиноместо; гостевая парковка предполагается снаружи участка' },
{ id: 'canopy', type: 'canopy', label: '▱ Навес (в будущем)', x: 14.5, z: 6, y: 4.2, w: 4, d: 6, h: 2.8, rot: 0, color: 0x90a4ae, labelColor: '#d7e3e8', labelSize: 0.82, group: 'site', status: 'planned', note: 'Планировочный резерв 4×6 м над единственным внутренним машиноместом; конструкция и фундамент не утверждены' },
{ id: 'septic', type: 'septic', label: '🚽 Септик / ЛОС (предварительно)', x: 2.5, z: 17.5, y: 2.0, w: 1.5, d: 1.2, rot: 0, status: 'assumption', note: 'Предварительная зона под ЛОС или герметичную накопительную емкость. Тип системы, размеры, санитарные расстояния, отметки и возможность обслуживания определяются после геологии, УГВ и выбора оборудования.', color: 0x5d6d7e, labelColor: '#aa66cc', labelSize: 0.8, group: 'site' },
{ id: 'well', type: 'well', label: '💧 Скважина (предварительно)', x: 23, z: 23, y: 2.0, radius: 0.15, rot: 0, status: 'assumption', note: 'Предварительная зона водозабора. Место окончательно выбирается по гидрогеологии и направлению грунтовых вод; бурение желательно выполнить до строительства и благоустройства с сохранением сервисного доступа.', color: 0x7f8c8d, labelColor: '#33aaff', labelSize: 0.8, group: 'site' }
],
utilities: [
{ system: 'electric', name: 'Ввод электричества от существующего щита', icon: '⚡', color: 0xffcc33, pipe: 'силовой кабель / защитная труба — уточнить проектом', depth: 0.8, status: 'assumption', note: 'Основной правый электрический коридор: от существующего столба пересечение фасадной границы около X=20,5, затем уход к правой стороне участка и к восточному вводу дома. Положение столба ориентировочное; кабель, сечение, глубина, защита и узел учета уточняются по ТУ и проекту.', route: [ { infrastructure: 'powerPole' }, { x: 20.5, z: 0 }, { x: 24.4, z: 0.8 }, { x: 24.4, z: 24 }, { obj: 'house', side: 'east', along: -0.2 } ] },
{ system: 'electric', name: 'Электричество к бане', icon: '⚡', color: 0xff7a00, pipe: 'силовой кабель / защитная труба — уточнить', depth: 0.8, status: 'assumption', note: 'Ветка использует тот же правый инженерный коридор, что и ввод к дому; отдельный автомат, кабель и способ защиты выбираются рабочим проектом.', route: [ { obj: 'house', side: 'east', along: -0.2 }, { x: 24.4, z: 24 }, { x: 24.4, z: 11.5 }, { obj: 'bath', side: 'east', along: 0 } ] },
{ system: 'electric', name: 'Электричество к хозблоку', icon: '⚡', color: 0xff9800, pipe: 'силовой кабель / защитная труба — уточнить', depth: 0.8, status: 'assumption', note: 'Ветка идёт по правому техническому коридору и подходит к хозблоку со стороны соседней границы, не пересекая центральный газон.', route: [ { obj: 'house', side: 'east', along: -0.2 }, { x: 24.4, z: 24 }, { x: 24.4, z: 5 }, { obj: 'shed', side: 'east', along: 0 } ] },
{ system: 'electric', name: 'Резерв электрики к навесу', icon: '⚡', color: 0xffb300, pipe: 'резервная труба / кабель — уточнить', depth: 0.7, status: 'assumption', note: 'Резерв для освещения навеса, розетки и возможной зарядной точки. Маршрут начинается от условного фронтального распределительного узла и проходит вне пятна хозблока.', route: [ { x: 20.5, z: 0.8 }, { x: 17, z: 0.8 }, { x: 17, z: 6 }, { obj: 'canopy', side: 'east', along: 0 } ] },
{ system: 'electric', name: 'Автоматика ворот / калитки', icon: '⚡', color: 0xffd54f, pipe: 'резервная труба / кабель управления — уточнить', depth: 0.6, status: 'assumption', note: 'Короткий резерв от фронтального электрического узла к зоне ворот. Состав автоматики, домофона и слаботочных линий будет определён позже.', route: [ { x: 20.5, z: 0.8 }, { x: 17.0, z: 0.8 }, { infrastructure: 'entrance' } ] },
{ system: 'water', name: 'Вода от скважины', icon: '💧', color: 0x3366ff, pipe: 'ПНД Ø32 мм — предварительно', depth: 1.5, status: 'assumption', note: 'Короткий эскизный ввод от скважины к юго-восточной части дома; точка ввода, глубина и узел автоматики уточняются проектом.', route: [ { obj: 'well', point: 'center' }, { x: 20.8, z: 22.5 }, { obj: 'house', side: 'south', along: 0.85 } ] },
{ system: 'water', name: 'Вода к бане', icon: '💧', color: 0x3366ff, pipe: 'ПНД Ø25 мм — предварительно', depth: 1.5, status: 'assumption', note: 'Правый инженерный коридор от зоны скважины к восточной стене бани. Фактическая точка разветвления зависит от кессона/гидроаккумулятора и схемы водоподготовки.', route: [ { obj: 'well', point: 'center' }, { x: 24.2, z: 18.5 }, { x: 24.2, z: 11.5 }, { obj: 'bath', side: 'east', along: 0 } ] },
{ system: 'irrigation', name: 'Поливочная магистраль', icon: '💧', color: 0x42a5f5, pipe: 'ПНД / ПЭ — диаметр уточнить', depth: 0.5, status: 'assumption', note: 'Предварительная сезонная магистраль от дома к передней части участка. Трасса уведена по левому краю центральной зоны, в стороне от мангала. Глубина условна для визуализации; зимняя консервация, слив и автоматика определяются позже.', route: [ { obj: 'house', side: 'south', along: -0.2 }, { x: 8.0, z: 22 }, { x: 8.0, z: 14 }, { x: 10, z: 8 } ] },
{ system: 'irrigation', name: 'Полив огорода', icon: '💧', color: 0x29b6f6, pipe: 'ПНД / ПЭ — диаметр уточнить', depth: 0.5, status: 'assumption', note: 'Ответвление к правому краю огорода; точку крана/коллектора выбрать после окончательной разбивки грядок.', route: [ { x: 10, z: 8 }, { x: 9.5, z: 6 }, { obj: 'garden', side: 'east', along: 0 } ] },
{ system: 'irrigation', name: 'Полив теплицы', icon: '💧', color: 0x26c6da, pipe: 'ПНД / ПЭ — диаметр уточнить', depth: 0.5, status: 'assumption', note: 'Отдельное ответвление к теплице с резервом под кран или капельный полив.', route: [ { x: 10, z: 8 }, { x: 4.2, z: 8 }, { obj: 'greenhouse', side: 'east', along: 0 } ] },
{ system: 'gas', name: 'Полив газона (резерв)', icon: '💧', color: 0x00acc1, pipe: 'поливочная линия — схема уточняется', depth: 0.4, status: 'assumption', note: 'Только резерв распределительной линии по центральной зоне. Количество и расположение дождевателей нужно рассчитывать после выбора газона, давления и расхода воды.', route: [ { x: 10.5, z: 14 }, { x: 15.5, z: 14 }, { x: 15.5, z: 20.5 } ] },
{ system: 'sewer', name: 'Канализация (дом)', icon: '🚽', color: 0x9900cc, pipe: 'ПВХ Ø110 мм — схема предварительная', depth: 1.2, status: 'assumption', note: 'Самотечный коридор к условному узлу объединения у септика; отметки, уклон, ревизии и глубина выпуска требуют высотной съёмки и рабочего проекта.', route: [ { obj: 'house', side: 'south', along: -0.65 }, { x: 7.2, z: 23.5 }, { x: 5.2, z: 20.5 }, { obj: 'septic', point: 'center' } ] },
{ system: 'sewer', name: 'Канализация (баня)', icon: '🚽', color: 0x9900cc, pipe: 'ПВХ Ø110 мм — схема предварительная', depth: 1.0, status: 'assumption', note: 'Эскизная самотечная ветка от западной стены бани к общему узлу перед септиком. Трасса уходит по переднему краю центральной зоны, в стороне от мангала; пересечение с пешеходной дорожкой — подземное и требует конструктивной увязки.', route: [ { obj: 'bath', side: 'west', along: 0 }, { x: 14.5, z: 10.5 }, { x: 9.5, z: 10.5 }, { x: 6.0, z: 14.0 }, { x: 5.2, z: 20.5 }, { obj: 'septic', point: 'center' } ] },
{ system: 'lighting', name: 'Наружное освещение — пешеходный маршрут', icon: '💡', color: 0xfff176, pipe: 'резерв линии наружного освещения — параметры уточнить', depth: null, status: 'assumption', note: 'Линия следует вдоль основного пешеходного маршрута от дома к калитке. Реальные группы, кабель, защита, управление и глубина определяются электропроектом.', route: [ { obj: 'house', side: 'south', along: 0.1 }, { x: 13.2, z: 20.0 }, { x: 13.2, z: 16.5 }, { x: 11.8, z: 15.5 }, { x: 11.8, z: 9.0 }, { x: 12.0, z: 0.8 } ] },
{ system: 'lowvoltage', name: 'Слаботочка дом → калитка', icon: '📡', color: 0x7e57c2, pipe: 'отдельная резервная труба под связь/PoE — параметры уточнить', depth: null, status: 'assumption', note: 'Резервная слаботочная трасса вдоль пешеходного маршрута: домофон, камера ворот и будущие датчики. Совместную траншею с силовыми линиями допускается рассматривать только после проектной увязки разделения и защиты.', route: [ { obj: 'house', side: 'south', along: 0.25 }, { x: 13.2, z: 20.0 }, { x: 13.2, z: 16.5 }, { x: 11.8, z: 15.5 }, { x: 11.8, z: 9.0 }, { x: 12.0, z: 0.4 } ] },
{ system: 'gas', name: 'Магистральный газ', icon: '🔥', color: 0xffcc00, pipe: 'ПЭ Ø32 мм — параметр предварительный', depth: 1.2, status: 'assumption', note: 'Наличие и точное положение газовой магистрали в исходных данных не подтверждены. Линия показана только как сценарий возможного прохождения вдоль Рассветной улицы.', route: [ { x: 0, z: -0.8 }, { x: 25.001, z: -0.8 } ] },
{ system: 'gas', name: 'Газ к дому', icon: '🔥', color: 0xffcc00, pipe: 'ПЭ Ø32 мм — параметр предварительный', depth: 1.2, status: 'assumption', note: 'Эскиз возможного ввода от уличной стороны; точку подключения и трассу должен определить проект газоснабжения.', label: false, route: [ { x: 21, z: -0.8 }, { x: 24.5, z: 0 }, { x: 24.5, z: 24 }, { obj: 'house', side: 'east', along: -0.2 } ] }
],
// Репрезентативный день каждого месяца. Положение солнца, восход и закат
// вычисляются по координатам участка, долготе и часовому поясу UTC+3.
months: [
{ month: 1, day: 15 }, { month: 2, day: 15 }, { month: 3, day: 15 },
{ month: 4, day: 15 }, { month: 5, day: 15 }, { month: 6, day: 21 },
{ month: 7, day: 15 }, { month: 8, day: 15 }, { month: 9, day: 15 },
{ month: 10, day: 15 }, { month: 11, day: 15 }, { month: 12, day: 21 }
],
monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
};
const LAYOUT_ZONES = {
  lawn: { x: 14.5, z: 15.5, w: 5.5, d: 12, label: 'Газон / свободная зона', status: 'planned' },
  driveway: { x: 14.5, z: 1.5, w: 4, d: 3, label: 'Въезд к навесу', status: 'planned' },
  parking: { x: 14.5, z: 6, w: 4, d: 6, label: 'Парковка / будущий навес', status: 'planned' },
  shedServicePad: { x: 21, z: 2.25, w: 4.0, d: 1.5, label: 'Площадка перед хозблоком', status: 'planned' },
  guestParking: { label: 'Гостевая парковка — снаружи вдоль улицы', status: 'assumption', note: 'Не является подтверждённой парковочной полосой; возможность стоянки проверить по фактической обочине и ПДД' }
};
const LAYOUT_PATHS = [
  { id:'wicket-a', label:'Калитка → дом', a:[12.0,0.0], b:[11.8,9.0], width:1.2 },
  { id:'wicket-b', label:'Калитка → дом', a:[11.8,9.0], b:[11.8,15.5], width:1.2 },
  { id:'wicket-c', label:'Калитка → дом', a:[11.8,15.5], b:[13.2,16.5], width:1.2 },
  { id:'wicket-d', label:'Калитка → дом', a:[13.2,16.5], b:[13.2,20.0], width:1.2 },
  { id:'bath', label:'К бане', a:[13.2,17.0], b:[17.75,17.0], width:1.1 },
  { id:'garden', label:'К огороду', a:[11.8,6.0], b:[9.2,6.0], width:0.9 },
  { id:'shed-service', label:'Въезд → хозблок', a:[16.1,1.5], b:[19.0,2.2], width:1.4 },
  { id:'shed-front', label:'Подход к хозблоку', a:[19.0,2.2], b:[21.0,2.2], width:1.4 }
];
const SITE_LIGHT_POINTS = [
  { id:'wicket-light', label:'Свет у калитки', x:12.0, z:0.9, h:2.2, kind:'post' },
  { id:'path-light-1', label:'Свет дорожки', x:11.8, z:9.0, h:0.8, kind:'bollard' },
  { id:'path-light-2', label:'Свет дорожки', x:13.2, z:18.5, h:0.8, kind:'bollard' },
  { id:'house-entry-light', label:'Свет у входа в дом', x:13.2, z:24.7, h:2.4, kind:'wall' },
  { id:'bath-entry-light', label:'Свет террасы бани', x:20.75, z:15.0, h:2.2, kind:'wall' },
  { id:'shed-entry-light', label:'Свет у хозблока', x:21.0, z:2.35, h:2.2, kind:'wall' },
  { id:'canopy-light', label:'Свет под навесом', x:14.5, z:8.6, h:2.4, kind:'ceiling' }
];
const SECURITY_POINTS = [
  { id:'intercom', label:'Домофон / вызов', x:12.0, z:0.35, kind:'intercom' },
  { id:'gate-camera', label:'Камера ворот', x:16.2, z:0.8, kind:'camera' },
  { id:'yard-camera', label:'Камера на двор', x:20.2, z:24.8, kind:'camera' }
];
const MASTER_REVIEW = {
  label: 'MASTER v1',
  note: 'Планировочная контрольная точка. Формулировка «зафиксировано» означает, что объект не двигаем без новой причины; это не заменяет ГПЗУ, изыскания или рабочий проект.',
  planningFrozen: [
    'Геометрия участка 25,001×40,002 м и фасад по короткой стороне z=0',
    'Положение дома и его основная посадка в задней части участка',
    'Правая группа: хозблок + баня с террасой и входом со стороны дома',
    'Одно внутреннее машиноместо и резерв будущего навеса; гостевые машины — вне участка',
    'Теплица и огород в передней левой солнечной зоне',
    'Центральный газон, детская площадка и мангальная зона как единая семейная часть участка',
    'Пешеходный маршрут калитка → дом с ответвлениями к бане и огороду',
    'Хозяйственный подход от въезда к хозблоку и вход хозблока со стороны Рассветной'
  ],
  preliminary: [
    'Точные точки скважины и ЛОС/септика',
    'Все подземные трассы, их глубины, футляры и взаимные отметки',
    'Резерв накопления дождевой воды и необходимость фундаментного дренажа',
    'Точки наружного света, камер и слаботочной инфраструктуры',
    'Точное положение ворот/калитки и фактическое положение электрического столба',
    'Любая газовая трасса — только сценарий до получения данных газовой сети'
  ],
  openInputs: [
    'ГПЗУ / красные линии / уточнение допустимой посадки объектов',
    'Топографическая или высотная съёмка для вертикальной планировки',
    'Геология, УГВ и направление потока грунтовых вод',
    'Выбор типа ЛОС/накопительной системы и её паспортные требования',
    'Фактические данные бурения: глубина, дебит и конструкция скважины',
    'ТУ на электроснабжение, доступная мощность и схема щитов/заземления',
    'Подтверждение наличия и положения газовой сети',
    'Конструкция фундамента и проект кровли дома/бани/навеса',
    'Контуры соседних строений для окончательной пожарной проверки',
    'Фактическая обочина Рассветной и возможность гостевой стоянки'
  ],
  buildPhases: [
    { n:0, title:'Исходные данные', items:'ГПЗУ, топосъёмка/высоты, геология/УГВ, ТУ электричества, решение по газу и типу ЛОС.' },
    { n:1, title:'Доступ и тяжёлая техника', items:'Геодезический вынос, временный въезд, бурение скважины и сохранение доступа буровой/сервисной техники.' },
    { n:2, title:'Подземный каркас', items:'Черновая вертикальная планировка; ввод электричества; основные гильзы/траншеи воды, канализации, слаботочки; ЛОС; резервы ливнёвки и полива.' },
    { n:3, title:'Дом', items:'Фундамент с заранее заложенными вводами и гильзами, затем коробка/кровля; после кровли уточнить водостоки и ливнёвку.' },
    { n:4, title:'Баня + хозблок + навес', items:'Строить с сохранением утверждённых проходов, террасы и правого инженерного коридора; подключить заложенные резервы.' },
    { n:5, title:'Чистовые покрытия и свет', items:'Постоянный въезд/парковка, дорожки, площадки, наружное освещение, ворота/домофон/камеры — после завершения основных земляных работ.' },
    { n:6, title:'Огород и полив', items:'Теплица, грядки, коллекторы/краны полива и при необходимости ёмкость дождевой воды.' },
    { n:7, title:'Газон, детская зона и озеленение', items:'Финишный рельеф, плодородный слой, газон, детская площадка и посадки. Деревья/крупные кусты не размещать над инженерными коридорами и сервисными зонами.' }
  ]
};
const LANDSCAPE_PLAN = {
  status: 'assumption',
  note: 'Озеленение v1 показано отдельным полупрозрачным слоем. Это будущие посадки, а не существующие деревья; по умолчанию они не участвуют в текущем расчёте теней пустого участка.',
  trees: [
    { id:'tree-a', label:'Компактное плодовое дерево A', x:2.5, z:14.5, radius:1.1, h:3.5, type:'compact-fruit', note:'Карман за теплицей. До ближайшей нанесённой инженерной трассы около 3 м; не занимает центральный газон.' },
    { id:'tree-b', label:'Компактное плодовое дерево B', x:2.0, z:22.0, radius:1.1, h:3.5, type:'compact-fruit', note:'Левая часть перед домом. До ближайшей нанесённой инженерной трассы около 2 м; сохраняет центральный газон открытым.' }
  ],
  shrubZones: [
    { id:'rear-hedge', label:'Невысокая полоса кустарников для приватности', x:12.5, z:38.5, w:17.0, d:0.8, h:1.6, note:'Только неглубокая/контролируемая корневая система. Полоса расположена за домом и оставляет резерв до условного дренажного коридора.' },
    { id:'bath-border', label:'Декоративная группа у террасы бани', x:20.7, z:19.3, w:3.2, d:0.8, h:1.2, note:'Невысокая кустарниково-многолетняя группа севернее террасы. До ближайшей нанесённой инженерной трассы около 1,5 м; перед посадкой уточнить фактическую трассу воды и корневую зону выбранных растений.' }
  ],
  containers: [
    { id:'wicket-planter', label:'Контейнерный акцент у калитки', x:10.7, z:0.8, w:0.65, d:0.65, h:0.65, note:'Съёмный контейнер, а не посадка в грунт: позволяет сохранить доступ к ливнёвке и инженерным резервам у фасада.' },
    { id:'bath-planter', label:'Контейнер у террасы бани', x:22.7, z:18.0, w:0.7, d:0.7, h:0.7, note:'Контейнер на краю террасы для сезонного акцента; не создаёт постоянной корневой зоны над коммуникациями.' }
  ],
  screens: [
    { id:'shed-green-screen', label:'Зелёный экран хозблока', x:17.85, z:5.2, w:0.18, d:2.2, h:1.8, note:'Узкий декоративный экран/решётка вдоль западной стены хозблока со стороны двора. Не перекрывает вход со стороны Рассветной и не требует широкой корневой зоны.' }
  ],
  planningRules: [
    'Корневые кустарниковые группы добавлять только там, где есть понятный резерв до инженерных трасс; в сомнительных местах использовать контейнеры/решётки.',
    'Не размещать деревья в правом инженерном коридоре около скважины, воды и электрики.',
    'Не занимать деревьями центральный газон и подходы к бане/хозблоку.',
    'Не ставить крупные корневые системы над канализацией, водопроводом, слаботочкой, дренажом и ревизионными зонами.',
    'Существующих деревьев на участке в модели нет; этот слой — только будущий сценарий.',
    'Высокорослые деревья пока не закладываются: точные отступы от границ для ИЖС проверяем отдельно по местным требованиям/ГПЗУ.'
  ]
};
const PLANNING_FROZEN_OBJECTS = new Set(['house','bath','shed','garden','greenhouse','playground','firepit','car','canopy']);
const STORAGE_KEY = 'bern_layout_v2';
const VARIANTS_KEY = 'bern_layout_variants_v2';
const CATALOG_KEY = 'bern_catalog_v2';
const PROJECT_STATE_KEY = 'bern_project_state_v2';
const BACKUPS_KEY = 'bern_project_backups_v2';
const BACKUP_FORMAT = 'bern-project-backup';
const BACKUP_SCHEMA = 6;
const BACKUP_LIMIT = 5;
const STATUS_DEFS = {
existing: { label: 'Существует', icon: '●', className: 'status-existing' },
planned: { label: 'Планируется', icon: '◷', className: 'status-planned' },
assumption: { label: 'Предположение', icon: '?', className: 'status-assumption' },
confirmed: { label: 'Подтверждено', icon: '✓', className: 'status-confirmed' }
};
const PROJECT_FACTS = [
{ id: 'cadastral', label: 'Кадастровый номер 50:16:0202016:428', status: 'confirmed', note: 'По выписке ЕГРН' },
{ id: 'boundary', label: 'Границы 25,001 × 40,002 м', status: 'confirmed', note: 'По четырём межевым знакам акта, МСК-50 зона 2' },
{ id: 'roadSide', label: 'Улица Рассветная вдоль короткой стороны 25,001 м (z=0, ребро М4–М3)', status: 'confirmed', note: 'Подтверждённая ориентация участка: фасад по Рассветной — короткая сторона; дорожный участок 50:16:0202016:526' },
{ id: 'gpsCenter', label: 'GPS центра 56.042291, 38.417342', status: 'assumption', note: 'Привязка для визуализации; не заменяет геодезический вынос' },
{ id: 'workingLayout', label: 'Рабочая планировка v2', status: 'assumption', note: 'MASTER v1 сохранён. Озеленение v2 развивает будущий слой: добавлена декоративная группа у террасы бани, контейнер у калитки, контейнерный акцент на террасе и узкий зелёный экран хозблока; геометрия и инженерный каркас не меняются.' },
{ id: 'wastewaterType', label: 'Тип ЛОС / накопительной системы', status: 'assumption', note: 'Не выбран. До выбора оборудования нельзя окончательно утверждать размеры, расстояния до дома, способ отвода очищенной воды и сервисный доступ.' },
{ id: 'hydrogeology', label: 'Гидрогеология / УГВ / направление грунтовых вод', status: 'assumption', note: 'Нет подтверждённых данных. Нужны для окончательного выбора места скважины и ЛОС и оценки санитарных рисков.' },
{ id: 'powerCorridor', label: 'Правый электрический коридор', status: 'assumption', note: 'Зарезервирован общий маршрут ввод → дом с ветками к бане и хозблоку; окончательная схема зависит от ТУ, мощности и электрощитов.' },
{ id: 'irrigationPlan', label: 'Полив огорода / теплицы / газона', status: 'assumption', note: 'Показаны трассировочные резервы. Дождеватели, капельный полив, автоматика и диаметры выбираются после подтверждения дебита и давления.' },
{ id: 'stormwaterPlan', label: 'Ливнёвка с дома / бани / навеса', status: 'assumption', note: 'Вода сводится к резервной точке X≈10,2/Z≈9,0. Объём накопителя, отметки, перелив и фактические уклоны определяются после вертикальной планировки.' },
{ id: 'foundationDrainage', label: 'Дренаж фундамента дома', status: 'assumption', note: 'Пока только резерв коридора. Необходимость подтверждается по фундаменту, грунтам и УГВ; без изысканий дренаж не считается обязательным.' },
{ id: 'verticalLevels', label: 'Вертикальная планировка и высотные отметки', status: 'assumption', note: 'Нет высотной съёмки. До неё нельзя окончательно задавать самотёчные уклоны ливнёвки, дренажа и точку безопасного перелива.' },
{ id: 'outdoorLighting', label: 'Наружное освещение участка', status: 'assumption', note: 'Зарезервированы световые точки у калитки, вдоль дорожки, у входа дома, бани, хозблока и навеса. Типы светильников, мощности, датчики и группы управления выбираются позже.' },
{ id: 'lowVoltage', label: 'Домофон / камеры / слаботочка', status: 'assumption', note: 'Предусмотрена отдельная резервная трасса дом → калитка, камера ворот и камера на двор. Кабельная архитектура, PoE/питание и оборудование пока не выбраны.' },
{ id: 'networkCrossings', label: 'Ревизия пересечений инженерных трасс', status: 'assumption', note: 'В отчёт добавлен автоматический 2D-аудит пересечений разных систем. Найденное пересечение не является нарушением само по себе и требует проектной увязки по глубине и защите.' },
{ id: 'masterFreeze', label: 'MASTER v1 — функциональная планировка зафиксирована', status: 'planned', note: 'Дом, банно-хозяйственная группа, парковка/навес, огород/теплица, центральный газон и основные маршруты считаются планировочно зафиксированными. Это не юридическое или инженерное согласование.' },
{ id: 'landscapePlan', label: 'Озеленение v2 — деревья, декоративные кустарники, контейнеры и зелёный экран', status: 'assumption', note: 'Будущие посадки показаны отдельным слоем и не считаются существующими деревьями. Корневые посадки ограничены безопасными карманами; у калитки и хозблока применены контейнерные/вертикальные решения из-за плотной инженерной схемы.' }
];
CONFIG.objects.forEach(o => { if (!o.status) o.status = o.id === 'car' ? 'assumption' : 'planned'; });
CONFIG.utilities.forEach(u => { if (!u.status) { u.status = 'assumption'; u.note = 'Предварительная трасса; уточнить рабочим проектом'; } });
const REVIEW_LAYOUT = V6_REVIEW || ['layout-v2','layout-v2-1','layout-v2-2','routes-v1','routes-v1-1','engineering-v1','engineering-v2','engineering-v3','engineering-v4','engineering-v5','master-v1','landscape-v1','landscape-v2'].includes(new URLSearchParams(window.location.search).get('review'));
const DEFAULT_LAYOUT = {};
CONFIG.objects.forEach(o => { DEFAULT_LAYOUT[o.id] = { x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius }; });
let hadSavedLayout = false;
function loadSavedLayout() {
try {
if (REVIEW_LAYOUT) return;
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
	if (s && STATUS_DEFS[s.status]) o.status = s.status;
	if (s && typeof s.note === 'string') o.note = s.note;
if (s) hadSavedLayout = true;
});
}
} catch (e) { console.warn('Не удалось загрузить сохранённую планировку:', e); }
}
loadSavedLayout();
function saveLayout() {
if (BernV6.ready) syncDependencies();
if (BernV6.readOnly) return;
try {
const objects = {};
	CONFIG.objects.forEach(o => { objects[o.id] = { x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius, status: o.status, note: o.note }; });
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 2, savedAt: Date.now(), objects }));
	if (window.CAT) window.CAT.save();
	saveProjectState();
 if (BernV6.persist) BernV6.persist();
} catch (e) { console.warn('Не удалось сохранить планировку:', e); }
}
function loadVariants() { try { return JSON.parse(localStorage.getItem(VARIANTS_KEY)) || {}; } catch (e) { return {}; } }
function saveVariants(v) { if (BernV6.readOnly) return; try { localStorage.setItem(VARIANTS_KEY, JSON.stringify(v)); } catch (e) {} }
function normalizeStatus(value, fallback) { return STATUS_DEFS[value] ? value : (fallback || 'assumption'); }
function statusChip(value) {
const key = normalizeStatus(value);
const d = STATUS_DEFS[key];
return `<span class="status-chip ${d.className}">${d.icon} ${d.label}</span>`;
}
function statusOptions(selected) {
return Object.keys(STATUS_DEFS).map(key => `<option value="${key}"${key === normalizeStatus(selected) ? ' selected' : ''}>${STATUS_DEFS[key].label}</option>`).join('');
}
function loadProjectState() {
if (REVIEW_LAYOUT) return;
try {
const raw = localStorage.getItem(PROJECT_STATE_KEY); if (!raw) return;
const data = JSON.parse(raw);
(data.facts || []).forEach(s => { const f = PROJECT_FACTS.find(x => x.id === s.id); if (f) { f.status = normalizeStatus(s.status, f.status); if (typeof s.note === 'string') f.note = s.note; } });
Object.keys(data.infrastructure || {}).forEach(k => { if (CONFIG.infrastructure[k]) Object.assign(CONFIG.infrastructure[k], { status: normalizeStatus(data.infrastructure[k].status, CONFIG.infrastructure[k].status), note: data.infrastructure[k].note || CONFIG.infrastructure[k].note }); });
(data.utilities || []).forEach(s => { const u = CONFIG.utilities.find(x => x.name === s.name); if (u) { u.status = normalizeStatus(s.status, u.status); if (typeof s.note === 'string') u.note = s.note; } });
} catch (e) { console.warn('Не удалось загрузить статусы проекта:', e); }
}
function saveProjectState() {
if (BernV6.readOnly) return;
try {
const infrastructure = {};
Object.keys(CONFIG.infrastructure).forEach(k => { infrastructure[k] = { status: CONFIG.infrastructure[k].status, note: CONFIG.infrastructure[k].note }; });
localStorage.setItem(PROJECT_STATE_KEY, JSON.stringify({ v: 1, savedAt: Date.now(), facts: plainClone(PROJECT_FACTS), infrastructure, utilities: CONFIG.utilities.map(u => ({ name: u.name, status: u.status, note: u.note })) }));
} catch (e) { console.warn('Не удалось сохранить статусы проекта:', e); }
}
loadProjectState();
function plainClone(value) {
return JSON.parse(JSON.stringify(value, (key, item) => key.startsWith('_') ? undefined : item));
}
function snapshotFullScene() {
return {
 schemaVersion: PROJECT_SCHEMA_VERSION, masterV6: BernV6.project ? plainClone(BernV6.project) : undefined,
	v: 5,
	layoutVersion: 2,
	savedAt: Date.now(),
	objects: plainClone(CONFIG.objects),
	utilities: plainClone(CONFIG.utilities),
	infrastructure: plainClone(CONFIG.infrastructure),
	projectFacts: plainClone(PROJECT_FACTS)
};
}
function snapshotObjectList(snapshot) {
if (Array.isArray(snapshot)) return snapshot;
return snapshot && Array.isArray(snapshot.objects) ? snapshot.objects : [];
}
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
	projectDataModal: document.getElementById('project-data-modal'),
	projectStatusSummary: document.getElementById('project-status-summary'),
	projectStatusTbody: document.getElementById('project-status-tbody'),
	backupList: document.getElementById('backup-list'),
	exportProjectJson: document.getElementById('export-project-json'),
	importProjectJson: document.getElementById('import-project-json'),
	projectJsonFile: document.getElementById('project-json-file'),
	createLocalBackup: document.getElementById('create-local-backup'),
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
	projectDataBtn: document.getElementById('project-data-btn'),
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
	catalog: document.getElementById('catalogMob'), projectData: document.getElementById('projectDataMob')
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
sprite.userData.labelText = text;
sprite.scale.set(scale[0] * size, scale[1] * size, 1);
return sprite;
},
fmt(v) { return v.toFixed(1).replace('.', ','); }
};
Utils.ensureRoundRect();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(...CONFIG.camera.default);
camera.lookAt(CONFIG.center.x, 0, CONFIG.center.z);
const renderer = createBernRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(CONFIG.center.x, 0, CONFIG.center.z);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.2;
controls.addEventListener('change', () => Utils.markDirty());
controls.update();
const sunLight = new THREE.DirectionalLight(0xffeedd, 1.0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -28; sunLight.shadow.camera.right = 28;
sunLight.shadow.camera.top = 28; sunLight.shadow.camera.bottom = -28;
sunLight.shadow.camera.near = 1; sunLight.shadow.camera.far = 90;
sunLight.shadow.bias = -0.0004; sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
scene.add(sunLight.target);
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);
const fillLight = new THREE.DirectionalLight(0xccddff, 0.3);
fillLight.position.set(-20, 10, -20);
scene.add(fillLight);
const hemiLight = new THREE.HemisphereLight(0x9bc4e2, 0x4a7d4a, 0.35);
scene.add(hemiLight);
const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 24), new THREE.MeshBasicMaterial({ color: 0xfff3b0, fog: false }));
scene.add(sunDisc);
const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(3.6, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffd86b, transparent: true, opacity: 0.18, fog: false }));
scene.add(sunGlow);
const groups = {
site: new THREE.Group(), house: new THREE.Group(), comms: new THREE.Group(),
labels: new THREE.Group(), objectLabels: new THREE.Group(),
norms: new THREE.Group(), violRings: new THREE.Group()
};
Object.values(groups).forEach(g => scene.add(g));
groups.violRings.visible = false;
const cameraTween = {
active: false, startTime: 0, duration: 1400,
fromPos: new THREE.Vector3(), toPos: new THREE.Vector3(),
fromTarget: new THREE.Vector3(), toTarget: new THREE.Vector3(),
start(toPos, toTarget) {
this.fromPos.copy(camera.position); this.fromTarget.copy(controls.target);
this.toPos.copy(toPos); this.toTarget.copy(toTarget);
this.startTime = performance.now(); this.active = true; controls.enabled = false;
},
update() {
if (!this.active) return false;
let t = (performance.now() - this.startTime) / this.duration;
if (t >= 1) { t = 1; this.active = false; controls.enabled = true; }
const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
camera.position.lerpVectors(this.fromPos, this.toPos, e);
controls.target.lerpVectors(this.fromTarget, this.toTarget, e);
camera.lookAt(controls.target);
return true;
}
};
function makeTexture(w, h, drawFn) {
const canvas = document.createElement('canvas');
canvas.width = w; canvas.height = h;
drawFn(canvas.getContext('2d'), w, h);
const texture = new THREE.CanvasTexture(canvas);
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
return texture;
}
const Textures = {
grass: (() => { const t = makeTexture(256, 256, (ctx, w, h) => { ctx.fillStyle = '#4caf50'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 2000; i++) { const x = Math.random() * w, y = Math.random() * h; const s = Math.floor(60 + Math.random() * 60); ctx.fillStyle = `rgb(${s}, ${s + 100}, ${s})`; ctx.fillRect(x, y, 2, 4); } }); t.repeat.set(20, 20); return t; })(),
road: (() => { const t = makeTexture(256, 256, (ctx, w, h) => { ctx.fillStyle = '#444'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 1000; i++) { ctx.fillStyle = '#555'; ctx.fillRect(Math.random()*w, Math.random()*h, 3, 1); } }); t.repeat.set(10, 3); return t; })(),
path: (() => { const t = makeTexture(128, 128, (ctx, w, h) => { ctx.fillStyle = '#aaa'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#888'; ctx.lineWidth = 1; for (let i = 0; i < 20; i++) ctx.strokeRect(10 + i * 6, 10, 40, 40); }); t.repeat.set(4, 4); return t; })(),
roof: (() => { const t = makeTexture(128, 128, (ctx, w, h) => { ctx.fillStyle = '#8b4513'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#a0522d'; for (let i = 0; i < 20; i++) { ctx.fillRect(i * 10, 0, 8, h); ctx.fillRect(0, i * 10, w, 8); } }); t.repeat.set(4, 3); return t; })()
};
const maxAniso = renderer.capabilities.getMaxAnisotropy();
Object.values(Textures).forEach(t => t.anisotropy = maxAniso);
const MaterialPool = (() => {
const cache = new Map();
return {
get(color, opts = {}) {
const key = `${color}_${opts.roughness||0.6}_${opts.metalness||0.1}_${opts.transparent||false}`;
if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness: opts.roughness || 0.6, metalness: opts.metalness || 0.1, transparent: opts.transparent || false, opacity: opts.opacity || 1, side: opts.side || THREE.FrontSide }));
return cache.get(key);
},
rough: (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.9 }),
metal: (color) => new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 })
};
})();
const GeoPool = {
box: (w, h, d) => new THREE.BoxGeometry(w, h, d),
cylinder: (rT, rB, h, s = 16) => new THREE.CylinderGeometry(rT, rB, h, s),
sphere: (r, s = 8) => new THREE.SphereGeometry(r, s, s),
plane: (w, h) => new THREE.PlaneGeometry(w, h)
};
function makeBox(w, h, d, color, pos, opts = {}) {
const mesh = new THREE.Mesh(GeoPool.box(w, h, d), MaterialPool.get(color));
mesh.position.set(pos[0], pos[1], pos[2]);
mesh.castShadow = opts.castShadow !== false; mesh.receiveShadow = opts.receiveShadow !== false;
return mesh;
}
function makeCylinder(rT, rB, h, color, pos, segs = 16) {
const mesh = new THREE.Mesh(GeoPool.cylinder(rT, rB, h, segs), MaterialPool.get(color, { roughness: 0.5 }));
mesh.position.set(pos[0], pos[1], pos[2]);
mesh.castShadow = true; mesh.receiveShadow = true;
return mesh;
}
function makeTree(scale = 1) {
const g = new THREE.Group();
const trunk = new THREE.Mesh(GeoPool.cylinder(0.25*scale, 0.35*scale, 1.8*scale, 6), MaterialPool.rough(0x5d4037));
trunk.position.y = 0.9 * scale; trunk.castShadow = trunk.receiveShadow = true; g.add(trunk);
const crown = new THREE.Mesh(GeoPool.sphere(0.9*scale, 6), MaterialPool.rough(0x2e7d32));
crown.position.y = 1.8*scale + 0.6*scale; crown.castShadow = crown.receiveShadow = true; g.add(crown);
return g;
}
function makeGreenhouse(b) {
const group = new THREE.Group();
const halfW = b.w / 2;
const frameMat = MaterialPool.metal(0x3a3a3a);
const polyMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.32, side: THREE.DoubleSide, roughness: 0.2 });
const archX = (t) => -halfW * Math.cos(t * Math.PI);
const archY = (t) => b.h * Math.sin(t * Math.PI);
const numArcs = 13, arcSteps = 24;
for (let i = 0; i < numArcs; i++) {
const zPos = i * (b.d / (numArcs - 1));
const pts = [];
for (let j = 0; j <= arcSteps; j++) { const t = j / arcSteps; pts.push(new THREE.Vector3(archX(t), archY(t), 0)); }
const curve = new THREE.CatmullRomCurve3(pts);
const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.04, 5, false), frameMat);
tube.position.z = zPos; tube.castShadow = tube.receiveShadow = true; group.add(tube);
}
const ridgeCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, b.h, 0), new THREE.Vector3(0, b.h, b.d)]);
const ridgeMesh = new THREE.Mesh(new THREE.TubeGeometry(ridgeCurve, 2, 0.035, 5, false), frameMat);
ridgeMesh.castShadow = ridgeMesh.receiveShadow = true; group.add(ridgeMesh);
[-halfW, halfW].forEach(xPos => {
const railCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(xPos, 0.05, 0), new THREE.Vector3(xPos, 0.05, b.d)]);
const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 2, 0.03, 5, false), frameMat);
rail.castShadow = true; group.add(rail);
});
const zSeg = 20, xSeg = 16;
const verts = [], idx = [];
for (let i = 0; i <= zSeg; i++) { const z = (i / zSeg) * b.d; for (let j = 0; j <= xSeg; j++) { const t = j / xSeg; verts.push(archX(t), archY(t), z); } }
const cols = xSeg + 1;
for (let i = 0; i < zSeg; i++) for (let j = 0; j < xSeg; j++) { const a = i * cols + j; idx.push(a, a + cols, a + 1, a + 1, a + cols, a + cols + 1); }
const roofGeo = new THREE.BufferGeometry();
roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
roofGeo.setIndex(idx); roofGeo.computeVertexNormals();
const roofMesh = new THREE.Mesh(roofGeo, polyMat);
roofMesh.castShadow = roofMesh.receiveShadow = true; group.add(roofMesh);
const endShape = new THREE.Shape();
for (let j = 0; j <= xSeg; j++) { const t = j / xSeg, px = archX(t), py = archY(t); if (j === 0) endShape.moveTo(px, py); else endShape.lineTo(px, py); }
const endGeo = new THREE.ShapeGeometry(endShape);
[0, b.d].forEach(zEnd => { const wall = new THREE.Mesh(endGeo, polyMat); wall.position.z = zEnd; group.add(wall); });
const dW = 0.8, dH = 1.8;
group.add(makeBox(0.05, dH, 0.05, 0x666666, [-dW/2, dH/2, 0.02], {castShadow:false}));
group.add(makeBox(0.05, dH, 0.05, 0x666666, [dW/2, dH/2, 0.02], {castShadow:false}));
group.add(makeBox(dW, 0.05, 0.05, 0x666666, [0, dH, 0.02], {castShadow:false}));
const handle = new THREE.Mesh(GeoPool.sphere(0.04, 6), MaterialPool.get(0xffaa00));
handle.position.set(dW/2 - 0.1, dH/2, 0.06); group.add(handle);
const windowMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
for (let zPos = 1.5; zPos < b.d; zPos += 2.5) {
[-halfW, halfW].forEach((xPos, k) => {
const win = new THREE.Mesh(GeoPool.plane(0.6, 0.6), windowMat);
win.position.set(xPos + (k === 0 ? 0.02 : -0.02), 1.2, zPos);
win.rotation.y = Math.PI/2; group.add(win);
const frame = makeBox(0.02, 0.6, 0.6, 0x666666, [xPos, 1.2, zPos], {castShadow:false});
frame.rotation.y = Math.PI/2; group.add(frame);
});
}
group.position.set(b.x, 0, b.z);
return group;
}
const Builders = {
house(b) { const g = new THREE.Group(); g.add(makeBox(b.w, b.h, b.d, b.color, [0, b.h/2, 0])); const roofRise = 2.5; const shape = new THREE.Shape(); shape.moveTo(-b.d/2, b.h); shape.lineTo(0, b.h + roofRise); shape.lineTo(b.d/2, b.h); shape.lineTo(-b.d/2, b.h); const gableGeo = new THREE.ExtrudeGeometry(shape, { depth: b.w, bevelEnabled: false }); gableGeo.translate(0, 0, -b.w/2); gableGeo.computeVertexNormals(); const roof = new THREE.Mesh(gableGeo, new THREE.MeshStandardMaterial({ map: Textures.roof, roughness: 0.8 })); roof.rotation.y = Math.PI/2; roof.castShadow = roof.receiveShadow = true; g.add(roof); if (b.terrace) g.add(makeBox(b.terrace.w, 0.3, b.terrace.d, b.terrace.color, [0, 0.15, -b.d/2 - b.terrace.d/2])); g.position.set(b.x, 0, b.z); return g; },
bath(b) {
  const g = new THREE.Group();
  g.add(makeBox(b.w, b.h, b.d, b.color, [0, b.h/2, 0]));
  g.add(makeBox(b.w + 0.6, 0.3, b.d + 0.6, b.roofColor, [0, b.h + 0.15, 0]));
  if (b.terrace) g.add(makeBox(b.terrace.w, 0.2, b.terrace.d, b.terrace.color, [0, 0.1, b.d/2 + b.terrace.d/2]));
  if (b.entranceSide === 'north') {
    const door = makeBox(b.entranceWidth || 1.1, 2.15, 0.08, 0x3b2a22, [0, 1.075, b.d/2 + 0.045]);
    door.castShadow = true; g.add(door);
    const step = makeBox((b.entranceWidth || 1.1) + 0.35, 0.08, 0.5, 0x6d5548, [0, 0.04, b.d/2 + 0.25]);
    step.receiveShadow = true; g.add(step);
  }
  g.position.set(b.x, 0, b.z); return g;
},
shed(b) { 
  const g = new THREE.Group(); 
  g.add(makeBox(b.w, b.h, b.d, b.color, [0, b.h/2, 0])); 
  const roof = new THREE.Mesh(new THREE.ConeGeometry(4, 1.2, 4), MaterialPool.get(b.roofColor, { roughness: 0.8 })); 
  roof.position.y = b.h + 0.6; roof.rotation.y = Math.PI/4; roof.castShadow = true; g.add(roof);
  if (b.entranceSide === 'south') {
    const door = makeBox(b.entranceWidth || 1.2, 2.15, 0.08, 0x2f2f2f, [0, 1.075, -b.d/2 - 0.045]);
    door.castShadow = true; g.add(door);
    const threshold = makeBox((b.entranceWidth || 1.2) + 0.35, 0.08, 0.55, 0x7b736b, [0, 0.04, -b.d/2 - 0.28]);
    threshold.receiveShadow = true; g.add(threshold);
  }
  g.position.set(b.x, 0, b.z); return g; 
},
garden(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.2, b.d, b.color, [0, 0.1, 0])); for (let i = 0; i < 5; i++) g.add(makeBox(3.5, 0.3, 0.6, 0x5a7a1a, [0, 0.3, -b.d/2 + 0.5 + i * 1.5])); g.position.set(b.x, 0, b.z); return g; },
greenhouse: makeGreenhouse,
playground(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.3, b.d, b.color, [0, 0.15, 0])); g.add(makeCylinder(0.08, 0.08, 0.8, 0x888888, [0.5, 0.4, 0.5])); g.position.set(b.x, 0, b.z); return g; },
firepit(b) { const g = new THREE.Group(); g.add(makeCylinder(b.radius, b.radius, 0.2, b.color, [0, 0.1, 0])); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.add(makeCylinder(0.12, 0.18, 0.15, 0x7a6a5a, [Math.cos(a) * (b.radius + 0.1), 0.15, Math.sin(a) * (b.radius + 0.1)])); } g.position.set(b.x, 0, b.z); return g; },
car(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.5, b.d, b.color, [0, 0.25, 0])); g.add(makeBox(1.2, 0.35, 1.6, 0x2c3e50, [1.3, 0.55, 0])); g.position.set(b.x, 0, b.z); return g; },
canopy(b) { const g = new THREE.Group(); const px = b.w/2 - 0.14, pz = b.d/2 - 0.14; [[px,pz],[px,-pz],[-px,pz],[-px,-pz]].forEach(p => g.add(makeBox(0.16, b.h, 0.16, 0x607d8b, [p[0], b.h/2, p[1]]))); const roof = makeBox(b.w + 0.25, 0.12, b.d + 0.25, b.color, [0, b.h, 0]); roof.material = new THREE.MeshStandardMaterial({ color: b.color, transparent: true, opacity: 0.34, roughness: 0.35, metalness: 0.2 }); g.add(roof); const outline = new THREE.LineSegments(new THREE.EdgesGeometry(GeoPool.box(b.w, b.h, b.d)), new THREE.LineDashedMaterial({ color: 0xd7e3e8, dashSize: 0.35, gapSize: 0.2, transparent: true, opacity: 0.75 })); outline.computeLineDistances(); outline.position.y = b.h/2; g.add(outline); g.position.set(b.x, 0, b.z); return g; },
septic(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.8, b.d, b.color, [0, 0.4, 0])); g.position.set(b.x, 0, b.z); return g; },
well(b) { const g = new THREE.Group(); g.add(makeCylinder(b.radius, b.radius * 1.5, 0.8, b.color, [0, 0.4, 0])); g.add(makeCylinder(b.radius * 2, b.radius * 2.2, 0.1, 0x95a5a6, [0, 0.85, 0])); g.position.set(b.x, 0, b.z); return g; }
};
// ═══════════════════════════════════════════════════════════════
// КАТАЛОГ ОБЪЕКТОВ: справочник типов и 3D-модели (задача №1)
// ═══════════════════════════════════════════════════════════════
const CATALOG = {
gazebo: { label: '⛱ Беседка', w: 4, d: 4, h: 3, color: 0x9c7a54, labelColor: '#e8c99b', labelSize: 0.9 },
pool: { label: '🏊 Бассейн', w: 4, d: 6, h: 1.2, color: 0x3aa6d9, labelColor: '#7fd4ff', labelSize: 0.9 },
garage: { label: '🚗 Гараж', w: 6, d: 4, h: 3, color: 0xaab4bb, labelColor: '#cfd8dc', labelSize: 0.9 },
fruit_tree: { label: '🍎 Плодовое дерево', w: 2, d: 2, h: 4, radius: 1, color: 0x5a9e4b, labelColor: '#9be89b', labelSize: 0.85 },
grill: { label: '🍢 Мангальная зона', w: 2, d: 2, h: 1.1, color: 0x37474f, labelColor: '#ff9e80', labelSize: 0.85 }
};
const CAT_HEIGHT = { gazebo: 3.2, garage: 3.2, grill: 1.2, fruit_tree: 3.5, pool: 0.6 };
Object.assign(Builders, {
gazebo(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.15, b.d, b.color, [0, 0.08, 0])); const px = b.w/2 - 0.3, pz = b.d/2 - 0.3; [[px,pz],[px,-pz],[-px,pz],[-px,-pz]].forEach(p => g.add(makeBox(0.2, b.h, 0.2, 0x6d4c33, [p[0], b.h/2, p[1]]))); const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(b.w, b.d)/2 + 0.25, 1.4, 4), MaterialPool.get(0x8b4a3a, { roughness: 0.8 })); roof.position.y = b.h + 0.7; roof.rotation.y = Math.PI/4; roof.castShadow = true; g.add(roof); g.position.set(b.x, 0, b.z); return g; },
pool(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.55, b.d, 0xcfd8dc, [0, 0.28, 0])); const water = makeBox(b.w - 0.4, 0.08, b.d - 0.4, b.color, [0, 0.6, 0]); water.material = new THREE.MeshStandardMaterial({ color: b.color, transparent: true, opacity: 0.85, roughness: 0.15 }); g.add(water); g.position.set(b.x, 0, b.z); return g; },
garage(b) { const g = new THREE.Group(); g.add(makeBox(b.w, b.h, b.d, b.color, [0, b.h/2, 0])); g.add(makeBox(b.w + 0.3, 0.2, b.d + 0.3, 0x78909c, [0, b.h + 0.1, 0])); g.add(makeBox(b.w * 0.6, b.h * 0.7, 0.06, 0x607d8b, [0, b.h * 0.35, b.d/2 + 0.03])); g.position.set(b.x, 0, b.z); return g; },
fruit_tree(b) { const g = new THREE.Group(); const r = b.radius || 1; const trunk = new THREE.Mesh(GeoPool.cylinder(0.12, 0.18, 1.4, 8), MaterialPool.rough(0x5d4037)); trunk.position.y = 0.7; trunk.castShadow = true; g.add(trunk); const crown = new THREE.Mesh(GeoPool.sphere(r, 10), MaterialPool.rough(b.color)); crown.position.y = 1.4 + r * 0.8; crown.castShadow = true; g.add(crown); g.position.set(b.x, 0, b.z); return g; },
grill(b) { const g = new THREE.Group(); g.add(makeBox(b.w, 0.12, b.d, 0xbcaaa4, [0, 0.06, 0])); g.add(makeBox(0.9, 0.7, 0.5, b.color, [0, 0.47, 0])); g.add(makeBox(0.55, 0.05, 0.55, 0x263238, [0, 0.85, 0])); g.position.set(b.x, 0, b.z); return g; }
});
const ground = new THREE.Mesh(GeoPool.plane(CONFIG.plot.w, CONFIG.plot.d), new THREE.MeshStandardMaterial({ map: Textures.grass, roughness: 0.9 }));
ground.rotation.x = -Math.PI/2; ground.position.set(CONFIG.center.x, 0, CONFIG.center.z); ground.receiveShadow = true;
groups.site.add(ground);
// Улица Рассветная примыкает к короткой стороне участка 25,001 м: локальная граница z=0, ребро М4–М3.
// Ширина дорожного полотна на 3D-сцене условная; юридическая красная линия в проект не загружена.
const road = new THREE.Mesh(GeoPool.plane(CONFIG.plot.w + 5, 8), new THREE.MeshStandardMaterial({ map: Textures.road, roughness: 0.8 }));
road.rotation.x = -Math.PI/2; road.position.set(CONFIG.center.x, -0.1, -4); road.receiveShadow = true;
groups.site.add(road);
const markMat = MaterialPool.get(0xffffff);
for (let x = -2; x <= CONFIG.plot.w + 2; x += 3) { const mark = new THREE.Mesh(GeoPool.plane(1.5, 0.2), markMat); mark.rotation.x = -Math.PI/2; mark.position.set(x, 0.01, -4); mark.userData.layer="reference"; groups.site.add(mark); }
const roadLabel = Utils.createLabel('🛣️ Улица Рассветная', '#ffffff', 0.8);
roadLabel.position.set(CONFIG.center.x, 2.5, -4); groups.labels.add(roadLabel);
// Пешеходные маршруты: отдельны от автомобильного въезда и не требуют сплошного мощения центра.
const pathMat = new THREE.MeshStandardMaterial({ map: Textures.path, roughness: 0.78 });
function addPathSegment(seg) {
  const dx = seg.b[0] - seg.a[0], dz = seg.b[1] - seg.a[1];
  const len = Math.hypot(dx, dz), angle = Math.atan2(dx, dz);
  const mesh = new THREE.Mesh(GeoPool.box(seg.width, 0.05, len), pathMat);
  mesh.position.set((seg.a[0]+seg.b[0])/2, 0.025, (seg.a[1]+seg.b[1])/2);
  mesh.rotation.y = angle;
  mesh.receiveShadow = true;
  mesh.userData.pathId = seg.id; mesh.userData.layer="paths";
  groups.site.add(mesh);
}
LAYOUT_PATHS.forEach(addPathSegment);
// Прямой автомобильный въезд к единственному машиноместу и резерву будущего навеса.
const access = LAYOUT_ZONES.driveway;
const accessLane = new THREE.Mesh(GeoPool.plane(access.w, access.d), new THREE.MeshStandardMaterial({ color: 0x858b90, transparent: true, opacity: 0.58, roughness: 0.9 }));
accessLane.rotation.x = -Math.PI/2; accessLane.position.set(access.x, 0.025, access.z); accessLane.receiveShadow = true; groups.site.add(accessLane);
const parking = LAYOUT_ZONES.parking;
const parkingPad = new THREE.Mesh(GeoPool.plane(parking.w, parking.d), new THREE.MeshStandardMaterial({ color: 0x757d82, transparent: true, opacity: 0.72, roughness: 0.95 }));
parkingPad.rotation.x = -Math.PI/2; parkingPad.position.set(parking.x, 0.027, parking.z); parkingPad.receiveShadow = true; groups.site.add(parkingPad);
const parkingLabel = Utils.createLabel('🚗 Въезд → парковка / будущий навес', '#f1f4f5', 0.55, [8, 1.25], 800, 120, 28, 'rgba(45,52,56,0.72)');
parkingLabel.position.set(access.x, 0.65, 2.0); groups.labels.add(parkingLabel);
const servicePad = LAYOUT_ZONES.shedServicePad;
const servicePadMesh = new THREE.Mesh(GeoPool.plane(servicePad.w, servicePad.d), new THREE.MeshStandardMaterial({ map: Textures.path, roughness: 0.82 }));
servicePadMesh.rotation.x = -Math.PI/2; servicePadMesh.position.set(servicePad.x, 0.031, servicePad.z); servicePadMesh.receiveShadow = true; groups.site.add(servicePadMesh);
const serviceLabel = Utils.createLabel('🛠 Вход в хозблок со стороны Рассветной', '#f6efe8', 0.5, [8.5, 1.15], 850, 110, 26, 'rgba(65,52,44,0.72)');
serviceLabel.position.set(21, 0.7, 2.15); groups.labels.add(serviceLabel);
// Центральная зона остаётся визуально цельной: это газон, а не новая твёрдая площадка.
const lawn = LAYOUT_ZONES.lawn;
const lawnReserve = new THREE.Mesh(GeoPool.plane(lawn.w, lawn.d), new THREE.MeshStandardMaterial({ color: 0x8fd47d, transparent: true, opacity: 0.18, roughness: 1, depthWrite: false }));
lawnReserve.rotation.x = -Math.PI/2; lawnReserve.position.set(lawn.x, 0.018, lawn.z); groups.site.add(lawnReserve);
const lawnLabel = Utils.createLabel('🌿 Газон / свободная зона', '#dfffd8', 0.75, [7, 1.4], 640, 128, 34, 'rgba(28,80,36,0.68)');
lawnLabel.position.set(lawn.x, 0.8, lawn.z + 2.8); groups.labels.add(lawnLabel);
const guestParkingLabel = Utils.createLabel('ⓘ Гостевая парковка предполагается на улице — обочину уточнить', '#e2e8ec', 0.58, [10, 1.5], 1024, 128, 30, 'rgba(35,42,48,0.78)');
guestParkingLabel.position.set(6.5, 1.1, -6.2); groups.labels.add(guestParkingLabel);
const draggables = [];
const labelSprites = {};
const objectMeshes = {};
function registerObject(obj) {
const builder = Builders[obj.type];
if (builder) {
const group = builder(obj);
group.rotation.y = (obj.rot || 0) * Math.PI / 180;
group.userData.objectId = obj.id;
groups[obj.group || 'site'].add(group);
draggables.push({ id: obj.id, group });
objectMeshes[obj.id] = group;
}
const label = Utils.createLabel(obj.label, obj.labelColor || '#fff', obj.labelSize || 0.8);
label.position.set(obj.x, obj.y, obj.z);
groups.objectLabels.add(label);
labelSprites[obj.id] = label;
}
CONFIG.objects.forEach(registerObject);
const landscapeGroup = new THREE.Group();
landscapeGroup.userData.layer = 'planned-landscape';
groups.site.add(landscapeGroup);
(() => {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, transparent: true, opacity: 0.52, roughness: 0.85, depthWrite: false });
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x66a85c, transparent: true, opacity: 0.32, roughness: 0.9, depthWrite: false });
  LANDSCAPE_PLAN.trees.forEach(t => {
    const trunk = new THREE.Mesh(GeoPool.cylinder(0.09, 0.12, Math.min(1.5,t.h*0.42), 8), trunkMat);
    trunk.position.set(t.x, Math.min(1.5,t.h*0.42)/2, t.z);
    trunk.castShadow = false; trunk.receiveShadow = false; landscapeGroup.add(trunk);
    const crown = new THREE.Mesh(GeoPool.sphere(t.radius, 12), crownMat);
    crown.position.set(t.x, Math.max(1.7,t.h*0.62), t.z);
    crown.castShadow = false; crown.receiveShadow = false; landscapeGroup.add(crown);
    const lbl = Utils.createLabel('🌳 ' + t.label, '#d9ffd7', 0.48, [7.2,1.05], 760, 110, 25, 'rgba(38,86,43,0.60)');
    lbl.position.set(t.x, t.h + 0.55, t.z); lbl.userData.layer="landscapeLabels"; groups.labels.add(lbl);
  });
  LANDSCAPE_PLAN.shrubZones.filter(z => z.id === 'rear-hedge').forEach(z => {
    const hedge = new THREE.Mesh(GeoPool.box(z.w, z.h, z.d), new THREE.MeshStandardMaterial({ color: 0x4e8f54, transparent:true, opacity:0.24, roughness:1, depthWrite:false }));
    hedge.position.set(z.x, z.h/2, z.z); hedge.castShadow=false; hedge.receiveShadow=false; landscapeGroup.add(hedge);
    const lbl = Utils.createLabel('🌿 ' + z.label, '#d9ffd7', 0.42, [8.8,1.0], 900, 105, 23, 'rgba(38,86,43,0.55)');
    lbl.position.set(z.x, z.h + 0.45, z.z); lbl.userData.layer="landscapeLabels"; groups.labels.add(lbl);
  });
})();

(() => {
  const bedMat = new THREE.MeshStandardMaterial({ color:0x8bb66f, transparent:true, opacity:0.28, roughness:1, depthWrite:false });
  (LANDSCAPE_PLAN.shrubZones || []).filter(z => z.id !== 'rear-hedge').forEach(z => {
    const bed = new THREE.Mesh(GeoPool.box(z.w, z.h, z.d), bedMat);
    bed.position.set(z.x, z.h/2, z.z); bed.castShadow=false; bed.receiveShadow=false; landscapeGroup.add(bed);
    const lbl = Utils.createLabel('🌸 ' + z.label, '#efffe7', 0.42, [7.6,1.0], 800, 105, 22, 'rgba(55,92,45,0.58)');
    lbl.position.set(z.x, z.h+0.4, z.z); lbl.userData.layer="landscapeLabels"; groups.labels.add(lbl);
  });
  const planterMat = new THREE.MeshStandardMaterial({ color:0x8d6e63, transparent:true, opacity:0.60, roughness:0.9 });
  (LANDSCAPE_PLAN.containers || []).forEach(p => {
    const box = new THREE.Mesh(GeoPool.box(p.w,p.h,p.d), planterMat);
    box.position.set(p.x,p.h/2,p.z); box.castShadow=false; box.receiveShadow=false; landscapeGroup.add(box);
  });
  (LANDSCAPE_PLAN.screens || []).forEach(s => {
    const scr = new THREE.Mesh(GeoPool.box(s.w,s.h,s.d), new THREE.MeshStandardMaterial({ color:0x4f8b52, transparent:true, opacity:0.32, roughness:1, depthWrite:false }));
    scr.position.set(s.x,s.h/2,s.z); scr.castShadow=false; scr.receiveShadow=false; landscapeGroup.add(scr);
  });
})();
const draggableGroups = draggables.map(d => d.group);
// ═══════════════════════════════════════════════════════════════
// КАТАЛОГ: добавление / удаление / сохранение (ключ bern_catalog_v2)
// ═══════════════════════════════════════════════════════════════
const CAT = {
items() { return CONFIG.objects.filter(o => CATALOG[o.type]); },
save() { if (BernV6.readOnly) return; try { localStorage.setItem(CATALOG_KEY, JSON.stringify(this.items().map(o => ({ id: o.id, type: o.type, x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius, status: o.status, note: o.note })))); } catch (e) {} },
load() { try { const raw = localStorage.getItem(CATALOG_KEY); if (!raw) return; JSON.parse(raw).forEach(s => { if (CATALOG[s.type]) this.make(s.type, s, true); }); } catch (e) { console.warn('Каталог: ошибка загрузки', e); } },
nextId(type) { let n = 1; while (CONFIG.objects.some(o => o.id === type + '_' + n)) n++; return type + '_' + n; },
make(type, ov, silent) {
const spec = CATALOG[type]; if (!spec) return null;
ov = ov || {};
const id = ov.id || this.nextId(type);
if (CONFIG.objects.some(o => o.id === id)) return CONFIG.objects.find(o => o.id === id);
if (!silent && typeof snapshotFullScene === 'function' && typeof pushUndo === 'function') pushUndo(snapshotFullScene());
const num = parseInt(id.split('_')[1]) || 1;
const obj = Object.assign({ id, type, label: spec.label + (num > 1 ? ' ' + num : ''), x: 0, z: 0, y: (spec.h || 2) + 1.6, rot: 0, w: spec.w, d: spec.d, h: spec.h, radius: spec.radius, color: spec.color, labelColor: spec.labelColor, labelSize: spec.labelSize, group: 'site', status: 'planned' }, ov);
if (typeof ov.x !== 'number') {
const extra = (type === 'grill') ? (o => CONFIG.objects.filter(b => ['house','bath','shed','garage','gazebo'].includes(b.type)).every(b => Norms.dist(o, b) >= 5)) : null;
const p = this.findFreeSpot(obj, extra); obj.x = p.x; obj.z = p.z;
}
CONFIG.objects.push(obj);
registerObject(obj);
draggableGroups.push(objectMeshes[obj.id]);
if (!silent) {
this.save(); saveLayout(); updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
renderer.shadowMap.needsUpdate = true; Utils.markDirty();
toast('➕ Добавлено: ' + obj.label);
}
return obj;
},
findFreeSpot(obj, ok) {
const sb = SETBACK[obj.type] !== undefined ? SETBACK[obj.type] : 0.5;
const hx = (obj.radius !== undefined ? obj.radius : obj.w / 2) + 0.2;
const hz = (obj.radius !== undefined ? obj.radius : obj.d / 2) + 0.2;
for (let z = hz + 0.5; z <= CONFIG.plot.d - hz - 0.5; z += 0.5) {
for (let x = hx + 0.5; x <= CONFIG.plot.w - hx - 0.5; x += 0.5) {
obj.x = x; obj.z = z;
if (!this.spotFree(obj, sb)) continue;
if (ok && !ok(obj)) continue;
return { x, z };
}
}
return { x: CONFIG.plot.w / 2, z: CONFIG.plot.d / 2 };
},
spotFree(o, sb) {
const b = Norms.bounds(o);
if (b.minX < sb || b.minZ < sb || b.maxX > CONFIG.plot.w - sb || b.maxZ > CONFIG.plot.d - sb) return false;
if (o.id !== 'car' && drivewayIntersects(o)) return false;
for (const t of CONFIG.objects) { if (t.id === o.id) continue; if (Norms.dist(o, t) < 0.3) return false; }
return true;
},
remove(id, silent) {
const i = CONFIG.objects.findIndex(o => o.id === id); if (i < 0) return;
const obj = CONFIG.objects[i];
if (!CATALOG[obj.type]) { toast('🗑 Удалять можно только объекты из каталога'); return; }
if (!silent && typeof snapshotFullScene === 'function' && typeof pushUndo === 'function') pushUndo(snapshotFullScene());
const grp = objectMeshes[id];
if (grp) { if (grp.parent) grp.parent.remove(grp); grp.traverse(c => { if (c.geometry) c.geometry.dispose(); }); delete objectMeshes[id]; }
const di = draggables.findIndex(d => d.id === id); if (di >= 0) draggables.splice(di, 1);
if (grp) { const gi = draggableGroups.indexOf(grp); if (gi >= 0) draggableGroups.splice(gi, 1); }
const lbl = labelSprites[id]; if (lbl) { groups.objectLabels.remove(lbl); delete labelSprites[id]; }
CONFIG.objects.splice(i, 1);
if (DOM.objectModal.style.display === 'block') { DOM.objectModal.style.display = 'none'; document.body.style.overflow = 'auto'; }
this.save(); updateNormBadge();
if (!silent) {
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
renderer.shadowMap.needsUpdate = true; Utils.markDirty();
toast('🗑 Удалено: ' + obj.label);
if (typeof renderCatalogModal === 'function' && DOM.catalogModal.style.display === 'block') renderCatalogModal();
}
}
};
window.CAT = CAT;
// Участок фактически пустой: не добавляем вымышленные деревья и не учитываем их в тенях.
// ═══════════════════════════════════════════════════════════════
// КОММУНИКАЦИИ (живые трассы с якорями)
// ═══════════════════════════════════════════════════════════════
const commLines = [];
function rotateLocalPoint(o, lx, lz) {
const a = (o.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
return [o.x + lx*c + lz*s, o.z - lx*s + lz*c];
}
function objectAnchorPoint(o, anchor) {
if (!o) return [0, 0];
if (o.radius !== undefined || anchor.point === 'center') return [o.x, o.z];
const hw = o.w/2, hd = o.d/2, along = Math.max(-1, Math.min(1, anchor.along || 0)), out = anchor.outward || 0;
let lx = 0, lz = 0;
if (anchor.corner) {
const map = { sw:[-hw-out,-hd-out], se:[hw+out,-hd-out], ne:[hw+out,hd+out], nw:[-hw-out,hd+out] };
[lx,lz] = map[anchor.corner] || [0,0];
} else if (anchor.side === 'east') { lx=hw+out; lz=along*hd; }
else if (anchor.side === 'west') { lx=-hw-out; lz=along*hd; }
else if (anchor.side === 'north') { lx=along*hw; lz=hd+out; }
else if (anchor.side === 'south') { lx=along*hw; lz=-hd-out; }
else { lx=anchor.dx || 0; lz=anchor.dz || 0; }
return rotateLocalPoint(o,lx,lz);
}
function utilityPoints(u) {
return u.route.map(a => {
if (a.infrastructure) { const p = CONFIG.infrastructure[a.infrastructure]; if (p) return [p.x,p.z]; }
if (a.obj) { const o = CONFIG.objects.find(x => x.id === a.obj); if (o) return objectAnchorPoint(o,a); }
return [a.x, a.z];
});
}
function utilityLength(u) {
const pts = utilityPoints(u);
let len = 0;
for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]);
return len;
}
function toVec3(pts, y) { return pts.map(p => new THREE.Vector3(p[0], y, p[1])); }
function routeMidPoint(pts) {
let total = 0;
for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
let half = total / 2;
for (let i = 1; i < pts.length; i++) {
const segLen = Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
if (half <= segLen) { const t = segLen === 0 ? 0 : half / segLen; return [ pts[i-1][0] + (pts[i][0]-pts[i-1][0]) * t, pts[i-1][1] + (pts[i][1]-pts[i-1][1]) * t ]; }
half -= segLen;
}
return pts[0];
}
function createUndergroundLine(u, index) {
const pts = utilityPoints(u);
const mainMat = u.status === 'assumption'
? new THREE.LineDashedMaterial({ color: u.color, dashSize: 0.45, gapSize: 0.25, transparent: true, opacity: 0.9 })
: new THREE.LineBasicMaterial({ color: u.color });
u._line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(toVec3(pts, 0.05)), mainMat);
if (u.status === 'assumption') u._line.computeLineDistances();
u._line.userData.utilIndex = index; groups.comms.add(u._line); commLines.push(u._line);
u._shadow = new THREE.Line(new THREE.BufferGeometry().setFromPoints(toVec3(pts, -0.01)), new THREE.LineDashedMaterial({ color: u.color, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.3 }));
u._shadow.computeLineDistances(); groups.comms.add(u._shadow);
if (u.name && u.label !== false) { const mid = routeMidPoint(pts); u._label = Utils.createLabel(`${u.icon} ${u.name}`, '#ffffff', 0.6); u._label.position.set(mid[0], 0.5, mid[1]); groups.labels.add(u._label); }
}
function refreshUtility(u) {
const pts = utilityPoints(u);
u._line.geometry.dispose(); u._line.geometry = new THREE.BufferGeometry().setFromPoints(toVec3(pts, 0.05));
if (u.status === 'assumption') u._line.computeLineDistances();
u._shadow.geometry.dispose(); u._shadow.geometry = new THREE.BufferGeometry().setFromPoints(toVec3(pts, -0.01));
u._shadow.computeLineDistances();
if (u._label) { const mid = routeMidPoint(pts); u._label.position.set(mid[0], 0.5, mid[1]); }
}
function refreshUtilitiesFor(objectId) {
CONFIG.utilities.forEach(u => { if (u.route.some(a => a.obj === objectId)) refreshUtility(u); });
}
CONFIG.utilities.forEach((u, i) => createUndergroundLine(u, i));
const commHighlight = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }));
commHighlight.visible = false; scene.add(commHighlight);
const pickRay = new THREE.Raycaster();
pickRay.params.Line.threshold = 0.45;
let commInfoTimer = null;
function showCommInfo(u) {
const len = utilityLength(u);
DOM.commInfo.innerHTML = `<span class="title">${u.icon} ${u.name}</span> ${statusChip(u.status)}<br>Длина: <strong>${Utils.fmt(len)} м</strong> • ${u.pipe} • ${u.depth == null ? 'глубина уточняется' : 'глубина ' + Utils.fmt(u.depth) + ' м'}${u.note ? `<br><span style="color:#ddd;font-size:11px;">${escapeHtml(u.note)}</span>` : ''} <span class="close" id="comm-info-close">✕</span>`;
DOM.commInfo.classList.add('show');
const pts = utilityPoints(u);
commHighlight.geometry.dispose();
commHighlight.geometry = new THREE.BufferGeometry().setFromPoints(toVec3(pts, 0.12));
commHighlight.visible = true;
Utils.markDirty();
clearTimeout(commInfoTimer);
commInfoTimer = setTimeout(hideCommInfo, 6000);
const closeBtn = document.getElementById('comm-info-close');
if (closeBtn) closeBtn.addEventListener('click', hideCommInfo);
}
function hideCommInfo() {
DOM.commInfo.classList.remove('show');
if (commHighlight.visible) { commHighlight.visible = false; Utils.markDirty(); }
}
function pickUtility(e) {
const rect = renderer.domElement.getBoundingClientRect();
const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
pickRay.setFromCamera(mouse, camera);
const hits = pickRay.intersectObjects(commLines.filter(chainVisible), false);
if (hits.length) showCommInfo(CONFIG.utilities[hits[0].object.userData.utilIndex]);
else hideCommInfo();
}
// ═══════════════════════════════════════════════════════════════
// 💧 ДРЕНАЖ И ЛИВНЁВКА — предварительное резервирование
// ═══════════════════════════════════════════════════════════════
const DRAINAGE_UTILS = [
{ system: 'drainage', name: 'Резерв дренажа фундамента дома', icon: '🕳', color: 0x0097a7, pipe: 'дренажная линия — необходимость и параметры уточнить', depth: null, status: 'assumption', note: 'Показан только коридор вокруг дома. Нужен ли дренаж вообще, его отметка, диаметр, фильтр и точка сброса определяются по типу фундамента, грунтам, УГВ и вертикальной планировке; фиксированный уклон в модели намеренно не задан.', route: [ {obj:'house',corner:'sw',outward:1},{obj:'house',corner:'se',outward:1},{obj:'house',corner:'ne',outward:1},{obj:'house',corner:'nw',outward:1},{obj:'house',corner:'sw',outward:1} ] },
{ system: 'stormwater', name: 'Ливнёвка с крыши дома', icon: '🌧', color: 0x00bcd4, pipe: 'ливневая труба — диаметр/уклон уточнить', depth: null, status: 'assumption', note: 'Схематично объединяет водосточные точки дома и ведёт к резерву накопления дождевой воды. Реальные водосточные стояки, уклоны и отметки определяются после проекта кровли и вертикальной планировки.', route: [ {obj:'house',corner:'nw',outward:0.25},{obj:'house',corner:'sw',outward:0.25},{x:4.0,z:22.5},{x:7.5,z:12.5},{infrastructure:'rainCollector'} ] },
{ system: 'stormwater', name: 'Ливнёвка с крыши бани', icon: '🌧', color: 0x00bcd4, pipe: 'ливневая труба — диаметр/уклон уточнить', depth: null, status: 'assumption', note: 'Предварительная ветка от водостока бани к общей точке накопления. Точное положение водостока зависит от кровли и водосборной системы бани.', route: [ {obj:'bath',corner:'sw',outward:0.25},{x:16.8,z:9.3},{x:11.0,z:9.3},{infrastructure:'rainCollector'} ] },
{ system: 'stormwater', name: 'Ливнёвка с навеса', icon: '🌧', color: 0x00bcd4, pipe: 'ливневая труба — диаметр/уклон уточнить', depth: null, status: 'assumption', note: 'Резерв сбора воды с будущего навеса. Способ водосбора зависит от конструкции и уклона кровли навеса.', route: [ {obj:'canopy',corner:'nw',outward:0.2},{x:11.8,z:8.8},{infrastructure:'rainCollector'} ] },
{ system: 'stormwater', name: 'Линейный лоток у ворот (резерв)', icon: '🌧', color: 0x00bcd4, pipe: 'линейный водоотвод — по отметкам покрытия', depth: null, status: 'assumption', note: 'Резерв поперечного лотка на въезде, если вертикальная планировка покажет приток воды с улицы или с площадки. Сейчас не считается обязательным элементом.', route: [ {x:11.7,z:0.7},{x:17.3,z:0.7},{x:17.3,z:1.2},{x:10.2,z:1.2},{infrastructure:'rainCollector'} ] }
];
DRAINAGE_UTILS.forEach(u => { CONFIG.utilities.push(u); createUndergroundLine(u, CONFIG.utilities.length - 1); });
(() => {
const p = CONFIG.infrastructure.rainCollector;
const body = new THREE.Mesh(GeoPool.cylinder(0.55, 0.6, 0.75, 12), new THREE.MeshStandardMaterial({ color: 0x00838f, transparent: true, opacity: 0.72, roughness: 0.7 }));
body.position.set(p.x, 0.08, p.z); body.castShadow = true; groups.comms.add(body);
const lid = new THREE.Mesh(GeoPool.cylinder(0.6, 0.6, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0x004d56, roughness: 0.55 }));
lid.position.set(p.x, 0.5, p.z); groups.comms.add(lid);
const lbl = Utils.createLabel('🌧 Резерв дождевой воды', '#ffffff', 0.58, [7.5, 1.2], 760, 120, 28, 'rgba(0,80,88,0.72)');
lbl.position.set(p.x, 1.15, p.z); lbl.userData.layer="engineeringLabels"; groups.labels.add(lbl);
})();
// ═══════════════════════════════════════════════════════════════
// Наружное освещение и точки слаботочки — планировочные маркеры, не рабочий электропроект.
(() => {
const poleMat = new THREE.MeshStandardMaterial({ color: 0x4f4f4f, roughness: 0.75 });
const glowMat = new THREE.MeshStandardMaterial({ color: 0xfff59d, emissive: 0xffd54f, emissiveIntensity: 0.75, roughness: 0.35 });
SITE_LIGHT_POINTS.forEach(p => {
  if (p.kind === 'bollard' || p.kind === 'post') {
    const pole = new THREE.Mesh(GeoPool.cylinder(0.06, 0.08, p.h, 8), poleMat);
    pole.position.set(p.x, p.h/2, p.z); pole.userData.system="lighting"; groups.comms.add(pole);
  }
  const head = new THREE.Mesh(new THREE.SphereGeometry(p.kind === 'bollard' ? 0.11 : 0.14, 10, 8), glowMat);
  head.position.set(p.x, p.h, p.z); head.userData.system="lighting"; groups.comms.add(head);
});
SECURITY_POINTS.forEach(p => {
  const marker = new THREE.Mesh(GeoPool.box(0.22, 0.16, 0.18), new THREE.MeshStandardMaterial({ color: 0x7e57c2, emissive: 0x311b92, emissiveIntensity: 0.35, roughness: 0.55 }));
  marker.position.set(p.x, p.kind === 'camera' ? 2.4 : 1.45, p.z); marker.userData.system="lowvoltage"; groups.comms.add(marker);
});
})();

function segmentCrossPoint(a,b,c,d) {
  const rx=b[0]-a[0], rz=b[1]-a[1], sx=d[0]-c[0], sz=d[1]-c[1];
  const den=rx*sz-rz*sx;
  if (Math.abs(den)<1e-9) return null;
  const qx=c[0]-a[0], qz=c[1]-a[1];
  const t=(qx*sz-qz*sx)/den, u=(qx*rz-qz*rx)/den;
  if (t<=0.001 || t>=0.999 || u<=0.001 || u>=0.999) return null;
  return [a[0]+t*rx,a[1]+t*rz];
}
function utilityCrossingAudit() {
  const result=[], seen=new Set();
  for (let i=0;i<CONFIG.utilities.length;i++) {
    for (let j=i+1;j<CONFIG.utilities.length;j++) {
      const A=CONFIG.utilities[i], B=CONFIG.utilities[j];
      if (A.icon===B.icon) continue;
      const pa=utilityPoints(A), pb=utilityPoints(B);
      for (let ai=1;ai<pa.length;ai++) for (let bi=1;bi<pb.length;bi++) {
        const hit=segmentCrossPoint(pa[ai-1],pa[ai],pb[bi-1],pb[bi]);
        if (!hit) continue;
        const key=[A.name,B.name].sort().join('|')+'@'+hit.map(v=>v.toFixed(1)).join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        result.push({a:A.name,b:B.name,x:hit[0],z:hit[1],icons:A.icon+B.icon});
      }
    }
  }
  return result;
}
// ═══════════════════════════════════════════════════════════════
// КАРТОЧКА ОБЪЕКТА + РЕДАКТОР (поворот + размеры + удаление каталога)
// ═══════════════════════════════════════════════════════════════
function showObjectCard(objectId) {
appState.selectedObjectId=objectId;
const obj = CONFIG.objects.find(o => o.id === objectId);
if (!obj) return;
const o = obj;
const emoji = obj.label.match(/^[^\s]+/)[0];
const name = obj.label.replace(/^[^\s]+\s/, '');
const b = Norms.bounds(obj);
const area = obj.radius ? Math.PI * obj.radius * obj.radius : obj.w * obj.d;
const gps = localToGPS(obj.x, obj.z);
let html = `<div class="obj-header"><div class="obj-emoji">${emoji}</div><div><h2 class="obj-title">${name}</h2><div class="obj-subtitle">${CATALOG[o.type] ? 'Объект из каталога' : 'Объект на участке'} · ${statusChip(o.status)}</div></div></div>`;
html += `<h3>📐 Размеры и площадь</h3><table>
<tr><td>Размеры</td><td>${obj.radius ? `Ø${Utils.fmt(obj.radius * 2)} м` : `${Utils.fmt(obj.w)} × ${Utils.fmt(obj.d)} м`}</td></tr>
<tr><td>Площадь</td><td>${Utils.fmt(area)} м²</td></tr>
${obj.h ? `<tr><td>Высота</td><td>${Utils.fmt(obj.h)} м</td></tr>` : ''}
<tr><td>Поворот</td><td>${o.rot || 0}°</td></tr>
</table>`;
html += `<h3>📍 Расположение на участке</h3><table>
<tr><td>Центр (X, Z)</td><td>${Utils.fmt(obj.x)}, ${Utils.fmt(obj.z)} м</td></tr>
<tr><td>До задней соседней границы (z=40)</td><td>${Utils.fmt(CONFIG.plot.d - b.maxZ)} м</td></tr>
<tr><td>До Рассветной улицы / передней границы (z=0)</td><td>${Utils.fmt(b.minZ)} м</td></tr>
<tr><td>До левой соседней границы (x=0)</td><td>${Utils.fmt(b.minX)} м</td></tr>
<tr><td>До правой соседней границы (x=25)</td><td>${Utils.fmt(CONFIG.plot.w - b.maxX)} м</td></tr>
</table>`;
html += `<h3>🌍 GPS-координаты</h3><table>
<tr><td>Широта</td><td>${gps.lat.toFixed(6)}°</td></tr>
<tr><td>Долгота</td><td>${gps.lng.toFixed(6)}°</td></tr>
</table>`;
const distances = [];
CONFIG.objects.forEach(other => { if (other.id === objectId) return; distances.push({ name: other.label.replace(/^[^\s]+\s/, ''), dist: Norms.dist(obj, other) }); });
distances.sort((a, b) => a.dist - b.dist);
if (distances.length > 0) {
html += `<h3>📏 Расстояния до объектов</h3><table>`;
distances.slice(0, 5).forEach(d => { html += `<tr><td>${d.name}</td><td>${Utils.fmt(d.dist)} м</td></tr>`; });
html += `</table>`;
}
if (objectId === 'house') html += `<div class="obj-note"><strong>ℹ Пожарный разрыв:</strong> до бани ${Utils.fmt(Norms.dist(obj, Norms.obj('bath')))} м. Внутри одного участка ИЖС расстояние дом—хозяйственная постройка по СП 4.13130 не нормируется; отдельно нужно проверить здания соседей и конструктивные решения.</div>`;
else if (objectId === 'bath') html += `<div class="obj-note"><strong>🚪 Вход в баню:</strong> Запланирован по центру стены, обращённой к дому (+Z), прямо с террасы ${Utils.fmt(obj.terrace.w)} × ${Utils.fmt(obj.terrace.d)} м. Дорожка приходит на внешний край террасы, дальше вход осуществляется по настилу. Терраса участвует в планировочных расстояниях, но не моделируется как высокая стена для теней.</div>`;
else if (objectId === 'garden') html += `<div class="obj-note"><strong>☀️ Огород:</strong> Сдвинут к фасадной границе Рассветной: передний край примерно в 0,5 м от границы участка, между теплицей и огородом оставлен проход около 0,5 м. Это освобождает центральную часть под газон.</div>`;
else if (objectId === 'greenhouse') html += `<div class="obj-note"><strong>🌿 Теплица:</strong> Выбрана передняя левая открытая зона; июньская доступность прямого солнца сравнивается с альтернативами в отчёте.</div>`;
else if (objectId === 'canopy') html += `<div class="obj-note"><strong>▱ Будущий навес:</strong> Планировочный резерв 4×6 м над одним машиноместом. Это не существующая постройка; конструкция и фундамент требуют отдельного решения.</div>`;
else if (objectId === 'shed') html += `<div class="obj-note"><strong>🛠 Вход в хозблок:</strong> Запланирован со стороны ул. Рассветная (локальная сторона -Z). Перед дверью оставлена хозяйственная площадка, связанная с автомобильным въездом дорожкой около 1,4 м — для газонокосилки, снегоуборщика, тележки и заноса инвентаря.</div>`;
else if (objectId === 'car') html += `<div class="obj-note"><strong>🚗 Парковка:</strong> Внутри участка предусмотрено одно место. Гостевые машины предполагаются снаружи вдоль улицы после проверки фактической обочины.</div>`;
else if (objectId === 'septic') html += `<div class="obj-note"><strong>🚽 Септик / ЛОС:</strong> Точка X=${Utils.fmt(obj.x)}, Z=${Utils.fmt(obj.z)} — только планировочный резерв. До скважины сейчас ${Utils.fmt(Norms.dist(obj, Norms.obj('well')))} м по краям, до дома ${Utils.fmt(Norms.dist(obj, Norms.obj('house')))} м. Тип системы, санитарные расстояния и обслуживание уточняются после геологии и выбора ЛОС.</div>`;
else if (objectId === 'well') html += `<div class="obj-note"><strong>💧 Скважина:</strong> Точка X=${Utils.fmt(obj.x)}, Z=${Utils.fmt(obj.z)} предварительная. До септика/ЛОС ${Utils.fmt(Norms.dist(obj, Norms.obj('septic')))} м по краям, до дома ${Utils.fmt(Norms.dist(obj, Norms.obj('house')))} м. Глубина, дебит, конструкция и окончательное место определяются после гидрогеологии; бурение желательно выполнить до капитального строительства и благоустройства.</div>`;
else if (o.type === 'grill') html += `<div class="obj-note"><strong>🍢 Мангал:</strong> Норма — не ближе 5 м от построек (противопожарный режим). Красное кольцо — если ближе.</div>`;
else if (o.type === 'gazebo' || o.type === 'garage') html += `<div class="obj-note"><strong>${o.type === 'garage' ? '🚗 Гараж' : '⛱ Беседка'}:</strong> Отступ от границы участка — не менее 1 м (СП 42.13330 / СП 53.13330).</div>`;
else if (o.type === 'pool') html += `<div class="obj-note"><strong>🏊 Бассейн:</strong> Стационарный каркасный. Рекомендуем ≥3 м от дома и не под деревьями.</div>`;
else if (o.type === 'fruit_tree') html += `<div class="obj-note"><strong>🍎 Дерево:</strong> Для этого участка ИЖС не используем автоматически «4 м от забора» как универсальную норму из СП 53.13330 для садоводческих территорий. Вид, высоту и отступ проверять по местным требованиям/ГПЗУ; крупные корни не размещать над инженерными трассами.</div>`;
// ── Редактор: поворот + размеры ──
html += `<h3>🛠 Редактирование</h3>
<div style="margin:6px 0 10px;">Статус: <select id="obj-status" style="padding:5px 7px; border:1px solid #bbb; border-radius:7px;">${statusOptions(o.status)}</select></div>
<div style="margin:6px 0;">Поворот: <b id="obj-rot-val">${o.rot || 0}°</b></div>
<input type="range" id="obj-rot" min="0" max="359" step="1" value="${o.rot || 0}">
<div style="display:flex; gap:6px; margin:8px 0;">
<button id="obj-rot-ccw" class="edit-btn" style="margin:0;">⟲ 90°</button>
<button id="obj-rot-cw" class="edit-btn" style="margin:0;">⟳ 90°</button>
</div>`;
if (o.radius !== undefined) {
html += `<div style="margin:6px 0;">Радиус (м): <input type="number" id="obj-r" step="0.1" min="0.1" value="${o.radius}"> <button id="obj-apply" class="edit-btn" style="margin:0; width:auto;">Применить</button></div>`;
} else {
html += `<div style="margin:6px 0;">Ш <input type="number" id="obj-w" step="0.5" min="0.5" value="${o.w}"> Гл <input type="number" id="obj-d" step="0.5" min="0.5" value="${o.d}"> Выс <input type="number" id="obj-h" step="0.5" min="0.5" value="${o.h || 1}"> <button id="obj-apply" class="edit-btn" style="margin:0; width:auto;">Применить</button></div>`;
}
if (CATALOG[o.type]) html += `<div style="margin-top:14px;"><button id="obj-delete" class="edit-btn danger" style="margin:0;">🗑 Удалить объект с участка</button></div>`;
DOM.objectCardBody.innerHTML = html;
const delBtn = document.getElementById('obj-delete');
if (delBtn) delBtn.onclick = () => { if (confirm('Удалить «' + name + '» с участка?')) CAT.remove(objectId); };
DOM.objectModal.style.display = 'block';
document.body.style.overflow = 'hidden';
const grp = objectMeshes[objectId];
const statusSelect = document.getElementById('obj-status');
statusSelect.addEventListener('change', () => {
pushUndo(snapshotFullScene());
o.status = normalizeStatus(statusSelect.value, o.status);
saveLayout();
toast('🏷 Статус объекта: ' + STATUS_DEFS[o.status].label);
showObjectCard(objectId);
});
if (isMasterLocked(o.id)) { const banner=document.createElement('p');banner.textContent='🔒 MASTER — геометрия заблокирована. Проект → Объекты → Разблокировать.';DOM.objectCardBody.prepend(banner); ['obj-rot','obj-rot-ccw','obj-rot-cw','obj-apply','obj-w','obj-d','obj-h','obj-r'].forEach(id=>{const el=document.getElementById(id);if(el)el.disabled=true;}); }
const rotSlider = document.getElementById('obj-rot');
const rotVal = document.getElementById('obj-rot-val');
const applyRot = (v) => {
if (isMasterLocked(o.id)) { toast("MASTER: сначала разблокируйте объект в разделе Проект"); return; }
pushUndo(snapshotFullScene());
o.rot = ((v % 360) + 360) % 360;
if (grp) grp.rotation.y = o.rot * Math.PI / 180;
rotVal.textContent = o.rot + '°';
clampObject(o);
if (grp) grp.position.set(o.x, 0, o.z);
refreshUtilitiesFor(objectId);
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
if (solarOn && objectId === 'house') { buildSolarPanels(); showSolarInfo(); }
Utils.markDirty();
};
rotSlider.addEventListener('input', () => applyRot(parseInt(rotSlider.value) || 0));
document.getElementById('obj-rot-ccw').onclick = () => { rotSlider.value = ((o.rot || 0) - 90 + 360) % 360; applyRot(parseInt(rotSlider.value)); };
document.getElementById('obj-rot-cw').onclick = () => { rotSlider.value = ((o.rot || 0) + 90) % 360; applyRot(parseInt(rotSlider.value)); };
document.getElementById('obj-apply').onclick = () => {
if (isMasterLocked(o.id)) { toast('MASTER: объект заблокирован'); return; }
pushUndo(snapshotFullScene());
if (o.radius !== undefined) { const r = parseFloat(document.getElementById('obj-r').value); if (r > 0) o.radius = r; }
else {
const w = parseFloat(document.getElementById('obj-w').value);
const d = parseFloat(document.getElementById('obj-d').value);
const h = parseFloat(document.getElementById('obj-h').value);
if (w > 0) o.w = w; if (d > 0) o.d = d; if (h > 0) o.h = h;
}
rebuildObject(objectId);
clampObject(o);
syncPositionsToScene();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (solarOn && objectId === 'house') { buildSolarPanels(); showSolarInfo(); }
saveLayout();
Utils.markDirty();
toast('✅ Размеры применены');
};
}
function pickObject(e) {
if (measure.mode || drag.active) return;
const rect = renderer.domElement.getBoundingClientRect();
const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
const ray = new THREE.Raycaster();
ray.setFromCamera(mouse, camera);
const hits = ray.intersectObjects(draggableGroups.filter(chainVisible), true);
if (hits.length > 0) {
let cur = hits[0].object;
while (cur) { if (cur.userData && cur.userData.objectId) { showObjectCard(cur.userData.objectId); return; } cur = cur.parent; }
}
}
// Воротная группа создаётся из FRONT_SERVICE_PLAN в scene-v6.js.
// Существующая опора электросети и электрощит — фиксированная исходная точка.
(() => {
const p = CONFIG.infrastructure.powerPole;
const group = new THREE.Group();
const pole = new THREE.Mesh(GeoPool.cylinder(0.16, 0.23, p.h, 12), MaterialPool.get(0x777777, { roughness: 0.85 }));
pole.position.y = p.h / 2; pole.castShadow = true; pole.receiveShadow = true; group.add(pole);
const crossbar = new THREE.Mesh(GeoPool.box(2.2, 0.14, 0.14), MaterialPool.get(0x555555, { roughness: 0.7 }));
crossbar.position.y = p.h - 0.7; crossbar.castShadow = true; group.add(crossbar);
[-0.8, 0, 0.8].forEach(x => {
const insulator = new THREE.Mesh(GeoPool.cylinder(0.07, 0.07, 0.28, 8), MaterialPool.get(0xe8e8dd));
insulator.position.set(x, p.h - 0.45, 0); group.add(insulator);
});
const shield = new THREE.Mesh(GeoPool.box(0.65, 0.9, 0.28), MaterialPool.get(0x9aa0a6, { roughness: 0.45, metalness: 0.55 }));
shield.position.set(-0.35, 1.65, -0.22); shield.castShadow = true; group.add(shield);
group.position.set(p.x, 0, p.z); group.userData.fixedInfrastructure = 'powerPole'; scene.add(group);
const label = Utils.createLabel('⚡ Существующий столб и электрощит\nположение ориентировочное', '#ffe066', 0.72, [7, 2], 512, 160, 34, 'rgba(25,25,20,0.82)', 10);
label.position.set(p.x, p.h + 1.5, p.z); groups.labels.add(label);
})();
(() => {
const a = CONFIG.gps.angle * Math.PI / 180;
const cx = CONFIG.center.x, cz = CONFIG.center.z, r = 27;
[
{ text: '↑ ИСТИННЫЙ СЕВЕР', pos: [cx + Math.sin(a)*r, 3, cz + Math.cos(a)*r], color: '#66ccff' },
{ text: '↓ ЮГ', pos: [cx - Math.sin(a)*r, 3, cz - Math.cos(a)*r], color: '#ff9966' },
{ text: '→ ВОСТОК', pos: [cx + Math.cos(a)*r, 3, cz - Math.sin(a)*r], color: '#99cc99' },
{ text: '← ЗАПАД', pos: [cx - Math.cos(a)*r, 3, cz + Math.sin(a)*r], color: '#99cc99' }
].forEach(d => { const lbl = Utils.createLabel(d.text, d.color, 1.0, [5, 2.5], 256, 128, 48); lbl.position.set(...d.pos); lbl.userData.layer="reference"; scene.add(lbl); });
})();
[ { text: 'Фасад вдоль улицы (25,001 м)', pos: [12.5, 1.5, 0.8], color: '#ff6666' }, { text: 'Глубина участка (40,002 м)', pos: [1.2, 1.5, 37.5], color: '#66aaff' } ].forEach(a => { const lbl = Utils.createLabel(a.text, a.color, 0.9, [4, 2], 160, 80, 36, 'rgba(0,0,0,0.6)', 10); lbl.position.set(...a.pos); lbl.userData.layer="reference"; scene.add(lbl); });
// ═══════════════════════════════════════════════════════════════
// НОРМЫ (bounds учитывает поворот объекта) + ПРАВИЛА КАТАЛОГА
// ═══════════════════════════════════════════════════════════════
const Norms = {
rules: [
// Обязательное для выбранного сценария: объект firepit используется как мангал/жаровня.
{ kind: 'dist', a: 'firepit', b: 'bath', min: 5, level: 'mandatory', doc: 'ПП РФ №1479, приложение №4; разъяснение МЧС: мангал ≥5 м от построек', condition: 'Для мангала или иной несгораемой ёмкости. Для открытого костра действуют иные расстояния.' },
{ kind: 'dist', a: 'firepit', b: 'shed', min: 5, level: 'mandatory', doc: 'ПП РФ №1479, приложение №4; разъяснение МЧС: мангал ≥5 м от построек', condition: 'Для мангала или иной несгораемой ёмкости. Для открытого костра действуют иные расстояния.' },
{ kind: 'dist', a: 'firepit', b: 'house', min: 5, level: 'mandatory', doc: 'ПП РФ №1479, приложение №4; разъяснение МЧС: мангал ≥5 м от построек', condition: 'Для мангала или иной несгораемой ёмкости. Для открытого костра действуют иные расстояния.' },
// Условные градостроительные проверки: окончательно сверяются с ГПЗУ, красными линиями и ПЗЗ Черноголовки.
{ kind: 'setback', obj: 'house', min: 3, sides: ['north','west','east'], level: 'conditional', doc: 'Предварительная проверка от соседних границ; подтвердить по ГПЗУ и местным ПЗЗ', condition: 'Задняя и две длинные границы граничат с соседними участками; не проверяет расстояния до соседних зданий.' },
{ kind: 'setback', obj: 'house', min: 5, sides: ['south'], level: 'conditional', doc: 'Предварительно от уличной границы z=0; точная красная линия пока не загружена', condition: 'Улица Рассветная находится у короткой стороны М4–М3. Юридическое положение красной линии нужно подтвердить по ГПЗУ.' },
{ kind: 'setback', obj: 'bath', min: 1, sides: ['north','west','east'], level: 'conditional', doc: 'Предварительный отступ хозяйственной постройки; подтвердить по ГПЗУ и ПЗЗ', condition: 'Проверяются соседние границы; сторона z=0 относится к Рассветной улице.' },
{ kind: 'setback', obj: 'shed', min: 1, sides: ['north','west','east'], level: 'conditional', doc: 'Предварительный отступ хозяйственной постройки; подтвердить по ГПЗУ и ПЗЗ', condition: 'Проверяются соседние границы; сторона z=0 относится к Рассветной улице.' },
// Проектные буферы, не выдаваемые за универсальную норму закона.

{ kind: 'dist', a: 'well', b: 'house', min: 3, level: 'recommendation', doc: 'Проектная рекомендация для обслуживания и защиты фундамента', condition: 'Не является универсальной федеральной нормой.' }
],
manualChecks: [
{ level: 'information', title: 'Дом ↔ баня внутри одного участка', ok: true, doc: 'СП 4.13130; официальное разъяснение МЧС России', detail: 'Противопожарное расстояние между домом и хозяйственной постройкой внутри одного участка ИЖС не нормируется. Прежняя проверка ≥15 м удалена.' },
{ level: 'conditional', title: 'Соседние здания и сооружения', ok: null, doc: 'СП 4.13130, таблица 1 и подраздел 5.3', detail: 'Нужны контуры, назначение и степень огнестойкости объектов на соседних участках.' },
{ level: 'conditional', title: 'Красная линия Рассветной улицы', ok: null, doc: 'ГПЗУ / документация по планировке территории / местные ПЗЗ', detail: 'В проекте пока используется граница участка как приближение; юридическое положение красной линии не загружено.' },
{ level: 'conditional', title: 'Септик/ЛОС ↔ скважина', ok: null, doc: 'СанПиН 2.1.3684-21; гидрогеология участка; тип ЛОС', detail: 'Текущее взаимное расстояние — только планировочный резерв. Для источников нецентрализованного водоснабжения место выбирают по геологическим и гидрогеологическим данным и направлению грунтовых вод; универсальное «15 м достаточно» из проекта удалено.' },
{ level: 'conditional', title: 'Тип канализационного сооружения', ok: null, doc: 'СанПиН 2.1.3684-21 / паспорт выбранного оборудования', detail: 'Накопительный водонепроницаемый выгреб и локальная очистная станция — разные сценарии. До выбора системы расстояние до дома не фиксируется одной универсальной цифрой.' }
],
obj(id) { return CONFIG.objects.find(o => o.id === id); },
bodyCorners(o) {
if (o.radius !== undefined) return null;
const hw = o.w / 2, hd = o.d / 2, a = (o.rot || 0) * Math.PI / 180;
const c = Math.cos(a), s = Math.sin(a);
return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([x,z]) => ({ x: o.x + x*c + z*s, z: o.z - x*s + z*c }));
},
terraceCorners(o) {
if (o.id !== 'bath' || !o.terrace) return null;
const hw = o.terrace.w / 2, z0 = o.d / 2, z1 = o.d / 2 + o.terrace.d;
const a = (o.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
return [[-hw,z0],[hw,z0],[hw,z1],[-hw,z1]].map(([x,z]) => ({ x: o.x + x*c + z*s, z: o.z - x*s + z*c }));
},
corners(o) {
if (o.radius !== undefined) return null;
if (o.id === 'bath' && o.terrace) {
const halfW = Math.max(o.w, o.terrace.w) / 2;
const z0 = -o.d / 2, z1 = o.d / 2 + o.terrace.d;
const a = (o.rot || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
return [[-halfW,z0],[halfW,z0],[halfW,z1],[-halfW,z1]].map(([x,z]) => ({ x: o.x + x*c + z*s, z: o.z - x*s + z*c }));
}
return this.bodyCorners(o);
},
boundsFromCorners(poly) {
return { minX: Math.min(...poly.map(p=>p.x)), maxX: Math.max(...poly.map(p=>p.x)), minZ: Math.min(...poly.map(p=>p.z)), maxZ: Math.max(...poly.map(p=>p.z)), circle: false };
},
bodyBounds(o) {
if (o.radius !== undefined) return { minX: o.x - o.radius, maxX: o.x + o.radius, minZ: o.z - o.radius, maxZ: o.z + o.radius, circle: true };
return this.boundsFromCorners(this.bodyCorners(o));
},
bounds(o) {
if (o.radius !== undefined) return { minX: o.x - o.radius, maxX: o.x + o.radius, minZ: o.z - o.radius, maxZ: o.z + o.radius, circle: true };
return this.boundsFromCorners(this.corners(o));
},
pointInPolygon(p, poly) {
let sign = 0;
for (let i = 0; i < poly.length; i++) {
const a = poly[i], b = poly[(i + 1) % poly.length];
const cross = (b.x-a.x)*(p.z-a.z) - (b.z-a.z)*(p.x-a.x);
if (Math.abs(cross) < 1e-9) continue;
const cur = Math.sign(cross);
if (sign && cur !== sign) return false;
sign = cur;
}
return true;
},
pointSegmentDistance(p, a, b) {
const vx = b.x-a.x, vz = b.z-a.z, l2 = vx*vx + vz*vz;
const t = l2 ? Math.max(0, Math.min(1, ((p.x-a.x)*vx + (p.z-a.z)*vz) / l2)) : 0;
return Math.hypot(p.x - (a.x + vx*t), p.z - (a.z + vz*t));
},
polygonDistance(A, B) {
let overlap = true, minOverlap = Infinity;
const axes = [];
[A,B].forEach(poly => poly.forEach((p,i) => { const q = poly[(i+1)%poly.length], ex=q.x-p.x, ez=q.z-p.z, len=Math.hypot(ex,ez)||1; axes.push({x:-ez/len,z:ex/len}); }));
for (const axis of axes) {
const pa=A.map(p=>p.x*axis.x+p.z*axis.z), pb=B.map(p=>p.x*axis.x+p.z*axis.z);
const minA=Math.min(...pa), maxA=Math.max(...pa), minB=Math.min(...pb), maxB=Math.max(...pb);
const amount=Math.min(maxA,maxB)-Math.max(minA,minB);
if (amount < 0) overlap=false; else minOverlap=Math.min(minOverlap,amount);
}
if (overlap) return -Math.max(0, minOverlap);
let best=Infinity;
A.forEach(p => B.forEach((q,i) => { best=Math.min(best,this.pointSegmentDistance(p,q,B[(i+1)%B.length])); }));
B.forEach(p => A.forEach((q,i) => { best=Math.min(best,this.pointSegmentDistance(p,q,A[(i+1)%A.length])); }));
return best;
},
circlePolygonDistance(circle, poly) {
const center={x:circle.x,z:circle.z};
let edge=Infinity;
poly.forEach((p,i)=>{ edge=Math.min(edge,this.pointSegmentDistance(center,p,poly[(i+1)%poly.length])); });
return this.pointInPolygon(center,poly) ? -(edge + circle.radius) : edge - circle.radius;
},
dist(a, b) {
if (!a || !b) return Infinity;
if (a.radius !== undefined && b.radius !== undefined) return Math.hypot(a.x-b.x,a.z-b.z)-a.radius-b.radius;
const A=this.corners(a), B=this.corners(b);
if (a.radius !== undefined) return this.circlePolygonDistance(a,B);
if (b.radius !== undefined) return this.circlePolygonDistance(b,A);
return this.polygonDistance(A,B);
},
setbacks(o) { const b = this.bounds(o); return { south: b.minZ, north: CONFIG.plot.d - b.maxZ, west: b.minX, east: CONFIG.plot.w - b.maxX }; },
name(id) { const o = this.obj(id); return o ? o.label.replace(/^[^\s]+\s/, '') : id; },
checkAll() {
const res = this.rules.map(r => {
if (r.kind === 'dist') {
const A = this.obj(r.a), B = this.obj(r.b);
const d = this.dist(A, B);
return { kind: 'dist', ids: [r.a, r.b], title: `${this.name(r.a)} → ${this.name(r.b)}`, actual: d, min: r.min, ok: d >= r.min, level: r.level, soft: r.level !== 'mandatory', doc: r.doc, detail: `Между ближайшими краями. ${r.condition || ''}` };
}
const O = this.obj(r.obj);
const s = this.setbacks(O);
const sides = r.sides || ['south','north','west','east'];
const minVal = Math.min(...sides.map(side => s[side]));
return { kind: 'setback', ids: [r.obj], title: `${this.name(r.obj)} — отступ до границы`, actual: minVal, min: r.min, ok: minVal >= r.min, level: r.level, soft: r.level !== 'mandatory', doc: r.doc, detail: `Улица ${Utils.fmt(s.south)} / задняя ${Utils.fmt(s.north)} / левая ${Utils.fmt(s.west)} / правая ${Utils.fmt(s.east)} м. ${r.condition || ''}` };
});
// ── КАТАЛОГ: мангал ≥5 м от построек (противопожарный режим) ──
const BUILDINGS = ['house','bath','shed','garage','gazebo'];
CONFIG.objects.filter(o => o.type === 'grill').forEach(g => {
CONFIG.objects.filter(b => BUILDINGS.includes(b.type)).forEach(b => {
const d = this.dist(g, b);
res.push({ kind: 'dist', ids: [g.id, b.id], title: `${this.name(g.id)} → ${this.name(b.id)}`, actual: d, min: 5, ok: d >= 5, level: 'mandatory', soft: false, doc: 'ПП РФ №1479, приложение №4; мангал ≥5 м от построек', detail: 'Между ближайшими краями; территория очищается от горючих материалов минимум на 2 м.' });
});
});
// ── КАТАЛОГ: беседка и гараж — отступ ≥1 м от границы ──
CONFIG.objects.filter(o => o.type === 'gazebo' || o.type === 'garage').forEach(o => {
const s = this.setbacks(o);
const minVal = Math.min(s.south, s.north, s.west, s.east);
res.push({ kind: 'setback', ids: [o.id], title: `${this.name(o.id)} — отступ до границы`, actual: minVal, min: 1, ok: minVal >= 1, level: 'conditional', soft: true, doc: 'Предварительная проверка; подтвердить по ГПЗУ и местным ПЗЗ', detail: `Улица ${Utils.fmt(s.south)} / задняя ${Utils.fmt(s.north)} / левая ${Utils.fmt(s.west)} / правая ${Utils.fmt(s.east)} м` });
});
this.manualChecks.forEach(c => res.push({ kind: 'manual', ids: [], min: null, actual: null, soft: true, ...c }));
return res;
}
};
function clearHighlights() {
while (groups.norms.children.length) {
const c = groups.norms.children[0];
groups.norms.remove(c);
if (c.geometry) c.geometry.dispose();
if (c.material) { if (c.material.map) c.material.map.dispose(); c.material.dispose(); }
}
}
function showHighlights() {
clearHighlights();
const failed = Norms.checkAll().filter(c => c.ok === false && c.level === 'mandatory');
const ids = new Set();
failed.forEach(c => c.ids.forEach(id => ids.add(id)));
ids.forEach(id => {
const o = Norms.obj(id);
if (!o) return;
const b = Norms.bounds(o);
const r = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) / 2 + 0.7;
const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.35, 40), new THREE.MeshBasicMaterial({ color: 0xff2222, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }));
ring.rotation.x = -Math.PI / 2; ring.position.set(o.x, 0.06, o.z);
groups.norms.add(ring);
});
failed.filter(c => c.kind === 'dist').forEach(c => {
const A = Norms.obj(c.ids[0]), B = Norms.obj(c.ids[1]);
if (!A || !B) return;
const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(A.x, 0.15, A.z), new THREE.Vector3(B.x, 0.15, B.z) ]), new THREE.LineDashedMaterial({ color: 0xff2222, dashSize: 0.5, gapSize: 0.25 }));
line.computeLineDistances(); groups.norms.add(line);
const lbl = Utils.createLabel(`⚠ ${Utils.fmt(c.actual)} м`, '#ffdddd', 0.7, [6, 1.5], 512, 128, 44, 'rgba(70,0,0,0.85)');
lbl.position.set((A.x + B.x) / 2, 1.4, (A.z + B.z) / 2);
groups.norms.add(lbl);
});
Utils.markDirty();
}
function openNorms() {
const checks = Norms.checkAll();
const mandatory = checks.filter(c => c.ok === false && c.level === 'mandatory');
const conditional = checks.filter(c => c.level === 'conditional' && c.ok !== true);
const recommendations = checks.filter(c => c.level === 'recommendation' && c.ok === false);
DOM.normsSummary.innerHTML = (mandatory.length ? `<span class="norm-bad">⚠ Обязательных нарушений: ${mandatory.length}</span>` : '<span class="norm-ok">✓ По автоматически проверяемым обязательным требованиям нарушений не найдено</span>') +
`<div style="font-size:12px; color:#666; margin-top:7px;">Условных проверок требуют внимания: ${conditional.length}. Невыполненных проектных рекомендаций: ${recommendations.length}. Результат не заменяет ГПЗУ, ПЗЗ, проектную документацию и проверку соседних объектов.</div>`;
DOM.normsTbody.innerHTML = '';
checks.forEach(c => {
const tr = document.createElement('tr');
let st;
if (c.level === 'information') st = '<span class="norm-ok">ℹ Учтено</span>';
else if (c.ok === null) st = '<span class="norm-warn">? Нужны данные</span>';
else if (c.level === 'mandatory') st = c.ok ? '<span class="norm-ok">✓ Выполнено</span>' : '<span class="norm-bad">✗ Нарушение</span>';
else if (c.level === 'conditional') st = c.ok ? '<span class="norm-ok">✓ Предварительно</span>' : '<span class="norm-warn">⚠ Условно</span>';
else st = c.ok ? '<span class="norm-ok">✓ Рекомендация</span>' : '<span class="norm-warn">⚠ Рекомендация</span>';
const minCell = c.min == null ? '—' : `≥ ${c.min} м`;
const actualCell = c.actual == null ? '—' : `${Utils.fmt(c.actual)} м`;
tr.innerHTML = `<td>${c.title}<div class="norm-doc">${c.doc}</div></td><td style="text-align:center; white-space:nowrap;">${minCell}</td><td style="text-align:center; font-weight:700; white-space:nowrap;">${actualCell}</td><td style="text-align:center;">${st}</td><td class="norm-detail">${c.detail}</td>`;
DOM.normsTbody.appendChild(tr);
});
DOM.normsModal.style.display = 'block';
document.body.style.overflow = 'hidden';
showHighlights();
}
function updateNormBadge() {
const checks = Norms.checkAll();
const hard = checks.filter(c => c.ok === false && c.level === 'mandatory').length;
const pending = checks.filter(c => c.level === 'conditional' && c.ok !== true).length;
if (hard) { DOM.normBadge.textContent = `⚠ Обязательных нарушений: ${hard}`; DOM.normBadge.classList.add('bad'); }
else { DOM.normBadge.textContent = `✓ Проверяемые нормы: без нарушений • уточнить: ${pending}`; DOM.normBadge.classList.remove('bad'); }
}
const ENGINEERING_HTML = `
<p><strong>Статус инженерной схемы:</strong> кроме существующего столба со щитом, показанные трассы и большинство параметров ниже являются предварительными проектными предположениями. Они нужны для планировки участка и не заменяют рабочие проекты сетей.</p>
<h3>💧 Водоснабжение</h3><ul><li><strong>Скважина перенесена в предварительную точку X=23 / Z=23</strong>, чтобы увеличить разнос с ЛОС и сохранить короткий правый инженерный коридор. Это не санитарное согласование места.</li><li>Глубина, дебит и водоносный горизонт требуют подтверждения по гидрогеологии/бурению.</li><li><strong>Инженерная схема v1:</strong> ввод в дом сокращён до юго-восточной части дома; отдельная ветка к бане идёт по правому краю участка, не пересекая центральный газон.</li><li>Точка разветвления, кессон/гидроаккумулятор, водоподготовка, диаметры и глубины остаются предварительными до рабочего проекта.</li></ul>
<h3>🚽 Канализация</h3><ul><li><strong>Септик/ЛОС перенесён в предварительную точку X=2,5 / Z=17,5.</strong> Это увеличивает расстояние до дома и скважины и оставляет его ближе к фасаду для обслуживания, но окончательный тип и место зависят от выбранной системы.</li><li><strong>Инженерная схема v2:</strong> дом и баня сходятся к общему условному узлу около X=5,2 / Z=20,5 и далее идут к текущему месту септика.</li><li>Ветка бани уходит по переднему краю центральной зоны, в стороне от мангала, и один раз подземно пересекает пешеходный маршрут.</li><li>Тип ЛОС, отметки выпуска, фактический уклон, глубина и ревизии определяются только после выбора системы и высотной съёмки.</li></ul>
<h3>⚡ Электроснабжение</h3><ul><li><strong>Подтверждено пользователем:</strong> электрический столб со щитом находится за ул. Рассветной, примерно напротив правой части фасада участка.</li><li><strong>Инженерная схема v3:</strong> после пересечения фасадной границы кабель уходит в единый правый инженерный коридор к дому; из этого же коридора зарезервированы ветки к бане и хозблоку.</li><li>Отдельно заложены предварительные резервы к будущему навесу и автоматике ворот/калитки. Это именно трассировочный резерв: кабели, мощности, автоматы, заземление, трубы и глубины должны быть рассчитаны по ТУ и рабочему проекту.</li><li>Коридор проходит рядом с предварительной зоной скважины; окончательное взаимное положение кабеля, кессона и сервисной площадки скважины нужно увязать до земляных работ.</li></ul>
<h3>🌱 Полив</h3><ul><li>Старая длинная линия от дома через заднюю часть участка удалена. Новая сезонная магистраль идёт от южной стороны дома к передней части по левому краю центральной зоны, в стороне от мангала.</li><li>От неё сделаны отдельные резервы к огороду, теплице и центральному газону.</li><li>Для газона показана только распределительная ветка, а не готовая схема дождевателей: её рассчитывают после фактического давления/дебита скважины и выбора способа полива.</li><li>Глубины, слив на зиму, автоматика, фильтрация и капельный полив пока не утверждены.</li></ul>
<h3>🌧 Ливнёвка и дренаж</h3><ul><li><strong>Инженерная схема v4:</strong> старые фиксированные уклоны дренажа/ливнёвки и два условных колодца удалены. Они создавали ложное ощущение готового рабочего проекта и конфликтовали с новой зоной скважины.</li><li>В проекте оставлен только <strong>резерв дренажного контура вокруг дома</strong>. Необходимость такого дренажа определяется типом фундамента, грунтами и уровнем грунтовых вод; без этих данных он не считается обязательным.</li><li>Дождевую воду условно собираем с дома, бани и будущего навеса в резервную точку X=10,2 / Z=9,0 между огородом и въездом. Там может быть накопительная ёмкость или ливневый колодец; объём, глубина и перелив пока не назначены.</li><li>У ворот показан условный линейный лоток, но он нужен только если высотная съёмка покажет приток воды с улицы/площадки.</li><li>Сброс дождевой или дренажной воды за границы участка сейчас <strong>не проектируется</strong>. Сначала нужна вертикальная планировка и понятная точка допустимого отвода/накопления.</li><li>Резервная накопительная точка расположена рядом с поливочным узлом, поэтому в будущем дождевую воду можно рассмотреть как дополнительный источник для полива после подбора ёмкости, фильтрации и насоса.</li></ul>
<h3>💡 Наружное освещение и слаботочка</h3><ul><li><strong>Инженерная схема v5:</strong> световые точки поставлены только там, где реально нужен безопасный проход и обслуживание: калитка, основная дорожка, вход дома, терраса/вход бани, вход хозблока и навес.</li><li>От дома до калитки зарезервирована отдельная слаботочная труба под домофон, камеру ворот и будущие датчики. На доме предусмотрен второй камерный резерв на двор.</li><li>Слаботочка показана отдельным фиолетовым слоем и не считается частью силового кабеля. Возможность общей траншеи, взаимное расположение труб и пересечения должны решаться электропроектом.</li><li>Мощности, типы светильников, высоты монтажа, датчики движения/освещённости, PoE и конкретные марки кабеля пока не назначаются.</li></ul>
<h3>🔥 Газоснабжение</h3><ul><li><strong>Не подтверждено исходными данными:</strong> наличие, точная сторона и положение газовой магистрали.</li><li>Жёлтая пунктирная линия вдоль Рассветной и ввод к дому — только сценарий для резервирования коридора. До получения схемы газовых сетей её нельзя считать фактической трассой.</li></ul>`;
function buildReportHTML() {
const now = new Date().toLocaleDateString('ru-RU');
const o = id => Norms.obj(id);
const dims = obj => obj.radius !== undefined ? `Ø${Utils.fmt(obj.radius * 2)} м` : `${Utils.fmt(obj.w)}×${Utils.fmt(obj.d)} м`;
const sb = obj => { const s = Norms.setbacks(obj); return `улица/передняя ${Utils.fmt(s.south)} м, задняя ${Utils.fmt(s.north)} м, левая соседняя ${Utils.fmt(s.west)} м, правая соседняя ${Utils.fmt(s.east)} м`; };
const dist = (a, b) => Utils.fmt(Norms.dist(o(a), o(b)));
const checks = Norms.checkAll();
const hard = checks.filter(c => c.ok === false && c.level === 'mandatory');
const conditional = checks.filter(c => c.level === 'conditional' && c.ok !== true);
const recommendations = checks.filter(c => c.level === 'recommendation' && c.ok === false);
const greenhouseSun = juneSunGridAudit('greenhouse', { x:[1.5,4], z:[6,13] }, 0.5);
const gardenSun = juneSunGridAudit('garden', { x:[4,9], z:[4,14] }, 0.5);
const greenhouseChosen = greenhouseSun.find(p => p.x===o('greenhouse').x && p.z===o('greenhouse').z);
const gardenChosen = gardenSun.find(p => p.x===o('garden').x && p.z===o('garden').z);
const pct = v => Math.round(v * 100) + '%';
const networkCrossings = utilityCrossingAudit();
const baselineGardenSun = sunScore(o('garden'), null, false);
const baselineGreenhouseSun = sunScore(o('greenhouse'), null, false);
const landscapeGardenSun = sunScore(o('garden'), null, true);
const landscapeGreenhouseSun = sunScore(o('greenhouse'), null, true);
let html = `<h1>📋 Доклад по планировке участка (${CONFIG.plot.w * CONFIG.plot.d / 100} соток)</h1>`;
html += `<p><strong>Адрес:</strong> Московская область, г.о. Черноголовка, ул. Рассветная, уч. 7<br><strong>Участок:</strong> ${CONFIG.plot.w}×${CONFIG.plot.d} м (${CONFIG.plot.w * CONFIG.plot.d} м²), кадастровый 50:16:0202016:428.<br><strong>Дата:</strong> ${now} • <em>сгенерировано автоматически из данных плана</em></p>`;
html += `<h2>Паспорт участка (данные ЕГРН на 13.05.2026)</h2><ul>
<li><strong>Кадастровый номер:</strong> 50:16:0202016:428</li>
<li><strong>Адрес:</strong> Российская Федерация, Московская область, г.о. Черноголовка, г. Черноголовка, ул. Рассветная, з/у 7</li>
<li><strong>Площадь:</strong> 1000 м² (уточнённая, погрешность 11,0)</li>
<li><strong>Категория земель:</strong> земли населённых пунктов • <strong>ВРИ:</strong> для индивидуального жилищного строительства (дом ≤ 3 этажей и ≤ 20 м)</li>
<li><strong>Кадастровая стоимость:</strong> 1 338 950 руб.</li>
<li><strong>Собственник:</strong> Хорошев Роман Александрович (собственность; запись 50:16:0202016:428-50/137/2026-11 от 08.05.2026)</li>
<li><strong>Основание:</strong> Договор купли-продажи № 50/749-н/50-2026-1-1343 от 07.05.2026</li>
<li><strong>Ограничения и обременения:</strong> не зарегистрированы</li>
</ul>`;
html += `<h2>1. Ориентация участка и солнце — как читать сцену</h2>`;
html += `<p><strong>Стороны света показаны в истинной ориентации.</strong> Локальные оси X/Z идут вдоль границ участка и не совпадают с направлениями восток/север.</p>`;
html += `<p><strong>Реальная ориентация — по акту выноса границ (МСК‑50, зона 2).</strong> Размеры по межевым знакам: 25,001×40,002 м. Ось +X вдоль короткой стороны М4→М3 имеет азимут ≈32,737°, ось +Z вдоль длинной стороны М4→М1 — ≈302,733°. <strong>Улица Рассветная примыкает к короткой передней границе z=0 (ребро М4–М3).</strong> Задняя короткая и обе длинные границы соседние. Положение ворот планируемое; красная линия требует подтверждения по ГПЗУ.</p>`;
html += `<p><strong>Рабочая планировка v2.2 + маршруты v1.</strong> Дом сохранён без переноса. Баня подтянута к хозблоку: основной корпус отделён от хозблока примерно на 1,5 м, а терраса 6×4 м теперь входит в планировочный габарит и оставляет около 6,5 м до дома. Справа сохранены прямой въезд, одно машиноместо и резерв будущего навеса 4×6 м; теплица остаётся слева, а огород перенесён ближе к фасадной границе Рассветной с 0,5-метровым проектным отступом; центральный газон увеличен и остаётся под свободную семейную зону и детскую площадку. Мангальная зона сдвинута ближе к банной группе, но сохраняет проверяемый запас до построек. Пешеходный маршрут начинается от отдельной калитки около X=12 и идёт к дому; короткие ответвления ведут к огороду и террасе бани. Автомобильный проезд к навесу остаётся отдельным. От зоны ворот добавлен хозяйственный подход шириной около 1,4 м к хозблоку, а вход хозблока ориентирован на Рассветную; перед дверью предусмотрена небольшая площадка для садовой техники и инвентаря. Детская площадка и костровая зона доступны с газона без лишнего мощения. Существующих деревьев в модели нет: участок фактически пустой. Озеленение v1 показано отдельным полупрозрачным будущим слоем и не включается в текущую тепловую/инсоляционную карту.</p>`;
html += `<p><strong>Июньская проверка прямого солнца (21 июня):</strong> используется сеточный перебор практичной левой зоны с шагом 0,5 м, почасовой проверкой 08:00–18:00 и пятью точками внутри площади объекта. Текущая теплица X=${Utils.fmt(o('greenhouse').x)}, Z=${Utils.fmt(o('greenhouse').z)} получает ${pct(greenhouseChosen ? greenhouseChosen.score : sunScore(o('greenhouse')))}, лучший допустимый результат в проверенной зоне — ${greenhouseSun.length ? pct(greenhouseSun[0].score) + ' при X=' + Utils.fmt(greenhouseSun[0].x) + ', Z=' + Utils.fmt(greenhouseSun[0].z) : 'нет допустимых точек'}. Текущий огород — ${pct(gardenChosen ? gardenChosen.score : sunScore(o('garden')))}, лучший найденный — ${gardenSun.length ? pct(gardenSun[0].score) + ' при X=' + Utils.fmt(gardenSun[0].x) + ', Z=' + Utils.fmt(gardenSun[0].z) : 'нет допустимых точек'}. Это сравнительная модель затенения объектами проекта, а не агрономическая гарантия.</p>`;
html += `<h2>2. Автопроверка норм</h2>`;
if (!hard.length) html += `<p>✅ По автоматически проверяемым обязательным требованиям нарушений не найдено.</p>`;
else { html += `<p><span class="norm">⚠ Выявлено обязательных нарушений: ${hard.length}</span></p><ul>`; hard.forEach(c => { html += `<li><span class="norm">${c.title}</span> — факт ${Utils.fmt(c.actual)} м при требовании ≥ ${c.min} м (${c.doc})</li>`; }); html += `</ul>`; }
if (conditional.length) { html += `<p><strong>Условные проверки, требующие исходных данных:</strong></p><ul>`; conditional.forEach(c => { html += `<li>${c.title}${c.actual == null ? '' : ` — предварительно ${Utils.fmt(c.actual)} м`} (${c.detail})</li>`; }); html += `</ul>`; }
if (recommendations.length) { html += `<p><strong>Невыполненные проектные рекомендации:</strong></p><ul>`; recommendations.forEach(c => { html += `<li>${c.title} — ${Utils.fmt(c.actual)} м при ориентире ≥ ${c.min} м (${c.detail})</li>`; }); html += `</ul>`; }
html += `<p><em>Автопроверка не подтверждает соответствие всей планировки законодательству: не загружены ГПЗУ, юридическая красная линия, геология и здания соседей.</em></p>`;
html += `<h2>3. Объекты и отступы</h2><ul>`;
const house = o('house'), bath = o('bath'), shed = o('shed');
html += `<li><strong>Жилой дом «Берн»</strong> — ${dims(house)}, центр (X=${Utils.fmt(house.x)}, Z=${Utils.fmt(house.z)}). Отступы: ${sb(house)}.</li>`;
html += `<li><strong>Баня</strong> — ${dims(bath)}, центр (X=${Utils.fmt(bath.x)}, Z=${Utils.fmt(bath.z)}). Отступы: ${sb(bath)}.</li>`;
html += `<li><strong>Хозблок</strong> — ${dims(shed)}, центр (X=${Utils.fmt(shed.x)}, Z=${Utils.fmt(shed.z)}). Отступы: ${sb(shed)}.</li>`;
html += `<li><strong>Огород</strong> — ${dims(o('garden'))}, в передней левой части участка относительно локальной схемы.</li>`;
html += `<li><strong>Теплица</strong> — ${dims(o('greenhouse'))}, арочная, за огородом.</li>`;
html += `<li><strong>Детская площадка</strong> — ${dims(o('playground'))}, у переднего края центрального газона. <strong>Мангальная / костровая зона</strong> — ${dims(o('firepit'))}; в автоматической проверке принят режим мангала, режим открытого костра не утверждён.</li>`;
html += `<li><strong>Одно внутреннее машиноместо</strong> — ${dims(o('car'))}; над ним зарезервирован <strong>будущий навес</strong> ${dims(o('canopy'))}. Гостевая парковка предполагается снаружи вдоль ул. Рассветной; наличие пригодной обочины и режим стоянки не подтверждены.</li>`;
html += `<li><strong>Центральный газон / свободная зона</strong> — ориентировочный контур ${LAYOUT_ZONES.lawn.w}×${LAYOUT_ZONES.lawn.d} м, без твёрдого покрытия и без статуса капитального объекта.</li>`;
html += `<li><strong>Септик</strong> — ${dims(o('septic'))}. <strong>Скважина</strong> — ${dims(o('well'))}.</li>`;
CAT.items().forEach(c => { html += `<li><strong>${c.label}</strong> — ${dims(c)}, центр (X=${Utils.fmt(c.x)}, Z=${Utils.fmt(c.z)}). Отступы: ${sb(c)}. <em>(добавлен из каталога)</em></li>`; });
html += `</ul>`;
html += `<h2>4. Ключевые расстояния (между краями)</h2><ul>`;
html += `<li>Дом → баня: <strong>${dist('house','bath')} м</strong>. В пределах одного участка ИЖС противопожарный разрыв между домом и хозяйственной постройкой не нормируется (СП 4.13130; разъяснение МЧС).</li>`;
html += `<li>Септик/ЛОС → дом: <strong>${dist('septic','house')} м</strong>. Это фактическое расстояние рабочего варианта, а не универсальная санитарная норма; окончательно зависит от типа установки.</li>`;
html += `<li>Септик/ЛОС → скважина: <strong>${dist('septic','well')} м</strong>. Точка разнесена сильнее, чем в предыдущей версии, но санитарная пригодность определяется гидрогеологией и типом водозабора/ЛОС.</li>`;
html += `<li>Скважина → дом: <strong>${dist('well','house')} м</strong>, → баня с террасой: <strong>${dist('well','bath')} м</strong>. Это эксплуатационные расстояния текущей планировки.</li>`;
html += `<li>Зона мангала → дом: <strong>${dist('firepit','house')} м</strong>, → баня: <strong>${dist('firepit','bath')} м</strong>, → хозблок: <strong>${dist('firepit','shed')} м</strong> (для принятого режима мангала ≥5 м; открытый костёр требует другого решения).</li>`;
html += `<li>Навес → хозблок: <strong>${dist('canopy','shed')} м</strong>; машина полностью размещена внутри резервного контура навеса, въезд идёт прямо от ворот.</li>`;
CONFIG.objects.filter(x => x.type === 'grill').forEach(g => {
['house','bath','shed','garage','gazebo'].forEach(bid => {
const bb = Norms.obj(bid); if (!bb) return;
html += `<li>${g.label.replace(/^[^\s]+\s/, '')} → ${Norms.name(bid)}: <strong>${Utils.fmt(Norms.dist(g, bb))} м</strong> (мангал ≥5 м)</li>`;
});
});
html += `</ul>`;
html += `<h2>5. Длины коммуникаций (авторасчёт)</h2><ul>`;
CONFIG.utilities.forEach(u => { const depthText = u.depth == null ? 'глубина уточняется' : `глубина ${Utils.fmt(u.depth)} м`; html += `<li>${u.icon} <strong>${u.name}</strong> — ${Utils.fmt(utilityLength(u))} м (${u.pipe}, ${depthText})</li>`; });
html += `</ul>`;
html += `<h2>5.5. Ревизия пересечений инженерных трасс</h2>`;
if (!networkCrossings.length) html += '<p>Графических пересечений между разными системами не найдено.</p>';
else {
  html += `<p>Автоматически найдено <strong>${networkCrossings.length}</strong> 2D-пересечений разных систем. Это <strong>не список нарушений</strong>: каждую точку нужно увязать по глубине, футлярам/защите и очередности работ.</p><ul>`;
  networkCrossings.slice(0,20).forEach(x => { html += `<li>${x.icons} ${x.a} ↔ ${x.b}: X=${Utils.fmt(x.x)}, Z=${Utils.fmt(x.z)}</li>`; });
  if (networkCrossings.length > 20) html += `<li>…ещё ${networkCrossings.length-20} пересечений; полный список доступен при дальнейшем инженерном уточнении.</li>`;
  html += '</ul>';
}
html += `<h2>6. Инженерные системы</h2>` + ENGINEERING_HTML;
html += `<h2>6.5. Предварительная смета</h2>` + buildSmetaHTML();
html += `<h2>6.7. Озеленение v1–v2</h2>
<p><strong>${LANDSCAPE_PLAN.note}</strong></p>
<ul>
<li>🌳 Дерево A: X=${Utils.fmt(LANDSCAPE_PLAN.trees[0].x)}, Z=${Utils.fmt(LANDSCAPE_PLAN.trees[0].z)} — компактная форма за теплицей; не занимает газон и находится примерно в 3 м от ближайшей нанесённой инженерной трассы.</li>
<li>🌳 Дерево B: X=${Utils.fmt(LANDSCAPE_PLAN.trees[1].x)}, Z=${Utils.fmt(LANDSCAPE_PLAN.trees[1].z)} — компактная форма слева перед домом; до ближайшей нанесённой трассы около 2 м.</li>
<li>🌿 За домом зарезервирована невысокая полоса кустарников X≈${Utils.fmt(LANDSCAPE_PLAN.shrubZones[0].x)}, Z≈${Utils.fmt(LANDSCAPE_PLAN.shrubZones[0].z)} для приватности; это не место для крупного дерева.</li>
</ul>
<p><strong>Сценарная проверка тени от будущих двух деревьев:</strong> огород ${pct(baselineGardenSun)} → ${pct(landscapeGardenSun)}, теплица ${pct(baselineGreenhouseSun)} → ${pct(landscapeGreenhouseSun)} по июньской выборке. В текущей модели эти две посадки не уменьшают результат для огорода и теплицы. Это упрощённая модель зрелой кроны, а не прогноз урожайности.</p>
<p><strong>Почему пока только два дерева:</strong> правая сторона занята скважиной и инженерным коридором, центр оставляем газоном, а передняя левая часть нужна теплице/огороду. Высокорослые деревья до уточнения местных отступов и реальных коммуникаций не закладываем.</p>
<h3>Озеленение v2 — декоративные зоны</h3>
<ul>
<li>🌸 <strong>Терраса бани:</strong> узкая группа 3,2×0,8 м севернее террасы. Формат — невысокие кустарники + многолетники; ближайшая нанесённая инженерная трасса примерно в 1,5 м, поэтому окончательный ассортимент выбираем с умеренной корневой системой.</li>
<li>🪴 <strong>Калитка:</strong> вместо посадки в грунт — съёмный контейнер. Передняя часть участка перегружена ливнёвкой, входной дорожкой и резервами коммуникаций.</li>
<li>🪴 <strong>Терраса бани:</strong> второй контейнерный сезонный акцент на самой террасе.</li>
<li>🌿 <strong>Хозблок:</strong> узкий зелёный экран/решётка вдоль западной стены со стороны двора. Южный вход со стороны Рассветной остаётся полностью свободным.</li>
</ul>
<p><strong>Палитра-кандидат:</strong> для зоны бани можно рассматривать метельчатую гортензию/компактную спирею и теневыносливые многолетники вроде хосты; это пока не спецификация сортов. Контейнеры у входов лучше заполнять сезонно, чтобы не создавать постоянную корневую зону над сетями.</p>
<h3>Правила посадочного слоя</h3><ul>`;
LANDSCAPE_PLAN.planningRules.forEach(x => { html += `<li>${x}</li>`; });
html += `</ul>`;
html += `<h2>6.8. Контрольная ревизия MASTER v1</h2>`;
html += `<p><strong>${MASTER_REVIEW.note}</strong></p><h3>Планировочно зафиксировано</h3><ul>`;
MASTER_REVIEW.planningFrozen.forEach(x => { html += `<li>✓ ${x}</li>`; });
html += `</ul><h3>Остаётся предварительным</h3><ul>`;
MASTER_REVIEW.preliminary.forEach(x => { html += `<li>? ${x}</li>`; });
html += `</ul><h3>Какие исходные данные ещё нужны</h3><ul>`;
MASTER_REVIEW.openInputs.forEach(x => { html += `<li>□ ${x}</li>`; });
html += `</ul><h3>Очередность реализации</h3><ol>`;
MASTER_REVIEW.buildPhases.forEach(p => { html += `<li><strong>Этап ${p.n}. ${p.title}.</strong> ${p.items}</li>`; });
html += `</ol><p><strong>Правило для следующего этапа благоустройства:</strong> крупные посадки не ставить над основными инженерными коридорами, рядом с ревизиями/кессоном/ЛОС и в зонах доступа техники. Сначала закрепляем будущие деревья и кустарники как планировочные точки, затем проверяем их по солнцу, корневой зоне и коммуникациям.</p>`;
html += `<h2>7. Заключение</h2>`;
if (hard.length) html += `<p><span class="norm">Планировка требует корректировки:</span> ${hard.length} автоматически выявленных обязательных нарушений (раздел 2).</p>`;
else html += `<p>По автоматически проверяемым обязательным параметрам нарушений не найдено. До строительства необходимо закрыть условные проверки из раздела 2.</p>`;
return html;
}
function openReportModal() {
DOM.reportBody.innerHTML = buildReportHTML();
DOM.reportModal.style.display = 'block';
document.body.style.overflow = 'hidden';
}
// ═══════════════════════════════════════════════════════════════
// ИЗМЕРЕНИЯ (расстояние + площадь)
// ═══════════════════════════════════════════════════════════════
const measure = {
mode: null, points: [],
line: (() => { const l = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })); l.visible = false; scene.add(l); return l; })(),
marker: (() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 })); m.visible = false; scene.add(m); return m; })(),
sprite: null, areaPoints: [], areaMarkers: [], areaLine: null, areaFill: null, areaSprite: null, areaClosed: false
};
const areaMarkerGeo = new THREE.SphereGeometry(0.22, 8, 8);
const areaMarkerMat = new THREE.MeshBasicMaterial({ color: 0x3498db });
function polyArea(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * b.z - b.x * a.z; } return Math.abs(s) / 2; }
function polyPerimeter(pts) { let p = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; p += Math.hypot(b.x - a.x, b.z - a.z); } return p; }
function polyCentroid(pts) { let x = 0, z = 0; pts.forEach(p => { x += p.x; z += p.z; }); return { x: x / pts.length, z: z / pts.length }; }
function updateMeasureButtons() {
const d = measure.mode === 'dist', a = measure.mode === 'area';
['toggle-measure', 'toggleMeasureMob'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('active', d); });
['toggle-area', 'toggleAreaMob'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('active', a); });
}
function setMeasureMode(mode) {
if (measure.mode === mode) { clearMeasure(); return; }
clearMeasure(true);
measure.mode = mode;
DOM.measureHint.classList.add('show');
DOM.measureHint.textContent = mode === 'dist' ? '👆 Коснитесь участка, чтобы поставить точку' : '👆 Кликайте углы контура (мин. 3). Двойной клик или тап по первой точке — завершить';
updateMeasureButtons();
Utils.markDirty();
}
function clearMeasure(silent) {
measure.mode = null; measure.points = [];
measure.line.visible = false; measure.marker.visible = false;
if (measure.sprite) { scene.remove(measure.sprite); measure.sprite = null; }
measure.areaPoints = [];
measure.areaMarkers.forEach(m => scene.remove(m));
measure.areaMarkers = [];
if (measure.areaLine) { measure.areaLine.geometry.dispose(); measure.areaLine.geometry = new THREE.BufferGeometry(); measure.areaLine.visible = false; }
if (measure.areaFill) { measure.areaFill.geometry.dispose(); measure.areaFill.geometry = new THREE.BufferGeometry(); measure.areaFill.visible = false; }
if (measure.areaSprite) { scene.remove(measure.areaSprite); measure.areaSprite = null; }
measure.areaClosed = false;
if (!silent) DOM.measureHint.classList.remove('show');
updateMeasureButtons();
Utils.markDirty();
}
function updateAreaVisual() {
const pts = measure.areaPoints;
if (!measure.areaLine) {
measure.areaLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x3498db }));
scene.add(measure.areaLine);
measure.areaFill = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
scene.add(measure.areaFill);
}
const linePts = pts.map(p => new THREE.Vector3(p.x, 0.1, p.z));
if (measure.areaClosed && linePts.length > 1) linePts.push(linePts[0].clone());
measure.areaLine.geometry.dispose();
measure.areaLine.geometry = new THREE.BufferGeometry().setFromPoints(linePts);
measure.areaLine.visible = pts.length > 1;
if (pts.length >= 3) {
const shape = new THREE.Shape(pts.map(p => new THREE.Vector2(p.x, -p.z)));
const geo = new THREE.ShapeGeometry(shape);
geo.rotateX(-Math.PI / 2); geo.translate(0, 0.04, 0);
measure.areaFill.geometry.dispose();
measure.areaFill.geometry = geo;
measure.areaFill.visible = true;
} else measure.areaFill.visible = false;
}
function closeAreaPolygon() {
const pts = measure.areaPoints;
if (pts.length < 3) return;
const area = polyArea(pts);
const peri = polyPerimeter(pts);
measure.areaClosed = true;
updateAreaVisual();
const c = polyCentroid(pts);
measure.areaSprite = Utils.createLabel(`📐 ${Utils.fmt(area)} м² • периметр ${Utils.fmt(peri)} м`, '#ffffff', 0.9, [7, 1.4], 640, 128, 34, 'rgba(20, 80, 140, 0.9)');
measure.areaSprite.position.set(c.x, 1.2, c.z);
scene.add(measure.areaSprite);
DOM.measureHint.textContent = `✅ Площадь: ${Utils.fmt(area)} м², периметр: ${Utils.fmt(peri)} м. Клик — новый контур`;
Utils.markDirty();
}
function resetAreaKeepMode() {
measure.areaPoints = [];
measure.areaMarkers.forEach(m => scene.remove(m));
measure.areaMarkers = [];
if (measure.areaSprite) { scene.remove(measure.areaSprite); measure.areaSprite = null; }
measure.areaClosed = false;
updateAreaVisual();
}
function handleAreaClick(pt) {
if (measure.areaClosed) resetAreaKeepMode();
const first = measure.areaPoints[0];
const last = measure.areaPoints[measure.areaPoints.length - 1];
if (last && Math.hypot(pt.x - last.x, pt.z - last.z) < 0.3) return;
if (first && measure.areaPoints.length >= 3 && Math.hypot(pt.x - first.x, pt.z - first.z) < 0.9) { closeAreaPolygon(); return; }
measure.areaPoints.push(pt.clone());
const m = new THREE.Mesh(areaMarkerGeo, areaMarkerMat);
m.position.set(pt.x, 0.5, pt.z);
scene.add(m);
measure.areaMarkers.push(m);
updateAreaVisual();
DOM.measureHint.textContent = measure.areaPoints.length < 3 ? `👆 Точек: ${measure.areaPoints.length} (нужно минимум 3)` : `👆 Точек: ${measure.areaPoints.length} • пока ${Utils.fmt(polyArea(measure.areaPoints))} м² • двойной клик — завершить`;
Utils.markDirty();
}
function handleDistanceClick(pt) {
if (measure.points.length === 0) {
if (measure.sprite) { scene.remove(measure.sprite); measure.sprite = null; }
measure.line.visible = false; measure.marker.visible = false;
DOM.measureHint.textContent = '👆 Поставьте вторую точку';
}
measure.points.push(pt.clone());
measure.marker.position.copy(pt); measure.marker.position.y = 0.5; measure.marker.visible = true;
Utils.markDirty();
if (measure.points.length === 2) {
const [p1, p2] = measure.points;
const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.z-p2.z)**2);
measure.line.geometry.dispose();
measure.line.geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
measure.line.visible = true;
const mid = p1.clone().add(p2).multiplyScalar(0.5);
measure.marker.position.copy(mid); measure.marker.position.y = 0.5;
if (measure.sprite) scene.remove(measure.sprite);
measure.sprite = createDistanceLabel(`📏 ${dist.toFixed(2)} м`, mid.x, 0.8, mid.z);
scene.add(measure.sprite);
measure.points = [];
DOM.measureHint.textContent = '✅ Измерено! Клик для новой точки.';
setTimeout(() => { if (measure.mode === 'dist') DOM.measureHint.textContent = '👆 Коснитесь участка, чтобы поставить точку'; }, 2000);
Utils.markDirty();
}
}
function handleMeasureClick(pt) {
if (pt.x < 0 || pt.x > CONFIG.plot.w || pt.z < 0 || pt.z > CONFIG.plot.d) {
DOM.measureHint.textContent = '❌ Клик за пределами участка!';
setTimeout(() => { if (!measure.mode) return; DOM.measureHint.textContent = measure.mode === 'dist' ? '👆 Коснитесь участка, чтобы поставить точку' : '👆 Кликайте углы контура (мин. 3). Двойной клик — завершить'; }, 1500);
return;
}
if (measure.mode === 'dist') handleDistanceClick(pt);
else if (measure.mode === 'area') handleAreaClick(pt);
}
function createDistanceLabel(text, x, y, z) {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512; canvas.height = 128;
ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 12;
ctx.fillStyle = 'rgba(255,255,255,0.9)';
ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 20);
ctx.fill();
ctx.shadowBlur = 0;
ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3;
ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 20);
ctx.stroke();
ctx.font = 'Bold 48px Arial'; ctx.fillStyle = '#ff0000';
ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
ctx.fillText(text, canvas.width/2, canvas.height/2 + 5);
const texture = new THREE.CanvasTexture(canvas);
const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
const sprite = new THREE.Sprite(mat);
sprite.scale.set(6, 1.5, 1);
sprite.position.set(x, y, z);
return sprite;
}
// ═══════════════════════════════════════════════════════════════
// РЕЖИМ РЕДАКТИРОВАНИЯ + НАРУШЕНИЯ
// ═══════════════════════════════════════════════════════════════
let editMode = false;
let showViolationRings = false;
function setEditMode(on) {
editMode = on;
DOM.edit.modeBtn.textContent = on ? '✋ Выключить изменения на карте' : '🖐 Включить изменения на карте';
DOM.edit.modeBtn.classList.toggle('active', on);
DOM.edit.status.textContent = on ? '✋ Перетаскивайте объекты мышью' : 'Режим просмотра';
renderer.domElement.style.cursor = '';
if (!on && drag.active) endDrag();
if (on) toast('✋ Изменения включены — перетаскивайте объекты', 2500);
}
function buildViolationRings() {
while (groups.violRings.children.length) {
const c = groups.violRings.children[0];
groups.violRings.remove(c);
if (c.geometry) c.geometry.dispose();
if (c.material) c.material.dispose();
}
const checks = Norms.checkAll();
const failed = checks.filter(c => c.ok === false && c.level === 'mandatory');
const ids = new Set();
failed.forEach(c => c.ids.forEach(id => ids.add(id)));
ids.forEach(id => {
const o = Norms.obj(id);
if (!o) return;
const b = Norms.bounds(o);
const r = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) / 2 + 0.5;
const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.25, 40), new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
ring.rotation.x = -Math.PI / 2;
ring.position.set(o.x, 0.05, o.z);
groups.violRings.add(ring);
});
Utils.markDirty();
}
// ═══════════════════════════════════════════════════════════════
// UNDO / REDO (v3 — поддерживает полные снимки сцены и старые массивы)
// ═══════════════════════════════════════════════════════════════
const history = { undo: [], redo: [] };
const HISTORY_MAX = 50;
function snapshotPositions() { return CONFIG.objects.map(o => ({ id: o.id, x: o.x, z: o.z, rot: o.rot || 0, w: o.w, d: o.d, h: o.h, radius: o.radius })); }
function applySnapshot(snap) {
snap.forEach(p => {
const o = CONFIG.objects.find(x => x.id === p.id); if (!o) return;
let rebuild = false;
if (p.w !== undefined && p.w !== o.w) { o.w = p.w; rebuild = true; }
if (p.d !== undefined && p.d !== o.d) { o.d = p.d; rebuild = true; }
if (p.h !== undefined && p.h !== o.h) { o.h = p.h; rebuild = true; }
if (p.radius !== undefined && p.radius !== o.radius) { o.radius = p.radius; rebuild = true; }
if (p.status !== undefined) o.status = normalizeStatus(p.status, o.status);
if (p.note !== undefined) o.note = p.note;
o.x = p.x; o.z = p.z; o.rot = p.rot || 0;
if (rebuild) rebuildObject(o.id);
});
syncPositionsToScene();
saveLayout();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
}
function applyFullSceneSnapshot(snapshot) {
if (snapshot.masterV6 && BernV6.restoreProject) BernV6.restoreProject(snapshot.masterV6);
const list = snapshotObjectList(snapshot);
if (!list.length) return;
if (!Array.isArray(snapshot)) {
const wantedCatalog = new Set(list.filter(o => CATALOG[o.type]).map(o => o.id));
CAT.items().slice().forEach(o => { if (!wantedCatalog.has(o.id)) CAT.remove(o.id, true); });
list.filter(o => CATALOG[o.type]).forEach(o => { if (!Norms.obj(o.id)) CAT.make(o.type, plainClone(o), true); });
if (snapshot.infrastructure) Object.keys(snapshot.infrastructure).forEach(k => {
if (CONFIG.infrastructure[k]) Object.assign(CONFIG.infrastructure[k], plainClone(snapshot.infrastructure[k]));
});
if (Array.isArray(snapshot.utilities)) snapshot.utilities.forEach(saved => {
const current = CONFIG.utilities.find(u => u.name === saved.name);
if (!current) return;
['route','pipe','depth','label','status','note'].forEach(key => { if (saved[key] !== undefined) current[key] = plainClone(saved[key]); });
});
if (Array.isArray(snapshot.projectFacts)) snapshot.projectFacts.forEach(saved => {
const current = PROJECT_FACTS.find(f => f.id === saved.id);
if (current) { current.status = normalizeStatus(saved.status, current.status); if (typeof saved.note === 'string') current.note = saved.note; }
});
}
applySnapshot(list);
CONFIG.utilities.forEach(refreshUtility);
if (window.CAT) window.CAT.save();
saveProjectState();
}
function pushUndo(snap) {
history.undo.push(snap);
if (history.undo.length > HISTORY_MAX) history.undo.shift();
history.redo = [];
updateHistoryButtons();
}
function undo() {
if (!history.undo.length) { toast('↩️ Нет действий для отмены'); return; }
const current = snapshotFullScene();
const prev = history.undo.pop();
history.redo.push(current);
applyFullSceneSnapshot(prev);
updateHistoryButtons();
toast('↩️ Отменено');
}
function redo() {
if (!history.redo.length) { toast('↪️ Нет действий для возврата'); return; }
const current = snapshotFullScene();
const next = history.redo.pop();
history.undo.push(current);
applyFullSceneSnapshot(next);
updateHistoryButtons();
toast('↪️ Возвращено');
}
function updateHistoryButtons() {
if (DOM.edit.undoBtn) DOM.edit.undoBtn.style.opacity = history.undo.length ? '1' : '0.4';
if (DOM.edit.redoBtn) DOM.edit.redoBtn.style.opacity = history.redo.length ? '1' : '0.4';
}
// ═══════════════════════════════════════════════════════════════
// ПЕРЕТАСКИВАНИЕ
// ═══════════════════════════════════════════════════════════════
const drag = { active: false, moved: false, id: null, obj: null, group: null, startSnap: null, plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), raycaster: new THREE.Raycaster(), point: new THREE.Vector3() };
let toastTimer = null;
function toast(msg, ms = 2600) {
clearTimeout(toastTimer);
DOM.dragHint.textContent = msg;
DOM.dragHint.classList.add('show');
toastTimer = setTimeout(() => DOM.dragHint.classList.remove('show'), ms);
}
function showDragHint() {
clearTimeout(toastTimer);
DOM.dragHint.textContent = `✋ ${drag.obj.label} — X: ${Utils.fmt(drag.obj.x)} • Z: ${Utils.fmt(drag.obj.z)}`;
DOM.dragHint.classList.add('show');
}
function hideDragHint() { clearTimeout(toastTimer); DOM.dragHint.classList.remove('show'); }
function chainVisible(o) { let c = o; while (c) { if (!c.visible) return false; c = c.parent; } return true; }
function findDraggableRoot(object3d) { let cur = object3d; while (cur) { if (cur.userData && cur.userData.objectId) return cur; cur = cur.parent; } return null; }
function screenToPlane(e, out) {
const rect = renderer.domElement.getBoundingClientRect();
const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
drag.raycaster.setFromCamera(mouse, camera);
return drag.raycaster.ray.intersectPlane(drag.plane, out);
}
function tryStartDrag(e) {
if (!editMode || measure.mode) return false;
const rect = renderer.domElement.getBoundingClientRect();
const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
drag.raycaster.setFromCamera(mouse, camera);
const hits = drag.raycaster.intersectObjects(draggableGroups, true);
if (!hits.length) return false;
const root = findDraggableRoot(hits[0].object);
if (root && isMasterLocked(root.userData.objectId)) { toast('MASTER: разблокировка в разделе Проект → Объекты'); return false; }
if (!root || !chainVisible(root)) return false;
drag.active = true; drag.moved = false;
drag.id = root.userData.objectId;
drag.obj = CONFIG.objects.find(o => o.id === drag.id);
drag.group = root;
drag.startSnap = snapshotFullScene();
renderer.domElement.style.cursor = 'grabbing';
hideCommInfo();
showDragHint();
return true;
}
function dragTo(e) {
if (!screenToPlane(e, drag.point)) return;
const b = Norms.bounds(drag.obj);
const halfW = (b.maxX - b.minX) / 2;
const halfD = (b.maxZ - b.minZ) / 2;
let x = Math.round(drag.point.x * 2) / 2;
let z = Math.round(drag.point.z * 2) / 2;
x = Math.max(halfW, Math.min(CONFIG.plot.w - halfW, x));
z = Math.max(halfD, Math.min(CONFIG.plot.d - halfD, z));
if (x !== drag.obj.x || z !== drag.obj.z) {
drag.moved = true;
drag.obj.x = x; drag.obj.z = z;
drag.group.position.set(x, 0, z);
const lbl = labelSprites[drag.id];
if (lbl) { lbl.position.x = x; lbl.position.z = z; }
refreshUtilitiesFor(drag.id);
renderer.shadowMap.needsUpdate = true;
Utils.markDirty();
showDragHint();
}
}
function endDrag() {
if (!drag.active) return;
const wasMoved = drag.moved;
const id = drag.id;
const startSnap = drag.startSnap;
drag.active = false; drag.id = null; drag.obj = null; drag.group = null; drag.startSnap = null;
renderer.domElement.style.cursor = '';
hideDragHint();
if (wasMoved) {
if (startSnap) pushUndo(startSnap);
saveLayout();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
const o = CONFIG.objects.find(x => x.id === id);
toast(`💾 ${Norms.name(id)} → X ${Utils.fmt(o.x)}, Z ${Utils.fmt(o.z)} • сохранено`);
renderer.shadowMap.needsUpdate = true;
}
Utils.markDirty();
}
function syncPositionsToScene() {
if(BernV6.ready) syncDependencies();
draggables.forEach(d => { const o = CONFIG.objects.find(x => x.id === d.id); if (o) { d.group.position.set(o.x, 0, o.z); d.group.rotation.y = (o.rot || 0) * Math.PI / 180; } });
CONFIG.objects.forEach(o => { const lbl = labelSprites[o.id]; if (lbl) lbl.position.set(o.x, o.y, o.z); });
CONFIG.utilities.forEach(refreshUtility);
renderer.shadowMap.needsUpdate = true;
Utils.markDirty();
}
function resetLayout() {
if(BernV6.readOnly){toast("Review: сброс сохранений отключён");return;}
CAT.items().slice().forEach(o => CAT.remove(o.id, true));   // очистка каталога
try { localStorage.removeItem(CATALOG_KEY); } catch (e) {}
CONFIG.objects.forEach(o => { const d = DEFAULT_LAYOUT[o.id]; if (d) { o.x = d.x; o.z = d.z; o.rot = d.rot || 0; o.w = d.w; o.d = d.d; o.h = d.h; o.radius = d.radius; } });
syncPositionsToScene();
try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
history.undo = []; history.redo = [];
updateHistoryButtons();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
toast('🔄 Планировка сброшена к исходной');
}
function clampObject(o) {
const b = Norms.bounds(o);
const hw = (b.maxX - b.minX) / 2, hd = (b.maxZ - b.minZ) / 2;
o.x = Math.min(Math.max(o.x, hw), CONFIG.plot.w - hw);
o.z = Math.min(Math.max(o.z, hd), CONFIG.plot.d - hd);
}
function rebuildObject(id) {
const o = CONFIG.objects.find(o => o.id === id);
const entry = draggables.find(d => d.id === id);
const oldGroup = objectMeshes[id];
if (!o || !entry || !oldGroup) return;
const parent = oldGroup.parent;
parent.remove(oldGroup);
oldGroup.traverse(c => { if (c.geometry) c.geometry.dispose(); });
const ng = Builders[o.type](o);
ng.userData.objectId = id;
ng.rotation.y = (o.rot || 0) * Math.PI / 180;
ng.position.set(o.x, 0, o.z);
parent.add(ng);
entry.group = ng;
objectMeshes[id] = ng;
for (let i = 0; i < draggableGroups.length; i++) if (draggableGroups[i] === oldGroup) draggableGroups[i] = ng;
}
// ═══════════════════════════════════════════════════════════════
// 🩹 ИСПРАВЛЕНИЕ НАРУШЕНИЙ — этап 1: расталкивание, этап 2: спасательный перебор
// ═══════════════════════════════════════════════════════════════
function collectFixTargets() {
const res = Norms.checkAll().filter(c => c.ok === false && c.level === 'mandatory').map(c => ({ kind: c.kind, ids: c.ids.slice(), actual: c.actual, min: c.min }));
for (let i = 0; i < CONFIG.objects.length; i++) for (let j = i + 1; j < CONFIG.objects.length; j++) {
const a = CONFIG.objects[i], b = CONFIG.objects[j];
const d = Norms.dist(a, b);
if (d < 0 && !isAllowedOverlap(a, b)) res.push({ kind: 'dist', ids: [a.id, b.id], actual: d, min: 0, overlap: true });
}
return res;
}
function mobility(o) { if (isMasterLocked(o.id)) return 0; return o.id === 'house' ? 0.12 : 1; }
function setbackMinFor(o) {
const r = Norms.rules.find(r => r.kind === 'setback' && r.obj === o.id);
if (r) return r.min;
if (o.type === 'gazebo' || o.type === 'garage') return 1;
return 0.5;
}
function rescuePlace(id) {
const o = Norms.obj(id); if (!o || isMasterLocked(o.id)) return false;
const origX = o.x, origZ = o.z, origRot = o.rot || 0;
const rots = (o.radius !== undefined || o.w === o.d) ? [origRot] : [origRot, (origRot + 90) % 360];
let best = null, bestD = Infinity;
for (const rot of rots) {
o.rot = rot;
const b0 = Norms.bounds(o);
const hw = (b0.maxX - b0.minX) / 2, hd = (b0.maxZ - b0.minZ) / 2;
const sbMin = setbackMinFor(o);
for (let x = hw; x <= CONFIG.plot.w - hw + 0.001; x += 0.5) {
for (let z = hd; z <= CONFIG.plot.d - hd + 0.001; z += 0.5) {
o.x = x; o.z = z;
const s = Norms.setbacks(o);
if (Math.min(s.south, s.north, s.west, s.east) < sbMin) continue;
if (o.id !== 'car' && drivewayIntersects(o)) continue;
let okAll = true;
for (const t of CONFIG.objects) {
if (t.id === o.id) continue;
const d = Norms.dist(o, t);
if (d < 0 && !isAllowedOverlap(o, t)) { okAll = false; break; }
for (const r of Norms.rules) {
if (r.kind !== 'dist') continue;
if ((r.a === o.id && r.b === t.id) || (r.b === o.id && r.a === t.id)) { if (d < r.min) { okAll = false; break; } }
}
if (!okAll) break;
if (o.type === 'grill' && ['house','bath','shed','garage','gazebo'].includes(t.type) && d < 5) { okAll = false; break; }
}
if (!okAll) continue;
const dd = Math.hypot(x - origX, z - origZ);
if (dd < bestD) { bestD = dd; best = { x, z, rot }; }
}
}
}
o.x = origX; o.z = origZ; o.rot = origRot;
if (!best) return false;
o.x = best.x; o.z = best.z; o.rot = best.rot;
return true;
}
function fixViolations() {
if (!collectFixTargets().length) { toast('✅ Нарушений нет — исправлять нечего'); return; }
const prev = snapshotPositions();
const movedIds = new Set();
// Этап 1: итерационное расталкивание (дом почти не двигается)
for (let iter = 0; iter < 40; iter++) {
const problems = collectFixTargets();
if (!problems.length) break;
const disp = {};
problems.forEach(c => {
if (c.kind === 'dist') {
const A = Norms.obj(c.ids[0]), B = Norms.obj(c.ids[1]);
if (!A || !B) return;
const need = Math.min(c.min - c.actual, 2.0) + 0.1;
let dx = B.x - A.x, dz = B.z - A.z;
const len = Math.hypot(dx, dz);
if (len < 1e-4) { dx = 1; dz = 0; } else { dx /= len; dz /= len; }
const wA = mobility(A), wB = mobility(B), wSum = wA + wB;
if (!wSum) return;
disp[A.id] = disp[A.id] || { dx: 0, dz: 0 };
disp[B.id] = disp[B.id] || { dx: 0, dz: 0 };
disp[A.id].dx -= dx * need * (wA / wSum);
disp[A.id].dz -= dz * need * (wA / wSum);
disp[B.id].dx += dx * need * (wB / wSum);
disp[B.id].dz += dz * need * (wB / wSum);
} else if (c.kind === 'setback') {
const O = Norms.obj(c.ids[0]); if (!O || isMasterLocked(O.id)) return;
const s = Norms.setbacks(O);
const need = Math.min(c.min - c.actual, 2.0) + 0.05;
disp[O.id] = disp[O.id] || { dx: 0, dz: 0 };
if (s.south === c.actual) disp[O.id].dz += need;
else if (s.north === c.actual) disp[O.id].dz -= need;
else if (s.west === c.actual) disp[O.id].dx += need;
else disp[O.id].dx -= need;
}
});
if (!Object.keys(disp).length) break;
Object.keys(disp).forEach(id => {
const O = Norms.obj(id); if (!O || isMasterLocked(O.id)) return;
O.x += disp[id].dx; O.z += disp[id].dz;
clampObject(O);
movedIds.add(id);
});
}
// Этап 2: спасательный перебор ближайшей полностью корректной позиции
let guard = 0;
while (guard++ < 6) {
const problems = collectFixTargets();
if (!problems.length) break;
const cand = [];
problems.forEach(c => c.ids.forEach(id => { if (id !== 'house' && !cand.includes(id)) cand.push(id); }));
let did = false;
for (const id of cand) { if (rescuePlace(id)) { movedIds.add(id); did = true; break; } }
if (!did) break;
}
if (!movedIds.size) { toast('⚠ Не удалось исправить автоматически — на участке слишком тесно'); return; }
syncPositionsToScene();
movedIds.forEach(refreshUtilitiesFor);
saveLayout();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
pushUndo(prev);
if (DOM.normsModal.style.display === 'block') openNorms();
const left = collectFixTargets().length;
if (!left) toast(`🩹 Исправлено! Сдвинуто объектов: ${movedIds.size} — все нормы соблюдены ✅`, 4500);
else toast(`🩹 Исправлено частично (сдвинуто ${movedIds.size}), осталось проблем: ${left} — на участке тесно`, 5500);
renderer.shadowMap.needsUpdate = true;
Utils.markDirty();
}
// ═══════════════════════════════════════════════════════════════
// ВАРИАНТЫ ПЛАНИРОВКИ + СРАВНЕНИЕ (v3 — полный снимок сцены)
// ═══════════════════════════════════════════════════════════════
function evaluateLayout(snapshot) {
const saved = CONFIG.objects;
if (!Array.isArray(snapshot) && snapshot && Array.isArray(snapshot.objects)) CONFIG.objects = plainClone(snapshot.objects);
else CONFIG.objects = saved.map(full => {
const copy = Object.assign({}, full);
const s = (snapshot || []).find(p => p.id === full.id);
if (s && typeof s.x === 'number' && typeof s.z === 'number') { copy.x = s.x; copy.z = s.z; }
if (s && typeof s.rot === 'number') copy.rot = s.rot;
if (s && typeof s.w === 'number') copy.w = s.w;
if (s && typeof s.d === 'number') copy.d = s.d;
if (s && typeof s.h === 'number') copy.h = s.h;
if (s && typeof s.radius === 'number') copy.radius = s.radius;
return copy;
});
let hard = 0, gardenSun = 0, ghSun = 0;
try { hard = Norms.checkAll().filter(c => c.ok === false && c.level === 'mandatory').length; } catch (e) {}
try {
const garden = Norms.obj('garden'), greenhouse = Norms.obj('greenhouse');
if (garden) gardenSun = zoneSunHours({ x: garden.x, z: garden.z, w: garden.w, d: garden.d, own: null }, 5);
if (greenhouse) ghSun = zoneSunHours({ x: greenhouse.x, z: greenhouse.z, w: greenhouse.w, d: greenhouse.d, own: greenhouse.id }, 5);
} catch (e) {}
CONFIG.objects = saved;
return { hard, gardenSun, ghSun };
}
function openVariantsModal() {
const variants = loadVariants();
const names = Object.keys(variants);
let html = '<table id="variants-table"><thead><tr><th>Вариант</th><th>Объекты</th><th>Нарушения</th><th>🌱 Огород</th><th>🌿 Теплица</th><th>Действия</th></tr></thead><tbody>';
const cur = evaluateLayout(CONFIG.objects);
html += `<tr class="cur"><td><b>Текущая</b></td><td>${CONFIG.objects.length}</td><td>${cur.hard ? '⚠ ' + cur.hard : '✅ 0'}</td><td>${Utils.fmt(cur.gardenSun)} ч</td><td>${Utils.fmt(cur.ghSun)} ч</td><td>—</td></tr>`;
names.forEach(n => {
const m = evaluateLayout(variants[n]);
const full = !Array.isArray(variants[n]);
const safeName = escapeHtml(n), encodedName = encodeURIComponent(n);
html += `<tr><td>${safeName}<div class="norm-doc">${full ? `полный снимок v${variants[n].v || 3}` : 'старый формат'}</div></td><td>${snapshotObjectList(variants[n]).length}</td><td>${m.hard ? '⚠ ' + m.hard : '✅ 0'}</td><td>${Utils.fmt(m.gardenSun)} ч</td><td>${Utils.fmt(m.ghSun)} ч</td><td><button class="v-load" data-v="${encodedName}">Загрузить</button><button class="v-del" data-v="${encodedName}">🗑</button></td></tr>`;
});
html += '</tbody></table>';
if (!names.length) html = '<p style="margin-top:10px;">Сохранённых вариантов пока нет. Расставьте объекты и нажмите «💾 Сохранить текущую как вариант».</p>' + html;
DOM.variantsWrap.innerHTML = html;
DOM.variantsWrap.querySelectorAll('.v-load').forEach(b => b.onclick = () => loadVariant(decodeURIComponent(b.dataset.v)));
DOM.variantsWrap.querySelectorAll('.v-del').forEach(b => b.onclick = () => deleteVariant(decodeURIComponent(b.dataset.v)));
DOM.variantsModal.style.display = 'block';
document.body.style.overflow = 'hidden';
}
function saveCurrentVariant() {
const variants = loadVariants();
const def = 'Вариант ' + (Object.keys(variants).length + 1);
const name = prompt('Название варианта:', def);
if (!name) return;
variants[name] = snapshotFullScene();   // v4: полный снимок сцены, состава объектов, трасс, инфраструктуры и статусов
saveVariants(variants);
toast('💾 Сохранено как «' + name + '»');
openVariantsModal();
}
function loadVariant(name) {
const variants = loadVariants();
const snapshot = variants[name];
if (!snapshot) return;
pushUndo(snapshotFullScene());
applyFullSceneSnapshot(snapshot);        // поддерживает и старые v2.1-массивы
DOM.variantsModal.style.display = 'none';
document.body.style.overflow = 'auto';
toast('📂 Загружен «' + name + '»');
}
function deleteVariant(name) {
if (!confirm('Удалить вариант «' + name + '»?')) return;
const variants = loadVariants();
delete variants[name];
saveVariants(variants);
openVariantsModal();
}
// ═══════════════════════════════════════════════════════════════
// СТАТУСЫ ДАННЫХ + ПОЛНЫЙ JSON + ЛОКАЛЬНЫЕ РЕЗЕРВНЫЕ КОПИИ
// ═══════════════════════════════════════════════════════════════
function escapeHtml(value) {
return String(value == null ? '' : value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[ch]);
}
function statusRecords() {
const records = [];
PROJECT_FACTS.forEach(item => records.push({ section: 'Исходные данные', id: item.id, label: item.label, target: item }));
const infraLabels = { powerPole: 'Столб и электрощит', entrance: 'Въезд и калитка', rainCollector: 'Резерв накопления дождевой воды' };
Object.keys(CONFIG.infrastructure).forEach(id => records.push({ section: 'Инфраструктура', id, label: infraLabels[id] || id, target: CONFIG.infrastructure[id] }));
CONFIG.objects.forEach(item => records.push({ section: 'Объекты', id: item.id, label: item.label, target: item }));
CONFIG.utilities.forEach((item, i) => records.push({ section: 'Коммуникации', id: String(i), label: `${item.icon} ${item.name}`, target: item }));
return records;
}
function renderProjectStatuses() {
const records = statusRecords();
const counts = {};
Object.keys(STATUS_DEFS).forEach(k => counts[k] = 0);
records.forEach(r => counts[normalizeStatus(r.target.status)]++);
DOM.projectStatusSummary.innerHTML = `<div style="display:flex; gap:7px; flex-wrap:wrap; margin:10px 0;">${Object.keys(STATUS_DEFS).map(k => `${statusChip(k)} <span style="font-size:12px; color:#555; margin-right:5px;">${counts[k]}</span>`).join('')}</div>`;
DOM.projectStatusTbody.innerHTML = records.map((r, i) => `<tr><td>${escapeHtml(r.section)}</td><td><strong>${escapeHtml(r.label)}</strong></td><td><select data-status-index="${i}">${statusOptions(r.target.status)}</select></td><td class="norm-detail">${escapeHtml(r.target.note || '—')}</td></tr>`).join('');
DOM.projectStatusTbody.querySelectorAll('[data-status-index]').forEach(select => {
select.addEventListener('change', () => {
const record = records[Number(select.dataset.statusIndex)]; if (!record) return;
pushUndo(snapshotFullScene());
record.target.status = normalizeStatus(select.value, record.target.status);
saveLayout();
renderProjectStatuses();
toast('🏷 Статус обновлён: ' + STATUS_DEFS[record.target.status].label);
});
});
}
function projectSettingsSnapshot() {
return { month: Number(DOM.monthSlider.value), hour: Number(DOM.hourSlider.value), view: DOM.viewSelect.value };
}
function buildProjectBackup(reason) {
return {
format: BACKUP_FORMAT,
schemaVersion: BACKUP_SCHEMA,
appVersion: APP_VERSION,
exportedAt: new Date().toISOString(),
reason: reason || 'Ручной экспорт',
project: { title: 'Проект Берн', cadastral: '50:16:0202016:428', address: 'Московская обл., г.о. Черноголовка, ул. Рассветная, уч. 7' },
scene: snapshotFullScene(),
variants: plainClone(loadVariants()),
settings: projectSettingsSnapshot()
};
}
function validateProjectBackup(data) {
if (!data || data.format !== BACKUP_FORMAT) throw new Error('Это не файл полного проекта «Берн».');
if (!Number.isInteger(data.schemaVersion) || data.schemaVersion < 1 || data.schemaVersion > BACKUP_SCHEMA) throw new Error('Версия файла пока не поддерживается.');
if (!data.scene || !Array.isArray(data.scene.objects)) throw new Error('В файле нет сцены и списка объектов.');
if (data.scene.objects.length < 1 || data.scene.objects.length > 200) throw new Error('Некорректное количество объектов.');
const ids = new Set();
data.scene.objects.forEach(o => {
if (!o || typeof o.id !== 'string' || !o.id || typeof o.type !== 'string') throw new Error('Повреждена запись объекта.');
if (ids.has(o.id)) throw new Error('В файле повторяется ID объекта: ' + o.id);
ids.add(o.id);
if (![o.x, o.z].every(Number.isFinite)) throw new Error('Некорректные координаты объекта: ' + o.id);
if (o.radius !== undefined && (!Number.isFinite(o.radius) || o.radius <= 0 || o.radius > 50)) throw new Error('Некорректный радиус объекта: ' + o.id);
if (o.radius === undefined && (![o.w, o.d].every(Number.isFinite) || o.w <= 0 || o.d <= 0 || o.w > 100 || o.d > 100)) throw new Error('Некорректные размеры объекта: ' + o.id);
});
['house','bath','shed','garden','greenhouse','playground','firepit','car','septic','well'].forEach(id => { if (!ids.has(id)) throw new Error('В файле отсутствует основной объект: ' + id); });
if (data.scene.utilities !== undefined && !Array.isArray(data.scene.utilities)) throw new Error('Повреждён список коммуникаций.');
if (Array.isArray(data.scene.utilities)) data.scene.utilities.forEach(u => {
if (!u || typeof u.name !== 'string' || !Array.isArray(u.route) || u.route.length < 2) throw new Error('Повреждена трасса коммуникаций.');
u.route.forEach(a => { if (!a || (!a.obj && !a.infrastructure && ![a.x, a.z].every(Number.isFinite))) throw new Error('Некорректная точка трассы: ' + u.name); });
});
if (data.variants !== undefined && (!data.variants || typeof data.variants !== 'object' || Array.isArray(data.variants) || Object.keys(data.variants).length > 100)) throw new Error('Повреждён список вариантов.');
return data;
}
function downloadJson(data, filename) {
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function backupFilename(prefix, iso) {
const stamp = String(iso || new Date().toISOString()).replace(/[:.]/g, '-');
return `${prefix || 'Проект_Берн'}_${stamp}.json`;
}
function loadLocalBackups() {
try { const list = JSON.parse(localStorage.getItem(BACKUPS_KEY)); return Array.isArray(list) ? list : []; }
catch (e) { return []; }
}
function saveLocalBackups(list) {
if(BernV6.readOnly)throw Error("Review: локальные сохранения защищены, используйте JSON");
localStorage.setItem(BACKUPS_KEY, JSON.stringify(list.slice(0, BACKUP_LIMIT)));
}
function createLocalBackup(reason, silent) {
try {
const payload = buildProjectBackup(reason || 'Ручная копия');
const list = loadLocalBackups();
list.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, createdAt: payload.exportedAt, reason: payload.reason, payload });
saveLocalBackups(list);
if (!silent) toast('🛟 Локальная копия создана');
if (DOM.projectDataModal.style.display === 'block') renderBackupList();
return true;
} catch (e) { console.error('Не удалось создать резервную копию:', e); if (!silent) alert('Не удалось создать копию: ' + e.message); return false; }
}
function applyProjectSettings(settings) {
if (!settings) return;
if (Number.isFinite(settings.month) && settings.month >= 1 && settings.month <= 12) { DOM.monthSlider.value = settings.month; DOM.monthSlider.dispatchEvent(new Event('input')); }
if (Number.isFinite(settings.hour) && settings.hour >= 0 && settings.hour <= 24) { DOM.hourSlider.value = settings.hour; DOM.hourSlider.dispatchEvent(new Event('input')); }
if (['default','top','night','gate'].includes(settings.view)) { DOM.viewSelect.value = settings.view; DOM.viewSelect.dispatchEvent(new Event('change')); }
}
function applyProjectBackup(data) {
validateProjectBackup(data);
applyFullSceneSnapshot(data.scene);
saveVariants(data.variants || {});
applyProjectSettings(data.settings);
saveLayout();
history.undo = []; history.redo = []; updateHistoryButtons();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
if (solarOn) { buildSolarPanels(); showSolarInfo(); }
renderProjectStatuses();
Utils.markDirty(); renderer.shadowMap.needsUpdate = true;
}
function renderBackupList() {
const list = loadLocalBackups();
if (!list.length) { DOM.backupList.innerHTML = '<div class="backup-empty">Локальных копий пока нет. Они автоматически появятся перед импортом, восстановлением или сбросом.</div>'; return; }
DOM.backupList.innerHTML = `<div style="font-weight:700; margin-top:12px;">Локальные копии (${list.length}/${BACKUP_LIMIT})</div>` + list.map(b => `<div class="backup-row"><div><strong>${escapeHtml(b.reason || 'Копия')}</strong><br><span style="color:#777;">${escapeHtml(new Date(b.createdAt).toLocaleString('ru-RU'))}</span></div><div class="backup-actions"><button data-backup-restore="${escapeHtml(b.id)}">Восстановить</button><button data-backup-download="${escapeHtml(b.id)}">JSON</button><button class="danger" data-backup-delete="${escapeHtml(b.id)}">Удалить</button></div></div>`).join('');
DOM.backupList.querySelectorAll('[data-backup-restore]').forEach(btn => btn.onclick = () => {
const selected = loadLocalBackups().find(b => b.id === btn.dataset.backupRestore); if (!selected) return;
if (!confirm('Восстановить эту копию? Текущее состояние сначала будет сохранено автоматически.')) return;
if (!createLocalBackup('Перед восстановлением', true)) { alert('Восстановление отменено: не удалось создать страховочную копию текущего состояния.'); return; }
try { applyProjectBackup(selected.payload); toast('✅ Резервная копия восстановлена', 3500); renderBackupList(); }
catch (e) { alert('Не удалось восстановить копию: ' + e.message); }
});
DOM.backupList.querySelectorAll('[data-backup-download]').forEach(btn => btn.onclick = () => {
const selected = loadLocalBackups().find(b => b.id === btn.dataset.backupDownload); if (selected) downloadJson(selected.payload, backupFilename('Проект_Берн_копия', selected.createdAt));
});
DOM.backupList.querySelectorAll('[data-backup-delete]').forEach(btn => btn.onclick = () => {
if (!confirm('Удалить эту локальную копию?')) return;
saveLocalBackups(loadLocalBackups().filter(b => b.id !== btn.dataset.backupDelete)); renderBackupList();
});
}
function openProjectDataModal() {
renderProjectStatuses(); renderBackupList();
DOM.projectDataModal.style.display = 'block'; document.body.style.overflow = 'hidden';
}
// ═══════════════════════════════════════════════════════════════
// 💰 СМЕТА — считается автоматически из текущей планировки
// Цены ориентировочные (МО, 2026). Меняй под своих подрядчиков.
// ═══════════════════════════════════════════════════════════════
const SMETA_PRICES = {
house:      { perM2: 80000, floors: 2 },          // дом, ₽/м² общей площади
bath:       { unit: 950000, name: 'Баня 6×6 (под ключ)' },
shed:       { unit: 280000, name: 'Хозблок 6×4' },
garage:     { unit: 480000, name: 'Гараж 6×4' },
gazebo:     { unit: 130000, name: 'Беседка 4×4' },
grill:      { unit: 65000,  name: 'Мангальная зона' },
pool:       { unit: 380000, name: 'Бассейн 4×6 (каркас + монтаж)' },
fruit_tree: { unit: 6000,   name: 'Плодовое дерево (посадка)' },
playground: { unit: 130000, name: 'Детская площадка' },
firepit:    { unit: 45000,  name: 'Зона мангала' },
greenhouse: { unit: 95000,  name: 'Теплица арочная 3×6' },
garden:     { unit: 60000,  name: 'Огород (грядки)' },
septic:     { unit: 190000, name: 'ЛОС / септик — бюджетный резерв, тип и объём не выбраны' },
well:       { unit: 160000, name: 'Скважина — бюджетный резерв, глубина уточняется по бурению' },
fence:      { perM: 4500,   name: 'Забор (профнастил, под ключ)' },
gate:       { unit: 95000,  name: 'Откатные ворота' },
wicket:     { unit: 28000,  name: 'Калитка' },
paving:     { perM2: 2600,  name: 'Дорожки и площадки (плитка)' },
utilWater:  { perM: 380 }, utilSewer: { perM: 460 }, utilElec: { perM: 320 }, utilGas: { perM: 650 },
utilConnect:{ unit: 220000, name: 'Подключения и вводные устройства' },
earthHouse: { perM2: 900,   name: 'Земляные под фундамент дома' },
earthPool:  { unit: 90000,  name: 'Котлован бассейна' }
};
function fmtMoney(v) { return Math.round(v).toLocaleString('ru-RU'); }
function buildSmeta() {
const P = SMETA_PRICES, rows = [];
const add = (name, qty, unit, price) => rows.push({ name, qty, unit, price, total: qty * price });
const o = id => CONFIG.objects.find(x => x.id === id);
// Дом
const house = o('house');
if (house) { const area = house.w * house.d * P.house.floors; add(`Дом «Берн» — ${area} м² (${P.house.floors} эт.)`, area, 'м²', P.house.perM2); }
// Забор: периметр минус ворота (4 м) и калитка (1 м)
const fenceLen = 2 * (CONFIG.plot.w + CONFIG.plot.d) - 5;
add(P.fence.name, fenceLen, 'пог. м', P.fence.perM);
add(P.gate.name, 1, 'шт', P.gate.unit);
add(P.wicket.name, 1, 'шт', P.wicket.unit);
// Дорожки и площадки — из фактической схемы маршрутов v1 + автомобильный узел.
const pedestrianArea = LAYOUT_PATHS.reduce((sum, seg) => sum + Math.hypot(seg.b[0]-seg.a[0], seg.b[1]-seg.a[1]) * seg.width, 0);
const vehicleArea = LAYOUT_ZONES.driveway.w * LAYOUT_ZONES.driveway.d + LAYOUT_ZONES.parking.w * LAYOUT_ZONES.parking.d;
const serviceArea = LAYOUT_ZONES.shedServicePad.w * LAYOUT_ZONES.shedServicePad.d;
add(P.paving.name, pedestrianArea + vehicleArea + serviceArea, 'м²', P.paving.perM2);
// Постройки и объекты каталога (каждый присутствующий)
CONFIG.objects.forEach(obj => {
if (obj.type === 'house' || obj.type === 'car') return;
const spec = P[obj.type];
if (spec && spec.unit) add(spec.name, 1, 'шт', spec.unit);
});
// Коммуникации — по фактическим длинам трасс
let wLen = 0, sLen = 0, eLen = 0, gLen = 0;
CONFIG.utilities.forEach(u => {
const len = utilityLength(u);
if (u.icon === '💧') wLen += len;
else if (u.icon === '🚽') sLen += len;
else if (u.icon === '⚡' || u.icon === '💡') eLen += len;
else if (u.icon === '🔥') gLen += len;
});
add('Водопровод (ПНД)', wLen, 'пог. м', P.utilWater.perM);
add('Канализация (ПВХ)', sLen, 'пог. м', P.utilSewer.perM);
add('Электричество (гофра)', eLen, 'пог. м', P.utilElec.perM);
add('Газ (ПЭ)', gLen, 'пог. м', P.utilGas.perM);
add(P.utilConnect.name, 1, 'шт', P.utilConnect.unit);
// Земляные работы
if (house) add(P.earthHouse.name, house.w * house.d, 'м²', P.earthHouse.perM2);
if (o('pool')) add(P.earthPool.name, 1, 'шт', P.earthPool.unit);
// Дренаж и ливнёвка — по фактическим длинам трасс (колодцы включены в цену)
let dLen = 0, rLen = 0;
CONFIG.utilities.forEach(u => {
const len = utilityLength(u);
if (u.color === 0x0097a7) dLen += len;
else if (u.color === 0x00bcd4) rLen += len;
});
add('Резерв дренажа дома (если потребуется)', dLen, 'пог. м', 950);
add('Ливнёвка / сбор дождевой воды', rLen, 'пог. м', 700);
return rows;
}
function buildSmetaHTML() {
const rows = buildSmeta();
let total = 0;
let html = '<table id="smeta-table"><thead><tr><th>Статья</th><th>Кол-во</th><th>Ед.</th><th>Цена, ₽</th><th>Сумма, ₽</th></tr></thead><tbody>';
rows.forEach(r => { total += r.total; html += `<tr><td>${r.name}</td><td>${Utils.fmt(r.qty)}</td><td>${r.unit}</td><td>${fmtMoney(r.price)}</td><td>${fmtMoney(r.total)}</td></tr>`; });
html += `</tbody><tfoot><tr><td colspan="4"><b>ИТОГО (ориентировочно)</b></td><td><b>${fmtMoney(total)} ₽</b></td></tr></tfoot></table>`;
html += `<p style="font-size:11px; color:#777; margin-top:12px;">* Цены ориентировочные (Московская область, 2026) заданы в блоке <code>SMETA_PRICES</code> — меняй под своих подрядчиков. Смета пересчитывается автоматически при изменении планировки (в т.ч. объектов каталога).</p>`;
return html;
}
function openSmetaModal() {
document.getElementById('smeta-body').innerHTML = buildSmetaHTML();
document.getElementById('smeta-modal').style.display = 'block';
document.body.style.overflow = 'hidden';
}
// ═══════════════════════════════════════════════════════════════
// УМНАЯ АВТОРАССТАНОВКА (SETBACK пополнен типами каталога)
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// 📐 2D-ЧЕРТЁЖ ДЛЯ СТРОИТЕЛЕЙ (вид сверху, по акту выноса МСК-50)
// ═══════════════════════════════════════════════════════════════
const DRAW_COLORS = {
house:{fill:'rgba(255,170,0,0.25)',stroke:'#c07000'}, bath:{fill:'rgba(230,126,34,0.20)',stroke:'#d35400'},
shed:{fill:'rgba(127,140,141,0.25)',stroke:'#7f8c8d'}, garden:{fill:'rgba(46,204,113,0.20)',stroke:'#27ae60'},
greenhouse:{fill:'rgba(136,204,255,0.30)',stroke:'#3498db'}, playground:{fill:'rgba(241,196,15,0.25)',stroke:'#f39c12'},
firepit:{fill:'rgba(231,76,60,0.20)',stroke:'#c0392b'}, car:{fill:'rgba(192,57,43,0.20)',stroke:'#c0392b'},
canopy:{fill:'rgba(144,164,174,0.18)',stroke:'#607d8b'},
septic:{fill:'rgba(93,109,126,0.25)',stroke:'#5d6d7e'}, well:{fill:'rgba(52,152,219,0.25)',stroke:'#2980b9'},
gazebo:{fill:'rgba(156,122,84,0.25)',stroke:'#9c7a54'}, pool:{fill:'rgba(58,166,217,0.30)',stroke:'#3aa6d9'},
garage:{fill:'rgba(170,180,187,0.30)',stroke:'#78909c'}, fruit_tree:{fill:'rgba(90,158,75,0.30)',stroke:'#5a9e4b'},
grill:{fill:'rgba(55,71,79,0.25)',stroke:'#37474f'}
};
function footprintCorners(o) {
return o.radius !== undefined ? null : Norms.bodyCorners(o);
}
function terraceFootprintCorners(o) {
return Norms.terraceCorners(o);
}
function _arrowHead(ctx, x, y, ang) {
ctx.beginPath(); ctx.moveTo(x, y);
ctx.lineTo(x - 7*Math.cos(ang-0.45), y - 7*Math.sin(ang-0.45));
ctx.lineTo(x - 7*Math.cos(ang+0.45), y - 7*Math.sin(ang+0.45));
ctx.closePath(); ctx.fill();
}
function _dimH(ctx, x1, x2, y, label) {
ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
_arrowHead(ctx, x2, y, 0); _arrowHead(ctx, x1, y, Math.PI);
ctx.beginPath(); ctx.moveTo(x1, y-5); ctx.lineTo(x1, y+5); ctx.moveTo(x2, y-5); ctx.lineTo(x2, y+5); ctx.stroke();
ctx.font = 'bold 11px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText(label, (x1+x2)/2, y - 6);
}
function _dimV(ctx, y1, y2, x, label) {
ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
_arrowHead(ctx, x, y2, Math.PI/2); _arrowHead(ctx, x, y1, -Math.PI/2);
ctx.beginPath(); ctx.moveTo(x-5, y1); ctx.lineTo(x+5, y1); ctx.moveTo(x-5, y2); ctx.lineTo(x+5, y2); ctx.stroke();
ctx.save(); ctx.translate(x - 6, (y1+y2)/2); ctx.rotate(-Math.PI/2);
ctx.font = 'bold 11px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore();
}
function drawObject2D(ctx, o, X, Z, S) {
const col = DRAW_COLORS[o.type] || { fill:'rgba(200,200,200,0.3)', stroke:'#999' };
const corners = footprintCorners(o);
ctx.save();
if (corners) {
ctx.beginPath();
corners.forEach((p, i) => { const px = X(p.x), pz = Z(p.z); if (i===0) ctx.moveTo(px,pz); else ctx.lineTo(px,pz); });
ctx.closePath(); ctx.fillStyle = col.fill; ctx.fill();
ctx.strokeStyle = col.stroke; ctx.lineWidth = 1.5; ctx.stroke();
const terrace = terraceFootprintCorners(o);
if (terrace) {
ctx.beginPath();
terrace.forEach((p, i) => { const px = X(p.x), pz = Z(p.z); if (i===0) ctx.moveTo(px,pz); else ctx.lineTo(px,pz); });
ctx.closePath(); ctx.fillStyle = 'rgba(121,85,72,0.16)'; ctx.fill();
ctx.strokeStyle = '#795548'; ctx.setLineDash([5,3]); ctx.stroke(); ctx.setLineDash([]);
}
} else {
ctx.beginPath(); ctx.arc(X(o.x), Z(o.z), (o.radius||0.5)*S, 0, Math.PI*2);
ctx.fillStyle = col.fill; ctx.fill(); ctx.strokeStyle = col.stroke; ctx.lineWidth = 1.5; ctx.stroke();
}
if (o.id === 'shed' && o.entranceSide === 'south') {
const a = (o.rot || 0) * Math.PI/180, cc = Math.cos(a), ss = Math.sin(a);
const hwDoor = (o.entranceWidth || 1.2) / 2, lz = -o.d/2;
const p1 = { x:o.x + (-hwDoor)*cc + lz*ss, z:o.z - (-hwDoor)*ss + lz*cc };
const p2 = { x:o.x + ( hwDoor)*cc + lz*ss, z:o.z - ( hwDoor)*ss + lz*cc };
ctx.strokeStyle = '#2f2f2f'; ctx.lineWidth = 4;
ctx.beginPath(); ctx.moveTo(X(p1.x), Z(p1.z)); ctx.lineTo(X(p2.x), Z(p2.z)); ctx.stroke();
}
if (o.id === 'bath' && o.entranceSide === 'north') {
const a = (o.rot || 0) * Math.PI/180, cc = Math.cos(a), ss = Math.sin(a);
const hwDoor = (o.entranceWidth || 1.1) / 2, lz = o.d/2;
const p1 = { x:o.x + (-hwDoor)*cc + lz*ss, z:o.z - (-hwDoor)*ss + lz*cc };
const p2 = { x:o.x + ( hwDoor)*cc + lz*ss, z:o.z - ( hwDoor)*ss + lz*cc };
ctx.strokeStyle = '#3b2a22'; ctx.lineWidth = 4;
ctx.beginPath(); ctx.moveTo(X(p1.x), Z(p1.z)); ctx.lineTo(X(p2.x), Z(p2.z)); ctx.stroke();
}
const showName = !BernV6.drawingLayers || BernV6.drawingLayers[['well','septic'].includes(o.id)?'engineeringLabels':'objectLabels'];
if(showName) {
const name = o.label.replace(/^[^\s]+\s/, '');
ctx.fillStyle = '#222'; ctx.font = 'bold 10px Segoe UI, Arial'; ctx.textAlign = 'center';
ctx.fillText(name, X(o.x), Z(o.z) - 3);
const dims = o.radius !== undefined ? 'Ø' + Utils.fmt(o.radius*2) : (o.id === 'bath' && o.terrace ? Utils.fmt(o.w) + '×' + Utils.fmt(o.d) + ' + терраса ' + Utils.fmt(o.terrace.w) + '×' + Utils.fmt(o.terrace.d) : Utils.fmt(o.w) + '×' + Utils.fmt(o.d));
ctx.fillStyle = '#777'; ctx.font = '9px Segoe UI, Arial';
ctx.fillText(dims + ' м', X(o.x), Z(o.z) + 9);
}
ctx.restore();
}
function drawPerimeterDims(ctx, X, Z) {
const W = CONFIG.plot.w, D = CONFIG.plot.d;
ctx.strokeStyle = '#333'; ctx.fillStyle = '#333'; ctx.lineWidth = 1;
_dimH(ctx, X(0), X(W), Z(0) + 30, W + ' м');
_dimV(ctx, Z(0), Z(D), X(0) - 26, D + ' м');
}
function drawHouseSetbacks(ctx, X, Z) {
const h = CONFIG.objects.find(o => o.id === 'house'); if (!h) return;
const b = Norms.bounds(h), W = CONFIG.plot.w, D = CONFIG.plot.d;
ctx.strokeStyle = '#e74c3c'; ctx.fillStyle = '#e74c3c'; ctx.lineWidth = 1;
_dimV(ctx, Z(0), Z(b.minZ), X(b.minX) - 14, Utils.fmt(b.minZ));
_dimV(ctx, Z(b.maxZ), Z(D), X(b.maxX) + 14, Utils.fmt(D - b.maxZ));
_dimH(ctx, X(0), X(b.minX), Z(b.minZ) + 14, Utils.fmt(b.minX));
_dimH(ctx, X(b.maxX), X(W), Z(b.maxZ) - 14, Utils.fmt(W - b.maxX));
}
function drawBoundaryMarks(ctx, X, Z) {
const W = CONFIG.plot.w, D = CONFIG.plot.d;
const marks = [
// Локальная привязка по акту: М4=(0,0), М3=(W,0), М2=(W,D), М1=(0,D).
{ n:4, mx:0, mz:0, dx:-1, dy:1 }, { n:3, mx:W, mz:0, dx:1, dy:1 },
{ n:2, mx:W, mz:D, dx:1, dy:-1 }, { n:1, mx:0, mz:D, dx:-1, dy:-1 }
];
marks.forEach(m => {
const px = X(m.mx), pz = Z(m.mz);
ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(px, pz, 4.5, 0, Math.PI*2); ctx.fill();
ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, pz, 8, 0, Math.PI*2); ctx.stroke();
ctx.fillStyle = '#c0392b'; ctx.font = 'bold 11px Segoe UI, Arial';
ctx.textAlign = m.dx < 0 ? 'right' : 'left';
ctx.fillText('Знак ' + m.n, px + m.dx*13, pz + m.dy*13 + 4);
});
const house = CONFIG.objects.find(o => o.id === 'house');
if (house) {
const corners = footprintCorners(house) || [{ x: house.x, z: house.z }];
marks.forEach(m => {
const sx = X(m.mx), sz = Z(m.mz);
let best = corners[0], bd = Infinity;
corners.forEach(c => { const dd = Math.hypot(c.x - m.mx, c.z - m.mz); if (dd < bd) { bd = dd; best = c; } });
ctx.strokeStyle = 'rgba(192,57,43,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([5,3]);
ctx.beginPath(); ctx.moveTo(sx, sz); ctx.lineTo(X(best.x), Z(best.z)); ctx.stroke();
ctx.setLineDash([]);
ctx.fillStyle = '#c0392b'; ctx.font = '9px Segoe UI, Arial'; ctx.textAlign = 'center';
ctx.fillText(bd.toFixed(2) + ' м', (sx + X(best.x))/2, (sz + Z(best.z))/2 - 3);
});
}
}
function drawNorthArrow(ctx, cx, cy) {
const a = CONFIG.gps.angle * Math.PI/180;
const nx = Math.sin(a), ny = -Math.cos(a);
const len = 24;
ctx.strokeStyle = '#1a2a3a'; ctx.fillStyle = '#1a2a3a'; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(cx - nx*len*0.4, cy - ny*len*0.4); ctx.lineTo(cx + nx*len, cy + ny*len); ctx.stroke();
const ang = Math.atan2(ny, nx), hx = cx + nx*len, hy = cy + ny*len;
ctx.beginPath(); ctx.moveTo(hx, hy);
ctx.lineTo(hx - 8*Math.cos(ang-0.4), hy - 8*Math.sin(ang-0.4));
ctx.lineTo(hx - 8*Math.cos(ang+0.4), hy - 8*Math.sin(ang+0.4));
ctx.closePath(); ctx.fill();
ctx.font = 'bold 13px Segoe UI, Arial'; ctx.textAlign = 'center';
ctx.fillText('С', hx + nx*11, hy + ny*11 + 4);
}
function drawTitleBlock(ctx, X, Z) {
const y0 = Z(0) + 52;
ctx.textAlign = 'left';
ctx.fillStyle = '#1a2a3a'; ctx.font = 'bold 10px Segoe UI, Arial';
ctx.fillText('Межевые знаки (МСК-50, зона 2) — по акту выноса границ:', X(0), y0);
ctx.font = '9px Segoe UI, Arial'; ctx.fillStyle = '#555';
['Знак 1:  X 500473,82   Y 2245973,10', 'Знак 2:  X 500494,85   Y 2245986,62',
 'Знак 3:  X 500473,22   Y 2246020,27', 'Знак 4:  X 500452,19   Y 2246006,75']
.forEach((r, i) => ctx.fillText(r, X(0) + (i%2)*190, y0 + 14 + Math.floor(i/2)*12));
const sbY = y0 + 46, sbLen = 5*15;
ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(X(0), sbY); ctx.lineTo(X(0) + sbLen, sbY); ctx.stroke();
ctx.beginPath(); ctx.moveTo(X(0), sbY-4); ctx.lineTo(X(0), sbY+4);
ctx.moveTo(X(0)+sbLen, sbY-4); ctx.lineTo(X(0)+sbLen, sbY+4); ctx.stroke();
ctx.font = '10px Segoe UI, Arial'; ctx.fillStyle = '#333';
ctx.fillText('5 м', X(0) + sbLen/2 - 8, sbY - 6);
ctx.fillStyle = '#888';
ctx.fillText('Улица проходит по короткой стороне 25,001 м (z=0); глубина участка 40,002 м. Все размеры в метрах.', X(0), sbY + 18);
}
function drawPlan2D() {
if(BernV6.drawPlan)return BernV6.drawPlan();
const canvas = document.getElementById('drawing-canvas'); if (!canvas) return;
const dpr = window.devicePixelRatio || 1;
const S = 15, W = CONFIG.plot.w, D = CONFIG.plot.d;
const ML = 95, MT = 70, MR = 85, MB = 130;
const cssW = ML + W*S + MR, cssH = MT + D*S + MB;
canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
canvas.width = Math.round(cssW*dpr); canvas.height = Math.round(cssH*dpr);
const ctx = canvas.getContext('2d');
ctx.setTransform(dpr,0,0,dpr,0,0);
ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,cssW,cssH);
const X = m => ML + m*S, Z = m => MT + (D - m)*S;
ctx.fillStyle = '#1a2a3a'; ctx.font = 'bold 16px Segoe UI, Arial'; ctx.textAlign = 'left';
ctx.fillText('2D-чертёж участка • Проект «Берн»', ML, 26);
ctx.font = '11px Segoe UI, Arial'; ctx.fillStyle = '#666';
ctx.fillText('Кадастровый 50:16:0202016:428 • Участок 25×40 м (1000 м²) • ' + new Date().toLocaleDateString('ru-RU'), ML, 44);
ctx.font = 'bold 10px Segoe UI, Arial'; ctx.fillStyle = '#2e7d32';
ctx.fillText('MASTER v1 • функциональная планировка зафиксирована • инженерные точки и отметки остаются предварительными', ML, 60);
ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
ctx.strokeRect(X(0), Z(D), W*S, D*S);
const lawn2d = LAYOUT_ZONES.lawn;
ctx.fillStyle = 'rgba(143,212,125,0.16)'; ctx.strokeStyle = 'rgba(46,125,50,0.65)'; ctx.lineWidth = 1; ctx.setLineDash([6,4]);
ctx.fillRect(X(lawn2d.x-lawn2d.w/2), Z(lawn2d.z+lawn2d.d/2), lawn2d.w*S, lawn2d.d*S);
ctx.strokeRect(X(lawn2d.x-lawn2d.w/2), Z(lawn2d.z+lawn2d.d/2), lawn2d.w*S, lawn2d.d*S); ctx.setLineDash([]);
ctx.fillStyle = '#2e7d32'; ctx.font = 'bold 9px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText('Газон / свободная зона', X(lawn2d.x), Z(lawn2d.z));
const dz = LAYOUT_ZONES.driveway, pz = LAYOUT_ZONES.parking;
ctx.fillStyle = 'rgba(117,125,130,0.22)'; ctx.strokeStyle = '#697277'; ctx.lineWidth = 1; ctx.setLineDash([5,3]);
ctx.fillRect(X(dz.x-dz.w/2), Z(dz.z+dz.d/2), dz.w*S, dz.d*S);
ctx.fillRect(X(pz.x-pz.w/2), Z(pz.z+pz.d/2), pz.w*S, pz.d*S);
ctx.strokeRect(X(dz.x-dz.w/2), Z(dz.z+dz.d/2), dz.w*S, dz.d*S);
ctx.strokeRect(X(pz.x-pz.w/2), Z(pz.z+pz.d/2), pz.w*S, pz.d*S); ctx.setLineDash([]);
ctx.fillStyle = '#596267'; ctx.font = 'bold 8px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText('Въезд → навес', X(dz.x), Z(1.5));
const sp = LAYOUT_ZONES.shedServicePad;
ctx.fillStyle = 'rgba(173,141,103,0.22)'; ctx.strokeStyle = '#8b6f4e'; ctx.lineWidth = 1; ctx.setLineDash([4,3]);
ctx.fillRect(X(sp.x-sp.w/2), Z(sp.z+sp.d/2), sp.w*S, sp.d*S);
ctx.strokeRect(X(sp.x-sp.w/2), Z(sp.z+sp.d/2), sp.w*S, sp.d*S); ctx.setLineDash([]);
ctx.fillStyle = '#7b5e3b'; ctx.font = 'bold 8px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText('Вход хозблока', X(sp.x), Z(sp.z));
ctx.save();
ctx.strokeStyle = 'rgba(173,141,103,0.85)'; ctx.lineCap = 'round';
LAYOUT_PATHS.forEach(seg => {
  ctx.lineWidth = Math.max(2, seg.width*S);
  ctx.beginPath(); ctx.moveTo(X(seg.a[0]), Z(seg.a[1])); ctx.lineTo(X(seg.b[0]), Z(seg.b[1])); ctx.stroke();
});
ctx.restore();
ctx.fillStyle = '#7b5e3b'; ctx.font = 'bold 8px Segoe UI, Arial'; ctx.textAlign = 'left';
ctx.fillText('Калитка → дом', X(11.95)+5, Z(10));
LANDSCAPE_PLAN.shrubZones.forEach(z => {
  ctx.fillStyle = z.id === 'bath-border' ? 'rgba(139,182,111,0.18)' : 'rgba(78,143,84,0.12)';
  ctx.strokeStyle = z.id === 'bath-border' ? '#6f9b58' : '#4e8f54'; ctx.lineWidth = 1; ctx.setLineDash([4,3]);
  ctx.fillRect(X(z.x-z.w/2), Z(z.z+z.d/2), z.w*S, z.d*S);
  ctx.strokeRect(X(z.x-z.w/2), Z(z.z+z.d/2), z.w*S, z.d*S);
  ctx.setLineDash([]);
});
(LANDSCAPE_PLAN.containers || []).forEach(p => {
  ctx.fillStyle='rgba(141,110,99,0.30)'; ctx.strokeStyle='#6d4c41'; ctx.lineWidth=1;
  ctx.fillRect(X(p.x-p.w/2),Z(p.z+p.d/2),p.w*S,p.d*S); ctx.strokeRect(X(p.x-p.w/2),Z(p.z+p.d/2),p.w*S,p.d*S);
});
(LANDSCAPE_PLAN.screens || []).forEach(s => {
  ctx.fillStyle='rgba(79,139,82,0.18)'; ctx.strokeStyle='#3f7843'; ctx.lineWidth=1.5;
  ctx.fillRect(X(s.x-s.w/2),Z(s.z+s.d/2),Math.max(2,s.w*S),s.d*S); ctx.strokeRect(X(s.x-s.w/2),Z(s.z+s.d/2),Math.max(2,s.w*S),s.d*S);
});
LANDSCAPE_PLAN.trees.forEach(t => {
  ctx.fillStyle = 'rgba(102,168,92,0.22)'; ctx.strokeStyle = '#4b8b46'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.arc(X(t.x), Z(t.z), t.radius*S, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#3d7a39'; ctx.font = 'bold 8px Segoe UI, Arial'; ctx.textAlign='left'; ctx.fillText('🌳 план', X(t.x)+5, Z(t.z)-5);
});
const rc = CONFIG.infrastructure.rainCollector;
ctx.fillStyle = 'rgba(0,188,212,0.28)'; ctx.strokeStyle = '#00838f'; ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(X(rc.x), Z(rc.z), 0.6*S, 0, Math.PI*2); ctx.fill(); ctx.stroke();
ctx.fillStyle = '#006a73'; ctx.font = 'bold 8px Segoe UI, Arial'; ctx.textAlign = 'left'; ctx.fillText('Резерв дождевой воды', X(rc.x)+10, Z(rc.z)-8);
SITE_LIGHT_POINTS.forEach(p => {
  ctx.fillStyle = '#f9a825'; ctx.strokeStyle = '#6d5f00'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(X(p.x), Z(p.z), 3.5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
});
SECURITY_POINTS.forEach(p => {
  ctx.fillStyle = '#7e57c2'; ctx.strokeStyle = '#4527a0'; ctx.lineWidth = 1;
  ctx.fillRect(X(p.x)-3, Z(p.z)-3, 6, 6); ctx.strokeRect(X(p.x)-3, Z(p.z)-3, 6, 6);
});
ctx.fillStyle = '#555'; ctx.font = 'bold 10px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText('УЛ. РАССВЕТНАЯ • ФАСАД 25,001 м', X(W/2), Z(0)+17);
ctx.font = '9px Segoe UI, Arial'; ctx.fillStyle = '#777'; ctx.fillText('Гостевая парковка предполагается снаружи; обочина и режим стоянки требуют проверки', X(W/2), Z(0)+31);
CONFIG.objects.forEach(o => {
  drawObject2D(ctx, o, X, Z, S);
  if (PLANNING_FROZEN_OBJECTS.has(o.id)) {
    const b = Norms.bounds(o);
    ctx.fillStyle = '#2e7d32'; ctx.font = 'bold 9px Segoe UI, Arial'; ctx.textAlign = 'center';
    ctx.fillText('✓', X(b.maxX) - 5, Z(b.maxZ) + 10);
  }
});
drawPerimeterDims(ctx, X, Z);
drawHouseSetbacks(ctx, X, Z);
drawBoundaryMarks(ctx, X, Z);
drawNorthArrow(ctx, X(W) + 42, MT + 30);
drawTitleBlock(ctx, X, Z);
}
function openDrawingModal() {
document.getElementById('v6-facade-sheet')?.remove();
document.getElementById('drawing-canvas').style.display = '';
document.querySelector('#drawing-modal .modal-content').style.maxWidth = '760px';
document.querySelector('#drawing-modal h2').textContent = '📐 2D-чертёж участка для строителей';
document.getElementById('drawing-modal').style.display = 'block';
document.body.style.overflow = 'hidden';
drawPlan2D();
}
function downloadDrawingPNG() {
const facade = document.getElementById('v6-facade-sheet');
const canvas = facade || document.getElementById('drawing-canvas');
const link = document.createElement('a');
link.download = facade ? 'facade_rassvetnaya.png' : 'chertezh_uchastka.png';
link.href = canvas.toDataURL('image/png');
link.click();
}
const PLACE_REGIONS = {
septic:     { x:[2, 3.5],   z:[16, 19] },
well:       { x:[22.5, 23.5], z:[22, 24] },
bath:       { x:[20.5, 21], z:[11, 12] },
shed:       { x:[19, 22],   z:[4, 6]   },
firepit:    { x:[10, 11],   z:[17.5, 18.5] },
greenhouse: { x:[1.5, 3],   z:[7, 10]  },
garden:     { x:[5.5, 8],   z:[4, 7]   },
playground: { x:[13, 15],   z:[12, 14] },
car:        { x:[14, 15],   z:[4, 7]   },
canopy:     { x:[14, 15],   z:[5, 7]   }
};
const DRIVEWAY = { minX: 11.5, maxX: 17.5, minZ: 0, maxZ: 9 };
const DRIVEWAY_SHAPE = { id: '__driveway__', x: (DRIVEWAY.minX+DRIVEWAY.maxX)/2, z: (DRIVEWAY.minZ+DRIVEWAY.maxZ)/2, w: DRIVEWAY.maxX-DRIVEWAY.minX, d: DRIVEWAY.maxZ-DRIVEWAY.minZ, rot: 0 };
function drivewayIntersects(o) { return Norms.dist(o, DRIVEWAY_SHAPE) <= 0; }
const SETBACK = { house: 3, bath: 1, shed: 1, septic: 1, well: 1, garden: 0.5, greenhouse: 0.5, playground: 0.5, firepit: 0.5, car: 0.5, canopy: 0.5, gazebo: 1, garage: 1, grill: 0.5, pool: 1, fruit_tree: 1 };
function isAllowedOverlap(A, B) {
const pair = new Set([A.id, B.id]);
return pair.size === 2 && pair.has('car') && pair.has('canopy');
}
function pairOverlap(A, B) {
if (isAllowedOverlap(A, B)) return false;
const ba = Norms.bounds(A), bb = Norms.bounds(B);
const ox = Math.min(ba.maxX, bb.maxX) - Math.max(ba.minX, bb.minX);
const oz = Math.min(ba.maxZ, bb.maxZ) - Math.max(ba.minZ, bb.minZ);
return (ox > 0 && oz > 0);
}
function rectIntersect(b, r) {
const ox = Math.min(b.maxX, r.maxX) - Math.max(b.minX, r.minX);
const oz = Math.min(b.maxZ, r.maxZ) - Math.max(b.minZ, r.minZ);
return (ox > 0 && oz > 0);
}
function inBounds(o) {
const b = Norms.bounds(o);
const sb = SETBACK[o.type] !== undefined ? SETBACK[o.type] : (SETBACK[o.id] !== undefined ? SETBACK[o.id] : 0.5);
if (!(b.minX >= sb && b.minZ >= sb && b.maxX <= CONFIG.plot.w - sb && b.maxZ <= CONFIG.plot.d - sb)) return false;
// Для жилого дома отдельно учитываем предварительный 5-метровый отступ от уличной границы z=0.
if (o.id === 'house' && b.minZ < 5) return false;
return true;
}
function sunScore(o, at, includeLandscape = false) {
const sampleX = at && Number.isFinite(at.x) ? at.x : o.x;
const sampleZ = at && Number.isFinite(at.z) ? at.z : o.z;
const proxies = ['house','bath','shed','greenhouse']
.filter(id => id !== o.id)
.map(id => {
const q = Norms.obj(id); const b = Norms.bodyBounds(q);
const hgt = id==='house' ? 7 : (id==='greenhouse' ? 2.5 : 4.3);
return { box: new THREE.Box3(new THREE.Vector3(b.minX,0,b.minZ), new THREE.Vector3(b.maxX,hgt,b.maxZ)) };
});
if (includeLandscape) {
  LANDSCAPE_PLAN.trees.forEach(t => proxies.push({ sphere: new THREE.Sphere(new THREE.Vector3(t.x, Math.max(1.7,t.h*0.62), t.z), t.radius*1.05) }));
}
const ang = CONFIG.gps.angle * Math.PI/180, cosA = Math.cos(ang), sinA = Math.sin(ang);
const dir = new THREE.Vector3();
let sun = 0, tot = 0;
const sw = o.radius !== undefined ? o.radius*1.2 : Math.max(0.5, o.w*0.28);
const sd = o.radius !== undefined ? o.radius*1.2 : Math.max(0.5, o.d*0.28);
const samples = [[0,0],[-sw,-sd],[sw,-sd],[-sw,sd],[sw,sd]];
for (let h = 8; h <= 18; h += 1) {
const s = calcSunAt(h, 5);
if (s.altitude <= 1) continue;
dir.set(s.sunEast*cosA + s.sunNorth*sinA, s.sinAlt, -s.sunEast*sinA + s.sunNorth*cosA).normalize();
for (const [dx,dz] of samples) { tot++; if (!isShadowed(sampleX + dx, sampleZ + dz, dir, proxies)) sun++; }
}
return tot ? sun / tot : 0;
}
function juneSunAudit(id, candidates) {
const obj = Norms.obj(id);
return candidates.map(p => ({ x: p[0], z: p[1], score: sunScore(obj, { x: p[0], z: p[1] }) })).sort((a,b) => b.score - a.score);
}
function juneSunGridAudit(id, region, step = 0.5) {
const obj = Norms.obj(id), out = [];
for (let x = region.x[0]; x <= region.x[1] + 0.001; x += step) {
for (let z = region.z[0]; z <= region.z[1] + 0.001; z += step) {
const probe = { ...obj, x: +x.toFixed(2), z: +z.toFixed(2) };
if (!inBounds(probe) || drivewayIntersects(probe)) continue;
let blocked = false;
for (const other of CONFIG.objects) { if (other.id !== id && pairOverlap(probe, other)) { blocked = true; break; } }
if (!blocked) out.push({ x: probe.x, z: probe.z, score: sunScore(obj, { x: probe.x, z: probe.z }) });
}
}
return out.sort((a,b) => b.score - a.score || Math.hypot(a.x-obj.x,a.z-obj.z)-Math.hypot(b.x-obj.x,b.z-obj.z));
}
function layoutFeasible(o, placed) {
if (!inBounds(o)) return false;
const b = Norms.bounds(o);
if (o.id !== 'car' && drivewayIntersects(o)) return false;
for (const p of placed) {
if (p.id === o.id) continue;
if (pairOverlap(o, p)) return false;
for (const r of Norms.rules) {
if (r.kind !== 'dist') continue;
if ((r.a === o.id && r.b === p.id) || (r.b === o.id && r.a === p.id)) {
if (Norms.dist(o, p) < r.min) return false;
}
}
}
return true;
}
function smartAutoPlace() {
const autoPrev = snapshotPositions();
const house = Norms.obj('house');
const order = ['septic','well','bath','shed','firepit','greenhouse','garden','playground','car'];
const placed = CONFIG.objects.filter(o=>isMasterLocked(o.id)||o.id==='house');
let moved = 0;
for (const id of order) {
const o = Norms.obj(id);
if (isMasterLocked(id)) continue;
const reg = PLACE_REGIONS[id] || { x:[2,23], z:[2,38] };
const rots = (o.radius !== undefined) ? [ (o.rot || 0) ] : [0, 90];
const cur = autoPrev.find(p => p.id === id) || { x: o.x, z: o.z, rot: o.rot || 0 };
let best = null, bestScore = -1e9;
for (const rot of rots) {
o.rot = rot;
for (let x = reg.x[0]; x <= reg.x[1] + 0.001; x += 0.5) {
for (let z = reg.z[0]; z <= reg.z[1] + 0.001; z += 0.5) {
o.x = x; o.z = z;
if (!layoutFeasible(o, placed)) continue;
let score = 0;
if (id === 'garden' || id === 'greenhouse') score += sunScore(o) * 10;
score -= Math.hypot(x - cur.x, z - cur.z) * 0.3;
if (rot === cur.rot) score += 0.4;
if (score > bestScore) { bestScore = score; best = { x, z, rot }; }
}
}
}
if (best) {
if (best.x !== o.x || best.z !== o.z || best.rot !== o.rot) moved++;
o.x = best.x; o.z = best.z; o.rot = best.rot;
} else { o.x = cur.x; o.z = cur.z; o.rot = cur.rot; }
placed.push(o);
}
console.log('Авторасстановка: перемещено объектов =', moved);
return autoPrev;
}
function applyAutoFix() {
try {
const autoPrev = smartAutoPlace();
pushUndo(autoPrev);
syncPositionsToScene();
saveLayout();
updateNormBadge();
if (showViolationRings) buildViolationRings();
if (insolationOn) scheduleInsolation();
const hard = Norms.checkAll().filter(c => c.ok === false && c.level === 'mandatory').length;
toast(hard === 0 ? '🤖 По автоматически проверяемым обязательным требованиям нарушений нет' : `🤖 Обязательных нарушений: ${hard}`, 4000);
} catch (e) {
console.error('Ошибка авторасстановки:', e);
alert('⚠ Ошибка авторасстановки: ' + e.message);
}
}
// ═══════════════════════════════════════════════════════════════
// ТЕНЕВОЙ АНАЛИЗ (ИНСОЛЯЦИЯ) — объекты каталога тоже отбрасывают тень
// ═══════════════════════════════════════════════════════════════
let insolationOn = false;
let insolationMesh = null;
let insolationTimer = null;
function calcSunAt(hours, mi) {
const month = solarParams(mi);
const latRad = CONFIG.gps.lat * Math.PI / 180;
const decRad = month.declination;
const solarMinutes = hours * 60 + month.timeOffset;
const hourAngle = (solarMinutes / 4 - 180) * Math.PI / 180;
const sinAlt = Math.sin(latRad)*Math.sin(decRad) + Math.cos(latRad)*Math.cos(decRad)*Math.cos(hourAngle);
const altitude = Math.asin(Math.min(1, Math.max(-1, sinAlt))) * 180 / Math.PI;
const sunEast = -Math.cos(decRad) * Math.sin(hourAngle);
const sunNorth = Math.cos(latRad)*Math.sin(decRad) - Math.sin(latRad)*Math.cos(decRad)*Math.cos(hourAngle);
return { altitude, sunEast, sunNorth, sinAlt };
}
const _solarParamsCache = new Map();
function solarParams(mi) {
if (_solarParamsCache.has(mi)) return _solarParamsCache.get(mi);
const spec = CONFIG.months[mi];
const date = new Date(Date.UTC(CONFIG.gps.referenceYear, spec.month - 1, spec.day));
const start = new Date(Date.UTC(CONFIG.gps.referenceYear, 0, 0));
const dayOfYear = Math.floor((date - start) / 86400000);
// NOAA: уравнение времени и склонение для середины выбранного дня.
const gamma = 2 * Math.PI / 365 * (dayOfYear - 1);
const eqTime = 229.18 * (0.000075 + 0.001868*Math.cos(gamma) - 0.032077*Math.sin(gamma) - 0.014615*Math.cos(2*gamma) - 0.040849*Math.sin(2*gamma));
const declination = 0.006918 - 0.399912*Math.cos(gamma) + 0.070257*Math.sin(gamma) - 0.006758*Math.cos(2*gamma) + 0.000907*Math.sin(2*gamma) - 0.002697*Math.cos(3*gamma) + 0.00148*Math.sin(3*gamma);
const timeOffset = eqTime + 4 * CONFIG.gps.lng - 60 * CONFIG.gps.timezone;
const latRad = CONFIG.gps.lat * Math.PI / 180;
const zenith = 90.833 * Math.PI / 180; // стандартная рефракция и радиус диска Солнца
const cosH = (Math.cos(zenith) / (Math.cos(latRad)*Math.cos(declination))) - Math.tan(latRad)*Math.tan(declination);
const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;
const solarNoon = (720 - timeOffset) / 60;
const result = { declination, eqTime, timeOffset, solarNoon, sunrise: solarNoon - hourAngle/15, sunset: solarNoon + hourAngle/15 };
_solarParamsCache.set(mi, result);
return result;
}
function SOLID_IDS() {
return ['house','bath','shed','greenhouse'].concat(CAT.items().filter(o => (CAT_HEIGHT[o.type] || 0) > 0).map(o => o.id));
}
function buildOccluders() {
const list = [];
const heights = { house: 7.0, bath: 4.3, shed: 4.2, greenhouse: 2.5 };
['house','bath','shed','greenhouse'].forEach(id => {
const b = Norms.bodyBounds(Norms.obj(id));
list.push({ ownId: id, box: new THREE.Box3(new THREE.Vector3(b.minX,0,b.minZ), new THREE.Vector3(b.maxX,heights[id],b.maxZ)) });
});
// ── Каталог: беседка, гараж, мангал — коробки; деревья — кроны-сферы ──
CAT.items().forEach(o => {
if (o.type === 'fruit_tree') { list.push({ ownId: o.id, sphere: new THREE.Sphere(new THREE.Vector3(o.x, 2.3, o.z), (o.radius || 1) * 1.15) }); return; }
const h = CAT_HEIGHT[o.type] || 0; if (h <= 0) return;
const b = Norms.bounds(o);
list.push({ ownId: o.id, box: new THREE.Box3(new THREE.Vector3(b.minX,0,b.minZ), new THREE.Vector3(b.maxX,h,b.maxZ)) });
});
// Внешние деревья пока не моделируем: подтверждённых координат и высот нет.
if(BernV6.fenceOccluders)list.push(...BernV6.fenceOccluders());
return list;
}
const _insRay = new THREE.Ray();
const _insHit = new THREE.Vector3();
function isShadowed(px, pz, dir, proxies) {
_insRay.origin.set(px, 0.3, pz);
_insRay.direction.copy(dir);
for (let i = 0; i < proxies.length; i++) {
const p = proxies[i];
if (p.box) { if (_insRay.intersectBox(p.box, _insHit)) return true; }
else if (_insRay.intersectSphere(p.sphere, _insHit)) return true;
}
return false;
}
function computeInsolation(mi) {
const month = solarParams(mi);
const start = month.sunrise, end = month.sunset;
const stepH = 0.5, cell = 0.5;
const nx = Math.round(CONFIG.plot.w / cell), nz = Math.round(CONFIG.plot.d / cell);
const data = new Float32Array(nx * nz);
const inside = new Uint8Array(nx * nz);
const foots = SOLID_IDS().map(id => Norms.bodyBounds(Norms.obj(id)));
for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
const px = (ix + 0.5) * cell, pz = (iz + 0.5) * cell;
for (let f = 0; f < foots.length; f++) {
const b = foots[f];
if (px >= b.minX && px <= b.maxX && pz >= b.minZ && pz <= b.maxZ) { inside[iz*nx+ix] = 1; break; }
}
}
const proxies = buildOccluders();
const ang = CONFIG.gps.angle * Math.PI / 180;
const cosA = Math.cos(ang), sinA = Math.sin(ang);
const dir = new THREE.Vector3();
for (let h = start + stepH / 2; h < end; h += stepH) {
const s = calcSunAt(h, mi);
if (s.altitude <= 1) continue;
dir.set(s.sunEast * cosA + s.sunNorth * sinA, s.sinAlt, -s.sunEast * sinA + s.sunNorth * cosA).normalize();
for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
const idx = iz * nx + ix;
if (inside[idx]) continue;
if (!isShadowed((ix + 0.5) * cell, (iz + 0.5) * cell, dir, proxies)) data[idx] += stepH;
}
}
return { data, inside, nx, nz, cell, daylight: end - start };
}
function rebuildHeatmap(res) {
if (insolationMesh) { scene.remove(insolationMesh); insolationMesh.geometry.dispose(); insolationMesh.material.dispose(); insolationMesh = null; }
const geo = new THREE.PlaneGeometry(CONFIG.plot.w, CONFIG.plot.d, res.nx - 1, res.nz - 1);
const colors = new Float32Array(res.nx * res.nz * 3);
const col = new THREE.Color();
for (let iy = 0; iy < res.nz; iy++) {
for (let ix = 0; ix < res.nx; ix++) {
const idx = iy * res.nx + ix;
if (res.inside[idx]) col.setRGB(0.12, 0.12, 0.15);
else {
const f = Math.min(1, res.data[idx] / Math.max(4, res.daylight * 0.8));
col.setHSL(0.33 * f, 0.95, 0.45 + 0.1 * (1 - f));
}
colors[idx*3] = col.r; colors[idx*3+1] = col.g; colors[idx*3+2] = col.b;
}
}
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geo.rotateX(-Math.PI / 2);
const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false });
insolationMesh = new THREE.Mesh(geo, mat);
insolationMesh.position.set(CONFIG.center.x, 0.07, CONFIG.center.z);
scene.add(insolationMesh);
Utils.markDirty();
}
function zoneSunHours(zn, mi) {
const month = solarParams(mi);
const stepH = 0.5, cell = 0.5;
const proxies = buildOccluders().filter(p => p.ownId !== zn.own);
const foots = SOLID_IDS().filter(id => id !== zn.own).map(id => Norms.bodyBounds(Norms.obj(id)));
const ang = CONFIG.gps.angle * Math.PI / 180, cosA = Math.cos(ang), sinA = Math.sin(ang);
const dir = new THREE.Vector3();
let sum = 0, cnt = 0;
for (let px = zn.x - zn.w/2 + 0.25; px < zn.x + zn.w/2; px += cell) {
for (let pz = zn.z - zn.d/2 + 0.25; pz < zn.z + zn.d/2; pz += cell) {
let inOther = false;
for (let f = 0; f < foots.length; f++) { const b = foots[f]; if (px >= b.minX && px <= b.maxX && pz >= b.minZ && pz <= b.maxZ) { inOther = true; break; } }
if (inOther) continue;
cnt++;
let hrs = 0;
for (let h = month.sunrise + stepH/2; h < month.sunset; h += stepH) {
const s = calcSunAt(h, mi);
if (s.altitude <= 1) continue;
dir.set(s.sunEast*cosA + s.sunNorth*sinA, s.sinAlt, -s.sunEast*sinA + s.sunNorth*cosA).normalize();
if (!isShadowed(px, pz, dir, proxies)) hrs += stepH;
}
sum += hrs;
}
}
return cnt ? sum / cnt : 0;
}
function showInsolation() {
const mi = parseInt(DOM.monthSlider.value, 10) - 1;
const res = computeInsolation(mi);
rebuildHeatmap(res);
const zones = ['garden','greenhouse','playground'].map(id => Norms.obj(id)).filter(Boolean).map(o => ({
icon: o.type === 'garden' ? '🌱' : (o.type === 'greenhouse' ? '🌿' : '🧸'),
name: o.type === 'garden' ? 'Огород' : (o.type === 'greenhouse' ? 'Теплица' : 'Площадка'),
x: o.x, z: o.z, w: o.w || (o.radius || 1)*2, d: o.d || (o.radius || 1)*2,
own: o.type === 'greenhouse' ? o.id : null
}));
const rows = zones.map(zn => {
const hrs = zoneSunHours(zn, mi);
const cls = hrs >= 8 ? 'ir-good' : (hrs >= 4 ? 'ir-mid' : 'ir-bad');
return `<div class="ir-row"><span>${zn.icon} ${zn.name}</span><span class="ir-val ${cls}">${Utils.fmt(hrs)} ч/день</span></div>`;
}).join('');
DOM.sun.insolationStatus.innerHTML = `<div class="ir-title">🌤 Инсоляция • ${CONFIG.monthNames[mi]}</div>` + rows;
DOM.sun.insolationStatus.style.display = 'block';
toast('🌤 Карта инсоляции построена', 2500);
}
function hideInsolation() {
if (insolationMesh) { scene.remove(insolationMesh); insolationMesh.geometry.dispose(); insolationMesh.material.dispose(); insolationMesh = null; }
DOM.sun.insolationStatus.style.display = 'none';
Utils.markDirty();
}
function scheduleInsolation() {
clearTimeout(insolationTimer);
insolationTimer = setTimeout(() => { try { showInsolation(); } catch (e) { console.error('Ошибка теневого анализа:', e); alert('⚠ Ошибка теневого анализа: ' + e.message); } }, 250);
}
// ═══════════════════════════════════════════════════════════════
// 🔆 СОЛНЕЧНЫЕ ПАНЕЛИ (потенциал южного ската + визуализация)
// ═══════════════════════════════════════════════════════════════
let solarOn = false;
let solarGroup = null;
function houseRoofGeom() {
const h = Norms.obj('house'); if (!h) return null;
const rise = 2.5;
const slopeLen = Math.sqrt((h.d/2)**2 + rise**2);
const sceneRot = (h.rot || 0) * Math.PI / 180;
const axisAngle = CONFIG.gps.angle * Math.PI / 180;
// Истинная северная компонента направления локального +Z после поворота дома.
const northOfPlusZ = Math.sin(sceneRot)*Math.sin(axisAngle) + Math.cos(sceneRot)*Math.cos(axisAngle);
const southSign = northOfPlusZ < 0 ? 1 : -1;
return { h, rise, slopeLen, slopeArea: h.w * slopeLen, tilt: Math.atan2(rise, h.d/2) * 180/Math.PI, southSign, sceneRot };
}
function solarShadingFactor() {
const g = houseRoofGeom(); if (!g) return 1;
const h = g.h;
const proxies = buildOccluders().filter(p => p.ownId !== 'house');
const ang = CONFIG.gps.angle*Math.PI/180, cosA = Math.cos(ang), sinA = Math.sin(ang);
const dir = new THREE.Vector3(), ray = new THREE.Ray(), hit = new THREE.Vector3();
let lit = 0, tot = 0;
[2, 5, 8, 11].forEach(mi => {
const m = solarParams(mi);
for (let hh = m.sunrise + 1; hh <= m.sunset - 1; hh += 1) {
const s = calcSunAt(hh, mi);
if (s.altitude <= 5) continue;
dir.set(s.sunEast*cosA + s.sunNorth*sinA, s.sinAlt, -s.sunEast*sinA + s.sunNorth*cosA).normalize();
for (let t = 0.25; t <= 0.75; t += 0.25) for (let fx = 0.2; fx <= 0.8; fx += 0.3) {
const lx = -h.w/2 + fx*h.w;
const lz = g.southSign * (h.d/2)*t;
ray.origin.set(h.x + lx*Math.cos(g.sceneRot) + lz*Math.sin(g.sceneRot), (h.h + g.rise) - g.rise*t + 0.05, h.z - lx*Math.sin(g.sceneRot) + lz*Math.cos(g.sceneRot));
ray.direction.copy(dir);
let blocked = false;
for (const p of proxies) { if (p.box ? ray.intersectBox(p.box, hit) : ray.intersectSphere(p.sphere, hit)) { blocked = true; break; } }
tot++; if (!blocked) lit++;
}
}
});
return tot ? lit/tot : 1;
}
function computeSolar() {
const g = houseRoofGeom(); if (!g) return null;
const usable = g.slopeArea * 0.6;
const count = Math.floor(usable / 1.9);
const capacity = count * 0.4;
const shading = solarShadingFactor();
const annual = Math.round(capacity * 1000 * shading);
const cost = Math.round(capacity * 60000);
const savings = Math.round(annual * 6.5);
return { tilt: g.tilt, count, capacity, shading, annual, cost, savings, payback: savings > 0 ? cost/savings : 0 };
}
function buildSolarPanels() {
if (solarGroup) { scene.remove(solarGroup); solarGroup = null; }
solarGroup = new THREE.Group();
const h = Norms.obj('house'); if (!h) { scene.add(solarGroup); return; }
const g = houseRoofGeom();
const rise = g.rise, tilt = g.tilt * Math.PI / 180;
const panelMat = new THREE.MeshStandardMaterial({ color: 0x12305e, metalness: 0.6, roughness: 0.25 });
const cols = 8, rows = 3;
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
const t = 0.2 + (r + 0.5) * (0.7/rows);
const px = -h.w/2 + ((c + 0.5)/cols) * h.w;
const pz = g.southSign * (h.d/2)*t;
const py = (h.h + rise) - rise*t + 0.06;
const panel = new THREE.Mesh(GeoPool.box(1.6, 0.05, 0.95), panelMat);
panel.position.set(px, py, pz);
panel.rotation.x = g.southSign * tilt;
panel.castShadow = true;
solarGroup.add(panel);
}
solarGroup.position.set(h.x, 0, h.z);
solarGroup.rotation.y = g.sceneRot;
scene.add(solarGroup);
Utils.markDirty();
}
function showSolarInfo() {
const r = computeSolar(); if (!r) return;
const el = document.getElementById('solar-status');
el.style.display = 'block';
el.innerHTML = `<div class="ir-title">🔆 Солнечные панели • южный скат</div>
<div class="ir-row"><span>Уклон ската</span><span class="ir-val">${Math.round(r.tilt)}°</span></div>
<div class="ir-row"><span>Панелей (≈1,9 м², 400 Вт)</span><span class="ir-val">${r.count} шт</span></div>
<div class="ir-row"><span>Мощность</span><span class="ir-val">${r.capacity.toFixed(1)} кВт</span></div>
<div class="ir-row"><span>Инсоляция с учётом тени</span><span class="ir-val">${Math.round(r.shading*100)}%</span></div>
<div class="ir-row"><span>Выработка в год</span><span class="ir-val">${r.annual.toLocaleString('ru-RU')} кВт·ч</span></div>
<div class="ir-row"><span>Экономия в год (6,5 ₽/кВт·ч)</span><span class="ir-val">${r.savings.toLocaleString('ru-RU')} ₽</span></div>
<div class="ir-row"><span>Окупаемость (60 т.₽/кВт)</span><span class="ir-val">≈ ${r.payback.toFixed(0)} лет</span></div>`;
}
function toggleSolar() {
solarOn = !solarOn;
if (solarOn) { buildSolarPanels(); showSolarInfo(); toast('🔆 Панели на южном скате — расчёт ниже', 2500); }
else { if (solarGroup) { scene.remove(solarGroup); solarGroup = null; } document.getElementById('solar-status').style.display = 'none'; }
Utils.markDirty();
}
document.getElementById('solar-btn').addEventListener('click', toggleSolar);
// ═══════════════════════════════════════════════════════════════
// 🌨 СЕЗОННЫЙ ВИД v2 (снег на крышах + снегопад + листва)
// ═══════════════════════════════════════════════════════════════
const SEASON_PALETTE = {
winter: { lawn: 0xeef3f7, lawnMap: false, foliage: 0xe8eef2, road: 0xcfd6db },
spring: { lawn: 0xffffff, lawnMap: true,  foliage: 0x6fbf5a, road: 0x444444 },
summer: { lawn: 0xffffff, lawnMap: true,  foliage: 0x2e7d32, road: 0x444444 },
autumn: { lawn: 0xd8c98a, lawnMap: true,  foliage: 0xd08030, road: 0x4a4a44 }
};
function seasonForMonth(m) {
// Зима: декабрь (12), январь (1), февраль (2)
if (m === 12 || m === 1 || m === 2) return 'winter';
if (m <= 5) return 'spring';   // март, апрель, май
if (m <= 8) return 'summer';   // июнь, июль, август
return 'autumn';               // сентябрь, октябрь, ноябрь
}
function collectFoliage() {
const list = [];
scene.traverse(o => {
if (o.isMesh && o.geometry && o.geometry.type === 'SphereGeometry' && o.material && o.material.color) {
const c = o.material.color.getHex();
if ([0x2e7d32,0x5a9e4b,0x6fbf5a,0xd08030,0xe8eef2].includes(c)) list.push(o);
}
});
return list;
}
let snowfall = null, snowCaps = null;
function makeSnowfall() {
const N = 800, geo = new THREE.BufferGeometry(), pos = new Float32Array(N*3);
for (let i=0;i<N;i++){ pos[i*3]=Math.random()*CONFIG.plot.w; pos[i*3+1]=Math.random()*20; pos[i*3+2]=Math.random()*CONFIG.plot.d; }
geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
snowfall = new THREE.Points(geo, new THREE.PointsMaterial({ color:0xffffff, size:0.12, transparent:true, opacity:0.9 }));
scene.add(snowfall);
(function loop(){ if(!snowfall) return; requestAnimationFrame(loop);
const p = snowfall.geometry.attributes.position;
for (let i=0;i<p.count;i++){ let y=p.getY(i)-0.06; if(y<0)y=20; p.setY(i,y); }
p.needsUpdate = true; Utils.markDirty();
})();
}
function buildSnowCaps() {
const g = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({ color:0xf5f9fc, roughness:0.9 });
['bath','shed','garage','gazebo'].forEach(id => { const o = Norms.obj(id); if (!o || o.radius!==undefined) return;
const cap = new THREE.Mesh(GeoPool.box(o.w+0.4, 0.08, o.d+0.4), mat); cap.position.set(o.x, o.h+0.35, o.z); g.add(cap); });
const h = Norms.obj('house');
if (h) { const rise=2.5, tilt=Math.atan2(rise,h.d/2), len=Math.sqrt((h.d/2)**2+rise**2);
[-1,1].forEach(s => { const cap = new THREE.Mesh(GeoPool.box(h.w+0.3,0.07,len+0.3), mat);
cap.position.set(h.x, h.h+rise/2+0.05, h.z + s*(h.d/4)); cap.rotation.x = s*tilt; g.add(cap); }); }
return g;
}
function setSnow(on) {
if (on && !snowfall) makeSnowfall();
if (!on && snowfall) { scene.remove(snowfall); snowfall.geometry.dispose(); snowfall.material.dispose(); snowfall=null; }
if (on && !snowCaps) { snowCaps = buildSnowCaps(); scene.add(snowCaps); }
if (!on && snowCaps) { scene.remove(snowCaps); snowCaps.traverse(c=>{if(c.geometry)c.geometry.dispose();}); snowCaps=null; }
}
function applySeason() {
const m = parseInt(DOM.monthSlider.value,10) || 6;
const P = SEASON_PALETTE[seasonForMonth(m)];
ground.material.map = P.lawnMap ? Textures.grass : null;
ground.material.color.setHex(P.lawn);
ground.material.needsUpdate = true;
if (road && road.material) road.material.color.setHex(P.road);
collectFoliage().forEach(mesh => mesh.material.color.setHex(P.foliage));
setSnow(seasonForMonth(m) === 'winter');
Utils.markDirty();
}
DOM.monthSlider.addEventListener('input', () => applySeason());
if (DOM.sun.monthSlider) DOM.sun.monthSlider.addEventListener('input', () => { DOM.monthSlider.value = DOM.sun.monthSlider.value; applySeason(); });
applySeason();
// ═══════════════════════════════════════════════════════════════
// ОБРАБОТКА УКАЗАТЕЛЯ
// ═══════════════════════════════════════════════════════════════
let pointerDownPos = null;
document.body.addEventListener('pointerdown', (e) => {
if (measure.mode) return;
if (drag.active) return;
if (e.target !== renderer.domElement) return;
if (tryStartDrag(e)) { e.stopPropagation(); e.preventDefault(); }
}, true);
renderer.domElement.addEventListener('pointerdown', (e) => {
pointerDownPos = { x: e.clientX, y: e.clientY };
if (!measure.mode) return;
e.preventDefault();
const rect = renderer.domElement.getBoundingClientRect();
const clientX = e.clientX || e.pageX;
const clientY = e.clientY || e.pageY;
const mouse = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
const ray = new THREE.Raycaster();
ray.setFromCamera(mouse, camera);
const pt = new THREE.Vector3();
if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), pt)) return;
handleMeasureClick(pt);
});
renderer.domElement.addEventListener('pointermove', (e) => {
if (drag.active) { dragTo(e); return; }
if (!editMode || measure.mode || e.buttons !== 0) return;
const rect = renderer.domElement.getBoundingClientRect();
const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
drag.raycaster.setFromCamera(mouse, camera);
const hits = drag.raycaster.intersectObjects(draggableGroups, true);
renderer.domElement.style.cursor = (hits.length && chainVisible(hits[0].object)) ? 'grab' : '';
});
window.addEventListener('pointerup', () => { if (drag.active) endDrag(); });
renderer.domElement.addEventListener('pointerup', (e) => {
if (!pointerDownPos) return;
const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
pointerDownPos = null;
if (moved > 6 || measure.mode || drag.active) return;
pickUtility(e);
pickObject(e);
});
renderer.domElement.addEventListener('dblclick', () => { if (measure.mode === 'area' && !measure.areaClosed && measure.areaPoints.length >= 3) closeAreaPolygon(); });
DOM.viewSelect.addEventListener('change', function() {
const v = this.value;
appState.activeView=v;
if (v !== 'night') { sunLight.intensity = 1.0; ambientLight.intensity = 0.6; fillLight.intensity = 0.3; hemiLight.intensity = 0.35; scene.background = new THREE.Color(0x87CEEB); sunDisc.visible = true; sunGlow.visible = true; }
if (v === 'night') { scene.background = new THREE.Color(0x0a0a1a); sunLight.intensity = 0.05; ambientLight.intensity = 0.15; fillLight.intensity = 0.05; hemiLight.intensity = 0.05; sunDisc.visible = false; sunGlow.visible = false; }
const pos = CONFIG.camera[v] || CONFIG.camera.default;
cameraTween.start(new THREE.Vector3(pos[0], pos[1], pos[2]), new THREE.Vector3(CONFIG.center.x, 0, CONFIG.center.z));
Utils.markDirty();
});
function exportPNG() {
if(BernV6.applySceneState)BernV6.applySceneState();
renderer.render(scene, camera);
const link = document.createElement('a');
link.download = 'plan_uchastka.png';
link.href = renderer.domElement.toDataURL('image/png');
link.click();
}
function updateSun(hoursOverride) {
const mi = parseInt(DOM.monthSlider.value, 10) - 1;
const month = solarParams(mi);
const dayLength = month.sunset - month.sunrise;
let hours = (hoursOverride !== undefined) ? hoursOverride : parseFloat(DOM.hourSlider.value);
const minH = Math.max(0, month.sunrise - 0.5);
const maxH = Math.min(24, month.sunset + 0.5);
hours = Math.max(minH, Math.min(maxH, hours));
const sun = calcSunAt(hours, mi);
const sinAlt = sun.sinAlt;
const altitude = sun.altitude;
const isNight = altitude < -2;
const sunEast = sun.sunEast;
const sunNorth = sun.sunNorth;
let x, y, z;
const distance = 50;
if (isNight) {
x = CONFIG.center.x; y = -10; z = CONFIG.center.z;
sunLight.intensity = 0.05;
scene.background = new THREE.Color(0x0a0a1a);
ambientLight.intensity = 0.15; fillLight.intensity = 0.05; hemiLight.intensity = 0.05;
sunDisc.visible = false; sunGlow.visible = false;
} else {
const ang = CONFIG.gps.angle * Math.PI / 180;
const sceneX = sunEast * Math.cos(ang) + sunNorth * Math.sin(ang);
const sceneZ = -sunEast * Math.sin(ang) + sunNorth * Math.cos(ang);
x = CONFIG.center.x + distance * sceneX;
y = distance * Math.max(sinAlt, 0.02);
z = CONFIG.center.z + distance * sceneZ;
sunLight.intensity = Math.min(altitude < 20 ? 0.3 + (altitude / 20) * 0.7 : 1.0, 1.2);
const blue = new THREE.Color(0x87CEEB);
const golden = new THREE.Color(0xffaa66);
const orange = new THREE.Color(0xff7733);
let skyColor;
if (altitude > 25) skyColor = blue;
else if (altitude > 10) skyColor = golden.clone().lerp(blue, (altitude - 10) / 15);
else skyColor = orange.clone().lerp(golden, (altitude + 2) / 12);
scene.background = skyColor;
ambientLight.intensity = 0.4 + (altitude / 60) * 0.3;
fillLight.intensity = 0.2 + (altitude / 60) * 0.2;
hemiLight.color.copy(skyColor);
hemiLight.intensity = 0.25 + (altitude / 60) * 0.2;
sunDisc.visible = sunGlow.visible = true;
sunDisc.position.set(x, y, z);
sunGlow.position.set(x, y, z);
}
sunLight.position.set(x, y, z);
sunLight.target.position.set(CONFIG.center.x, 0, CONFIG.center.z);
const monthName = CONFIG.monthNames[mi];
const hoursStr = String(Math.floor(hours)).padStart(2, '0') + ':' + String(Math.floor((hours % 1) * 60)).padStart(2, '0');
DOM.monthLabel.textContent = monthName;
DOM.timeLabel.textContent = hoursStr;
DOM.hourSlider.value = hours;
if (DOM.sun.monthSlider && document.activeElement !== DOM.sun.monthSlider) DOM.sun.monthSlider.value = DOM.monthSlider.value;
if (DOM.sun.hourSlider && document.activeElement !== DOM.sun.hourSlider) DOM.sun.hourSlider.value = hours;
if (DOM.sun.monthLabel) DOM.sun.monthLabel.textContent = monthName;
if (DOM.sun.hourLabel) DOM.sun.hourLabel.textContent = hoursStr;
const dayH = Math.floor(dayLength);
const dayM = Math.round((dayLength - dayH) * 60);
const status = isNight ? '🌙 Ночь' : '☀️ Высота: ' + Math.round(Math.max(altitude, 0)) + '°';
const statusStr = `${status} | День: ${dayH}ч ${String(dayM).padStart(2, '0')}м`;
DOM.timeDisplay.textContent = statusStr;
if (DOM.sun.status) DOM.sun.status.textContent = statusStr;
renderer.shadowMap.needsUpdate = true;
Utils.markDirty();
}
const sunPlayer = {
playing: false, rafId: null, lastTs: 0, hour: 12, durationSec: 20,
toggle() { if (this.playing) this.stop(); else this.start(); },
start() {
const m = solarParams(parseInt(DOM.monthSlider.value, 10) - 1);
this.hour = Math.max(0, m.sunrise - 0.5);
this.playing = true;
DOM.sun.playBtn.textContent = '⏸ Стоп';
DOM.sun.playBtn.classList.add('playing');
updateSun(this.hour);
this.lastTs = performance.now();
if (this.rafId) cancelAnimationFrame(this.rafId);
this.rafId = requestAnimationFrame(this.step);
},
step: (now) => {
const sp = sunPlayer;
if (!sp.playing) return;
let dt = (now - sp.lastTs) / 1000;
sp.lastTs = now;
if (dt > 0.1) dt = 0.1;
if (dt < 0) dt = 0;
const m = solarParams(parseInt(DOM.monthSlider.value, 10) - 1);
const start = Math.max(0, m.sunrise - 0.5);
const end = Math.min(24, m.sunset + 0.5);
const speed = (end - start) / sp.durationSec;
sp.hour += dt * speed;
if (sp.hour >= end) { sp.hour = end; updateSun(sp.hour); sp.stop(); return; }
updateSun(sp.hour);
sp.rafId = requestAnimationFrame(sp.step);
},
stop() {
this.playing = false;
if (this.rafId) cancelAnimationFrame(this.rafId);
this.rafId = null;
DOM.sun.playBtn.textContent = '▶ Проиграть день';
DOM.sun.playBtn.classList.remove('playing');
}
};
DOM.monthSlider.addEventListener('input', () => updateSun());
DOM.hourSlider.addEventListener('input', () => updateSun());
if (DOM.sun.monthSlider) DOM.sun.monthSlider.addEventListener('input', () => { if (sunPlayer.playing) sunPlayer.stop(); DOM.monthSlider.value = DOM.sun.monthSlider.value; updateSun(); });
if (DOM.sun.hourSlider) DOM.sun.hourSlider.addEventListener('input', () => { if (sunPlayer.playing) sunPlayer.stop(); DOM.hourSlider.value = DOM.sun.hourSlider.value; updateSun(); });
DOM.sun.playBtn.addEventListener('click', () => sunPlayer.toggle());
DOM.sun.insolationBtn.addEventListener('click', function() {
try {
insolationOn = !insolationOn;
this.classList.toggle('active', insolationOn);
this.textContent = insolationOn ? '🌤 Анализ: ВКЛ' : '🌤 Теневой анализ';
if (insolationOn) showInsolation(); else hideInsolation();
} catch (e) {
console.error('Ошибка теневого анализа:', e);
alert('⚠ Ошибка теневого анализа: ' + e.message);
}
});
DOM.monthSlider.addEventListener('input', () => { if (insolationOn) scheduleInsolation(); });
if (DOM.sun.monthSlider) DOM.sun.monthSlider.addEventListener('input', () => { if (insolationOn) scheduleInsolation(); });
function setSunPanelCollapsed(collapsed) {
DOM.sun.panel.style.display = collapsed ? 'none' : 'block';
DOM.sun.fab.style.display = collapsed ? 'flex' : 'none';
}
DOM.sun.toggle.addEventListener('click', () => { const isCollapsed = DOM.sun.panel.style.display === 'none'; setSunPanelCollapsed(!isCollapsed); DOM.sun.toggle.textContent = !isCollapsed ? '+' : '–'; });
DOM.sun.fab.addEventListener('click', () => { setSunPanelCollapsed(false); DOM.sun.toggle.textContent = '–'; });
if (window.innerWidth < 769) setSunPanelCollapsed(true);
function animate() {
requestAnimationFrame(animate);
const tweening = cameraTween.update();
if (tweening) Utils.markDirty();
else if (controls.update()) Utils.markDirty();
if (Utils.dirty) { renderer.render(scene, camera); Utils.dirty = false; }
}
Utils.markDirty();
animate();
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
Utils.markDirty();
});
function setupModal(modal, closeIds, onClose) {
closeIds.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; if (onClose) onClose(); }); });
window.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; if (onClose) onClose(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') { modal.style.display = 'none'; document.body.style.overflow = 'auto'; if (onClose) onClose(); } });
}
setupModal(DOM.reportModal, ['close-report', 'close-report-btn']);
setupModal(DOM.normsModal, ['close-norms-modal', 'close-norms-btn'], () => { clearHighlights(); Utils.markDirty(); });
setupModal(DOM.objectModal, ['close-object-modal', 'close-object-btn']);
setupModal(DOM.variantsModal, ['close-variants-modal', 'close-variants-btn']);
setupModal(document.getElementById('drawing-modal'), ['close-drawing-modal', 'close-drawing-btn']);
document.getElementById('drawing-btn').addEventListener('click', openDrawingModal);
document.getElementById('showDrawingMob').addEventListener('click', () => { openDrawingModal(); closeMenu(); });
document.getElementById('drawing-png-btn').addEventListener('click', downloadDrawingPNG);
setupModal(DOM.catalogModal, ['close-catalog-modal', 'close-catalog-btn']);   // v2.1: окно каталога
setupModal(DOM.projectDataModal, ['close-project-data-modal', 'close-project-data-btn']);
DOM.openReport.addEventListener('click', openReportModal);
DOM.normBadge.addEventListener('click', openNorms);
setupModal(document.getElementById('smeta-modal'), ['close-smeta-modal', 'close-smeta-btn']);
document.getElementById('smeta-btn').addEventListener('click', openSmetaModal);
document.getElementById('showSmetaMob').addEventListener('click', () => { openSmetaModal(); closeMenu(); });
const planState = { scene: null, camera: null, renderer: null, controls: null, group: null, currentPlan: 'main', isTopView: false };
const MAIN_PLAN = {
rooms: [
{ name: 'Крыльцо_верх', x: -7.25, z: 4.25, w: 1.5, d: 1.5, color: 0xbc8f8f, labelColor: '#aa7755' },
{ name: 'Тех.пом.', x: -5.5, z: 3.25, w: 2.0, d: 3.5, color: 0xcccccc, labelColor: '#666666' },
{ name: 'СУ', x: -3.75, z: 3.25, w: 1.5, d: 3.5, color: 0xb3d9ff, labelColor: '#3366cc' },
{ name: 'Кухня', x: -1.5, z: 3.25, w: 3.0, d: 3.5, color: 0xffe0b2, labelColor: '#cc8800' },
{ name: 'Спальня1', x: 1.5, z: 3.25, w: 3.0, d: 3.5, color: 0xffc8c8, labelColor: '#cc3366' },
{ name: 'Спальня2', x: 5.5, z: 3.25, w: 5.0, d: 3.5, color: 0xc8e6ff, labelColor: '#3366cc' },
{ name: 'Крыльцо_низ', x: -7.25, z: 0.5, w: 1.5, d: 2.0, color: 0xbc8f8f, labelColor: '#aa7755' },
{ name: 'Тамбур', x: -5.5, z: 0.0, w: 2.0, d: 3.0, color: 0x8d8d8d, labelColor: '#888888' },
{ name: 'Гостиная', x: -0.75, z: -0.75, w: 7.5, d: 4.5, color: 0xffd1b3, labelColor: '#cc6600' },
{ name: 'Холл', x: 4.0, z: 0.75, w: 2.0, d: 1.5, color: 0xd4d4d4, labelColor: '#999999' },
{ name: 'Кабинет', x: 4.0, z: -1.0, w: 2.0, d: 2.0, color: 0xe6d4b3, labelColor: '#aa8844' },
{ name: 'Спальня3', x: 6.5, z: -0.25, w: 3.0, d: 3.5, color: 0xd4f0d4, labelColor: '#33aa66' },
{ name: 'Терраса', x: 5.5, z: -3.5, w: 5.0, d: 3.0, color: 0xbc8f8f, labelColor: '#aa7755' }
],
width: 16, depth: 10
};
function initPlanScene() {
if (!planState.renderer) {
planState.scene = new THREE.Scene();
planState.scene.background = new THREE.Color(0x2c3e50);
planState.camera = new THREE.PerspectiveCamera(40, DOM.planContainer.clientWidth / DOM.planContainer.clientHeight, 0.1, 100);
planState.camera.position.set(0, 12, 18);
planState.camera.lookAt(0, 0, 0);
planState.renderer = new THREE.WebGLRenderer({ antialias: true });
planState.renderer.setSize(DOM.planContainer.clientWidth, DOM.planContainer.clientHeight);
planState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
DOM.planContainer.appendChild(planState.renderer.domElement);
planState.controls = new THREE.OrbitControls(planState.camera, planState.renderer.domElement);
planState.controls.target.set(0, 0, 0);
planState.controls.enableDamping = true;
planState.controls.dampingFactor = 0.05;
planState.controls.maxPolarAngle = Math.PI / 2.2;
planState.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirL = new THREE.DirectionalLight(0xffffff, 0.5);
dirL.position.set(5, 15, 10);
planState.scene.add(dirL);
planState.group = new THREE.Group();
planState.scene.add(planState.group);
(function animatePlan() {
if (!planState.renderer) return;
requestAnimationFrame(animatePlan);
planState.controls.update();
if (DOM.planModal.style.display === 'block') planState.renderer.render(planState.scene, planState.camera);
})();
const footer = DOM.planModal.querySelector('.modal-footer');
footer.innerHTML = '';
[ { text: 'Основной план', fn: () => { planState.currentPlan = 'main'; rebuildPlanModal(); } }, { text: 'Зеркальный план', fn: () => { planState.currentPlan = 'mirror'; rebuildPlanModal(); } }, { text: '📷 Вид сверху', fn: (btn) => { planState.isTopView = !planState.isTopView; planState.camera.position.set(...(planState.isTopView ? [0, 30, 0] : [0, 12, 18])); btn.textContent = planState.isTopView ? '📷 Перспектива' : '📷 Вид сверху'; planState.controls.target.set(0, 0, 0); planState.controls.update(); } }, { text: 'Закрыть', fn: () => { DOM.planModal.style.display = 'none'; document.body.style.overflow = 'auto'; } } ].forEach(b => { const btn = document.createElement('button'); btn.textContent = b.text; btn.style.marginRight = '10px'; btn.onclick = () => b.fn(btn); footer.appendChild(btn); });
}
rebuildPlanModal();
}
function rebuildPlanModal() {
if (!planState.group) return;
while (planState.group.children.length) { const c = planState.group.children[0]; planState.group.remove(c); if (c.geometry) c.geometry.dispose(); if (c.material && c.material.map) c.material.map.dispose(); }
const data = planState.currentPlan === 'mirror' ? { ...MAIN_PLAN, rooms: MAIN_PLAN.rooms.map(r => ({ ...r, x: -r.x })) } : MAIN_PLAN;
const halfW = data.width / 2, halfD = data.depth / 2;
const wallMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
planState.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(-halfW, 0.05, -halfD), new THREE.Vector3(halfW, 0.05, -halfD), new THREE.Vector3(halfW, 0.05, halfD), new THREE.Vector3(-halfW, 0.05, halfD), new THREE.Vector3(-halfW, 0.05, -halfD) ]), wallMat));
const intWallMat = new THREE.LineBasicMaterial({ color: 0x888888 });
data.rooms.forEach(r => {
const mesh = new THREE.Mesh(GeoPool.plane(r.w, r.d), new THREE.MeshStandardMaterial({ color: r.color, side: THREE.DoubleSide }));
mesh.rotation.x = -Math.PI/2; mesh.position.set(r.x, 0.02, r.z); mesh.receiveShadow = true;
planState.group.add(mesh);
planState.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(r.x - r.w/2, 0.04, r.z - r.d/2), new THREE.Vector3(r.x + r.w/2, 0.04, r.z - r.d/2), new THREE.Vector3(r.x + r.w/2, 0.04, r.z + r.d/2), new THREE.Vector3(r.x - r.w/2, 0.04, r.z + r.d/2), new THREE.Vector3(r.x - r.w/2, 0.04, r.z - r.d/2) ]), intWallMat));
const nameLbl = Utils.createLabel(r.name.replace(/_/g, ' '), r.labelColor || '#fff', 0.8, [5, 1.25], 1024, 256, 60);
nameLbl.position.set(r.x, 0.3, r.z + 0.25);
planState.group.add(nameLbl);
const sizeLbl = Utils.createLabel(`${r.w.toFixed(1)}×${r.d.toFixed(1)} м`, '#cccccc', 0.5, [5, 1.25], 1024, 256, 60);
sizeLbl.position.set(r.x, 0.1, r.z - 0.35);
planState.group.add(sizeLbl);
});
[ { text: '🚪 Вход', pos: [0, 0.1, -halfD - 0.6], size: 0.9 }, { text: `Дом: ${data.width}×${data.depth} м`, pos: [0, 0.1, halfD + 1.2], size: 0.8 }, { text: '16 м', pos: [0, 0.3, halfD + 1.7], size: 0.6 }, { text: '16 м', pos: [0, 0.3, -halfD - 1.7], size: 0.6 }, { text: '10 м', pos: [-halfW - 1.7, 0.3, 0], size: 0.6 }, { text: '10 м', pos: [halfW + 1.7, 0.3, 0], size: 0.6 } ].forEach(d => { const lbl = Utils.createLabel(d.text, '#ffaa00', d.size, [5, 1.25], 1024, 256, 60); lbl.position.set(...d.pos); planState.group.add(lbl); });
[ { text: '⬆ СЕВЕР', pos: [0, 0.3, halfD + 2.5] }, { text: '⬇ ЮГ', pos: [0, 0.3, -halfD - 2.5] }, { text: '⬅ ЗАПАД', pos: [-halfW - 2.5, 0.3, 0] }, { text: '➡ ВОСТОК', pos: [halfW + 2.5, 0.3, 0] } ].forEach(d => { const lbl = Utils.createLabel(d.text, '#66ccff', 0.9, [5, 1.25], 1024, 256, 60, 'rgba(0,0,0,0.5)'); lbl.position.set(...d.pos); planState.group.add(lbl); });
}
DOM.openPlan.addEventListener('click', () => { DOM.planModal.style.display = 'block'; document.body.style.overflow = 'hidden'; initPlanScene(); });
setupModal(DOM.planModal, ['close-plan-modal', 'close-plan-modal-btn']);
window.addEventListener('resize', () => { if (DOM.planModal.style.display === 'block' && planState.renderer) { planState.renderer.setSize(DOM.planContainer.clientWidth, DOM.planContainer.clientHeight); planState.camera.aspect = DOM.planContainer.clientWidth / DOM.planContainer.clientHeight; planState.camera.updateProjectionMatrix(); } });
let showCommsOnly = false;
DOM.toggleComm.addEventListener('click', () => setSceneMode(appState.sceneMode==='comms-only'?'normal':'comms-only'));
DOM.toggleLabels.addEventListener('click', () => setLayer('objectLabels',!appState.layers.objectLabels));
DOM.exportPng.addEventListener('click', exportPNG);
document.getElementById('toggle-measure').addEventListener('click', () => setMeasureMode('dist'));
document.getElementById('toggle-area').addEventListener('click', () => setMeasureMode('area'));
async function exportPDF() {
if(BernV6.exportPDF)return BernV6.exportPDF();
DOM.pdfLoader.classList.add('active');
try {
renderer.render(scene, camera);
const sceneImage = renderer.domElement.toDataURL('image/png');
const date = new Date().toLocaleDateString('ru-RU');
DOM.pdfCover.innerHTML = `<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px 0; background: white;"><div class="cover-title">📐 Проект Берн — 3D план участка</div><div class="cover-info"><div><strong>📍 Адрес:</strong> Московская обл., г.о. Черноголовка, ул. Рассветная, уч. 7</div><div><strong>📋 Кадастровый номер:</strong> 50:16:0202016:428</div><div><strong>📐 Площадь:</strong> 1000 м² (25×40 м)</div><div><strong>👤 Владелец:</strong> Хорошев Роман Александрович</div><div><strong>🌐 GPS центра:</strong> ${CONFIG.gps.lat}, ${CONFIG.gps.lng}</div><div><strong>📅 Дата отчёта:</strong> ${date}</div></div><img src="${sceneImage}" style="width:100%; border-radius:12px; border:1px solid #ddd; box-shadow:0 4px 12px rgba(0,0,0,0.1);" /><div class="cover-footer">© 3D-планировщик «Проект Берн» • ${date}</div></div>`;
DOM.pdfReport.innerHTML = buildReportHTML();
await new Promise(r => setTimeout(r, 300));
const coverCanvas = await html2canvas(DOM.pdfCover, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, width: 780, height: DOM.pdfCover.scrollHeight });
const reportCanvas = await html2canvas(DOM.pdfReport, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, width: 780, height: DOM.pdfReport.scrollHeight });
const coverImage = coverCanvas.toDataURL('image/png');
const reportImage = reportCanvas.toDataURL('image/png');
const { jsPDF } = window.jspdf;
const doc = new jsPDF('p', 'mm', 'a4');
const pageW = 210, pageH = 297, margin = 14;
const imgW = pageW - margin * 2;
const coverH = (coverCanvas.height / coverCanvas.width) * imgW;
doc.addImage(coverImage, 'PNG', margin, margin, imgW, Math.min(coverH, pageH - margin * 2));
const reportH = (reportCanvas.height / reportCanvas.width) * imgW;
const maxH = pageH - margin * 2;
if (reportH <= maxH) { doc.addPage(); doc.addImage(reportImage, 'PNG', margin, margin, imgW, reportH); }
else {
const totalPx = reportCanvas.height;
const maxPx = maxH * (totalPx / reportH);
let offset = 0, first = true;
while (offset < totalPx) {
const hPx = Math.min(maxPx, totalPx - offset);
const c = document.createElement('canvas');
c.width = reportCanvas.width; c.height = hPx;
const ctx = c.getContext('2d');
const img = new Image(); img.src = reportImage;
await new Promise(r => { img.onload = r; img.onerror = r; });
ctx.drawImage(img, 0, offset, reportCanvas.width, hPx, 0, 0, reportCanvas.width, hPx);
if (!first) doc.addPage();
doc.addImage(c.toDataURL('image/png'), 'PNG', margin, margin, imgW, (hPx / totalPx) * reportH);
offset += hPx; first = false;
}
}
doc.save('Проект_Берн_Отчет.pdf');
} catch (error) { console.error('Ошибка PDF:', error); alert('Не удалось создать PDF. Проверьте консоль.'); }
finally { DOM.pdfLoader.classList.remove('active'); }
}
DOM.exportPdf.addEventListener('click', exportPDF);
function localToGPS(x, z) {
const dx = x - CONFIG.center.x;
const dz = z - CONFIG.center.z;
const a = CONFIG.gps.angle * Math.PI / 180;
const rx = dx * Math.cos(a) - dz * Math.sin(a);
const rz = dx * Math.sin(a) + dz * Math.cos(a);
return { lat: CONFIG.gps.lat + rz * CONFIG.gps.latPerM, lng: CONFIG.gps.lng + rx * CONFIG.gps.lngPerM };
}
function showGPS() {
DOM.gpsTbody.innerHTML = '';
CONFIG.objects.forEach(obj => {
const gps = localToGPS(obj.x, obj.z);
const tr = document.createElement('tr');
tr.style.borderBottom = '1px solid #eee';
tr.innerHTML = `<td style="padding: 6px 8px;">${obj.label.replace(/[^\w\sА-Яа-я"]/g, '').trim()}</td><td style="padding: 6px 8px; text-align: center;">${obj.x.toFixed(1)}, ${obj.z.toFixed(1)}</td><td style="padding: 6px 8px; text-align: center;">${gps.lat.toFixed(6)}</td><td style="padding: 6px 8px; text-align: center;">${gps.lng.toFixed(6)}</td>`;
DOM.gpsTbody.appendChild(tr);
});
DOM.gpsModal.style.display = 'block';
document.body.style.overflow = 'hidden';
}
setupModal(DOM.gpsModal, ['close-gps-modal', 'close-gps-btn']);
function toggleMenu() { DOM.mobileMenu.classList.toggle('open'); }
function closeMenu() { DOM.mobileMenu.classList.remove('open'); }
DOM.hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
DOM.closeMenu.addEventListener('click', closeMenu);
document.addEventListener('click', (e) => { if (DOM.mobileMenu.classList.contains('open') && !DOM.mobileMenu.contains(e.target) && e.target !== DOM.hamburger) closeMenu(); });
document.querySelectorAll('#mobile-menu .ctrl-btn[data-view]').forEach(btn => { btn.addEventListener('click', function() { DOM.viewSelect.value = this.dataset.view; DOM.viewSelect.dispatchEvent(new Event('change')); closeMenu(); }); });
DOM.mobile.comms.addEventListener('click', function() { DOM.toggleComm.click(); this.textContent = DOM.toggleComm.textContent; closeMenu(); });
DOM.mobile.labels.addEventListener('click', function() { DOM.toggleLabels.click(); this.textContent = DOM.toggleLabels.textContent; closeMenu(); });
DOM.mobile.measure.addEventListener('click', () => { setMeasureMode('dist'); closeMenu(); });
DOM.mobile.area.addEventListener('click', () => { setMeasureMode('area'); closeMenu(); });
DOM.mobile.norms.addEventListener('click', () => { openNorms(); closeMenu(); });
DOM.mobile.report.addEventListener('click', () => { openReportModal(); closeMenu(); });
DOM.mobile.plan.addEventListener('click', () => { DOM.planModal.style.display = 'block'; document.body.style.overflow = 'hidden'; initPlanScene(); closeMenu(); });
DOM.mobile.png.addEventListener('click', () => { exportPNG(); closeMenu(); });
DOM.mobile.pdf.addEventListener('click', () => { exportPDF(); closeMenu(); });
DOM.mobile.gps.addEventListener('click', () => { showGPS(); closeMenu(); });
DOM.mobile.catalog.addEventListener('click', () => { openCatalog(); closeMenu(); });
DOM.mobile.projectData.addEventListener('click', () => { openProjectDataModal(); closeMenu(); });
DOM.edit.modeBtn.addEventListener('click', () => setEditMode(!editMode));
DOM.edit.violationsBtn.addEventListener('click', function() {
showViolationRings = !showViolationRings;
this.textContent = showViolationRings ? '⭕ Скрыть нарушения' : '🔴 Показать нарушения';
this.classList.toggle('viol-active', showViolationRings);
setLayer("violations",showViolationRings);
if (showViolationRings) buildViolationRings();
});
DOM.edit.saveBtn.addEventListener('click', () => { saveLayout(); toast(BernV6.readOnly?'Review: сохранения защищены. Проект можно скачать в JSON.':'💾 Планировка сохранена'); });
DOM.edit.resetBtn.addEventListener('click', () => { if (!confirm('Вернуть все объекты на исходные места? Сохранённая планировка и добавленные объекты каталога будут удалены. Перед сбросом создастся локальная копия.')) return; if (!createLocalBackup('Перед сбросом', true)) { alert('Сброс отменён: не удалось создать страховочную копию.'); return; } resetLayout(); });
DOM.edit.autofixBtn.addEventListener('click', () => { if (confirm('Умная авторасстановка расставит объекты по нормам и солнцу. Продолжить?')) applyAutoFix(); });
DOM.edit.fixViolBtn.addEventListener('click', fixViolations);          // 🩹 Исправить нарушения
DOM.fixViolModalBtn.addEventListener('click', fixViolations);          // 🩹 из окна норм
DOM.edit.undoBtn.addEventListener('click', undo);
DOM.edit.redoBtn.addEventListener('click', redo);
DOM.edit.variantsBtn.addEventListener('click', openVariantsModal);
DOM.saveVariantBtn.addEventListener('click', saveCurrentVariant);
DOM.edit.projectDataBtn.addEventListener('click', openProjectDataModal);
DOM.exportProjectJson.addEventListener('click', () => {
saveLayout();
const data = buildProjectBackup('Экспорт для переноса');
downloadJson(data, backupFilename('Проект_Берн', data.exportedAt));
toast('⬇ Полный проект скачан в JSON', 3500);
});
DOM.importProjectJson.addEventListener('click', () => { DOM.projectJsonFile.value = ''; DOM.projectJsonFile.click(); });
DOM.projectJsonFile.addEventListener('change', async () => {
const file = DOM.projectJsonFile.files && DOM.projectJsonFile.files[0]; if (!file) return;
if (file.size > 10 * 1024 * 1024) { alert('Файл слишком большой. Максимум 10 МБ.'); return; }
try {
const data = validateProjectBackup(JSON.parse(await file.text()));
const objectCount = data.scene.objects.length;
const variantCount = Object.keys(data.variants || {}).length;
if (!confirm(`Загрузить проект из файла?\nОбъектов: ${objectCount}\nВариантов: ${variantCount}\n\nТекущее состояние сначала будет сохранено автоматически.`)) return;
if (!createLocalBackup('Перед импортом', true)) throw new Error('Не удалось создать страховочную копию перед импортом.');
applyProjectBackup(data);
toast('✅ Проект полностью загружен из JSON', 4000);
renderBackupList();
} catch (e) { console.error('Ошибка импорта проекта:', e); alert('Не удалось загрузить проект: ' + e.message); }
});
DOM.createLocalBackup.addEventListener('click', () => createLocalBackup('Ручная копия'));
DOM.edit.toggle.addEventListener('click', () => { const collapsed = DOM.edit.panel.classList.toggle('collapsed'); DOM.edit.toggle.textContent = collapsed ? '+' : '–'; DOM.edit.fab.style.display = collapsed ? 'flex' : 'none'; });
DOM.edit.fab.addEventListener('click', () => { DOM.edit.panel.classList.remove('collapsed'); DOM.edit.toggle.textContent = '–'; DOM.edit.fab.style.display = 'none'; });
DOM.edit.reportErrorBtn = document.getElementById('report-error-btn');
DOM.edit.reportErrorBtn.addEventListener('click', () => {
const snap = CONFIG.objects.map(o => ({
id: o.id,
x: +o.x.toFixed(2), z: +o.z.toFixed(2),
rot: o.rot || 0,
w: o.w, d: o.d, h: o.h, radius: o.radius
}));
const report = {
version: APP_VERSION,
time: new Date().toLocaleString('ru-RU'),
userAgent: navigator.userAgent,
screen: window.innerWidth + 'x' + window.innerHeight,
editMode: editMode,
insolationOn: insolationOn,
showViolationRings: showViolationRings,
catalogCount: CAT.items().length,
undoStack: history.undo.length,
redoStack: history.redo.length,
errors: errorLog.length ? errorLog : ['(ошибок не зафиксировано)'],
objects: snap
};
const text = JSON.stringify(report, null, 2);
navigator.clipboard.writeText(text).then(() => {
toast('📋 Отчёт скопирован в буфер. Вставьте мне в чат.', 3500);
}).catch(() => {
const ta = document.createElement('textarea');
ta.value = text;
document.body.appendChild(ta); ta.select();
document.execCommand('copy');
document.body.removeChild(ta);
toast('📋 Отчёт скопирован в буфер. Вставьте мне в чат.', 3500);
});
console.log('📋 Отчёт об ошибке:', report);
});
// ═══════════════════════════════════════════════════════════════
// КАТАЛОГ ОБЪЕКТОВ: окно, добавление, удаление
// ═══════════════════════════════════════════════════════════════
function renderCatalogModal() {
DOM.catalogGrid.innerHTML = Object.keys(CATALOG).map(k => {
const s = CATALOG[k];
const cnt = CAT.items().filter(o => o.type === k).length;
const dims = s.radius ? `Ø${s.radius * 2} м` : `${s.w}×${s.d} м`;
return `<div class="cat-card" data-cat="${k}"><div class="ico">${s.label.split(' ')[0]}</div><div class="nm">${s.label.replace(/^[^\s]+\s/, '')}</div><div class="sz">${dims}</div><div class="cnt">На участке: ${cnt}</div></div>`;
}).join('');
DOM.catalogGrid.querySelectorAll('.cat-card').forEach(c => c.onclick = () => { CAT.make(c.dataset.cat); renderCatalogModal(); });
const items = CAT.items();
DOM.catalogPlaced.innerHTML = items.length ? items.map(o => `<div class="cat-row"><span>${o.label} • X ${Utils.fmt(o.x)}, Z ${Utils.fmt(o.z)}</span><button data-del="${o.id}">🗑 Удалить</button></div>`).join('') : '<p style="color:#888; font-size:13px;">Пока ничего не добавлено — кликните по карточке выше.</p>';
DOM.catalogPlaced.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { CAT.remove(b.dataset.del); });
}
function openCatalog() {
renderCatalogModal();
DOM.catalogModal.style.display = 'block';
document.body.style.overflow = 'hidden';
}
DOM.edit.catalogBtn.addEventListener('click', openCatalog);
if (!REVIEW_LAYOUT) CAT.load();   // восстановление добавленных/удалённых объектов каталога между перезапусками
updateNormBadge();
updateHistoryButtons();
setTimeout(() => {
if (REVIEW_LAYOUT) toast('MASTER UI/FACADE v6 • review без изменения ваших сохранений', 4000);
else if (hadSavedLayout) toast('📂 Загружена сохранённая планировка', 3500);
else toast('💡 Кликните по объекту для карточки. «📦 Каталог» — добавить беседку, бассейн, гараж, мангал', 5500);
}, 1200);
console.log('✅ Проект Берн v5.3: озеленение v2 — банная декоративная группа, контейнеры и зелёный экран хозблока.');
