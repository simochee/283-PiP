import { GAME_URL_MATCHER } from "@/utils/const";
import { findGameTab, openUrl } from "@/utils/tab";
import { browser } from "wxt/browser";

const COMMAND_PREFIX = "open-album";
const COMMAND_ALBUM = `${COMMAND_PREFIX}_0`;
const IDOL_ALBUMS = [
	{
		id: "1",
		unit: "イルミネーションスターズ",
		idols: [
			{ id: "1", name: "櫻木真乃" },
			{ id: "2", name: "風野灯織" },
			{ id: "3", name: "八宮めぐる" },
		],
	},
	{
		id: "2",
		unit: "アンティーカ",
		idols: [
			{ id: "4", name: "月岡恋鐘" },
			{ id: "5", name: "田中摩美々" },
			{ id: "6", name: "白瀬咲耶" },
			{ id: "7", name: "三峰結華" },
			{ id: "8", name: "幽谷霧子" },
		],
	},
	{
		id: "3",
		unit: "放課後クライマックスガールズ",
		idols: [
			{ id: "9", name: "小宮果穂" },
			{ id: "10", name: "園田智代子" },
			{ id: "11", name: "西城樹里" },
			{ id: "12", name: "杜野凛世" },
			{ id: "13", name: "有栖川夏葉" },
		],
	},
	{
		id: "4",
		unit: "アルストロメリア",
		idols: [
			{ id: "14", name: "大崎甘奈" },
			{ id: "15", name: "大橋甜花" },
			{ id: "16", name: "桑山千雪" },
		],
	},
	{
		id: "5",
		unit: "ストレイライト",
		idols: [
			{ id: "17", name: "芹沢あさひ" },
			{ id: "18", name: "黛冬優子" },
			{ id: "19", name: "和泉愛依" },
		],
	},
	{
		id: "6",
		unit: "ノクチル",
		idols: [
			{ id: "20", name: "朝倉透" },
			{ id: "21", name: "樋口円香" },
			{ id: "22", name: "福丸小糸" },
			{ id: "23", name: "市川雛菜" },
		],
	},
	{
		id: "7",
		unit: "シーズ",
		idols: [
			{ id: "24", name: "七草にちか" },
			{ id: "25", name: "緋田美琴" },
		],
	},
	{
		id: "8",
		unit: "コメティック",
		idols: [
			{ id: "26", name: "斑鳩ルカ" },
			{ id: "27", name: "鈴木羽那" },
			{ id: "28", name: "郁田はるき" },
		],
	},
	{
		id: "800",
		unit: "【推しの子】コラボ",
		idols: [
			{ id: "801", name: "ルビー" },
			{ id: "802", name: "有馬かな" },
			{ id: "803", name: "MEMちょ" },
			{ id: "804", name: "黒川あかね" },
		],
	},
];

export const createAlbumLinks = () => {
	browser.runtime.onInstalled.addListener(() => {
		browser.contextMenus.create({
			id: COMMAND_PREFIX,
			title: "アルバムを開く",
			contexts: ["all"],
			documentUrlPatterns: [GAME_URL_MATCHER],
		});

		browser.contextMenus.create({
			parentId: COMMAND_PREFIX,
			id: COMMAND_ALBUM,
			title: "イベント / スペシャル",
			contexts: ["all"],
			documentUrlPatterns: [GAME_URL_MATCHER],
		});

		for (const { id: unitId, unit, idols } of IDOL_ALBUMS) {
			browser.contextMenus.create({
				parentId: COMMAND_PREFIX,
				id: `${COMMAND_PREFIX}_${unitId}`,
				title: unit,
				contexts: ["all"],
				documentUrlPatterns: [GAME_URL_MATCHER],
			});

			for (const { id: idolId, name } of idols) {
				browser.contextMenus.create({
					parentId: `${COMMAND_PREFIX}_${unitId}`,
					id: `${COMMAND_PREFIX}_${unitId}_${idolId}`,
					title: name,
					contexts: ["all"],
					documentUrlPatterns: [GAME_URL_MATCHER],
				});
			}
		}
	});

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		if (typeof info.menuItemId !== "string") return;

		const gameTab = await findGameTab(tab);

		if (info.menuItemId === COMMAND_ALBUM) {
			await openUrl(new URL("/album", GAME_ORIGIN), gameTab);
			return;
		}

		const [, unitId, idolId] = info.menuItemId.split("_");

		// アルバム以外のコマンドのため無視
		if (
			!(
				info.menuItemId.startsWith(COMMAND_PREFIX) &&
				/^\d+$/.test(unitId) &&
				/^\d+$/.test(idolId)
			)
		) {
			return;
		}

		// アイドルアルバムへ
		await openUrl(new URL(`/idolAlbum/${idolId}`, GAME_ORIGIN), gameTab);
	});
};
