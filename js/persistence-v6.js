'use strict';
const v6ProjectDefaults=plainClone(BernV6.project);
BernV6.restoreProject=function(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Повреждён MASTER v6');
 for(const k of ['userNotes','projectTasks','cameras'])if(data[k]!=null&&!Array.isArray(data[k]))throw Error('Повреждён список '+k);
 const next={...plainClone(v6ProjectDefaults),...plainClone(data),schemaVersion:6};
 next.locks={...v6ProjectDefaults.locks,...data.locks};next.reviews={...data.reviews};
 next.userNotes=next.userNotes.filter(n=>typeof n.text==='string'&&Number.isFinite(n.x)&&Number.isFinite(n.z));
 next.projectTasks=next.projectTasks.filter(t=>typeof t.title==='string'&&['todo','inprogress','done','blocked'].includes(t.status));
 BernV6.project=next;
 if(next.fence&&[1.8,2].includes(next.fence.frontHeight)&&[1.5,1.8,2].includes(next.fence.neighborHeight))Object.assign(FENCE_DIMENSIONS,next.fence);
 if(next.frontPlan){const saved=next.frontPlan;if(saved.gate&&Number.isFinite(saved.gate.opening)&&saved.gate.opening>=3&&saved.gate.opening<=4.2)FRONT_SERVICE_PLAN.gate.opening=saved.gate.opening;}
 if(next.asBuilt)SLEEVES.forEach(s=>{if(next.asBuilt[s.id])s.asBuilt=plainClone(next.asBuilt[s.id]);});
 if(next.sources)PROJECT_FACTS.forEach(f=>{if(next.sources[f.id])f.source=plainClone(next.sources[f.id]);});
 if(BernV6.rebuildDynamic)BernV6.rebuildDynamic();
};
BernV6.persist=function(){if(BernV6.readOnly||!BernV6.ready)return false;try{
 BernV6.project.fence=plainClone(FENCE_DIMENSIONS);BernV6.project.frontPlan=plainClone(FRONT_SERVICE_PLAN);BernV6.project.asBuilt=Object.fromEntries(SLEEVES.map(s=>[s.id,plainClone(s.asBuilt)]));BernV6.project.sources=Object.fromEntries(PROJECT_FACTS.map(f=>[f.id,f.source]));
 const payload={schemaVersion:6,savedAt:new Date().toISOString(),project:plainClone(BernV6.project),scene:snapshotFullScene(),variants:loadVariants(),settings:projectSettingsSnapshot()};
 localStorage.setItem('bern_project_v6',JSON.stringify(payload));return true;
}catch(e){BernV6.storageError='Сохранение не выполнено: '+e.message;toast(BernV6.storageError,6000);return false;}};
if(!V6_REVIEW&&!BernV6.storageError){try{const saved=JSON.parse(localStorage.getItem('bern_project_v6')||'null');if(saved){BernV6.restoreProject(saved.project);applyFullSceneSnapshot(saved.scene);}const ui=JSON.parse(localStorage.getItem('bern_ui_v6')||'null');if(ui){for(const k of Object.keys(LAYER_DEFS))if(typeof ui.layers?.[k]==='boolean')appState.layers[k]=ui.layers[k];appState.openDrawer=ui.openDrawer||null;appState.activeView=['default','top','gate','night'].includes(ui.activeView)?ui.activeView:'default';}}catch(e){BernV6.readOnly=true;BernV6.storageError='Сохранение не загружено: '+e.message+'. Исходные данные сохранены для экспорта.';}}
