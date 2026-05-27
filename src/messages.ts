import type { PrefixHintContentToBg } from "../../lib/src/hotkeys/prefix-hint-messages";

export type BgToContent = { type: "SET_ACTIVE"; active: boolean };

export type ContentToBg =
  | { type: "ACTIVE_CHANGED"; active: boolean }
  | { type: "OPEN_PANEL"; tab: "start" }
  | { type: "WATCH_PIN_STATUS" }
  | { type: "TOGGLE_REQUEST" }
  | PrefixHintContentToBg;

export type BgToWelcome = { type: "PIN_STATUS_CHANGED"; pinned: boolean };

export type ContentActivationResponse = { ok: boolean };

export const STORAGE_KEY = "notificationSeconds";
export const LOCALE_STORAGE_KEY = "locale";
export const LOCALE_USER_SELECTED_KEY = "localeUserSelected";
export const LOCALE_DETECT_VERSION_KEY = "localeDetectVersion";
export const LOCALE_DETECT_VERSION = 1;
export const START_HOTKEY_ENABLED_KEY = "startHotkeyEnabled";
export const DEFAULT_NOTIFICATION_SECONDS = 4;
