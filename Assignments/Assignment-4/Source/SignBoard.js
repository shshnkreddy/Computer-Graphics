import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class SignBoard{
    constructor(x,z,theta,scene){
        this.scene = scene;
        this.x = x;
        this.z = z;
        this.theta = theta;
        this.type = 1;

        this.object = this.createObject();
        this.scene.add(this.object);
    }

    createObject(){
        this.image = 'poster1.png'
        if(this.type == -1){
            this.image = 'poster2.png'
        } 

        const loader = new THREE.TextureLoader();
        this.texture = loader.load(this.image);

        this.cylinder_geometry = new THREE.CylinderGeometry( 0.1, 0.1, 10, 32 );
        this.cylinder_material = new THREE.MeshBasicMaterial( {color: 'black'} );
        this.cylinder = new THREE.Mesh( this.cylinder_geometry, this.cylinder_material );
        this.base = new THREE.Object3D();
        this.base.add(this.cylinder);
        this.cylinder.position.y = 5;

        this.headMat = [
            new THREE.MeshPhongMaterial({color: 'white'}),
            new THREE.MeshPhongMaterial({color: 'white'}),
            new THREE.MeshPhongMaterial({color: 'white'}),
            new THREE.MeshPhongMaterial({color: 'white'}),
            new THREE.MeshPhongMaterial({color: 'white'}),
            new THREE.MeshPhongMaterial({map: this.texture}),
        ];

        this.rectangle_geometry = new THREE.BoxGeometry( 15, 5, 0.1 );
        //this.rectangle_material = new THREE.MeshBasicMaterial( {color: 'white'} );
        this.screen = new THREE.Mesh( this.rectangle_geometry, this.headMat );
        this.base.add(this.screen);
        this.screen.position.y = 10;
        this.screen.position.z = -0.1;
        
        this.base.position.z += this.z;//12;
        this.base.position.x += this.x;//24;
        this.base.rotation.y = this.theta;        
        return this.base;
    }

    updateTexture(){
        this.type = (-1)*this.type;
        this.scene.remove(this.object);
        this.object = this.createObject();
        this.scene.add(this.object);
        //return this.object;
    }



    getobject(){
        return this.base;
    }
}