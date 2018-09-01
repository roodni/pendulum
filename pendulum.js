class PendulumData {
    constructor(dataString) {
        //確認するオブジェクト, 確認するキー,
        //省略時の関数(省略可能ならtrue, 省略不可ならfalseを返す),
        //各要素についての確認関数, 満たすべき条件文字列(return "{プロパティ名}の各要素は{ここに当てはまる文字列}である必要があります")
        function arrayCheck(obj, key, shouryakuFunc, kakuninFunc, joukenName) {
            if (key in obj) {
                let ary = obj[key];
                if (Array.isArray(ary) === false) {
                    return key + "は配列である必要があります";
                }
                if (ary.length === 0) {
                    return key + "が空です";
                }
                for (let i = 0; i < ary.length; i++) {
                    if (kakuninFunc(ary[i]) === false) {
                        return key + "の要素は" + joukenName + "である必要があります";
                    }
                }
            } else {
                if (shouryakuFunc(obj, key) === false) {
                    return key + "は省略できません";
                }
            }
            return "";
        }

        //エラーチェック
        this.error = "";
        let data;
        try {
            data = JSON.parse(dataString);
        } catch(e) {
            this.error = "JSONの文法エラーです";
            return;
        }

        if (data instanceof Object === false) {
            this.error = "入力されたデータはオブジェクトではありません";
            return;
        }

        if ("number" in data) {
            let num = data.number;
            if ((isFinite(num) && Math.round(num) === num && num > 0) === false) {
                this.error = "numberは正の整数である必要があります";
                return;
            }
        } else {
            this.error = "numberは省略できません";
            return;
        }

        this.error = arrayCheck(data, "distOG", () => {
            return false;
        }, (elm) => {
            return isFinite(elm) && elm > 0;
        }, "正の数");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "distOO", (obj, key) => {
            obj[key] = obj.distOG.concat();
            return true;
        }, (elm) => {
            return isFinite(elm) && elm > 0;
        }, "正の数");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "angleGOO", (obj, key) => {
            obj[key] = [0];
            return true;
        }, (elm) => {
            return isFinite(elm);
        }, "数値");
        if (this.error !== "") {
            return;
        }
        
        this.error = arrayCheck(data, "mass", (obj, key) => {
            obj[key] = [1];
            return true;
        }, (elm) => {
            return isFinite(elm) && elm > 0;
        }, "正の数");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "inertia", (obj, key) => {
            obj[key] = [0];
            return true;
        }, (elm) => {
            return isFinite(elm) && elm >= 0;
        }, "負でない数");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "decay", (obj, key) => {
            obj[key] = [0];
            return true;
        }, (elm) => {
            return isFinite(elm) && elm >= 0;
        }, "負でない数");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "angle", (obj, key) => {
            obj[key] = [0];
            return true;
        }, (elm) => {
            return isFinite(elm);
        }, "数値");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "angularVelocity", (obj, key) => {
            obj[key] = [0];
            return true;
        }, (elm) => {
            return isFinite(elm);
        }, "数値");
        if (this.error !== "") {
            return;
        }

        this.error = arrayCheck(data, "shape", (obj, key) => {
            obj[key] = [""];
            return true;
        }, (elm) => {
            return true;
        }, "");
        if (this.error !== "") {
            return;
        }

        //読み込む
        //不足分を塗りつぶす処理も行う
        this.number = data.number;
        this.distOG = [];
        this.distOO = [];
        this.angleGOO = [];
        this.mass = [];
        this.inertia = [];
        this.decay = [];
        this.angle = [];
        this.angularVelocity = [];
        for (let i = 0; i < data.number; i++) {
            this.distOG[i] = data.distOG[Math.min(i, data.distOG.length - 1)];
            this.distOO[i] = data.distOO[Math.min(i, data.distOO.length - 1)];
            this.angleGOO[i] = data.angleGOO[Math.min(i, data.angleGOO.length - 1)] * Math.PI / 180;
            this.mass[i] = data.mass[Math.min(i, data.mass.length - 1)];
            this.inertia[i] = data.inertia[Math.min(i, data.inertia.length - 1)];
            this.decay[i] = data.decay[Math.min(i, data.decay.length - 1)];
            this.angle[i] = data.angle[Math.min(i, data.angle.length - 1)] * Math.PI / 180;
            this.angularVelocity[i] = data.angularVelocity[Math.min(i, data.angularVelocity.length - 1)] * Math.PI / 180;
            let shape = data.shape[Math.min(i, data.shape.length - 1)];
            if (shape === "stick") {
                this.distOO[i] = this.distOG[i] * 2;
                this.angleGOO[i] = 0;
                this.inertia[i] = this.mass[i] * Math.pow(this.distOG[i], 2) / 3;
            }
        }

        return "";
    }
}

