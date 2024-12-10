import { COMMAND_START_PIP, GAME_URL_MATCHER } from "@/utils/const";
import { browser } from "wxt/browser";
import { openPictureInPicture } from "./pip";

export const createContextMenu = () => {
	browser.runtime.onInstalled.addListener(() => {
		browser.contextMenus.create({
			id: COMMAND_START_PIP,
			title: "Picture-in-Picture で開く",
			contexts: ["all"],
			documentUrlPatterns: [GAME_URL_MATCHER],
		});
	});

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		switch (info.menuItemId) {
			case COMMAND_START_PIP: {
				await openPictureInPicture(tab);
				break;
			}
		}
	});
};
