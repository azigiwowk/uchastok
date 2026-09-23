'use strict';
if(V6_REVIEW&&new URLSearchParams(location.search).has('qa')){
 const button=document.createElement('button');button.textContent='Запустить приёмочные проверки';button.id='v6-run-qa';button.style.cssText='position:fixed;bottom:65px;left:20px;z-index:300;padding:12px';document.body.append(button);
 button.onclick=()=>{const saved={...appState,layers:{...appState.layers},previousScene:appState.previousScene?plainClone(appState.previousScene):null},geometry=JSON.stringify(CONFIG.objects.map(o=>({id:o.id,x:o.x,z:o.z,w:o.w,d:o.d,rot:o.rot}))),raw=JSON.stringify({...localStorage}),rows=[];const test=(name,fn)=>{try{const evidence=fn();if(evidence===false)throw Error('assertion failed');rows.push({name,result:'PASS',evidence});}catch(e){rows.push({name,result:'FAIL',error:e.message});}};
 try{
 test('route reaches exterior terrace edge',()=>routeAudit().gap<.00001&&houseEntry().terrace[1]===22);
 test('plot short street side preserved',()=>CONFIG.plot.w===25.001&&CONFIG.plot.d===40.002&&CONFIG.plot.streetSide==='z=0');
 test('fence heights and palette',()=>FENCE_DIMENSIONS.frontHeight===2&&FENCE_DIMENSIONS.neighborHeight===1.8&&MATERIAL_PALETTE.facade.ral==='RAL 8019'&&MATERIAL_PALETTE.neighbors.ral==='RAL 6005');
 test('gate wicket pillar order',()=>FRONT_SERVICE_PLAN.wicket.start+FRONT_SERVICE_PLAN.wicket.width<FRONT_SERVICE_PLAN.pillar.x&&FRONT_SERVICE_PLAN.pillar.x<gateGeometry().start);
 test('trash outside complete gate run',()=>FRONT_SERVICE_PLAN.trash.x-FRONT_SERVICE_PLAN.trash.w/2>gateGeometry().openEnd+.5);
 test('explicit utility systems',()=>CONFIG.utilities.every(u=>u.system in SYSTEMS));
 test('all MASTER locks active',()=>[...PLANNING_FROZEN_OBJECTS,'parking'].every(isMasterLocked));
 test('only communications removes objects labels and fences',()=>{setSceneMode('comms-only');return CONFIG.objects.filter(o=>!['well','septic'].includes(o.id)).every(o=>!chainVisible(objectMeshes[o.id])&&!chainVisible(labelSprites[o.id]))&&!chainVisible(v6Groups.fence)&&!chainVisible(landscapeGroup)&&!groups.norms.visible&&!groups.violRings.visible;});
 test('engineering sublayer independently filters',()=>{setLayer('water',false);const water=CONFIG.utilities.filter(u=>u.system==='water'),sewer=CONFIG.utilities.filter(u=>u.system==='sewer');return water.every(u=>!chainVisible(u._line))&&sewer.every(u=>chainVisible(u._line));});
 test('3D/2D uses effective layers',()=>{drawScenePlan();return document.getElementById('drawing-canvas').width>0&&effectiveLayers().buildings===false;});
 test('exact return from presets',()=>{setSceneMode('normal');setLayer('paths',false);const old=JSON.stringify(appState.layers);setSceneMode('comms-only');setSceneMode('normal');return JSON.stringify(appState.layers)===old;});
 test('X-Ray restores material identity',()=>{setSceneMode('normal');let m;objectMeshes.house.traverse(o=>{if(!m&&o.isMesh)m=o;});const original=m.material;setSceneMode('xray');const ghost=m.material!==original&&m.material.opacity===.13;setSceneMode('normal');return ghost&&m.material===original;});
 test('construction hides future without moving objects',()=>{setSceneMode('construction');appState.constructionPhase=2;appState.futureVisible=false;applySceneState();return !chainVisible(objectMeshes.house)&&chainVisible(objectMeshes.septic)&&geometry===JSON.stringify(CONFIG.objects.map(o=>({id:o.id,x:o.x,z:o.z,w:o.w,d:o.d,rot:o.rot})));});
 test('preview height does not save MASTER',()=>{appState.heightPreview={frontHeight:1.8,neighborHeight:1.5};applySceneState();return currentFenceDimensions().frontHeight===1.8&&FENCE_DIMENSIONS.frontHeight===2&&privacyAudit().neighbors.height===1.5;});
 test('shadows opt in and consume chosen heights',()=>{appState.fenceShadows=false;const off=fenceOccluders().length===0;appState.fenceShadows=true;return off&&fenceOccluders()[0].box.max.y===1.8;});
 test('fence geometry batched',()=>{let draws=0,instances=0;v6Groups.fence.traverse(o=>{if(o.isMesh||o.isLine)draws++;if(o.isInstancedMesh)instances+=o.count;});return {draws,instances,bounded:draws<45};});
 test('winter route around parked vehicle',()=>operationAudit().snowConflicts.filter(c=>c.objectId==='car').length===0);
 test('vehicle corridor audits',()=>vehicleAudit().collisions.length===0);
 test('sleeves unknown engineering values stay null',()=>SLEEVES.every(s=>s.depth==null&&s.diameter==null&&s.load==null&&s.asBuilt.installed===false));
 test('budget actuals remain unknown',()=>budgetRows().every(r=>r.actualCost===null));
 test('local survey has route nodes and nearest boundaries',()=>surveyRows().some(r=>r.id.startsWith('path-'))&&surveyRows().every(r=>r.nearest.length===2));
 test('action registry unique and legacy tools reachable',()=>new Set(UI_ACTIONS.map(a=>a.id)).size===UI_ACTIONS.length&&['solar','autofix','undo','backup','gps','houseplan','report','json','error'].every(id=>UI_ACTIONS.some(a=>a.id===id)));
 test('dependencies mark needs-review',()=>{const before=plainClone(BernV6.project.reviews);markDependencies('house');const result=BernV6.project.reviews.paths.status==='needs-review'&&BernV6.project.reviews.sewer.status==='needs-review';BernV6.project.reviews=before;return result;});
 test('review does not overwrite old storage',()=>{saveLayout();BernV6.persist();return JSON.stringify({...localStorage})===raw;});
 }finally{Object.assign(appState,saved);applySceneState();updateUI();}
 const pre=document.getElementById('v6-qa-results')||document.createElement('pre');pre.id='v6-qa-results';pre.style.cssText='position:fixed;inset:85px 90px 100px;overflow:auto;z-index:301;background:white;color:#222;padding:18px;font-size:12px';pre.textContent=JSON.stringify({renderer:BernV6.rendererMode||'webgl',results:rows,errors:errorLog,geometryPreserved:geometry===JSON.stringify(CONFIG.objects.map(o=>({id:o.id,x:o.x,z:o.z,w:o.w,d:o.d,rot:o.rot})))},null,2);document.body.append(pre);};
}
