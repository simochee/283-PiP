import { browser } from "wxt/browser";
import { openPictureInPicture } from "./pip";

export const handleCommand = () => {
	browser.commands.onCommand.addListener(async (command, tab) => {
		switch (command) {
			case COMMAND_START_PIP: {
				await openPictureInPicture(tab);
				break;
			}
		}
	});
};
