

class Pendulum {
    init(images) {
        this.num = 2;
        this.mass = new Array(this.num).fill(10);
        let l = 150;
        this.len = new Array(this.num).fill(l);
        this.lenG = new Array(this.num).fill(l);
        this.rG = new Array(this.num).fill(0);

        this.I = [];
        for (let i = 0; i < this.num; i++) {
            this.I[i] = 0;//this.mass[i] * Math.pow(this.len[i], 2) / 12;
        }

        let r = new Array(this.num).fill(Math.PI / 2);
        let v = new Array(this.num).fill(0);
        this.vec = new Vector(r.concat(v));

        this.loop = 256;
        this.dt = 1 / this.loop;
        this.gx = 0;
        this.gy = 0.5;
        this.ox = 512;
        this.oy = 256;

        //質量の累積和をとる
        this._massSum = [0];
        for (let i = 0; i < this.num; i++) {
            this._massSum[i + 1] = this._massSum[i] + this.mass[i];
        }
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
        for (let i = 0; i < this.loop; i++) {
            let tmp1 = this.bibun(this.vec).mult(this.dt);
            let tmp2 = this.bibun(this.vec.add(tmp1)).mult(this.dt);
            this.vec = this.vec.add(tmp1.add(tmp2).mult(1 / 2));
        }
    }
    draw(ctx) {
        let x = this.ox;
        let y = this.oy;
        for (let i = 0; i < this.num; i++) {
            let dx = this.len[i] * Math.sin(this.vec.elm[i]);
            let dy = this.len[i] * Math.cos(this.vec.elm[i]);

            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx, y + dy);
            ctx.stroke();

            x += dx;
            y += dy;

            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = "#000000";
        ctx.font = "30px serif";
        ctx.textBaseline = "top";
        ctx.fillText("絶起！w", 0, 0);
    }
}