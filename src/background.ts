import { ext } from "./api";
import { COPIER_ACTIVE_COLOR } from "./brand";
import {
  bootstrapToolbarIcons,
  getTabActiveState,
  onContentActiveChanged,
  registerExtensionIconStateListeners,
  setTabActiveState,
  syncIconForTab,
} from "./extension-icon-state";
import type { BgToContent, ContentActivationResponse, ContentToBg } from "./messages";
import {
  canOperateOnTab,
  getRestrictedNoticeDismissMs,
  isBlockedNoticeDismissedMessage,
  refreshRestrictedNoticeCache,
  showRestrictedNotice,
} from "./page-operability";
import { openPanelFromSender, openStartPanelFromToolbar } from "./panel-popup";
import { ensureLocaleInStorage } from "./storage";
import { showWelcome, stopWelcomePinWatcher, watchWelcomePinStatus } from "./welcome";

const TOGGLE_DEBOUNCE_MS = 80;
let lastToggleTabId: number | undefined;
let lastToggleAt = 0;

const BADGE_TEXT_COLOR = "#ffffff";
const BADGE_RUNNING_TEXT = "✓";
const BADGE_BLOCKED_TEXT = "✕";

const tabBlockedBadge = new Map<number, boolean>();
const blockedBadgeClearTimers = new Map<number, ReturnType<typeof setTimeout>>();

function clearBlockedBadgeTimer(tabId: number): void {
  const timer = blockedBadgeClearTimers.get(tabId);
  if (timer === undefined) return;
  clearTimeout(timer);
  blockedBadgeClearTimers.delete(tabId);
}

function clearBlockedBadgeState(tabId: number): void {
  clearBlockedBadgeTimer(tabId);
  tabBlockedBadge.set(tabId, false);
}

function onBlockedNoticeDismissed(tabId: number): void {
  if (!tabBlockedBadge.get(tabId)) return;
  clearBlockedBadgeState(tabId);
  void syncToolbarBadge(tabId);
}

function scheduleClearBlockedBadge(tabId: number, dismissMs: number): void {
  clearBlockedBadgeTimer(tabId);
  blockedBadgeClearTimers.set(
    tabId,
    setTimeout(() => {
      blockedBadgeClearTimers.delete(tabId);
      if (!tabBlockedBadge.get(tabId)) return;
      clearBlockedBadgeState(tabId);
      void syncToolbarBadge(tabId);
    }, dismissMs),
  );
}

async function showBlockedPageFeedback(
  tabId: number,
  windowId?: number,
): Promise<void> {
  tabBlockedBadge.set(tabId, true);
  await syncToolbarBadge(tabId);
  const dismissMs = await getRestrictedNoticeDismissMs();
  await showRestrictedNotice(tabId, windowId);
  scheduleClearBlockedBadge(tabId, dismissMs);
}

async function setToolbarBadge(tabId: number, text: string): Promise<void> {
  try {
    if (text) {
      await ext.action.setBadgeBackgroundColor({ tabId, color: COPIER_ACTIVE_COLOR });
      const setBadgeTextColor = (
        ext.action as typeof ext.action & {
          setBadgeTextColor?: (details: { tabId: number; color: string }) => Promise<void>;
        }
      ).setBadgeTextColor;
      await setBadgeTextColor?.({ tabId, color: BADGE_TEXT_COLOR });
    }
    await ext.action.setBadgeText({ tabId, text });
  } catch (err) {
    console.warn("[Element Copier] setBadgeText failed:", err);
  }
}

async function syncToolbarBadge(tabId: number): Promise<void> {
  if (tabBlockedBadge.get(tabId)) {
    await setToolbarBadge(tabId, BADGE_BLOCKED_TEXT);
    return;
  }

  if (getTabActiveState(tabId)) {
    await setToolbarBadge(tabId, BADGE_RUNNING_TEXT);
    return;
  }

  await setToolbarBadge(tabId, "");
}

async function injectContent(tabId: number, frameId?: number): Promise<boolean> {
  try {
    const target =
      frameId !== undefined && frameId !== 0
        ? { tabId, frameIds: [frameId] }
        : { tabId, allFrames: true };
    await ext.scripting.executeScript({
      target,
      files: ["content.js"],
    });
    return true;
  } catch (err) {
    console.warn("[Element Copier] injectContent failed:", err);
    return false;
  }
}

function isActivationSuccess(
  message: BgToContent,
  response: unknown,
): boolean {
  if (message.type === "SET_ACTIVE" && message.active) {
    return (response as ContentActivationResponse | undefined)?.ok === true;
  }
  return true;
}

