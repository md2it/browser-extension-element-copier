import { PANEL_TITLE } from "../brand";
import { toolbarWelcomeIconSvg } from "../icons";
import { localeToHtmlLang } from "../../../lib/src/i18n/locale-code";
import { createPanelDivider, createPanelHeader } from "../../../lib/src/panel-header";
import { isRtlLocale, t, type Locale } from "../i18n";
import { PANEL_POPUP_HOST_ATTR } from "./constants";

const START_BODY_TEXT = "Hello world!";

export type StartPanelHost = {
  shadow: ShadowRoot;
  surface?: "popup";
  onClose?: () => void;
  getLocale: () => Locale;
};

export class StartPanelWindow {
  constructor(private readonly host: StartPanelHost) {}

  openStartPanel(): void {
    this.close();

    const panelRoot = document.createElement("div");
    panelRoot.className = "ec-panel";
    if (this.host.surface === "popup") {
      panelRoot.classList.add("ec-panel--surface-popup");
    }
    const locale = this.host.getLocale();
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
    const message = document.createElement("p");
    message.className = "ec-start-message";
    message.textContent = START_BODY_TEXT;
    body.append(message);

    panelRoot.append(header, createPanelDivider(), body);
    panelRoot.setAttribute(PANEL_POPUP_HOST_ATTR, "true");
    this.host.shadow.appendChild(panelRoot);
  }

  close(): void {
    const panelRoots = Array.from(
      this.host.shadow.querySelectorAll<HTMLElement>(".ec-panel"),
    );
    if (!panelRoots.length) return;
    panelRoots.forEach((node) => node.remove());
    this.host.onClose?.();
  }
}
