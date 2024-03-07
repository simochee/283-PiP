import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import { OPEN_PINP_COMMAND, TARGET_MATCHER } from "./scripts/const";
import browser from "webextension-polyfill";

type WebExtensionManifest = Omit<
  browser.Manifest.WebExtensionManifest,
  "manifest_version" | "action" | "browser_action"
> & {
  "{{chrome}}.manifest_version": 3;
  "{{firefox}}.manifest_version": 2;
  "{{chrome}}.action"?: browser.Manifest.ActionManifest;
  "{{firefox}}.browser_action"?: browser.Manifest.ActionManifest;
};

const { VERSION = "0.0.0", TARGET = "chrome" } = process.env;

if (!/^\d+\.\d+\.\d+$/.test(VERSION)) {
  throw new Error(`Invalid version format: ${VERSION}`);
}

export default defineConfig({
  plugins: [
    webExtension({
      disableAutoLaunch: true,
      browser: TARGET,
      manifest(): WebExtensionManifest {
        return {
          "{{chrome}}.manifest_version": 3,
          "{{firefox}}.manifest_version": 2,
          name: "283 PinP",
          version: VERSION,
          icons: {
            32: "icon/32.png",
            48: "icon/48.png",
            96: "icon/96.png",
            128: "icon/128.png",
          },
          permissions: ["contextMenus", "scripting"],
          host_permissions: [TARGET_MATCHER],
          "{{chrome}}.action": {},
          "{{firefox}}.browser_action": {},
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
          background: {
            type: "module",
            service_worker: "scripts/background.ts",
          },
        };
      },
    }),
  ],
});
