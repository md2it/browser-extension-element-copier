import {
  cloneElementForClipboard,
  prepareElementForCopy,
} from "../../../lib/src/copy/cleanup/index";
import {
  extractHtmlFromPreparedContainer,
  extractPlainFromPreparedContainer,
  finalizeFormattedText,
  serializeFormattedTextCache,
  tryExtractPlainFromTable,
} from "../../../lib/src/copy/formatted-text/index";
import { getCssSelector } from "../../../lib/src/copy/selector";
import { getJsPath } from "../../../lib/src/copy/js-path";
import { getElementComputedStyles } from "../../../lib/src/copy/styles-computed";
import { getElementStyles } from "../../../lib/src/copy/styles";
import { elementToMarkdown } from "../../../lib/src/copy/markdown/index";
import { getFullXPath, getXPath } from "../../../lib/src/copy/xpath";
import type { FormattedText } from "../../../lib/src/copy/formatted-text/types";

function getFormattedText(element: Element): FormattedText {
  const htmlContainer = prepareElementForCopy(element, { pruneHiddenTableRows: true });
  const html = extractHtmlFromPreparedContainer(element, htmlContainer);

  const tablePlain = tryExtractPlainFromTable(element);
  const plain = tablePlain ?? extractPlainFromPreparedContainer(
    element,
    prepareElementForCopy(element),
  );

  return finalizeFormattedText(element, html, plain);
}

export function getOuterHtml(element: Element): string {
  if (!element.shadowRoot) {
    return element.outerHTML;
  }

  const clone = element.cloneNode(false) as Element;
  const contents = cloneElementForClipboard(element);
  while (contents.firstChild) {
    clone.appendChild(contents.firstChild);
  }

  const wrapper = element.ownerDocument.createElement("div");
  wrapper.appendChild(clone);
  return wrapper.innerHTML;
}

export function extractElementCopyText(element: Element, format: string): string {
  switch (format) {
    case "outerHTML":
      return getOuterHtml(element);
    case "selector":
      return getCssSelector(element);
    case "jsPath":
      return getJsPath(element);
    case "computedStyles":
      return getElementComputedStyles(element);
    case "styles":
      return getElementStyles(element);
    case "xpath":
      return getXPath(element);
    case "fullXPath":
      return getFullXPath(element);
    case "text":
      return serializeFormattedTextCache(getFormattedText(element));
    case "markdown":
    case "markdownFile":
      return elementToMarkdown(element);
    default:
      return "";
  }
}
