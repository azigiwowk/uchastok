'use strict';
const LayerManager={groups:{},register(id,node){node.userData.layer=id;this.groups[id]??=[];this.groups[id].push(node);return node;},group(id){const g=new THREE.Group();scene.add(g);return this.register(id,g);}};
const v6Groups={};
for(const key of ['reference','paths','fence','hangingBeds','snow','snowRoute','serviceZones','rootZones','vehicle','privacy','cameraSectors','sleeves','servicePoints','notes','diff','fenceLabels'])v6Groups[key]=LayerManager.group(key);
const originalGroundMaterial=ground.material;
const neutralGroundMaterial=new THREE.MeshStandardMaterial({color:0xced5d4,roughness:1});
LayerManager.register('reference',ground);LayerManager.register('reference',road);LayerManager.register('reference',roadLabel);
[accessLane,parkingPad,servicePadMesh].forEach(x=>LayerManager.register('paths',x));LayerManager.register('landscape',landscapeGroup);LayerManager.register('landscape',lawnReserve);
[parkingLabel,serviceLabel,lawnLabel,guestParkingLabel].forEach(x=>LayerManager.register('zoneLabels',x));
groups.labels.children.forEach(x=>{if(!x.userData.layer)LayerManager.register('engineeringLabels',x);else if(!Object.values(LayerManager.groups).some(a=>a.includes(x)))LayerManager.register(x.userData.layer,x);});
scene.children.forEach(x=>{if(x.userData.fixedInfrastructure)LayerManager.register('nodes',x);else if(x.userData.layer==='reference'&&!LayerManager.groups.reference.includes(x))LayerManager.register('reference',x);});
groups.site.children.forEach(x=>{if(x.userData.layer==='reference'&&!LayerManager.groups.reference.includes(x))LayerManager.register('reference',x);});
CONFIG.utilities.forEach((u,i)=>{u.id??='utility-'+i;u.phase=2;u._line.userData.system=u.system;u._shadow.userData.system=u.system;if(u._label){u._label.userData.system=u.system;u._label.userData.layer='engineeringLabels';}});
function v6Line(group,points,color,y=.075,dashed=false){const mat=dashed?new THREE.LineDashedMaterial({color,dashSize:.28,gapSize:.18}):new THREE.LineBasicMaterial({color});const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(p[0],y,p[1]))),mat);if(dashed)line.computeLineDistances();line.userData.v6Owned=true;group.add(line);return line;}
function v6Label(group,text,x,z,y=.5){const l=Utils.createLabel(text,'#f8fafb',.42,[7,1.15],640,110,26,'rgba(25,40,40,.82)');l.position.set(x,y,z);l.userData.v6Owned=true;group.add(l);return l;}
function v6Box(group,w,h,d,x,y,z,color,opacity=1){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.8,transparent:opacity<1,opacity,depthWrite:opacity===1}));m.position.set(x,y,z);m.userData.v6Owned=true;group.add(m);return m;}
function v6Zone(group,zone,color){const p=v6Box(group,zone.w,.018,zone.d,zone.x,.09,zone.z,color,.22);v6Line(group,[[zone.x-zone.w/2,zone.z-zone.d/2],[zone.x+zone.w/2,zone.z-zone.d/2],[zone.x+zone.w/2,zone.z+zone.d/2],[zone.x-zone.w/2,zone.z+zone.d/2],[zone.x-zone.w/2,zone.z-zone.d/2]],color,.12,true);return p;}
function clearV6(group){const mats=new Set(),geos=new Set();group.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});group.clear();geos.forEach(g=>g.dispose());mats.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}
v6Line(v6Groups.reference,[[0,0],[CONFIG.plot.w,0],[CONFIG.plot.w,CONFIG.plot.d],[0,CONFIG.plot.d],[0,0]],0x647c79,.06);
const fenceMaterials={front:new THREE.MeshStandardMaterial({color:MATERIAL_PALETTE.facade.color,roughness:.94,metalness:.16,side:THREE.DoubleSide}),neighbor:new THREE.MeshStandardMaterial({color:MATERIAL_PALETTE.neighbors.color,roughness:.85})};
let gateLeafV6=null,lastFenceKey='';
function currentFenceDimensions(){return appState.heightPreview||FENCE_DIMENSIONS;}
function louverGeometry(){const positions=[];const profile=[[.044,.065],[.038,.035],[-.038,-.035],[-.044,-.065]];for(let i=1;i<profile.length;i++){const [a,b]=[profile[i-1],profile[i]];positions.push(-.5,a[0],a[1],.5,a[0],a[1],.5,b[0],b[1],-.5,a[0],a[1],.5,b[0],b[1],-.5,b[0],b[1]);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.computeVertexNormals();return geo;}
function addLouvers(group,runs,height,double=true){const rows=Math.floor((height-.14)/.11),layers=double?2:1;const mesh=new THREE.InstancedMesh(louverGeometry(),fenceMaterials.front.clone(),runs.length*rows*layers);const d=new THREE.Object3D();let i=0;for(const run of runs)for(let layer=0;layer<layers;layer++)for(let r=0;r<rows;r++){d.position.set((run[0]+run[1])/2,.10+r*.11+layer*.048,layer*.17);d.scale.set(run[1]-run[0],1,1);d.updateMatrix();mesh.setMatrixAt(i++,d.matrix);}mesh.instanceMatrix.needsUpdate=true;mesh.userData.fenceSurface=true;mesh.castShadow=appState.fenceShadows;mesh.receiveShadow=false;group.add(mesh);return mesh;}
function buildFence(){const g=v6Groups.fence;clearV6(g);clearV6(v6Groups.fenceLabels);const H=currentFenceDimensions(),f=FRONT_SERVICE_PLAN,gate=gateGeometry();
 const frontRuns=[[0,f.wicket.start-.08],[gate.end+.15,CONFIG.plot.w]];
 addLouvers(g,frontRuns,H.frontHeight,true);
 const posts=[];for(const [a,b] of frontRuns)for(let x=a;x<=b+.01;x+=Math.max(.1,(b-a)/Math.ceil((b-a)/2.5)))posts.push([x,H.frontHeight/2,0,.08,H.frontHeight,.08]);
 for(const [x,z] of [[f.wicket.start-.04,0],[gate.start-.08,0],[gate.end+.08,0]])posts.push([x,H.frontHeight/2,z,.10,H.frontHeight,.12]);
 for(const side of ['left','right','rear']){const len=side==='rear'?CONFIG.plot.w:CONFIG.plot.d;for(let t=0;t<=len+.001;t+=len/Math.ceil(len/2.5))posts.push([side==='left'?0:side==='right'?CONFIG.plot.w:t,H.neighborHeight/2,side==='rear'?CONFIG.plot.d:t,.06,H.neighborHeight,.06]);}
 const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),fenceMaterials.neighbor.clone(),posts.length),dummy=new THREE.Object3D();posts.forEach((p,i)=>{dummy.position.set(...p.slice(0,3));dummy.scale.set(...p.slice(3));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(p[2]===0?MATERIAL_PALETTE.facade.color:MATERIAL_PALETTE.neighbors.color));});mesh.instanceMatrix.needsUpdate=true;g.add(mesh);
 // Three welded meshes in ONE draw call, with shallow V-bends; no per-wire cylinders.
 const verts=[];const point=(side,t,y)=>{const bend=(y>.26&&y<.47)||(y>H.neighborHeight-.5&&y<H.neighborHeight-.28)?.055:0;return side==='left'?[bend,y,t]:side==='right'?[CONFIG.plot.w-bend,y,t]:[t,y,CONFIG.plot.d-bend];};
 for(const side of ['left','right','rear']){const len=side==='rear'?CONFIG.plot.w:CONFIG.plot.d;for(let t=0;t<=len;t+=.15){const levels=[.04,.26,.36,.47,H.neighborHeight-.5,H.neighborHeight-.39,H.neighborHeight-.28,H.neighborHeight];for(let i=1;i<levels.length;i++)verts.push(...point(side,t,levels[i-1]),...point(side,t,levels[i]));}for(let y=.04;y<=H.neighborHeight;y+=.2)verts.push(...point(side,0,y),...point(side,len,y));}
 const gridGeo=new THREE.BufferGeometry();gridGeo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.add(new THREE.LineSegments(gridGeo,new THREE.LineBasicMaterial({color:MATERIAL_PALETTE.neighbors.color,transparent:true,opacity:.8})));
 gateLeafV6=new THREE.Group();g.add(gateLeafV6);addLouvers(gateLeafV6,[[gate.start,gate.end]],H.frontHeight,false);
 v6Box(gateLeafV6,f.gate.opening,.075,.075,(gate.start+gate.end)/2,.04,.15,MATERIAL_PALETTE.facade.color);
 v6Box(gateLeafV6,f.gate.opening,.06,.075,(gate.start+gate.end)/2,H.frontHeight-.03,.15,MATERIAL_PALETTE.facade.color);
 const tail=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(gate.end,H.frontHeight-.06,.12),new THREE.Vector3(gate.end+f.gate.tail,.06,.12),new THREE.Vector3(gate.end,.06,.12)]),new THREE.LineBasicMaterial({color:MATERIAL_PALETTE.facade.color}));gateLeafV6.add(tail);
 addLouvers(g,[[f.wicket.start,f.wicket.start+f.wicket.width]],H.frontHeight,false);
 v6Box(g,.3,H.frontHeight,.34,f.pillar.x,H.frontHeight/2,.04,MATERIAL_PALETTE.facade.color);
 v6Box(g,.22,.3,.045,f.pillar.x,1.36,-.15,0x171d1e);v6Box(g,.22,.10,.08,f.pillar.x,.95,-.19,0xa79c84);
 const num=Utils.createLabel('7','#fff1d5',.19,[1.2,1.5],96,128,72,'#403a3a',2);num.position.set(f.pillar.x,1.72,-.18);g.add(num);
 v6Box(g,.36,.48,.36,gate.end+.43,.24,.63,0x656461);
 [gate.start-.08,gate.end+.08].forEach(x=>v6Box(g,.10,.10,.10,x,.55,-.12,0x1b292a));
 v6Box(g,.12,.14,.12,gate.end+.08,H.frontHeight+.07,0,0xe2a542);
 v6Box(g,.22,.14,.2,gate.end+.12,H.frontHeight+.25,.02,0x2c3434);
 // Niche is beyond open leaf + assumed tail + 0.5 m service reserve.
 const t=f.trash;v6Box(g,t.w,1.15,.06,t.x,.575,t.z+t.d/2,MATERIAL_PALETTE.facade.color);for(const x of [t.x-t.w/2,t.x+t.w/2])v6Box(g,.06,1.15,t.d,x,.575,t.z,MATERIAL_PALETTE.facade.color);
 for(let i=0;i<t.containers;i++){const x=t.x+(i-.5)*.54;v6Box(g,.46,.8,.52,x,.42,t.z,0x36594f);v6Box(g,.49,.04,.56,x,.84,t.z,0x263d35);}
 v6Label(v6Groups.fenceLabels,'Жалюзи · 2 слоя · '+H.frontHeight.toFixed(1)+' м · RAL 8019',5,0,2.5);v6Label(v6Groups.fenceLabels,'3D-сетка · '+H.neighborHeight.toFixed(1)+' м · RAL 6005',.3,26,2.4);v6Label(v6Groups.fenceLabels,'Калитка / пилон / откат →',14,0,3);v6Label(v6Groups.fenceLabels,'Мусор · выкат к улице',t.x,t.z,1.7);
 const neutral=objectMeshes.canopy;neutral?.traverse(m=>{if(m.isMesh&&m.material&&!m.material.transparent){m.material=m.material.clone();m.material.color.setHex(MATERIAL_PALETTE.facade.color);}});
 lastFenceKey=JSON.stringify(H);}
