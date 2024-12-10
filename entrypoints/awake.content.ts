/**
 * 画面から離脱した際の音声が停止する処理が実行されないよう、イベントをキャンセルする
 */
export default defineContentScript({
	runAt: "document_start",
	matches: ["https://shinycolors.enza.fun/*"],
	main() {
		document.addEventListener(
			"visibilitychange",
			(e) => e.stopImmediatePropagation(),
			true,
		);
		window.addEventListener("blur", (e) => e.stopImmediatePropagation(), true);
	},
});
