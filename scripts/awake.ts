/** @file タブがバックグラウンドに移っても音声を止めさせないためにイベントを無効化する */
import * as logger from "./logger";

logger.log("Hi, producer!");
logger.log("Open Picture-in-Picture by clicking the extension icon.");

document.addEventListener(
  "visibilitychange",
  (e) => e.stopImmediatePropagation(),
  true
);
window.addEventListener("blur", (e) => e.stopImmediatePropagation(), true);
