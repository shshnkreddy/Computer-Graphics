import Shader from './shader.js';
import vertexShaderSrc_Gouraud from './vertex_gouraud.js';
import fragmentShaderSrc_Gouraud from './fragment_gouraud.js';
import vertexShaderSrc_Phong from './vertex_phong.js';
import fragmentShaderSrc_Phong from './fragment_phong.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js';
import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';

function trackballProjection(v) {
    var d, a;

    d = v[0] * v[0] + v[1] * v[1];
    
    if (d < 1.0)
        v[2] = Math.sqrt(1.0 - d);
    else {
        v[2] = 0.0;
        a = 1.0 / Math.sqrt(d);
        v[0] *= a;
        v[1] *= a;
    }
    return v;
}

const renderer = new Renderer();
const gl = renderer.webGlContext();
const shader_gouraud = new Shader(gl, vertexShaderSrc_Gouraud, fragmentShaderSrc_Gouraud);
shader_gouraud.use();

const shader_phong = new Shader(gl, vertexShaderSrc_Phong, fragmentShaderSrc_Phong);

const BBox_Length = {'helicopter' : 8, 'shoe' : 5, 'porshe' : 6};

let light_colors = {
	'ambient' : [0, 1, 0],
	'diffused1' : [0.6, 0.6, 0],
	'diffused2' : [0, 0.6, 0.6],
	'diffused3' : [0.9, 0, 0.9],
	'specular1' : [0,0.9,0.9],
	'specular2' : [1,1,1],
	'specular3' : [0.95, 0.95, 0]
}

const mesh1_data = document.getElementById('shoe.obj').innerHTML;
const mesh1 = new Mesh(gl,mesh1_data,[0.25,0,0],renderer, BBox_Length['shoe'], [0.1,0.4,0.1,7]);
mesh1.transform.quatRotate([1,0,0], Math.PI);
mesh1.transform.setTranslate([4,4,0]);

const mesh2_data = document.getElementById('porshe.obj').innerHTML;
const mesh2 = new Mesh(gl,mesh2_data,[0,0.25,0],renderer, BBox_Length['porshe'], [0.15,0.25,0.7,3]);
mesh2.transform.quatRotate([1,0,0], Math.PI);
mesh2.transform.setTranslate([4,-8,0]);

const mesh3_data = document.getElementById('helicopter.obj').innerHTML;
const mesh3 = new Mesh(gl,mesh3_data,[0,0,0.25],renderer, BBox_Length['helicopter'], [0.2,0.6,0.5,1] );
mesh3.transform.quatRotate([1,0,0], Math.PI/2);
mesh3.transform.setTranslate([-8,4,0]);

let modes = [1,1,1];

let shader_list = 
{
	'helicopter' : 'gouraud',
	'porshe' : 'gouraud',
	'shoe' : 'phong'
};

let mesh_name = {
	2 : 'helicopter',
	1 : 'porshe',
	0 : 'shoe'
};

let mesh_index = {
	'helicopter' : 2,
	'porshe' : 1,
	'shoe' : 0
};

let mesh_id = {
	9 : 'helicopter',
	8 : 'porshe',
	7 : 'shoe'
};

let mesh_light_index = {
	7 : 0,
	8 : 1,
	9 : 2
};

const cube_data = document.getElementById('cube.obj').innerHTML;
const cube1 = new Mesh(gl,cube_data, [1,1,1], renderer, 1, [0,0,0,1]);
let scale = 0.2;
cube1.transform.setScale([scale,scale,scale]);
let light_pos1 = mesh1.getLightPos();
cube1.transform.setTranslate([light_pos1[0], light_pos1[1], light_pos1[2]]);

const cube2 = new Mesh(gl,cube_data, [1,1,1], renderer, 1, [0,0,0,1]);
cube2.transform.setScale([scale,scale,scale]);
let light_pos2 = mesh2.getLightPos();
cube2.transform.setTranslate([light_pos2[0], light_pos2[1], light_pos2[2]]);

const cube3 = new Mesh(gl,cube_data, [1,1,1], renderer, 1, [0,0,0,1]);
cube3.transform.setScale([scale,scale,scale]);
let light_pos3 = mesh3.getLightPos();
cube3.transform.setTranslate([light_pos3[0], light_pos3[1], light_pos3[2]]);

let mode = 'v';
let sceneObjects = [];
sceneObjects = sceneObjects.concat([mesh1, mesh2, mesh3]);

