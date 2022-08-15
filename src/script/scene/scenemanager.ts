export class SceneManager {
	private scene: Map<string, Function>;
	private activeScene: Function;
	private startTime: number;
	private frame: number;

	/**
	 * コンストラクタ。
	 */
	constructor() {
		this.scene = new Map<string, Function>();

		this.activeScene = () => {};
		this.startTime = 0;
		this.frame = 0;
	}

	/**
	 * シーンを追加する。
	 * @param name シーンの名前
	 * @param updateFunction シーン中の処理
	 */
	add(name: string, updateFunction: Function) {
		this.scene.set(name, updateFunction);
	}

	/**
	 * アクティブにするシーンの名前を設定する。
	 * @param name アクティブにするシーン
	 */
	use(name: string) {
		const scene = this.scene.get(name);
		if (!scene) {
			return;
		}

		this.activeScene = scene;
		this.startTime = Date.now();
		this.frame = -1;
	}

	/**
	 * 
	 * @returns 
	 */
	getFrame(): number {
		return this.frame;
	}

	/**
	 * シーンを更新する。
	 */
	update() {
		const activeTime = (Date.now() - this.startTime) / 1000;
		this.activeScene(activeTime);
		++this.frame;
	}
}