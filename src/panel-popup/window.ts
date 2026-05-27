import type { Locale } from "../i18n";
import { t } from "../i18n";
import { createPanelSurface } from "./build-panel-surface";
import type { PanelPopupTab } from "./constants";
import { bindDismissOnLeave, type DismissOnLeaveHandle } from "./dismiss-on-leave";
import { buildCopiedPanelBody, buildStartPanelBody } from "./panel-body";

export type CopierPanelHost = {
  shadow: ShadowRoot;
  surface?: "popup";
  onClose?: () => void;
  getLocale: () => Locale;
};

export class CopierPanelWindow {
  private dismissHandle: DismissOnLeaveHandle | null = null;

  constructor(private readonly host: CopierPanelHost) {}

  openPanel(tab: PanelPopupTab): void {
    this.close();

    const locale = this.host.getLocale();
    const strings = t(locale);
    const { panelRoot, body } = createPanelSurface(locale, this.host.surface);

    if (tab === "start") {
      buildStartPanelBody(body, strings);
    } else {
      buildCopiedPanelBody(body, strings);
    }

    this.host.shadow.appendChild(panelRoot);
    this.dismissHandle = bindDismissOnLeave(panelRoot, () => this.close());
  }

  close(): void {
    this.dismissHandle?.unbind();
    this.dismissHandle = null;

    const panelRoots = Array.from(
      this.host.shadow.querySelectorAll<HTMLElement>(".ec-panel"),
    );
    if (!panelRoots.length) return;
    panelRoots.forEach((node) => node.remove());
    this.host.onClose?.();
  }
}
