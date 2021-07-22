import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export default class Building1{
    constructor(x,z,scene){    

        this.scene = scene;
        this.x = x;
        this.z = z; 

        this.sphercial = 1;
        this.cylinderical = 1;

        this.object = this.createObject();
        this.scene.add(this.object);
    }

    createObject(){
        this.rectangle_geometry = new THREE.BoxGeometry(1, 1, 1);
        //new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        if(this.sphercial == -1){
            this.assignSphericalUVs(this.rectangle_geometry);
        }     
        else if(this.cylinderical == -1){
            this.assignCylindricalUVs(this.rectangle_geometry);
        }

        const loader = new THREE.TextureLoader();
        this.texture1 = loader.load('checks.png');        
        this.texture1.wrapS = THREE.RepeatWrapping;
        this.texture1.wrapT = THREE.RepeatWrapping;
        this.repeatsX = 1;
        this.repeatsY = 1;
        this.texture1.repeat.set(this.repeatsX, this.repeatsY);

        this.mat1 = new THREE.MeshPhongMaterial({map: this.texture1});
        this.building1 = new THREE.Mesh(this.rectangle_geometry, this.mat1);
        this.building1.position.y +=12;
        this.building1.position.x = this.x;
        this.building1.position.z = this.z;
        this.building1.scale.set(20, 20, 20);      

        return this.building1;
    }

    setSpherical(){
        this.sphercial = (-1)*this.sphercial;
        //this.cylinderical = 1;
        this.scene.remove(this.object);
        this.object = this.createObject();
        this.scene.add(this.object);
        
    }

    setCylinderical(){
        this.cylinderical = (-1)*this.cylinderical;
        //this.sphercial = 1;
        this.scene.remove(this.object);
        this.object = this.createObject();
        this.scene.add(this.object);
    }

    assignSphericalUVs(geometry) {
        console.log(geometry.attributes);
        var positions = Array.from(geometry.attributes.position.array);
        for (var i = 0; i < positions.length / 3; i++) {
            var x = positions[i * 3];
            var y = positions[i * 3 + 1];
            var z = positions[i * 3 + 2];
            var U = Math.atan2(z, x) / Math.PI * 0.5 - 0.5;
            var V = 0.5 - Math.asin(y) / Math.PI;
            geometry.attributes.uv.array[i * 2] = U;
            geometry.attributes.uv.array[i * 2 + 1] = V;
        }    
    
        geometry.uvsNeedUpdate = true;
    }

    assignCylindricalUVs(geometry) {

        console.log(geometry.attributes);
        var positions = Array.from(geometry.attributes.position.array);
        for (var i = 0; i < positions.length / 3; i++) {
            var x = positions[i * 3];
            var y = positions[i * 3 + 1];
            var z = positions[i * 3 + 2];
            var U = Math.atan2(x, z) / Math.PI * 0.5 + 0.5
            var V = y
            console.log(x, y, z, U, V);
            geometry.attributes.uv.array[i * 2] = U;
            geometry.attributes.uv.array[i * 2 + 1] = V;
        }

        geometry.uvsNeedUpdate = true;
    }

    getobject(){
        return this.building1;
    }
}