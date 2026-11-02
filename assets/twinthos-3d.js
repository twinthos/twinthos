/* Twinthos: user-activated Three.js view.
   Progressive enhancement only; static accessible architecture remains the default.
   Library is loaded from a pinned version only after direct user interaction. */
export async function mountOperatorScene(host) {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js');
  if (!host || !host.isConnected) throw new Error('The visual container is unavailable.');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 80);
  camera.position.set(0, 0.15, 9.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x07111b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const object = new THREE.Group();
  scene.add(object);
  const steel = new THREE.MeshStandardMaterial({ color: 0xdbe8ec, metalness: .83, roughness: .19 });
  const silver = new THREE.MeshStandardMaterial({ color: 0x8aa3b2, metalness: .72, roughness: .28 });
  const cobalt = new THREE.MeshStandardMaterial({ color: 0x23475c, metalness: .55, roughness: .28 });
  const left = new THREE.Mesh(new THREE.BoxGeometry(.32, 1.78, .4), steel);
  left.position.set(-.56, -.08, .04);object.add(left);
  const right = left.clone();right.position.x=.56;object.add(right);
  const topL = new THREE.Mesh(new THREE.BoxGeometry(.93,.35,.4),steel);
  topL.position.set(-.71,.83,.04);object.add(topL);
  const topR=topL.clone();topR.position.x=.71;object.add(topR);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.32,.24,.48),silver);
  bridge.rotation.z=.52;bridge.position.set(0,-.06,.20);object.add(bridge);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.85,2.85,.08),cobalt);
  frame.position.z=-.52;frame.rotation.z=Math.PI/4;object.add(frame);
  const frameEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.85,2.85,.09)),new THREE.LineBasicMaterial({color:0x8faebd,transparent:true,opacity:.42}));
  frameEdges.position.z=-.50;frameEdges.rotation.z=Math.PI/4;object.add(frameEdges);
  const ringMaterial = new THREE.MeshBasicMaterial({color:0xa8cadb,transparent:true,opacity:.35,side:THREE.DoubleSide});
  for(const [r,rotation] of [[2.18,.25],[2.88,-.35]]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.008,4,120),ringMaterial);
    ring.rotation.x=rotation;ring.rotation.y=rotation*.5;scene.add(ring);
  }
  const nodeMat = new THREE.MeshStandardMaterial({ color:0xddebf1,emissive:0x315f78,emissiveIntensity:.3,roughness:.27,metalness:.55 });
  const points=[[-2.95,1.7,0],[2.95,1.7,0],[-2.95,-1.7,0],[2.95,-1.7,0]];
  const nodeGeometry=new THREE.OctahedronGeometry(.17,0);
  const lineMat=new THREE.LineBasicMaterial({color:0x789dad,transparent:true,opacity:.55});
  const satellites=[];
  for(const coords of points){
    const node=new THREE.Mesh(nodeGeometry,nodeMat);node.position.set(...coords);scene.add(node);satellites.push(node);
    const line=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(coords[0]*.36,coords[1]*.36,0),new THREE.Vector3(...coords)]);
    scene.add(new THREE.Line(line,lineMat));
  }
  scene.add(new THREE.AmbientLight(0xd5edf7,1.45));
  const key=new THREE.DirectionalLight(0xffffff,3.8);key.position.set(2,5,7);scene.add(key);
  const fill=new THREE.PointLight(0x75bbdf,32);fill.position.set(-3,-2,5);scene.add(fill);
  const bounds = () => {
    const rect=host.getBoundingClientRect();
    if(rect.width<30||rect.height<30)return;
    renderer.setSize(rect.width,rect.height,false);
    camera.aspect=rect.width/rect.height;
    camera.updateProjectionMatrix();
  };
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(bounds) : null;
  if(resize)resize.observe(host);
  else window.addEventListener('resize',bounds);
  bounds();
  let raf=0,alive=true,paused=document.hidden;
  const view=()=>{
    if(!alive)return;
    if(!paused){
      const t=performance.now()*0.00025;
      object.rotation.y=Math.sin(t)*.25;object.rotation.x=Math.cos(t*.7)*.10;
      object.position.y=Math.sin(t*2)*.07;
      satellites.forEach((n,i)=>n.rotation.y=t*2+i);
      renderer.render(scene,camera);
    }
    raf=requestAnimationFrame(view);
  };
  const visibility=()=>{paused=document.hidden};
  document.addEventListener('visibilitychange',visibility);
  const watch=typeof IntersectionObserver==='function' ? new IntersectionObserver(entries=>{paused=document.hidden||!entries[0].isIntersecting},{threshold:.04}):null;
  if(watch)watch.observe(host);
  view();
  const lost=e=>{e.preventDefault();paused=true};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  return function dispose(){
    if(!alive)return;
    alive=false;cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange',visibility);
    if(resize)resize.disconnect(); else window.removeEventListener('resize',bounds);
    if(watch)watch.disconnect();
    object.traverse(o=>{if(o.geometry)o.geometry.dispose()});
    scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
    [steel,silver,cobalt,ringMaterial,nodeMat,lineMat].forEach(m=>m.dispose());
    renderer.dispose();renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