class Pendulum {
    init() {
        //描画方法
        //0: 一般カラフル描画
        //1: 画像を貼る
        //2: 棒(未完成)
        this.drawMode = "normal";
        this.px_m = 200;
        this.ox = screenW / 2;
        this.oy = screenH / 8;

        this.gx = 0;
        this.gy = 9.8;

        this.loop = 100;

        let data = new PendulumData('{"number": 2, "distOG": [0.5], "angle": [90]}');
        this.readData(data);
    }
    readData(pendulumData) {
        this.num = pendulumData.number;
        this.lenG = pendulumData.distOG.slice(0, this.num);
        this.len = pendulumData.distOO.slice(0, this.num - 1);
        this.rG = pendulumData.angleGOO.slice(0, this.num - 1);
        this.mass = pendulumData.mass.slice(0, this.num);
        this.I = pendulumData.inertia.slice(0, this.num);
        this.decay = pendulumData.decay.slice(0, this.num);
        this.vec = new Vector(pendulumData.angle.slice(0, this.num).concat(pendulumData.angularVelocity.slice(0, this.num)));
        this.passedTime = 0;

        //質量の累積和をとる
        this._massSum = [0];
        for (let i = 0; i < this.num; i++) {
            this._massSum[i + 1] = this._massSum[i] + this.mass[i];
        }

        this.firstE = this.getE();
    }
    getE() {
        //運動エネルギー
        let T = 0;
        let sum2 = 0;
        let getSum2elm = (i, j) => {
            return this.len[i] * this.len[j] * this.vec.elm[this.num + i] * this.vec.elm[this.num + j]
                * Math.cos(this.vec.elm[i] - this.vec.elm[j] + this.rG[i] - this.rG[j]);
        }
        for (let k = 0; k < this.num; k++) {
            let sum1 = 0;
            for (let i = 0; i < k; i++) {
                sum1 += this.len[i] * this.vec.elm[this.num + i] * Math.cos(this.vec.elm[i] + this.rG[i] - this.vec.elm[k]);
            }

            for (let i = 0; i < k - 1; i++) {
                sum2 += getSum2elm(i, k - 1) + getSum2elm(k - 1, i);
            }
            if (k > 0) {
                sum2 += getSum2elm(k - 1, k - 1);
            }

            T += (this.mass[k] * Math.pow(this.lenG[k], 2) + this.I[k]) * Math.pow(this.vec.elm[this.num + k], 2) / 2
                + this.mass[k] * (this.lenG[k] * this.vec.elm[this.num + k] * sum1 + sum2 / 2);
        }

        //ポテンシャル
        let U = 0;
        let sum = 0;
        for (let k = 0; k < this.num; k++) {
            if (k > 0) {
                sum += this.len[k - 1] * (this.gx * Math.sin(this.vec.elm[k - 1] + this.rG[k - 1]) + this.gy * Math.cos(this.vec.elm[k - 1] + this.rG[k - 1]));
            }
            U += -this.mass[k] * (sum + this.lenG[k] * (this.gx * Math.sin(this.vec.elm[k]) + this.gy * Math.cos(this.vec.elm[k])));
        }
        return T + U;
    }
    massSum(begin, end) {
        return this._massSum[end + 1] - this._massSum[begin];
    }
    bibun(vec) {
        let matrix = [];
        for (let h = 0; h < this.num; h++) {
            matrix[h] = [];
            //係数
            for (let p = 0; p < h; p++) {
                matrix[h][p] = this.mass[h] * this.lenG[h] * this.len[p] * Math.cos(vec.elm[p] + this.rG[p] - vec.elm[h])
                    + ((h === this.num - 1) ? 0 : this.massSum(h + 1, this.num - 1) * this.len[h] * this.len[p] * Math.cos(vec.elm[p] - vec.elm[h] + this.rG[p] - this.rG[h]));
            }
            matrix[h][h] = this.mass[h] * Math.pow(this.lenG[h], 2) + this.I[h]
                + ((h === this.num - 1) ? 0 : this.massSum(h + 1, this.num - 1) * Math.pow(this.len[h], 2));
            for (let p = h + 1; p < this.num; p++) {
                matrix[h][p] = this.mass[p] * this.len[h] * this.lenG[p] * Math.cos(vec.elm[h] + this.rG[h] - vec.elm[p])
                    + ((p === this.num - 1) ? 0 : this.massSum(p + 1, this.num - 1) * this.len[h] * this.len[p] * Math.cos(vec.elm[p] - vec.elm[h] + this.rG[p] - this.rG[h]));
            }

            //定数項
            let sum1 = 0;
            for (let i = 0; i < h; i++) {
                sum1 += this.len[i] * Math.pow(vec.elm[this.num + i], 2) * Math.sin(vec.elm[i] + this.rG[i] - vec.elm[h]);
            }
            let sum2 = [0];
            if (h < this.num - 1) {
                for (let i = 0; i < this.num; i++) {
                    sum2[i + 1] = sum2[i] + this.len[i] * Math.pow(vec.elm[this.num + i], 2) * Math.sin(vec.elm[i] - vec.elm[h] + this.rG[i] - this.rG[h]);
                }
            }
            let sum3 = 0;
            for (let k = h + 1; k < this.num; k++) {
                sum3 += this.mass[k] * this.len[h] * (-this.lenG[k] * Math.pow(vec.elm[this.num + k], 2) * Math.sin(vec.elm[h] + this.rG[h] - vec.elm[k])
                    + sum2[k] - sum2[0]);
            }
            matrix[h][this.num] = this.mass[h] * this.lenG[h] * sum1
                + sum3
                + this.mass[h] * this.lenG[h] * (this.gx * Math.cos(vec.elm[h]) - this.gy * Math.sin(vec.elm[h]))
                + ((h === this.num - 1) ? 0 : this.massSum(h + 1, this.num - 1) * this.len[h] * (this.gx * Math.cos(vec.elm[h] + this.rG[h]) - this.gy * Math.sin(vec.elm[h] + this.rG[h])))
                - this.decay[h] * vec.elm[this.num + h];

        }

        return new Vector(vec.elm.slice(this.num, this.num * 2).concat(SLEsolve(matrix)));
    }
    update() {
        let dt = 1 / (60 * this.loop);
        for (let i = 0; i < this.loop; i++) {
            //オイラー法
            //this.vec = this.vec.add(this.bibun(this.vec).mult(dt));

            //修正オイラー法
            /*let tmp1 = this.bibun(this.vec).mult(dt);
            let tmp2 = this.bibun(this.vec.add(tmp1)).mult(dt);
            this.vec = this.vec.add(tmp1.add(tmp2).mult(1 / 2));*/

            //ルンゲクッタ法
            let tmp1 = this.bibun(this.vec);
            let tmp2 = this.bibun(this.vec.add(tmp1.mult(dt / 2)));
            let tmp3 = this.bibun(this.vec.add(tmp2.mult(dt / 2)));
            let tmp4 = this.bibun(this.vec.add(tmp3.mult(dt)));
            this.vec = this.vec.add((tmp1.add(tmp2.mult(2)).add(tmp3.mult(2)).add(tmp4)).mult(dt / 6));
        }
        this.passedTime += 1 / 60;
    }
    
