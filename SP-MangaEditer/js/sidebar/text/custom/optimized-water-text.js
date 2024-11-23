let t2_water_textSvg,t2_water_defs,t2_water_filter,t2_water_mainText,nowT2WaterStr=null;
function t2_water_deleteSvg(){
[t2_water_textSvg,t2_water_defs,t2_water_filter,t2_water_mainText,nowT2WaterStr]=[null,null,null,null,null];
}
function t2_water_createSvg(left=50,top=100){
t2_water_textSvg=createSvgElement("svg");
setAttributes(t2_water_textSvg,{
"id":"t2_water_textSvg","xmlns":svgHttp
});
Object.assign(t2_water_textSvg.style,{position:'absolute',visibility:'visible'});
t2_water_defs=createSvgElement("defs");
t2_water_filter=createSvgElement("filter");
setAttributes(t2_water_filter,{
"id":"waterFilter","x":"-20%","y":"-20%","width":"140%","height":"140%",
"filterUnits":"objectBoundingBox","primitiveUnits":"userSpaceOnUse","color-interpolation-filters":"sRGB"
});
const filterElements=[
{type:"feTurbulence",attrs:{type:"turbulence",baseFrequency:"0.06 0.03",numOctaves:"1",
seed:"3",stitchTiles:"stitch",result:"turbulence"}},
{type:"feComposite",attrs:{in:"turbulence",in2:"SourceGraphic",operator:"in",result:"composite"}},
{type:"feColorMatrix",attrs:{type:"matrix",values:"1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -2",
in:"composite",result:"colormatrix"}},
{type:"feComposite",attrs:{in:"SourceGraphic",in2:"colormatrix",operator:"in",result:"composite1"}},
{type:"feGaussianBlur",attrs:{stdDeviation:"3 3",in:"composite1",edgeMode:"none",result:"blur1"}},
{type:"feSpecularLighting",attrs:{surfaceScale:"2",specularConstant:"1",specularExponent:"20",
"lighting-color":t2_fillColor.value,in:"blur1",result:"specularLighting"},
child:{type:"feDistantLight",attrs:{azimuth:"-90",elevation:"150"}}},
{type:"feSpecularLighting",attrs:{surfaceScale:"2",specularConstant:"1",specularExponent:"20",
"lighting-color":t2_fillColor.value,in:"blur1",result:"specularLighting2"},
child:{type:"feDistantLight",attrs:{azimuth:"90",elevation:"150"}}},
{type:"feSpecularLighting",attrs:{surfaceScale:"7",specularConstant:"1",specularExponent:"35",
"lighting-color":t2_fillColor.value,in:"blur1",result:"specularLighting1"},
child:{type:"fePointLight",attrs:{x:"150",y:"50",z:"300"}}},
{type:"feComposite",attrs:{in:"specularLighting",in2:"composite1",operator:"in",result:"composite2"}},
{type:"feComposite",attrs:{in:"specularLighting1",in2:"composite1",operator:"in",result:"composite4"}},
{type:"feComposite",attrs:{in:"specularLighting2",in2:"composite1",operator:"in",result:"composite5"}},
{type:"feBlend",attrs:{mode:"multiply",in:"composite5",in2:"SourceGraphic",result:"blend2"}},
{type:"feBlend",attrs:{mode:"color-dodge",in:"composite2",in2:"blend2",result:"blend3"}},
{type:"feBlend",attrs:{mode:"soft-light",in:"composite4",in2:"blend3",result:"blend4"}}
];
filterElements.forEach(({type,attrs,child})=>
t2_water_filter.appendChild(createFilterOneElement(type,attrs,child)));
t2_water_defs.appendChild(t2_water_filter);
t2_water_textSvg.appendChild(t2_water_defs);
t2_water_mainText=createSvgElement("text");
const isVertical=getSelectedValueByGroup("orientation_group")==="vertical";
const textAlign=getSelectedValueByGroup("t2Align");
const textAttrs=isVertical?{
"writing-mode":"vertical-rl",
"dominant-baseline":"ideographic",
"glyph-orientation-vertical":"0",
"text-orientation":"upright",
"filter":"url(#waterFilter)",
"text-anchor":textAlign,
"font-family":`"${t2_fontT2Selector.value}","Noto Sans JP","Yu Gothic",sans-serif`
}:{
"dominant-baseline":"middle",
"text-anchor":textAlign,
"filter":"url(#waterFilter)",
"font-family":`"${t2_fontT2Selector.value}","Noto Sans JP","Yu Gothic",sans-serif`
};
setAttributes(t2_water_mainText,textAttrs);
Object.assign(t2_water_mainText.style,{
"font-size":`${t2_fontSize.value}px`,
"fill":t2_fillColor.value,
"fill-opacity":t2_fillOpacity.value,
"letter-spacing":`${t2_letterSpacing.value}em`,
"line-height":`${t2_lineHeight.value}`
});
t2_water_textSvg.appendChild(t2_water_mainText);
document.body.appendChild(t2_water_textSvg);
t2_water_updateText();
document.body.removeChild(t2_water_textSvg);
t2_water_addSvg(left,top);
}
function t2_water_updateText(){
const lines=t2_text.value.split("\n");
t2_water_mainText.innerHTML="";
const fontSize=parseFloat(t2_fontSize.value);
const lineHeight=parseFloat(t2_lineHeight.value);
const isVertical=getSelectedValueByGroup("orientation_group")==="vertical";
const textAlign=getSelectedValueByGroup("t2Align");
const textAttrs=isVertical?{
"writing-mode":"vertical-rl",
"dominant-baseline":"ideographic",
"glyph-orientation-vertical":"0",
"text-orientation":"upright",
"fill":t2_fillColor.value,
"fill-opacity":t2_fillOpacity.value
}:{
"dominant-baseline":"middle",
"text-anchor":textAlign,
"fill":t2_fillColor.value,
"fill-opacity":t2_fillOpacity.value
};
setAttributes(t2_water_mainText,textAttrs);
const baseStyles={
"font-family":`"${t2_fontT2Selector.value}","Noto Sans JP","Yu Gothic",sans-serif`,
"font-size":`${fontSize}px`,
"letter-spacing":`${t2_letterSpacing.value}em`
};
const verticalStyles={
"writing-mode":"vertical-rl",
"text-orientation":"upright",
"glyph-orientation-vertical":"0",
"dominant-baseline":"ideographic"
};
const styleStr=Object.entries(isVertical?{...baseStyles,...verticalStyles}:baseStyles)
.map(([k,v])=>`${k}:${v}`).join(";");
t2_water_mainText.setAttribute("style",styleStr);
let totalHeight=0;
lines.forEach((line,index)=>{
const tspan=createSvgElement("tspan");
tspan.textContent=line;
setAttributes(tspan,{
...(isVertical?{"y":"0","x":`${-totalHeight}px`}:{"x":"0","dy":index===0?"0":`${lineHeight}em`}),
"fill":t2_fillColor.value,
"fill-opacity":t2_fillOpacity.value
});
t2_water_mainText.appendChild(tspan);
if(isVertical)totalHeight+=fontSize*lineHeight;
});
t2_water_updateSvgSize();
}
function t2_water_updateSvgSize(){
try{
const{x,y,width,height}=t2_water_mainText.getBBox();
const dims={
  viewBox:`${x} ${y} ${width} ${height}`,
  width:width,height:height
};
setAttributes(t2_water_textSvg,dims);
}catch(error){}
}
function t2_water_addSvg(left,top){
const svgString=new XMLSerializer().serializeToString(t2_water_textSvg);
const reader=new FileReader();
reader.onload=({target})=>{
fabric.Image.fromURL(target.result,img=>{
Object.assign(img,{left,top});
nowT2WaterStr=img;
img.text = getFirstNCharsDefault(t2_text);
canvas.add(img).setActiveObject(img).renderAll();
},{crossOrigin:'anonymous'});
};
reader.readAsDataURL(new Blob([svgString],{type:"image/svg+xml;charset=utf-8"}));
}
function t2_water_updateAll(){
const position=nowT2WaterStr?
{left:nowT2WaterStr.left,top:nowT2WaterStr.top}:{left:50,top:100};
if(nowT2WaterStr){
canvas.remove(nowT2WaterStr).renderAll();
nowT2WaterStr=null;
}
t2_water_deleteSvg();
t2_water_createSvg(position.left,position.top);
}