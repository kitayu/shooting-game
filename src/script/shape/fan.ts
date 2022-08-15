import { Position } from "./position";

/**
 * 扇型。
 */
export interface Fun {
	/** 扇型を形成する円の中心位置 */
	position: Position;
	/** 扇型の円の半径 */
	radius: number;
	/** 扇型の開始角 */
	startRadian: number;
	/** 扇型の終了角 */
	endRadian: number;
	/** 扇型を描画する際の色 */
	color?: string; 
}