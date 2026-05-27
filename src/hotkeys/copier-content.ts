import {
  notifyPrefixHintBlockedOnBackground,
  queryPrefixHintCanShowInContent,
  registerPrefixStartHotkey,
} from "../../../lib/src/hotkeys";
import { PREFIX_ACTION_KEY } from "./commands";
import { getStartHotkeyEnabled } from "./settings";

const HOTKEY_NAMESPACE = "elementCopier";

/** Ctrl/Cmd+Shift+X → C (top frame; no manifest suggested_key). */
export function registerCopierStartHotkey(requestToggle: () => void): void {
  registerPrefixStartHotkey({
    namespace: HOTKEY_NAMESPACE,
    hintLetter: PREFIX_ACTION_KEY,
    isEnabled: getStartHotkeyEnabled,
    canShowPrefixHint: queryPrefixHintCanShowInContent,
    onPrefixHintBlocked: notifyPrefixHintBlockedOnBackground,
    onAction: requestToggle,
  });
}
