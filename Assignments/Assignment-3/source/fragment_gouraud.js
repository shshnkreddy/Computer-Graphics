const fragmentShaderSrc_Gouraud = `      
		precision mediump float;   
		varying vec3 vColor;       
        void main () {               
          gl_FragColor = vec4(vColor, 1.0); 
        }                            
	  `;

export default fragmentShaderSrc_Gouraud;
