const fragmentShaderSrc_Phong = `      
		precision mediump float;   
		varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vColor;   
        
        uniform float Ka;   // Ambient reflection coefficient
        uniform float Kd;   // Diffuse reflection coefficient
        uniform float Ks;   // Specular reflection coefficient
        uniform float alpha; //shininess
        
        uniform vec3 ambientColor;
        
        uniform vec3 diffusedColor1;
        uniform vec3 diffusedColor2;
        uniform vec3 diffusedColor3;

        uniform vec3 specularColor1;
        uniform vec3 specularColor2;
        uniform vec3 specularColor3;

        uniform vec3 lightPosition1;
        uniform vec3 lightPosition2;
        uniform vec3 lightPosition3;

        uniform float mode1;              // turn the lights off/on
        uniform float mode2;
        uniform float mode3;

        uniform vec3 eyePosition;

        void main () {               
            
            float d1 = length(lightPosition1 - vPosition);
            float d2 = length(lightPosition2 - vPosition);
            float d3 = length(lightPosition3 - vPosition);
            float a = 1.0; float b = 0.001; float c = 0.001;
            
            float attenuation1 = a + b*d1 + c*d1*d1;
            float attenuation2 = a + b*d2 + c*d2*d2;
            float attenuation3 = a + b*d3 + c*d3*d3;

            vec3 lightDirection1 = normalize(lightPosition1 - vPosition);
            vec3 lightDirection2 = normalize(lightPosition2 - vPosition);
            vec3 lightDirection3 = normalize(lightPosition3 - vPosition);
            
            float diffusedIntensity1 = max(dot(lightDirection1,vNormal),0.0);
            float diffusedIntensity2 = max(dot(lightDirection2,vNormal),0.0);
            float diffusedIntensity3 = max(dot(lightDirection3,vNormal),0.0);

            vec3 diffusedColor = Kd * ((mode1 * diffusedIntensity1 * diffusedColor1  / attenuation1) + (mode2 * diffusedIntensity2 * diffusedColor2 / attenuation2) + (mode3 * diffusedIntensity3 * diffusedColor3 / attenuation3)); 

            vec3 eyeDirection = (eyePosition - vPosition);

            vec3 halfVector1 = normalize(eyeDirection + lightDirection1);
            vec3 halfVector2 = normalize(eyeDirection + lightDirection2);
            vec3 halfVector3 = normalize(eyeDirection + lightDirection3);
            
            float specularIntensity1 = pow(max(dot(halfVector1, vNormal),0.0),alpha);
            float specularIntensity2 = pow(max(dot(halfVector2, vNormal),0.0),alpha);
            float specularIntensity3 = pow(max(dot(halfVector3, vNormal),0.0),alpha);

            vec3 specularColor = Ks * ((mode1 * specularIntensity1 * specularColor1 / attenuation1) + (mode2 * specularIntensity2 * specularColor2 / attenuation2) + (mode3 * specularIntensity3 * specularColor3 / attenuation3));

            vec3 fColor = vColor + (Ka * ambientColor) + diffusedColor + specularColor;
            gl_FragColor = vec4(fColor, 1.0);    
              
        }                            
	  `;

export default fragmentShaderSrc_Phong;
