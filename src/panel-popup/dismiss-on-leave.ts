import { PANEL_POPUP_DISMISS_DELAY_MS } from "./constants";

export type DismissOnLeaveHandle = {
  unbind: () => void;
};

/** Dismiss after pointer left the panel for 1s; ignore leave until first enter. */
export function bindDismissOnLeave(
  panel: HTMLElement,
  onDismiss: () => void,
): DismissOnLeaveHandle {
  let hasEntered = false;
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  const clearDismissTimer = (): void => {
    if (dismissTimer === null) return;
    clearTimeout(dismissTimer);
    dismissTimer = null;
  };

  const onEnter = (): void => {
    hasEntered = true;
    clearDismissTimer();
  };

  const onLeave = (): void => {
    if (!hasEntered) return;
    clearDismissTimer();
    dismissTimer = setTimeout(() => {
      dismissTimer = null;
      onDismiss();
    }, PANEL_POPUP_DISMISS_DELAY_MS);
  };

  panel.addEventListener("mouseenter", onEnter);
  panel.addEventListener("mouseleave", onLeave);

  return {
    unbind: () => {
      panel.removeEventListener("mouseenter", onEnter);
      panel.removeEventListener("mouseleave", onLeave);
      clearDismissTimer();
    },
  };
}
