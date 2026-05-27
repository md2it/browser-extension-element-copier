import { PANEL_TITLE } from "../brand";
import { toolbarWelcomeIconSvg } from "../icons";
import { localeToHtmlLang } from "../../../lib/src/i18n/locale-code";
import { createPanelFooter } from "../../../lib/src/panel-footer";
import { createPanelDivider, createPanelHeader } from "../../../lib/src/panel-header";
import { isRtlLocale, t, type Locale } from "../i18n";
import { PANEL_FOOTER_CONFIG } from "../ui-config";
import { PANEL_POPUP_HOST_ATTR } from "./constants";

export type PanelSurfaceParts = {
  panelRoot: HTMLDivElement;
  body: HTMLDivElement;
};

export function createPanelSurface(
  locale: Locale,
  surface?: "popup",
): PanelSurfaceParts {
  const panelRoot = document.createElement("div");
  panelRoot.className = "ec-panel";
  if (surface === "popup") {
    panelRoot.classList.add("ec-panel--surface-popup");
  }
  panelRoot.lang = localeToHtmlLang(locale);
  panelRoot.dir = isRtlLocale(locale) ? "rtl" : "ltr";

  const strings = t(locale);
  const header = createPanelHeader({
    title: PANEL_TITLE,
    subtitle: strings.panelSubtitle,
    logoSvg: toolbarWelcomeIconSvg(),
  });

  const body = document.createElement("div");
  body.className = "ec-panel-body";

  const footer = createPanelFooter(PANEL_FOOTER_CONFIG);

  panelRoot.append(
    header,
    createPanelDivider(),
    body,
    createPanelDivider(),
    footer,
  );
  panelRoot.setAttribute(PANEL_POPUP_HOST_ATTR, "true");

  return { panelRoot, body };
}
