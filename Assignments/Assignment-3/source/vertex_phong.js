const vertexShaderSrc_Phong = `      
        attribute vec3 aPosition;  
        attribute vec3 aColor;  
        attribute vec3 aNormal;
        
        uniform mat4 uModelTransformMatrix;  
        uniform mat4 uProjectionMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uModelInverseTransposeMatrix;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vColor;
        void main () {             
            gl_Position = uProjectionMatrix * uModelViewMatrix * uModelTransformMatrix * vec4(aPosition, 1.0); 
		    gl_PointSize = 5.0;     

            vNormal = mat3(uModelInverseTransposeMatrix) * aNormal;  
            vColor = aColor;
            vPosition = aPosition;
        }                          
	  `;

export default vertexShaderSrc_Phong;