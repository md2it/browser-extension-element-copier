import {
  formatPrefixChordLabel,
  isEditableKeyboardTarget,
  isPrefixChordKeyEvent,
} from "../../../lib/src/hotkeys";
import { PREFIX_ACTION_KEY } from "./commands";

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

export { isEditableKeyboardTarget };
