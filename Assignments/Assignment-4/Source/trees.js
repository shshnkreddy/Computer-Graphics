import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';


export default class Trees{
    constructor(x,z, scene){

      this.x = x;
      this.z = z;
      this.scene = scene;

      this.type = 1;
      // this.image = 'Tree.mtl';
      // if(this.type == 1)  this.image = 'Tree1.mtl';

      this.object = this.createTrees();
      this.scene.add(this.object);
    }

    createTrees(){
      this.container = new THREE.Object3D();
      this.image = 'Tree.mtl';
      if(this.type == -1)  this.image = 'Tree1.mtl';

      const mtlLoader = new MTLLoader();
      mtlLoader.load(this.image, (mtl) => {
          mtl.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(mtl);
          objLoader.load('Tree.obj', (root) => {
            root.position.set(this.x, 0, this.z); //48, -24
            root.scale.set(2.5, 2.5, 2.5);  
          
            objLoader.load('Tree.obj', (root1) => {
              root1.position.set(3, 0, -4);
              root.add(root1);
            });
            objLoader.load('Tree.obj', (root2) => {
              root2.position.set(3, 0, 4);
              root.add(root2);
            });
            objLoader.load('Tree.obj', (root3) => {
              root3.position.set(-3, 0, -4);
              root.add(root3);
            });

            objLoader.load('Tree.obj', (root4) => {
              root4.position.set(-3, 0, 4);
              root.add(root4);
            });

          this.container.add(root)  
            });
        });
        return this.container;
    }

    getObject(){
      //this.type = type;
      //this.object = this.createTrees();
      return this.object;
    }

    updateTexture(){
      this.type = (-1)*this.type;
      //this.scene.remove(this.object);
      this.object = this.createTrees();
      this.scene.add(this.object);
      // this.object = this.createTrees();
      // return this.object;
    }
}