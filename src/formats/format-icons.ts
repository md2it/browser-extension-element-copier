import {
  COPY,
  FILE_DOWN,
  FILES,
  IMAGE_DOWN,
  IMAGES,
} from "../../../lib/src/icons";
import type { FormatActionIconId } from "./definitions";

const FORMAT_ACTION_ICONS: Record<FormatActionIconId, string> = {
  copy: COPY,
  files: FILES,
  images: IMAGES,
  "file-down": FILE_DOWN,
  "image-down": IMAGE_DOWN,
};

export function formatActionIconSvg(iconId: FormatActionIconId): string {
  return FORMAT_ACTION_ICONS[iconId];
}

export function createFormatActionIcon(iconId: FormatActionIconId): HTMLSpanElement {
  const mark = document.createElement("span");
  mark.className = "ec-format-action-icon";
  mark.setAttribute("aria-hidden", "true");
  mark.innerHTML = formatActionIconSvg(iconId);
  return mark;
}
