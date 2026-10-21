import type { PlatformCode } from "./platforms.ts";

/**
 * The Platform Picker's questions, votes, combination bonuses and plan
 * pointers, exactly as docs/PLATFORM_PICKER_SPEC.md lays them out.
 *
 * This is data, not configuration: there is no editor for it on purpose. To
 * change what the quiz recommends, change it here and re-run
 * scripts/verify-platform-picker.mjs to see what moved.
 *
 * Votes: 3 = strong, 2 = normal, 1 = light. An option with no votes carries
 * none on purpose.
 */

export type Votes = Partial<Record<PlatformCode, number>>;

export type SectionId = "team" | "work" | "volume" | "access" | "needs" | "setup";

export interface QuizSection {
  id: SectionId;
  title: string;
}

export interface QuizOption {
  id: string;
  label: string;
  votes?: Votes;
}

export interface QuizQuestion {
  id: string;
  section: SectionId;
  label: string;
  /** Short name for the question, used on the result's "because" lines. */
  topic: string;
  multi?: boolean;
  options: QuizOption[];
}

/** Single select stores the option id; multi select stores the chosen ids. */
export type QuizAnswers = Record<string, string | string[]>;

export const SECTIONS: QuizSection[] = [
  { id: "team", title: "About your team" },
  { id: "work", title: "How you work" },
  { id: "volume", title: "Data volume" },
  { id: "access", title: "Access and permissions" },
  { id: "needs", title: "Business needs" },
  { id: "setup", title: "Budget and setup" },
];

const LARGE_TEAM: Votes = { MON: 2, ASA: 2, SS: 2, TW: 2 };
const HEAVY_VOLUME: Votes = { AT: 1, SU: 1 };

