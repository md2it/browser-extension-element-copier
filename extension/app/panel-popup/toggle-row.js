var toggleRowIdCounter = 0;

function createToggleRow(labelText, enabled, onChange) {
  const row = document.createElement("div");
  row.className = "ec-toggle-row";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "ec-toggle";
  toggle.id = `ec-toggle-${++toggleRowIdCounter}`;
  toggle.setAttribute("role", "switch");
  toggle.setAttribute("aria-checked", enabled ? "true" : "false");
  toggle.setAttribute("aria-label", labelText);
  const label = document.createElement("label");
  label.className = "ec-toggle-label";
  label.htmlFor = toggle.id;
  label.textContent = labelText;
  const sync = (on) => {
    toggle.classList.toggle("is-on", on);
    toggle.setAttribute("aria-checked", on ? "true" : "false");
  };
  sync(enabled);
  toggle.addEventListener("click", () => {
    const next2 = !toggle.classList.contains("is-on");
    sync(next2);
    onChange(next2);
  });
  row.append(label, toggle);
  return row;
}

export { createToggleRow, toggleRowIdCounter };
