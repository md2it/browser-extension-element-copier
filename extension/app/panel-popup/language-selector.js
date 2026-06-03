import { LOCALES, LOCALE_BUTTON_LABELS } from "../i18n/types.js";

function createLanguageSelectorRow(getLocale2, onSelect) {
  const row = document.createElement("div");
  row.className = "ec-lang-row";
  row.dir = "ltr";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", "Language");
  for (const code of LOCALES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ec-lang-btn";
    button.textContent = LOCALE_BUTTON_LABELS[code];
    button.classList.toggle("is-active", code === getLocale2());
    button.addEventListener("click", () => {
      void Promise.resolve(onSelect(code));
    });
    row.append(button);
  }
  return row;
}

export { createLanguageSelectorRow };
