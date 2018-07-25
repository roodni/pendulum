const W = 1024;
const H = 768;

const canvas = new Canvas();
const mouse = new MouseInput();
const pendulum = new Pendulum();

function init() {
    canvas.init(document.getElementById("screen"), W, H);
    mouse.init(canvas.canvas);
    pendulum.init();
}

function update() {
    mouse.update();
    pendulum.update();
}

function draw(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    pendulum.draw(ctx);
}

function main() {
    update();
    draw(canvas.context);
    requestAnimationFrame(main);
}

window.addEventListener("load", () => {
    init();
    requestAnimationFrame(main);
});