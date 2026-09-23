/* MASTER UI/FACADE v6. UI state is deliberately separate from project geometry. */
'use strict';
const PROJECT_SCHEMA_VERSION = 6;
const V6_REVIEW = new URLSearchParams(location.search).get('review') === 'master-facade-ui-v6';
const SYSTEMS = {electric:'Электрика',water:'Вода',sewer:'Канализация',gas:'Газ',drainage:'Дренаж',stormwater:'Ливнёвка',irrigation:'Полив',lighting:'Освещение',lowvoltage:'Слаботочка'};
const LAYER_DEFS = {buildings:'Здания и объекты',paths:'Дорожки и площадки',fence:'Ограждения',landscape:'Озеленение',hangingBeds:'Подвесные грядки',nodes:'Инженерные узлы',comms:'Коммуникации',...SYSTEMS,objectLabels:'Названия объектов',engineeringLabels:'Инженерные подписи',zoneLabels:'Подписи зон',landscapeLabels:'Подписи посадок',fenceLabels:'Подписи ограждений',reference:'Границы / улица / север',norms:'Нормы',violations:'Нарушения',dimensions:'Размерные цепочки',serviceZones:'Сервисные зоны',rootZones:'Корневые коридоры',snow:'Снегоскладирование',snowRoute:'Маршрут снегоуборщика',vehicle:'Проверка въезда',privacy:'Линии обзора',cameraSectors:'Секторы камер',sleeves:'Резервные гильзы',servicePoints:'Сервисные точки',notes:'Заметки',diff:'Сравнение A/B'};
const BASE_LAYERS = Object.fromEntries(Object.keys(LAYER_DEFS).map(k=>[k,['buildings','paths','fence','landscape','nodes','objectLabels','reference','notes'].includes(k)||k in SYSTEMS]));
const SCENE_PRESETS = {
 normal:{...BASE_LAYERS},
 'comms-only':{nodes:true,comms:true,reference:true,sleeves:true,...Object.fromEntries(Object.keys(SYSTEMS).map(k=>[k,true]))},
 xray:{...BASE_LAYERS,comms:true,sleeves:true,objectLabels:false},
 landscape:{...BASE_LAYERS,hangingBeds:true,rootZones:true,serviceZones:true,landscapeLabels:true,objectLabels:false},
 fence:{...BASE_LAYERS,fenceLabels:true,objectLabels:false,landscapeLabels:false},
 construction:{...BASE_LAYERS,comms:true},
 'clean-plan':{buildings:true,paths:true,fence:true,reference:true,dimensions:true},
 winter:{...BASE_LAYERS,snow:true,snowRoute:true,objectLabels:false,landscape:false},
 privacy:{...BASE_LAYERS,privacy:true,objectLabels:false},
 'night-facade':{...BASE_LAYERS,lighting:true,servicePoints:true,objectLabels:false}
};
const appState = {sceneMode:'normal',activeView:'default',openDrawer:null,layers:{...BASE_LAYERS},selectedObjectId:null,constructionPhase:7,futureVisible:true,xray:false,gateOpen:false,trashOpen:false,fenceShadows:false,heightPreview:null,pdfScope:'current',drawingPreset:'current',search:'',previousScene:null};
const UI_ACTIONS = [];
const BernV6 = {ready:false,readOnly:V6_REVIEW,storageError:null,emit(){document.dispatchEvent(new CustomEvent('bern:state'));},saveUI(){if(V6_REVIEW)return;try{localStorage.setItem('bern_ui_v6',JSON.stringify({layers:appState.previousScene?.layers||appState.layers,openDrawer:appState.openDrawer,activeView:appState.activeView}));}catch(e){this.storageError=e.message;}},registerAction(a){if(UI_ACTIONS.some(x=>x.id===a.id))throw Error('Duplicate action '+a.id);UI_ACTIONS.push(a);},run(id){const a=UI_ACTIONS.find(a=>a.id===id);if(a)a.run();}};
window.BernV6=BernV6;
function effectiveLayers(){const l={...appState.layers};if(appState.sceneMode==='comms-only')for(const k of Object.keys(l))if(!(k in SCENE_PRESETS['comms-only'])&&k!=='engineeringLabels')l[k]=false;for(const k of Object.keys(SYSTEMS))l[k]=!!l.comms&&!!l[k];return l;}
function setLayer(id,on){if(!(id in LAYER_DEFS))return;appState.layers[id]=!!on;BernV6.emit();BernV6.saveUI();}
function setSceneMode(mode){if(!(mode in SCENE_PRESETS))return;if(mode==='normal'&&appState.previousScene){appState.layers={...appState.previousScene.layers};appState.activeView=appState.previousScene.activeView;appState.previousScene=null;}else{if(appState.sceneMode==='normal'&&mode!=='normal')appState.previousScene={layers:{...appState.layers},activeView:appState.activeView};appState.layers=Object.fromEntries(Object.keys(LAYER_DEFS).map(k=>[k,!!SCENE_PRESETS[mode][k]]));}appState.sceneMode=mode;appState.xray=mode==='xray';BernV6.emit();}
function setDrawer(id){appState.openDrawer=appState.openDrawer===id?null:id;BernV6.emit();BernV6.saveUI();}
function isMasterLocked(id){return !!BernV6.project?.locks?.[id];}
