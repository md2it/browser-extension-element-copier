import { ext } from "./api";
import {
  mountCopierContentHotkeys,
  registerCopierStartHotkey,
  unmountCopierContentHotkeys,
} from "./hotkeys";
import { registerDocumentOperabilityProbeListener } from "../../lib/src/page-operability";
import { bootstrapPanelPopupPageIfNeeded } from "./panel-popup/page";
import { bootstrapPanelTabPageIfNeeded } from "./panel-tab";
import {
  CopierPickUI,
  notifyElementPicked,
  PICK_ROOT_ID,
} from "./pick-mode";
import type {
  BgToContent,
  ContentActivationResponse,
  ContentToBg,
} from "./messages";

type ContentState = {
  active: boolean;
  pick: CopierPickUI | null;
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
    window.__ecState = { active: false, pick: null };
  }
  return window.__ecState;
}

function resetState(state: ContentState): void {
  if (state.active) {
    state.pick?.deactivate();
  }
  unmountCopierContentHotkeys();
  state.active = false;
  state.pick = null;
  document.getElementById(PICK_ROOT_ID)?.remove();
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
    unmountCopierContentHotkeys();
    state.pick?.deactivate();
    notifyBackgroundActive(false);
  };

  const ensurePick = (): CopierPickUI => {
    if (state.pick) return state.pick;
    state.pick = new CopierPickUI((element) => notifyElementPicked(element));
    return state.pick;
  };

  const hotkeysHost = {
    isActive: () => state.active,
    deactivate,
  };

  const activate = (): boolean => {
    if (state.active) return true;
    if (typeof window !== "undefined" && window.top !== window) return false;

    try {
      const pick = ensurePick();
      state.active = true;
      mountCopierContentHotkeys(hotkeysHost);
      pick.activate();
      const ok = document.getElementById(PICK_ROOT_ID)?.isConnected === true;
      if (!ok) {
        deactivate();
        return false;
      }
      notifyBackgroundActive(true);
      return true;
    } catch {
      deactivate();
      return false;
    }
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
registerDocumentOperabilityProbeListener();
attachMessageHandler(state);
registerCopierStartHotkey(requestToggle);

void bootstrapPanelTabPageIfNeeded();
void bootstrapPanelPopupPageIfNeeded();
