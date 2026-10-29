import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/postprocessing/UnrealBloomPass.js';

(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvasId = 's5-webgl-cosmos';
  let renderer, composer, scene, camera, astronaut, stars, nebula, raf = 0;
  let px = 0, py = 0, scroll = 0, resizeObserver;
  const palette = ['#00F0FF', '#F0F4F8', '#64FFDA', '#9ACBFF'];

  function makeAstronaut() {
    const g = new THREE.Group();
    const suit = new THREE.MeshStandardMaterial({color:0xF0F4F8, metalness:.28, roughness:.34, emissive:0x092b36, emissiveIntensity:.24});
    const trim = new THREE.MeshStandardMaterial({color:0x64FFDA, metalness:.58, roughness:.25, emissive:0x00F0FF, emissiveIntensity:.7});
    const dark = new THREE.MeshStandardMaterial({color:0x0A192F, metalness:.8, roughness:.19, emissive:0x062c3b, emissiveIntensity:.6});
    const visor = new THREE.MeshPhysicalMaterial({color:0x00AFCB, metalness:.72, roughness:.09, clearcoat:1, clearcoatRoughness:.06, emissive:0x00F0FF, emissiveIntensity:.48, transparent:true, opacity:.96});
    const add = (geo, mat, p, s=[1,1,1], r=[0,0,0]) => {
      const m = new THREE.Mesh(geo,mat); m.position.set(...p); m.scale.set(...s); m.rotation.set(...r); g.add(m); return m;
    };
    add(new THREE.CapsuleGeometry(.42,.7,8,16),suit,[0,0,0],[.9,1,.7]);
    add(new THREE.SphereGeometry(.43,28,22),suit,[0,.92,0]);
    add(new THREE.SphereGeometry(.34,28,22),visor,[0,.94,.2],[1,.76,.5]);
    add(new THREE.TorusGeometry(.4,.035,10,36),trim,[0,.92,0]);
    add(new THREE.BoxGeometry(.55,.65,.23),dark,[0,.02,-.42]);
    add(new THREE.BoxGeometry(.32,.35,.06),suit,[0,.02,-.56]);
    add(new THREE.BoxGeometry(.2,.08,.025),trim,[0,.12,-.6]);
    for (const side of [-1,1]) {
      add(new THREE.CapsuleGeometry(.12,.45,5,12),suit,[side*.51,.05,0],[1,1,1],[0,0,side*-.32]);
      add(new THREE.SphereGeometry(.13,14,12),trim,[side*.66,-.19,.02]);
      add(new THREE.CapsuleGeometry(.1,.42,5,12),suit,[side*.72,-.45,.02]);
      add(new THREE.CapsuleGeometry(.14,.36,5,12),suit,[side*.22,-.68,0],[1,1,1],[0,0,side*-.1]);
      add(new THREE.BoxGeometry(.28,.14,.42),dark,[side*.22,-.91,.1]);
    }
    const light = new THREE.PointLight(0x00F0FF,2.6,5); light.position.set(-.5,.4,1.2); g.add(light);
    const whiteLight = new THREE.PointLight(0xF0F4F8,1.2,4); whiteLight.position.set(.6,1,1); g.add(whiteLight);
    return g;
  }

  function makeNebula() {
    const group = new THREE.Group();
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms:{uTime:{value:0}},
      vertexShader:`varying vec2 vUv; varying float vDepth; void main(){vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vDepth=-mv.z; gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`uniform float uTime; varying vec2 vUv; varying float vDepth;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
        void main(){vec2 p=(vUv-.5)*2.0;float r=length(p);float n=noise(p*3.2+uTime*.025)*.55+noise(p*7.0-uTime*.018)*.25+noise(p*13.0)*.2;float cloud=(1.0-smoothstep(.12,.95,r))*smoothstep(.28,.92,n);float wisps=smoothstep(.35,.8,noise(p*5.0+vec2(uTime*.015,-uTime*.02)));float a=(cloud*.13+wisps*cloud*.09)*(1.0-smoothstep(4.,42.,vDepth));vec3 c=mix(vec3(.0,.16,.27),vec3(.0,.94,1.0),n);c=mix(c,vec3(.39,1.0,.85),smoothstep(.65,.94,n)*.55);gl_FragColor=vec4(c,a);}`,
      transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(42,25,1,1),cloudMaterial);
    plane.position.set(0,0,-15); group.add(plane);
    const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(34,20,1,1),cloudMaterial.clone());
    plane2.position.set(-7,2,-23); plane2.rotation.z=.23; plane2.material.uniforms.uTime.value=6; group.add(plane2);
    return group;
  }

  function init() {
    const hero = document.querySelector('.s5-hero');
    if (!hero || document.getElementById(canvasId)) return;
    hero.classList.add('s5-webgl-hero');
    const canvas = document.createElement('canvas');
    canvas.id = canvasId; canvas.setAttribute('aria-hidden','true'); hero.prepend(canvas);
    try {
      renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      renderer.setSize(hero.clientWidth,hero.clientHeight,false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#050B14');
      scene.fog = new THREE.FogExp2(0x071326,.012);
      camera = new THREE.PerspectiveCamera(43,hero.clientWidth/Math.max(1,hero.clientHeight),.1,120);
      camera.position.set(0,0,13);
      scene.add(new THREE.AmbientLight(0x8abed5,1.35));
      const key = new THREE.DirectionalLight(0xF0F4F8,2.8); key.position.set(-4,5,8); scene.add(key);
      const cyan = new THREE.PointLight(0x00F0FF,30,34); cyan.position.set(5,2,-1); scene.add(cyan);
      const ice = new THREE.PointLight(0x64FFDA,17,28); ice.position.set(-5,-2,1); scene.add(ice);
      const beam = new THREE.SpotLight(0x00F0FF,38,38,Math.PI/6,.72,1.2);
      beam.position.set(-5,7,7); beam.target.position.set(1,0,0); scene.add(beam,beam.target);

      nebula = makeNebula(); scene.add(nebula);
      const count = window.innerWidth < 700 ? 1350 : 2600;
      const positions = new Float32Array(count*3), colors = new Float32Array(count*3), sizes = new Float32Array(count);
      const colorObjects = palette.map(c=>new THREE.Color(c));
      for(let i=0;i<count;i++){
        positions[i*3]=(Math.random()-.5)*54;
        positions[i*3+1]=(Math.random()-.5)*32;
        positions[i*3+2]=(Math.random()-.5)*48;
        const c=colorObjects[Math.floor(Math.random()*colorObjects.length)];
        colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
        sizes[i]=.5+Math.random()*1.6;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
      starGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
      starGeo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
      stars = new THREE.Points(starGeo,new THREE.PointsMaterial({size:.075,vertexColors:true,transparent:true,opacity:.96,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true}));
      scene.add(stars);

      const dustCount = window.innerWidth < 700 ? 360 : 850;
      const dustPos = new Float32Array(dustCount*3), dustCol = new Float32Array(dustCount*3);
      for(let i=0;i<dustCount;i++){
        dustPos[i*3]=(Math.random()-.5)*28; dustPos[i*3+1]=(Math.random()-.5)*16; dustPos[i*3+2]=(Math.random()-.5)*22;
        const c=colorObjects[i%3]; dustCol[i*3]=c.r;dustCol[i*3+1]=c.g;dustCol[i*3+2]=c.b;
      }
      const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));dustGeo.setAttribute('color',new THREE.BufferAttribute(dustCol,3));
      const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({size:.025,vertexColors:true,transparent:true,opacity:.48,blending:THREE.AdditiveBlending,depthWrite:false}));
      scene.add(dust);

      astronaut = makeAstronaut(); astronaut.position.set(3.05,-.12,.3); astronaut.scale.setScalar(.92);
      astronaut.rotation.set(.12,-.38,-.12); scene.add(astronaut);

      const planetMat=new THREE.MeshStandardMaterial({color:0x0A192F,emissive:0x052f4a,emissiveIntensity:1.1,roughness:.72,metalness:.2});
      const planet=new THREE.Mesh(new THREE.SphereGeometry(1.65,48,32),planetMat);planet.position.set(-5.1,-2.8,-5.5);scene.add(planet);
      const halo=new THREE.Mesh(new THREE.SphereGeometry(1.82,40,32),new THREE.MeshBasicMaterial({color:0x00F0FF,transparent:true,opacity:.12,side:THREE.BackSide,blending:THREE.AdditiveBlending}));halo.position.copy(planet.position);scene.add(halo);
      const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.69,40,32),new THREE.MeshBasicMaterial({color:0x64FFDA,transparent:true,opacity:.13,side:THREE.BackSide,blending:THREE.AdditiveBlending}));atmosphere.position.copy(planet.position);scene.add(atmosphere);

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene,camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(hero.clientWidth,hero.clientHeight),1.35,.78,.08);
      composer.addPass(bloom);
      const resize=()=>{
        const w=hero.clientWidth,h=hero.clientHeight;if(!w||!h)return;
        renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();composer.setSize(w,h);
        bloom.setSize(w,h);
      };
      resizeObserver = new ResizeObserver(resize); resizeObserver.observe(hero);
      window.addEventListener('pointermove',e=>{px=(e.clientX/window.innerWidth-.5)*2;py=(e.clientY/window.innerHeight-.5)*2},{passive:true});
      window.addEventListener('scroll',()=>{scroll=Math.min(1,window.scrollY/Math.max(1,hero.offsetHeight))},{passive:true});
      const clock=new THREE.Clock();
      const tick=()=>{
        raf=requestAnimationFrame(tick);
        const t=clock.getElapsedTime();
        if(nebula) nebula.children.forEach((p,i)=>{if(p.material.uniforms?.uTime)p.material.uniforms.uTime.value=t+i*5;});
        if(!reduced){
          stars.rotation.y=t*.004;stars.rotation.x=Math.sin(t*.07)*.015;
          dust.rotation.y=-t*.009;dust.rotation.x=t*.003;
          astronaut.position.y=-.12+Math.sin(t*.42)*.17;
          astronaut.rotation.z=-.12+Math.sin(t*.22)*.065;
          astronaut.rotation.y=-.38+Math.sin(t*.17)*.12;
          halo.scale.setScalar(1+Math.sin(t*.7)*.025);
        }
        camera.position.x+=(px*.32-camera.position.x)*.022;
        camera.position.y+=(-py*.2+scroll*.25-camera.position.y)*.022;
        camera.lookAt(0,0,-2);
        composer.render();
      };
      tick();
      window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);resizeObserver?.disconnect();composer?.dispose();renderer?.dispose();},{once:true});
    } catch(error) {
      console.warn('WebGL 不可用，保留 CSS 深空背景。',error);
      cancelAnimationFrame(raf); resizeObserver?.disconnect(); canvas.remove(); hero.classList.remove('s5-webgl-hero');
    }
  }

  function boot(){
    init();
    const root=document.getElementById('app-view')||document.body;
    new MutationObserver(()=>{if(!document.getElementById(canvasId))init();}).observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();