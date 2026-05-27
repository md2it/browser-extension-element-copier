import type { Strings } from "../i18n";

function createStartActionButton(
  label: string,
  comingSoonLabel: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ec-start-action";
  button.textContent = label;
  button.disabled = true;
  button.setAttribute("aria-disabled", "true");
  button.title = comingSoonLabel;
  button.setAttribute("aria-label", `${label} (${comingSoonLabel})`);
  return button;
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

  const actions = document.createElement("div");
  actions.className = "ec-start-actions";
  actions.append(
    createStartActionButton(strings.startSettings, strings.startButtonComingSoon),
    createStartActionButton(strings.startHistory, strings.startButtonComingSoon),
  );

  body.append(instruction, actions);
}

export function buildPlaceholderPanelBody(body: HTMLDivElement, strings: Strings): void {
  body.replaceChildren();
  const placeholder = document.createElement("p");
  placeholder.className = "ec-panel-placeholder";
  placeholder.textContent = strings.pagePlaceholderTodo;
  body.append(placeholder);
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
