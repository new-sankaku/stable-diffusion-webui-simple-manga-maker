const MathUtils={
clamp:function(value,min,max){
return Math.max(min,Math.min(max,value));
},
map:function(value,inMin,inMax,outMin,outMax){
return(value-inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
},
mapRange:function(value,inMin,inMax,outMin,outMax,power=1){
if(power===1){
return this.map(value,inMin,inMax,outMin,outMax);
}
const normalizedValue=(value-inMin)/(inMax-inMin);
const poweredValue=Math.pow(normalizedValue,power);
return outMin+(outMax-outMin)*poweredValue;
},
distance:function(x1,y1,x2,y2){
return Math.sqrt((x2-x1)**2+(y2-y1)**2);
},
angle:function(x1,y1,x2,y2){
return Math.atan2(y2-y1,x2-x1);
},
radiansToDegrees:function(radians){
return radians*180/Math.PI;
},
degreesToRadians:function(degrees){
return degrees*Math.PI/180;
},
random:function(min,max){
return Math.random()*(max-min)+min;
},
lerp:function(a,b,t){
return a+(b-a)*t;
},
lerpPoint:function(p1,p2,t){
return{
x:this.lerp(p1.x,p2.x,t),
y:this.lerp(p1.y,p2.y,t)
};
},
velocityPressureEffect:function(velocity,sensitivity){
const maxVelocity=10;
const normalizedVelocity=Math.min(velocity,maxVelocity)/maxVelocity;
return 1-(normalizedVelocity*sensitivity);
}
};
