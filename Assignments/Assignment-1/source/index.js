import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Square from './square.js';
import Rectangle from './rectangle.js'
import Circle from './circle.js';
import sceneRotation from './sceneRotation.js';
//Sizes not standard.

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

function deepCopy(sceneObjects){
    var sceneObjectsdeepCopy = [];
    for(let i = 0; i < sceneObjects.length; ++i){
        let name = sceneObjects[i].getName();
        var new_obj;
        switch(name){
            case "circle": 
                new_obj = new Circle(gl,sceneObjects[i].getCentroid());
                new_obj.setRadius(new_obj.getRadius()*sceneObjects[i].transform.getScale()[0]);
                break;
            
            case "square":
                new_obj = new Square(gl,sceneObjects[i].getCentroid());
                new_obj.setLength(new_obj.getLength()*sceneObjects[i].transform.getScale()[0]);
                break;

            case "rectangle":
                new_obj = new Rectangle(gl,sceneObjects[i].getCentroid());
                new_obj.setLB(new_obj.getDimensions()[0]*sceneObjects[i].transform.getScale()[0],new_obj.getDimensions()[1]*sceneObjects[i].transform.getScale()[0]);
                break;
        }
        sceneObjectsdeepCopy.push(new_obj);
    }
    return sceneObjectsdeepCopy;
    
}

//Global Variables for Control
var mode = 0;
var shape = "s";
var sceneObjects = [];
var marker = -1;
var scene;


