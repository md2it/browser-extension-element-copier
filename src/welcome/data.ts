import { welcomeStepIcon, type WelcomeData } from "../../../lib/src/welcome";
import { buildAboutListItems } from "../about";
import { PANEL_TITLE } from "../brand";
import {
  ARROW_UP,
  HEART,
  PIN,
  PUZZLE,
  toolbarWelcomeIconSvg,
} from "../icons";
import { isRtlLocale, t, type Locale } from "../i18n";

function buildWelcomeLocalePayload(locale: Locale) {
  const strings = t(locale);

  return {
    locale,
    dir: isRtlLocale(locale) ? ("rtl" as const) : ("ltr" as const),
    headerSubtitle: strings.panelSubtitle,
    pinHeading: strings.welcomePin,
    pinStep1: strings.welcomePinStep1,
    pinStep2: strings.welcomePinStep2,
    pinStep3: strings.welcomePinStep3,
    aboutHeading: strings.tabAbout,
    aboutItems: buildAboutListItems(strings),
    langAriaLabel: "",
  };
}

export function buildWelcomeData(
  locale: Locale,
  extensionName: string,
  options?: { isPinned?: boolean | null },
): WelcomeData {
  const isPinned = options?.isPinned === true;
  const current = buildWelcomeLocalePayload(locale);

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
    hasLocales: false,
    perLocale: { [locale]: current },
  };
}

export type { WelcomeData };
