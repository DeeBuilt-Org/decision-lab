/**
 * The seven platforms the Platform Picker can recommend.
 *
 * Deliberately no prices, seat counts or plan names here. Those change faster
 * than anyone will update a quiz, so the result links to each platform's own
 * pricing page and lets the vendor keep its numbers current.
 *
 * Plain data with relative imports only, so scripts/verify-platform-picker.mjs
 * can load it straight into Node.
 */

export type PlatformCode = "CU" | "AT" | "MON" | "ASA" | "TW" | "SS" | "SU";

export interface Platform {
  code: PlatformCode;
  name: string;
  /** One line on what the platform is, shown under its name on the result. */
  blurb: string;
  pricingUrl: string;
}

export const PLATFORMS: Platform[] = [
  {
    code: "CU",
    name: "ClickUp",
    blurb:
      "Tasks and docs in one workspace, with time tracking built in. Teams that like to set things up their own way get a deep settings menu.",
    pricingUrl: "https://clickup.com/pricing",
  },
  {
    code: "AT",
    name: "Airtable",
    blurb:
      "A database that looks like a spreadsheet. Records link to each other, so one client can link to every job you've done for them.",
    pricingUrl: "https://www.airtable.com/pricing",
  },
  {
    code: "MON",
    name: "monday.com",
    blurb:
      "Boards where each item moves through colored status columns. Teams that avoid new software tend to pick it up in a day.",
    pricingUrl: "https://monday.com/pricing",
  },
  {
    code: "ASA",
    name: "Asana",
    blurb: "Projects and task lists built around who owns each task and when it's due.",
    pricingUrl: "https://asana.com/pricing",
  },
  {
    code: "TW",
    name: "Teamwork.com",
    blurb:
      "Project management made for agencies, with time tracking and client billing in the same place as the projects.",
    pricingUrl: "https://www.teamwork.com/pricing/",
  },
  {
    code: "SS",
    name: "Smartsheet",
    blurb:
      "A spreadsheet grid with Gantt timelines and task dependencies on top. Anyone who lives in Excel will recognize it.",
    pricingUrl: "https://www.smartsheet.com/pricing",
  },
  {
    code: "SU",
    name: "SmartSuite",
    blurb:
      "Linked records like Airtable, with more project and process tools built in from the start.",
    pricingUrl: "https://www.smartsuite.com/pricing",
  },
];

export const PLATFORM_CODES: PlatformCode[] = PLATFORMS.map((p) => p.code);

const BY_CODE = new Map(PLATFORMS.map((p) => [p.code, p]));

export function platform(code: PlatformCode): Platform {
  const found = BY_CODE.get(code);
  if (!found) throw new Error(`Unknown platform: ${code}`);
  return found;
}

export const SOFTR_PRICING_URL = "https://www.softr.io/pricing";
export const AIRTABLE_PORTALS_URL = "https://airtable.com/platform/portals";

/** Where every DeeBuilt offer on the result screen points. One place to change it. */
export const DEEBUILT_CONTACT_URL = "https://deebuilt.co";
