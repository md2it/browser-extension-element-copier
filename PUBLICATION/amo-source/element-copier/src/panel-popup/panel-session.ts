let panelSessionActive = false;

/** Background opens a panel popup/tab — next close should run cleanup once. */
export function markPanelSessionOpened(): void {
  panelSessionActive = true;
}

/** Returns true the first time per open panel session. */
export function consumePanelSessionClose(): boolean {
  if (!panelSessionActive) return false;
  panelSessionActive = false;
  return true;
}
