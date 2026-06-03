import { COPIER_ACTIVE_COLOR } from "../brand.js";
import { createToggleCommandSuppressTracker } from "../../lib/our/hotkeys/suppress.js";
import { getStartHotkeyEnabled } from "./settings.js";
import { registerPrefixBackgroundHotkeys } from "../../lib/our/hotkeys/prefix-background.js";

var toggleCommandSuppress = createToggleCommandSuppressTracker();

function shouldSuppressToolbarClickAfterHotkeyCommand(now = Date.now()) {
  return toggleCommandSuppress.shouldSuppressToolbarClick(now);
}

function registerBackgroundHotkeys(host) {
  registerPrefixBackgroundHotkeys({
    badgeBackgroundColor: COPIER_ACTIVE_COLOR,
    getActiveCommandTab: host.getActiveCommandTab,
    isToggleEnabled: getStartHotkeyEnabled,
    toggleRequestMessageType: "TOGGLE_REQUEST",
    onToggleRequest: (tabId, windowId) => host.toggleTab(tabId, windowId, void 0, "hotkey"),
    suppress: toggleCommandSuppress
  });
}

export { registerBackgroundHotkeys, shouldSuppressToolbarClickAfterHotkeyCommand, toggleCommandSuppress };
