import { PLATFORM_CODES, type PlatformCode } from "./platforms.ts";
import {
  BONUSES,
  FEATURE_GAPS,
  GAP_PENALTY,
  PLAN_POINTERS,
  QUESTIONS,
  needsConversation,
  needsCustomBuild,
  picked,
  wantsPortal,
  type QuizAnswers,
  type QuizQuestion,
} from "./questions.ts";

/**
 * The Platform Picker's scoring engine (spec §3). Pure and deterministic: the
 * same answers always give the same result, and nothing here touches React,
 * storage or the network.
 *
 * Fair scoring is the part that matters. Airtable and SmartSuite carry votes on
 * far more answers than anyone else, so a raw point total hands them the win by
 * default. Each platform is instead scored on the share of its own possible
 * points it earned: `fit = earned / possible`.
 */

/** One answer (or bonus) that gave a platform points, for the "because" lines. */
export interface Contribution {
  /** Question-and-option or bonus id, so two platforms' lines can be compared. */
  key: string;
  /** The question's short name, or "Together" for a combination bonus. */
  topic: string;
  /** The answer as the person picked it, or the bonus's reason. */
  detail: string;
  points: number;
}

export interface PlatformScore {
  code: PlatformCode;
  earned: number;
  possible: number;
  fit: number;
  /** Positive contributions only, strongest first. */
  contributions: Contribution[];
  /** Needs from their answers this platform can't meet on its own. */
  gaps: string[];
  /** Dealbreakers their answers raised that this platform does meet. */
  meets: string[];
}

/** Why the top platform sits above the second one. */
export interface Edge {
  /** Answers that gave the top platform more points than the second. */
  reasons: Contribution[];
  /** Gaps the second platform has and the top one doesn't. */
  rivalGaps: string[];
}

export type LeadLevel = "strong" | "light" | null;

/** Which client-login note the result shows, if any. */
export type PortalNote = "airtable" | "needs-tool" | null;

export type QuizResult =
  | { kind: "conversation"; lead: LeadLevel }
  | {
      kind: "ranking";
      /** Every platform, best fit first. */
      ranking: PlatformScore[];
      edge: Edge;
      /** Volume past what these platforms handle well: lead with a custom build. */
      custom: boolean;
      portal: PortalNote;
      pointers: string[];
      lead: LeadLevel;
    };

/** The most a platform could get on one question. Bonuses and gaps never count here. */
function questionPossible(q: QuizQuestion, code: PlatformCode): number {
  const votes = q.options.map((o) => o.votes?.[code] ?? 0);
  return q.multi ? votes.reduce((sum, v) => sum + v, 0) : Math.max(0, ...votes);
}

function chosenIds(answers: QuizAnswers, q: QuizQuestion): string[] {
  const value = answers[q.id];
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function scorePlatform(code: PlatformCode, answers: QuizAnswers): PlatformScore {
  let earned = 0;
  let possible = 0;
  const contributions: Contribution[] = [];
  const gaps: string[] = [];

  for (const q of QUESTIONS) {
    possible += questionPossible(q, code);
    for (const id of chosenIds(answers, q)) {
      const option = q.options.find((o) => o.id === id);
      const points = option?.votes?.[code] ?? 0;
      if (!option || points === 0) continue;
      earned += points;
      if (points > 0) {
        contributions.push({ key: `${q.id}:${id}`, topic: q.topic, detail: option.label, points });
      }
    }
  }

  for (const bonus of BONUSES) {
    if (!bonus.when(answers)) continue;
    const points = bonus.votes[code] ?? 0;
    if (points === 0) continue;
    earned += points;
    if (points > 0) {
      contributions.push({ key: bonus.id, topic: "Together", detail: bonus.reason, points });
    }
  }

  // One penalty per question, however many of its gaps apply.
  const penalized = new Set<string>();
  const meets: string[] = [];
  for (const gap of FEATURE_GAPS) {
    if (!gap.when(answers)) continue;
    if (!gap.lacks.includes(code)) {
      meets.push(gap.hasLabel);
      continue;
    }
    gaps.push(gap.label);
    if (penalized.has(gap.question)) continue;
    penalized.add(gap.question);
    earned -= GAP_PENALTY;
  }

  // A stable sort keeps question order among equal contributions, so the
  // "because" lines read in the order the person answered.
  contributions.sort((a, b) => b.points - a.points);

  return {
    code,
    earned,
    possible,
    fit: possible === 0 ? 0 : Math.max(0, earned) / possible,
    contributions,
    gaps,
    meets,
  };
}

/**
 * The answers where the top platform out-earned the second. Listing the top
 * platform's biggest answers instead would show lines the second platform
 * scored on just as well, which explains nothing.
 */
function edgeOver(top: PlatformScore, second: PlatformScore | undefined): Edge {
  if (!second) return { reasons: top.contributions, rivalGaps: [] };
  const rivalPoints = new Map(second.contributions.map((c) => [c.key, c.points]));
  const reasons = top.contributions
    .map((c) => ({ c, lead: c.points - (rivalPoints.get(c.key) ?? 0) }))
    .filter((x) => x.lead > 0)
    .sort((a, b) => b.lead - a.lead)
    .map((x) => x.c);
  const rivalGaps = second.gaps.filter((g) => !top.gaps.includes(g));
  return { reasons, rivalGaps };
}

function leadLevel(answers: QuizAnswers): LeadLevel {
  if (picked(answers, "q20", "build")) return "strong";
  if (picked(answers, "q20", "help")) return "light";
  return null;
}

function portalNote(top: PlatformCode, answers: QuizAnswers): PortalNote {
  if (top === "AT" && wantsPortal(answers)) return "airtable";
  // Forms and guest access cover submissions everywhere; only a branded
  // portal needs a second tool off Airtable.
  if (top !== "AT" && picked(answers, "q12", "portal")) return "needs-tool";
  return null;
}

export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const lead = leadLevel(answers);
  if (needsConversation(answers)) return { kind: "conversation", lead };

  const ranking = PLATFORM_CODES.map((code) => scorePlatform(code, answers)).sort(
    (a, b) => b.fit - a.fit || b.earned - a.earned,
  );
  const [top, second] = ranking;

  return {
    kind: "ranking",
    ranking,
    edge: edgeOver(top, second),
    custom: needsCustomBuild(answers),
    portal: portalNote(top.code, answers),
    pointers: PLAN_POINTERS.filter((p) => p.when(answers)).map((p) => p.text),
    lead,
  };
}

/** Every question is required; a multi select needs at least one pick. */
export function isAnswered(answers: QuizAnswers, q: QuizQuestion): boolean {
  return chosenIds(answers, q).length > 0;
}
