import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import { OPEN_PINP_COMMAND, TARGET_MATCHER } from "./scripts/const";
import browser from "webextension-polyfill";

const { VERSION = "0.0.0", TARGET = "chrome", NODE_ENV } = process.env;

if (!/^\d+\.\d+\.\d+$/.test(VERSION)) {
  throw new Error(`Invalid version format: ${VERSION}`);
}

const isDev = NODE_ENV === "development";
const name = isDev ? "283 PinP - preview" : "283 PinP";

const manifest = {
  name,
  version: VERSION,
  description:
    "enza 版 アイドルマスター シャイニーカラーズのゲームプレイ画面を小窓（ Picture-in-Picture ）で開きます。",
  icons: {
    32: "icon/32.png",
    48: "icon/48.png",
    96: "icon/96.png",
    128: "icon/128.png",
  },
  permissions: ["contextMenus", "scripting"],
  commands: {
    [OPEN_PINP_COMMAND]: {
      suggested_key: {
        default: "Alt+P",
      },
      description: "Picture-in-Picture で開く",
    },
  },
  content_scripts: [
    {
      run_at: "document_start",
      matches: [TARGET_MATCHER],
      js: ["scripts/awake.ts"],
    },
    {
      run_at: "document_idle",
      matches: [TARGET_MATCHER],
      js: ["scripts/stream.ts"],
    },
  ],
} satisfies Partial<browser.Manifest.WebExtensionManifest>;

export default defineConfig({
  plugins: [
    webExtension({
      disableAutoLaunch: true,
      browser: TARGET,
      manifest(): browser.Manifest.WebExtensionManifest {
        switch (TARGET) {
          case "firefox":
            return {
              ...manifest,
              manifest_version: 2,
              browser_action: {},
              background: {
                scripts: ["scripts/background.ts"],
              },
            };
          default:
            return {
              ...manifest,
              manifest_version: 3,
              host_permissions: [TARGET_MATCHER],
              action: {},
              background: {
                type: "module",
                service_worker: "scripts/background.ts",
              },
            };
        }
      },
    }),
  ],
});
