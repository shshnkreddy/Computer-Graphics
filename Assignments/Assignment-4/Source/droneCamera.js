import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Drone{
    constructor(){
        this.fov = 75;
        this.aspect = 2;  // the canvas default
        this.near = 0.25;
        this.far = 200;
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.camera.position.set(0, 30, -20);
        this.updateLookAt();
        
        this.speed = 2;
        this.elevation_speed = 1;
        this.rot_speed = 0.1; 

    }

    updateLookAt(){
        this.camera.lookAt(this.camera.position.x + 10000, this.camera.position.y * 0.75, this.camera.position.z + 10000)
    }

    getCamera(){
        return this.camera;
    }

    rotate(direction){
        this.camera.rotation.y += this.rot_speed * direction;
    }

    elevate(direction){
        this.camera.position.y += this.elevation_speed * direction;
    }

    translate(axis, direction){
        if(axis == 'z') this.camera.position.z += this.speed * direction;
        else this.camera.position.x += this.speed * direction;
    }

    increaseSpeed(){
        this.speed *= 2;
        this.elevation_speed *= 2;
        this.rot_speed *= 2;
    }

    decreaseSpeed(){
        this.speed /= 2;
        this.elevation_speed /= 2;
        this.rot_speed /= 2;
    }
}