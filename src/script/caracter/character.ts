import { Position } from "../shape/position";

/**
 * キャラクター。
 */
export abstract class Character {
	/** 2dコンテキスト */
	protected ctx: CanvasRenderingContext2D;
	/** 座標 */
	protected position: Position;
	/** 方向 */
	protected vector: Position;
	/** 幅 */
	protected width: number;
	/** 高さ */
	protected height: number;
	/** ライフ */
	protected life: number;
	/** 準備が完了したかどうか */
	protected ready: boolean;
	/** イメージ */
	protected image: HTMLImageElement;
	/** 進行方向の角度 */
	protected angle: number;

	/**
	 * コンストラクタ
	 * @param ctx 2Dコンテキスト
	 * @param position 座標
	 * @param width 幅
	 * @param height 高さ
	 * @param life ライフ
	 * @param imagePath キャラクターの画像パス
	 */
	constructor(
		ctx: CanvasRenderingContext2D,
		position: Position,
		width: number,
		height: number,
		life: number,
		imagePath: string) {
		this.ctx = ctx;
		this.position = position;
		this.vector = new Position(0.0, -1.0);
		this.width = width;
		this.height = height;
		this.life = life;
		this.ready = false;
		this.image = new Image();
		this.image.addEventListener("load", () => {
			this.ready = true;
		}, false);
		this.image.src = imagePath;
		this.angle = 270 * Math.PI / 180;
	}

	/**
	 * 進行方向を設定する。
	 * @param position 進行方向の座標
	 */
	setVector(position: Position) {
		this.vector = position;
	}

	/**
	 * 進行方向の角度を元に設定する。
	 * @param angle 進行方向の角度
	 */
	setVectorFromAngle(angle: number) {
		this.angle = angle;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		this.vector = new Position(cos, sin);
	}

	/**
	 * ライフを設定する。
	 * @param life ライフ
	 */
	setLife(life: number) {
		this.life = life;
	}
	/**
	 * ライフを取得する。
	 * @returns ライフ
	 */
	getLife() {
		return this.life;
	}

	/**
	 * 座標を取得する。
	 * @returns 座標
	 */
	getPosition() {
		return this.position;
	}

	/**
	 * 座標を設定する。
	 * @param position 座標
	 */
	setPosition(position: Position) {
		this.position = position;
	}

	/**
	 * 幅を取得する。
	 * @returns 幅
	 */
	getWidth(): number {
		return this.width;
	}

	/**
	 * 高さを取得する。
	 * @returns 高さ
	 */
	getHeight(): number {
		return this.height;
	}

	/**
	 * 準備中かどうかを取得します。
	 * @returns 準備が完了したかどうか
	 */
	isReady(): boolean {
		return this.ready;
	}

	/**
	 * キャラクター画像を回転して描画する。
	 */
	rotationDraw() {
		this.ctx.save();
		this.ctx.translate(
			this.position.x,
			this.position.y
		);
		this.ctx.rotate(this.angle - Math.PI * 1.5);
		this.ctx.drawImage(
			this.image,
			- this.width / 2,
			- this.height /2,
			this.width,
			this.height
		);

		this.ctx.restore();
	}

	draw() {
		this.ctx.drawImage(
			this.image,
			this.position.x - this.width / 2,
			this.position.y - this.height /2,
			this.width,
			this.height
		)
	}

	abstract update(): void;
}