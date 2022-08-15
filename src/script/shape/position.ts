export class Position {
	readonly x: number;
	readonly y: number;

	/**
	 * @constructor
	 * @param x X座標
	 * @param y Y座標
	 */
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * X座標を設定する。
	 * @param x X座標
	 */
	setX(x: number): Position {
		if (x == null) {
			return new Position(x, this.y);
		} else {
			return this;
		}
	}

	/**
	 * Y座標を設定する。
	 * @param y Y座標
	 */
	setY(y: number): Position {
		if (y == null) {
			return new Position(this.x, y);
		} else {
			return this;
		}
	}

	/**
	 * 対象のPositionとの距離を返す。
	 * @param target 対象のPosition
	 * @returns 距離
	 */
	distance(target: Position): number {
		const x = this.x - target.x;
		const y = this.y - target.y;
		return Position.calcLength(x, y);
	}

	/**
	 * 対象のPositionとの外積を計算する。
	 * @param target 対象のPosition
	 * @returns 
	 */
	cross(target: Position): number {
		return this.x * target.y - this.y * target.x;
	}

	/**
	 * 自身を単位化したベクトルを計算する。
	 * @returns 単位化したベクトル
	 */
	normalize(): Position {
		return Position.calcNormal(this.x, this.y);
	}

	/**
	 * 指定された radian 分だけ回転させる
	 * @param radian 回転量
	 * @throws Will throw an error if the argument is null.
	 * @returns 指定された radian 分だけ回転させた座標
	 */
	rotate(radian: number): Position {
		if (radian == null) {
			throw new Error("radian is null");
		}
		const s = Math.sin(radian);
		const c = Math.cos(radian);

		const x = this.x * c + this.y * -s;
		const y = this.x * s + this.y * c;
		return new Position(x, y);
	}

	/**
	 * ベクトルの長さを返す。
	 * @param x X座標
	 * @param y Y座標
	 * @returns ベクトルの長さ
	 * @throws Will throw an error if the argument is null.
	 */
	static calcLength(x: number, y: number) {
		if (x == null) {
			throw new Error("x is null.");
		}

		if (y == null) {
			throw new Error("y is null.");
		}
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * ベクトルを単位化する。
	 * @param x X座標
	 * @param y Y座標
	 * @returns ベクトルを単位化した結果
	 * @throws Will throw an error if the argument is null.
	 */
	static calcNormal(x: number, y: number): Position {
		if (x == null) {
			throw new Error("x is null.");
		}

		if (y == null) {
			throw new Error("y is null.");
		}
		let l = Position.calcLength(x, y);
		return new Position(x / l, y / l);
	}
}