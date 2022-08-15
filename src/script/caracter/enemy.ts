import { Position } from "../shape/position";
import { Character } from "./character";
import { Shot } from "./shot";

export class Enemy extends Character {

	protected type: string;
	protected frame: number;
	protected speed: number;
	protected shotArray: Array<Shot>;
	protected attackTarget?: Character;
	
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
		imagePath: string) {
		super(ctx, position, width, height, 0, imagePath);

		this.type = "default";
		this.frame = 0;
		this.speed = 3;
		this.shotArray = [];
	}

	/**
	 * 敵を配置する。
	 * @param position 配置する座標
	 * @param life 設定するライフ
	 * @param type 設定する的のタイプ
	 */
	set(position: Position, life: number = 1, type: string = "default") {
		this.position = position;
		this.life = life;
		this.type = type;
		this.frame = 0;
	}

	/**
	 * ショットを設定する。
	 * @param shotArray ショット
	 */
	setShotArray(shotArray: Array<Shot>) {
		this.shotArray = shotArray;
	}

	/**
	 * 攻撃対象を設定する。
	 * @param target 攻撃対象
	 */
	setAttackTarget(target: Character) {
		this.attackTarget = target;
	}

	getType(): string {
		return this.type;
	}
	/**
	 * キャラクターの状態を更新し描画を行う。
	 */
	update() {
		if (this.life <= 0) {
			return;
		}

		var x, y = 0;
		switch (this.type) {
			case "wave":
				if (this.frame % 60 === 0) {
					const tx = this.attackTarget!.getPosition().x - this.position.x;
					const ty = this.attackTarget!.getPosition().y - this.position.y;
					const tv = Position.calcNormal(tx, ty);
					this.fire(tv, 4.0);
				}

				x = this.position.x + Math.sin(this.frame / 10);
				y = this.position.y + 2.0;
				this.position = new Position(x, y);
				break;
			case "large":
				if (this.frame % 50 === 0) {
					for (var i = 0; i < 360; i += 45) {
						const r = i * Math.PI / 180;
						const s = Math.sin(r);
						const c = Math.cos(r);
						const vector = new Position(c, s);
						this.fire(vector, 3.0);
					}
				}

				x = this.position.x + Math.sin((this.frame + 90) / 50) * 2.0;
				y = this.position.y + 1.0;
				this.position = new Position(x, y);
				break;
			default:
				if (this.frame === 100) {
					this.fire();
				}

				x = this.position.x + this.vector.x * this.speed;
				y = this.position.y + this.vector.y * this.speed;

				this.position = new Position(x, y);
				break;
		}
		if (this.position.y - this.height > this.ctx.canvas.height) {
			this.life = 0;
		}

		this.draw();
		this.frame++;
	}

	/**
	 * 自身から指定された方向にショットを放つ
	 * @param position 進行方向ベクトル(x=0.0, y=1.0)
	 * @param speed ショットのスピード(default=5.0)
	 */
	fire(position: Position = new Position(0.0, 1.0), speed: number = 5.0) {
		for (let i = 0; i < this.shotArray.length; i++) {
			if (this.shotArray[i].getLife() <= 0) {
				this.shotArray[i].set(new Position(this.position.x, this.position.y), 1, speed);
				this.shotArray[i].setVector(position);
				break;
			}
		}
	}
}