window.onload = () => {

    renderer.getCanvas().addEventListener('click', (event) =>
    {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
    
        const clipCoordinates = renderer.mouseToClipCoord(mouseX,mouseY);
        
        if (mode == 0){

            switch (shape){
                
                case "s":
                    let square = new Square(gl, clipCoordinates);
                    sceneObjects.push(square);
                    break;
                
                case "r":
                    let rectangle = new Rectangle(gl, clipCoordinates);
                    sceneObjects.push(rectangle);
                    break;
                
                case "c":
                    let circle = new Circle(gl, clipCoordinates);
                    sceneObjects.push(circle);
                    break;
                
            }
        }
        
        if(mode == 1){
            let min_distance = 1000.0;
            
            marker = sceneObjects.length;
            for(let i = 0; i < sceneObjects.length; ++i){
                let centroid = sceneObjects[i].getCentroid();
                let l2_norm = (clipCoordinates[0]-centroid[0]) * (clipCoordinates[0]-centroid[0]) + (clipCoordinates[1]-centroid[1]) * (clipCoordinates[1]-centroid[1]);
                if(min_distance > l2_norm){
                    min_distance = l2_norm;
                    marker = i;
                }
            }

            for(let i = 0; i < sceneObjects.length; ++i){
                sceneObjects[i].color_normal();
            }
            if (marker!=sceneObjects.length) sceneObjects[marker].color_black();
        }
        
        renderer.clear();

        if(mode == 1 || mode == 0){
            for(let i = 0; i < sceneObjects.length; ++i){
                sceneObjects[i].draw(shader);
            }
        }

        else{
            scene.draw();
        }
        
    });

    window.addEventListener('keydown', function(event) {
        switch (event.key){
            case "m":
                mode = (mode + 1) % 3;
                for(let i = 0; i < sceneObjects.length; ++i){
                    sceneObjects[i].color_normal();
                }
                if(mode==1) {
                    marker = sceneObjects.length;
                    
                    for(let i = 0; i < sceneObjects.length; ++i){
                        let scalingFactor = 0.0;
                        let name = sceneObjects[i].getName();
                        let prevScale = sceneObjects[i].transform.getScale();
                        let prevCentre = sceneObjects[i].getCentroid();

                        var obj;

                        switch(name){
                            case "circle": 
                                obj = new Circle(gl,[0,0]);
                                break;
                            case "square":
                                obj = new Square(gl,[0,0]);
                                break;
                            case "rectangle":
                                obj = new Rectangle(gl,[0,0]);
                                break;   
                        }
                        //obj.color_black();

                        prevScale[0] += scalingFactor;
                        prevScale[1] += scalingFactor;

                        obj.transform.setScale(prevScale);
                        obj.transform.setTranslate([prevCentre[0],prevCentre[1],0]);
                        obj.transform.updateMVPMatrix();
                        obj.setCentroid(prevCentre);
                        sceneObjects[i] = obj;
                    }
                }
                if(mode==2){
                    let sceneObjectsdeepCopy = deepCopy(sceneObjects);
                    scene = new sceneRotation(gl,shader,sceneObjectsdeepCopy);
                    //console.log(sceneObjectsdeepCopy.length);
                }
                console.log("Key Pressed: m");
                break;
                
            case "r":
                if (mode == 0) shape = "r";
                console.log("Key Pressed: r");
                break;
            case 's':
                if (mode == 0) shape = "s";
                console.log("Key Pressed: s");
                break;
            case 'c':
                if (mode == 0) shape = "c";
                console.log("Key Pressed: c");
                break;
            case 'ArrowUp':               //LOOK FOR SMOOTHENESS!!
                if(mode == 1){
                    let translateDist = 0.1;
                    let prev = sceneObjects[marker].transform.getTranslate();
                    prev[1] += translateDist;
                    sceneObjects[marker].transform.setTranslate(prev);
                    sceneObjects[marker].transform.updateMVPMatrix();
                    //sceneObjects[marker].updateCentroid();
                    let prevCentre = sceneObjects[marker].getCentroid();
                    prevCentre[1] += translateDist;
                    sceneObjects[marker].setCentroid(prevCentre);
                    //console.log(sceneObjects[marker].getCentroid());
                }
                console.log("Key Pressed: Up-Arrow");
                break;
            case 'ArrowDown':
                if(mode == 1){
                    let translateDist = 0.1;
                    let prev = sceneObjects[marker].transform.getTranslate();
                    prev[1] -= translateDist;
                    sceneObjects[marker].transform.setTranslate(prev);
                    sceneObjects[marker].transform.updateMVPMatrix();
                    //sceneObjects[marker].updateCentroid();
                    let prevCentre = sceneObjects[marker].getCentroid();
                    prevCentre[1] -= translateDist;
                    sceneObjects[marker].setCentroid(prevCentre);
                    //console.log(sceneObjects[marker].getCentroid());
                }
                console.log("Key Pressed: Down-Arrow");
                break;
            case 'ArrowLeft':
                if(mode == 1){
                    let translateDist = 0.1;
                    let prev = sceneObjects[marker].transform.getTranslate();
                    prev[0] -= translateDist;
                    sceneObjects[marker].transform.setTranslate(prev);
                    sceneObjects[marker].transform.updateMVPMatrix();
                    // sceneObjects[marker].updateCentroid();
                    let prevCentre = sceneObjects[marker].getCentroid();
                    prevCentre[0] -= translateDist;
                    sceneObjects[marker].setCentroid(prevCentre);
                    //console.log(sceneObjects[marker].getCentroid());
                }
                if(mode==2){
                    scene.rotateAntiClockwise();
                }
                console.log("Key Pressed: Left-Arrow");
                break;
            case 'ArrowRight':
                if(mode == 1){
                    let translateDist = 0.1;
                    let prev = sceneObjects[marker].transform.getTranslate();
                    prev[0] += translateDist;
                    sceneObjects[marker].transform.setTranslate(prev);
                    sceneObjects[marker].transform.updateMVPMatrix();
                    //sceneObjects[marker].updateCentroid();
                    let prevCentre = sceneObjects[marker].getCentroid();
                    prevCentre[0] += translateDist;
                    sceneObjects[marker].setCentroid(prevCentre);
                    //console.log(sceneObjects[marker].getCentroid());
                }
                if(mode==2){
                    scene.rotateClockwise();
                }
                console.log("Key Pressed: Right-Arrow");
                break;
            case 'x':
                if(mode == 1){
                    if(marker!=sceneObjects.length){
                        let deleted = sceneObjects.splice(marker,1);
                    }
                    marker = sceneObjects.length;
                }
                console.log("Key Pressed: X");
                break;
            
            case '+':   
                if(mode == 1){
                    let scalingFactor = 0.1;
                    let name = sceneObjects[marker].getName();
                    let prevScale = sceneObjects[marker].transform.getScale();
                    let prevCentre = sceneObjects[marker].getCentroid();

                    var obj;

                    switch(name){
                        case "circle": 
                            obj = new Circle(gl,[0,0]);
                            break;
                        case "square":
                            obj = new Square(gl,[0,0]);
                            break;
                        case "rectangle":
                            obj = new Rectangle(gl,[0,0]);
                            break;   
                    }
                    obj.color_black();

                    prevScale[0] += scalingFactor;
                    prevScale[1] += scalingFactor;

                    obj.transform.setScale(prevScale);
                    obj.transform.setTranslate([prevCentre[0],prevCentre[1],0]);
                    obj.transform.updateMVPMatrix();
                    obj.setCentroid(prevCentre);
                    sceneObjects[marker] = obj;
                    ///console.log("Scaled",sceneObjects.length);
                }
                console.log("Key Pressed: +");
                break;
            
            case '-':
                
                if(mode == 1){
                    let scalingFactor = 0.1;
                    let name = sceneObjects[marker].getName();
                    let prevScale = sceneObjects[marker].transform.getScale();
                    let prevCentre = sceneObjects[marker].getCentroid();

                    var obj;

                    switch(name){
                        case "circle": 
                            obj = new Circle(gl,[0,0]);
                            break;
                        case "square":
                            obj = new Square(gl,[0,0]);
                            break;
                        case "rectangle":
                            obj = new Rectangle(gl,[0,0]);
                            break;   
                    }
                    obj.color_black();

                    prevScale[0] -= scalingFactor;
                    prevScale[1] -= scalingFactor;

                    obj.transform.setScale(prevScale);
                    obj.transform.setTranslate([prevCentre[0],prevCentre[1],0]);
                    obj.transform.updateMVPMatrix();
                    obj.setCentroid(prevCentre);
                    sceneObjects[marker] = obj;
                }
                console.log("Key Pressed: -");
                break;

            case 'd': //Saves the screenshot.
                if(mode == 2){
                    var a = document.createElement('a');
                    a.href = renderer.getCanvas().toDataURL('image/png', 1.0);
                    a.download = 'download.png';
                    a.click();
                }
                console.log("Key Pressed: d");
                window.close();
                break;

        }
        console.log('Shape:', shape);
        console.log("Mode:", mode);

        renderer.clear();
        if( mode==0 || mode==1 ){
            for(let i = 0; i < sceneObjects.length; ++i){
                sceneObjects[i].draw(shader);
            }
        }
        else if(mode==2){
            scene.draw();
            
        }
    }, true);
}

shader.delete();