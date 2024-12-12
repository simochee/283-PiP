import { defineConfig } from "wxt";
import pkg from "./package.json" assert { type: "json" };
import { COMMAND_START_PIP, GAME_URL_MATCHER } from "./utils/const";

export default defineConfig({
	manifest: {
		name: "283 PiP",
		version: pkg.version,
		description:
			"enza 版 アイドルマスター シャイニーカラーズ のゲームプレイ画面を小窓 (Picture-in-Picture) で表示します。",
		permissions: ["contextMenus", "scripting"],
		host_permissions: [GAME_URL_MATCHER],
		action: {},
		commands: {
			[COMMAND_START_PIP]: {
				suggested_key: {
					default: "Alt+P",
				},
				description: "Picture-in-Picture で開く",
			},
		},
	},
	runner: {
		startUrls: ["https://shinycolors.enza.fun"],
	},
});
