import { Position } from "./position";

/**
 * テキスト。
 */
export interface Text {
	/** テキスト */
	text: string;
	/** テキストを描画する際の色 */
	color?: string;
	/** テキストを描画する座標 */
	position: Position;
	/** テキストを描画する幅 */
	width: number;
}