import { CubicBezier } from "./shape/cubic-bezier";
import { Fun } from "./shape/fan";
import { Line } from "./shape/line";
import { Polygon } from "./shape/polygon";
import { QuadraticBezier } from "./shape/quadratic-bezier";
import { Rect } from "./shape/rect";
import { Text } from "./shape/text";
export class Canvas2DUtility {

	private canvasElement: HTMLCanvasElement;

	private context2d: CanvasRenderingContext2D | null;

	constructor(canvas: HTMLCanvasElement) {
		if (canvas == null) {
			throw new Error("canvas is null.")
		}
		this.canvasElement = canvas;
		this.context2d = canvas.getContext('2d');
		if (this.context2d == null) {
			throw new Error("context2d is null.")
		}
	}

	/**
	 * canvasElementを取得する。
	 * @return HTMLCanvasElement
	 */
	get canvas() {
		return this.canvasElement;
	}

	get context() {
		return this.context2d;
	}

	/**
	 * 短形を描画する。
	 * @param rect 短形
	 * @throws Will throw an error if the argument is null.
	 */
	drawRect(rect: Rect) {
		if (!rect) {
			throw new Error("rect is null.");
		}

		if (rect.color != null) {
			this.context2d!.fillStyle = rect.color;
		}
		this.context2d!.fillRect(rect.position.x, rect.position.y, rect.width, rect.height);
	}

	/**
	 * 線分を描画する。
	 * @param line 線
	 */
	drawLine(line: Line) {
		if (!line) {
			throw new Error("line is null.");
		}
		if (line.color != null) {
			this.context2d!.strokeStyle = line.color;
		}

		this.context2d!.lineWidth = line.width;
		this.context2d!.beginPath();
		this.context2d!.moveTo(
			line.startPosition.x,
			line.startPosition.y);
		this.context2d!.lineTo(
			line.endPosition.x,
			line.endPosition.y);
		this.context2d!.closePath();
		this.context2d!.stroke();
	}

	/**
	 * 多角形を描画する。
	 * @param polygon 多角形
	 */
	drawPolygon(polygon: Polygon) {
		if (!polygon) {
			throw new Error("polygon is null.");
		}

		if (!polygon.points) {
			throw new Error("polygon.points is null.");
		}

		if  (polygon.points.length < 3) {
			throw new Error("polygon.points is 3 or more.");
		}

		if (polygon.color != null) {
			this.context2d!.fillStyle = polygon.color;
		}

		this.context2d?.beginPath();
		for (let i = 0; i < polygon.points.length; i +=2) {
			this.context2d?.lineTo(
				polygon.points[i],
				polygon.points[i+1]);
		}

		this.context2d?.closePath();
		this.context2d?.fill();
	}

	/**
	 * 扇型を描画する。
	 * @param fun 扇型
	 */
	drawFan(fun: Fun) {
		if (!fun) {
			throw new Error("fun is Null.");
		}

		if (fun.color != null) {
			this.context2d!.fillStyle = fun.color;
		}

		this.context2d?.beginPath();
		this.context2d?.moveTo(fun.position.x, fun.position.y)
		this.context2d?.arc(fun.position.x, fun.position.y, fun.radius, fun.startRadian, fun.endRadian);
		this.context2d?.closePath();
		this.context2d?.fill();
	}

	/**
	 * 線分を2次ぺジェ曲線で描画する。
	 * @param quadraticBezier 2次ぺジェ曲線
	 */
	drawQuadraticBezier(quadraticBezier: QuadraticBezier) {
		if (!quadraticBezier) {
			throw new Error("quadraticBezier is null");
		}

		if (quadraticBezier.width) {
			this.context2d!.lineWidth = quadraticBezier.width;
		} else {
			this.context2d!.lineWidth = 1;
		}

		this.context2d!.beginPath();
		this.context2d!.moveTo(quadraticBezier.startPosition.x, quadraticBezier.startPosition.y);
		this.context2d!.quadraticCurveTo(
			quadraticBezier.controllPosition.x,
			quadraticBezier.controllPosition.y,
			quadraticBezier.endPosition.x,
			quadraticBezier.endPosition.y
		);
		this.context2d!.closePath();
		this.context2d!.stroke();
	}

	/**
	 * 3次ぺジェ曲線を描画する。
	 * @param cubicBezier 3次ぺジェ曲線
	 */
	drawCubicBezier(cubicBezier: CubicBezier) {
		if (!cubicBezier) {
			throw new Error("cubicBezier is null.");
		}

		if (cubicBezier.color != null) {
			this.context2d!.strokeStyle = cubicBezier.color;
		}

		this.context2d!.beginPath();
		this.context2d!.moveTo(
			cubicBezier.startPosition.x,
			cubicBezier.startPosition.y);
		this.context2d!.bezierCurveTo(
			cubicBezier.startControllPosition.x,
			cubicBezier.startControllPosition.y,
			cubicBezier.endControllPosition.x,
			cubicBezier.endControllPosition.y,
			cubicBezier.endPosition.x,
			cubicBezier.endPosition.y
		);
		this.context2d!.closePath();
		this.context2d!.stroke();
	}

	/**
	 * テキストを描画する。
	 * @param text テキスト
	 */
	drawText(text: Text) {
		if (!text) {
			throw new Error("text is null.");
		}

		if (text.color != null) {
			this.context2d!.fillStyle = text.color;
		}

		this.context2d!.fillText(
			text.text,
			text.position.x,
			text.position.y,
			text.width
		);
	}

	/**
	 * 画像をロードしてコールバック関数にロードした画像を与え呼び出す。
	 * @param path 画像ファイルのパス
	 * @param callback コールバック関数
	 */
	imageLoader(path: string, callback: Function) {
		let target = new Image();
		target.addEventListener('load', () => {
			if (callback != null) {
				callback(target);
			}
		}, false);
		target.src = path;
	}
}