async function sendToTab(
  tabId: number,
  message: BgToContent,
  frameId?: number,
): Promise<boolean> {
  try {
    const response =
      frameId !== undefined && frameId !== 0
        ? await ext.tabs.sendMessage(tabId, message, { frameId })
        : await ext.tabs.sendMessage(tabId, message);
    return isActivationSuccess(message, response);
  } catch (err) {
    console.warn("[Element Copier] sendToTab failed:", err);
    return false;
  }
}

async function sendWithInject(
  tabId: number,
  message: BgToContent,
  frameId?: number,
): Promise<boolean> {
  if (await sendToTab(tabId, message, frameId)) return true;
  if (!(await injectContent(tabId, frameId))) return false;
  return sendToTab(tabId, message, frameId);
}

async function setTabActive(
  tabId: number,
  active: boolean,
  windowId?: number,
): Promise<void> {
  if (active && !(await canOperateOnTab(tabId))) {
    setTabActiveState(tabId, false);
    await syncIconForTab(tabId);
    await showBlockedPageFeedback(tabId, windowId);
    return;
  }

  const reached = active
    ? await sendWithInject(tabId, { type: "SET_ACTIVE", active: true })
    : await sendToTab(tabId, { type: "SET_ACTIVE", active: false });

  if (active && !reached) {
    setTabActiveState(tabId, false);
    await syncIconForTab(tabId);
    await sendToTab(tabId, { type: "SET_ACTIVE", active: false });
    await showBlockedPageFeedback(tabId, windowId);
    return;
  }

  if (active && reached) {
    clearBlockedBadgeState(tabId);
  }

  if (!active) {
    clearBlockedBadgeState(tabId);
  }

  await syncToolbarBadge(tabId);
}

async function deactivateTab(tabId: number, windowId?: number): Promise<void> {
  if (!getTabActiveState(tabId)) return;

  setTabActiveState(tabId, false);
  clearBlockedBadgeState(tabId);
  await syncIconForTab(tabId);
  await syncToolbarBadge(tabId);
  await setTabActive(tabId, false, windowId);
}

async function handleToolbarClick(tabId: number, windowId?: number): Promise<void> {
  const now = Date.now();
  if (tabId === lastToggleTabId && now - lastToggleAt < TOGGLE_DEBOUNCE_MS) {
    return;
  }
  lastToggleTabId = tabId;
  lastToggleAt = now;

  if (getTabActiveState(tabId)) {
    await deactivateTab(tabId, windowId);
    return;
  }

  openStartPanelFromToolbar({ id: tabId, windowId } as chrome.tabs.Tab);
}

ext.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) return;
  void handleToolbarClick(tab.id, tab.windowId);
});

ext.runtime.onMessage.addListener(
  (message: ContentToBg | unknown, sender): boolean | void => {
    if (isBlockedNoticeDismissedMessage(message)) {
      onBlockedNoticeDismissed(message.tabId);
      return;
    }
    const contentMessage = message as ContentToBg;
    if (contentMessage.type === "ACTIVE_CHANGED" && sender.tab?.id !== undefined) {
      const tabId = sender.tab.id;
      onContentActiveChanged(tabId, contentMessage.active);
      if (!contentMessage.active) {
        clearBlockedBadgeState(tabId);
      }
      void syncToolbarBadge(tabId);
    }
    if (contentMessage.type === "OPEN_PANEL") {
      void (async () => {
        const tabId = sender.tab?.id;
        if (tabId !== undefined && getTabActiveState(tabId)) {
          await deactivateTab(tabId, sender.tab?.windowId);
        }
        openPanelFromSender(contentMessage.tab, sender.tab);
      })();
    }
    if (contentMessage.type === "WATCH_PIN_STATUS" && sender.tab?.id !== undefined) {
      watchWelcomePinStatus(sender.tab.id);
    }
  },
);

ext.tabs.onRemoved.addListener((tabId) => {
  clearBlockedBadgeTimer(tabId);
  tabBlockedBadge.delete(tabId);
  stopWelcomePinWatcher(tabId);
});

registerExtensionIconStateListeners();

ext.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.notificationSeconds || changes.locale) {
    void refreshRestrictedNoticeCache();
  }
});

const onBootstrap = async (): Promise<void> => {
  await ensureLocaleInStorage();
  await refreshRestrictedNoticeCache();
  await bootstrapToolbarIcons();
};

void ext.runtime.onInstalled.addListener((details) => {
  void onBootstrap();
  if (details.reason === "install") {
    void showWelcome();
  }
});

void ext.runtime.onStartup.addListener(() => {
  void onBootstrap();
});

void onBootstrap();
