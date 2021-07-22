import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Road1{
    constructor(scene){

        const loader = new THREE.TextureLoader();
        this.texture1 = loader.load('road2.jpg');
        this.texture1.wrapS = THREE.RepeatWrapping;
        this.texture1.wrapT = THREE.RepeatWrapping;
        this.repeatsX = 27;
        this.repeatsY = 2;
        this.texture1.repeat.set(this.repeatsX, this.repeatsY);

        this.cubeGeo = new THREE.BoxGeometry(140, 20, 0.1);
        this.planeMat = new THREE.MeshPhongMaterial({map: this.texture1, side: THREE.DoubleSide});
        this.mesh1 = new THREE.Mesh(this.cubeGeo, this.planeMat);
        this.mesh1.rotation.x = Math.PI * -.5;
        scene.add(this.mesh1);
    }

    getObject(){
        return this.mesh1;
    }
}