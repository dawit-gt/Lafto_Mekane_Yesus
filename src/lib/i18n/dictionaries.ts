import type { Locale } from "@/lib/i18n/config";

const en = {
  site: {
    name: "Lafto Mekaneyesus",
    denomination: "Ethiopian Evangelical Church Mekane Yesus",
    skipToContent: "Skip to main content",
  },
  nav: {
    home: "Home",
    about: "About",
    visit: "Visit Us",
    ministries: "Ministries",
    sermons: "Sermons",
    events: "Events",
    contact: "Contact",
    stories: "Stories",
    announcements: "Announcements",
    prayer: "Prayer Requests",
    members: "Members",
    privacy: "Privacy",
    terms: "Terms",
    accessibility: "Accessibility",
  },
  header: {
    visitContact: "Visit / Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Language",
  },
  footer: {
    explore: "Explore",
    getInTouch: "Get in Touch",
    legal: "Legal",
    contactDirections: "Contact & Directions",
    volunteer: "Volunteer",
    giving: "Giving",
    defaultServiceTimes: "Sunday Worship — 8:00 AM & 10:30 AM\nWednesday Prayer — 6:00 PM",
    rights: "All rights reserved.",
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof en>;

// NOTE: Please have a fluent Amharic speaker from the church review these.
const am: Dictionary = {
  site: {
    name: "ላፍቶ መካነ ኢየሱስ",
    denomination: "የኢትዮጵያ ወንጌላዊት መካነ ኢየሱስ ቤተ ክርስቲያን",
    skipToContent: "ወደ ዋናው ይዘት ዝለል",
  },
  nav: {
    home: "መነሻ ገጽ",
    about: "ስለ እኛ",
    visit: "ይጎብኙን",
    ministries: "የአገልግሎት ክፍሎች",
    sermons: "ስብከቶች",
    events: "ዝግጅቶች",
    contact: "አግኙን",
    stories: "ታሪክ",
    announcements: "ማስታወቂያዎች",
    prayer: "የጸሎት ጥያቄዎች",
    members: "አባላት",
    privacy: "ግላዊነት",
    terms: "የአጠቃቀም ደንቦች",
    accessibility: "ተደራሽነት",
  },
  header: {
    visitContact: "ይጎብኙን / ያግኙን",
    openMenu: "ክፈት",
    closeMenu: "ዝጋ",
    switchLanguage: "ቋንቋ",
  },
  footer: {
    explore: "ያስሱ",
    getInTouch: "ያግኙን",
    legal: "ሕጋዊ መረጃ",
    contactDirections: "አድራሻና አቅጣጫ",
    volunteer: "በጎ ፈቃደኛ",
    giving: "መስጠት",
    defaultServiceTimes: "የእሑድ አምልኮ — 2:00 እና 4:30 ጥዋት\nየረቡዕ ጸሎት — 12:00 ማታ",
    rights: "መብቱ በሕግ የተጠበቀ ነው።",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, am };

export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}