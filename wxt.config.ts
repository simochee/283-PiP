import { defineConfig } from "wxt";
import { COMMAND_START_PIP } from "./utils/const";

export default defineConfig({
	manifest: {
		name: "283 PiP",
		version: "1.0.0",
		description:
			"enza 版 アイドルマスター シャイニーカラーズ のゲームプレイ画面を小窓 (Picture-in-Picture) で表示します。",
		permissions: ["action", "contextMenus", "scripting"],
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
