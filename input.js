class MouseInput {
    init(elm) {
        this.elm = elm;
        this.active = false;
        this._active = false;
        this.x = 0;
        this.y = 0;
        this._x = 0;
        this._y = 0;
        this.wheel = 0;
        this._wheel = 0;
        this.down = false;
        this._down = false;

        elm.addEventListener("mousemove", (e) => {
            this._active = true;
            this._x = e.offsetX;
            this._y = e.offsetY;
        });
        elm.addEventListener("mouseout", () => {
            this._active = false;
            this._down = false;
        });
        elm.addEventListener("mousewheel", (e) => {
            e.preventDefault();
            this._wheel = e.wheelDelta;
        });
        elm.addEventListener("mousedown", () => {
            this._down = true;
        });
        elm.addEventListener("mouseup", () => {
            this._down = false;
        });
    }
    update() {
        this.activeOld = this.active;
        this.active = this._active;

        this.xOld = this.x;
        this.yOld = this.y;
        this.x = this._x;
        this.y = this._y;

        this.wheel = this._wheel;
        this._wheel = 0;

        this.downOld = this.down;
        this.down = this._down;
    }
}