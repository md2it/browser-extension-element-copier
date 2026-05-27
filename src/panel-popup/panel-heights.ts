import { t, type Locale } from "../i18n";
import { createPanelSurface } from "./build-panel-surface";
import { PANEL_POPUP_PROBE_WIDTH } from "./constants";
import {
  buildCopiedPanelBody,
  buildStartPanelBody,
} from "./panel-body";

let cachedMaxPopupHeightPx: number | null = null;

function measurePanelBodyHeight(
  locale: Locale,
  fillBody: (body: HTMLDivElement) => void,
): number {
  const probeHost = document.createElement("div");
  probeHost.className = "ec-panel-popup";
  probeHost.style.cssText = `position:fixed;left:-9999px;width:${PANEL_POPUP_PROBE_WIDTH};visibility:hidden;pointer-events:none;`;
  const shadow = probeHost.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = process.env.PANEL_CSS_CONTENT ?? "";
  shadow.append(style);

  const { panelRoot, body } = createPanelSurface(locale, "popup");
  fillBody(body);
  shadow.appendChild(panelRoot);

  document.body.appendChild(probeHost);
  const height = Math.ceil(panelRoot.getBoundingClientRect().height);
  probeHost.remove();
  return height;
}

/** Max toolbar popup height across START and COPIED (cached). */
export function getMaxActionPopupHeightPx(locale: Locale): number {
  if (cachedMaxPopupHeightPx !== null) {
    return cachedMaxPopupHeightPx;
  }

  const strings = t(locale);
  cachedMaxPopupHeightPx = Math.max(
    measurePanelBodyHeight(locale, (body) => {
      buildStartPanelBody(body, strings);
    }),
    measurePanelBodyHeight(locale, (body) => {
      buildCopiedPanelBody(body, strings);
    }),
  );
  return cachedMaxPopupHeightPx;
}