export const QUESTIONS: QuizQuestion[] = [
  // ---- About your team -----------------------------------------------------
  {
    id: "q1",
    section: "team",
    topic: "Team size",
    label: "How many people will work in the platform day to day?",
    options: [
      { id: "solo", label: "Just me", votes: { CU: 2, AT: 2, SS: 1 } },
      { id: "2-5", label: "2 to 5", votes: { CU: 2, ASA: 2, AT: 2, TW: 1 } },
      // The core size for the task tools; Airtable and SmartSuite have no edge here.
      { id: "6-15", label: "6 to 15", votes: { ASA: 1, MON: 1, CU: 1, TW: 1 } },
      { id: "16-50", label: "16 to 50", votes: LARGE_TEAM },
      { id: "50+", label: "More than 50", votes: LARGE_TEAM },
    ],
  },
  {
    id: "q2",
    section: "team",
    topic: "Your business",
    label: "What best describes your business?",
    options: [
      { id: "agency", label: "Agency or consultancy that bills clients", votes: { TW: 3 } },
      { id: "service", label: "Trades or field service business", votes: { AT: 2, SU: 2 } },
      // Same votes as trades. Split out so the result can raise HIPAA.
      { id: "healthcare", label: "Healthcare practice", votes: { AT: 2, SU: 2 } },
      { id: "internal", label: "Internal operations or admin team", votes: { MON: 2, SU: 2 } },
      { id: "software", label: "Software or product team", votes: { CU: 2, ASA: 2 } },
      { id: "nonprofit", label: "Nonprofit", votes: { ASA: 2, MON: 1 } },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q3",
    section: "team",
    topic: "Comfort with new software",
    label: "How comfortable is your team with new software?",
    options: [
      { id: "avoid", label: "We avoid it when we can", votes: { MON: 2, ASA: 2 } },
      { id: "spreadsheets", label: "Comfortable with email and spreadsheets", votes: { SS: 2 } },
      { id: "customize", label: "We enjoy customizing our tools", votes: { CU: 2, SU: 2 } },
      { id: "builder", label: "We have someone who builds systems", votes: { AT: 2, SU: 2 } },
    ],
  },

  // ---- How you work --------------------------------------------------------
  {
    id: "q4",
    section: "work",
    topic: "What you're organizing",
    label: "What are you mainly trying to organize?",
    options: [
      { id: "projects", label: "Projects with deadlines and tasks", votes: { ASA: 2, SS: 2, MON: 2 } },
      { id: "requests", label: "Repeating requests like intake or orders", votes: { MON: 2, SU: 2, AT: 2 } },
      { id: "records", label: "A big list of records like clients or jobs", votes: { AT: 2, SU: 2 } },
      { id: "billing", label: "Client work where hours and billing matter", votes: { TW: 3 } },
      { id: "mix", label: "A mix of everything", votes: { CU: 2, SU: 2 } },
    ],
  },
  {
    id: "q5",
    section: "work",
    topic: "How your work looks",
    label: "When you picture your work, what does it look like?",
    options: [
      { id: "spreadsheet", label: "A spreadsheet", votes: { SS: 2 } },
      { id: "cards", label: "Cards moving through stages", votes: { MON: 2 } },
      { id: "todo", label: "A to-do list", votes: { ASA: 2, CU: 2 } },
      { id: "connected", label: "Connected records like clients linked to jobs", votes: { AT: 2, SU: 2 } },
    ],
  },
  {
    id: "q6",
    section: "work",
    topic: "Linked information",
    label: "Do pieces of your information need to link to each other?",
    options: [
      // ClickUp (Relationships) and monday.com (Connect Boards) link records
      // too, just less deeply. Asana's reference fields are one-way only.
      { id: "constantly", label: "Yes, constantly", votes: { AT: 3, SU: 3, CU: 1, MON: 1 } },
      { id: "sometimes", label: "Sometimes" },
      { id: "no", label: "Not really", votes: { ASA: 1, MON: 1, SS: 1 } },
    ],
  },
  {
    id: "q7",
    section: "work",
    topic: "Timelines and dependencies",
    label: "How important are detailed timelines with task dependencies?",
    options: [
      { id: "central", label: "Central to our work", votes: { SS: 2, TW: 2, MON: 2 } },
      { id: "sometimes", label: "Helpful sometimes" },
      { id: "no", label: "We don't need them", votes: { AT: 1, CU: 1 } },
    ],
  },
  {
    id: "q8",
    section: "work",
    topic: "Views you'd use",
    label: "Which views would your team use?",
    multi: true,
    options: [
      { id: "table", label: "Table" },
      { id: "kanban", label: "Kanban board" },
      { id: "calendar", label: "Calendar" },
      { id: "gantt", label: "Timeline or Gantt", votes: { SS: 1 } },
      { id: "dashboards", label: "Dashboards", votes: { MON: 1, SS: 1 } },
      { id: "forms", label: "Forms" },
      { id: "map", label: "Map", votes: { AT: 1, SU: 1, CU: 1, MON: 1 } },
    ],
  },

  // ---- Data volume ---------------------------------------------------------
  {
    id: "q9",
    section: "volume",
    topic: "Records after a year",
    label: "About how many records (clients, jobs or orders) will you have after a year?",
    options: [
      { id: "under-1k", label: "Under 1,000" },
      { id: "1k-5k", label: "1,000 to 5,000" },
      // SmartSuite's Team plan holds 5,000 records per solution; Airtable's Team
      // holds 50,000 per base, so Airtable covers this range a plan lower.
      { id: "5k-50k", label: "5,000 to 50,000", votes: { AT: 2, SU: 1 } },
      { id: "50k-125k", label: "50,000 to 125,000", votes: { AT: 2, SU: 1 } },
      { id: "125k+", label: "More than 125,000", votes: { AT: 1, SU: 1 } },
      { id: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "q10",
    section: "volume",
    topic: "New records each month",
    label: "How many new records come in each month?",
    options: [
      { id: "handful", label: "A handful" },
      { id: "dozens", label: "Dozens" },
      { id: "hundreds", label: "Hundreds", votes: HEAVY_VOLUME },
      { id: "thousands", label: "Thousands", votes: HEAVY_VOLUME },
    ],
  },
  {
    id: "q11",
    section: "volume",
    topic: "Automation",
    label: "How much do you want to automate?",
    options: [
      { id: "nothing", label: "Nothing yet", votes: { MON: 1, ASA: 1 } },
      { id: "reminders", label: "Simple reminders and notifications" },
      { id: "handoffs", label: "Handoffs between people and steps", votes: { AT: 2, SU: 2 } },
      // "Including other apps": Airtable connects to far more outside apps.
      { id: "most", label: "Most of our process, including other apps", votes: { AT: 2, SU: 1 } },
    ],
  },

  // ---- Access and permissions ----------------------------------------------
  {
    id: "q12",
    section: "access",
    topic: "Outside logins",
    label: "Do clients or outside people need to log in?",
    options: [
      { id: "no", label: "No" },
      { id: "view", label: "Yes, to view progress", votes: { TW: 2, MON: 2, ASA: 1 } },
      // SmartSuite has guest access but no client portal of its own, so it
      // trails Airtable on submissions and gets nothing for a branded portal.
      { id: "submit", label: "Yes, to submit requests or files", votes: { AT: 2, SU: 1 } },
      { id: "portal", label: "Yes, we want a branded client portal", votes: { AT: 3 } },
    ],
  },
  {
    id: "q13",
    section: "access",
    topic: "Outside people",
    label: "How many outside people would need access?",
    options: [
      { id: "none", label: "None" },
      { id: "1-10", label: "1 to 10" },
      { id: "11-50", label: "11 to 50" },
      { id: "51-200", label: "51 to 200" },
      { id: "200+", label: "More than 200" },
    ],
  },
  {
    id: "q14",
    section: "access",
    topic: "Who sees what",
    label: "Do different people need to see different things?",
    options: [
      { id: "everyone", label: "No, everyone sees everything" },
      { id: "roles", label: "Some views by team or role", votes: { MON: 1, CU: 1, ASA: 1 } },
      { id: "own", label: "Yes, people should only see their own records", votes: { AT: 2, SU: 2 } },
    ],
  },
  {
    id: "q15",
    section: "access",
    topic: "Security",
    label: "Do you need security features like SSO or audit logs?",
    options: [
      { id: "no", label: "No" },
      { id: "nice", label: "Nice to have" },
      { id: "required", label: "Required", votes: { AT: 3, SS: 1 } },
    ],
  },

  // ---- Business needs ------------------------------------------------------
  {
    id: "q16",
    section: "needs",
    topic: "Time tracking and billing",
    label: "Do you track time or bill clients by the hour or retainer?",
    options: [
      { id: "core", label: "Yes, it's core to the business", votes: { TW: 3, CU: 1 } },
      { id: "occasionally", label: "Occasionally", votes: { CU: 1 } },
      { id: "no", label: "No" },
    ],
  },
  {
    id: "q17",
    section: "needs",
    topic: "Connections",
    label: "What does it need to connect with?",
    multi: true,
    options: [
      { id: "accounting", label: "Accounting software", votes: { TW: 1 } },
      // monday.com sells its own CRM on the same platform.
      { id: "crm", label: "CRM", votes: { TW: 1, MON: 1 } },
      // Both turn Gmail and Outlook messages straight into tasks.
      { id: "email", label: "Email and calendar", votes: { ASA: 1, CU: 1 } },
      { id: "forms", label: "Website forms" },
      { id: "api", label: "Custom apps through an API", votes: { AT: 1 } },
      { id: "unsure", label: "Not sure yet" },
    ],
  },

  // ---- Budget and setup ----------------------------------------------------
  {
    id: "q18",
    section: "setup",
    topic: "Cost",
    label: "How much does cost drive this decision?",
    options: [
      { id: "free", label: "We need a free plan, or close to it", votes: { CU: 3, ASA: 1 } },
      { id: "value", label: "We want good value for what we pay", votes: { CU: 1, MON: 1, SU: 1 } },
      { id: "fit", label: "We'll pay for the right fit" },
    ],
  },
  {
    id: "q19",
    section: "setup",
    topic: "Timing",
    label: "How soon do you need it running?",
    options: [
      { id: "week", label: "This week", votes: { MON: 1, ASA: 1, CU: 1 } },
      { id: "month", label: "Within a month" },
      { id: "months", label: "We can invest a few months", votes: { AT: 1, SU: 1 } },
    ],
  },
  {
    id: "q20",
    section: "setup",
    topic: "Setup",
    label: "Who will set it up and maintain it?",
    options: [
      { id: "ourselves", label: "We'll handle it ourselves" },
      { id: "help", label: "We'd like help getting started" },
      { id: "build", label: "We want someone to build and manage it" },
    ],
  },
];

// ---- Answer helpers ----------------------------------------------------------

/** True when question `q` was answered with any of `ids`. Works for single and multi select. */
export function picked(answers: QuizAnswers, q: string, ...ids: string[]): boolean {
  const value = answers[q];
  if (value === undefined) return false;
  const chosen = Array.isArray(value) ? value : [value];
  return chosen.some((id) => ids.includes(id));
}

// ---- Combination bonuses (spec §6) -----------------------------------------

export interface Bonus {
  id: string;
  /** Shown as a "because" line when the bonus lifts the winner. */
  reason: string;
  when: (a: QuizAnswers) => boolean;
  votes: Votes;
}

export const BONUSES: Bonus[] = [
  {
    id: "agency-billing",
    reason: "An agency where billing hours is core",
    when: (a) => picked(a, "q2", "agency") && picked(a, "q16", "core"),
    votes: { TW: 3 },
  },
  {
    id: "avoid-diy",
    reason: "A team that avoids new software, setting it up themselves",
    when: (a) => picked(a, "q3", "avoid") && picked(a, "q20", "ourselves"),
    votes: { MON: 2, ASA: 2, AT: -2, SU: -2 },
  },
  {
    id: "portal-own-records",
    reason: "Clients log in and see only their own records",
    when: (a) => picked(a, "q12", "portal", "submit") && picked(a, "q14", "own"),
    votes: { AT: 2 },
  },
  {
    id: "volume",
    reason: "A large record count that keeps growing every month",
    when: (a) =>
      picked(a, "q9", "5k-50k", "50k-125k", "125k+") && picked(a, "q10", "hundreds", "thousands"),
    // SmartSuite stops at 400,000 per solution even on Enterprise; Airtable
    // keeps going with HyperDB.
    votes: { AT: 2, SU: 1 },
  },
];

// ---- Feature gaps ------------------------------------------------------------

/**
 * A need some platforms can't meet on their own. Votes only reward the
 * platforms that have a feature, which leaves the ones without it a point or
 * two behind: splitting hairs over something that decides the choice. A gap
 * takes `GAP_PENALTY` points off every platform in `lacks` and names the gap on
 * that platform's row, so the ranking shows why it dropped.
 *
 * Gaps that share a `question` don't stack: a platform missing two things
 * the same answer asked for still loses `GAP_PENALTY` once, so one answer
 * can't sink a platform on its own.
 *
 * Only features confirmed in the vendors' own docs on 2026-10-21 are here.
 */
export interface FeatureGap {
  id: string;
  /** The question whose answer triggers it; gaps on one question don't stack. */
  question: string;
  /** Shown on the platform's row: what it doesn't have. */
  label: string;
  /** Shown on the top platform when it has the feature: what it does have. */
  hasLabel: string;
  when: (a: QuizAnswers) => boolean;
  lacks: PlatformCode[];
}

export const GAP_PENALTY = 2;

export const FEATURE_GAPS: FeatureGap[] = [
  {
    // Airtable Portals (an add-on on Team and up) is the only built-in branded
    // client portal of the seven. Everyone else needs Softr or a similar tool.
    id: "client-portal",
    question: "q12",
    label: "No built-in client portal",
    hasLabel: "Built-in client portal",
    when: (a) => picked(a, "q12", "portal"),
    lacks: ["CU", "MON", "ASA", "TW", "SS", "SU"],
  },
  {
    // Teamwork.com builds invoices from logged time on every plan. The others
    // track hours at best and invoice through QuickBooks or an add-on.
    id: "invoicing",
    question: "q16",
    label: "No built-in invoicing",
    hasLabel: "Built-in invoicing",
    when: (a) => picked(a, "q16", "core"),
    lacks: ["CU", "AT", "MON", "ASA", "SS", "SU"],
  },
  {
    // Airtable and Smartsheet need an extension or a paid add-on (Smartsheet
    // Resource Management) to track time at all.
    id: "time-tracking",
    question: "q16",
    label: "No built-in time tracking",
    hasLabel: "Built-in time tracking",
    when: (a) => picked(a, "q16", "core", "occasionally"),
    lacks: ["AT", "SS"],
  },
  {
    // Task tools, not databases. Airtable and SmartSuite get there on their
    // top plans, which the volume pointer says.
    id: "volume",
    question: "q9",
    label: "Not built for this many records",
    hasLabel: "Holds this many records on its top plan",
    when: (a) => needsCustomBuild(a),
    lacks: ["CU", "MON", "ASA", "TW", "SS"],
  },
];

/**
 * Past 125,000 records, or on track to pass it within a year or two, every
 * platform here means its top plan or a workaround (spec §6). Checked
 * 2026-10-21: SmartSuite holds 400,000 per solution on Enterprise only,
 * Airtable's large-data HyperDB is Enterprise Scale only, monday.com caps a
 * board at 10,000 items (100,000 on Enterprise).
 */
export function needsCustomBuild(a: QuizAnswers): boolean {
  return picked(a, "q9", "125k+") || (picked(a, "q9", "50k-125k") && picked(a, "q10", "thousands"));
}

/** Portal line on an Airtable result (spec §6). */
export function wantsPortal(a: QuizAnswers): boolean {
  return (
    picked(a, "q12", "portal", "submit") ||
    picked(a, "q14", "own") ||
    picked(a, "q13", "11-50", "51-200")
  );
}

/** More than 200 outside people skips scoring (spec §4). */
export function needsConversation(a: QuizAnswers): boolean {
  return picked(a, "q13", "200+");
}

// ---- Plan pointers (spec §7) -----------------------------------------------

export interface PlanPointer {
  id: string;
  text: string;
  when: (a: QuizAnswers) => boolean;
}

export const PLAN_POINTERS: PlanPointer[] = [
  {
    id: "free",
    text: "Free plans cap how many people and records you can have. Check what the free plan leaves out for a team your size.",
    when: (a) => picked(a, "q18", "free"),
  },
  {
    id: "sso",
    text: "SSO and audit logs usually sit on the top one or two plans.",
    when: (a) => picked(a, "q15", "required"),
  },
  {
    id: "records",
    text: "Every plan caps how many records it holds. Check the cap against your count.",
    when: (a) =>
      !needsCustomBuild(a) && (picked(a, "q9", "50k-125k", "125k+") || picked(a, "q10", "thousands")),
  },
  {
    id: "volume",
    text: "Airtable and SmartSuite hold this many records only on their top plans. Airtable's option for very large data is HyperDB, on Enterprise Scale.",
    when: (a) => needsCustomBuild(a),
  },
  {
    id: "automation",
    text: "Automations are counted per month, and the allowance grows with the plan.",
    when: (a) => picked(a, "q11", "most"),
  },
  {
    id: "outside-users",
    text: "Outside users are priced differently on every platform: some are free guests, some are paid seats.",
    when: (a) =>
      picked(a, "q12", "view", "submit", "portal") || picked(a, "q13", "1-10", "11-50", "51-200"),
  },
  {
    id: "hipaa",
    text: "If you store patient information, you need a plan where the vendor signs a HIPAA agreement (a BAA). On most platforms that's the top plan only.",
    when: (a) => picked(a, "q2", "healthcare"),
  },
  {
    id: "nonprofit",
    text: "Ask about a nonprofit discount. Most of these platforms offer one.",
    when: (a) => picked(a, "q2", "nonprofit"),
  },
];
