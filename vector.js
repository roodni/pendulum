class Vector {
    constructor(array) {
        this.elm = array.concat();
    }
    add(vec) {
        let ret = [];
        for (let i = 0; i < vec.elm.length; i++) {
            ret[i] = this.elm[i] + vec.elm[i];
        }
        return new Vector(ret);
    }
    mult(x) {
        let ret = [];
        for (let i = 0; i < this.elm.length; i++) {
            ret[i] = this.elm[i] * x;
        }
        return new Vector(ret);
    }
}

//1次連立方程式を解く
//拡大係数行列を2次元配列として渡す
function SLEsolve(matrix) {
    let rows = matrix.length;
    let vecs = [];
    for (let i = 0; i < rows; i++) {
        vecs[i] = matrix[i].concat();
    }
    
    //前進消去
    for (let i = 0; i < rows; i++) {
        let max = 0;
        let maxrow;
        for (let j = i; j < rows; j++) {
            if (max < Math.abs(vecs[j][i])) {
                max = Math.abs(vecs[j][i]);
                maxrow = j;
            }
        }
        let swapvec = vecs[i];
        vecs[i] = vecs[maxrow];
        vecs[maxrow] = swapvec;

        for (let j = i + 1; j <= rows; j++) {
            vecs[i][j] /= vecs[i][i];
            for (let k = i + 1; k < rows; k++) {
                vecs[k][j] -= vecs[i][j] * vecs[k][i];
            }
        }
    }

    //後退代入
    let ans = [];
    for (let i = rows - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            vecs[j][rows] -= vecs[i][rows] * vecs[j][i];
        }
        ans[i] = vecs[i][rows];
    }

    /*vecs.forEach((v) => {
        console.log(v);
    });*/

    return ans;
}