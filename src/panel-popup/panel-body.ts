import { buildAboutListItems } from "../about";
import type { Strings } from "../i18n";
import {
  ABOUT_PREFIX_CHORD_MAC_DISPLAY,
  ABOUT_PREFIX_CHORD_WIN_DISPLAY,
} from "../hotkeys/keys";
import { PREFIX_ACTION_KEY } from "../hotkeys/commands";
import { KEYBOARD } from "../icons";

export const PANEL_BODY_CENTERED_CLASS = "ec-panel-body--centered";

export type PlaceholderPanelTab = "settings" | "history";

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

function buildAboutHotkeySteps(strings: Strings): HTMLOListElement {
  const steps = document.createElement("ol");
  steps.className = "ec-about-steps";

  const step1 = document.createElement("li");
  step1.className = "ec-about-step--press";

  const pressGrid = document.createElement("div");
  pressGrid.className = "ec-about-step-press-grid";

  const pressLabel = document.createElement("span");
  pressLabel.className = "ec-about-step-press-label";
  pressLabel.textContent = strings.aboutHotkeyStepPress;

  const pressChords = document.createElement("div");
  pressChords.className = "ec-about-step-press-chords";
  pressChords.append(createKbd(ABOUT_PREFIX_CHORD_WIN_DISPLAY));

  const pressMacLabel = document.createElement("span");
  pressMacLabel.className = "ec-about-step-press-mac-label";
  pressMacLabel.textContent = strings.aboutHotkeyStepOnMac;

  const pressMacChords = document.createElement("div");
  pressMacChords.className = "ec-about-step-press-mac-chords";
  pressMacChords.append(createKbd(ABOUT_PREFIX_CHORD_MAC_DISPLAY));

  pressGrid.append(pressLabel, pressChords, pressMacLabel, pressMacChords);
  step1.append(pressGrid);

  const step2 = document.createElement("li");
  step2.textContent = strings.aboutHotkeyStepRelease;

  const step3 = document.createElement("li");
  step3.append(
    document.createTextNode(`${strings.aboutHotkeyStepThenPress} `),
    createKbd(PREFIX_ACTION_KEY.toUpperCase()),
  );

  steps.append(step1, step2, step3);
  return steps;
}

function buildAboutHotkeyListItem(strings: Strings): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "ec-about-item ec-about-item--hotkey";

  const content = document.createElement("div");
  content.className = "ec-about-hotkey-content";

  const label = document.createElement("span");
  label.className = "ec-about-text";
  label.textContent = strings.aboutHotkeyHeading;

  content.append(label, buildAboutHotkeySteps(strings));
  li.append(createAboutIcon(KEYBOARD), content);
  return li;
}

export function buildStartPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const instruction = document.createElement("div");
  instruction.className = "ec-start-instruction";

  const lead = document.createElement("p");
  lead.className = "ec-start-instruction-lead";
  lead.textContent = strings.startBodyLead;

  const action = document.createElement("p");
  action.className = "ec-start-instruction-action";
  action.textContent = strings.startBodyAction;

  instruction.append(lead, action);
  body.append(instruction);
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

  page.append(title, text);
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

  list.appendChild(buildAboutHotkeyListItem(strings));
  page.append(title, list);
  body.append(page);
}

export function buildCopiedPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();

  const copied = document.createElement("div");
  copied.className = "ec-copied";

  const title = document.createElement("p");
  title.className = "ec-copied-title";
  title.textContent = strings.copiedTitle;

  const subtitle = document.createElement("p");
  subtitle.className = "ec-copied-subtitle";
  subtitle.textContent = strings.copiedSubtitle;

  copied.append(title, subtitle);
  body.append(copied);
}
