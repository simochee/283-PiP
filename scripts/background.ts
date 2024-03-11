/** @file コンテキストメニューの挙動をインストールする */
import browser from "webextension-polyfill";
import { TARGET_MATCHER, MENU_ITEM_ID, OPEN_PINP_COMMAND, ENZA_ORIGIN, ENZA_HOME_URL } from "./const";

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
const browserAction = browser.action ? browser.action : browser.browserAction;

browserAction.onClicked.addListener(async (tab) => {
  // 現在のタブが enza であれば Picture-in-Picture を開く
  if (tab.url) {
    const url = new URL(tab.url);

    if (url.origin === ENZA_ORIGIN) {
      await openPictureInPicture(tab);
      return;
    }
  }

  // 開かれているタブに enza があれば、そのタブを開く
  const tabs = await browser.tabs.query({ url: TARGET_MATCHER });

  for (const tab of tabs) {
    if (typeof tab.id === "number") {
      await browser.tabs.update(tab.id, { active: true });
      return;
    }
  }

  // 新しいタブでシャニマスのホームを開く
  await browser.tabs.create({ url: ENZA_HOME_URL });
});

// コマンド（ショートカット）から Picture-in-Picture を開く
browser.commands.onCommand.addListener(async (command, tab) => {
  switch (command) {
    case OPEN_PINP_COMMAND:
      await openPictureInPicture(tab);
  }
});
