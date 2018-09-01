const screenW = 768;
const screenH = 512;

const canvas = new Canvas();
const mouse = new MouseInput();
const pendulum = new Pendulum();

const preset = {
    'single': '{\n"number": 1,\n"distOG": [0.5],\n"angle": [90]\n}',
    'double': '{\n"number": 2,\n"distOG": [0.6],\n"angle": [90]\n}',
    'doubleS': '{\n"number": 2,\n"distOG": [0.3],\n"angle": [90],\n"shape": ["stick"]\n}',
    'triple': '{\n"number": 3,\n"distOG": [0.6],\n"angle": [90]\n}',
    'tripleS': '{\n"number": 3,\n"distOG": [0.3],\n"angle": [90],\n"shape": ["stick"]\n}',
    'quintuple': '{\n"number": 5,\n"distOG": [0.3],\n"angle": [60]\n}',
    'beast': '{\n"number": 8,\n"distOG": [0.2],\n"angle": [50]\n}'
};

let images = [];

function init() {
    images[0] = new Image();
    images[0].src = "src/bluebird_baka.png";
    //images[1] = new Image();
    //images[1].src = "src/yaruki_moetsuki_man.png";

    canvas.init(document.getElementById("screen"), screenW, screenH);
    mouse.init(canvas.canvas);
    pendulum.init();

    let form = document.forms.mainForm;

    function presetSelect() {
        form.pendulumData.value = preset[form.preset.value];
    }
    form.preset.addEventListener("change", presetSelect);

    function pendulumDataRead() {
        let data = new PendulumData(form.pendulumData.value);
        if (data.error === "") {
            document.getElementById("pendulumDataError").innerHTML = "";
            pendulum.readData(data);
        } else {
            document.getElementById("pendulumDataError").innerHTML = data.error;
        }
    }
    form.read.addEventListener("click", pendulumDataRead);

    function drawModeChange() {
        pendulum.drawMode = form.drawMode.value;
    }
    form.drawMode.addEventListener("change", drawModeChange);

    presetSelect();
    pendulumDataRead();
    drawModeChange();
}

function update() {
    mouse.update();

    //平行移動
    if (mouse.downOld) {
        pendulum.ox += mouse.x - mouse.xOld;
        pendulum.oy += mouse.y - mouse.yOld;
    }
    //拡大縮小
    if (Math.abs(mouse.wheel) > 0) {
        let r = Math.pow(1.01, mouse.wheel / 120)
        pendulum.px_m *= r;
        pendulum.ox = (pendulum.ox - mouse.x) * r + mouse.x;
        pendulum.oy = (pendulum.oy - mouse.y) * r + mouse.y;
    }
    pendulum.update();
}

function draw(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, screenW, screenH);

    pendulum.draw(ctx, images);
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