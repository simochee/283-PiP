/**
 * ゲーム画面の Canvas を Picture-in-Picture で表示する Video 要素にストリーミングさせる
 */
export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://shinycolors.enza.fun/*"],
	main() {
		const video = document.createElement("video");

		// setup
		video.id = "__283player";
		video.muted = true;

		if (document.getElementById(video.id)) {
			throw new Error("video element already exists");
		}

		// hide
		video.style.position = "absolute";
		video.style.width = "0";
		video.style.height = "0";

		// append
		document.body.appendChild(video);

		// capture canvas
		const canvas = document.querySelector("canvas");

		video.srcObject = canvas?.captureStream() ?? null;
		video.play();
	},
});
