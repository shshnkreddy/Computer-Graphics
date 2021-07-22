import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import Bus from './Bus.js';
import Building1 from './Building1.js';
import Road1 from './road1.js';
import Trees from './trees.js';
import Road2 from './road2.js';
import Avatar from './avatar.js';
import Streetlights from './streetlights.js';
import Drone from './droneCamera.js';
import SignBoard from './SignBoard.js';


function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  const gui = new GUI();

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

  // //bus            
  let leaderx = 60;//70;               //32
  let leaderBus = new Bus(true);
  let leader = leaderBus.getObject();
  scene.add(leader);
  leader.translateX(leaderx);
  //leader.translateZ(leaderz);
  //leader.rotation.y = Math.PI * (1.5);
  leader.scale.set = (0.01, 0.01, 0.01);
  
  let followerBus = new Bus(false);
  let follower = followerBus.getObject();
  leader.add(follower);
  follower.position.z += 4;
  

  // let followerBus1 = new Bus(false);
  // let follower1 = followerBus1.getObject();
  // leader.add(follower1);
  // follower1.position.z += 4;
  // follower1.position.x += 16;

  // let followerBus2 = new Bus(false);
  // let follower2 = followerBus2.getObject();
  // leader.add(follower2);
  // //follower1.position.z += 4;
  // follower2.position.x += 16;
  
  let jump_flag = 0;
  let half_jump = 0;
  let t = 0;
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
      obj.remove(body);
      scene.add(body);
      body.position.x = x;
      body.position.z = y;
      obj.position.set(0,0,0);
      scene.remove(obj);
    }
    body.position.y = (u*t) - (4.6*t*t);
  }

  function attach(){
    t = 0;
    leaderBus.add(obj);
    obj.position.z = 2;       
    obj.position.y = busHeight;
    body.position.x = 0;
    body.position.z = 0;
    scene.remove(body);
    obj.add(body);
  }

  const avatar = new Avatar(scene);
  const body = avatar.getBody();
  scene.add(body);
  const camera2 = avatar.getCamera();
  cameras.push(camera2);

  const drone = new Drone();
  cameras.push(drone.getCamera());

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
        Streetlights1.updateTexture();
        Streetlights2.updateTexture();
        Streetlights3.updateTexture();
        Streetlights4.updateTexture();

        Trees1.updateTexture();
        Trees2.updateTexture();
        Trees3.updateTexture();
        Trees4.updateTexture();

        sign1.updateTexture();
        sign2.updateTexture();
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
          scene.add(obj);
          console.log(body.position); 
          obj.position.x = leaderBus.getPosition()['x'];
          obj.position.y = 4.25;
          obj.position.z = leaderBus.getPosition()['z'];

          console.log(body.position)
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
    const texture = loader.load('cement.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeatsX = 60;
    const repeatsY = 40;
    texture.repeat.set(repeatsX, repeatsY);

    const planeGeo = new THREE.PlaneGeometry(160, 100);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  const Trees1 = new Trees(48, -26, scene);
  const Trees2 = new Trees(-48, -26, scene);
  const Trees3 = new Trees(48, 26, scene);
  const Trees4 = new Trees(-48, 26, scene);

  const Streetlights1 = new Streetlights(48, -10, scene);
  const Streetlights2 = new Streetlights(-16, 10, scene);
  const Streetlights3 = new Streetlights(16, 10, scene);
  const Streetlights4 = new Streetlights(-48, -10, scene);

  const road1 = new Road1(scene);
  const road2 = new Road2(scene);

 
 
  {
    const skyColor = 0xB1E1DD;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  let building1 = new Building1(0,-24 ,scene);
  let building2 = new Building1(0,+26,scene);
  

  var settings = {
    light1: false,
    light2: false,
    cylindrical: false,
    sphere: false
  }

  gui.add(settings, 'light1').onChange(function(value) {
    // rotateAvatar = true;
    avatar.updateLight();
  }).name("AvatarLight");

  gui.add(settings, 'light2').onChange(function(value) {
    // rotateAvatar = true;
    Streetlights1.updateLight();
    Streetlights2.updateLight();
    Streetlights3.updateLight();
    Streetlights4.updateLight();
    
  }).name("StreetLight");

  gui.add(settings, 'cylindrical').onChange(function(value) {
    building1.setCylinderical();
    building2.setCylinderical();
  }).name("Cylinderical");

  gui.add(settings, 'sphere').onChange(function(value) {
    building1.setSpherical();
    building2.setSpherical();
  }).name("Spherical");

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

  let sign1 = new SignBoard(24, -12, +3 * Math.PI/4, scene);
  let sign2 = new SignBoard(-24, -12, -3*Math.PI/4, scene);;

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      cameras[cameraSelect].aspect = canvas.clientWidth / canvas.clientHeight;
      cameras[cameraSelect].updateProjectionMatrix();
    }
    
    leaderBus.move();
    if(jump_flag == 1){
      jump();
    }
    renderer.render(scene, cameras[cameraSelect]);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
