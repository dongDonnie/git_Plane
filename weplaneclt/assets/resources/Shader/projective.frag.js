module.exports =
`
precision highp float;
varying vec4 v_fragmentColor;
varying vec2 v_texCoord; 

uniform float time;

#define MAGIC_FORMULA(time) pow(abs(sin(time+0.1*rand(uv + time))*1.002), 600.)

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{   
    float iGlobalTime = time * 0.85;
    vec2 uv = v_texCoord;
    
    uv.x += sin(uv.y*20.+iGlobalTime*10.)*0.01*MAGIC_FORMULA(iGlobalTime);
    
    uv.x += cos(uv.y*30.+iGlobalTime*10.)*0.01*MAGIC_FORMULA(iGlobalTime);
    
    uv.y += 0.05*MAGIC_FORMULA(iGlobalTime)*sin(rand(vec2(iGlobalTime)));
    
    uv.y = mod(uv.y, 1.);
        
    vec4 video_col = texture2D(CC_Texture0, uv);
    
    if (video_col.a > 0.0)
        video_col += rand(uv + vec2(cos(iGlobalTime), sin(iGlobalTime)))*0.15;
    video_col -= 0.2;
    if (video_col.a > 0.0)
    {
        video_col += uv.y*vec4(0.5, 0.5, 1., 1.)/4.;
    }

    gl_FragColor = v_fragmentColor*video_col;
}
`