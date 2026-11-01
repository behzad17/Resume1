/* Procedural devices: no external models, trackers or additional framework. */
const stage = document.getElementById('devices-stage');
const toggle = document.getElementById('devices-toggle');
const status = document.getElementById('device-status');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const supported = document.createElement('canvas').getContext('webgl2');
const saveData = navigator.connection?.saveData;
stage.dataset.renderState = !supported ? 'no-webgl2' : saveData ? 'save-data' : 'loading';
let preference = false;
try { preference = sessionStorage.getItem('bjcode-static-hero') === 'true'; } catch (_) { /* Storage is optional. */ }
if (!supported || saveData) initCssDevices();
if (supported && !saveData) init().catch((error) => { console.warn('BJcode 3D is unavailable; using the CSS device fallback.', error); fallback(); });

function fallback() {
  initCssDevices();
  stage.dataset.renderState = 'fallback';
  stage.classList.remove('is-ready');
  toggle.hidden = false;
  status.textContent = 'طراحی هماهنگ؛ روی هر صفحه';
}
async function init() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  if (document.fonts?.ready) await document.fonts.ready;
  const compact = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: !compact, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.3 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = !compact;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true');
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34,1,.1,70);
  camera.position.set(6.3,4.4,10.5);
  camera.lookAt(.3,.45,0);
  scene.add(new THREE.HemisphereLight(0xc1e8ff,0x5483b3,3));
  function light(color,intensity,x,y,z) {
    const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);return l;
  }
  const key=light(0xeff8ff,4,3,8,5);
  key.castShadow=!compact;key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7});key.shadow.bias=-.001;
  light(0x5483b3,2,-5,3,-2);light(0xc1e8ff,1.8,4,1,-4);
  const assembly=new THREE.Group();scene.add(assembly);
  const metal=new THREE.MeshStandardMaterial({color:0x5483b3,metalness:.62,roughness:.3});
  const edge=new THREE.MeshStandardMaterial({color:0x052659,metalness:.65,roughness:.3});
  const black=new THREE.MeshStandardMaterial({color:0x021024,roughness:.4,metalness:.15});
  function rounded(w,h,d,r,material) {
    const shape=new THREE.Shape();const x=-w/2,y=-h/2;
    shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);
    shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);
    shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,curveSegments:compact?5:10});geo.translate(0,0,-d/2);
    const pos=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/w+.5,pos.getY(i)/h+.5);
    const mesh=new THREE.Mesh(geo,material);mesh.castShadow=!compact;mesh.receiveShadow=!compact;return mesh;
  }
  const laptop=new THREE.Group();assembly.add(laptop);laptop.position.set(-.45,-.35,0);laptop.rotation.y=-.09;
  const base=rounded(4.65,2.9,.13,.15,metal);base.rotation.x=-Math.PI/2;laptop.add(base);
  const deck=rounded(4.42,2.65,.018,.12,new THREE.MeshStandardMaterial({color:0x7da0ca,metalness:.5,roughness:.35}));deck.rotation.x=-Math.PI/2;deck.position.y=.079;laptop.add(deck);
  const keyboard=new THREE.Group();laptop.add(keyboard);
  const keygeo=new THREE.BoxGeometry(.255,.025,.205);
  for(let row=0;row<5;row++)for(let col=0;col<14;col++){
    const k=new THREE.Mesh(keygeo,black);k.position.set((col-6.5)*.285,.105,-1.05+row*.245);keyboard.add(k);
  }
  const space=new THREE.Mesh(new THREE.BoxGeometry(1.55,.025,.16),black);space.position.set(0,.105,.13);keyboard.add(space);
  const track=rounded(1.48,.72,.01,.07,new THREE.MeshStandardMaterial({color:0x5483b3,metalness:.55,roughness:.4}));track.rotation.x=-Math.PI/2;track.position.set(0,.1,.8);laptop.add(track);
  const front=rounded(.65,.04,.015,.018,edge);front.position.set(0,-.005,1.459);laptop.add(front);
  const lid=new THREE.Group();lid.position.set(0,.09,-1.28);lid.rotation.x=-.17;laptop.add(lid);
  const shell=rounded(4.65,2.92,.1,.14,metal);shell.position.y=1.46;lid.add(shell);
  const bezel=rounded(4.47,2.73,.016,.1,black);bezel.position.set(0,1.47,.061);lid.add(bezel);
  function texture(mobile=false) {
    const c=document.createElement('canvas');c.width=mobile?512:1280;c.height=mobile?960:800;
    const ctx=c.getContext('2d'),w=c.width;
    ctx.fillStyle='#eff8ff';ctx.fillRect(0,0,w,c.height);
    ctx.fillStyle='#fff';ctx.fillRect(0,0,w,80);
    ctx.textAlign='left';ctx.direction='ltr';ctx.fillStyle='#052659';ctx.font='800 32px Vazirmatn';ctx.fillText('</> BJcode',mobile?26:44,51);
    if(!mobile){ctx.direction='rtl';ctx.textAlign='right';ctx.fillStyle='#052659';ctx.font='22px Vazirmatn';ctx.fillText('خدمات     نمونه‌کارها     تماس',w-44,51);}
    const g=ctx.createLinearGradient(0,80,w,550);g.addColorStop(0,'#021024');g.addColorStop(.55,'#052659');g.addColorStop(1,'#052659');
    ctx.fillStyle=g;ctx.fillRect(0,80,w,mobile?535:455);
    ctx.fillStyle='#eff8ff12';ctx.beginPath();ctx.arc(w*.92,210,mobile?160:280,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#7da0ca22';ctx.beginPath();ctx.arc(w*.08,480,mobile?100:190,0,Math.PI*2);ctx.fill();
    ctx.direction='rtl';ctx.textAlign='center';
    ctx.fillStyle='#c1e8ff';ctx.font=`500 ${mobile?23:25}px Vazirmatn`;ctx.fillText('طراحی روشن. توسعهٔ خلاقانه.',w/2,mobile?151:150);
    ctx.fillStyle='#fff';ctx.font=`800 ${mobile?47:68}px Vazirmatn`;ctx.fillText('از ایدهٔ شما',w/2,mobile?246:252);
    ctx.fillStyle='#c1e8ff';ctx.font=`800 ${mobile?44:65}px Vazirmatn`;ctx.fillText('تا یک وب‌سایت ماندگار',w/2,mobile?322:340);
    ctx.fillStyle='#c1e8ff';ctx.font=`400 ${mobile?23:27}px Vazirmatn`;ctx.fillText('طراحی، توسعه و همراهی',w/2,mobile?385:395);
    ctx.fillStyle='#c1e8ff';ctx.beginPath();ctx.roundRect(w/2-127,mobile?435:437,254,60,16);ctx.fill();
    ctx.fillStyle='#052659';ctx.font='700 25px Vazirmatn';ctx.fillText('شروع همکاری  ←',w/2,mobile?474:477);
    ctx.fillStyle='#021024';ctx.font=`700 ${mobile?29:33}px Vazirmatn`;ctx.fillText('برای قدم بعدی شما',w/2,mobile?665:595);
    const colors=['#c1e8ff','#c1e8ff','#c1e8ff'],inks=['#052659','#052659','#052659'],labels=['طراحی وب‌سایت','توسعهٔ اختصاصی','پشتیبانی'];
    for(let i=0;i<3;i++){
      const cw=mobile?440:360,ch=mobile?70:126,x=mobile?36:50+i*410,y=mobile?694+i*82:626;
      ctx.fillStyle=colors[i];ctx.beginPath();ctx.roundRect(x,y,cw,ch,18);ctx.fill();
      ctx.fillStyle=inks[i];ctx.font=`700 ${mobile?27:30}px Vazirmatn`;ctx.fillText(labels[i],x+cw/2,y+ch/2+10);
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;
  }
  const screen=rounded(4.22,2.49,.005,.04,new THREE.MeshBasicMaterial({map:texture()}));screen.position.set(0,1.49,.073);lid.add(screen);
  const cam=new THREE.Mesh(new THREE.CircleGeometry(.023,12),new THREE.MeshBasicMaterial({color:0x052659}));cam.position.set(0,2.81,.073);lid.add(cam);
  const phone=new THREE.Group();phone.position.set(2.25,.95,1.1);phone.rotation.set(-.06,-.24,.08);assembly.add(phone);
  phone.add(rounded(1.2,2.49,.13,.17,new THREE.MeshStandardMaterial({color:0x5483b3,metalness:.55,roughness:.28})));
  const rim=rounded(1.12,2.40,.025,.14,black);rim.position.z=.077;phone.add(rim);
  const display=rounded(1.04,2.28,.008,.115,new THREE.MeshBasicMaterial({map:texture(true)}));display.position.z=.096;phone.add(display);
  const island=rounded(.36,.07,.012,.035,black);island.position.set(0,1.08,.108);phone.add(island);
  const homebar=rounded(.30,.025,.008,.01,black);homebar.position.set(0,-1.08,.11);phone.add(homebar);
  const sidebutton=new THREE.Mesh(new THREE.BoxGeometry(.022,.27,.055),metal);sidebutton.position.set(.61,.45,0);phone.add(sidebutton);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(35,35),new THREE.ShadowMaterial({color:0x052659,opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-.56;floor.receiveShadow=true;scene.add(floor);
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(3.7,3.8,.12,compact?48:80),new THREE.MeshStandardMaterial({color:0xc1e8ff,metalness:.15,roughness:.7}));pedestal.position.set(.2,-.5,.1);pedestal.receiveShadow=true;scene.add(pedestal);
  let width=0,height=0,visible=true,raf=0,stopped=preference,lost=false,disposed=false;
  let px=0,py=0,progress=0,last=0;
  const bounds=()=>stage.getBoundingClientRect();
  function resize(){stage.style.setProperty('--device-scale', Math.min(1.02, stage.clientWidth / 620));const r=bounds();width=r.width;height=r.height;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=camera.aspect<1.1?43:34;camera.updateProjectionMatrix();render(0);}
  function render(t){
    if(disposed||lost)return;
    const moving=!reduced.matches&&!stopped;
    const time=t*.001;
    assembly.rotation.y=moving?THREE.MathUtils.lerp(assembly.rotation.y,THREE.MathUtils.clamp(px*.8-progress*.30+Math.sin(time*.65)*.22,-.65,.65),.06):0;
    assembly.rotation.x=moving?THREE.MathUtils.lerp(assembly.rotation.x,py*.28+Math.sin(time*.5)*.055,.06):0;
    assembly.position.y=moving?THREE.MathUtils.lerp(assembly.position.y,-progress*.14,.06):0;
    phone.position.y=1.08+(moving?Math.sin(time*.95)*.22:0);
    laptop.position.y=-.35+(moving?Math.sin(time*.8+.8)*.045:0);
    phone.rotation.y=-.24+(moving?Math.sin(time*.65)*.18+px*.18:0);
    phone.rotation.z=.08+(moving?Math.sin(time*.8)*.10:0);
    renderer.render(scene,camera);
  }
  function loop(t){raf=0;if(!visible||document.hidden||stopped||lost||disposed)return;if(t-last>33){render(t);last=t;}if(!reduced.matches)raf=requestAnimationFrame(loop);}
  function wake(){if(!raf&&!stopped&&visible&&!document.hidden&&!lost&&!disposed)raf=requestAnimationFrame(loop);}
  function staticMode(value){stopped=value;cancelAnimationFrame(raf);raf=0;toggle.setAttribute('aria-pressed',String(value));toggle.textContent=value?'نمایش سه‌بعدی':'نمایش تصویر ثابت';stage.classList.toggle('is-ready',!value);status.textContent=value?'طراحی هماهنگ؛ روی هر صفحه':'طراحی واقعی، از هر زاویه';if(!value){render(0);wake();}}
  stage.addEventListener('pointermove',(e)=>{if(!finePointer.matches||reduced.matches)return;const r=bounds();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;wake();},{passive:true});
  stage.addEventListener('pointerleave',()=>{px=py=0;wake();});
  const onScroll=()=>{if(!visible||reduced.matches)return;progress=Math.min(1,Math.max(0,-bounds().top/Math.max(1,height)));wake();};
  window.addEventListener('scroll',onScroll,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;px=py=0;render(0);wake();});
  const ro=new ResizeObserver(resize);ro.observe(stage);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();});io.observe(stage);
  renderer.domElement.addEventListener('webglcontextlost',(e)=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;toggle.removeEventListener('click',onToggle);fallback();});
  const onToggle=()=>{staticMode(!stopped);try{sessionStorage.setItem('bjcode-static-hero',String(stopped));}catch(_){} };
  toggle.addEventListener('click',onToggle);
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();scene.traverse(o=>{o.geometry?.dispose();const mats=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];mats.forEach(m=>{m.map?.dispose();m.dispose();});});renderer.dispose();},{once:true});
  window.addEventListener('pageshow',(e)=>{if(e.persisted)window.location.reload();});
  stage.dataset.renderState='ready';
  resize();render(0);toggle.hidden=false;staticMode(preference);
}

