import { Position } from "../shape/position";
import { Viper } from "./viper";
import { Boss } from "./boss";
import { Shot } from "./shot";
import { Explosion } from "./explosion";
import { Enemy } from "./enemy";
import { HomingShot } from "./homingshot";
import { CANVAS, ENEMY, EXPLOSION, SHOT } from "../constants";

import viper_img from "../../assets/viper.png";
import boss_img from "../../assets/boss.png";
import viper_shot_img from "../../assets/viper_shot.png";
import viper_single_shot_img from "../../assets/viper_single_shot.png";
import enemy_shot_img from "../../assets/enemy_shot.png";
import enemy_large_img from "../../assets/enemy_large.png";
import enemy_small_img from "../../assets/enemy_small.png";
import homing_shot_img from "../../assets/homing_shot.png";

/**
 * ゲームに登場するキャラクター達。
 */
export class Characters {
	/** 自機キャラクター。 */
	private viper: Viper;

	/** ボスキャラクター。 */
	private boss: Boss;

	/** 敵キャラクターのインスタンス配列。 */
	private enemyArray: Array<Enemy> = [];

	/** ショットのインスタンス配列。 */
	private shotArray: Array<Shot> = [];

	/** シングルショットのインスタンス配列。 */
	private singleShotArray: Array<Shot> = [];

	/** 敵キャラクターのショットのインスタンス配列。 */
	private enemyShotArray: Array<Shot> = [];

	/** ボスキャラクターのホーミングショットインスタンス配列。 */
	private homingArray: Array<HomingShot> = [];

	/** 爆発エフェクトのインスタンスを格納する配列。 */
	private explosionArray: Array<Explosion> = [];

