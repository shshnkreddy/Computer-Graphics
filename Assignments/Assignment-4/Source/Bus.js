import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

export default class Bus{
    constructor(isLeader){
        
        this.direction = 1;
        this.isLeader = isLeader;
        if(this.isLeader)   this.path = './Big White Bus 3D Model/leader.mtl';
        else    this.path = './Big White Bus 3D Model/follower.mtl';

        this.object = this.createBus();
        this.speed = 1;
        this.distance = 120;
        this.time  = this.distance / this.speed;
        this.req_time = this.time;
        this.pi = Math.PI

        this.r_speed = 2;
        this.r_time = (180) / this.r_speed; 
        this.req_r_time = (180) / this.r_speed;

        this.side = -1;
    }

    createBus(){
        const container = new THREE.Object3D();
        const mtlLoader = new MTLLoader();
    
        mtlLoader.load(this.path, (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./Big White Bus 3D Model/Big White Bus 3D Model.obj', (leader) => {
        leader.rotation.y = this.pi * (1.5);
        leader.position.z = 2;
        container.add( leader );
        });
        });
        return container;
    }
    

    getObject(){
        return this.object;
    }

    move(){        
        if(this.time > 0){
            //console.log(this.getPosition())
            this.object.translateX(-1 * this.speed);
            --this.time;
        }
        else{
            if(this.r_time > 0){
                let rot  = -(this.r_speed / 180) * (this.pi);
                this.object.rotateY(rot);
                --this.r_time;
                //console.log(this.r_time, rot);
            }
            else{
                this.time = this.req_time;
                this.r_time = this.req_r_time;
                this.direction = -1 * this.direction;
            }
        }
    }

    getPosition(){
        return this.object.position;
    }

    getDirection(){
        return this.direction;
    }

    add(obj){
        this.object.add(obj);
    }

    remove(obj){
        this.object.remove(obj);
    }
}