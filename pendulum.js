class Pendulum {
    init(images) {
        this.revolution = 0;
        this.images = images;

        this.num = 4;
        this.mass = new Array(this.num).fill(10);
        let l = 150;
        this.len = new Array(this.num ).fill(l);
        this.lenG = new Array(this.num).fill(l / 2);
        this.rG = new Array(this.num).fill(Math.PI / 180 * 0);

        this.I = [];
        for (let i = 0; i < this.num; i++) {
            this.I[i] = this.mass[i] * Math.pow(this.lenG[i] * 2, 2) / 12;
        }

        let r = new Array(this.num).fill(Math.PI / 180 * 60);
        let v = new Array(this.num).fill(Math.PI / 180 * 0);
        this.vec = new Vector(r.concat(v));

        this.loop = 100;
        this.gx = 0;
        this.gy = 0.5;
        this.ox = W / 2;
        this.oy = H / 8;

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
                    + this.massSum(h + 1, this.num - 1) * this.len[h] * this.len[p] * Math.cos(vec.elm[p] - vec.elm[h] + this.rG[p] - this.rG[h]);
            }
            matrix[h][h] = this.mass[h] * Math.pow(this.lenG[h], 2) + this.I[h] + this.massSum(h + 1, this.num - 1) * Math.pow(this.len[h], 2);
            for (let p = h + 1; p < this.num; p++) {
                matrix[h][p] = this.mass[p] * this.len[h] * this.lenG[p] * Math.cos(vec.elm[h] + this.rG[h] - vec.elm[p])
                    + this.massSum(p + 1, this.num - 1) * this.len[h] * this.len[p] * Math.cos(vec.elm[p] - vec.elm[h] + this.rG[p] - this.rG[h]);
            }
            //定数項
            let sum1 = 0;
            for (let i = 0; i < h; i++) {
                sum1 += this.len[i] * Math.pow(vec.elm[this.num + i], 2) * Math.sin(vec.elm[i] + this.rG[i] - vec.elm[h]);
            }
            let sum2 = [0];
            for (let i = 0; i < this.num; i++) {
                sum2[i + 1] = sum2[i] + this.len[i] * Math.pow(vec.elm[this.num + i], 2) * Math.sin(vec.elm[i] - vec.elm[h] + this.rG[i] - this.rG[h]);
            }
            let sum3 = 0;
            for (let k = h + 1; k < this.num; k++) {
                sum3 += this.mass[k] * (-this.lenG[k] * Math.pow(vec.elm[this.num + k], 2) * Math.sin(vec.elm[h] + this.rG[h] - vec.elm[k])
                    + sum2[k] - sum2[0])
            }
            matrix[h][this.num] = this.mass[h] * this.lenG[h] * sum1
                + this.len[h] * sum3
                + this.mass[h] * this.lenG[h] * (this.gx * Math.cos(vec.elm[h]) - this.gy * Math.sin(vec.elm[h]))
                + this.massSum(h + 1, this.num - 1) * this.len[h] * (this.gx * Math.cos(vec.elm[h] + this.rG[h]) - this.gy * Math.sin(vec.elm[h] + this.rG[h]));
        }

        return new Vector(vec.elm.slice(this.num, this.num * 2).concat(SLEsolve(matrix)));
    }
    update() {
        let dt = 1 / this.loop;
        for (let i = 0; i < this.loop; i++) {
            //オイラー法
            //this.vec = this.vec.add(this.bibun(this.vec).mult(dt));

            //修正オイラー法
            let tmp1 = this.bibun(this.vec).mult(dt);
            let tmp2 = this.bibun(this.vec.add(tmp1)).mult(dt);
            this.vec = this.vec.add(tmp1.add(tmp2).mult(1 / 2));
        }
    }
    
    draw(ctx) {
        let x = this.ox;
        let y = this.oy;
        for (let i = 0; i < this.num; i++) {
            let dx, dy, dgx, dgy;
            dgx = this.lenG[i] * Math.sin(this.vec.elm[i]);
            dgy = this.lenG[i] * Math.cos(this.vec.elm[i]);
            if (i < this.num - 1) {
                dx = this.len[i] * Math.sin(this.vec.elm[i] + this.rG[i]);
                dy = this.len[i] * Math.cos(this.vec.elm[i] + this.rG[i]);
            }

            if (!this.revolution) {
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
                let r = Math.max(edgeW * 2, Math.sqrt(this.I[i] * 2 / this.mass[i]));
                ctx.beginPath();
                ctx.arc(x + dgx, y + dgy, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.beginPath();
                ctx.arc(x + dgx, y + dgy, edgeW, 0, Math.PI * 2);
                ctx.fill();

            } else {
                //教育改革モード
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.fillStyle = "rgb(0, 0, 0)";

                let dgx2 = dgx * this.len[i] / this.lenG[i];
                let dgy2 = dgy * this.len[i] / this.lenG[i];

                if (i < this.num - 1) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + dx, y + dy);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x + dgx2, y + dgy2);
                    ctx.lineTo(x + dx, y + dy);
                    ctx.stroke();

                }

                ctx.save();
                ctx.translate(x + dgx, y + dgy);
                ctx.rotate(-this.vec.elm[i]);
                let scale = this.lenG[i] / images[i].height * 2;
                ctx.scale(scale, scale);
                ctx.drawImage(images[i], -images[i].width / 2, -images[i].height / 2);
                ctx.restore();

                
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fill();

                if (i < this.num - 1) {
                    ctx.beginPath();
                    ctx.arc(x + dgx2, y + dgy2, 8, 0, Math.PI * 2);
                    ctx.fill();
                }

            }

            if (i < this.num - 1) {
                x += dx;
                y += dy;
            }
        }


        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "30px serif";
        ctx.textBaseline = "top";
        ctx.textAlign = "right";
        //ctx.fillText("絶起！w", 0, 0);
        ctx.fillText((this.getE() - this.firstE).toFixed(5), W, 0);
    }
}