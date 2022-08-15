/**
 * 多角形。
 */
export interface Polygon {
	/** 多角形の角頂点の座標 */
	points: Array<number>;
	/** 多角形を描画する際の色 */
	color?: string;
}