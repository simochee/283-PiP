import { GAME_HOME_URL, GAME_ORIGIN, GAME_URL_MATCHER } from "@/utils/const";
import { browser } from "wxt/browser";
import { openPictureInPicture } from "./pip";

export const handleClickIcon = () => {
	browser.action.onClicked.addListener(async (tab) => {
		// 現在のタブが enza であれば Picture-in-Picture を開く
		if (tab.url) {
			const { origin } = new URL(tab.url);

			if (origin === GAME_ORIGIN) {
				await openPictureInPicture(tab);
				return;
			}
		}

		// 開かれているタブに enza があれば、そのタブをアクティブにする
		for (const tab of await browser.tabs.query({ url: GAME_URL_MATCHER })) {
			if (typeof tab.id === "number") {
				await browser.tabs.update(tab.id, { active: true });
				return;
			}
		}

		// 新しいタブで enza を開く
		await browser.tabs.create({ url: GAME_HOME_URL });
	});
};
