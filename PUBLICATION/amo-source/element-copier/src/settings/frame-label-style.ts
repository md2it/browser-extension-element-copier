import { ext } from "../api";
import { FRAME_LABEL_STYLE_KEY } from "../messages";

export type FrameLabelStyle =
  | "none"
  | "click-to-copy"
  | "tag-id-class"
  | "selector"
  | "full-xpath";

export const DEFAULT_FRAME_LABEL_STYLE: FrameLabelStyle = "click-to-copy";

export const FRAME_LABEL_STYLES: readonly FrameLabelStyle[] = [
  "none",
  "click-to-copy",
  "tag-id-class",
  "selector",
  "full-xpath",
];

function normalizeFrameLabelStyle(raw: unknown): FrameLabelStyle {
  return FRAME_LABEL_STYLES.includes(raw as FrameLabelStyle)
    ? (raw as FrameLabelStyle)
    : DEFAULT_FRAME_LABEL_STYLE;
}

export async function getFrameLabelStyle(): Promise<FrameLabelStyle> {
  const data = await ext.storage.local.get(FRAME_LABEL_STYLE_KEY);
  return normalizeFrameLabelStyle(data[FRAME_LABEL_STYLE_KEY]);
}

export async function setFrameLabelStyle(style: FrameLabelStyle): Promise<void> {
  await ext.storage.local.set({ [FRAME_LABEL_STYLE_KEY]: style });
}