function initCssDevices() {
  if (stage.dataset.cssInitialized) return;
  stage.dataset.cssInitialized = 'true';
  stage.classList.add('has-css-devices');
  let off = preference;
  const resize = () => stage.style.setProperty('--device-scale', Math.min(1.02, stage.clientWidth / 620));
  resize(); new ResizeObserver(resize).observe(stage);
  const setMode = () => {
    stage.classList.toggle('is-static',off);
    toggle.setAttribute('aria-pressed',String(off));
    toggle.textContent=off?'فعال‌کردن حرکت':'توقف حرکت';
    status.textContent='طراحی هماهنگ؛ روی هر صفحه';
  };
  toggle.hidden=false; setMode();
  toggle.addEventListener('click',()=>{off=!off;setMode();try{sessionStorage.setItem('bjcode-static-hero',String(off));}catch(_){} });
  stage.addEventListener('pointermove',(e)=>{
    if(off||reduced.matches||!finePointer.matches)return;
    const r=stage.getBoundingClientRect();
    stage.style.setProperty('--css-y',((e.clientX-r.left)/r.width-.5)*40+'deg');
    stage.style.setProperty('--css-x',((e.clientY-r.top)/r.height-.5)*-20+'deg');
    stage.style.setProperty('--css-float',((e.clientY-r.top)/r.height-.5)*-32+'px');
  },{passive:true});
  const reset=()=>{['--css-x','--css-y','--css-float','--css-scroll'].forEach(v=>stage.style.removeProperty(v));};
  stage.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
  window.addEventListener('scroll',()=>{
    if(off||reduced.matches)return;
    const r=stage.getBoundingClientRect();
    if(r.bottom<0||r.top>window.innerHeight)return;
    stage.style.setProperty('--css-scroll',Math.min(1,Math.max(0,-r.top/r.height) )*-16+'deg');
  },{passive:true});
}
