module.exports = 
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float time;
void main()
{
    vec4 src_color = texture2D(CC_Texture0, v_texCoord).rgba;
    float width = 0.2;
    float start = time * 1.2;
    float strength = 0.02;
    float offset = 0.2;

    if( v_texCoord.x < (start - offset * v_texCoord.y) &&  v_texCoord.x > (start - offset * v_texCoord.y - width))
    {
        vec3 improve = strength * vec3(255, 255, 255);
        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
        gl_FragColor = vec4(result, src_color.a);

    } else {
        gl_FragColor = src_color;
    }
}
`