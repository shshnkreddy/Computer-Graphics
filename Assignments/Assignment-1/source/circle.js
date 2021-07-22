import Transform from "./transform.js";
import { vec4, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Circle{
    constructor(gl, centre){
        this.centre = centre;
        
        this.actual_centre = centre;

        this.radius = 0.25;         //Size not standard

        this.color = [0,0,1];

        this.vertexAttributesData = [];
        

        this.gl = gl;
        this.vertexAttributesBuffer = this.gl.createBuffer();
        if(!this.vertexAttributesBuffer) throw new Error("Buffer for vertex attributes could not be allocated");

        this.transform = new Transform();

        this.constructPoints();

        this.name = "circle";
               
    }

    constructPoints(){
        while(this.vertexAttributesData.length) this.vertexAttributesData.pop();
        for(var i = 0.0; i <= 360; i+=1){
            var j = i * Math.PI / 180;

            var vert1 = [       //x,y,z
                (this.radius*Math.cos(j)) + this.centre[0],
                (this.radius*Math.sin(j)) + this.centre[1],
                0
            ];
            vert1 = vert1.concat(this.color);
            
            var vert2 = [
                this.centre[0],
                this.centre[1],
                0
            ];
            vert2 = vert2.concat(this.color);

            this.vertexAttributesData = this.vertexAttributesData.concat(vert1);
            this.vertexAttributesData = this.vertexAttributesData.concat(vert2);
        }
        //console.log(this.centre);
    }

    color_black(){
        this.color = [0,0,0];
        this.constructPoints();
    }

    color_normal(){
        this.color = [0,0,1];
        //console.log("Colored Normal", this.centre);
        this.constructPoints();
    }

    setRadius(radius){
        this.radius = radius;
        this.constructPoints();
    }

    draw(shader){
        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");

        let elementPerVertex = 6;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexAttributesData), this.gl.STATIC_DRAW);

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
            this.gl.TRIANGLE_STRIP,
            0,                  // Offset
            this.vertexAttributesData.length / (elementPerVertex)                   // Number of vertices
        );
    }

    updateCentroid(){
        const currentVertex = vec4.fromValues(this.centre[0],this.centre[1],0,1);
		const updatedVertex = vec4.create();
		vec4.transformMat4( updatedVertex, currentVertex , this.transform.getMVPMatrix() );
        
        this.centre = [updatedVertex[0],updatedVertex[1]];
    }

    getCentroid(){
        return this.actual_centre;
    }

    getName(){
        return this.name;
    }

    setCentroid( centroid ){
        this.actual_centre = centroid;
    }

    getRadius(){
        return this.radius;
    }
}