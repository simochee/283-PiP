import { GAME_ORIGIN } from "@/utils/const";
import { type Tabs, browser } from "wxt/browser";

export const findGameTab = async (tab: Tabs.Tab | undefined) => {
	// 現在のタブがゲーム画面である
	if (tab?.url) {
		const { origin } = new URL(tab.url);

		if (origin === GAME_ORIGIN) {
			return tab;
		}
	}

	// 開かれているタブにゲーム画面がある
	for (const tab of await browser.tabs.query({ url: GAME_URL_MATCHER })) {
		if (typeof tab.id === "number") {
			return tab;
		}
	}
};

export const openUrl = async (url: string | URL, tab: Tabs.Tab | undefined) => {
	const href = typeof url === "string" ? url : url.href;

	if (tab) {
		await browser.tabs.update(tab.id, { url: href, active: true });
	} else {
		await browser.tabs.create({ url: href, active: true });
	}
};
