import { handleClickIcon } from "./browserAction";
import { handleCommand } from "./command";
import { createContextMenu } from "./contextMenu";

export default defineBackground({
	type: "module",
	main() {
		createContextMenu();
		handleCommand();
		handleClickIcon();
	},
});
