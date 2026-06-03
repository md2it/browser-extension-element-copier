import { ARROW_UP, HEART, PIN, PUZZLE } from "../../lib/icons/index.js";
import { LOCALES, LOCALE_BUTTON_LABELS } from "../i18n/types.js";
import { PANEL_TITLE } from "../brand.js";
import { buildAboutListItems } from "../about.js";
import { isRtlLocale } from "../../lib/our/i18n/rtl.js";
import { t } from "../i18n/strings.js";
import { toolbarWelcomeIconSvg } from "../icons.js";
import { welcomeStepIcon } from "../../lib/our/welcome/step-icon.js";

function buildWelcomeLocalePayload(locale) {
  const strings = t(locale);
  return {
    locale,
    dir: isRtlLocale(locale) ? "rtl" : "ltr",
    headerSubtitle: strings.panelSubtitle,
    pinHeading: strings.welcomePin,
    pinStep1: strings.welcomePinStep1,
    pinStep2: strings.welcomePinStep2,
    pinStep3: strings.welcomePinStep3,
    aboutHeading: strings.tabAbout,
    aboutItems: buildAboutListItems(strings),
    langAriaLabel: strings.pageSettingsTitle
  };
}

function buildWelcomeData(locale, extensionName, options) {
  const isPinned = options?.isPinned === true;
  const perLocale = Object.fromEntries(
    LOCALES.map((code) => [code, buildWelcomeLocalePayload(code)])
  );
  const current = perLocale[locale];
  return {
    extensionName,
    locale,
    dir: current.dir,
    headerLogoSvg: toolbarWelcomeIconSvg(),
    headerTitle: PANEL_TITLE,
    headerSubtitle: current.headerSubtitle,
    iconSvg: toolbarWelcomeIconSvg(),
    pinHeading: current.pinHeading,
    pinStep1: current.pinStep1,
    pinStep2: current.pinStep2,
    pinStep3: current.pinStep3,
    puzzleIcon: welcomeStepIcon(PUZZLE),
    pinIcon: welcomeStepIcon(PIN),
    arrowUpIcon: welcomeStepIcon(ARROW_UP, 28),
    pinHintIcon: welcomeStepIcon(PIN, 16),
    heartIcon: welcomeStepIcon(HEART, 56),
    isPinned,
    aboutHeading: current.aboutHeading,
    aboutItems: current.aboutItems,
    hasAbout: true,
    hasLocales: true,
    locales: [...LOCALES],
    localeLabels: LOCALE_BUTTON_LABELS,
    langAriaLabel: current.langAriaLabel,
    perLocale
  };
}

export { buildWelcomeData, buildWelcomeLocalePayload };
