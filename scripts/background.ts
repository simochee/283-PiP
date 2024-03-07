/** @file コンテキストメニューの挙動をインストールする */
import browser from "webextension-polyfill";
import { TARGET_MATCHER, MENU_ITEM_ID, OPEN_PINP_COMMAND } from "./const";

/**
 * Picture-in-Picture を開く
 */
const openPictureInPicture = async (tab: browser.Tabs.Tab | undefined) => {
  if (!tab || tab.id == null || tab.url == null) return;

  await browser.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: () => {
      const video = document.getElementById("__283player");

      if (video instanceof HTMLVideoElement) {
        video.requestPictureInPicture();
      }
    },
  });
};

// コンテキストメニューをインストール
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU_ITEM_ID,
    title: "Picture-in-Picture で開く",
    contexts: ["all"],
    documentUrlPatterns: [TARGET_MATCHER],
  });
});

// コンテキストメニューから Picture-in-Picture を開く
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ITEM_ID) return;

  await openPictureInPicture(tab);
});

// 拡張機能アイコンから Picture-in-Picture を開く
browser.action.onClicked.addListener(async (tab) => {
  await openPictureInPicture(tab);
});

// コマンド（ショートカット）から Picture-in-Picture を開く
browser.commands.onCommand.addListener(async (command, tab) => {
  switch (command) {
    case OPEN_PINP_COMMAND:
      await openPictureInPicture(tab);
  }
});
