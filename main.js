const screenW = 768;
const screenH = 512;

const canvas = new Canvas();
const mouse = new MouseInput();
const pendulum = new Pendulum();

const preset = {
    'single': '{\n"number": 1,\n"distOG": [0.6],\n"angle": [90]\n}',
    'double': '{\n"number": 2,\n"distOG": [0.6],\n"angle": [90]\n}',
    'doubleS': '{\n"number": 2,\n"distOG": [0.3],\n"angle": [90],\n"shape": ["stick"]\n}',
    'triple': '{\n"number": 3,\n"distOG": [0.6],\n"angle": [90]\n}',
    'tripleS': '{\n"number": 3,\n"distOG": [0.3],\n"angle": [90],\n"shape": ["stick"]\n}',
    'quintuple': '{\n"number": 5,\n"distOG": [0.3],\n"angle": [60]\n}',
    'beast': '{\n"number": 8,\n"distOG": [0.2],\n"angle": [50]\n}'
};

let images = [];

function init() {
    canvas.init(document.getElementById("screen"), screenW, screenH);
    mouse.init(canvas.canvas);
    pendulum.init();

    images[0] = new Image();
    images[0].src = "src/bluebird_baka.png";
    //images[1] = new Image();
    //images[1].src = "src/yaruki_moetsuki_man.png";
    pendulum.images = images;

    let form = document.forms.mainForm;

    function presetSelect() {
        form.pendulumData.value = preset[form.preset.value];
    }
    form.preset.addEventListener("change", presetSelect);

    function pendulumDataRead() {
        let data = new PendulumData(form.pendulumData.value);
        if (data.error === "") {
            document.getElementById("pendulumDataError").innerText = "";
            pendulum.readData(data);
        } else {
            document.getElementById("pendulumDataError").innerText = data.error;
        }
    }
    form.read.addEventListener("click", pendulumDataRead);

    function drawModeChange() {
        pendulum.drawMode = form.drawMode.value;
        form.pendulumText.style.display = (pendulum.drawMode === "text") ? "inline" : "none";
    }
    form.drawMode.addEventListener("change", drawModeChange);

    function pendulumTextChange() {
        let text = form.pendulumText.value;
        if (text !== "") {
            pendulum.text = text;
        }
    }
    form.pendulumText.addEventListener("change", pendulumTextChange);

    function getURLParams() {
        let query = location.search.substring(1);
        let params = query.split("&");
        let result = {};
        params.forEach((param) => {
            let elements = param.split("=");
            let name = decodeURIComponent(elements[0]);
            let value = decodeURIComponent(elements.slice(1).join("="));
            result[name] = value;
        });
        return result;
    }
    let params = getURLParams();

    if (params.hasOwnProperty("data")) {
        form.pendulumData.value = params["data"];
    } else {
        presetSelect();
    }
    pendulumDataRead();

    if (params.hasOwnProperty("text")) {
        form.pendulumText.value = params["text"];
        form.drawMode.value = "text";
    }
    pendulumTextChange();
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