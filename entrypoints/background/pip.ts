import { type Tabs, browser } from "wxt/browser";

export const openPictureInPicture = async (tab: Tabs.Tab | undefined) => {
	if (!tab || tab.id == null || tab.url == null) return;

	await browser.scripting.executeScript({
		target: { tabId: tab.id, allFrames: true },
		func: async () => {
			const canvas = document.querySelector("canvas");

			if (!(canvas instanceof HTMLCanvasElement)) {
				throw new Error("canvas element not found");
			}

			// video タグに Canvas のストリームを流し込む
			const video = document.createElement("video");
			video.muted = true;
			video.srcObject = canvas.captureStream();
			video.play();

			// Document Picture-in-Picture API に対応していない場合は video 要素を Picture-in-Picture で開く
			// @ts-expect-error documentPictureInPicture is not defined
			if (typeof documentPictureInPicture === "undefined") {
				await video.requestPictureInPicture();
				return;
			}

			// @ts-expect-error documentPictureInPicture is not defined
			const pipWindow = (await documentPictureInPicture.requestWindow({
				width: 360,
				height: 270,
			})) as typeof window;

			// スタイルを指定
			pipWindow.document.body.style.margin = "0";
			pipWindow.document.body.style.backgroundColor = "#252628";
			video.style.position = "absolute";
			video.style.width = "100%";
			video.style.height = "100%";
			video.style.objectFit = "contain";

			pipWindow.document.body.appendChild(video);

			const handlePointerEvent = (e: PointerEvent) => {
				const videoRect = video.getBoundingClientRect();
				const canvasRect = canvas.getBoundingClientRect();

				// object-fit: contain の要素上の位置を計算
				const aspectRatio = 16 / 9;
				const width =
					videoRect.width / videoRect.height > aspectRatio
						? videoRect.height * aspectRatio
						: videoRect.width;
				const height =
					videoRect.width / videoRect.height > aspectRatio
						? videoRect.height
						: videoRect.width / aspectRatio;
				const top = videoRect.top + (videoRect.height - height) / 2;
				const left = videoRect.left + (videoRect.width - width) / 2;

				const x = (e.clientX - left) / width;
				const y = (e.clientY - top) / height;

				// Canvas の座標に変換してイベントを発火
				canvas.dispatchEvent(
					new MouseEvent(e.type, {
						clientX: canvasRect.left + canvasRect.width * x,
						clientY: canvasRect.top + canvasRect.height * y,
					}),
				);
			};

			video.addEventListener("pointerdown", handlePointerEvent);
			video.addEventListener("pointerup", handlePointerEvent);
		},
	});
};
