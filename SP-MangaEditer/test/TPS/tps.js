class TPS {
    static fit(c, lambd = 0, reduced = false) {
        const n = c.length;
        const U = TPS.u(TPS.d(c, c));
        const K = U.map((row, i) => row.map((val, j) => val + (i === j ? lambd : 0)));
        const P = c.map(point => [1, point[0], point[1]]);
        const v = c.map(point => point[2]);
        const A = new Array(n + 3).fill().map(() => new Array(n + 3).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) A[i][j] = K[i][j];
            for (let j = 0; j < 3; j++) {
                A[i][n + j] = P[i][j];
                A[n + j][i] = P[i][j];
            }
        }
        const theta = TPS.solveLinearSystem(A, [...v, 0, 0, 0]);
        return reduced ? theta.slice(1) : theta;
    }

    static d(a, b) {
        return a.map(pa => b.map(pb => 
            Math.sqrt((pa[0] - pb[0])**2 + (pa[1] - pb[1])**2)
        ));
    }

    static u(r) {
        return r.map(row => row.map(val => val**2 * Math.log(val + 1e-6)));
    }

    static z(x, c, theta) {
        const U = TPS.u(TPS.d([x], c))[0];
        const w = theta.slice(0, -3);
        const a = theta.slice(-3);
        const reduced = theta.length === c.length + 2;
        let b = 0;
        if (reduced) {
            const wSum = w.reduce((sum, wi) => sum + wi, 0);
            b = U.reduce((sum, ui, i) => sum + (i === 0 ? -wSum * ui : w[i-1] * ui), 0);
        } else {
            b = U.reduce((sum, ui, i) => sum + w[i] * ui, 0);
        }
        return a[0] + a[1]*x[0] + a[2]*x[1] + b;
    }

    static solveLinearSystem(A, b) {
        const n = A.length;
        for (let i = 0; i < n; i++) {
            let maxEl = Math.abs(A[i][i]);
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > maxEl) {
                    maxEl = Math.abs(A[k][i]);
                    maxRow = k;
                }
            }
            for (let k = i; k < n; k++) {
                const tmp = A[maxRow][k];
                A[maxRow][k] = A[i][k];
                A[i][k] = tmp;
            }
            const tmp = b[maxRow];
            b[maxRow] = b[i];
            b[i] = tmp;
            for (let k = i + 1; k < n; k++) {
                const c = -A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    if (i === j) {
                        A[k][j] = 0;
                    } else {
                        A[k][j] += c * A[i][j];
                    }
                }
                b[k] += c * b[i];
            }
        }
        const x = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i] / A[i][i];
            for (let k = i - 1; k >= 0; k--) {
                b[k] -= A[k][i] * x[i];
            }
        }
        return x;
    }
}

function uniformGrid(shape) {
    const [H, W] = shape;
    const grid = new Array(H).fill().map(() => new Array(W).fill().map(() => [0, 0]));
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            grid[i][j][0] = j / (W - 1);
            grid[i][j][1] = i / (H - 1);
        }
    }
    return grid;
}

function tpsGridToRemap(grid, sshape) {
    const [H, W] = grid.length ? [grid.length, grid[0].length] : sshape;
    const mapx = new Array(H).fill().map(() => new Array(W));
    const mapy = new Array(H).fill().map(() => new Array(W));
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            mapx[i][j] = grid[i][j][0] * sshape[1];
            mapy[i][j] = grid[i][j][1] * sshape[0];
        }
    }
    return [mapx, mapy];
}

function tpsThetaFromPoints(c_src, c_dst, reduced = false) {
    const delta = c_src.map((src, i) => [src[0] - c_dst[i][0], src[1] - c_dst[i][1]]);
    const cx = c_dst.map((dst, i) => [...dst, delta[i][0]]);
    const cy = c_dst.map((dst, i) => [...dst, delta[i][1]]);
    const theta_dx = TPS.fit(cx, 0, reduced);
    const theta_dy = TPS.fit(cy, 0, reduced);
    return theta_dx.map((dx, i) => [dx, theta_dy[i]]);
}

function tpsGrid(theta, c_dst, dshape) {
    const ugrid = uniformGrid(dshape);
    const reduced = c_dst.length + 2 === theta.length;
    const flatGrid = ugrid.flat();
    const dx = flatGrid.map(point => TPS.z(point, c_dst, theta.map(t => t[0])));
    const dy = flatGrid.map(point => TPS.z(point, c_dst, theta.map(t => t[1])));
    const dgrid = dx.map((x, i) => [x, dy[i]]);
    const grid = flatGrid.map((point, i) => [
        point[0] + dgrid[i][0],
        point[1] + dgrid[i][1]
    ]);
    return grid.reduce((acc, curr, i) => {
        const row = Math.floor(i / dshape[1]);
        if (!acc[row]) acc[row] = [];
        acc[row].push(curr);
        return acc;
    }, []);
}
