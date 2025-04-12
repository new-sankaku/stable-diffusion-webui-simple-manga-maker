class StrokeProcessor{
constructor(){
this.points=[];
this.isDrawing=false;
this.lastPoint=null;
this.lastTimestamp=0;
this.velocity=0;
this.direction=0;
this.smoothingFactor=0.5;
this.historySize=5;
this.minDistance=1;
this.averagePoint={x:0,y:0,pressure:0};
this.intermediatePositions=[];
this.spacing=0.25;
}
startStroke(x,y,pressure=0.5,timestamp=Date.now()){
this.isDrawing=true;
this.points=[];
this.intermediatePositions=[];
this.velocity=0;
this.direction=0;
const point={x,y,pressure,timestamp};
this.points.push(point);
this.lastPoint=point;
this.lastTimestamp=timestamp;
this.averagePoint={...point};
return point;
}
processStroke(x,y,pressure=0.5,timestamp=Date.now()){
if(!this.isDrawing||!this.lastPoint)return 0;
const distance=MathUtils.distance(this.lastPoint.x,this.lastPoint.y,x,y);
if(distance<this.minDistance)return 0;
const timeDelta=timestamp-this.lastTimestamp;
this.velocity=timeDelta>0?distance/timeDelta:0;
this.direction=MathUtils.angle(this.lastPoint.x,this.lastPoint.y,x,y);
const newPoint={x,y,pressure,timestamp};
this.points.push(newPoint);
if(this.points.length>this.historySize){
this.points.shift();
}
const smoothedPoint=this._smoothPoint(newPoint);
this.lastPoint=newPoint;
this.lastTimestamp=timestamp;
this.intermediatePositions=this._generateIntermediatePoints(
this.averagePoint,
smoothedPoint,
this.spacing
);
return this.intermediatePositions.length;
}
getIntermediatePositions(){
return this.intermediatePositions;
}
updateStroke(x,y,pressure=0.5,timestamp=Date.now()){
if(!this.isDrawing||!this.lastPoint)return null;
const distance=MathUtils.distance(this.lastPoint.x,this.lastPoint.y,x,y);
if(distance<this.minDistance)return null;
const timeDelta=timestamp-this.lastTimestamp;
this.velocity=timeDelta>0?distance/timeDelta:0;
this.direction=MathUtils.angle(this.lastPoint.x,this.lastPoint.y,x,y);
const newPoint={x,y,pressure,timestamp};
this.points.push(newPoint);
if(this.points.length>this.historySize){
this.points.shift();
}
const smoothedPoint=this._smoothPoint(newPoint);
this.lastPoint=newPoint;
this.lastTimestamp=timestamp;
return smoothedPoint;
}
endStroke(x,y,pressure=0.5,timestamp=Date.now()){
if(!this.isDrawing)return null;
const finalPoint={x,y,pressure,timestamp};
this.isDrawing=false;
this.points=[];
this.intermediatePositions=[];
this.lastPoint=null;
return finalPoint;
}
_smoothPoint(point){
if(this.smoothingFactor<=0)return point;
let sumX=0;
let sumY=0;
let sumPressure=0;
this.points.forEach(p=>{
sumX+=p.x;
sumY+=p.y;
sumPressure+=p.pressure;
});
const count=this.points.length;
const avgX=sumX/count;
const avgY=sumY/count;
const avgPressure=sumPressure/count;
const smoothX=MathUtils.lerp(point.x,avgX,this.smoothingFactor);
const smoothY=MathUtils.lerp(point.y,avgY,this.smoothingFactor);
const smoothPressure=MathUtils.lerp(point.pressure,avgPressure,this.smoothingFactor);
this.averagePoint={
x:smoothX,
y:smoothY,
pressure:smoothPressure,
timestamp:point.timestamp
};
return this.averagePoint;
}
_generateIntermediatePoints(p1,p2,spacing=0.1){
const points=[];
const distance=MathUtils.distance(p1.x,p1.y,p2.x,p2.y);
const count=Math.max(1,Math.ceil(distance*spacing));
for(let i=0;i<=count;i++){
const t=i/count;
points.push({
x:MathUtils.lerp(p1.x,p2.x,t),
y:MathUtils.lerp(p1.y,p2.y,t),
pressure:MathUtils.lerp(p1.pressure,p2.pressure,t),
timestamp:p1.timestamp+(p2.timestamp-p1.timestamp)*t
});
}
return points;
}
getVelocity(){
return this.velocity;
}
getDirection(){
return this.direction;
}
setSmoothingFactor(factor){
this.smoothingFactor=MathUtils.clamp(factor,0,1);
}
}
const strokeProcessor=new StrokeProcessor();
