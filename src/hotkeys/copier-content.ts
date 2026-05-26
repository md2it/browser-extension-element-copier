import {
  registerPrefixStartHotkey,
  type PrefixModeController,
} from "../../../lib/src/hotkeys";
import { PREFIX_ACTION_KEY } from "./commands";
import { getStartHotkeyEnabled } from "./settings";

const HOTKEY_NAMESPACE = "elementCopier";

let prefixController: PrefixModeController | undefined;

/** Ctrl/Cmd+Shift+X → C page fallback (top frame only). */
export function registerCopierStartHotkey(requestToggle: () => void): void {
  prefixController = registerPrefixStartHotkey({
    namespace: HOTKEY_NAMESPACE,
    hintLetter: PREFIX_ACTION_KEY,
    isEnabled: getStartHotkeyEnabled,
    onAction: requestToggle,
  });
}

/** Wait for prefix release, then arm (manifest chord). */
export function armCopierPrefixToggle(hint = PREFIX_ACTION_KEY): void {
  prefixController?.prepareAwaitAction(hint);
}
