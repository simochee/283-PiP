import { browser } from "wxt/browser";

export const handleCommand = () => {
	browser.commands.onCommand.addListener((command) => {
		switch (command) {
			case COMMAND_START_PIP: {
				console.log("start pip");
				break;
			}
		}
	});
};
