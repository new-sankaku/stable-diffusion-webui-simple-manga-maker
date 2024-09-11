function highQualityBicubicInterpolation(img, x, y, a = -0.5) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const result = [0, 0, 0, 0];

    for (let i = -1; i <= 2; i++) {
        for (let j = -1; j <= 2; j++) {
            const pixel = getPixelSafe(img, x0 + i, y0 + j);
            const wx = highQualityBicubicWeight(x - (x0 + i), a);
            const wy = highQualityBicubicWeight(y - (y0 + j), a);
            const weight = wx * wy;
            for (let c = 0; c < 4; c++) {
                result[c] += pixel[c] * weight;
            }
        }
    }

    return result.map(v => Math.round(Math.max(0, Math.min(255, v))));
}

function highQualityBicubicWeight(x, a) {
    const abs_x = Math.abs(x);
    if (abs_x <= 1) {
        return ((a + 2) * abs_x - (a + 3)) * abs_x * abs_x + 1;
    } else if (abs_x < 2) {
        return ((a * abs_x - 5 * a) * abs_x + 8 * a) * abs_x - 4 * a;
    }
    return 0;
}

// 安全なピクセル取得関数（画像の境界外を扱います）
function getPixelSafe(img, x, y) {
    x = Math.max(0, Math.min(img.width - 1, x));
    y = Math.max(0, Math.min(img.height - 1, y));
    const idx = (y * img.width + x) * 4;
    return [img.data[idx], img.data[idx + 1], img.data[idx + 2], img.data[idx + 3]];
}

// 改良されたワーピング関数
function warpImage(img, mapx, mapy, params = {}) {
    const warped = new ImageData(img.width, img.height);
    const {
        interpolationQuality = 3,  // 0: 最近傍, 1: バイリニア, 2: 標準双三次, 3: High Quality Bicubic
        edgeHandling = 'clamp',    // 'clamp', 'wrap', 'mirror'
        samplingFactor = 1,        // サンプリング密度 (1 = 通常, 2 = 2x2サブピクセル, etc.)
        bicubicParameter = -0.5    // High Quality Bicubicのパラメータ
    } = params;

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let validSamples = 0;

            for (let sy = 0; sy < samplingFactor; sy++) {
                for (let sx = 0; sx < samplingFactor; sx++) {
                    const sampleX = x + sx / samplingFactor;
                    const sampleY = y + sy / samplingFactor;
                    const srcX = mapx[y][x] + (sx / samplingFactor) * (mapx[y][x] - x);
                    const srcY = mapy[y][x] + (sy / samplingFactor) * (mapy[y][x] - y);

                    let pixel;
                    switch (interpolationQuality) {
                        case 0:
                            pixel = getPixelSafe(img, Math.round(srcX), Math.round(srcY));
                            break;
                        case 1:
                            pixel = bilinearInterpolation(img, srcX, srcY);
                            break;
                        case 2:
                            pixel = bicubicInterpolation(img, srcX, srcY);
                            break;
                        case 3:
                            pixel = highQualityBicubicInterpolation(img, srcX, srcY, bicubicParameter);
                            break;
                        default:
                            pixel = highQualityBicubicInterpolation(img, srcX, srcY, bicubicParameter);
                    }

                    r += pixel[0];
                    g += pixel[1];
                    b += pixel[2];
                    a += pixel[3];
                    validSamples++;
                }
            }

            const dstIdx = (y * img.width + x) * 4;
            warped.data[dstIdx] = Math.round(r / validSamples);
            warped.data[dstIdx + 1] = Math.round(g / validSamples);
            warped.data[dstIdx + 2] = Math.round(b / validSamples);
            warped.data[dstIdx + 3] = Math.round(a / validSamples);
        }
    }

    return warped;
}


function bicubicInterpolation(img, x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const result = [0, 0, 0, 0];

    for (let i = -1; i <= 2; i++) {
        for (let j = -1; j <= 2; j++) {
            const pixel = getPixelSafe(img, x0 + i, y0 + j);
            const wx = bicubicWeight(x - (x0 + i));
            const wy = bicubicWeight(y - (y0 + j));
            const weight = wx * wy;
            for (let c = 0; c < 4; c++) {
                result[c] += pixel[c] * weight;
            }
        }
    }

    return result.map(v => Math.round(Math.max(0, Math.min(255, v))));
}

function bicubicWeight(x) {
    const abs_x = Math.abs(x);
    if (abs_x <= 1) {
        return (1.5 * abs_x - 2.5) * abs_x * abs_x + 1;
    } else if (abs_x < 2) {
        return ((-0.5 * abs_x + 2.5) * abs_x - 4) * abs_x + 2;
    }
    return 0;
}

function bilinearInterpolation(img, x, y) {
    const x1 = Math.floor(x);
    const x2 = Math.ceil(x);
    const y1 = Math.floor(y);
    const y2 = Math.ceil(y);

    const q11 = getPixelSafe(img, x1, y1);
    const q12 = getPixelSafe(img, x1, y2);
    const q21 = getPixelSafe(img, x2, y1);
    const q22 = getPixelSafe(img, x2, y2);

    const fx = x - x1;
    const fy = y - y1;

    const result = [];
    for (let i = 0; i < 4; i++) {
        const interpolated = 
            (1 - fx) * (1 - fy) * q11[i] +
            fx * (1 - fy) * q21[i] +
            (1 - fx) * fy * q12[i] +
            fx * fy * q22[i];
        result.push(Math.round(interpolated));
    }

    return result;
}