/** Short label for the highlight overlay (tag + id/classes). */
export function formatElementLabel(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id.trim();
  if (id) return `${tag}#${id}`;
  const classes = Array.from(el.classList)
    .map((c) => c.trim())
    .filter(Boolean);
  if (classes.length > 0) {
    return `${tag}.${classes.slice(0, 3).join(".")}`;
  }
  return tag;
}
