/** enza のオリジン */
export const ENZA_ORIGIN = "https://shinycolors.enza.fun";

/** ホストとして認識させるマッチパターン */
export const TARGET_MATCHER = new URL("*", ENZA_ORIGIN).href;

/** enza のホーム URL */
export const ENZA_HOME_URL = new URL('home', ENZA_ORIGIN).href;

/** コンテキストメニューのアイテムID */
export const MENU_ITEM_ID = "open-pinp";

/** コマンドのキー */
export const OPEN_PINP_COMMAND = "open-pinp";