let lights = [];
lights = lights.concat([cube1, cube2, cube3]);
function render()
{
	renderer.clear();
	
	let light_pos = [];
	for(let i = 0; i < lights.length; ++i) light_pos.push(lights[i].getCentre());
		
	for(let i = 0; i < sceneObjects.length; ++i){
		let name = mesh_name[i];

		let shader = shader_list[name];
		if(shader == 'gouraud'){
			shader_gouraud.use();
			sceneObjects[i].draw(shader_gouraud, light_colors, light_pos, modes);
		}
		else{
			shader_phong.use();
			sceneObjects[i].draw(shader_phong, light_colors, light_pos, modes);
		}	
	}
	shader_gouraud.use();
	for(let i = 0; i <  lights.length; ++i){
		lights[i].draw(shader_gouraud, light_colors, light_pos, modes);
	}
}

let selected_mesh = 2;
let translation_factor = 0.5;
let positivescalingFactor = 1.05;
let negativeScalingFactor = 0.95;
let scalingFactor = 0.05;
let rotation_axis = 'x';
var mouseDown = false, mouseX = 0, mouseY = 0;

render();
window.onload = () => {
	renderer.getCanvas().addEventListener('mousedown', (event) =>
	{
		event.preventDefault();
		mouseDown = true;
		let Coords =  renderer.mouseToClipCoord(event.clientX,event.clientY);
		mouseX = Coords[0];
		mouseY = Coords[1];
	}, true);

	renderer.getCanvas().addEventListener('mousemove', (event) =>
	{
		if (!mouseDown || mode != 'm' || selected_mesh == 2) {return} 
		event.preventDefault();
		let eventCoordinates = renderer.mouseToClipCoord(event.clientX,event.clientY);
		var clickX = eventCoordinates[0];
		var clickY = eventCoordinates[1];

		var deltaX = eventCoordinates[0] - mouseX;
		var deltaY = eventCoordinates[1] - mouseY;
		
		var p1 = trackballProjection([mouseX, mouseY]);
		var p2 = trackballProjection([clickX, clickY]);
		// console.log(p1,p2);
		let axis = vec3.create();
		vec3.cross(axis, p1, p2);
		vec3.normalize(axis, axis);

		let distance_factor = 0.05;
		let angle = Math.sqrt(deltaX*deltaX + deltaY * deltaY) * (Math.PI) * distance_factor;
		
		let mesh_name = mesh_id[selected_mesh];
		let mesh_ndx = mesh_index[mesh_name];
		let centre = sceneObjects[mesh_ndx].getCentre();
		sceneObjects[mesh_ndx].transform.setTranslate([-centre[0],-centre[1],-centre[2]]);
		sceneObjects[mesh_ndx].transform.quatRotate(axis,angle);
		sceneObjects[mesh_ndx].transform.setTranslate([centre[0],centre[1],centre[2]]);

		render();
	});

	renderer.getCanvas().addEventListener('mouseup', function (event) {
		event.preventDefault();
		mouseDown = false;
	}, false);

	window.addEventListener('keydown', function (event) {
		console.log('Key Pressed:', event.key);
		switch(event.key){
			case 'v':
				mode = 'v';
				break;
			
			case 'ArrowLeft':
				if(mode == 'v'){
					renderer.rotateCamera(rotation_axis, -1);
				}	
				break;

			case 'ArrowRight':
				if(mode == 'v'){
					renderer.rotateCamera(rotation_axis, 1);
				}
				break;
			
			case '+':
				if(mode == 'v'){
					renderer.zoom(1);
				}

				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					sceneObjects[mesh_ndx].positiveScale(scalingFactor);
					if(sceneObjects[mesh_ndx].Scale_BBox_Limit(light_pos)){
						let centre = sceneObjects[mesh_ndx].getCentre();
						sceneObjects[mesh_ndx].transform.setTranslate([-centre[0],-centre[1],-centre[2]]);
						let scalingVector = [positivescalingFactor, positivescalingFactor, positivescalingFactor];
						console.log(scalingVector);
						sceneObjects[mesh_ndx].transform.setScale(scalingVector);
						sceneObjects[mesh_ndx].transform.setTranslate([centre[0],centre[1],centre[2]]);
					}
					else{
						sceneObjects[mesh_ndx].negativeScale(scalingFactor);
					}
				}
				break;
			
			case '-':
				if(mode == 'v'){
					renderer.zoom(-1);
				}

				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					sceneObjects[mesh_ndx].negativeScale(scalingFactor);
					if(sceneObjects[mesh_ndx].Scale_BBox_Limit(light_pos)){
						let centre = sceneObjects[mesh_ndx].getCentre();
						sceneObjects[mesh_ndx].transform.setTranslate([-centre[0],-centre[1],-centre[2]]);
						let scalingVector = [negativeScalingFactor, negativeScalingFactor, negativeScalingFactor];
						// console.log(scalingVector);
						sceneObjects[mesh_ndx].transform.setScale(scalingVector);
						sceneObjects[mesh_ndx].transform.setTranslate([centre[0],centre[1],centre[2]]);
					}
					else{
						sceneObjects[mesh_ndx].positiveScale(scalingFactor);
					}
				}
				break;

			case 'm': 
				mode = 'm';
				break;

			case '7':
				selected_mesh = 7;
				break;
			
			case '8':
				selected_mesh = 8;
				break;

			case '9':
				selected_mesh = 9;
				break;

			case 's':
				if(selected_mesh != 2){
					let name = mesh_id[selected_mesh];
					if(shader_list[name] == 'gouraud') shader_list[name] = 'phong';
					else shader_list[name] = 'gouraud';
					console.log(shader_list);
				} 
				break;

			case 'i':
				mode = 'i';
				break;

			case '0':
				if(mode == 'i' && selected_mesh != 2){
					let name = mesh_id[selected_mesh];
					let index = mesh_index[name];
					modes[index] = 0;

					if(index == 0) cube1.color_black();
					else if(index == 1) cube2.color_black();
					else cube3.color_black();
				}
				break;
			
			case '1':
				if(mode == 'i' && selected_mesh != 2){
					let name = mesh_id[selected_mesh];
					let index = mesh_index[name];
					modes[index] = 1;

					if(index == 0) cube1.constructColors();
					else if(index == 1) cube2.constructColors();
					else cube3.constructColors();
				}
				break;

			case 'd':                       //+x direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[0] += delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([+delta,0,0]);
					}
				}

				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([translation_factor, 0, 0]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([translation_factor,0,0]);
				}
				break;
			
			case 'a':                       //-x direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[0] -= delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([-delta,0,0]);
					}
				}
				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([-translation_factor, 0, 0]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([-translation_factor,0,0]);
				}
				break;

			case 'w':                       //+y direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[1] += delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([0,delta,0]);
					}
				}

				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([0, translation_factor, 0]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([0, translation_factor, 0]);
				}
				break;
			
			case 'x':                       //-y direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[1] -= delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([0,-delta,0]);
						
					}
				}
				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([0, -translation_factor, 0]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([0, -translation_factor, 0]);
				}

				if(mode == 'v'){
					rotation_axis = 'x';
				}
				break;

			case 'r':                       //+z direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[2] += delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([0,0,delta]);	
					}
				}
				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([0, 0, translation_factor]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([0, 0, translation_factor]);
				}
				break;

			case 'f':                       //-z direction
				if(mode == 'i' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];

					let light_index = mesh_light_index[selected_mesh];
					let light_pos = lights[light_index].getCentre();

					let delta = 0.25;
					let updatedPos = light_pos;
					updatedPos[2] -= delta;

					if(sceneObjects[mesh_ndx].Within_BBox_Limit(updatedPos)){
						lights[light_index].transform.setTranslate([0,0,-delta]);	
					}
				}
				if(mode == 'm' && selected_mesh != 2){
					let mesh_name = mesh_id[selected_mesh];
					let mesh_ndx = mesh_index[mesh_name];
					sceneObjects[mesh_ndx].transform.setTranslate([0, 0, -translation_factor]);
					
					let light_index = mesh_light_index[selected_mesh];
					lights[light_index].transform.setTranslate([0, 0, -translation_factor]);
				}
				break;
			
			case 'y':
				if(mode == 'v') rotation_axis = 'y';
				break;

			case 'z':
				if(mode == 'v') rotation_axis = 'z';
				break;	
				
			case 'q':
				var a = document.createElement('a');
                a.href = renderer.getCanvas().toDataURL('image/png', 1.0);
                a.download = 'Canvas.png';
                a.click();
				window.close();
				break;
		}
		render();
	}, true);
}

