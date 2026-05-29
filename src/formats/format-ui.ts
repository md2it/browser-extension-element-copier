import type { Strings } from "../i18n";
import {
  COPY_FORMATS,
  DEFAULT_CLIPBOARD_FORMAT_ID,
  type CopyFormatId,
  type FormatDefinition,
} from "./definitions";
import { createFormatActionIcon } from "./format-icons";

function createFormatChip(
  format: FormatDefinition,
  strings: Strings,
  enabled: boolean,
  onToggle: (next: boolean) => void,
): HTMLButtonElement {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "ec-format-chip";
  chip.dataset.formatId = format.id;
  chip.setAttribute("aria-pressed", enabled ? "true" : "false");
  chip.setAttribute("aria-label", format.label(strings));

  const sync = (on: boolean): void => {
    chip.classList.toggle("is-enabled", on);
    chip.setAttribute("aria-pressed", on ? "true" : "false");
  };

  sync(enabled);

  chip.append(createFormatActionIcon(format.actionIcon));

  const labelText = format.label(strings);
  const label = document.createElement("span");
  label.className = "ec-format-chip-label";
  label.dataset.text = labelText;

  const labelContent = document.createElement("span");
  labelContent.className = "ec-format-chip-label-text";
  labelContent.textContent = labelText;
  label.append(labelContent);
  chip.append(label);

  chip.addEventListener("click", () => {
    const next = !chip.classList.contains("is-enabled");
    sync(next);
    onToggle(next);
  });

  return chip;
}

export function createFormatChipList(strings: Strings): HTMLElement {
  const enabled = new Map<CopyFormatId, boolean>(
    COPY_FORMATS.map((format) => [format.id, true]),
  );

  const list = document.createElement("div");
  list.className = "ec-format-chip-list";
  list.setAttribute("role", "group");
  list.setAttribute("aria-label", strings.settingsFormatsGroupLabel);

  for (const format of COPY_FORMATS) {
    list.append(
      createFormatChip(format, strings, enabled.get(format.id) ?? true, (next) => {
        enabled.set(format.id, next);
      }),
    );
  }

  return list;
}

export function createClipboardDefaultFormatSelect(strings: Strings): HTMLElement {
  const field = document.createElement("div");
  field.className = "ec-format-field";

  const label = document.createElement("label");
  label.className = "ec-format-field-label";
  label.htmlFor = "ec-clipboard-default-format";
  label.textContent = strings.settingsClipboardDefaultFormatLabel;

  const select = document.createElement("select");
  select.id = "ec-clipboard-default-format";
  select.className = "ec-format-select";

  for (const format of COPY_FORMATS) {
    const option = document.createElement("option");
    option.value = format.id;
    option.textContent = format.label(strings);
    option.selected = format.id === DEFAULT_CLIPBOARD_FORMAT_ID;
    select.append(option);
  }

  field.append(label, select);
  return field;
}

export function createFormatActionButton(
  format: FormatDefinition,
  strings: Strings,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ec-format-action-btn";
  button.dataset.formatId = format.id;
  button.setAttribute("aria-label", format.label(strings));

  button.append(createFormatActionIcon(format.actionIcon));

  const label = document.createElement("span");
  label.className = "ec-format-action-btn-label";
  label.textContent = format.label(strings);
  button.append(label);

  return button;
}

export type CopiedOtherOptionsOptions = {
  savedFormatId?: CopyFormatId;
  onOpenSettings?: () => void;
};

export function createCopiedOtherOptionsRow(
  strings: Strings,
  options: CopiedOtherOptionsOptions = {},
): HTMLElement {
  const savedFormatId = options.savedFormatId ?? DEFAULT_CLIPBOARD_FORMAT_ID;

  const row = document.createElement("div");
  row.className = "ec-copied-other-options";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", strings.copiedFormatsGroupLabel);

  const label = document.createElement("span");
  label.className = "ec-copied-other-options-label";
  label.textContent = strings.copiedFormatsGroupLabel;
  row.append(label);

  for (const format of COPY_FORMATS) {
    if (format.id === savedFormatId) continue;
    row.append(createFormatActionButton(format, strings));
  }

  if (options.onOpenSettings) {
    const settingsLink = document.createElement("button");
    settingsLink.type = "button";
    settingsLink.className = "ec-copied-settings-link";
    settingsLink.textContent = strings.copiedSettingsLink;
    settingsLink.addEventListener("click", () => {
      options.onOpenSettings!();
    });
    row.append(settingsLink);
  }

  return row;
}
