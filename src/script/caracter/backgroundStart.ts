import { Position } from "../shape/position";

export class BackgroundStar {
	/**  */
	private ctx: CanvasRenderingContext2D;
	/** 星の大きさ(幅、高さ) */
	private size: number;
	/** 星の移動速度 */
	private speed: number;
	/** 星をfillする際の色 */
	private color: string;
	/** 自身の座標 */
	private position?: Position;

	/**
	 * @constructor
	 * @param ctx 
	 * @param size - 星の大きさ(幅、高さ)
	 * @param speed - 星の移動速度
	 * @param color 星の色(default: '#ffffff')
	 */
	constructor(
		ctx:CanvasRenderingContext2D,
		size: number,
		speed: number,
		color:string = '#ffffff') {
		this.ctx = ctx;
		this.size = size;
		this.speed = speed;
		this.color = color;
	}
	
	/**
	 * 星を設定する。
	 * @param position 星を発生させる座標
	 */
	set(position: Position) {
		this.position = position;
	}
	
	/**
	 * 星を更新する。
	 */
	update() {
		this.ctx.fillStyle = this.color;
		this.position!.setY(this.position!.y + this.speed);
		this.ctx.fillRect(
			this.position!.x - this.size / 2,
			this.position!.y - this.size / 2,
			this.size,
			this.size
			);
		if (this.position!.y + this.size > this.ctx.canvas.height) {
			this.position!.setY(-this.size);
		}
	}
}