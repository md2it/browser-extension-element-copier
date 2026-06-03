import { TurndownService } from "./turndown.browser.es.js";
import { relaxTurndownBracketEscapes, repairLinkedImageBreaks } from "./postprocess.js";
import { sanitizeMarkdownAltText } from "./sanitize-alt.js";

var TURNDOWN_OPTIONS = {
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined"
};

function cleanAttribute2(attribute) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
}

function escapeImageAlt(alt) {
  return alt.replace(/\\/g, "\\\\").replace(/\*/g, "\\*").replace(/_/g, "\\_").replace(/`/g, "\\`");
}

function escapeLinkDestination2(destination) {
  const escaped = destination.replace(/([<>()])/g, "\\$1");
  return escaped.includes(" ") ? `<${escaped}>` : escaped;
}

function escapeLinkTitle2(title) {
  return title.replace(/"/g, '\\"');
}

function createTurndownService() {
  const service = new TurndownService(TURNDOWN_OPTIONS);
  service.addRule("strikethrough", {
    filter: (node) => ["DEL", "S", "STRIKE"].includes(node.nodeName),
    replacement: (content) => `~~${content}~~`
  });
  service.addRule("image", {
    filter: "img",
    replacement: (_content, node) => {
      const element = node;
      const alt = escapeImageAlt(
        sanitizeMarkdownAltText(cleanAttribute2(element.getAttribute("alt")))
      );
      const src = escapeLinkDestination2(element.getAttribute("src") || "");
      const title = cleanAttribute2(element.getAttribute("title"));
      const titlePart = title ? ` "${escapeLinkTitle2(title)}"` : "";
      return src ? `![${alt}](${src}${titlePart})` : "";
    }
  });
  return service;
}

var sharedService;

function getTurndownService() {
  sharedService ??= createTurndownService();
  return sharedService;
}

function finalizeMarkdown(markdown) {
  return repairLinkedImageBreaks(relaxTurndownBracketEscapes(markdown));
}

function elementToMarkdown(element) {
  return finalizeMarkdown(getTurndownService().turndown(element));
}

export { TURNDOWN_OPTIONS, cleanAttribute2, createTurndownService, elementToMarkdown, escapeImageAlt, escapeLinkDestination2, escapeLinkTitle2, finalizeMarkdown, getTurndownService, sharedService };
