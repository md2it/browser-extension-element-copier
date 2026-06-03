var panelSessionActive = false;

function markPanelSessionOpened() {
  panelSessionActive = true;
}

function consumePanelSessionClose() {
  if (!panelSessionActive) return false;
  panelSessionActive = false;
  return true;
}

export { consumePanelSessionClose, markPanelSessionOpened, panelSessionActive };
