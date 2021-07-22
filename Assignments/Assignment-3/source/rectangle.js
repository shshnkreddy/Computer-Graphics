import Transform from "./transform.js";
import { vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Rectangle
{
    constructor(gl, centroid){
        this.centroid = centroid;
        this.initial_centroid = centroid;
        this.side = 1;
        this.l = 0.5;       // in +x direction
        this.b = 1;       // in +y direction
        

        this.color = [1,0,0]

        this.gl = gl;
        this.transform = new Transform();

        this.constructPoints();

        this.vertexAttributesBuffer = this.gl.createBuffer();
        if(!this.vertexAttributesBuffer) throw new Error("Buffer for vertex attributes could not be allocated");

        this.name = "rectangle";
    }

    constructPoints(){
        this.top_right = [this.initial_centroid[0]+(this.l/2),this.initial_centroid[1]+(this.b/2)];
        this.top_left = [this.initial_centroid[0]-(this.l/2),this.initial_centroid[1]+(this.b/2)];
        this.bottom_right = [this.initial_centroid[0]+(this.l/2),this.initial_centroid[1]-(this.b/2)];
        this.bottom_left = [this.initial_centroid[0]-(this.l/2),this.initial_centroid[1]-(this.b/2)];
        
        this.vertexAttributesData = new Float32Array([
            // x,y,z,r,g,b
            this.top_right[0], this.top_right[1], 0, this.color[0], this.color[1], this.color[2],
            this.bottom_right[0], this.bottom_right[1], 0, this.color[0], this.color[1], this.color[2],
            this.top_left[0], this.top_left[1], 0, this.color[0], this.color[1], this.color[2],
    
            this.top_left[0], this.top_left[1], 0, this.color[0], this.color[1], this.color[2],
            this.bottom_left[0], this.bottom_left[1], 0, this.color[0], this.color[1], this.color[2],
            this.bottom_right[0], this.bottom_right[1], 0, this.color[0], this.color[1], this.color[2],
        ]);
    }

    color_black(){
        this.color = [0,0,0];
        this.constructPoints();
    }

    color_normal(){
        this.color = [1,0,0];
        this.constructPoints();
    }

    setLB(length,breadth){
        this.l = length;
        this.b = breadth;
        this.constructPoints();
    }

    draw(shader){
        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");

        let elementPerVertex = 6;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.STATIC_DRAW);
        
        const aPosition = shader.attribute("aPosition");
        const aColor = shader.attribute("aColor");

        this.gl.vertexAttribPointer(
            aPosition,                // Attribute Location
            3,         // Number of elements per attribute
            this.gl.FLOAT,            //
            false,                    // Whether the data is normalized
            elementPerVertex * Float32Array.BYTES_PER_ELEMENT,                           
            0                         // Offset
        );

        this.gl.vertexAttribPointer(
            aColor,                // Attribute Location
            3,         // Number of elements per attribute
            this.gl.FLOAT,            //
            false,                    // Whether the data is normalized
            elementPerVertex * Float32Array.BYTES_PER_ELEMENT,                          
            3 * Float32Array.BYTES_PER_ELEMENT                         // Offset
        );

        this.gl.enableVertexAttribArray(aPosition);
        this.gl.enableVertexAttribArray(aColor);

        shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

        this.gl.drawArrays(
            this.gl.TRIANGLES,
            0,                  // Offset
            6                   // Number of vertices
        );
    }

    updateCentroid(){
        const currentVertex = vec4.fromValues(this.centroid[0],this.centroid[1],0,1);
		const updatedVertex = vec4.create();
		vec4.transformMat4( updatedVertex, currentVertex , this.transform.getMVPMatrix() );
        
        this.centroid = [updatedVertex[0],updatedVertex[1]];
        //console.log(this.centroid);
    }

    getCentroid(){
        return this.centroid;
    }

    getName(){
        return this.name;
    }

    setCentroid( centroid ){
        this.centroid = centroid;
    }

    getDimensions(){
        return [this.l,this.b];
    }
}