import { Position } from "../shape/position";

export class Explosion {
	/** 2Dコンテキスト */
	private ctx: CanvasRenderingContext2D;
	/** 爆発の広がる範囲 */
	private radius: number;
	/** 爆発の火花の数 */
	private count: number;
	/** 爆発の火花の大きさ(幅、高さ) */
	private fireBaseSize: number;
	/** 爆発が消えるまでの時間(秒) */
	private timeRange: number;
	/** 爆発の色 */
	private color: string;
	/** 火花の一つあたりの大きさ */
	private fireSize: Array<Position>
	/** 火花の位置を格納する */
	private firePosition: Array<Position>;
	/** 火花の進行方向を格納する */
	private fireVector: Array<Position>;
	/** 爆発の生存フラグ */
	private life: boolean;
	/** 爆発が始まったタイムスタンプ */
	private startTime: number;
	/**
	 * コンストラクタ。
	 * @param ctx 2Dコンテキスト
	 * @param radius 爆発の広がりの半径
	 * @param count 爆発の火花の数
	 * @param size 爆発の火花の大きさ
	 * @param timeRange 爆発が消えるまでの時間(秒)
	 * @param color 爆発の色
	 */
	constructor(
		ctx: CanvasRenderingContext2D,
		radius: number,
		count: number,
		size: number,
		timeRange: number,
		color: string = "#ff1166") {
		this.ctx = ctx;
		this.radius = radius;
		this.count = count;
		this.fireBaseSize = size;
		this.timeRange = timeRange;
		this.color = color
		this.fireSize = [];
		this.firePosition = [];
		this.fireVector = [];
		this.life = false;
		this.startTime = 0;
	}

	set(position: Position) {
		for (let i = 0; i < this.count; i++) {
			this.firePosition[i] = position;
			let r = Math.random() * Math.PI * 2.0;
			let s = Math.sin(r);
			let c = Math.cos(r);

			let mr = Math.random();
			this.fireVector[i] = new Position(c * mr, s * mr);
			let size = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
			this.fireSize[i] = new Position(size, size);
		}

		this.life = true;
		this.startTime = Date.now();
	}

	/**
	 * 爆発の生存ライフを取得する。
	 * @returns 爆発の生存ライフ
	 */
	getLife(): boolean {
		return this.life;
	}
	update() {
		if (!this.life) {
			return;
		}

		this.ctx.fillStyle = this.color;
		this.ctx.globalAlpha = 0.5;
		let time = (Date.now() - this.startTime) / 1000;
		let ease = this.simpleEaseIn(1.0 - Math.min(time/ this.timeRange, 1.0));
		let progress = 1.0 - ease;
		
		for (let i = 0; i < this.firePosition.length; i++) {
			let d = this.radius * progress;
			let x = this.firePosition[i].x + this.fireVector[i].x * d;
			let y = this.firePosition[i].y + this.fireVector[i].y * d;

			let s = 1.0 - progress;

			this.ctx.fillRect(
				x - this.fireSize[i].x / 2,
				y - this.fireSize[i].y / 2,
				this.fireSize[i].x * s,
				this.fireSize[i].y * s
			);
		}
		
		if (progress >= 1.0) {
			this.life = false;
		}
	}

	/**
	 * 補完関数。
	 * @param t 0.0 ~ 1.0を指定
	 * @returns 計算結果
	 */
	private simpleEaseIn(t: number): number {
		if (t < 0.0) {
			t = 0.0;
		} else if (t > 1.0) {
			t = 1.0;
		}

		return t * t * t * t;
	}
}