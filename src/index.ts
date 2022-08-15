import { Canvas2DUtility } from "./script/canvas2d";
import { BackgroundStar } from "./script/caracter/backgroundstart";
import { CANVAS, SHOT, ENEMY, BACKGROUND } from "./script/constants";
import { SceneManager } from "./script/scene/scenemanager";
import { Position } from "./script/shape/position";
import "./css/style.css";
import { Characters } from "./script/caracter/characters";

declare global {
	interface Window {
		/**
		 * キーの押下状態を調べるためのオブジェクト。
		 * このオブジェクトはプロジェクトのどこからでも参照できるように
		 * window オブジェクトのカスタムプロパティとして設定する
		 */
		isKeyDown: Map<string, boolean>;
		/**
		 * スコアを格納する。
		 * このオブジェクトはプロジェクトのどこからでも参照できるように
		 * windowオブジェクトのカスタムプロパティとして設定する
		 */
		gameScore: number;
	}
}
(() => {

	window.isKeyDown = new Map<string, boolean>();

	window.gameScore = 0;

	/**
	 * Canvas2D API のコンテキスト。
	 */
	var ctx: CanvasRenderingContext2D;

	/**
	 * Canvas2D API をラップしたユーティリティクラス。
	 */
	var util: Canvas2DUtility;

	/**
	 * 描画対象となる Canvas Element。
	 */
	var canvas: HTMLCanvasElement;

	/**
	 * 再スタートするためのフラグ。
	 */
	var restart: boolean = false;

	/**
	 * 実行開始時のタイムスタンプ。
	 */
	var startTime: number = 0;

	/**
	 * シーンマネージャー。
	 */
	var sceneManager: SceneManager;

	/**
	 * ゲームに登場するキャラクターたちを保持します。
	 */
	var characters: Characters;

	/**
	 * 流れる星のインスタンスを格納する配列。
	 */
	var backgroundStarArray: Array<BackgroundStar> = [];

	/**
	 * ページロード完了時に実行されるロードイベント。
	 */
	window.addEventListener("load", () => {
		window.isKeyDown = new Map<string, boolean>();
		util = new Canvas2DUtility(document.body.querySelector("#main_canvas") as HTMLCanvasElement);
		canvas = util.canvas;
		if (util.context) {
			ctx = util.context;
		} else {
			throw new Error("util.context is null.");
		}
		canvas.width = CANVAS.CANVAS_WIDTH;
		canvas.height = CANVAS.CANVAS_WIDTH;

		const button = document.body.querySelector("#start_button") as HTMLButtonElement;

		button.addEventListener("click", () => {
			button.disabled = true;
			initialize();
			loadCheck();
		}, false);
	}, false);

	/**
	 * canvas や contextを初期化する。
	 */
	function initialize() {
		sceneManager = new SceneManager();
		// キャラクターの生成
		characters = new Characters(ctx);

		// 背景の星
		for (var i = 0; i < BACKGROUND.BACKGROUND_STAR_MAX_COUNT; i++) {
			let size = 1 + Math.random() * (BACKGROUND.BACKGROUND_STAR_MAX_SIZE - 1);
			let speed = 1 + Math.random() * (BACKGROUND.BACKGROUND_STAR_MAX_SPEED - 1);
			backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);
			let x = Math.random() * CANVAS.CANVAS_WIDTH;
			let y = Math.random() * CANVAS.CANVAS_HEIGHT;
			backgroundStarArray[i].set(new Position(x, y));
		}
	}

	/**
     * インスタンスの準備が完了しているか確認する。
     */
	function loadCheck() {
		var ready = characters.loadCheck();
		if (ready === true) {
			eventSetting();
			sceneSetting();
			startTime = Date.now();
			render();
		} else {
			setTimeout(loadCheck, 100);
		}
	}
	/**
	 * イベントを設定する
	 */
	function eventSetting() {
		window.addEventListener("keydown", (event) => {
			window.isKeyDown.set(`key_${event.key}`, true);
			if (event.key === "Enter") {
				if (characters.getViper().getLife() <= 0) {
					restart = true;
				}
			}
		}, false);

		window.addEventListener("keyup", (event) => {
			window.isKeyDown.set(`key_${event.key}`, false);
		}, false);
	}

	/**
	 * シーンを設定する
	 */
	function sceneSetting() {
		sceneManager.add("intro", (time: number) => {
			if (time > 3.0) {
				sceneManager.use("invade_default_type");
			}
		});

		sceneManager.add("invade_default_type", (time: number) => {
			if (sceneManager.getFrame() % 30 === 0) {
				for (var i = 0; i < ENEMY.ENEMY_SMALL_MAX_COUNT; i++) {
					if (characters.getEnemyArray()[i].getLife() <= 0) {
						let e = characters.getEnemyArray()[i];
						if (sceneManager.getFrame() % 60 === 0) {
							e.set(new Position(-e.getWidth(), 30), 2, "default");
							e.setVectorFromAngle(degressToRadians(30));
						} else {
							e.set(new Position(CANVAS.CANVAS_WIDTH + e.getWidth(), -e.getHeight()), 2, "default");
							e.setVector(new Position(degressToRadians(150), 0));
						}
						break;
					}
				}
			}

			if (sceneManager.getFrame() === 270) {
				sceneManager.use("blank");
			}

			if (characters.getViper().getLife() <= 0) {
				sceneManager.use("gameover");
			}
		});

		sceneManager.add("blank", (time: number) => {
			if (sceneManager.getFrame() === 150) {
				sceneManager.use("invade_wave_move_type");
			}

			if (characters.getViper().getLife() <= 0) {
				sceneManager.use("gameover");
			}
		});

		sceneManager.add("invade_wave_move_type", (time: number) => {
			if (sceneManager.getFrame() % 50 === 0) {
				for (let i = 0; i < ENEMY.ENEMY_SMALL_MAX_COUNT; i++) {
					if (characters.getEnemyArray()[i].getLife() <= 0) {
						let e = characters.getEnemyArray()[i];
						if (sceneManager.getFrame() <= 200) {
							e.set(new Position(CANVAS.CANVAS_WIDTH * 0.2, -e.getHeight()), 2, "wave");
						} else {
							e.set(new Position(CANVAS.CANVAS_WIDTH * 0.8, -e.getHeight()), 2, "wave");
						}
						break;
					}
				}
			}

			if (sceneManager.getFrame() === 450) {
				sceneManager.use("invade_large_type");
			}

			if (characters.getViper().getLife() <= 0) {
				sceneManager.use("gameover");
			}
		});

		sceneManager.add("invade_large_type", (time: number) => {
			if (sceneManager.getFrame() % 100 === 0) {
				var i = ENEMY.ENEMY_SMALL_MAX_COUNT + ENEMY.ENEMY_LARGE_MAX_COUNT;
				for (var j = ENEMY.ENEMY_SMALL_MAX_COUNT; j < i; j++) {
					if (characters.getEnemyArray()[j].getLife() <= 0) {
						let e = characters.getEnemyArray()[j];
						e.set(new Position(CANVAS.CANVAS_WIDTH / 2, -e.getHeight()), 50, "large");
						break;
					}
				}
			}

			if (sceneManager.getFrame() === 500) {
				sceneManager.use("invade_boss");
			}

			if (characters.getViper().getLife() <= 0) {
				sceneManager.use("gameover");
			}
		});

		sceneManager.add("invade_boss", (time: number) => {
			var boss = characters.getBoss();
			if (sceneManager.getFrame() === 0) {
				boss.set(new Position(CANVAS.CANVAS_WIDTH / 2, -boss.getHeight()), 250);
				boss.setMode("invade");
			}

			if (characters.getViper().getLife() <= 0) {
				sceneManager.use("gameover");
				boss.setMode("escape");
			}

			if (boss.getLife() <= 0) {
				sceneManager.use("intro");
			}
		});

		sceneManager.add("gameover", (time: number) => {
			var textWidth = CANVAS.CANVAS_WIDTH / 2;
			var loopWidth = CANVAS.CANVAS_WIDTH + textWidth;
			var x = CANVAS.CANVAS_WIDTH - (sceneManager.getFrame() * 2) % loopWidth;

			ctx.font = "bold 72px sans-serif";
			util.drawText({
				text: "GAME OVER",
				position: new Position(x, CANVAS.CANVAS_HEIGHT / 2),
				color: '#ff0000',
				width: textWidth
			});

			if (restart === true) {
				restart = false;
				window.gameScore = 0;
				characters.getViper().setComing(
					new Position(CANVAS.CANVAS_WIDTH / 2,CANVAS.CANVAS_HEIGHT + 50),
					new Position(CANVAS.CANVAS_WIDTH / 2, CANVAS.CANVAS_HEIGHT - 100));
				sceneManager.use("intro");
			}
		});

		sceneManager.use("intro");
	}

	/**
	 * 描画を行う。
	 */
	function render() {
		ctx.globalAlpha = 1.0;
		util.drawRect({
			position:new Position(0, 0),
			width: canvas.width,
			height: canvas.height,
			color: "#111122"});

		ctx.font = 'bold 24px monospace';
		util.drawText({
			text: zeroPadding(window.gameScore, 5),
			position: new Position(30, 50),
			color: '#ffffff',
			width: 100
		});

		sceneManager.update();

		// バックグラウンド(流れ星)
		backgroundStarArray.map((v) => {
			v.update();
		});

		characters.update();

		requestAnimationFrame(render);
	}

	/**
	 * 度数法の角度からラジアンを生成する
	 * @param {number} degress - 度数法の度数
	 * @returns ラジアン
	 */
	function degressToRadians(degress: number): number {
		return degress * Math.PI / 180;
	}

	/**
	 * 特定の範囲におけるランダムな整数の値を生成する
	 * @param range 乱数を生成する範囲 (0 以上 〜 range 未満) 
	 * @returns ランダムな整数の値
	 */
	function generateRandomInt(range: number): number {
		return Math.floor(Math.random() * range);
	}

	/**
	 * 数値の不足した桁数をゼロで埋めた文字列を返す
	 * @param number 数値
	 * @param count 桁数(2桁以上)
	 * @returns ゼロで埋めた文字列
	 */
	function zeroPadding(number: number, count: number): string {
		let zeroArray = new Array(count);
		let zeroString = zeroArray.join('0') + number;
		return zeroString.slice(-count);
	}
})();