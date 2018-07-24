//canvasを管理するクラス
//ついでにマウス入力も受け取る
class Canvas {
	init(elm, w, h) {
		//canvasいろいろ
		this.w = w;
		this.h = h;
		this.canvas = elm;
		this.canvas.width = w;
		this.canvas.height = h;
		this.context = this.canvas.getContext("2d");
	}
}