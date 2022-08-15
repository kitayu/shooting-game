import { Line } from "./line";
import { Position } from "./position";

/**
 * 2次ペジェ曲線。
 */
export interface QuadraticBezier extends Line {
	/** 制御点座標 */
	controllPosition: Position;
}