	/**
	 * コンストラクタ。
	 * @param ctx Canvas2D API のコンテキスト
	 */
	constructor(ctx: CanvasRenderingContext2D) {
		// 爆発エフェクトの初期化
		for (var i = 0; i < EXPLOSION.EXPLOSION_MAX_COUNT; i++) {
			this.explosionArray[i] = new Explosion(ctx, 100.0, 15, 40.0, 1.0);
		}

		this.viper = new Viper(ctx, new Position(0, 0), 64, 64, viper_img);
		// 登場シーンのための設定
		this.viper.setComing(
			new Position(CANVAS.CANVAS_WIDTH / 2, CANVAS.CANVAS_HEIGHT + 50),
			new Position(CANVAS.CANVAS_WIDTH / 2, CANVAS.CANVAS_HEIGHT - 100)
		);

		this.viper.setShotArray(this.shotArray, this.singleShotArray);
		
		this.boss = new Boss(ctx, new Position(0, 0), 128, 128, boss_img);
		this.boss.setShotArray(this.enemyShotArray);
		this.boss.setHomingArray(this.homingArray);
		this.boss.setAttackTarget(this.viper);


		// 敵キャラクター(小)
		for (var i = 0; i < ENEMY.ENEMY_SMALL_MAX_COUNT; i++) {
			this.enemyArray[i] = new Enemy(ctx, new Position(0, 0), 48, 48, enemy_small_img);
			this.enemyArray[i].setShotArray(this.getEnemyShotArray());
			this.enemyArray[i].setAttackTarget(this.viper);
		}

		// 敵キャラクター(大)
		for (var i = 0; i < ENEMY.ENEMY_LARGE_MAX_COUNT; i++) {
			this.enemyArray[ENEMY.ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, new Position(0, 0), 64, 64, enemy_large_img);
			this.enemyArray[ENEMY.ENEMY_SMALL_MAX_COUNT + i].setShotArray(this.getEnemyShotArray());
			this.enemyArray[ENEMY.ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(this.viper);
		}

		// 自キャラクターのショットを初期化
		for (var i = 0; i < SHOT.SHOT_MAX_COUNT; i++) {
			this.shotArray[i] = new Shot(ctx, new Position(0, 0), 32, 32, viper_shot_img);
			this.singleShotArray[i * 2] = new Shot(ctx, new Position(0, 0), 32, 32, viper_single_shot_img);
			this.singleShotArray[i * 2 + 1] = new Shot(ctx, new Position(0, 0), 32, 32, viper_single_shot_img);
		}

		// 敵キャラクターのショットを初期化
		for (var i = 0; i < SHOT.ENEMY_SHOT_MAX_COUNT; i++) {
			this.enemyShotArray[i] = new Shot(ctx, new Position(0, 0), 32, 32, enemy_shot_img);
			this.enemyShotArray[i].setTargets([this.viper]);
			this.enemyShotArray[i].setExplosions(this.explosionArray);
		}

		// ボスキャラのホーミングショット
		for (i = 0; i < SHOT.HOMING_MAX_COUNT; i++) {
			this.homingArray[i] = new HomingShot(ctx, new Position(0, 0), 32, 32, homing_shot_img);
			this.homingArray[i].setTargets([this.viper]);
			this.homingArray[i].setExplosions(this.explosionArray);
		}

		// ボスキャラクターを衝突判定対象にする
		let concatEnemyArray = this.enemyArray.concat([this.boss]);

		// 衝突判定
		for (var i = 0; i < SHOT.SHOT_MAX_COUNT; i++) {
			this.shotArray[i].setTargets(concatEnemyArray);
			this.shotArray[i].setExplosions(this.explosionArray);
			this.singleShotArray[i * 2].setTargets(concatEnemyArray);
			this.singleShotArray[i * 2].setExplosions(this.explosionArray);
			this.singleShotArray[i * 2 + 1].setTargets(concatEnemyArray);
			this.singleShotArray[i * 2 + 1].setExplosions(this.explosionArray);
		}		
	}

	/**
	 * 爆発エフェクトのインスタンス配列を取得します。
	 * @returns 爆発エフェクトのインスタンス配列
	 */
	getExplosionArray(): Array<Explosion> {
		return this.explosionArray;
	}

	/**
	 * 自機キャラクターを取得します。
	 * @returns 自機キャラクター
	 */
	getViper(): Viper {
		return this.viper;
	}

	/**
	 * ボスキャラクターを取得します。
	 * @returns ボスキャラクター
	 */
	getBoss(): Boss {
		return this.boss;
	}

	/**
	 * 敵キャラクターのインスタンス配列
	 * @returns 敵キャラクターのインスタンス配列
	 */
	getEnemyArray(): Array<Enemy> {
		return this.enemyArray;
	}

	/**
	 * ショットのインスタンス配列を取得します。
	 * @returns ショットのインスタンス配列
	 */
	getShotArray(): Array<Shot> {
		return this.shotArray;
	}

	/**
	 * シングルショットのインスタンス配列を取得します。
	 * @returns シングルショットのインスタンス配列
	 */
	getSingleShotArray(): Array<Shot> {
		return this.singleShotArray;
	}

	/**
	 * 敵キャラクターのショットインスタンス配列を取得します。
	 * @returns 敵キャラクターのショットインスタンス配列
	 */
	getEnemyShotArray(): Array<Shot> {
		return this.enemyShotArray;
	}

	/**
	 * ボスキャラクターのホーミングショットインスタンス配列を取得します。
	 * @returns ボスキャラクターのホーミングショットインスタンス配列
	 */
	getHomingArray(): Array<HomingShot> {
		return this.homingArray;
	}

	loadCheck(): boolean {
		let ready = true;
		ready = ready && this.viper.isReady();

		this.shotArray.map((v) => {
			ready = ready && v.isReady();
		});

		this.singleShotArray.map((v) => {
			ready = ready && v.isReady();
		});

		this.enemyArray.map((v) => {
			ready = ready && v.isReady();
		});

		this.enemyShotArray.map((v) => {
			ready = ready && v.isReady();
		});

		this.homingArray.map((v) => {
			ready = ready && v.isReady();
		});

		return ready;
	}

	/**
	 * 各キャラクターの状態を更新します。
	 */
	update() {
		// 自機キャラクター
		this.viper.update();
		// ボスキャラクター
		this.boss.update();
		// 敵キャラクター
		this.enemyArray.map((v) => {
			v.update();
		});
		// ショット
		this.shotArray.map((v) => {
			v.update();
		});
		this.singleShotArray.map((v) => {
			v.update();
		});
		// 敵キャラクターショット
		this.enemyShotArray.map((v) => {
			v.update();
		});
		// ボスキャラクターホーミングショット
		this.homingArray.map((v) => {
			v.update();
		});
		// 爆発エフェクト
		this.explosionArray.map((v) => {
			v.update();
		});
	}
}