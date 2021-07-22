import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js';

const renderer = new Renderer();
const gl = renderer.webGlContext();
const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

var mesh_colors = {
	1 : [[1, 0, 1],[0.8980392156862745,0,0.8980392156862745],[0.8,0,0.8]],
	2 : [[1, 1, 0],[0.8980392156862745, 0.8980392156862745, 0],[0.8, 0.8, 0]],
	3 : [[0, 1, 1],[0, 0.8980392156862745, 0.8980392156862745],[0, 0.8, 0.8]]
};

const axis_data = document.getElementById('axis.obj').innerHTML;
const y_axis = new Mesh(gl,axis_data,[0,1,0],renderer); 

const z_axis = new Mesh(gl,axis_data,[0,0,1],renderer);
z_axis.transform.setRotate([1,0,0],Math.PI/2);

const x_axis = new Mesh(gl,axis_data,[1,0,0],renderer);
x_axis.transform.setRotate([0,0,1],Math.PI/2);

const mesh1_data = document.getElementById('porshe.obj').innerHTML;
const mesh1 = new Mesh(gl,mesh1_data,mesh_colors[1][0],renderer);

const mesh2_data = document.getElementById('helicopter.obj').innerHTML;
const mesh2 = new Mesh(gl,mesh2_data,mesh_colors[2][0],renderer);

const mesh3_data = document.getElementById('shoe.obj').innerHTML;
const mesh3 = new Mesh(gl,mesh3_data,mesh_colors[3][0],renderer);

var sceneObjects = []
sceneObjects = sceneObjects.concat([x_axis,y_axis,z_axis,mesh1,mesh2,mesh3]);
const index_mesh1 = 3;
const index_mesh2 = 4;
const index_mesh3 = 5;
const triangle_vertices = [
	[4,4,0],
	[4,-8,0],
	[-8,4,0]
];

const triangle_mid_points = [
	[(triangle_vertices[0][0] + triangle_vertices[1][0]) / 2, (triangle_vertices[0][1] + triangle_vertices[1][1]) / 2, (triangle_vertices[0][2] + triangle_vertices[1][2]) / 2],
	[(triangle_vertices[1][0] + triangle_vertices[2][0]) / 2, (triangle_vertices[1][1] + triangle_vertices[2][1]) / 2, (triangle_vertices[1][2] + triangle_vertices[2][2]) / 2],
	[(triangle_vertices[0][0] + triangle_vertices[2][0]) / 2, (triangle_vertices[0][1] + triangle_vertices[2][1]) / 2, (triangle_vertices[0][2] + triangle_vertices[2][2]) / 2],
];

var mode = 'x';
var picking_mode = 'o';
var picked = -1;
var mouseDown = false, mouseX = 0, mouseY = 0;
var axis = 'z';

const initialcurrCentre1 = sceneObjects[index_mesh1].getCentre();	
const initialcurrCentre2 = sceneObjects[index_mesh2].getCentre();
const initialcurrCentre3 = sceneObjects[index_mesh3].getCentre();

sceneObjects[index_mesh1].transform.setTranslate([-initialcurrCentre1[0],-initialcurrCentre1[1],-initialcurrCentre1[2]]);
sceneObjects[index_mesh2].transform.setTranslate([-initialcurrCentre2[0],-initialcurrCentre2[1],-initialcurrCentre2[2]]);
sceneObjects[index_mesh3].transform.setTranslate([-initialcurrCentre3[0],-initialcurrCentre3[1],-initialcurrCentre3[2]]);

sceneObjects[index_mesh1].transform.setScale([0.5,0.5,0.5]);
sceneObjects[index_mesh2].transform.setScale([0.5,0.5,0.5]);
sceneObjects[index_mesh3].transform.setScale([0.5,0.5,0.5]);

sceneObjects[index_mesh1].transform.setTranslate([initialcurrCentre1[0],initialcurrCentre1[1],initialcurrCentre1[2]]);
sceneObjects[index_mesh2].transform.setTranslate([initialcurrCentre2[0],initialcurrCentre2[1],initialcurrCentre2[2]]);
sceneObjects[index_mesh3].transform.setTranslate([initialcurrCentre3[0],initialcurrCentre3[1],initialcurrCentre3[2]]);

for(let i = 0; i < sceneObjects.length; ++i){
	sceneObjects[i].draw(shader);
}

function pixelInputToCanvasCoord(event, canvas){
	var x = event.clientX,
    y = event.clientY,
    rect = event.target.getBoundingClientRect();
    x = x - rect.left;
    y = rect.bottom - y;
    return {x:x,y:y};
}

