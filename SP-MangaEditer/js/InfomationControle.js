var fpsCheckbox = document.getElementById('InfomationFPS');
        var coordCheckbox = document.getElementById('InfomationCoordinate');

        var frameCount = 0;
        var lastTime = Date.now();
        var fps = 0;
        var animFrameId;

        function updateFPS() {
            if (fpsCheckbox.checked) {
                frameCount++;
                var now = Date.now();
                var elapsedTime = now - lastTime;

                if (elapsedTime >= 1000) {
                    fps = frameCount / (elapsedTime / 1000);
                    fpsCheckbox.nextSibling.nodeValue = ' FPS : ' + fps.toFixed(2);
                    frameCount = 0;
                    lastTime = now;
                }
                animFrameId = fabric.util.requestAnimFrame(updateFPS);
            } else {
                cancelAnimationFrame(animFrameId);
                fpsCheckbox.nextSibling.nodeValue = ' FPS : 0';
            }
        }

        function updateCoordinates(options) {
            if (coordCheckbox.checked) {
                var pointer = canvas.getPointer(options.e);
                coordCheckbox.nextSibling.nodeValue = ' X:' + pointer.x.toFixed(1) + ' Y:' + pointer.y.toFixed(1);
            } else {
                coordCheckbox.nextSibling.nodeValue = ' X:0.0 Y:0.0';
            }
        }

        fpsCheckbox.addEventListener('change', updateFPS);
        coordCheckbox.addEventListener('change', updateCoordinates);

        canvas.on('mouse:move', function (options) {
            updateCoordinates(options);
        });

        // Start with checkboxes unchecked
        fpsCheckbox.checked = false;
        coordCheckbox.checked = false;
