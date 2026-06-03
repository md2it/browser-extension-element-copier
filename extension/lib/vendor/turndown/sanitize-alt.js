var DEFAULT_IMAGE_ALT = "image";

function sanitizeMarkdownAltText(alt) {
  const cleaned = alt.replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
  return cleaned || DEFAULT_IMAGE_ALT;
}

export { DEFAULT_IMAGE_ALT, sanitizeMarkdownAltText };
