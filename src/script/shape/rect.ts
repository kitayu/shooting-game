import { Position } from "./position";

/**
 * 短形。
 */
export interface Rect {
	/** 短形の左上角の Position */
	position: Position;
	/** 短形の横幅 */
	width: number;
	/** 短形の高さ */
	height: number;
	/** 短形を塗り潰す際の色(指定されなかった場合は塗り潰さない) */
	color?: string;
}