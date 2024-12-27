import { createAlbumLinks } from "./albumLinks";
import { handleClickIcon } from "./browserAction";
import { handleCommand } from "./command";
import { createContextMenu } from "./contextMenu";

export default defineBackground({
	type: "module",
	main() {
		createContextMenu();
		createAlbumLinks();
		handleCommand();
		handleClickIcon();
	},
});
