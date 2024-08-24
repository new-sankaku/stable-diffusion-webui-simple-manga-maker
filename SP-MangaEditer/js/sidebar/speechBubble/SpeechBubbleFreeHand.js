const geomFactory = new jsts.geom.GeometryFactory(
    new jsts.geom.PrecisionModel(1e3)
);

const sbElements = {
    pointMode: $("sb-pointMode"),
    freehandMode: $("sb-freehandMode"),
    smoothness: $("sb-smoothness"),
    fillColor: $("sb-fillColor"),
    strokeColor: $("sb-strokeColor"),
    strokeWidth: $("sb-strokeWidth"),
    fillOpacity: $("sb-fillOpacity"),
    pointDistance: $("sb-pointDistance")
};

let sbState = {
    mode: "no-mode",
    isDrawing: false,
    currentPoints: [],
    tempPoint: null,
    currentShape: null,
    tempLine: null
};

function setSbActiveButton(button) {
    [sbElements.pointMode, sbElements.freehandMode].forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}

function removeSbActiveButton() {
    [sbElements.pointMode, sbElements.freehandMode].forEach(btn => btn.classList.remove("selected"));
}

function getCurrentStyle() {
    const style = {
        fill: sbElements.fillColor.value,
        stroke: sbElements.strokeColor.value,
        strokeWidth: parseInt(sbElements.strokeWidth.value),
        opacity: parseInt(sbElements.fillOpacity.value) / 100
    };
    return style;
}

function createPolygon(coords) {
    if (coords.length < 3) {
        return null;
    }
    const jstsCoords = coords.map(p => new jsts.geom.Coordinate(p.x, p.y));
    jstsCoords.push(jstsCoords[0]);
    try {
        const polygon = geomFactory.createPolygon(geomFactory.createLinearRing(jstsCoords));
        return polygon;
    } catch (error) {
        return null;
    }
}

function mergeShapes(shape1, shape2) {
    try {
        const mergedShape = shape1.union(shape2);
        return mergedShape;
    } catch (error) {
        return shape1;
    }
}

function mergeWithExisting(newShape) {
    console.log("---マージ処理開始---");
    console.log("新しい図形のポイント:", newShape.getCoordinates().map(c => `(${c.x}, ${c.y})`).join(', '));

    let mergeFound = false;
    const mergedShape = canvas.getObjects('path').reduce((resultShape, existingPath) => {
        if (existingPath.jstsGeom && (resultShape.intersects(existingPath.jstsGeom) || resultShape.touches(existingPath.jstsGeom))) {
            mergeFound = true;
            console.log("マージ対象の図形が見つかりました");
            console.log("既存パスのポイント:", existingPath.path.map(p => `(${p[1]}, ${p[2]})`).join(', '));
            console.log("既存JSTS geometryのポイント:", existingPath.jstsGeom.getCoordinates().map(c => `(${c.x}, ${c.y})`).join(', '));
            
            const merged = mergeShapes(resultShape, existingPath.jstsGeom);
            if (merged && merged.isValid()) {
                console.log("マージ後の図形のポイント:", merged.getCoordinates().map(c => `(${c.x}, ${c.y})`).join(', '));
                console.log("削除された既存パス - 左:", existingPath.left, "上:", existingPath.top, "スケールX:", existingPath.scaleX, "スケールY:", existingPath.scaleY, "角度:", existingPath.angle);
                canvas.remove(existingPath);
                return merged;
            } else {
                console.log("マージに失敗しました。既存の図形を保持します。");
            }
        }
        return resultShape;
    }, newShape);
    
    if (!mergeFound) {
        console.log("マージ対象の図形が見つかりませんでした");
        console.log("理由: 新しい図形が既存の図形と交差または接触していません");
    }
    
    console.log("---マージ処理終了---");
    return mergedShape;
}

function isCloseToPoint(x, y, point, threshold = 15) {
    return Math.abs(x - point.x) <= threshold && Math.abs(y - point.y) <= threshold;
}

function smoothPoints(points) {
    if (points.length < 3) return points;
    const smoothedPoints = points.map((point, i, arr) => {
        if (i === 0 || i === arr.length - 1) return point;
        const prev = arr[i - 1], next = arr[i + 1];
        return {
            x: point.x * 0.5 + (prev.x + next.x) * 0.25,
            y: point.y * 0.5 + (prev.y + next.y) * 0.25
        };
    });
    return smoothedPoints;
}

function removeClosePoints(points) {
    const distance = parseInt(sbElements.pointDistance.value);
    const filteredPoints = points.filter((point, index, arr) => 
        index === 0 || Math.hypot(point.x - arr[index-1].x, point.y - arr[index-1].y) > distance
    );
    return filteredPoints;
}

