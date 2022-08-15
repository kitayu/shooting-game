import { Line } from "./line";
import { Position } from "./position";

/**
 * 3次ぺジェ曲線。
 */
export interface CubicBezier extends Line {
	/** 始点の制御座標 */
	startControllPosition: Position;
	/** 終点の制御座標 */
	endControllPosition: Position;
}