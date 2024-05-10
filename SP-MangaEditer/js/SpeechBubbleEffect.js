function updatebubbleObjectColors() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        var fillColor = document.getElementById('bubbleFillColor').value;
        var strokeColor = document.getElementById('bubbleStrokeColor').value;

        if (activeObject.type === 'group') {
            activeObject.forEachObject((obj) => {
                if (obj.type !== 'line') {
                    obj.set({ fill: fillColor, stroke: strokeColor });
                } else {
                    obj.set({ stroke: strokeColor });
                }
            });
        } else if (['rect', 'circle', 'triangle', 'polygon'].includes(activeObject.type)) {
            activeObject.set({ fill: fillColor, stroke: strokeColor });
        } else if (activeObject.type === 'line') {
            activeObject.set({ stroke: strokeColor }); // ラインにはfillがない
        }
        canvas.requestRenderAll();
    }
}
