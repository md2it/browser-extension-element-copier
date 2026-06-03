function unescapeBracketEscapesInLabel(label) {
  return label.replace(/\\\[/g, "[").replace(/\\\]/g, "]");
}

function repairLinkedImageBreaks(markdown) {
  return markdown.replace(
    /\[(\s*!\[(?:\\.|[^\]])*?\]\((?:\\.|[^)])*?\))\s*\]\(/g,
    (_match, inner) => `[${inner.trim()}](`
  );
}

function relaxTurndownBracketEscapes(markdown) {
  return markdown.replace(
    /(!?)\[((?:\\.|[^\]])*?)\]\(/g,
    (match, bang, label) => {
      const plain = unescapeBracketEscapesInLabel(label);
      return plain === label ? match : `${bang}[${plain}](`;
    }
  );
}

export { relaxTurndownBracketEscapes, repairLinkedImageBreaks, unescapeBracketEscapesInLabel };
