import { buildAboutListItems } from "../about";
import type { Strings } from "../i18n";
import { PANEL_FOOTER_LINKEDIN_URL } from "../../../lib/src/panel-footer/constants";
import {
  ABOUT_PREFIX_CHORD_MAC_DISPLAY,
  ABOUT_PREFIX_CHORD_WIN_DISPLAY,
} from "../hotkeys/keys";
import { PREFIX_ACTION_KEY } from "../hotkeys/commands";

export const PANEL_BODY_CENTERED_CLASS = "ec-panel-body--centered";

export type PlaceholderPanelTab = "settings" | "history";

function createPageDivider(): HTMLDivElement {
  const divider = document.createElement("div");
  divider.className = "dd-panel-divider ec-panel-page-divider";
  return divider;
}

function createAboutIcon(iconHtml: string): HTMLSpanElement {
  const mark = document.createElement("span");
  mark.className = "ec-about-icon";
  mark.setAttribute("aria-hidden", "true");
  mark.innerHTML = iconHtml;
  return mark;
}

function createKbd(text: string): HTMLElement {
  const kbd = document.createElement("kbd");
  kbd.className = "ec-about-kbd";
  kbd.textContent = text;
  return kbd;
}

function buildShortcutsSteps(strings: Strings): HTMLOListElement {
  const steps = document.createElement("ol");
  steps.className = "ec-shortcuts-steps";

  const step1 = document.createElement("li");
  step1.className = "ec-shortcuts-step--press";

  const pressGrid = document.createElement("div");
  pressGrid.className = "ec-shortcuts-step-press-grid";

  const pressLabel = document.createElement("span");
  pressLabel.className = "ec-shortcuts-step-press-label";
  pressLabel.textContent = strings.shortcutsStepPress;

  const pressChords = document.createElement("div");
  pressChords.className = "ec-shortcuts-step-press-chords";
  pressChords.append(createKbd(ABOUT_PREFIX_CHORD_WIN_DISPLAY));

  const pressMacLabel = document.createElement("span");
  pressMacLabel.className = "ec-shortcuts-step-press-mac-label";
  pressMacLabel.textContent = strings.shortcutsStepOnMac;

  const pressMacChords = document.createElement("div");
  pressMacChords.className = "ec-shortcuts-step-press-mac-chords";
  pressMacChords.append(createKbd(ABOUT_PREFIX_CHORD_MAC_DISPLAY));

  pressGrid.append(pressLabel, pressChords, pressMacLabel, pressMacChords);
  step1.append(pressGrid);

  const step2 = document.createElement("li");
  step2.textContent = strings.shortcutsStepRelease;

  const step3 = document.createElement("li");
  step3.append(
    document.createTextNode(`${strings.shortcutsStepThenPress} `),
    createKbd(PREFIX_ACTION_KEY.toUpperCase()),
  );

  steps.append(step1, step2, step3);
  return steps;
}

function createAboutCopyright(strings: Strings): HTMLAnchorElement {
  const credit = document.createElement("a");
  credit.className = "ec-about-credit";
  credit.href = PANEL_FOOTER_LINKEDIN_URL;
  credit.target = "_blank";
  credit.rel = "noopener noreferrer";
  credit.textContent = strings.aboutCopyright;
  credit.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
  });
  return credit;
}

export function buildStartPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page ec-panel-page--start";

  const title = document.createElement("h2");
  title.className = "ec-panel-page-title";
  title.textContent = strings.titleSettings.toUpperCase();

  const instruction = document.createElement("div");
  instruction.className = "ec-start-instruction";

  const lead = document.createElement("p");
  lead.className = "ec-start-instruction-lead";
  lead.textContent = strings.startBodyLead;

  const action = document.createElement("p");
  action.className = "ec-start-instruction-action";
  action.textContent = strings.startBodyAction;

  instruction.append(lead, action);
  page.append(title, createPageDivider(), instruction);
  body.append(page);
}

export function buildPlaceholderPanelBody(
  body: HTMLDivElement,
  tab: PlaceholderPanelTab,
  strings: Strings,
): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page";

  const title = document.createElement("h2");
  title.className = "ec-panel-page-title";
  title.textContent =
    tab === "settings" ? strings.pageSettingsTitle : strings.pageHistoryTitle;

  const text = document.createElement("p");
  text.className = "ec-panel-page-text";
  text.textContent = strings.pagePlaceholderTodo;

  page.append(title, createPageDivider(), text);
  body.append(page);
}

export function buildAboutPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page ec-panel-page--about";

  const title = document.createElement("h2");
  title.className = "ec-panel-page-title";
  title.textContent = strings.tabAbout;

  const list = document.createElement("ul");
  list.className = "ec-about-list";
  list.setAttribute("aria-label", strings.tabAbout);

  for (const item of buildAboutListItems(strings)) {
    const li = document.createElement("li");
    li.className = "ec-about-item";

    const label = document.createElement("span");
    label.className = "ec-about-text";
    label.textContent = item.text;

    li.append(createAboutIcon(item.iconHtml), label);
    list.appendChild(li);
  }

  page.append(title, createPageDivider(), list, createAboutCopyright(strings));
  body.append(page);
}

export function buildShortcutsPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page ec-panel-page--shortcuts";

  const title = document.createElement("h2");
  title.className = "ec-panel-page-title";
  title.textContent = strings.tabShortcuts;

  const runStopHeading = document.createElement("p");
  runStopHeading.className = "ec-shortcuts-heading";
  runStopHeading.textContent = strings.shortcutsRunStopHeading;

  const stopHeading = document.createElement("p");
  stopHeading.className = "ec-shortcuts-heading";
  stopHeading.append(
    document.createTextNode(`${strings.shortcutsStopHeading} `),
    createKbd("Esc"),
  );

  const divider = document.createElement("div");
  divider.className = "dd-panel-divider ec-shortcuts-divider";

  const safetyLine1 = document.createElement("p");
  safetyLine1.className = "ec-shortcuts-note";
  safetyLine1.textContent = strings.shortcutsSafetyLine1;

  const safetyLine2 = document.createElement("p");
  safetyLine2.className = "ec-shortcuts-note";
  safetyLine2.textContent = strings.shortcutsSafetyLine2;

  page.append(
    title,
    createPageDivider(),
    runStopHeading,
    buildShortcutsSteps(strings),
    stopHeading,
    divider,
    safetyLine1,
    safetyLine2,
  );
  body.append(page);
}

export function buildLanguagePanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page";

  const title = document.createElement("h2");
  title.className = "ec-panel-page-title";
  title.textContent = strings.tabLanguage;

  page.append(title, createPageDivider());
  body.append(page);
}

export function buildCopiedPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const page = document.createElement("div");
  page.className = "ec-panel-page ec-panel-page--saved";

  const heading = document.createElement("h2");
  heading.className = "ec-panel-page-title";
  heading.textContent = strings.pageSavedTitle;

  const copied = document.createElement("div");
  copied.className = "ec-copied";

  const title = document.createElement("p");
  title.className = "ec-copied-title";
  title.textContent = strings.copiedTitle;

  const subtitle = document.createElement("p");
  subtitle.className = "ec-copied-subtitle";
  subtitle.textContent = strings.copiedSubtitle;

  copied.append(title, subtitle);
  page.append(heading, createPageDivider(), copied);
  body.append(page);
}
