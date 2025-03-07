const growTransitionShader = /* glsl */ `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform float u_time;

uniform float u_duration;

float speed = 100.0;
float rippleWidth = 20.0;
float rippleHeight = 0.1;

void main() {  
  vec2 st = v_texCoord;
  st.x *= u_resolution.x/u_resolution.y;
    
  vec2 p = st - 0.0;
    
	float dist = length(p);
    
	float ripple = sin(dist * rippleWidth - u_time * speed) * rippleHeight;
    
    vec4 textureColor = texture2D(u_texture, v_texCoord);
    vec2 rippleUV = v_texCoord + p * ripple;
    
    float maxRadius = 3.0;
    float innerRadius = smoothstep(0.0, 1.0, u_time / (u_duration * 3.0)) * maxRadius;
    float outerRadius = innerRadius - 0.4;

    vec4 color = texture2D(u_texture, rippleUV);
    
    if(dist > innerRadius) color = textureColor;
    
    if(dist < outerRadius) color = vec4(0.0);
    
    gl_FragColor = color;
}
`;

export default growTransitionShader;
