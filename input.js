class MouseInput {
    init(elm) {
        this.elm = elm;
        this.__active = false;
        this.__x = 0;
        this.__y = 0;
        this.__wheel = 0;
        elm.addEventListener("mousemove", (e) => {
            this.__active = true;
            this.__x = e.offsetX;
            this.__y = e.offsetY;
        });
        elm.addEventListener("mouseout", () => {
            this.__active = false;
        });
        elm.addEventListener("mousewheel", (e) => {
            e.preventDefault();
            this.__wheel = e.wheelDelta;
        });
    }
    update() {
        this.active = this.__active;
        this.x = this.__x;
        this.y = this.__y;
        this.wheel = this.__wheel;
        this.__wheel = 0;
    }
}