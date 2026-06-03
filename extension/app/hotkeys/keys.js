import { PREFIX_ACTION_KEY } from "./commands.js";
import { isEscapeKeyEvent } from "../../lib/our/hotkeys/keys.js";

var ABOUT_PREFIX_CHORD_WIN_DISPLAY = "Ctrl+Shift+X";

var ABOUT_PREFIX_CHORD_MAC_DISPLAY = "Cmd+Shift+X";

function getStartHotkeyActionLabel() {
  return PREFIX_ACTION_KEY.toUpperCase();
}

function isEscHotkeyEvent(e) {
  return isEscapeKeyEvent(e);
}

export { ABOUT_PREFIX_CHORD_MAC_DISPLAY, ABOUT_PREFIX_CHORD_WIN_DISPLAY, getStartHotkeyActionLabel, isEscHotkeyEvent };