function updatePaths3D(){groups.site.children.filter(m=>m.userData.pathId).forEach(m=>{const p=LAYOUT_PATHS.find(p=>p.id===m.userData.pathId);if(!p)return;const dx=p.b[0]-p.a[0],dz=p.b[1]-p.a[1];m.geometry=new THREE.BoxGeometry(p.width,.05,Math.hypot(dx,dz));m.position.set((p.a[0]+p.b[0])/2,.025,(p.a[1]+p.b[1])/2);m.rotation.y=Math.atan2(dx,dz);});}
let houseDoor=null;
function rebuildDynamic(){updateHouseRoute();updatePaths3D();if(houseDoor){houseDoor.parent.remove(houseDoor);houseDoor.geometry.dispose();houseDoor.material.dispose();}const h=Norms.obj('house');houseDoor=v6Box(objectMeshes.house,1,2.1,.045,.7,1.1,-h.d/2-.03,0x514139);houseDoor.userData.entry='house';
 for(const k of ['hangingBeds','snow','snowRoute','serviceZones','rootZones','vehicle','privacy','cameraSectors','sleeves','servicePoints','notes'])clearV6(v6Groups[k]);
 HANGING_BEDS.zones.forEach(z=>{v6Zone(v6Groups.hangingBeds,z,0x87ab65);for(let i=0;i<3;i++)v6Box(v6Groups.hangingBeds,z.w>.6?.7:.38,.26,z.d>.6?.8:.38,z.x+(z.w>.6?(i-1):0),1.05,z.z+(z.d>.6?(i-1)*2:0),0xa4906f,.6);});
 v6Zone(v6Groups.snow,FRONT_SERVICE_PLAN.snowMain,0x65b7e6);v6Label(v6Groups.snow,'Основной снег · без соли',2,2.5);
 v6Zone(v6Groups.snow,FRONT_SERVICE_PLAN.snowRight,0x8bd3e9);v6Label(v6Groups.snow,'Малый снег',23.9,2.35);
 const clear=gateGeometry().clear;v6Zone(v6Groups.snow,clear,0xf3b25c);v6Label(v6Groups.snow,'Откат: держать свободным зимой',19.7,.5);
 v6Line(v6Groups.snowRoute,snowBlowerRoute(),0x2487df,.16);v6Label(v6Groups.snowRoute,'Снегоуборщик · ширину уточнить',17,2.4);
 // Small lawn strips accept pedestrian snow, never the play area / planted beds.
 for(const z of [{x:13.8,z:20.1,w:.8,d:2},{x:12.65,z:14.8,w:.5,d:1}])v6Zone(v6Groups.snow,z,0xaad8ef);
 serviceZones().forEach(z=>{const r=z.radius??z.previewRadius;v6Line(v6Groups.serviceZones,Array.from({length:49},(_,i)=>[z.x+r*Math.cos(i*Math.PI/24),z.z+r*Math.sin(i*Math.PI/24)]),0xffb05c,.13,true);v6Label(v6Groups.serviceZones,z.id+' · '+(z.radius==null?'радиус?':r+' м'),z.x,z.z);});
 CONFIG.utilities.forEach(u=>{const pts=utilityPoints(u),buffer=BernV6.project.rootBuffer??.4;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);const m=v6Box(v6Groups.rootZones,buffer*2,.015,len,(a[0]+b[0])/2,.08,(a[1]+b[1])/2,0xdd9c52,.16);m.rotation.y=Math.atan2(dx,dz);}});
 const veh=BernV6.project.vehicle,w=veh.width??1.9,len=veh.length??4.7;for(const z of [-3,2,6])v6Zone(v6Groups.vehicle,{x:14.5,z,w,d:len},0x459dad);v6Line(v6Groups.vehicle,[[14.5,-6],[14.5,8.8]],0x3c8994);
 for(const [side,start] of [['улица',[12.5,-4]],['слева',[-2,18]],['справа',[27,18]],['сзади',[12.5,42]]])for(const dest of [houseEntry().terrace,objectAnchorPoint(Norms.obj('bath'),{side:'north',outward:2}),[Norms.obj('firepit').x,Norms.obj('firepit').z],[14.5,15.5]])v6Line(v6Groups.privacy,[start,dest],side==='улица'?0x987b55:0x588b73,.9,true);
 BernV6.project.cameras.forEach(c=>{const pts=[[c.x,c.z]];for(let i=0;i<=20;i++){const a=(c.angle-c.fov/2+c.fov*i/20)*Math.PI/180;pts.push([c.x+Math.sin(a)*c.range,c.z+Math.cos(a)*c.range]);}pts.push([c.x,c.z]);v6Line(v6Groups.cameraSectors,pts,0x9168c9,.2,true);});
 SLEEVES.forEach(s=>{const line=v6Line(v6Groups.sleeves,[s.start,s.end],0xb39bd3,.18,true);line.userData.system=s.system;line.userData.reserveId=s.id;});
 SERVICE_POINTS.forEach(p=>{const pt=objectAnchorPoint(Norms.obj(p.obj),{side:p.side});v6Box(v6Groups.servicePoints,.22,.3,.18,pt[0],.6,pt[1],0xdfbc6d);v6Label(v6Groups.servicePoints,p.purpose,pt[0],pt[1],1.1);});
 BernV6.project.userNotes.forEach(n=>v6Label(v6Groups.notes,n.text,n.x,n.z,.7));
 applySceneState();}
