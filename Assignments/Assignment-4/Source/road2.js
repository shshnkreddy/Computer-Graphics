import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Road2{
    constructor(scene){

        const loader = new THREE.TextureLoader();
        this.texture1 = loader.load('road2.jpg');
        this.texture1.center.set(.5, .5);
        this.texture1.rotation = THREE.MathUtils.degToRad(90);
        this.texture1.wrapS = THREE.RepeatWrapping;
        this.texture1.wrapT = THREE.RepeatWrapping;
        this.texture1.magFilter = THREE.NearestFilter;
        this.repeatsX = 16;
        this.repeatsY = 1;
        this.texture1.repeat.set(this.repeatsX, this.repeatsY);

        this.cubeGeo = new THREE.BoxGeometry(8, 80, 0.08);
        this.planeMat = new THREE.MeshPhongMaterial({map: this.texture1, side: THREE.DoubleSide});
        this.mesh1 = new THREE.Mesh(this.cubeGeo, this.planeMat);
        this.mesh2 = new THREE.Mesh(this.cubeGeo, this.planeMat);
        this.mesh1.position.set(+32, 0, 0);
        this.mesh2.position.set(-64, 0, 0);
        this.mesh1.add(this.mesh2);
        this.mesh1.rotation.x = Math.PI * -.5;

        scene.add(this.mesh1);
    }
    
    getObject(){
        return this.mesh1;
    }
}