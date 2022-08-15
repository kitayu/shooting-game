import { Position } from "../shape/position";
import { Character } from "./character";
import { Enemy } from "./enemy";
import { HomingShot } from "./homingshot";
import { Shot } from "./shot";

export class Boss extends Enemy {
	/** 自身のモード */
	private mode: string;

	/** 自身が持つホーミングショットインスタンスの配列 */
	private homingArray: Array<HomingShot>;

	/**
	 * @constructor
	 * @param ctx 描画などに利用する2Dコンテキスト
	 * @param position 座標
	 * @param width 幅
	 * @param height 高さ
	 * @param imagePath キャラクター用の画像のパス 
	 */
	constructor(
		ctx:CanvasRenderingContext2D,
		position: Position,
		width: number,
		height: number,
		imagePath: string) {
		super(ctx, position, width, height, imagePath);
	
			this.mode = '';
	
			this.frame = 0;
	
			this.speed = 3;
	
			this.shotArray = [];
	
			this.homingArray = [];
		}
	
		/**
		 * ボスを配置する。
		 * @param position 配置する座標
		 * @param life 設定するライフ
		 */
		 set(position: Position, life: number = 1){
			// 登場開始位置にボスキャラクターを移動させる
			this.position = position;
			// ボスキャラクターのライフを 0 より大きい値（生存の状態）に設定する
			this.life = life;
			// ボスキャラクターのフレームをリセットする
			this.frame = 0;
		}
	
		/**
		 * ショットを設定する。
		 * @param shotArray 自身に設定するショットの配列
		 */
		 setShotArray(shotArray: Array<Shot>){
			// 自身のプロパティに設定する
			this.shotArray = shotArray;
		}
	
		/**
		 * モードを設定する。
		 * @param mode 自身に設定するモード
		 */
		setMode(mode: string) {
			this.mode = mode;
		}
	
		/**
		 * 攻撃対象を設定する。
		 * @param target 自身が攻撃対象とするインスタンス
		 */
		setAttackTarget(target: Character){
			// 自身のプロパティに設定する
			this.attackTarget = target;
		}
		/**
		 * ホーミングショットを設定する。
		 * @param homingArray 自身に設定するホーミングショットの配列
		 */
		setHomingArray(homingArray: Array<HomingShot>) {
			this.homingArray = homingArray;
		}
	
		/**
		 * キャラクターの状態を更新し、描画を行う
		 */
		update() {
			if (this.life <= 0) {
				return;
			}
	
			switch (this.mode) {
				case 'invade':
					this.position = new Position(this.position.x, this.position.y + this.speed);
					if (this.position.y > 100) {
						this.position = new Position(this.position.x, 100);
						this.mode = 'floating';
						this.frame = 0;
					}
					break;
				case 'escape':
					this.position = new Position(this.position.x, this.position.y - this.speed);
					if (this.position.y < -this.height) {
						this.life = 0;
					}
					break;
				case 'floating':
					if (this.frame % 1000 < 500) {
						if (this.frame % 200 > 140 && this.frame % 10 === 0) {
							let tx = this.attackTarget!.getPosition().x - this.position.x;
							let ty = this.attackTarget!.getPosition().y - this.position.y;
	
							let tv = Position.calcNormal(tx, ty);
							this.fire(tv, 3.0);
						}
					} else {
						if (this.frame % 50 === 0) {
							this.homingFire(new Position(0, 1), 3.5);
						}
					}
	
					this.position = new Position(this.position.x + Math.cos(this.frame / 100) * 2.0, this.position.y);
					break;
				default:
					break;
			}
	
			this.draw();
			++this.frame;
		}
	
		/**
		 * 自身から指定された方向にショットを放つ
		 * @param position 進行方向ベクトル(default: new Position(0.0, 1.0))
		 * @param speed ショットのスピード(default: 5.0)
		 */
		 fire(position: Position = new Position(0.0, 1.0), speed = 5.0){
			// ショットの生存を確認し非生存のものがあれば生成する
			for(let i = 0; i < this.shotArray.length; i++){
				// 非生存かどうかを確認する
				if(this.shotArray[i].getLife() <= 0){
					// ボスキャラクターの座標にショットを生成する
					this.shotArray[i].set(new Position(this.position.x, this.position.y), 1, speed);
					// ショットのスピードを設定する
					this.shotArray[i].setSpeed(speed);
					// ショットの進行方向を設定する（真下）
					this.shotArray[i].setVector(position);
					// ひとつ生成したらループを抜ける
					break;
				}
			}
		}
	
		/**
		 * 自身から指定された方向にホーミングショットを放つ。
		 * @param position 進行方向ベクトル(default: new Position(0,0, 1.0))
		 * @param speed - ショットのスピード(deafult: 3.0)
		 */
		homingFire(position: Position = new Position(0.0, 1.0), speed: number = 3.0){
			// ショットの生存を確認し非生存のものがあれば生成する
			for(let i = 0; i < this.homingArray.length; i++){
				// 非生存かどうかを確認する
				if(this.homingArray[i].getLife() <= 0){
					// ボスキャラクターの座標にショットを生成する
					this.homingArray[i].set(new Position(this.position.x, this.position.y), 1, speed);
					// ショットのライフを設定する
					this.homingArray[i].setLife(1);
					// ショットの進行方向を設定する（真下）
					this.homingArray[i].setVector(position);
					// ひとつ生成したらループを抜ける
					break;
				}
			}
		}
}