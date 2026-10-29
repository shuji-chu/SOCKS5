import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/UnrealBloomPass.js';

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer, composer, scene, camera, astronaut, stars, raf = 0, px = 0, py = 0, scroll = 0;
  const canvasId = 's5-webgl-cosmos';
  const makeSuit = () => {
    const g = new THREE.Group();
    const white = new THREE.MeshStandardMaterial({color:0xe8f4ff,metalness:.35,roughness:.4});
    const blue = new THREE.MeshStandardMaterial({color:0x285d86,metalness:.65,roughness:.25});
    const visor = new THREE.MeshPhysicalMaterial({color:0x1682b5,metalness:.8,roughness:.1,clearcoat:1,emissive:0x06476b,emissiveIntensity:.5});
    const gold = new THREE.MeshStandardMaterial({color:0xffc979,metalness:.8,roughness:.2});
    const add=(geo,mat,p,s=[1,1,1],r=[0,0,0])=>{const m=new THREE.Mesh(geo,mat);m.position.set(...p);m.scale.set(...s);m.rotation.set(...r);g.add(m);return m;};
    add(new THREE.CapsuleGeometry(.42,.7,8,16),white,[0,0,0],[.9,1,.7]);
    add(new THREE.SphereGeometry(.43,24,18),white,[0,.92,0]);
    add(new THREE.SphereGeometry(.34,24,18),visor,[0,.94,.2],[1,.76,.5]);
    add(new THREE.TorusGeometry(.4,.04,8,28),blue,[0,.92,0]);
    add(new THREE.BoxGeometry(.55,.65,.23),blue,[0,.02,-.42]);
    add(new THREE.BoxGeometry(.32,.35,.06),white,[0,.02,-.56]);
    add(new THREE.BoxGeometry(.2,.08,.025),gold,[0,.12,-.6]);
    for(const s of [-1,1]){
      add(new THREE.CapsuleGeometry(.12,.45,5,10),white,[s*.51,.05,0],[1,1,1],[0,0,s*-.32]);
      add(new THREE.SphereGeometry(.13,12,10),blue,[s*.66,-.19,.02]);
      add(new THREE.CapsuleGeometry(.1,.42,5,10),white,[s*.72,-.45,.02]);
      add(new THREE.CapsuleGeometry(.14,.36,5,10),white,[s*.22,-.68,0],[1,1,1],[0,0,s*-.1]);
      add(new THREE.BoxGeometry(.28,.14,.42),blue,[s*.22,-.91,.1]);
    }
    const lamp=new THREE.PointLight(0x56dfff,2,4);lamp.position.set(-.5,.4,1.2);g.add(lamp);
    return g;
  };
  function init() {
    const hero=document.querySelector('.s5-hero');
    if(!hero || document.getElementById(canvasId)) return;
    hero.classList.add('s5-webgl-hero');
    const canvas=document.createElement('canvas');canvas.id=canvasId;canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
    try {
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(hero.clientWidth,hero.clientHeight,false);
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
      scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x061326,.02);
      camera=new THREE.PerspectiveCamera(42,hero.clientWidth/Math.max(1,hero.clientHeight),.1,100);camera.position.z=13;
      scene.add(new THREE.AmbientLight(0x94cfff,1.4));
      const key=new THREE.DirectionalLight(0x8de0ff,3);key.position.set(-4,5,8);scene.add(key);
      const rim=new THREE.PointLight(0x386dff,26,28);rim.position.set(5,2,-2);scene.add(rim);
      const beam=new THREE.SpotLight(0x65d9ff,35,30,Math.PI/7,.7,1.4);beam.position.set(-5,7,7);beam.target.position.set(1,0,0);scene.add(beam,beam.target);
      const n=2200, pos=new Float32Array(n*3), col=new Float32Array(n*3);
      const palette=[new THREE.Color('#77cfff'),new THREE.Color('#ffffff'),new THREE.Color('#9d9bff')];
      for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*48;pos[i*3+1]=(Math.random()-.5)*28;pos[i*3+2]=(Math.random()-.5)*34;const c=palette[i%3];col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
      stars=new THREE.Points(geo,new THREE.PointsMaterial({size:.045,vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(stars);
      astronaut=makeSuit();astronaut.position.set(3.1,-.15,.2);astronaut.rotation.set(.12,-.38,-.12);scene.add(astronaut);
      const planet=new THREE.Mesh(new THREE.SphereGeometry(1.2,40,28),new THREE.MeshStandardMaterial({color:0x0b2d59,emissive:0x071b48,emissiveIntensity:.7,roughness:.7}));planet.position.set(-5,-2.8,-4);scene.add(planet);
      const halo=new THREE.Mesh(new THREE.SphereGeometry(1.28,32,24),new THREE.MeshBasicMaterial({color:0x3d9bff,transparent:true,opacity:.13,side:THREE.BackSide}));halo.position.copy(planet.position);scene.add(halo);
      composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(hero.clientWidth,hero.clientHeight),.8,.7,.16));
      const resize=()=>{const w=hero.clientWidth,h=hero.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();composer.setSize(w,h);};
      new ResizeObserver(resize).observe(hero);
      addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2},{passive:true});
      addEventListener('scroll',()=>{scroll=Math.min(1,scrollY/Math.max(1,hero.offsetHeight));},{passive:true});
      const clock=new THREE.Clock();
      const tick=()=>{raf=requestAnimationFrame(tick);const t=clock.getElapsedTime();if(!reduced){stars.rotation.y=t*.006;astronaut.position.y=-.15+Math.sin(t*.38)*.18;astronaut.rotation.z=-.12+Math.sin(t*.22)*.07;astronaut.rotation.y=-.38+Math.sin(t*.17)*.12;}camera.position.x+=(px*.38-camera.position.x)*.025;camera.position.y+=(-py*.22+scroll*.32-camera.position.y)*.025;camera.lookAt(0,0,0);composer.render();};tick();
    } catch(e) { console.warn('WebGL 不可用，保留 CSS 背景。',e);canvas.remove();hero.classList.remove('s5-webgl-hero'); }
  }
  function boot(){init();const root=document.getElementById('app-view')||document.body;new MutationObserver(()=>{if(!document.getElementById(canvasId))init();}).observe(root,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();