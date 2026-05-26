import { ext } from "./api";
import {
  armCopierPrefixToggle,
  registerCopierStartHotkey,
} from "./hotkeys";
import { bootstrapPanelPopupPageIfNeeded } from "./panel-popup/page";
import { bootstrapPanelTabPageIfNeeded } from "./panel-tab";
import type {
  BgToContent,
  ContentActivationResponse,
  ContentToBg,
} from "./messages";

type ContentState = {
  active: boolean;
};

declare global {
  interface Window {
    __ecRuntimeId?: string;
    __ecMessageHandler?: (
      message: BgToContent,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: ContentActivationResponse) => void,
    ) => boolean | void;
    __ecState?: ContentState;
  }
}

function getState(): ContentState {
  if (!window.__ecState) {
    window.__ecState = { active: false };
  }
  return window.__ecState;
}

function resetState(state: ContentState): void {
  state.active = false;
}

function notifyBackgroundActive(isActive: boolean): void {
  const msg: ContentToBg = { type: "ACTIVE_CHANGED", active: isActive };
  void ext.runtime.sendMessage(msg).catch(() => {
    /* extension reloaded */
  });
}

function requestToggle(): void {
  const msg: ContentToBg = { type: "TOGGLE_REQUEST" };
  void ext.runtime.sendMessage(msg).catch(() => {
    /* extension reloaded */
  });
}

function attachMessageHandler(state: ContentState): void {
  const prev = window.__ecMessageHandler;
  if (prev) {
    try {
      ext.runtime.onMessage.removeListener(prev);
    } catch {
      /* previous extension instance */
    }
  }

  const deactivate = (): void => {
    if (!state.active) return;
    state.active = false;
    notifyBackgroundActive(false);
  };

  const activate = (): boolean => {
    if (state.active) return true;
    state.active = true;
    notifyBackgroundActive(true);
    return true;
  };

  const handler = (
    message: BgToContent,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ContentActivationResponse) => void,
  ): boolean | void => {
    if (message.type === "SET_ACTIVE") {
      if (message.active) {
        sendResponse({ ok: activate() });
        return;
      }
      deactivate();
      return;
    }
    if (message.type === "PREFIX_ARM_TOGGLE") {
      armCopierPrefixToggle(message.hint);
    }
  };

  window.__ecMessageHandler = handler;
  ext.runtime.onMessage.addListener(handler);
}

const state = getState();
const runtimeId = ext.runtime.id;

if (window.__ecRuntimeId !== undefined && window.__ecRuntimeId !== runtimeId) {
  resetState(state);
}

window.__ecRuntimeId = runtimeId;
attachMessageHandler(state);
registerCopierStartHotkey(requestToggle);

void bootstrapPanelTabPageIfNeeded();
void bootstrapPanelPopupPageIfNeeded();
