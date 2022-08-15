import { Position } from "../shape/position";
import { Character } from "./character";
import { Shot } from "./shot";

/**
 * 自機。
 */
export class Viper extends Character {
	/** 登場中かどうかを表すフラグ */
	private isComing: boolean;
	/** 登場演出を開始したタイムスタンプ */
	private comingStart: number;
	/** 登場演出を完了する座標 */
	private comingEndPosition: Position;
	/** 自身が持つショットインスタンス配列 */
	private shotArray: Array<Shot>;
	/** 自身を撃った後のチェックカウンター */
	private shotCheckCounter: number;
	/** ショットを撃つ間隔(フレーム数) */
	private shotInterval: number;
	/** シングルショットのインスタンス配列 */
	private singleShotArray: Array<Shot>;
	/** 移動スピード */
	private speed: number;

	/**
	 * コンストラクタ
	 * @param ctx 2Dコンテキスト
	 * @param position 座標
	 * @param width 幅
	 * @param height 高さ
	 * @param imagePath キャラクターの画像パス
	 */
	constructor(
		ctx: CanvasRenderingContext2D,
		position: Position,
		width: number,
		height: number,
		imagePath: string) {
		super(ctx, position, height, width, 1, imagePath);
		this.isComing = false;
		this.comingStart = -99;
		this.comingEndPosition = new Position(-99, -99);
		this.shotArray = [];
		this.shotCheckCounter = 0;
		this.shotInterval = 10;
		this.singleShotArray = [];
		// TODO スピードは定数化した方が良い？
		this.speed = 3;
	}

	/**
	 * 登場演出に関する設定を行う。
	 * @param startPosition 登場開始時の座標
	 * @param endPosition 登場終了時の座標
	 */
	setComing(startPosition: Position, endPosition: Position) {
		this.isComing = true;
		this.life = 1;
		this.comingStart = Date.now();
		this.position = startPosition;
		this.comingEndPosition = endPosition
	}

	/**
	 * ショットを設定する。
	 * @param shotArray 通常のショット
	 * @param singleShotArray シングルショット
	 */
	setShotArray(shotArray: Array<Shot>, singleShotArray: Array<Shot>) {
		this.shotArray = shotArray;
		this.singleShotArray = singleShotArray;
	}

	/**
	 * 登場中かどうかを取得します。
	 * @returns 登場中かどうか
	 */
	getIsComing(): boolean {
		return this.isComing
	}

	/**
	 * キャラクターの状態を更新し、描画を行う。
	 */
	update() {
		if (this.life <= 0) {
			return;
		}

		const justTime = Date.now();

		if (this.isComing) {
			const comingTime = (justTime - this.comingStart) / 1000;
			var y = this.position.y - comingTime * 50;

			if (y <= this.comingEndPosition.y) {
				this.isComing = false;
				y = this.comingEndPosition.y;
			}

			this.position = new Position(this.position.x, y);

			if (justTime % 100 < 50) {
				this.ctx.globalAlpha = 0.5;
			}
		} else {
			if (window.isKeyDown.get("key_ArrowLeft") === true) {
				this.position = new Position(this.position.x - this.speed, this.position.y);
			}
			if (window.isKeyDown.get("key_ArrowRight") === true) {
				this.position = new Position(this.position.x + this.speed, this.position.y);
			}
			if (window.isKeyDown.get("key_ArrowUp") === true) {
				this.position = new Position(this.position.x, this.position.y - this.speed);
			}
			if (window.isKeyDown.get("key_ArrowDown") === true) {
				this.position = new Position(this.position.x, this.position.y + this.speed);
			}
			const canvasWidth = this.ctx.canvas.width;
			const canvasHeight = this.ctx.canvas.height;
			const tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
			const ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
			this.position = new Position(tx, ty);

			if (window.isKeyDown.get("key_z") === true) {
				if (this.shotCheckCounter >= 0) {
					for (let i = 0; i < this.shotArray.length; i++) {
						if (this.shotArray[i].getLife() <= 0) {
							this.shotArray[i].set(new Position(this.position.x, this.position.y));
							this.shotCheckCounter = - this.shotInterval;
							break;
						}
					}

					for (let i = 0; i < this.singleShotArray.length; i += 2) {
						if (this.singleShotArray[i].getLife() <= 0 && this.singleShotArray[i + 1].getLife() <= 0) {
							const radCW = 280 * Math.PI / 180;
							const radCCW = 260 * Math.PI / 180;
							this.singleShotArray[i].set(new Position(this.position.x, this.position.y), 4);
							this.singleShotArray[i].setVectorFromAngle(radCW);
							this.singleShotArray[i + 1].set(new Position(this.position.x, this.position.y), 4);
							this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
							this.shotCheckCounter = - this.shotInterval;
							break;
						}
					}
				}
			}
			++this.shotCheckCounter;
		}
		this.draw();
		this.ctx.globalAlpha = 1.0;
	}
}