const COMMAND_PREFIX = "open-link";
const QUICK_LINKS = [
	{ name: "プロデュース", path: "/produceReady" },
	{ name: "マッチライブ", path: "/matchLiveTop" },
	{ name: "フェス", path: "/fesTop" },
	{ name: "ガシャ", path: "/gasha" },
	{ name: "アイドル", path: "/idolPortal" },
	{ name: "Pデスク", path: "/producerDesk" },
	{ name: "ミニゲーム", path: "/miniGamePortal" },
	{ name: "ミッション", path: "/mission" },
	{ name: "営業", path: "/workActivity" },
	{ name: "プレゼント", path: "/present" },
	{ name: "ショップ", path: "/shop" },
	{ name: "4コマ漫画", path: "/comic" },
];

export const createQuickLinks = () => {
	browser.runtime.onInstalled.addListener(() => {
		browser.contextMenus.create({
			id: COMMAND_PREFIX,
			title: "クイックリンク",
			contexts: ["all"],
			documentUrlPatterns: [GAME_URL_MATCHER],
		});

		QUICK_LINKS.forEach(({ name }, index) => {
			browser.contextMenus.create({
				parentId: COMMAND_PREFIX,
				id: `${COMMAND_PREFIX}_${index}`,
				title: name,
				contexts: ["all"],
			});
		});
	});

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		if (typeof info.menuItemId !== "string") return;

		const gameTab = await findGameTab(tab);

		const [command, index] = info.menuItemId.split("_");

		if (command !== COMMAND_PREFIX) return;

		const link = QUICK_LINKS[Number.parseInt(index, 10)];

		if (link) {
			await openUrl(new URL(link.path, GAME_ORIGIN), gameTab);
		}
	});
};
