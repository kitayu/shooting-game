import { Position } from "../shape/position";
import { Enemy } from "./enemy";
import { Shot } from "./shot";
import { Viper } from "./viper";

export class HomingShot extends Shot {

	private frame: number;

	constructor(
		ctx: CanvasRenderingContext2D,
		position: Position,
		width: number,
		height: number,
		imagePath: string) {
		super(ctx, position, width, height, imagePath);
		this.frame = 0;
	}

	/**
     * ホーミングショットを配置する
     * @param position 配置する座標
     * @param speed 設定するスピード
     * @param power 設定する攻撃力
     */
	set(position: Position, power: number, speed: number) {
		// 登場開始位置にショットを移動させる
		this.position = position;
		// ショットのライフを 0 より大きい値（生存の状態）に設定する
		this.life = 1;
		// スピードを設定する
		this.setSpeed(speed);
		// 攻撃力を設定する
		this.setPower(power);
		// フレームをリセットする
		this.frame = 0;
	}

	/**
	 * キャラクターの状態を更新し、描画を行う
	 */
	update() {
		if (this.life <= 0) {
			return;
		}

		if(this.position.x + this.width < 0 ||
			this.position.x - this.width > this.ctx.canvas.width ||
			this.position.y + this.height < 0 ||
			this.position.y - this.height > this.ctx.canvas.height) {
			this.life = 0;
		}

		let target = this.targetArray[0];

		if (this.frame < 100 ){
			let vector = new Position(
				target.getPosition().x - this.position.x,
				target.getPosition().y - this.position.y
			);
			let normalizedVector = vector.normalize();
			this.vector = this.vector.normalize();
			// ふたつの単位化済みベクトルから外積を計算する
			let cross = this.vector.cross(normalizedVector);
			// 外積の結果は、スクリーン空間では以下のように説明できる
			// 結果が 0.0     → 真正面か真後ろの方角にいる
			// 結果がプラス   → 右半分の方向にいる
			// 結果がマイナス → 左半分の方向にいる
			// １フレームで回転できる量は度数法で約 1 度程度に設定する
			let rad = Math.PI / 180.0;
			if (cross > 0.0) {
				this.vector = this.vector.rotate(rad);
			} else if (cross < 0.0) {
				this.vector = this.vector.rotate(-rad);
			}
		}
		const x = this.position.x + this.vector.x * this.speed;
		const y = this.position.y + this.vector.y * this.speed;
		this.position = new Position(x, y);

		this.angle = Math.atan2(this.vector.y, this.vector.x);

		this.targetArray.map((v) => {
			if (this.life <= 0 || v.getLife() <= 0) {
				return;
			}

			let dist = this.position.distance(v.getPosition());
			if (dist <= (this.width + v.getWidth()) / 4) {
				if (v instanceof Viper === true) {
					if ((v as Viper).getIsComing() === true) {
						return;
					}
				}
				v.setLife(v.getLife() - this.power);
				if (v.getLife() <= 0) {
					for (let i = 0; i < this.explosionArray.length; i++) {
						if (this.explosionArray[i].getLife() !== true) {
							this.explosionArray[i].set(v.getPosition());
							break;
						}
					}
					if (v instanceof Enemy === true) {
						let score = 100;
						if ((v as Enemy).getType() === 'large') {
							score = 1000;
						}
						window.gameScore = Math.min(window.gameScore + score, 99999);
					}
				}
				this.life = 0;
			}
		});
		// 座標系の回転を考慮した描画を行う
		this.rotationDraw();
		// 自身のフレームをインクリメントする
		++this.frame;
	}
}