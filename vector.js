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
//行ベクトルを"二次元配列として"渡す
function SLEsolve(matrix) {
    let rows = matrix.length;
    let vecs = [];
    for (let i = 0; i < rows; i++) {
        vecs[i] = new Vector(matrix[i]);
    }
    
    //前進消去
    for (let i = 0; i < rows; i++) {
        let max = 0;
        let maxrow;
        for (let j = i; j < rows; j++) {
            if (max < Math.abs(vecs[j].elm[i])) {
                max = Math.abs(vecs[j].elm[i]);
                maxrow = j;
            }
        }
        let swapvec = vecs[i];
        vecs[i] = vecs[maxrow];
        vecs[maxrow] = swapvec;

        vecs[i] = vecs[i].mult(1 / vecs[i].elm[i]);
        for (let j = i + 1; j < rows; j++) {
            vecs[j] = vecs[j].add(vecs[i].mult(-vecs[j].elm[i]));
        }
    }

    //後退代入
    for (let i = rows - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            vecs[j].elm[rows] -= vecs[i].elm[rows] * vecs[j].elm[i];
        }
    }

    /*vecs.forEach((v) => {
        console.log(v.elm);
    })*/

    let ans = [];
    for (let i = 0; i < rows; i++) {
        ans[i] = vecs[i].elm[rows];
    }
    return ans;
}