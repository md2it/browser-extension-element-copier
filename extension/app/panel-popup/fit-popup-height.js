import { getActionPopupWidthPx, getMaxActionPopupHeightPx } from "./panel-heights.js";

function applyActionPopupDocumentWidth(widthPx) {
  const px = `${widthPx}px`;
  document.documentElement.style.width = px;
  document.body.style.width = px;
}

async function fitActionPopupToHost(host, locale) {
  const [widthPx, maxHeightPx] = await Promise.all([
    getActionPopupWidthPx(locale),
    getMaxActionPopupHeightPx(locale)
  ]);
  if (widthPx <= 0 && maxHeightPx <= 0) return;
  const apply = () => {
    if (widthPx > 0) {
      applyActionPopupDocumentWidth(widthPx);
      host.style.width = `${widthPx}px`;
    }
    if (maxHeightPx > 0) {
      const px = `${maxHeightPx}px`;
      document.documentElement.style.height = px;
      document.body.style.height = px;
      host.style.height = px;
      host.style.minHeight = px;
    }
  };
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
        resolve();
      });
    });
  });
}

export { applyActionPopupDocumentWidth, fitActionPopupToHost };
