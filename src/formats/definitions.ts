import type { Strings } from "../i18n";

/** Action icon shown on format chips and COPIED buttons (fr-copy.md). */
export type FormatActionIconId = "copy" | "files" | "images" | "file-down" | "image-down";

export type CopyFormatId =
  | "outerHTML"
  | "selector"
  | "jsPath"
  | "computedStyles"
  | "styles"
  | "xpath"
  | "fullXPath"
  | "text"
  | "markdown"
  | "markdownFile";

export type SettingsChipGroup = "files" | "clipboard-text" | "devtools";

export type FormatDefinition = {
  id: CopyFormatId;
  label: (strings: Strings) => string;
  actionIcon: FormatActionIconId;
  settingsGroup: SettingsChipGroup;
};

/** Copy-only formats from fr-copy.md (ДОСТУПНЫЕ ФОРМАТЫ). */
export const COPY_FORMATS: readonly FormatDefinition[] = [
  {
    id: "outerHTML",
    label: (s) => s.formatOuterHtml,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "selector",
    label: (s) => s.formatSelector,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "jsPath",
    label: (s) => s.formatJsPath,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "computedStyles",
    label: (s) => s.formatComputedStyles,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "styles",
    label: (s) => s.formatStyles,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "xpath",
    label: (s) => s.formatXPath,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "fullXPath",
    label: (s) => s.formatFullXPath,
    actionIcon: "copy",
    settingsGroup: "devtools",
  },
  {
    id: "text",
    label: (s) => s.formatText,
    actionIcon: "copy",
    settingsGroup: "clipboard-text",
  },
  {
    id: "markdown",
    label: (s) => s.formatMarkdown,
    actionIcon: "copy",
    settingsGroup: "clipboard-text",
  },
  {
    id: "markdownFile",
    label: (s) => s.formatMarkdown,
    actionIcon: "file-down",
    settingsGroup: "files",
  },
] as const;

/** Formats that write plain text to the clipboard (excludes file/image download actions). */
export function isClipboardCopyFormat(format: FormatDefinition): boolean {
  return format.actionIcon === "copy";
}

export const CLIPBOARD_COPY_FORMATS = COPY_FORMATS.filter(isClipboardCopyFormat);

export const DEFAULT_CLIPBOARD_FORMAT_ID: CopyFormatId = "text";

export function isCopyFormatId(value: unknown): value is CopyFormatId {
  return COPY_FORMATS.some((format) => format.id === value);
}

const LEGACY_COPY_FORMAT_ID_ALIASES: Readonly<Record<string, CopyFormatId>> = {
  declaredStyles: "styles",
};

export function normalizeCopyFormatId(value: unknown): CopyFormatId | undefined {
  if (isCopyFormatId(value)) return value;
  if (typeof value === "string") {
    const aliased = LEGACY_COPY_FORMAT_ID_ALIASES[value];
    if (aliased) return aliased;
  }
  return undefined;
}
