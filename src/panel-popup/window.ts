import type { Locale } from "../i18n";
import { t } from "../i18n";
import { createPanelSurface } from "./build-panel-surface";
import type { PanelMenuTab, PanelPopupTab } from "./constants";
import { PANEL_MENU_TABS } from "./constants";
import { bindDismissOnLeave, type DismissOnLeaveHandle } from "./dismiss-on-leave";
import {
  buildCopiedPanelBody,
  buildPlaceholderPanelBody,
  buildStartPanelBody,
} from "./panel-body";
import type { PanelMenuHandle } from "./panel-menu";

export type CopierPanelHost = {
  shadow: ShadowRoot;
  surface?: "popup";
  onClose?: () => void;
  getLocale: () => Locale;
};

function isMenuTab(tab: PanelPopupTab): tab is PanelMenuTab {
  return (PANEL_MENU_TABS as readonly string[]).includes(tab);
}

export class CopierPanelWindow {
  private dismissHandle: DismissOnLeaveHandle | null = null;
  private panelRoot: HTMLDivElement | null = null;
  private body: HTMLDivElement | null = null;
  private menu: PanelMenuHandle | null = null;

  constructor(private readonly host: CopierPanelHost) {}

  openPanel(tab: PanelPopupTab): void {
    this.close();

    const locale = this.host.getLocale();
    const { panelRoot, body, menu } = createPanelSurface(locale, this.host.surface);

    this.panelRoot = panelRoot;
    this.body = body;
    this.menu = menu;

    if (menu) {
      menu.onSelect = (nextTab) => this.showTab(nextTab);
    }

    this.renderTab(tab);
    this.host.shadow.appendChild(panelRoot);
    this.dismissHandle = bindDismissOnLeave(panelRoot, () => this.close());
  }

  showTab(tab: PanelPopupTab): void {
    if (!this.body || !this.panelRoot) return;
    this.renderTab(tab);
  }

  close(): void {
    this.dismissHandle?.unbind();
    this.dismissHandle = null;
    this.panelRoot = null;
    this.body = null;
    this.menu = null;

    const panelRoots = Array.from(
      this.host.shadow.querySelectorAll<HTMLElement>(".ec-panel"),
    );
    if (!panelRoots.length) return;
    panelRoots.forEach((node) => node.remove());
    this.host.onClose?.();
  }

  private renderTab(tab: PanelPopupTab): void {
    if (!this.body) return;

    const strings = t(this.host.getLocale());

    switch (tab) {
      case "start":
        buildStartPanelBody(this.body, strings);
        break;
      case "copied":
        buildCopiedPanelBody(this.body, strings);
        break;
      case "settings":
      case "history":
      case "info":
        buildPlaceholderPanelBody(this.body, strings);
        break;
    }

    if (this.menu) {
      this.menu.setActive(isMenuTab(tab) ? tab : null);
    }
  }
}
