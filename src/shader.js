export const fragment = `precision highp float;
uniform vec2 resolution;uniform float time;
#define PI 3.14159265
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 env(vec3 d){float soft=pow(max(0.,dot(d,normalize(vec3(-.5,1.,1.)))),8.);float strip=pow(max(0.,1.-abs(d.x*.7+d.y*.3-.35)),65.);float rim=pow(max(0.,dot(d,normalize(vec3(1.,-.2,-.4)))),20.);return vec3(.025,.04,.07)+soft*vec3(.55,.7,.9)+strip*vec3(3.)+rim*vec3(.9,.34,.12);}

float box(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float field(vec3 p){p.xz=rot(time*.7854)*p.xz;p.xy=rot(.35)*p.xy;float spread=.20+.70*pow(.5-.5*cos(time*.7854),2.);float d=10.;for(int i=0;i<7;i++){float k=float(i)-3.;vec3 q=p-vec3(k*spread,0.,0.);q.yz=rot(k*.19+sin(time*.7854)*.45)*q.yz;d=min(d,box(q,vec3(.12,.95-abs(k)*.10,.55))-.035);}return d;}
vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(field(p+e.xyy)-field(p-e.xyy),field(p+e.yxy)-field(p-e.yxy),field(p+e.yyx)-field(p-e.yyx)));}
vec3 backdrop(vec2 p){vec3 c=vec3(.012,.02,.045);float a=exp(-4.*length(p-vec2(-.5,.3))),b=exp(-3.*length(p-vec2(.5,-.3)));float lines=pow(.5+.5*cos(p.x*23.+p.y*8.),22.);return c+vec3(.02,.2,.5)*a+vec3(.4,.035,.23)*b+lines*vec3(.08,.13,.18);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;vec3 ro=vec3(0.,.1,6.),rd=normalize(vec3(uv,-1.6));float t=0.;vec3 p;bool hit=false;for(int i=0;i<90;i++){p=ro+rd*t;float d=field(p);if(d<.002){hit=true;break;}t+=d*.8;if(t>10.)break;}vec3 col=backdrop(uv);if(hit){vec3 n=normal(p);float f=pow(1.-max(dot(n,-rd),0.),3.);vec3 reflection=env(reflect(rd,n));vec3 rr=refract(rd,n,.64),rg=refract(rd,n,.67),rb=refract(rd,n,.70);vec3 trans=vec3(backdrop(uv+rr.xy*.7).r,backdrop(uv+rg.xy*.7).g,backdrop(uv+rb.xy*.7).b);vec3 spectrum=.5+.5*cos(vec3(0.,2.1,4.2)+dot(n,vec3(2.,3.,4.))*2.+time*.7854);col=trans*1.6+reflection*(.15+f*.7)+spectrum*pow(f,.55)*.4;col+=pow(max(dot(reflect(rd,n),normalize(vec3(-.6,1.,1.))),0.),70.)*vec3(2.); }col=pow(col/(1.+col),vec3(.4545));col*=1.-.2*dot(uv,uv);gl_FragColor=vec4(col,1.);}
`;
