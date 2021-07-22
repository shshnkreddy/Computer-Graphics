import { vec4, vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';

export default class Renderer
{
	constructor()
	{
		this.canvas = document.createElement("canvas");
		document.querySelector("body").appendChild(this.canvas);

		const gl = this.canvas.getContext("webgl",{preserveDrawingBuffer: true}) || this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true});

		if (!gl) throw new Error("WebGL is not supported");
		this.gl = gl;
		this.resizeCanvas();
		window.addEventListener('resize', () => this.resizeCanvas());

		this.projection = mat4.create();
        this.view = mat4.create();
		
        mat4.perspective(this.projection, Math.PI / 2, 16 / 9, 1 / 256, 256);
		
		this.lookingFrom = [15,10,7];
        mat4.lookAt(this.view, this.lookingFrom, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1));
	}

	webGlContext()
	{
		return this.gl;
	}

	resizeCanvas()
	{
		this.canvas.width = Math.min(window.innerWidth,window.innerHeight);
		this.canvas.height = this.canvas.width
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear()
	{
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    }

    getCanvas()
	{
		return this.canvas;
	}
    
    mouseToClipCoord(mouseX,mouseY) {

		// convert the position from pixels to 0.0 to 1.0
		mouseX = mouseX / this.canvas.width;
		mouseY = mouseY / this.canvas.height;

		// convert from 0->1 to 0->2
		mouseX = mouseX * 2;
		mouseY = mouseY * 2;

		// convert from 0->1 to 0->2
		mouseX = mouseX - 1;
		mouseY = mouseY - 1;

		// flip the axis	
		mouseY = -mouseY; // Coordinates in clip space

		return [mouseX, mouseY]
    }
	
	getModelViewMatrix(){
		return this.view;
	}

	getProjectionMatrix(){
		return this.projection;
	}

	rotateCamera(Axis, direction){
		let axis = [0,0,1];
		switch(Axis){
			case 'x':
				axis = [1,0,0];
				break;

			case 'y':
				axis = [0,1,0];
				break;
			
			case 'z':
				axis = [0,0,1];
				break;
		}
		let angle = (Math.PI / 180) * 5;
		if(direction < 0) angle *= -1;
		
		let q = quat.create();
		quat.setAxisAngle(q, axis, angle);
		let rotationMatrix = mat4.create();
		mat4.fromQuat(rotationMatrix,q);
		

		let output_vec = vec4.create();
		vec4.transformMat4(output_vec, vec4.fromValues(this.lookingFrom[0],this.lookingFrom[1], this.lookingFrom[2], 1), rotationMatrix);
		this.lookingFrom = [output_vec[0], output_vec[1], output_vec[2]];
		
		mat4.identity(this.view);
		mat4.lookAt(this.view,this.lookingFrom,vec3.fromValues(0,0,0),vec3.fromValues(0,0,1));
	}

	zoom(direction_val){
		let translate = 0.1;
		if(direction_val > 0) translate *= -1;
		let direction = vec3.fromValues(this.lookingFrom[0],this.lookingFrom[1],this.lookingFrom[2]); 
		vec3.normalize(direction,direction);
		vec3.scale(direction, direction, translate);

		let translationMatrix = mat4.create();
		mat4.fromTranslation(translationMatrix, direction);

		let output_vec = vec4.create();
		vec4.transformMat4(output_vec, vec4.fromValues(this.lookingFrom[0],this.lookingFrom[1], this.lookingFrom[2], 1), translationMatrix);
		this.lookingFrom = [output_vec[0], output_vec[1], output_vec[2]];
		
		mat4.identity(this.view);
		mat4.lookAt(this.view,this.lookingFrom,vec3.fromValues(0,0,0),vec3.fromValues(0,0,1));
	}

	getEyeCoords(){
		return this.lookingFrom;
	}
}