window.onload = () => {

	renderer.getCanvas().addEventListener('mousedown', (event) =>
	{
		event.preventDefault();
		mouseDown = true;
		let Coords =  renderer.mouseToClipCoord(event.clientX,event.clientY);
		mouseX = Coords[0];
		mouseY = Coords[1];
	});

	renderer.getCanvas().addEventListener('mousemove', (event) =>
	{
		if (!mouseDown || mode != 'i') {return} 
		event.preventDefault();
		let eventCoordinates = renderer.mouseToClipCoord(event.clientX,event.clientY);
		var deltaX = eventCoordinates[0] - mouseX;
		var deltaY = eventCoordinates[1] - mouseY;
		let Coords =  renderer.mouseToClipCoord(event.clientX,event.clientY);
		mouseX = Coords[0];
		mouseY = Coords[1];
		if(Math.abs(deltaX) > Math.abs(deltaY)) renderer.rotateCamera(axis,deltaX);
		renderer.clear();
		for(let i = 0; i < sceneObjects.length; ++i){
			sceneObjects[i].draw(shader);
		}
	});

	renderer.getCanvas().addEventListener('click', (event) =>
    {
		var point = pixelInputToCanvasCoord(event, renderer.canvas);
		let pixels = new Uint8Array(4);
		gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		let pixel_color = [pixels[0]/255,pixels[1]/255,pixels[2]/255];
		if(mode == 'h'){
			if(picked != -1) {
				switch (picked){
					case 1: 
						sceneObjects[index_mesh1].constructColors();
						break;
					case 2: 
						sceneObjects[index_mesh2].constructColors();
						break;
					case 3:
						sceneObjects[index_mesh3].constructColors();
						break;
				}
			}
			switch(picking_mode){
				case 'o':			
					if(JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[1][0])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[1][1])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[1][2])){
						sceneObjects[index_mesh1].pickObject();
						picked = 1;
					}
					else if(JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[2][0])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[2][1])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[2][2])){
						sceneObjects[index_mesh2].pickObject();
						picked = 2;
					}
					else if(JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[3][0])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[3][1])||JSON.stringify(pixel_color)==JSON.stringify(mesh_colors[3][2])){
						sceneObjects[index_mesh3].pickObject();
						picked = 3;
					}
					else picked = -1;
					break;
				
				case 'f': 
					if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[1][0])){
						sceneObjects[index_mesh1].pickSubPart(0);
						picked = 1;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[1][1])){
						sceneObjects[index_mesh1].pickSubPart(1);
						picked = 1;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[1][2])){
						sceneObjects[index_mesh1].pickSubPart(2);
						picked = 1;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[2][0])){
						sceneObjects[index_mesh2].pickSubPart(0);
						picked = 2;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[2][1])){
						sceneObjects[index_mesh2].pickSubPart(1);
						picked = 2;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[2][2])){
						sceneObjects[index_mesh2].pickSubPart(2);
						picked = 2;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[3][0])){
						sceneObjects[index_mesh3].pickSubPart(0);
						picked = 3;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[3][1])){
						sceneObjects[index_mesh3].pickSubPart(1);
						picked = 3;
					}
					else if(JSON.stringify(pixel_color) == JSON.stringify(mesh_colors[3][2])){
						sceneObjects[index_mesh3].pickSubPart(2);
						picked = 3;
					}
					else picked = -1;
					break;
			}
		}
		renderer.clear();
		for(let i = 0; i < sceneObjects.length; ++i){
			sceneObjects[i].draw(shader);
		}
	},false);

	renderer.getCanvas().addEventListener('mouseup', function (event) {
		event.preventDefault();
		mouseDown = false;
	}, false);

	window.addEventListener('keydown', function(event) {
		const currCentre1 = sceneObjects[index_mesh1].getCentre();	
		const currCentre2 = sceneObjects[index_mesh2].getCentre();
		const currCentre3 = sceneObjects[index_mesh3].getCentre();
		
		console.log("Key Pressed:", event.key);
		switch(event.key){
			case 'd':
				mode = 'd';
				sceneObjects[index_mesh1].transform.setTranslate([triangle_vertices[0][0]-currCentre1[0],triangle_vertices[0][1]-currCentre1[1],triangle_vertices[0][2]-currCentre1[2]]);
				sceneObjects[index_mesh2].transform.setTranslate([triangle_vertices[1][0]-currCentre2[0],triangle_vertices[1][1]-currCentre2[1],triangle_vertices[1][2]-currCentre2[2]]);
				sceneObjects[index_mesh3].transform.setTranslate([triangle_vertices[2][0]-currCentre3[0],triangle_vertices[2][1]-currCentre3[1],triangle_vertices[2][2]-currCentre3[2]]);
				break;

			case 'e':
				mode = 'e';
				sceneObjects[index_mesh1].transform.setTranslate([triangle_mid_points[0][0]-currCentre1[0],triangle_mid_points[0][1]-currCentre1[1],triangle_mid_points[0][2]-currCentre1[2]]);
				sceneObjects[index_mesh2].transform.setTranslate([triangle_mid_points[1][0]-currCentre2[0],triangle_mid_points[1][1]-currCentre2[1],triangle_mid_points[1][2]-currCentre2[2]]);
				sceneObjects[index_mesh3].transform.setTranslate([triangle_mid_points[2][0]-currCentre3[0],triangle_mid_points[2][1]-currCentre3[1],triangle_mid_points[2][2]-currCentre3[2]]);
				break;
			
			case 'f':
				mode = 'f';
				sceneObjects[index_mesh1].transform.setTranslate([-currCentre1[0],-currCentre1[1],-currCentre1[2]]);
				sceneObjects[index_mesh2].transform.setTranslate([-currCentre2[0],-currCentre2[1],-currCentre2[2]]);
				sceneObjects[index_mesh3].transform.setTranslate([-currCentre3[0],-currCentre3[1],-currCentre3[2]]);

				sceneObjects[index_mesh1].transform.setRotate([0,0,1], Math.PI/2);
				sceneObjects[index_mesh2].transform.setRotate([0,1,0], Math.PI/2);
				sceneObjects[index_mesh3].transform.setRotate([1,0,0], Math.PI/2);

				sceneObjects[index_mesh1].transform.setTranslate([currCentre1[0],currCentre1[1],currCentre1[2]]);
				sceneObjects[index_mesh2].transform.setTranslate([currCentre2[0],currCentre2[1],currCentre2[2]]);
				sceneObjects[index_mesh3].transform.setTranslate([currCentre3[0],currCentre3[1],currCentre3[2]]);
				break;

			case 'g':
				mode = 'g';
				break;

			case 'h':
				mode = 'h';
				break;

			case 'i':
				mode = 'i';
				break;

			case 'q':
				var a = document.createElement('a');
                a.href = renderer.getCanvas().toDataURL('image/png', 1.0);
                a.download = 'Canvas.png';
                a.click();
				window.close();
				break;
			
			case '1':
				if(mode == 'g'){
					sceneObjects[index_mesh1].transform.setTranslate([-currCentre1[0],-currCentre1[1],-currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([-currCentre2[0],-currCentre2[1],-currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([-currCentre3[0],-currCentre3[1],-currCentre3[2]]);

					sceneObjects[index_mesh1].transform.setScale([0.5,0.5,0.5]);
					sceneObjects[index_mesh2].transform.setScale([0.5,0.5,0.5]);
					sceneObjects[index_mesh3].transform.setScale([0.5,0.5,0.5]);

					sceneObjects[index_mesh1].transform.setTranslate([currCentre1[0],currCentre1[1],currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([currCentre2[0],currCentre2[1],currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([currCentre3[0],currCentre3[1],currCentre3[2]]);
				}
				else if(mode == 'i'){
					axis = 'x';
				}
				else if(mode == 'h'){
					picking_mode = 'o';
				}
				break;

			case '2':
				if(mode == 'g'){
					sceneObjects[index_mesh1].transform.setTranslate([-currCentre1[0],-currCentre1[1],-currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([-currCentre2[0],-currCentre2[1],-currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([-currCentre3[0],-currCentre3[1],-currCentre3[2]]);

					sceneObjects[index_mesh1].transform.setScale([2,2,2]);
					sceneObjects[index_mesh2].transform.setScale([2,2,2]);
					sceneObjects[index_mesh3].transform.setScale([2,2,2]);

					sceneObjects[index_mesh1].transform.setTranslate([currCentre1[0],currCentre1[1],currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([currCentre2[0],currCentre2[1],currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([currCentre3[0],currCentre3[1],currCentre3[2]]);
				}
				else if(mode == 'i'){
					axis = 'y';
				}
				else if(mode == 'h'){
					picking_mode = 'f';
				}
				break;

			case '3':
				if(mode == 'g'){
					sceneObjects[index_mesh1].transform.setTranslate([-currCentre1[0],-currCentre1[1],-currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([-currCentre2[0],-currCentre2[1],-currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([-currCentre3[0],-currCentre3[1],-currCentre3[2]]);

					sceneObjects[index_mesh1].transform.setScale([3,3,3]);
					sceneObjects[index_mesh2].transform.setScale([3,3,3]);
					sceneObjects[index_mesh3].transform.setScale([3,3,3]);

					sceneObjects[index_mesh1].transform.setTranslate([currCentre1[0],currCentre1[1],currCentre1[2]]);
					sceneObjects[index_mesh2].transform.setTranslate([currCentre2[0],currCentre2[1],currCentre2[2]]);
					sceneObjects[index_mesh3].transform.setTranslate([currCentre3[0],currCentre3[1],currCentre3[2]]);
				}
				if(mode == 'i'){
					axis = 'z';
				}
				break;

			case '+':
				if(mode == 'i'){
					renderer.zoom(1);
				}
				break;
			
			case '-':
				if(mode == 'i'){
					renderer.zoom(-1);
				}
				break;

		}
		renderer.clear();
		for(let i = 0; i < sceneObjects.length; ++i){
			sceneObjects[i].draw(shader);
		}
	}, true);
}

shader.delete();
