import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Transform from './transform.js';
import { vec4, vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh{
    constructor(gl, path, color, renderer){
        this.gl = gl;
        this.path = path;
        this.mesh_data = new objLoader.Mesh(path);
        this.color = color;
        this.renderer = renderer;
        this.transform = new Transform();
        objLoader.initMeshBuffers(this.gl,this.mesh_data);
        this.centre = [0,0,0];

        this.color_list = [];
        this.constructColors();
        this.colorBuffer = this.gl.createBuffer();
        if(!this.colorBuffer) throw new Error("Buffer for color could not be allocated");
    }

    constructColors(){
        let vertices = this.mesh_data.vertexBuffer.numItems;
        let part = this.mesh_data.vertexBuffer.numItems / 3;
    
        this.color_list = []
        for(let j = 0; j < 3; ++j){
            for(let i = j * part; i < vertices && i < (j+1) * part; ++i){
                this.color_list.push(this.color[0]-(j/10));
                this.color_list.push(this.color[1]-(j/10));
                this.color_list.push(this.color[2]-(j/10));
            }
        }
    }

    pickObject(){
        for(let i = 0; i < this.color_list.length; ++i){
            this.color_list[i] /= 4;
        }
    }

    pickSubPart(index){
        let part = this.color_list.length / 3;
        for(let i = index * part; i < this.color_list.length && i < (index+1)*part; ++i) this.color_list[i] /= 4;
    }

    draw(shader){
        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
        const uProjectionMatrix = shader.uniform("uProjectionMatrix");
        const uModelViewMatrix = shader.uniform("uModelViewMatrix");

        shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getModelTransformationMatrix());
        shader.setUniformMatrix4fv(uProjectionMatrix, this.renderer.getProjectionMatrix());
        shader.setUniformMatrix4fv(uModelViewMatrix, this.renderer.getModelViewMatrix());


        const aPosition = shader.attribute("aPosition");       
        const aColor = shader.attribute("aColor");
        
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh_data.vertexBuffer);
        this.gl.vertexAttribPointer(
            aPosition, 
            this.mesh_data.vertexBuffer.itemSize, 
            this.gl.FLOAT, 
            false, 
            3 * Float32Array.BYTES_PER_ELEMENT, 
            0
        );
        
        this.gl.enableVertexAttribArray(aColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.color_list), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            aColor,
            3,
            this.gl.FLOAT,
            false,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh_data.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.mesh_data.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    }

    getCentre(){
        const currentVertex = vec4.fromValues(0,0,0,1);
        const updatedVertex = vec4.create();
        vec4.transformMat4( updatedVertex, currentVertex , this.transform.getModelTransformationMatrix());
        
        this.centre = [updatedVertex[0],updatedVertex[1],updatedVertex[2]];
        return this.centre;
    }
}