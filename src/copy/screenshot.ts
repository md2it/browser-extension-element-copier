import { domToJpeg, domToPng, type Options } from "modern-screenshot";
import type { CopyFormatId } from "../formats/definitions";

export type ImageCopyFormatId = Extract<CopyFormatId, "png" | "jpeg">;

const IMAGE_FORMATS = new Set<CopyFormatId>(["png", "jpeg"]);
const TRANSPARENT_CANVAS_FALLBACK = "rgba(0, 0, 0, 0)";

type ScreenshotBackground = {
  color: string | null;
  background: string | null;
};

function cssAlphaIsZero(alpha: string): boolean {
  const value = alpha.trim();
  if (value.endsWith("%")) {
    return Number.parseFloat(value) === 0;
  }
  return Number.parseFloat(value) === 0;
}

function isTransparentBackground(color: string): boolean {
  const normalized = color.trim().toLowerCase();
  if (!normalized || normalized === "transparent") return true;

  const slashAlpha = normalized.match(/\/\s*([^)]+)\)$/);
  if (slashAlpha) {
    return cssAlphaIsZero(slashAlpha[1]);
  }

  const rgbaAlpha = normalized.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)$/);
  return rgbaAlpha ? cssAlphaIsZero(rgbaAlpha[1]) : false;
}

function isEmptyBackgroundImage(backgroundImage: string): boolean {
  const normalized = backgroundImage.trim().toLowerCase();
  return !normalized || normalized === "none";
}

function getComputedStyleSnapshotProperty(
  computedStyles: string,
  property: string,
): string {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|\\n)${escaped}:\\s*([^;]+);`, "i").exec(computedStyles);
  return match?.[1]?.trim() ?? "";
}

function getBackgroundFromComputedStyleSnapshot(
  computedStyles: string | undefined,
): ScreenshotBackground | null {
  if (!computedStyles) return null;

  const backgroundColor = getComputedStyleSnapshotProperty(
    computedStyles,
    "background-color",
  );
  const backgroundImage = getComputedStyleSnapshotProperty(
    computedStyles,
    "background-image",
  );
  const background = getComputedStyleSnapshotProperty(computedStyles, "background");
  const color = isTransparentBackground(backgroundColor) ? null : backgroundColor;
  const visibleBackground = isEmptyBackgroundImage(backgroundImage) ? null : background;

  if (!color && !visibleBackground) return null;
  return { color, background: visibleBackground };
}

function getParentElement(element: Element): Element | null {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

function getElementBackground(element: Element): ScreenshotBackground | null {
  const view = element.ownerDocument.defaultView;
  if (!view) return null;

  const styles = view.getComputedStyle(element);
  const color = isTransparentBackground(styles.backgroundColor)
    ? null
    : styles.backgroundColor;
  const background = isEmptyBackgroundImage(styles.backgroundImage)
    ? null
    : styles.background;

  if (!color && !background) return null;
  return { color, background };
}

function getEffectiveBackground(
  element: Element,
  computedStylesSnapshot?: string,
): ScreenshotBackground {
  const snapshotBackground = getBackgroundFromComputedStyleSnapshot(computedStylesSnapshot);
  if (snapshotBackground) return snapshotBackground;

  let current: Element | null = element;
  while (current) {
    const background = getElementBackground(current);
    if (background) return background;
    current = getParentElement(current);
  }

  const { body, documentElement } = element.ownerDocument;
  for (const fallbackElement of [body, documentElement]) {
    if (!fallbackElement) continue;
    const background = getElementBackground(fallbackElement);
    if (background) return background;
  }

  return { color: null, background: null };
}

function screenshotOptions(
  element: Element,
  formatId: ImageCopyFormatId,
  computedStylesSnapshot?: string,
): Options {
  const background = getEffectiveBackground(element, computedStylesSnapshot);

  return {
    backgroundColor:
      background.color ?? (formatId === "jpeg" ? "#ffffff" : null),
    fetch: {
      requestInit: { cache: "force-cache" },
    },
    style: background.background
      ? {
          background: background.background,
          backgroundColor: background.color ?? TRANSPARENT_CANVAS_FALLBACK,
        }
      : null,
  };
}

export function isImageCopyFormat(formatId: CopyFormatId): formatId is ImageCopyFormatId {
  return IMAGE_FORMATS.has(formatId);
}

export function captureElementImage(
  element: Element,
  formatId: ImageCopyFormatId,
  computedStylesSnapshot?: string,
): Promise<string> {
  const options = screenshotOptions(element, formatId, computedStylesSnapshot);
  if (formatId === "jpeg") {
    return domToJpeg(element, options);
  }
  return domToPng(element, options);
}
