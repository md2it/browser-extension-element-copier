import {
  ESCAPE_KEY_LABEL,
  formatPrefixChordLabel,
  isEditableKeyboardTarget,
  isEscapeKeyEvent,
  isPrefixChordKeyEvent,
} from "../../../lib/src/hotkeys";
import { PREFIX_ACTION_KEY } from "./commands";

export const ESC_HOTKEY_LABEL = ESCAPE_KEY_LABEL;

/** Prefix chord for settings (`kbd` before `→`). */
export function getStartHotkeyChordLabel(): string {
  return formatPrefixChordLabel();
}

/** Action letter for settings (`kbd` after `→`). */
export function getStartHotkeyActionLabel(): string {
  return PREFIX_ACTION_KEY.toUpperCase();
}

/** Full label for aria (chord + arrow + letter, no markup). */
export function getStartHotkeyAriaLabel(): string {
  return `${getStartHotkeyChordLabel()} → ${getStartHotkeyActionLabel()}`;
}

/** Ctrl/Cmd+Shift+X — prefix chord (page fallback). */
export function isStartHotkeyEvent(e: KeyboardEvent): boolean {
  return isPrefixChordKeyEvent(e);
}

/** Escape — exit copy mode (content listener, no manifest suggested_key). */
export function isEscHotkeyEvent(e: KeyboardEvent): boolean {
  return isEscapeKeyEvent(e);
}

export { isEditableKeyboardTarget };
