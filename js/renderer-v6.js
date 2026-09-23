'use strict';
function createBernRenderer(options={}){
 const test=document.createElement('canvas');let available=false;try{available=!!(test.getContext('webgl2')||test.getContext('webgl')||test.getContext('experimental-webgl'));}catch(e){}
 if(available)return new THREE.WebGLRenderer(options);
 BernV6.rendererMode='2d-fallback';const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','2D-план участка — WebGL недоступен');const fallback={domElement:canvas,shadowMap:{},capabilities:{getMaxAnisotropy:()=>1},info:{render:{calls:0,triangles:0},memory:{}},setSize(w,h){canvas.width=w;canvas.height=h;},setPixelRatio(){},render(){if(!BernV6.drawPlan)return;const source=BernV6.drawPlan(),c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.fillStyle='#e3e9df';c.fillRect(0,0,w,h);const scale=Math.min((w-100)/source.width,(h-120)/source.height);c.drawImage(source,(w-source.width*scale)/2,85,source.width*scale,source.height*scale);c.fillStyle='#5e705e';c.font='12px system-ui';c.fillText('WebGL недоступен · резервный 2D-вид',20,h-55);}};return fallback;
}
