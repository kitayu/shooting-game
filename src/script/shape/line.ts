import { Position } from "./position"

/**
 * 線分。
 */
export interface Line {
	/** 始点の Position。 */
	startPosition: Position;
	/** 終点の Position。 */
	endPosition: Position;
	/** 描画する色。 */
	color?: string;
	/** 線幅 */
	width: number;
}