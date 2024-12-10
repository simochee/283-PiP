import { COMMAND_START_PIP, GAME_URL_MATCHER } from "@/utils/const";
import { browser } from "wxt/browser";

export const createContextMenu = () => {
	browser.runtime.onInstalled.addListener(() => {
		browser.contextMenus.create({
			id: COMMAND_START_PIP,
			title: "Picture-in-Picture で開く",
			contexts: ["all"],
			documentUrlPatterns: [GAME_URL_MATCHER],
		});
	});

	browser.contextMenus.onClicked.addListener((info) => {
		switch (info.menuItemId) {
			case COMMAND_START_PIP: {
				console.log("start pip");
				break;
			}
		}
	});
};
