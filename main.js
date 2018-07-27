const W = 1024;
const H = 768;

const canvas = new Canvas();
const mouse = new MouseInput();
const pendulum = new Pendulum();

let images = [];

function init() {
    images[0] = new Image();
    images[0].src = "src/UEDpink.jpg";
    images[1] = new Image();
    images[1].src = "src/UED.jpg";
    images[2] = new Image();
    images[2].src = "src/UED_IKGM.jpg";

    canvas.init(document.getElementById("screen"), W, H);
    mouse.init(canvas.canvas);
    pendulum.init(images);
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