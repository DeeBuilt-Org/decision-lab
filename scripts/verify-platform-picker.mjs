/**
 * Persona check for the Platform Picker (docs/PLATFORM_PICKER_SPEC.md §8).
 * Run with: node scripts/verify-platform-picker.mjs
 *
 * Unlike verify-scoring.mjs, this imports the real engine instead of mirroring
 * it. The quiz is data plus one pure module, and Node 22.18+ strips the
 * TypeScript types on load, so there is nothing to keep in sync by hand.
 *
 * Prints every platform's earned, possible and fit for each persona. A persona
 * that lands somewhere other than expected is reported, not fixed by nudging
 * votes: the votes are a judgment call for Ruthnie, not for this script.
 */

import { scoreQuiz } from "../src/quizzes/platform-picker/engine.ts";
import { QUESTIONS } from "../src/quizzes/platform-picker/questions.ts";

// Neutral answers for anything a persona doesn't name. Chosen to carry as few
// votes as possible, so the persona's own answers decide the result.
const NEUTRAL = {
  q1: "2-5", q2: "other", q3: "spreadsheets", q4: "mix", q5: "cards", q6: "sometimes",
  q7: "sometimes", q8: ["table"], q9: "unsure", q10: "dozens", q11: "reminders",
  q12: "no", q13: "none", q14: "everyone", q15: "no", q16: "no", q17: ["unsure"],
  q18: "fit", q19: "month", q20: "ourselves",
};

const PERSONAS = [
  {
    name: "Solo consultant",
    expect: ["TW"],
    answers: { q1: "solo", q2: "agency", q4: "billing", q16: "core", q18: "free" },
  },
  {
    name: "Home-services company",
    expect: ["MON"],
    answers: { q1: "6-15", q2: "service", q3: "avoid", q4: "requests", q5: "cards", q12: "view", q18: "value" },
  },
  {
    name: "Ops team with a builder",
    expect: ["AT", "SU"],
    answers: {
      q1: "16-50", q2: "internal", q3: "builder", q5: "connected", q6: "constantly",
      q9: "50k-125k", q11: "handoffs", q15: "required", q18: "fit",
    },
  },
  {
    name: "PMO team",
    expect: ["SS"],
    answers: { q1: "16-50", q3: "spreadsheets", q4: "projects", q5: "spreadsheet", q7: "central", q8: ["gantt"], q18: "fit" },
  },
  {
    name: "Small software team",
    expect: ["CU", "ASA"],
    answers: { q1: "2-5", q2: "software", q5: "todo", q19: "week", q18: "free" },
  },
  {
    // Ruthnie's 2026-10-21 test: SmartSuite came out on top for someone who
    // wanted a branded client portal, which SmartSuite doesn't have.
    name: "Service business with a client portal",
    expect: ["AT"],
    answers: { q2: "service", q3: "customize", q6: "constantly", q12: "portal", q13: "11-50", q14: "own" },
  },
  {
    // Ruthnie's 2026-10-21 test: SmartSuite on top at this volume with no
    // warning. Expect the custom-build section to lead the result.
    name: "High volume",
    expect: ["AT", "SU"],
    expectCustom: true,
    answers: { q2: "service", q6: "constantly", q9: "125k+", q10: "thousands" },
  },
  {
    name: "Big client base",
    expect: ["conversation"],
    answers: { q13: "200+" },
  },
];

let misses = 0;

for (const persona of PERSONAS) {
  const result = scoreQuiz({ ...NEUTRAL, ...persona.answers });
  const got = result.kind === "conversation" ? "conversation" : result.ranking[0].code;
  const custom = result.kind === "ranking" && result.custom;
  const ok = persona.expect.includes(got) && custom === (persona.expectCustom ?? false);
  if (!ok) misses += 1;

  console.log(
    `\n${ok ? "PASS" : "MISS"}  ${persona.name}: expected ${persona.expect.join(" or ")}, got ${got}${custom ? " (custom build shown)" : ""}`,
  );
  if (result.kind === "ranking") {
    for (const row of result.ranking) {
      const gaps = row.gaps.length > 0 ? `   gaps: ${row.gaps.join(", ")}` : "";
      console.log(
        `      ${row.code.padEnd(4)} earned ${String(row.earned).padStart(3)}   possible ${String(row.possible).padStart(3)}   fit ${row.fit.toFixed(3)}${gaps}`,
      );
    }
    const why = [...result.edge.rivalGaps, ...result.edge.reasons.slice(0, 3).map((r) => r.detail)];
    console.log(`      ahead of #2 because: ${why.join(" | ") || "nearly tied"}`);
  }
}

console.log(`\n${PERSONAS.length - misses} of ${PERSONAS.length} personas landed as expected.`);

// ---- Balance check -----------------------------------------------------------
// Answers the whole quiz at random many times and counts how often each
// platform ends up on top. Not a target to tune toward (real businesses don't
// answer at random), but a platform that almost never wins, or wins half the
// time, means the votes lean too hard one way.

const RUNS = 20000;
// Fixed seed, so two runs of this script print the same numbers.
let seed = 42;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const tops = {};
let conversations = 0;
for (let i = 0; i < RUNS; i++) {
  const answers = {};
  for (const q of QUESTIONS) {
    if (q.multi) {
      const picks = q.options.filter(() => random() < 0.35).map((o) => o.id);
      answers[q.id] = picks.length > 0 ? picks : [q.options[0].id];
    } else {
      answers[q.id] = q.options[Math.floor(random() * q.options.length)].id;
    }
  }
  const result = scoreQuiz(answers);
  if (result.kind === "conversation") {
    conversations += 1;
    continue;
  }
  const top = result.ranking[0].code;
  tops[top] = (tops[top] ?? 0) + 1;
}

const scored = RUNS - conversations;
console.log(`\nBalance: who comes out on top across ${scored} random answer sets`);
for (const [code, count] of Object.entries(tops).sort((a, b) => b[1] - a[1])) {
  const share = ((count / scored) * 100).toFixed(1);
  console.log(`      ${code.padEnd(4)} ${share.padStart(5)}%`);
}

process.exitCode = misses === 0 ? 0 : 1;
