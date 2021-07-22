import { vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
	constructor()
	{
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 1);
		this.modelTransformMatrix = mat4.create();
		this.modelInverseTransposeMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		mat4.identity(this.modelInverseTransposeMatrix);
	}

	getModelTransformationMatrix()
	{
		return this.modelTransformMatrix;
	}

	getModelInverseTranspose(){
		
		mat4.invert(this.modelInverseTransposeMatrix, this.modelTransformMatrix);
		mat4.transpose(this.modelInverseTransposeMatrix, this.modelInverseTransposeMatrix);

		return this.modelInverseTransposeMatrix;
	}

    Rotate(){
        let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix,this.rotationAngle,this.rotationAxis);
		mat4.multiply(this.modelTransformMatrix, rotationMatrix, this.modelTransformMatrix);
    }

    Translate(){
        let translationMatrix = mat4.create();
		mat4.fromTranslation(translationMatrix, this.translate);
		mat4.multiply(this.modelTransformMatrix, translationMatrix, this.modelTransformMatrix);
    }

	setTranslate(translationVec)
	{
		this.translate = translationVec;
        this.Translate();
	}

	getTranslate()
	{
		return this.translate;
	}

    Scale(){
        let scalingMatrix = mat4.create();
		mat4.fromScaling(scalingMatrix, this.scale);
		mat4.multiply(this.modelTransformMatrix,scalingMatrix,this.modelTransformMatrix);
    }

	setScale(scalingVec)
	{
		this.scale = scalingVec;
        this.Scale();
	}

	getScale()
	{
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle)
	{
		this.rotationAngle = rotationAngle;
		this.rotationAxis = rotationAxis;
        this.Rotate();
	}

	getRotate()
	{
		return this.rotationAngle;
    }
	
	quatRotate(axis, angle){
		axis = vec3.normalize(axis, axis);
		let q = quat.create();
		quat.setAxisAngle(q, axis, angle);
		
		let rotationMatrix = mat4.create();
		mat4.fromQuat(rotationMatrix,q);
		mat4.multiply(this.modelTransformMatrix, rotationMatrix, this.modelTransformMatrix);
	}
}