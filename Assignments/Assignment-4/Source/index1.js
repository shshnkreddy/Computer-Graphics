import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import Bus from './Bus.js';
//import Building1 from './Building1.js';
//import Road1 from './road1.js';
import Trees from './trees.js';
//import Road2 from './road2.js';
import Avatar from './avatar.js';
import Streetlights from './streetlights.js';
import Drone from './droneCamera.js';



function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  let cameras = [];
  let cameraSelect = 0;
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 200;
  const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera1.position.set(0, 10, 20);

  const controls = new OrbitControls(camera1, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  cameras.push(camera1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  //bus
  // let leaderz = 2;             
  // let leaderx = 70;//70;               //32
  // let leaderBus = new Bus(true);
  // let leader = leaderBus.getObject();
  // scene.add(leader);
  // leader.translateX(leaderx);
  // leader.translateZ(leaderz);
  // //leader.rotation.y = Math.PI * (1.5);
  // leader.scale.set = (0.01, 0.01, 0.01);
  
  // let followerBus = new Bus(false);
  // let follower = followerBus.getObject();
  // leader.add(follower);
  // follower.position.z += 4;
  // console.log(follower.position.z);

  //let text_flag = 0;
  let jump_flag = 0;
  let half_jump = 0;
  let t = 0;
  let text_flag = 1;
  let count = 0;

  var obj = new THREE.Object3D();
  let attached = false;
  let detached = false;
  let busHeight = 4.1;
  let u = 9.4;

  function jump(){
    t += 0.1;
    count += 1;

    //half jump
    if(t > 1.03 && attached == true && half_jump == 1){
      jump_flag = 0;
      half_jump = 0;
      console.log(count)
      count = 0  
      attach(); 
    }

    if(t > 2.03 && detached == false){
      t = 0;
      jump_flag = 0;
      console.log(count)
      count = 0   
    }

    if(t > 2.39 && detached == true){
      t = 0;
      jump_flag = 0;
      detached = false;
      console.log(obj.position);
      const x = obj.position.x;
      const y = obj.position.z;
      scene.add(body);
      body.position.x = x;
      body.position.z = y;
      obj.position.set(0,0,0);
      obj.remove(body);
      scene.remove(obj);
    }
    body.position.y = (u*t) - (4.6*t*t);
  }

  function attach(){
    t = 0;
    leaderBus.add(obj);       
    obj.position.y = busHeight;
    body.position.x = 0;
    body.position.z = 0;
    //attached = true;
    scene.remove(body);
    obj.add(body);
  }

  let avatar = new Avatar();
  const body = avatar.getBody();
  scene.add(body);
  const camera2 = avatar.getCamera();
  cameras.push(camera2);

  const drone = new Drone();
  cameras.push(drone.getCamera());

  const light0 = new THREE.SpotLight(0xFF0000, 1, 0, (Math.PI * (1/24)), 0.4);
  light0.position.set(0, 40, 0);
  scene.add(light0);
  scene.add(light0.target);
  body.add(light0.target);

  window.addEventListener("keydown", function(event){
    switch(event.key){
      case "w":
        avatar.updateW(attached);
        break;

      case "s":
        avatar.updateS(attached);
        break;
      case "a":
        avatar.updateA(attached);
        break;

      case "d":
        avatar.updateD(attached);
        break;

      case "c":
        cameraSelect = (++cameraSelect) % 3;
        break;
      
      case " ":
        jump_flag = 1;
        break;

      case "t":
        text_flag = (-1)*(text_flag);
        break;

      case "j":
        function distance(obj1, obj2){
          let dx = (obj1.position['x'] - obj2.position['x']) * (obj1.position['x'] - obj2.position['x']);
          let dz = (obj1.position['z'] - obj2.position['z']) *  (obj1.position['z'] - obj2.position['z']) ;
          return Math.sqrt(dx + dz);
        }

        if(!attached){     
          let dist = 10;
          if(distance(leaderBus.getObject(), body) > dist) break;
          jump_flag = 1;
          half_jump = 1
          attached = true;
        }

        else{
          attached = false;
          detached = true;
          jump_flag = 1;
          //parabola_jump = 1;
          leaderBus.remove(obj);
          console.log(body.position) 
          obj.translateX(leaderBus.getPosition()['x']);
          obj.translateY(leaderBus.getPosition()['y']);
          obj.translateZ(leaderBus.getPosition()['z']);
          console.log(body.position)
          scene.add(obj);
          //attached = false;            
        }
        
        break;
      
      case 'ArrowUp':
        if(cameraSelect == 2){
          drone.elevate(1);
        }
        break;

      case 'ArrowDown':
        if(cameraSelect == 2){
          drone.elevate(-1);
        }
        break;

      case 'ArrowLeft':
        if(cameraSelect == 2){
          drone.rotate(-1);
        }
        break;

      case 'ArrowRight':
        if(cameraSelect == 2){
          drone.rotate(1);
        }
        break;

      case 'u':
        if(cameraSelect == 2){
          drone.translate('z', 1);
        }
        break;

      case 'n':
        if(cameraSelect == 2){
          drone.translate('z', -1);
        }
        break;

      case 'h':
        if(cameraSelect == 2){
          drone.translate('x', 1);
        }
        break;
      
      case 'k':
        if(cameraSelect == 2){
          drone.translate('x', -1);
        }
        break;  

      case 'i':
        if(cameraSelect == 2){
          drone.increaseSpeed();
        }
        break;

      case 'p':
        if(cameraSelect == 2){
          drone.decreaseSpeed();
        }
        break;
    }
  },
  true
  );

  {
    //const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeatsX = 60;
    const repeatsY = 40;
    texture.repeat.set(repeatsX, repeatsY);

    const planeGeo = new THREE.PlaneGeometry(240, 160);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  const Trees1 = new Trees(48, -26, text_flag);
  const Trees2 = new Trees(-48, -26, text_flag);
  const Trees3 = new Trees(48, 26, text_flag);
  const Trees4 = new Trees(-48, 26, text_flag);

  const Streetlights1 = new Streetlights(48, -10);
  const Streetlights2 = new Streetlights(-16, 10);
  const Streetlights3 = new Streetlights(16, 10);
  const Streetlights4 = new Streetlights(-48, -10);

  let trees1 = Trees1.getObject();
  let trees2 = Trees2.getObject();
  let trees3 = Trees3.getObject();
  let trees4 = Trees4.getObject();
  scene.add(trees1);
  scene.add(trees2); 
  scene.add(trees3);
  scene.add(trees4);

  let sLights1 = Streetlights1.getObject();
  let sLights2 = Streetlights2.getObject();
  let sLights3 = Streetlights3.getObject();
  let sLights4 = Streetlights4.getObject();
  scene.add(sLights1);
  scene.add(sLights2); 
  scene.add(sLights3);
  scene.add(sLights4);

  // let Road0 = new Road1();
  // const road1 = Road0.getObject();
  // scene.add(road1);

  // Road0 = new Road2();
  // const road2 = Road0.getObject();
  // scene.add(road2);

  // const lights1 = Streetlights1.getLight();
  // const lights2 = Streetlights2.getLight();
  // const lights3 = Streetlights3.getLight();
  // const lights4 = Streetlights4.getLight();
  // scene.add(lights1);
  // scene.add(lights2); 
  // scene.add(lights3);
  // scene.add(lights4);
  // scene.add(lights1.target);
  // scene.add(lights2.target); 
  // scene.add(lights3.target);
  // scene.add(lights4.target);

  //lights
  {/*
    const cubeSize = 1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const loader = new THREE.TextureLoader();
    const texture1 = loader.load('crate.jpg');
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    //texture1.magFilter = THREE.NearestFilter;
    let repeatsX = 1;
    let repeatsY = 12;
    texture1.repeat.set(repeatsX, repeatsY);

    const texture2 = loader.load('crate.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    //texture2.magFilter = THREE.NearestFilter;
    repeatsX = 5;
    repeatsY = 1;
    texture2.repeat.set(repeatsX, repeatsY);

    const texture3 = loader.load('crate.jpg');
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    //texture3.magFilter = THREE.NearestFilter;
    repeatsX = 1;
    repeatsY = 5;
    texture3.repeat.set(repeatsX, repeatsY);

    const texture4 = loader.load('crate.jpg');
    texture4.wrapS = THREE.RepeatWrapping;
    texture4.wrapT = THREE.RepeatWrapping;
    //texture4.magFilter = THREE.NearestFilter;
    repeatsX = 1;
    repeatsY = 1;
    texture4.repeat.set(repeatsX, repeatsY);

    const planeMat1 = new THREE.MeshPhongMaterial({
      map: texture1
    });

    const materials = [
      new THREE.MeshPhongMaterial({map: texture2}),
      new THREE.MeshPhongMaterial({map: texture2}),
      new THREE.MeshPhongMaterial({map: texture3}),
      new THREE.MeshPhongMaterial({map: texture3}),
      new THREE.MeshPhongMaterial({map: texture4}),
      new THREE.MeshPhongMaterial({map: texture4})
    ]

    //light properties
    const color = 0xFFFF00;
    const intensity = 1;
    const angle = Math.PI * (1/3);
    const penumbra = 0.6;
    const light1 = new THREE.SpotLight(color, intensity, 0, angle, penumbra);
    const light2 = new THREE.SpotLight(color, intensity, 0, angle, penumbra);
    const light3 = new THREE.SpotLight(color, intensity, 0, angle, penumbra);
    const light4 = new THREE.SpotLight(color, intensity, 0, angle, penumbra);


    scene.add(light1);
    scene.add(light1.target);
    mesh12.add(light1);
    mesh12.add(light1.target);
    light1.position.set(0,0,1.25);
    light1.target.position.set(0,-8,1.25);




    //base pos (-24,-4)
    const mesh11 = new THREE.Mesh(cubeGeo, planeMat1);
    const mesh12 = new THREE.Mesh(cubeGeo, materials);
    mesh11.position.set(-48, 4, -10);
    mesh11.scale.set(0.5,8,0.5);
    scene.add(mesh11);
    mesh12.position.set(-48, 8, -9)
    mesh12.scale.set(0.5,0.5,2.5);
    scene.add(mesh12);
    //Light1 Position
    scene.add(light1);
    scene.add(light1.target);
    mesh12.add(light1);
    mesh12.add(light1.target);
    light1.position.set(0,0,1.25);
    light1.target.position.set(0,-8,1.25);

    const mesh21 = new THREE.Mesh(cubeGeo, planeMat1);
    const mesh22 = new THREE.Mesh(cubeGeo, materials);
    mesh21.position.set(-16, 4, 10);
    mesh21.scale.set(0.5,8,0.5);
    scene.add(mesh21);
    mesh22.position.set(-16, 8, 9);
    mesh22.scale.set(0.5,0.5,2.5);
    scene.add(mesh22);
    //Light2 Position
    scene.add(light2);
    scene.add(light2.target);
    mesh22.add(light2);
    mesh22.add(light2.target);
    light2.position.set(0,0,-1.25);
    light2.target.position.set(0,-8,-1.25);

    const mesh31 = new THREE.Mesh(cubeGeo, planeMat1);
    const mesh32 = new THREE.Mesh(cubeGeo, materials);
    mesh31.position.set(16, 4, 10);
    mesh31.scale.set(0.5,8,0.5);
    scene.add(mesh31);
    mesh32.position.set(16, 8, 9);
    mesh32.scale.set(0.5,0.5,2.5);
    scene.add(mesh32);
    //Light3 Position
    scene.add(light3);
    scene.add(light3.target);
    mesh32.add(light3);
    mesh32.add(light3.target);
    light3.position.set(0,0,-1.25);
    light3.target.position.set(0,-8,-1.25);

    const mesh41 = new THREE.Mesh(cubeGeo, planeMat1);
    const mesh42 = new THREE.Mesh(cubeGeo, materials);
    mesh41.position.set(48, 4, -10);
    mesh41.scale.set(0.5,8,0.5);
    scene.add(mesh41);
    mesh42.position.set(48, 8, -9);
    mesh42.scale.set(0.5,0.5,2.5);
    scene.add(mesh42);
    //Light4 Position
    scene.add(light4);
    scene.add(light4.target);
    mesh42.add(light4);
    mesh42.add(light4.target);
    light4.position.set(0,0,1.25);
    light4.target.position.set(0,-8,1.25); 
  */}

  //Building1 
  // let building = new Building1(16, 24);
  // const building1 = building.getobject();
  // scene.add(building1)

  {
    const skyColor = 0xB1E1DD;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(0, 10, 0);
  //   light.target.position.set(-5, 0, 0);
  //   scene.add(light);
  //   scene.add(light.target);
  // }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      cameras[cameraSelect].aspect = canvas.clientWidth / canvas.clientHeight;
      cameras[cameraSelect].updateProjectionMatrix();
    }
    
    //leaderBus.move();
    if(jump_flag == 1){
      jump();
    }
    renderer.render(scene, cameras[cameraSelect]);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
