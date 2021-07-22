import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Streetlights{
    constructor(x,z,scene){

        this.z = z;
        this.x = x;
        this.scene = scene;

        this.type = -1;
        this.light_flag = 1;
        this.image = 'crate.jpg';
        //this.image1 = 'crate1.jpeg'
        this.object = this.createObject();
        this.scene.add(this.object);

        this.light = this.getLight();
        this.scene.add(this.light);
        this.scene.add(this.light.target);
    }

    createObject(){
        this.cubeGeo1 = new THREE.BoxGeometry(0.5, 8, 0.5);
        this.cubeGeo2 = new THREE.BoxGeometry(0.75, 0.5, 2.5);
        const loader = new THREE.TextureLoader();

        this.image = 'crate.jpg'
        if(this.type == -1){
            this.image = 'crate1.jpeg'
        }

        this.texture1 = loader.load(this.image);        //Txture1
        this.texture1.wrapS = THREE.RepeatWrapping;
        this.texture1.wrapT = THREE.RepeatWrapping;
        this.texture1.repeat.set(1, 12);
        this.texture2 = loader.load(this.image);        //texture 2
        this.texture2.wrapS = THREE.RepeatWrapping;
        this.texture2.wrapT = THREE.RepeatWrapping;
        this.texture2.repeat.set(5, 1);
        this.texture3 = loader.load(this.image);            
        this.texture3.wrapS = THREE.RepeatWrapping;     //texture 3
        this.texture3.wrapT = THREE.RepeatWrapping;
        this.texture3.repeat.set(1, 5);
        this.texture4 = loader.load(this.image);        //texture4
        this.texture4.wrapS = THREE.RepeatWrapping;
        this.texture4.wrapT = THREE.RepeatWrapping;
        this.texture4.repeat.set(1, 1);

        this.materials = [
            new THREE.MeshPhongMaterial({map: this.texture2}),
            new THREE.MeshPhongMaterial({map: this.texture2}),
            new THREE.MeshPhongMaterial({map: this.texture3}),
            new THREE.MeshPhongMaterial({map: this.texture3}),
            new THREE.MeshPhongMaterial({map: this.texture4}),
            new THREE.MeshPhongMaterial({map: this.texture4})
        ];

        this.bodyMat1 = new THREE.MeshPhongMaterial({map: this.texture1});
        this.mesh1 = new THREE.Mesh(this.cubeGeo1, this.bodyMat1);
        this.mesh2 = new THREE.Mesh(this.cubeGeo2, this.materials);

        this.mesh1.position.set(this.x,4,this.z); //-48,4,-10
        this.mesh1.add(this.mesh2);
        this.mesh2.position.set(0, 4, -(Math.sign(this.z)) );  
        return this.mesh1;
    }

    getObject(){
        return this.object;
    }

    getLight(){
        this.color = 0xFFFF00;
        this.intensity = 1;
        this.angle = Math.PI * (1/3);
        this.penumbra = 0.6;
        this.light1 = new THREE.SpotLight(this.color, this.intensity, 0, this.angle, this.penumbra);
        // this.object.add(this.light1);
        // this.object.add(this.light1.target);
        this.light1.position.set(this.x, 8, this.z + 2.25*(-Math.sign(this.z)) );
        this.light1.target.position.set(this.x, 0, this.z + 2.25*(-Math.sign(this.z)));
        return this.light1;
    }

    updateLight(){
        this.light_flag = (-1)*this.light_flag;
        if(this.light_flag == 1){
            this.scene.add(this.light);
            this.scene.add(this.light.target);
        }
        else{
            this.scene.remove(this.light);
            this.scene.remove(this.light.target);
        }
    }

    updateTexture(){
        this.type = (-1)*this.type;
        this.scene.remove(this.object);
        this.object = this.createObject();
        this.scene.add(this.object);
        //return this.object;
    }
}