    draw(ctx, images) {
        let x = this.ox;
        let y = this.oy;
        let l_lg_sum = 0; //len[i] / lenG[i]の合計
        for (let i = 0; i < this.num; i++) {
            let dx, dy, dgx, dgy;
            dgx = this.lenG[i] * Math.sin(this.vec.elm[i]) * this.px_m;
            dgy = this.lenG[i] * Math.cos(this.vec.elm[i]) * this.px_m;
            if (i < this.num - 1) {
                dx = this.len[i] * Math.sin(this.vec.elm[i] + this.rG[i]) * this.px_m;
                dy = this.len[i] * Math.cos(this.vec.elm[i] + this.rG[i]) * this.px_m;
                l_lg_sum += this.len[i] / this.lenG[i];
            }

            if (this.drawMode === "normal") {
                //一般表示モード
                let edgeW = 8;

                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.lineWidth = edgeW;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + dgx, y + dgy);
                ctx.stroke();

                if (i < this.num - 1) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + dx, y + dy);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x + dx, y + dy);
                    ctx.lineTo(x + dgx, y + dgy);
                    ctx.stroke();
                }

                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.beginPath();
                ctx.arc(x, y, edgeW * 0.7, 0, Math.PI * 2);
                ctx.fill();

                let gColor = "hsl("+ (360 / this.num * i) + ", 100%, 50%)"

                ctx.fillStyle = gColor;
                ctx.globalAlpha = 0.5;
                let r = Math.max(edgeW * 3, Math.sqrt(this.I[i] * Math.pow(this.px_m, 2) * 2 / this.mass[i]));
                ctx.beginPath();
                ctx.arc(x + dgx, y + dgy, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.beginPath();
                ctx.arc(x + dgx, y + dgy, edgeW, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.drawMode === "images") {
                //写真表示モード
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.fillStyle = "rgb(0, 0, 0)";

                let len;
                let dgx2, dgy2;

                if (i < this.num - 1) {
                    len = this.len[i];
                    dgx2 = dgx * len / this.lenG[i];
                    dgy2 = dgy * len / this.lenG[i];
                    
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + dx, y + dy);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x + dgx2, y + dgy2);
                    ctx.lineTo(x + dx, y + dy);
                    ctx.stroke();
                } else {
                    len = this.lenG[i] * l_lg_sum / (this.num - 1);
                    dx = dgx * 2;
                    dy = dgy * 2;
                }

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(-this.vec.elm[i]);
                let img = images[i % images.length];
                let scale = len * this.px_m / img.height;
                ctx.scale(scale, scale);
                ctx.drawImage(img, -img.width / 2, 0);
                ctx.restore();

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();

                if (i < this.num - 1) {
                    ctx.beginPath();
                    ctx.arc(x + dgx2, y + dgy2, 4, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (this.drawMode === "stick") {
                //棒表示モード
                let edgeW = 10;

                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.lineWidth = edgeW;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + dgx * 2, y + dgy * 2);
                ctx.stroke();
            }

            if (i < this.num - 1) {
                x += dx;
                y += dy;
            }
        }

        //経過時間、力学的エネルギー
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "30px serif";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.fillText(this.passedTime.toFixed(1) + ' s', 0, 0);
        ctx.textAlign = "right";
        ctx.fillText((this.getE() - this.firstE).toFixed(8) + ' J', screenW, 0);

        //縮尺
        //ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.font = "20px serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("1m", 0, screenH);
        ctx.fillRect(0, screenH - 20 - this.px_m, 5, this.px_m);
    }
}