const W = 640;
const H = 480;

const canvas = new Canvas();
const mouse = new MouseInput();

function init() {
    canvas.init(document.getElementById("screen"), W, H);
    mouse.init(canvas.canvas);
}

function update() {
    mouse.update();
}

function draw() {

}

function main() {
    update();
    draw();
    requestAnimationFrame(main);
}

window.addEventListener("load", () => {
    init();
    requestAnimationFrame(main);
});