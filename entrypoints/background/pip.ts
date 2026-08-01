import { browser, type Tabs } from "wxt/browser";

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

			// Canvas と同じアスペクト比 (16:9) になるよう PiP ウィンドウのサイズを計算する
			const aspectRatio =
				canvas.width > 0 && canvas.height > 0
					? canvas.width / canvas.height
					: 16 / 9;
			// 画面の 1/3 程度を目安にしつつ、小さくなりすぎないようにする
			const maxWidth = Math.max(480, Math.round(window.screen.availWidth / 3));
			const maxHeight = Math.max(
				270,
				Math.round(window.screen.availHeight / 3),
			);
			const width = Math.round(Math.min(maxWidth, maxHeight * aspectRatio));
			const height = Math.round(width / aspectRatio);

			// @ts-expect-error documentPictureInPicture is not defined
			const pipWindow = (await documentPictureInPicture.requestWindow({
				width,
				height,
			})) as typeof window;

			// スタイルを指定
			pipWindow.document.body.style.margin = "0";
			pipWindow.document.body.style.backgroundColor = "#252628";
			pipWindow.document.body.style.overflow = "hidden";
			video.style.position = "absolute";
			video.style.width = "100%";
			video.style.height = "100%";
			video.style.objectFit = "contain";

			pipWindow.document.body.appendChild(video);

			/** PiP 内のポインター位置を Document の位置に調整する */
			const adjustClientRect = (clientX: number, clientY: number) => {
				const videoRect = video.getBoundingClientRect();
				const canvasRect = canvas.getBoundingClientRect();

				// object-fit: contain の要素上の位置を計算
				const aspectRatio = canvas.width / canvas.height;
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

				const x = (clientX - left) / width;
				const y = (clientY - top) / height;

				return {
					x: canvasRect.left + canvasRect.width * x,
					y: canvasRect.top + canvasRect.height * y,
				};
			};

			// ポインター・マウスに関連のイベントをゲーム本体へ伝播させる
			const handlePointerEvent = (e: PointerEvent | MouseEvent) => {
				const { x, y } = adjustClientRect(e.clientX, e.clientY);

				// Canvas の座標に変換してイベントを発火
				canvas.dispatchEvent(
					new MouseEvent(e.type, {
						clientX: x,
						clientY: y,
						movementX: e.movementX,
						movementY: e.movementY,
					}),
				);
			};

			for (const type of [
				"pointerdown",
				"pointerup",
				"pointermove",
				"pointercancel",
				"pointerleave",
				"mousedown",
				"mouseup",
				"mousemove",
				"mouseout",
				"mouseover",
			] as const) {
				video.addEventListener(type, handlePointerEvent);
			}

			// ホイールイベントをゲーム本体へ伝播させる
			const handleWheelEvent = (e: WheelEvent) => {
				const { x, y } = adjustClientRect(e.clientX, e.clientY);

				canvas.dispatchEvent(
					new WheelEvent("wheel", {
						clientX: x,
						clientY: y,
						deltaX: e.deltaX,
						deltaY: e.deltaY,
						deltaZ: e.deltaZ,
						deltaMode: e.deltaMode,
					}),
				);
			};

			video.addEventListener("wheel", handleWheelEvent);
		},
	});
};
