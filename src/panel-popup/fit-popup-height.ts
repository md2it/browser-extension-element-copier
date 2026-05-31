import type { Locale } from "../i18n";
import { getActionPopupWidthPx, getMaxActionPopupHeightPx } from "./panel-heights";

export function applyActionPopupDocumentWidth(widthPx: number): void {
  const px = `${widthPx}px`;
  document.documentElement.style.width = px;
  document.body.style.width = px;
}

/** Sizes the toolbar action popup from COPIED download row width and max tab height. */
export async function fitActionPopupToHost(host: HTMLElement, locale: Locale): Promise<void> {
  const [widthPx, maxHeightPx] = await Promise.all([
    getActionPopupWidthPx(locale),
    getMaxActionPopupHeightPx(locale),
  ]);
  if (widthPx <= 0 && maxHeightPx <= 0) return;

  const apply = (): void => {
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

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
        resolve();
      });
    });
  });
}
