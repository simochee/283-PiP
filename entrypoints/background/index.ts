import { createAlbumLinks } from "./albumLinks";
import { handleClickIcon } from "./browserAction";
import { handleCommand } from "./command";
import { createContextMenu } from "./contextMenu";
import { createQuickLinks } from "./quickLinks";

export default defineBackground({
	type: "module",
	main() {
		createContextMenu();
		createQuickLinks();
		createAlbumLinks();
		handleCommand();
		handleClickIcon();
	},
});
