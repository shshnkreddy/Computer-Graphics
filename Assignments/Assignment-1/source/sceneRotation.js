import Square from './square.js';
import Rectangle from './rectangle.js'
import Circle from './circle.js';

export default class sceneRotation{
    constructor(gl, shader, sceneObjects){
        this.sceneObjects = sceneObjects;
        this.gl = gl;
        this.shader = shader;
        
        this.minY = 10;
        this.maxY = -10;
        this.minX = 10;
        this.maxX = -10;
        this.centroid = this.getCentroid();
    }

    getCentroid(){
        for(let i = 0; i < this.sceneObjects.length; ++i){
            let name = this.sceneObjects[i].getName();
            let centroid = this.sceneObjects[i].getCentroid();
            
            switch(name){
                case "circle":
                    let radius = this.sceneObjects[i].getRadius();
                    this.maxX = Math.max(this.maxX,centroid[0]+radius);
                    this.minX = Math.min(this.minX,centroid[0]-radius);
                    this.maxY = Math.max(this.maxY,centroid[1]+radius);
                    this.minY = Math.min(this.minY, centroid[1]-radius);
                    break;
                
                case "square":
                    let l = this.sceneObjects[i].getLength() / 2;
                    this.maxX = Math.max(this.maxX,centroid[0]+l);
                    this.minX = Math.min(this.minX,centroid[0]-l);
                    this.maxY = Math.max(this.maxY,centroid[1]+l);
                    this.minY = Math.min(this.minY, centroid[1]-l);
                    break;
                
                case "rectangle":
                    let len = this.sceneObjects[i].getDimensions()[0] / 2;
                    let b = this.sceneObjects[i].getDimensions()[1] / 2;
                    this.maxX = Math.max(this.maxX,centroid[0]+len);
                    this.minX = Math.min(this.minX,centroid[0]-len);
                    this.maxY = Math.max(this.maxY,centroid[1]+b);
                    this.minY = Math.min(this.minY, centroid[1]-b);
                    break;
            }
        }
        if(this.sceneObjects.length>0) this.centroid = [(this.maxX+this.minX)/2,(this.maxY+this.minY)/2];
        return this.centroid;
    }

    rotateAntiClockwise(){
        let rotationAngle = (Math.PI / 180) * 10;

        for(let i = 0; i < this.sceneObjects.length; ++i){
            let centre = this.sceneObjects[i].getCentroid();
            let new_centre = [centre[0]-this.centroid[0],centre[1]-this.centroid[1]];
            var obj;
            //console.log("Centre",centre);
            //console.log("New Centre",new_centre);
            let name = this.sceneObjects[i].getName();
            switch(name){
                case "circle":
                    obj = new Circle(this.gl,new_centre);  
                    obj.setRadius(this.sceneObjects[i].getRadius()); 
                    break;            
                case "rectangle":
                    obj = new Rectangle(this.gl,new_centre);
                    obj.setLB(this.sceneObjects[i].getDimensions()[0],this.sceneObjects[i].getDimensions()[1]);
                    break;
                case "square":
                    obj = new Square(this.gl,new_centre);
                    obj.setLength(this.sceneObjects[i].getLength());
                    break;
            } 
            
            let prevRotation = this.sceneObjects[i].transform.getRotate();
            obj.transform.setRotate([0,0,1],rotationAngle+prevRotation);
            obj.transform.setTranslate([this.centroid[0],this.centroid[1],0]);
            
            obj.transform.updateMVPMatrix();
            obj.setCentroid(centre);
            this.sceneObjects[i] = obj;
        }
    }

    rotateClockwise(){
        let rotationAngle = (Math.PI / 180) * 10;

        for(let i = 0; i < this.sceneObjects.length; ++i){
            let centre = this.sceneObjects[i].getCentroid();
            let new_centre = [centre[0]-this.centroid[0],centre[1]-this.centroid[1]];
            var obj;

            let name = this.sceneObjects[i].getName();
            switch(name){
                case "circle":
                    obj = new Circle(this.gl,new_centre);  
                    obj.setRadius(this.sceneObjects[i].getRadius()); 
                    break;            
                case "rectangle":
                    obj = new Rectangle(this.gl,new_centre);
                    obj.setLB(this.sceneObjects[i].getDimensions()[0],this.sceneObjects[i].getDimensions()[1]);
                    break;
                case "square":
                    obj = new Square(this.gl,new_centre);
                    obj.setLength(this.sceneObjects[i].getLength());
                    break;
            } 
            
            let prevRotation = this.sceneObjects[i].transform.getRotate();
            obj.transform.setRotate([0,0,1],prevRotation-rotationAngle);
            obj.transform.setTranslate([this.centroid[0],this.centroid[1],0]);
            obj.transform.updateMVPMatrix();
            
            obj.setCentroid(centre);
            this.sceneObjects[i] = obj;
        }
    }

    draw(){
        for(let i = 0; i < this.sceneObjects.length; ++i){
            this.sceneObjects[i].draw(this.shader);
        }
    }

    retCentroid(){
        return this.centroid;
    }
}