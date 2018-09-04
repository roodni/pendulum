//canvasを管理するクラス
class Canvas {
	init(elm, w, h) {
		this.w = w;
		this.h = h;
		this.canvas = elm;
		this.canvas.width = w;
		this.canvas.height = h;
		this.context = this.canvas.getContext("2d");
	}
}