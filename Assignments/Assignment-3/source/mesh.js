import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Transform from './transform.js';
import { vec4, vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh{
    constructor(gl, path, color, renderer, bbox_length = 1, material_properties){
        this.gl = gl;
        this.path = path;
        this.mesh_data = new objLoader.Mesh(path);
        objLoader.initMeshBuffers(this.gl,this.mesh_data);
        this.renderer = renderer;

        this.transform = new Transform();
        this.centre = [0,0,0];

        this.color = color;
        this.color_list = [];
        this.constructColors();
        this.colorBuffer = this.gl.createBuffer();
        if(!this.colorBuffer) throw new Error("Buffer for color could not be allocated");

        this.bbox_length = bbox_length;
        this.material_properties = material_properties;             //Ka,Kd,Ks

        this.scale = 1;

        this.setLightPos();
    }

    constructColors(){
        let vertices = this.mesh_data.vertexBuffer.numItems;
        
        this.color_list = []
        for(let j = 0; j < vertices; ++j){
            this.color_list.push(this.color[0]);
            this.color_list.push(this.color[1]);
            this.color_list.push(this.color[2]);
        }
    }

    color_black(){
        let vertices = this.mesh_data.vertexBuffer.numItems;
        this.color_list = [];
        for(let i = 0; i < vertices; ++i){
            for(let j = 0; j < 3; ++j) this.color_list.push(0);
        }
    }

    setLightPos(){
        this.lightPosition = [1*this.bbox_length + this.centre[0], 1*this.bbox_length + this.centre[1], 1*this.bbox_length + this.centre[2]];
    }

    draw(shader, light_colors, lightPosition , modes){
        this.updateCentre(); this.setLightPos();

        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
        const uProjectionMatrix = shader.uniform("uProjectionMatrix");
        const uModelViewMatrix = shader.uniform("uModelViewMatrix");
        const uModelInverseTransposeMatrix = shader.uniform("uModelInverseTransposeMatrix");

        shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getModelTransformationMatrix());
        shader.setUniformMatrix4fv(uProjectionMatrix, this.renderer.getProjectionMatrix());
        shader.setUniformMatrix4fv(uModelViewMatrix, this.renderer.getModelViewMatrix());
        shader.setUniformMatrix4fv(uModelInverseTransposeMatrix, this.transform.getModelInverseTranspose());

        const Ka = shader.uniform("Ka");
        const Kd = shader.uniform("Kd");
        const Ks = shader.uniform("Ks");
        const alpha = shader.uniform("alpha");

        shader.setUniform1f(Ka, this.material_properties[0]);
        shader.setUniform1f(Kd, this.material_properties[1]);
        shader.setUniform1f(Ks, this.material_properties[2]);
        shader.setUniform1f(alpha, this.material_properties[3]);

        const mode1 = shader.uniform('mode1');
        const mode2 = shader.uniform('mode2');
        const mode3 = shader.uniform('mode3');

        shader.setUniform1f(mode1, modes[0]);
        shader.setUniform1f(mode2, modes[1]);
        shader.setUniform1f(mode3, modes[2]);

        const ambientColor = shader.uniform("ambientColor");
        shader.setUniform3f(ambientColor, light_colors['ambient']);

        const diffusedColor1 = shader.uniform("diffusedColor1");
        shader.setUniform3f(diffusedColor1, light_colors["diffused1"]);

        const diffusedColor2 = shader.uniform("diffusedColor2");
        shader.setUniform3f(diffusedColor2, light_colors["diffused2"]);

        const diffusedColor3 = shader.uniform("diffusedColor3");
        shader.setUniform3f(diffusedColor3, light_colors["diffused3"]);

        const specularColor1 = shader.uniform("specularColor1");
        shader.setUniform3f(specularColor1, light_colors['specular1']);

        const specularColor2 = shader.uniform("specularColor2");
        shader.setUniform3f(specularColor2, light_colors['specular2']);

        const specularColor3 = shader.uniform("specularColor3");
        shader.setUniform3f(specularColor3, light_colors['specular3']);

        const lightPosition1 = shader.uniform("lightPosition1");
        shader.setUniform3f(lightPosition1, lightPosition[0]);

        const lightPosition2 = shader.uniform("lightPosition2");
        shader.setUniform3f(lightPosition2, lightPosition[1]);

        const lightPosition3 = shader.uniform("lightPosition3");
        shader.setUniform3f(lightPosition3, lightPosition[2]);

        const eyePosition = shader.uniform("eyePosition");
        shader.setUniform3f(eyePosition, this.renderer.getEyeCoords());

        const aPosition = shader.attribute("aPosition");       
        const aColor = shader.attribute("aColor");
        const aNormal = shader.attribute("aNormal");
        
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
        
        this.gl.enableVertexAttribArray(aNormal);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh_data.normalBuffer);
        this.gl.vertexAttribPointer(
            aNormal,
            this.mesh_data.normalBuffer.itemSize,
            this.gl.FLOAT,
            false,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh_data.indexBuffer);


        this.gl.drawElements(this.gl.TRIANGLES, this.mesh_data.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    }

    updateCentre(){
        const currentVertex = vec4.fromValues(0,0,0,1);
        const updatedVertex = vec4.create();
        vec4.transformMat4( updatedVertex, currentVertex , this.transform.getModelTransformationMatrix());
        
        this.centre = [updatedVertex[0],updatedVertex[1],updatedVertex[2]];
    }

    getCentre(){
        this.updateCentre();
        return this.centre;
    }

    getLightPos(){
        this.updateCentre();
        this.setLightPos();
        return this.lightPosition;
    }

    Within_BBox_Limit(position){
        let upper_limit = 1.25 * this.bbox_length * this.scale;

        let centre = this.getCentre();
        
        let x_limit = Math.abs(centre[0]-position[0]) > upper_limit;
        let y_limit = Math.abs(centre[1]-position[1]) > upper_limit;
        let z_limit = Math.abs(centre[2]-position[2]) > upper_limit;   

        if(x_limit || y_limit || z_limit){
            console.log('Translation will violate rule 2a.')
            return false;
        }

        return true;
    }

    Scale_BBox_Limit(position){
        let upper_limit = 1.25 * this.bbox_length * this.scale;
        let lower_limit = this.scale * this.bbox_length;

        let centre = this.getCentre();
        let x_limit = Math.abs(centre[0]-position[0]) > upper_limit;
        let y_limit = Math.abs(centre[1]-position[1]) > upper_limit;
        let z_limit = Math.abs(centre[2]-position[2]) > upper_limit;  
        

        // x_limit = x_limit || (Math.abs(centre[0]-position[0]) < lower_limit);       //To ensure light source does not end up inside the mesh
        // y_limit = y_limit || (Math.abs(centre[1]-position[1]) < lower_limit);
        // z_limit = z_limit || (Math.abs(centre[2]-position[2]) < lower_limit);

        if(x_limit || y_limit || z_limit){
            console.log("Scaling will violate rule 2a.");
            return false;
        }

        return true;
    }

    positiveScale(scalingFactor){
        this.scale += scalingFactor;
    }

    negativeScale(scalingFactor){
        this.scale -= scalingFactor;
    }

    getScale(){
        return this.scale;
    }
}