const materialStates=new WeakMap();
function applyOpacity(root,opacity){root.traverse(o=>{if(!o.isMesh)return;let saved=materialStates.get(o);if(opacity<1){if(!saved){const original=o.material;const materials=(Array.isArray(original)?original:[original]).map(m=>{const c=m.clone();c.transparent=true;c.depthWrite=false;return c;});saved={original,clone:Array.isArray(original)?materials:materials[0]};materialStates.set(o,saved);}o.material=saved.clone;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.opacity=opacity);}else if(saved)o.material=saved.original;});}
function phaseOpacity(phase){if(appState.sceneMode!=='construction')return 1;if(phase<=appState.constructionPhase)return 1;return appState.futureVisible?.12:0;}
function applySceneState(){const l=effectiveLayers();groups.site.visible=groups.house.visible=groups.labels.visible=groups.objectLabels.visible=groups.comms.visible=true;
 for(const [key,nodes] of Object.entries(LayerManager.groups))for(const n of nodes)n.visible=!!l[key];
 CONFIG.objects.forEach(o=>{const node=['well','septic'].includes(o.id),key=node?'nodes':'buildings',opacity=phaseOpacity(PHASE_BY_ID[o.id]??7);const mesh=objectMeshes[o.id];if(mesh){mesh.visible=!!l[key]&&opacity>0;applyOpacity(mesh,appState.xray&&!node?.13:opacity);}if(labelSprites[o.id])labelSprites[o.id].visible=!!l[node?'engineeringLabels':'objectLabels']&&!!l[key]&&opacity>0;});
 groups.site.children.filter(c=>c.userData.pathId).forEach(c=>{c.visible=!!l.paths&&phaseOpacity(5)>0;applyOpacity(c,phaseOpacity(5));});
 groups.comms.children.forEach(c=>{c.visible=c.userData.system?!!l[c.userData.system]:!!l.nodes;});
 CONFIG.utilities.forEach(u=>{u._line.visible=u._shadow.visible=!!l[u.system]&&phaseOpacity(2)>0;u._label&&(u._label.visible=!!l[u.system]&&!!l.engineeringLabels);});
 v6Groups.sleeves.children.forEach(c=>c.visible=!!l[c.userData.system]);
 groups.norms.visible=!!l.norms;groups.violRings.visible=!!l.violations;
 if(insolationMesh)insolationMesh.visible=insolationOn&&appState.sceneMode!=='comms-only';if(solarGroup)solarGroup.visible=solarOn&&!!l.buildings;
 if(snowCaps)snowCaps.visible=!!l.buildings;if(snowfall)snowfall.visible=appState.sceneMode!=='comms-only';
 ground.material=appState.sceneMode==='comms-only'?neutralGroundMaterial:originalGroundMaterial;
 if(appState.sceneMode==='comms-only'){hideCommInfo();clearMeasure(true);}
 if(JSON.stringify(currentFenceDimensions())!==lastFenceKey)buildFence();
 gateLeafV6.position.x=appState.gateOpen?FRONT_SERVICE_PLAN.gate.opening:0;
 v6Groups.fence.traverse(o=>{if(o.isMesh)o.castShadow=appState.fenceShadows;});
 ['paths','fence','landscape','hangingBeds'].forEach(k=>{const ph=k==='landscape'?7:k==='hangingBeds'?6:5;const op=phaseOpacity(ph);if(v6Groups[k]){v6Groups[k].visible=!!l[k]&&op>0;applyOpacity(v6Groups[k],op);}});
 const night=appState.sceneMode==='night-facade';nightLights.visible=night;nightLights.children.forEach(c=>c.visible=night);
 if(night!==applySceneState.wasNight){DOM.hourSlider.value=night?'22':'12';updateSun();applySceneState.wasNight=night;}
 DOM.toggleComm.textContent=appState.sceneMode==='comms-only'?'Вернуть обычный вид':'Только коммуникации';
 renderer.shadowMap.needsUpdate=true;Utils.markDirty();}