function drawTemporaryShape() {
    if (sbState.currentShape) {
        canvas.remove(sbState.currentShape);
    }
    if (sbState.tempLine) {
        canvas.remove(sbState.tempLine);
    }

    const style = getCurrentStyle();
    if (sbState.mode === "point" && sbState.currentPoints.length > 0) {
        sbState.currentShape = new fabric.Polyline(sbState.currentPoints, {
            ...style, fill: 'rgba(0,0,255,0.2)', selectable: false, evented: false
        });
        canvas.add(sbState.currentShape);

        if (sbState.tempPoint) {
            const lastPoint = sbState.currentPoints[sbState.currentPoints.length - 1];
            sbState.tempLine = new fabric.Line([lastPoint.x, lastPoint.y, sbState.tempPoint.x, sbState.tempPoint.y], {
                ...style, fill: undefined, selectable: false, evented: false
            });
            canvas.add(sbState.tempLine);
        }
    } else if (sbState.mode === "freehand" && sbState.currentPoints.length > 0 && sbState.isDrawing) {
        sbState.currentShape = new fabric.Path(sbState.currentPoints.map((p, i) => 
            `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '), {
            ...style, fill: 'rgba(0,0,255,0.2)', selectable: false, evented: false
        });
        canvas.add(sbState.currentShape);
    }

    canvas.renderAll();
}

function finalizeShape() {
    if (sbState.currentPoints.length < 3) {
        return;
    }

    let points = [...sbState.currentPoints];
    if (sbState.mode === "freehand" && sbElements.smoothness.checked) {
        points = removeClosePoints(points);
        points = smoothPoints(points);
    }
    points.push(points[0]);

    const polygon = createPolygon(points);
    if (polygon && polygon.isValid()) {
        const mergedShape = mergeWithExisting(polygon);
        const path = new fabric.Path(mergedShape.getCoordinates().map((c, i) => 
            `${i === 0 ? 'M' : 'L'}${c.x} ${c.y}`).join(' ') + 'Z', {
            ...getCurrentStyle(), selectable: false, evented: false
        });
        path.jstsGeom = mergedShape;
        path.isSpeechBubble = true;
        canvas.add(path);
        console.log("新しいパスを追加しました - 左:", path.left, "上:", path.top, "スケールX:", path.scaleX, "スケールY:", path.scaleY, "角度:", path.angle);

        highlightExistingShapes();
    }

    sbState.currentPoints = [];
    sbState.tempPoint = null;
    if (sbState.currentShape) {
        canvas.remove(sbState.currentShape);
    }
    if (sbState.tempLine) {
        canvas.remove(sbState.tempLine);
    }
    sbState.currentShape = null;
    sbState.tempLine = null;

    canvas.renderAll();
}

function updateObjectSelectability(isSelectable) {
    canvas.getObjects().forEach(obj => {
        if (obj.isSpeechBubble) {
            obj.selectable = isSelectable;
            obj.evented = isSelectable;
        }
    });
    canvas.requestRenderAll();
}

function setMode(mode) {
    sbState.mode = mode;
    if (mode === "no-mode") {
        removeSbActiveButton();
        updateObjectSelectability(true);
    } else {
        setSbActiveButton(sbElements[mode + 'Mode']);
        updateObjectSelectability(false);
    }
    sbState.currentPoints = [];
    sbState.tempPoint = null;
    drawTemporaryShape();
}

function highlightExistingShapes() {
    canvas.getObjects().forEach(obj => {
        if (obj.isHighlight) {
            canvas.remove(obj);
        }
    });

    canvas.getObjects('path').forEach(obj => {
        if (obj.isSpeechBubble) {
            const highlight = new fabric.Path(obj.path.join(' '), {
                stroke: 'rgba(255, 0, 0, 0.5)',
                strokeWidth: 2,
                fill: 'transparent',
                selectable: false,
                evented: false,
                isHighlight: true
            });
            canvas.add(highlight);
            console.log("既存の図形をハイライト - 左:", obj.left, "上:", obj.top, "スケールX:", obj.scaleX, "スケールY:", obj.scaleY, "角度:", obj.angle);
        }
    });

    canvas.renderAll();

    setTimeout(() => {
        canvas.getObjects().forEach(obj => {
            if (obj.isHighlight) {
                canvas.remove(obj);
            }
        });
        canvas.renderAll();
    }, 5000);
}

canvas.on("mouse:down", ({pointer}) => {
    sbState.isDrawing = true;
    if (sbState.mode === "point") {
        if (sbState.currentPoints.length === 0 || !isCloseToPoint(pointer.x, pointer.y, sbState.currentPoints[sbState.currentPoints.length - 1])) {
            sbState.currentPoints.push(pointer);
            drawTemporaryShape();
        }
    } else if (sbState.mode === "freehand") {
        sbState.currentPoints = [pointer];
        drawTemporaryShape();
    }
});

canvas.on("mouse:move", ({pointer}) => {
    if (sbState.mode === "point") {
        sbState.tempPoint = pointer;
        drawTemporaryShape();
    } else if (sbState.mode === "freehand" && sbState.isDrawing) {
        sbState.currentPoints.push(pointer);
        drawTemporaryShape();
    }
});

canvas.on("mouse:up", ({pointer}) => {
    sbState.isDrawing = false;
    if (sbState.mode === "point" && sbState.currentPoints.length >= 3 && isCloseToPoint(pointer.x, pointer.y, sbState.currentPoints[0])) {
        finalizeShape();
        setMode(sbState.mode === "point" ? "no-mode" : "point");
        setMode(sbState.mode === "point" ? "no-mode" : "point");
    } else if (sbState.mode === "freehand" && sbState.currentPoints.length >= 3) {
        finalizeShape();
        setMode(sbState.mode === "freehand" ? "no-mode" : "freehand");
        setMode(sbState.mode === "freehand" ? "no-mode" : "freehand");
    }
});

sbElements.pointMode.addEventListener("click", () => {
    setMode(sbState.mode === "point" ? "no-mode" : "point");
});

sbElements.freehandMode.addEventListener("click", () => {
    setMode(sbState.mode === "freehand" ? "no-mode" : "freehand");
});