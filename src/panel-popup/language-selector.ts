import { LOCALE_BUTTON_LABELS, LOCALES, type Locale } from "../i18n";

export function createLanguageSelectorRow(
  getLocale: () => Locale,
  onSelect: (locale: Locale) => void | Promise<void>,
): HTMLDivElement {
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
    button.classList.toggle("is-active", code === getLocale());
    button.addEventListener("click", () => {
      void Promise.resolve(onSelect(code));
    });
    row.append(button);
  }

  return row;
}

export function syncLanguageSelectorRow(row: HTMLElement, locale: Locale): void {
  for (const button of Array.from(row.querySelectorAll<HTMLButtonElement>(".ec-lang-btn"))) {
    const code = LOCALES.find((entry) => LOCALE_BUTTON_LABELS[entry] === button.textContent);
    button.classList.toggle("is-active", code === locale);
  }
}