const nightLights=new THREE.Group();scene.add(nightLights);for(const [x,z] of [[12.3,.2],[16.6,.4],[21,2.8],[14.5,6]]){const light=new THREE.PointLight(0xffdeb0,.5,5,2);light.position.set(x,1.9,z);light.castShadow=false;nightLights.add(light);}
function privacyAudit(){const h=currentFenceDimensions();return {front:{height:h.frontHeight,assessment:h.frontHeight>=2?'Прямой обзор с уровня глаз снижен двойными ламелями; верхние точки требуют проверки':'Ниже рабочей высоты: приватность снижена'},neighbors:{height:h.neighborHeight,assessment:'3D-сетка прозрачна при любой выбранной высоте; высота не заменяет озеленение'},status:'qualitative',viewerHeight:1.6};}
function operationAudit(){const t=FRONT_SERVICE_PLAN.trash,g=gateGeometry();const route=snowBlowerRoute(),width=BernV6.project.snowBlowerWidth;const issues=[];if(t.x-t.w/2<=g.openEnd+.5)issues.push('Мусорная ниша пересекает откат / сервисный резерв');if(width==null)issues.push('Ширина снегоуборщика не задана; проходимость не подтверждена');else if(width>1)issues.push('Ширина снегоуборщика превышает калитку 1 м');if(BernV6.project.vehicle.width==null||BernV6.project.vehicle.length==null)issues.push('Габариты автомобиля не заданы; тестовые позиции условны');return {trashClearance:t.x-t.w/2-g.openEnd,routeWidth:Math.min(...LAYOUT_PATHS.filter(p=>p.id.startsWith('wicket')).map(p=>p.width)),route,issues};}
BernV6.rebuildDynamic=rebuildDynamic;BernV6.applySceneState=applySceneState;
buildFence();rebuildDynamic();document.addEventListener('bern:state',applySceneState);
