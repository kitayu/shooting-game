/**
 * canvas に関する定数
 */
export const CANVAS = {
	/** canvas の幅 */
	CANVAS_WIDTH: 640,
	/** canvas の高さ */
	CANVAS_HEIGHT: 640
} as const;

/**
 * 敵キャラクターに関する定数
 */
export const ENEMY = {
	/** 敵キャラクター(小)のインスタンス数 */
	ENEMY_SMALL_MAX_COUNT: 20,
	/** 敵キャラクター(大)のインスタンス数 */
	ENEMY_LARGE_MAX_COUNT: 5
}

/**
 * 爆発に関する定数
 */
export const EXPLOSION = {
	/** 爆発エフェクトの最大個数 */
	EXPLOSION_MAX_COUNT: 10
}

/**
 * ショットに関する定数定義
 */
export const SHOT = {
	/** ショット最大個数 */
	SHOT_MAX_COUNT: 10,
	/** 敵キャラクターのショットの最大個数 */
	ENEMY_SHOT_MAX_COUNT: 50,
	/** ボスキャラクターのホーミングショットの最大個数 */
	HOMING_MAX_COUNT: 50
}

/**
 * 背景に関する定数
 */
export const BACKGROUND = {
	/** 背景を流れる星の個数 */
	BACKGROUND_STAR_MAX_COUNT: 100,
	/** 背景を流れる星の最大サイズ */
	BACKGROUND_STAR_MAX_SIZE: 3,
	/** 背景を流れる星の最大速度 */
	BACKGROUND_STAR_MAX_SPEED: 4
}