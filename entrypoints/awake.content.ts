import { GAME_URL_MATCHER } from "@/utils/const";
import { log } from "@/utils/logger";

/**
 * 画面から離脱した際の音声が停止する処理が実行されないよう、イベントをキャンセルする
 */
export default defineContentScript({
	runAt: "document_start",
	matches: [GAME_URL_MATCHER],
	main() {
		log("Hi, producer!");
		log("Open Picture-in-Picture by clicking the extension icon.");

		document.addEventListener(
			"visibilitychange",
			(e) => e.stopImmediatePropagation(),
			true,
		);
		window.addEventListener("blur", (e) => e.stopImmediatePropagation(), true);
	},
});
