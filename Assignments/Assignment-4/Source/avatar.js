import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Avatar{
    constructor(scene){
        this.scene = scene;
        this.light_flag = 1;

        //this.torsoGeo = new THREE.BoxGeometry(1, 1, 0.5);
        this.torsoGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);
        this.legGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.25, 20);
        //this.legGeo = new THREE.BoxGeometry(0.45, 1.25, 0.5);
        //this.handGeo = new THREE.BoxGeometry(0.3, 1.25, 0.5);
        this.handGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.25, 20);
        //this.headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.headGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 20);

        const loader = new THREE.TextureLoader();
        this.texture1 = loader.load('map.jpg');
        this.texture2 = loader.load('face.jpeg');
        this.texture3 = loader.load('body.jpg');


        this.torsoMat = [
            new THREE.MeshPhongMaterial({map: this.texture3}),
            new THREE.MeshPhongMaterial({color: 0x693c14}),
        ];

        this.legMat = [
            new THREE.MeshPhongMaterial({map: this.texture1}),
            new THREE.MeshPhongMaterial({color: 0xFFFFFF}),
        ];

        this.handMat = [
            new THREE.MeshPhongMaterial({map: this.texture1}),
            new THREE.MeshPhongMaterial({color: 0xFFFFFF}),
        ];

        this.headMat = [
            new THREE.MeshPhongMaterial({map: this.texture2}),
            new THREE.MeshPhongMaterial({color: 0xA0522D}),
        ];
      
        // this.legMat = new THREE.MeshPhongMaterial({
        //     color: 0x00FF00,    
        //     flatShading: false,
        //     shininess: 60
        // });
      
        // this.handMat = new THREE.MeshPhongMaterial({
        //     color: 0x0000FF,    
        //     flatShading: false,
        //     shininess: 60
        // });
      
        // this.headMat = new THREE.MeshPhongMaterial({
        //     color: 0xFFFF00,    
        //     flatShading: false,
        //     shininess: 60
        // });

        this.legp1 = new THREE.Object3D();
        this.legp1.position.y = 1.25;
        this.legp2 = new THREE.Object3D();
        this.legp2.position.y = 1.25;
        this.handp1 = new THREE.Object3D();
        this.handp1.position.y = 2.25;
        this.handp2 = new THREE.Object3D();
        this.handp2.position.y = 2.25;

        this.body = new THREE.Object3D();
        this.torso = new THREE.Mesh(this.torsoGeo, this.torsoMat);
        this.leg1 = new THREE.Mesh(this.legGeo, this.legMat);
        this.leg2 = new THREE.Mesh(this.legGeo, this.legMat);
        this.hand1 = new THREE.Mesh(this.handGeo, this.handMat);
        this.hand2 = new THREE.Mesh(this.handGeo, this.handMat);
        this.head = new THREE.Mesh(this.headGeo, this.headMat);

        this.torso.position.set(0,1.75,0);
        this.leg1.position.set(-0.275,-0.625,0);
        this.leg2.position.set(0.275,-0.625,0);
        this.hand1.position.set(0.65,-0.625,0);
        this.hand2.position.set(-0.65,-0.625,0);
        this.head.position.set(0,2.5,0);

        this.body.add(this.torso);
        this.body.add(this.legp1);
        this.body.add(this.legp2);
        this.body.add(this.handp1);
        this.body.add(this.handp2);
        this.legp1.add(this.leg1);
        this.legp2.add(this.leg2);
        this.handp1.add(this.hand1);
        this.handp2.add(this.hand2);
        this.body.add(this.head);

        this.body.scale.set(0.75, 0.75, 0.75);
        this.turn = 1;
        this.balance = 0;
        //console.log(this.head.position);

        this.light = this.getSpotLight();
        this.scene.add(this.light);
        this.body.add(this.light.target);
    }

    updateLight(){
        this.light_flag = (-1)*this.light_flag;
        if(this.light_flag == 1){
            this.scene.add(this.light);
            this.body.add(this.light.target);
        }
        else{
            this.scene.remove(this.light);
            this.body.remove(this.light.target);
        }
    }

    getCamera(){
        //  zconsole.log(this.head);
        this.fov = 75;
        this.aspect = 2;  // the canvas default
        this.near = 0.25;
        this.far = 100;
        this.camera2 = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.head.add(this.camera2);
        return this.camera2;
    }

    getSpotLight(){
        this.color = 0xFF0000;
        this.intensity = 1;
        this.angle = Math.PI * (1/24);
        this.penumbra = 0.4;
        this.light1 = new THREE.SpotLight(this.color, this.intensity, 0, this.angle, this.penumbra);
        this.light1.position.set(0, 40, 0);
        return this.light1;
    }

    updateW(attached){
        if(!attached){
            this.body.position.z += -0.25;
            this.body.rotation.y = 0;
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1);
        }
    }

    updateS(attached){
        if(!attached){
            this.body.position.z += 0.25;
            this.body.rotation.y = Math.PI;
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1); 
        }
    }

    updateA(attached){
        if(attached && this.balance >= -18){
            this.balance -= 1;
            this.body.position.x += -0.25;
            this.body.rotation.y = Math.PI * (.5);
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1);
        }
        else if(!attached){
            this.balance = 0;
            this.body.position.x += -0.25;
            this.body.rotation.y = Math.PI * (.5);
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1);
        }
    }

    updateD(attached){
        if(attached && this.balance <= 25){
            this.balance += 1;
            this.body.position.x += 0.25;
            this.body.rotation.y = Math.PI * (-.5);
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1);
        }
        else if(!attached){
            this.balance = 0;
            this.body.position.x += 0.25;
            this.body.rotation.y = Math.PI * (-.5);
            this.legp1.rotation.x = this.turn*(-0.2);
            this.legp2.rotation.x = this.turn*(0.2);
            this.handp1.rotation.x = this.turn*(-0.35);
            this.handp2.rotation.x = this.turn*(0.35);
            this.turn = this.turn*(-1);
        }
    }

    getBody(){
        return this.body;
    }
}