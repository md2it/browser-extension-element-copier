import type { Locale } from "../i18n";
import { getMaxActionPopupHeightPx } from "./panel-heights";

/** Sizes the toolbar action popup to the tallest panel variant (START / COPIED). */
export function fitActionPopupToHost(host: HTMLElement, locale: Locale): void {
  const apply = (): void => {
    const measured = Math.ceil(host.getBoundingClientRect().height);
    const maxVariant = getMaxActionPopupHeightPx(locale);
    const height = Math.max(measured, maxVariant);
    if (height <= 0) return;
    const px = `${height}px`;
    document.documentElement.style.height = px;
    document.body.style.height = px;
    host.style.height = px;
    host.style.minHeight = "0";
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(apply);
  });
}
