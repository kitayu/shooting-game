import { Position } from "../shape/position";
import { Boss } from "./boss";
import { Character } from "./character";
import { Enemy } from "./enemy";
import { Explosion } from "./explosion";
import { Viper } from "./viper";

/**
 * ショット。
 */
export class Shot extends Character {
	/** スピード */
	protected speed: number;
	/** 攻撃力 */
	protected power: number;
	/** 衝突判定対象 */
	protected targetArray: Array<Character>;
	/** 爆発エフェクト */
	protected explosionArray: Array<Explosion>;

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
		super(ctx, position, width, height, 0, imagePath);

		this.speed = 7;
		this.power = 1;
		this.targetArray = [];
		this.explosionArray = [];
		this.vector = new Position(0.0, -1.0);
	}

    /**
     * ショットを配置する
     * @param position 配置する座標
     * @param power 設定する攻撃力
     * @param speed 設定するスピード
     */
	 set(position: Position, power: number = 1, speed: number = 7){
        // 登場開始位置にショットを移動させる
        this.position = position;
        // ショットのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // スピードを設定する
        this.setSpeed(speed);
        // 攻撃力を設定する
        this.setPower(power);
    }

	/**
	 * ショットのスピードを設定する。
	 * @param speed スピード
	 */
	setSpeed(speed: number) {
		if (!speed && speed > 0) {
			this.speed = speed;
		}
	}

	/**
	 * 攻撃力を設定する。
	 * @param power 攻撃力
	 */
	setPower(power: number) {
		if (!power && power > 0) {
			this.power = power;
		}
	}

	/**
	 * 衝突判定対象を設定する。
	 * @param targets 衝突判定対象
	 */
	setTargets(targets: Array<Character>) {
		if (targets != null && Array.isArray(targets) && targets.length > 0) {
			this.targetArray = targets;
		}
	}

	/**
	 * 爆発エフェクトを設定する。
	 * @param targets 爆発エフェクト
	 */
	setExplosions(targets: Array<Explosion>) {
		if (targets != null && Array.isArray(targets) && targets.length > 0) {
			this.explosionArray = targets;
		}
	}

	/**
	 * キャラクターの状態を更新し、描画を行う。
	 */
	update() {
		if (this.life <= 0) {
			return;
		}

		if (this.position.x + this.width < 0 ||
			this.position.x - this.width > this.ctx.canvas.width ||
			this.position.y + this.height < 0 ||
			this.position.y - this.height > this.ctx.canvas.height) {
			this.life = 0;
		}

		this.position = new Position(
			this.position.x + this.vector.x * this.speed,
			this.position.y + this.vector.y * this.speed);

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
						if (!this.explosionArray[i].getLife()) {
							this.explosionArray[i].set(v.getPosition());
							break;
						}
					}
					if (v instanceof Enemy) {
						const enemy = v as Enemy;
						let score = 100;
						if (enemy.getType() === "large") {
							score = 1000;
						}
						window.gameScore = Math.min(window.gameScore + score, 99999);
					} else if (v instanceof Boss){
						window.gameScore - Math.min(window.gameScore + 15000, 99999)
					}
				}
				this.life = 0;
			}
		});
		this.rotationDraw();
	}
}