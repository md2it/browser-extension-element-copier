import { PANEL_CSS } from "./panel-css.js";
import { PANEL_BODY_CENTERED_CLASS, buildAboutPanelBody, buildCopiedPanelBodyForHeightProbe, buildLoadingPanelBody, buildSettingsPanelBody, buildShortcutsPanelBody, buildStartPanelBody } from "./panel-body.js";
import { PANEL_POPUP_TABS, PANEL_POPUP_WIDTH_FALLBACK_PX } from "./constants.js";
import { createPanelSurface } from "./build-panel-surface.js";
import { t } from "../i18n/strings.js";

var cachedMaxPopupHeightPx = null;

var cachedActionPopupWidthPx = null;

var COPIED_DOWNLOAD_ROW_LABEL_ID = "ec-copied-formats-files";

function createPanelPopupProbeHost(widthCss) {
    const probeHost = document.createElement("div");
    probeHost.className = "ec-panel-popup";
    probeHost.style.cssText = `position:fixed;left:-9999px;width:${widthCss};max-width:none;visibility:hidden;pointer-events:none;`;
    const shadow = probeHost.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = PANEL_CSS;
    shadow.append(style);
    return probeHost;
  }

function measureCopiedDownloadRowPopupWidth(panelRoot) {
  const downloadRow = panelRoot.querySelector(`#${COPIED_DOWNLOAD_ROW_LABEL_ID}`)?.closest(".ec-settings-format-inline-list");
  if (!downloadRow) {
    return PANEL_POPUP_WIDTH_FALLBACK_PX;
  }
  const prevWrap = downloadRow.style.flexWrap;
  const prevWidth = downloadRow.style.width;
  downloadRow.style.flexWrap = "nowrap";
  downloadRow.style.width = "max-content";
  const rowWidth = Math.ceil(downloadRow.getBoundingClientRect().width);
  downloadRow.style.flexWrap = prevWrap;
  downloadRow.style.width = prevWidth;
  const menu = panelRoot.querySelector(".ec-panel-menu");
  const body = panelRoot.querySelector(".ec-panel-content .ec-panel-body");
  let menuChrome = 0;
  if (menu) {
    const menuStyle = getComputedStyle(menu);
    menuChrome = menu.getBoundingClientRect().width + parseFloat(menuStyle.marginInlineStart) + parseFloat(menuStyle.marginInlineEnd);
  }
  let bodyPaddingX = 0;
  if (body) {
    const bodyStyle = getComputedStyle(body);
    bodyPaddingX = parseFloat(bodyStyle.paddingInlineStart) + parseFloat(bodyStyle.paddingInlineEnd);
  }
  return Math.ceil(menuChrome + bodyPaddingX + rowWidth);
}

async function getActionPopupWidthPx(locale) {
  if (cachedActionPopupWidthPx !== null) {
    return cachedActionPopupWidthPx;
  }
  const probeHost = createPanelPopupProbeHost("max-content");
  const shadow = probeHost.shadowRoot;
  if (!shadow) {
    return PANEL_POPUP_WIDTH_FALLBACK_PX;
  }
  const strings = t(locale);
  const { panelRoot, body } = await createPanelSurface(locale, "popup");
  await buildCopiedPanelBodyForHeightProbe(body, strings);
  shadow.appendChild(panelRoot);
  document.body.appendChild(probeHost);
  const width = measureCopiedDownloadRowPopupWidth(panelRoot);
  probeHost.remove();
  cachedActionPopupWidthPx = width;
  return width;
}

async function measurePanelBodyHeight(locale, fillBody) {
  const probeWidthPx = await getActionPopupWidthPx(locale);
  const probeHost = createPanelPopupProbeHost(`${probeWidthPx}px`);
  const shadow = probeHost.shadowRoot;
  if (!shadow) {
    return 0;
  }
  const { panelRoot, body } = await createPanelSurface(locale, "popup");
  await fillBody(body);
  shadow.appendChild(panelRoot);
  document.body.appendChild(probeHost);
  const height = Math.ceil(panelRoot.getBoundingClientRect().height);
  probeHost.remove();
  return height;
}

async function fillPanelTabBody(body, tab, strings) {
  body.classList.toggle(PANEL_BODY_CENTERED_CLASS, tab === "start");
  switch (tab) {
    case "start":
      buildStartPanelBody(body, strings, { onStart: () => {
      }, onCopyPage: () => {
      } });
      break;
    case "copied":
      await buildCopiedPanelBodyForHeightProbe(body, strings);
      break;
    case "settings":
      await buildSettingsPanelBody(body, strings);
      break;
    case "shortcuts":
      buildShortcutsPanelBody(body, strings);
      break;
    case "about":
      buildAboutPanelBody(body, strings);
      break;
    case "loading":
      buildLoadingPanelBody(body, strings);
      break;
  }
}

async function getMaxActionPopupHeightPx(locale) {
  if (cachedMaxPopupHeightPx !== null) {
    return cachedMaxPopupHeightPx;
  }
  const strings = t(locale);
  const heights = await Promise.all(
    PANEL_POPUP_TABS.map(
      (tab) => measurePanelBodyHeight(locale, (body) => fillPanelTabBody(body, tab, strings))
    )
  );
  cachedMaxPopupHeightPx = heights.reduce((max, height) => Math.max(max, height), 0);
  return cachedMaxPopupHeightPx;
}

export { COPIED_DOWNLOAD_ROW_LABEL_ID, cachedActionPopupWidthPx, cachedMaxPopupHeightPx, createPanelPopupProbeHost, fillPanelTabBody, getActionPopupWidthPx, getMaxActionPopupHeightPx, measureCopiedDownloadRowPopupWidth, measurePanelBodyHeight };
