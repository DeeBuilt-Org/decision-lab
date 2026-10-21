# Decision Lab — Platform Picker

**Written:** 2026-10-21 · **Owner:** Ruthnie · **Status:** shipped 2026-10-21. This
document describes the quiz as built; the Progress section at the end records how
it got here.

**Revised 2026-10-21 (same day, before the build):** pricing pulled out. Dollar
amounts, seat minimums, plan tiers and plan facts change too often for a quiz to
carry them. Budget is now a broad question that votes like the others, plan
advice is generic pointers tied to the answers, and every result links to the
platform's own pricing page. Sections 4, 7, 8 and 10 reflect that.

The Platform Picker is a hard-coded quiz that recommends a work-management
platform to a small business. It is a DeeBuilt resource: the person answers 20
questions and gets all seven platforms ranked, with the answers that put the top
one ahead.

It is **not** a scorecard type. Decision Lab's `forms` and `advanced` types are
build-your-own tools that score on one number. This quiz needs seven separate
tallies, combination bonuses and feature gaps, so it is built as its own fixed
screen at `/platform-picker`, with all its code in `src/quizzes/platform-picker/`. The build-your-own types stay as they are. This is the first
of what may become several ready-made business-decision quizzes.

**Build it exactly as written here. No authoring features** — no editor, no way
to make a quiz like it. The questions, votes and rules are data in code.

---

## 1. The seven results

| Code | Platform |
|---|---|
| CU | ClickUp |
| AT | Airtable (client portal line names Airtable Portals, then Softr, §6) |
| MON | monday.com |
| ASA | Asana |
| TW | Teamwork.com |
| SS | Smartsheet |
| SU | SmartSuite |

Softr is not one of the seven. It builds a portal on top of data that lives
elsewhere, so it only appears in the client portal line.

Smartsheet stays in. Its votes are narrow (spreadsheet-minded, timeline-heavy
teams), so it only wins for that profile.

---

## 2. The questions

All single select unless marked. Sections are page groupings for the run screen.

**About your team**
1. How many people will work in the platform day to day? — Just me · 2 to 5 · 6 to 15 · 16 to 50 · More than 50
2. What best describes your business? — Agency or consultancy that bills clients · Trades or field service business · Healthcare practice · Internal operations or admin team · Software or product team · Nonprofit · Other
3. How comfortable is your team with new software? — We avoid it when we can · Comfortable with email and spreadsheets · We enjoy customizing our tools · We have someone who builds systems

**How you work**
4. What are you mainly trying to organize? — Projects with deadlines and tasks · Repeating requests like intake or orders · A big list of records like clients or jobs · Client work where hours and billing matter · A mix of everything
5. When you picture your work, what does it look like? — A spreadsheet · Cards moving through stages · A to-do list · Connected records like clients linked to jobs
6. Do pieces of your information need to link to each other? — Yes, constantly · Sometimes · Not really
7. How important are detailed timelines with task dependencies? — Central to our work · Helpful sometimes · We don't need them
8. Which views would your team use? **(multi select)** — Table · Kanban board · Calendar · Timeline or Gantt · Dashboards · Forms · Map

**Data volume**
9. About how many records (clients, jobs or orders) will you have after a year? — Under 1,000 · 1,000 to 5,000 · 5,000 to 50,000 · 50,000 to 125,000 · More than 125,000 · Not sure
10. How many new records come in each month? — A handful · Dozens · Hundreds · Thousands
11. How much do you want to automate? — Nothing yet · Simple reminders and notifications · Handoffs between people and steps · Most of our process, including other apps

**Access and permissions**
12. Do clients or outside people need to log in? — No · Yes, to view progress · Yes, to submit requests or files · Yes, we want a branded client portal
13. How many outside people would need access? — None · 1 to 10 · 11 to 50 · 51 to 200 · More than 200
14. Do different people need to see different things? — No, everyone sees everything · Some views by team or role · Yes, people should only see their own records
15. Do you need security features like SSO or audit logs? — No · Nice to have · Required

**Business needs**
16. Do you track time or bill clients by the hour or retainer? — Yes, it's core to the business · Occasionally · No
17. What does it need to connect with? **(multi select)** — Accounting software · CRM · Email and calendar · Website forms · Custom apps through an API · Not sure yet

**Budget and setup**
18. How much does cost drive this decision? — We need a free plan, or close to it · We want good value for what we pay · We'll pay for the right fit
19. How soon do you need it running? — This week · Within a month · We can invest a few months
20. Who will set it up and maintain it? — We'll handle it ourselves · We'd like help getting started · We want someone to build and manage it

Every question is required. The "Get your results" section (name, email,
business name) is **not built** in this session — see §9.

---

## 3. How a result is worked out

1. **Talk-to-us check** (§4) ends the quiz early for very large client bases.
2. **Votes** (§5) add points to platforms from each answer.
3. **Combination bonuses** (§6) add or remove points for specific answer pairs.
4. **Fair scoring:** each remaining platform gets
   `fit = earned ÷ possible`, where
   - `earned` = its votes from the chosen answers + its bonuses
   - `possible` = for every question, the most that platform could have got on
     that question (single select: its highest vote on any option; multi
     select: the sum of its votes across all options), added up. Bonuses are
     not in `possible`.
   - `possible` of 0 → fit 0.
   Without this, Airtable and SmartSuite win by default because they carry votes
   on the most answers.
5. **Feature gaps** (§6) take points off platforms that can't meet a need on
   their own. Like bonuses, they count in `earned` and not in `possible`.
6. **Result:** all seven platforms ranked by fit, highest first. A tie on fit
   goes to the higher `earned`.

The engine is pure and deterministic, in its own module, with the question and
vote data in a separate data module.

---

## 4. Talk-to-us check

No pricing rule-outs. The quiz carries no dollar amounts, seat counts or plan
names, because they change faster than anyone will update a quiz.

**More than 200 outside people** (question 13): skip scoring and show the
"talk to us" result. At that size the choice turns on how the client portal is
built and priced, which is a conversation.

---

## 5. Votes

3 = strong · 2 = normal · 1 = light. Answers not listed carry no votes on
purpose.

| # | Answer | Votes |
|---|---|---|
| 1 | Just me | CU 2, AT 2, SS 1 |
| 1 | 2 to 5 | CU 2, ASA 2, AT 2, TW 1 |
| 1 | 6 to 15 | ASA 1, MON 1, CU 1, TW 1 |
| 1 | 16 to 50 / More than 50 | MON 2, ASA 2, SS 2, TW 2 |
| 2 | Agency or consultancy | TW 3 |
| 2 | Trades or field service / Healthcare practice | AT 2, SU 2 |
| 2 | Internal operations | MON 2, SU 2 |
| 2 | Software or product team | CU 2, ASA 2 |
| 2 | Nonprofit | ASA 2, MON 1 |
| 3 | We avoid it | MON 2, ASA 2 |
| 3 | Email and spreadsheets | SS 2 |
| 3 | We enjoy customizing | CU 2, SU 2 |
| 3 | Someone who builds systems | AT 2, SU 2 |
| 4 | Projects with deadlines | ASA 2, SS 2, MON 2 |
| 4 | Repeating requests | MON 2, SU 2, AT 2 |
| 4 | A big list of records | AT 2, SU 2 |
| 4 | Hours and billing | TW 3 |
| 4 | A mix of everything | CU 2, SU 2 |
| 5 | A spreadsheet | SS 2 |
| 5 | Cards moving through stages | MON 2 |
| 5 | A to-do list | ASA 2, CU 2 |
| 5 | Connected records | AT 2, SU 2 |
| 6 | Yes, constantly | AT 3, SU 3, CU 1, MON 1 |
| 6 | Not really | ASA 1, MON 1, SS 1 |
| 7 | Central to our work | SS 2, TW 2, MON 2 |
| 7 | We don't need them | AT 1, CU 1 |
| 8 | Timeline or Gantt | SS 1 |
| 8 | Dashboards | MON 1, SS 1 |
| 8 | Map | AT 1, SU 1, CU 1, MON 1 |
| 9 | 5,000 to 50,000 | AT 2, SU 1 |
| 9 | 50,000 to 125,000 | AT 2, SU 1 |
| 9 | More than 125,000 | AT 1, SU 1 |
| 10 | Hundreds / Thousands | AT 1, SU 1 |
| 11 | Nothing yet | MON 1, ASA 1 |
| 11 | Handoffs between people and steps | AT 2, SU 2 |
| 11 | Most of our process, including other apps | AT 2, SU 1 |
| 12 | View progress | TW 2, MON 2, ASA 1 |
| 12 | Submit requests or files | AT 2, SU 1 |
| 12 | Branded client portal | AT 3 |
| 14 | Some views by team or role | MON 1, CU 1, ASA 1 |
| 14 | Only their own records | AT 2, SU 2 |
| 15 | Required | AT 3, SS 1 |
| 16 | Yes, core to the business | TW 3, CU 1 |
| 16 | Occasionally | CU 1 |
| 17 | Accounting software | TW 1 |
| 17 | CRM | TW 1, MON 1 |
| 17 | Email and calendar | ASA 1, CU 1 |
| 17 | Custom apps through an API | AT 1 |
| 18 | We need a free plan, or close to it | CU 3, ASA 1 |
| 18 | We want good value for what we pay | CU 1, MON 1, SU 1 |
| 19 | This week | MON 1, ASA 1, CU 1 |
| 19 | We can invest a few months | AT 1, SU 1 |

Question 18's votes rest only on facts that rarely change: ClickUp has the most
generous free plan and low paid plans, Asana's free plan is usable, and
SmartSuite and monday.com sit below Airtable per seat. "We'll pay for the right
fit" carries no votes, so cost drops out of the decision.

Questions 13 and 20 carry no votes: 13 feeds the talk-to-us check, 20 is the
lead flag (§7).

---

## 6. Combination bonuses

| When | Then |
|---|---|
| Q2 Agency **and** Q16 core | TW +3 |
| Q3 We avoid it **and** Q20 We'll handle it ourselves | MON +2, ASA +2, AT −2, SU −2 |
| Q12 Branded portal or Submit requests **and** Q14 Only their own records | AT +2 |
| Q9 5,000 or more **and** Q10 Hundreds or Thousands | AT +2, SU +1 |

**Feature gaps.** When one platform has a feature the others lack, a vote alone
leaves the others only a point or two behind. A gap takes points off every
platform without the feature and names the gap on its row of the ranking.

Every gap costs 2. Gaps on the same question don't stack: a platform missing
two things one answer asked for still loses 2.

| When | Gap | Lacking |
|---|---|---|
| Q12 Branded client portal | No built-in client portal | CU, MON, ASA, TW, SS, SU (only Airtable has Airtable Portals) |
| Q16 Core | No built-in invoicing | CU, AT, MON, ASA, SS, SU ([Teamwork invoicing](https://support.teamwork.com/projects/billing/adding-an-invoice), all plans) |
| Q16 Core or Occasionally | No built-in time tracking | AT, SS (Smartsheet needs the paid Resource Management add-on) |
| High volume (below) | Not built for this many records | CU, MON, ASA, TW, SS |

**High volume and the custom build.** High volume means Q9 More than 125,000,
or Q9 50,000 to 125,000 together with Q10 Thousands. At that size every
platform means its top plan or a workaround (checked 2026-10-21: SmartSuite
400,000 per solution on Enterprise only; Airtable HyperDB on Enterprise Scale
only; monday.com 10,000 items per board, 100,000 on Enterprise). The result
then opens with a custom-build box, above the ranking: "These platforms may not
be a good fit for the volume of your work. You might need something custom,
built on a database that can handle all of your business." with a Talk to
DeeBuilt button. The Q20 offer at the bottom is hidden so the button isn't
there twice. A plan pointer names HyperDB.

Checked and not made gaps: linked records (Asana has one-way reference fields
since September 2025; ClickUp has Relationships, monday.com has Connect Boards)
and record-level permissions (plan coverage not confirmed).

Vote changes from the same check: Q6 "Yes, constantly" adds CU 1, MON 1. Q8 Map
adds CU 1, MON 1 (both have Map views). Q16 "Core" adds CU 1.

**Client portal line.** When Airtable is on top and any of: Q12 Branded portal
or Submit requests · Q14 Only their own records · Q13 11 to 50 or 51 to 200,
name Airtable Portals first and Softr second. When another platform is on top
and Q12 is Branded portal, say it has no built-in portal and needs a separate
portal tool.

Changed 2026-10-21 after Ruthnie's test put SmartSuite on top for a branded
portal: SmartSuite has guest access and public views but no portal of its own
([SmartSuite](https://www.smartsuite.com/blog/create-a-client-portal-in-smartsuite)),
and Airtable has its own add-on
([Airtable Portals](https://support.airtable.com/docs/using-airtable-portals-for-external-collaborators.md)).

---

## 7. The result screen

- **The ranking:** all seven platforms in order, each with a bar for its fit,
  "earned of possible points", any feature gaps, and a link to its pricing page.
- **The top platform** opens up: one line on what it is, and up to three
  answers that gave it more points than #2 (plus #2's feature gaps). Listing
  its biggest answers instead would show lines #2 scored on just as well. When
  nothing separates them, the result says they scored almost the same. Under
  its description, "What tipped the scales:" lists the feature gaps (§6) their
  answers raised that it does meet. At most two today.
- The client portal line, when triggered (§6).
- **Plan pointers:** generic notes tied to answers, true for any platform
  (below). No plan names, no prices.
- **Lead flag (Q20):** "We want someone to build and manage it" shows a strong
  DeeBuilt offer; "We'd like help getting started" shows a lighter one. "We'll
  handle it ourselves" shows neither. The link goes to a DeeBuilt contact URL
  kept as one constant.
- The "talk to us" result from §4.

All result copy is written in the build session from `~/.claude/VOICE.md` and
approved by Ruthnie before it ships. Mobile-first: the result reads as one
column at 375px.

**Plan pointers** (each shows when its answer is given):

| When | Pointer |
|---|---|
| Q18 Free or close | Free plans cap how many people and records you can have. Check what the free plan leaves out for a team your size. |
| Q15 Required | SSO and audit logs usually sit on the top one or two plans. |
| Q9 50,000 or more, or Q10 Thousands | Every plan caps how many records it holds. Check the cap against your count. |
| Q11 Most of our process | Automations are counted per month, and the allowance grows with the plan. |
| Q12 any "Yes", or Q13 any number | Outside users are priced differently on every platform: some are free guests, some are paid seats. |
| Q2 Healthcare practice | If you store patient information, you need a plan where the vendor signs a HIPAA agreement (a BAA). On most platforms that's the top plan only. |
| Q2 Nonprofit | Ask about a nonprofit discount. Most of these platforms offer one. |

Q2 "Service business like trades or healthcare" is split into "Trades or field
service business" and "Healthcare practice" (2026-10-21), both AT 2, SU 2, so
healthcare can raise HIPAA.

---

## 8. Checking the engine

Add a verification script beside `scripts/verify-scoring.mjs` that runs these
personas through the engine and prints each platform's earned, possible and fit.
Ruthnie reviews the output before the quiz ships. A persona that lands somewhere
other than the expected result is reported, not patched by nudging votes.

| Persona | Key answers | Expected |
|---|---|---|
| Solo consultant | Just me · Agency · Hours and billing · Q16 core · Free or close | TW |
| Home-services company | 6 to 15 · Service · We avoid it · Repeating requests · Cards · View progress · Good value | MON |
| Ops team with a builder | 16 to 50 · Internal ops · Builds systems · Connected records · Constantly · 50,000 to 125,000 · Handoffs · Required · Right fit | AT or SU (they tie on points) |
| Service business with a client portal | Service · We enjoy customizing · Constantly · Branded portal · 11 to 50 outside · Only their own records | AT |
| PMO team | 16 to 50 · Spreadsheets · Projects · A spreadsheet · Central · Gantt · Right fit | SS |
| Small software team | 2 to 5 · Software · To-do list · This week · Free or close | CU or ASA |
| High volume | Service · Constantly · More than 125,000 · Thousands | AT or SU, with the custom-build box |
| Big client base | More than 200 outside people | "talk to us" |

Answers a persona doesn't name use the same neutral defaults in the script.

The script (`node scripts/verify-platform-picker.mjs`) also runs a **balance
check**: 20,000 random answer sets with a fixed seed, printing how often each
platform comes out on top. Use it to see whether a vote change tilts the quiz;
don't tune to an even split, since real businesses don't answer at random.

---

## 9. Out of scope for this build

- **Lead capture.** Results show right away. The "Get your results" fields are
  not built, and nothing is sent anywhere. Sending results to Ruthnie (for
  example through a Cloudflare Worker) is a later session.
- **Authoring.** No editor, templates or settings for this quiz.
- **Saving runs.** The quiz does not write to IndexedDB.

---

## 10. Facts to check before launch

Checked 2026-10-21 against vendor docs: Map views (ClickUp and monday.com
confirmed; Airtable and SmartSuite have them), client portals, invoicing, time
tracking, record limits, HyperDB. Not confirmed, so kept as light votes or left
out: SmartSuite's plan for record-level permissions; Smartsheet's rows-per-sheet
limit (about 20,000, from memory).

Recheck the feature gaps (§6) and the record limits once a year. They are the
facts most likely to change.

The pricing links on the result screen come from this list.

**Sources (checked 2026-10-21):**
[Airtable pricing](https://www.airtable.com/pricing) ·
[Airtable SSO](https://support.airtable.com/articles/8571088137-Configuring-SSO-in-the-admin-panel) ·
[Airtable limits (Jetadmin)](https://www.jetadmin.io/blog/airtable-pricing-in-2026-plans-real-costs-and-when-to-upgrade/) ·
[monday.com pricing](https://monday.com/pricing) ·
[Asana pricing](https://asana.com/pricing) ·
[Asana nonprofits](https://asana.com/industry/nonprofit.md) ·
[ClickUp pricing](https://clickup.com/pricing) ·
[Smartsheet pricing](https://www.smartsheet.com/pricing) ·
[SmartSuite pricing](https://www.smartsuite.com/pricing) ·
[Teamwork.com pricing](https://www.teamwork.com/pricing/) ·
[Softr pricing update](https://community.softr.io/t/updates-to-our-pricing-plans/16811)

---

## Progress

**Open after ship (2026-10-21):**
- `DEEBUILT_CONTACT_URL` in `platforms.ts` is still `https://deebuilt.co`.
  Every "Talk to DeeBuilt" button uses it.
- Four new questions on the task tools' strengths (workload, goals, approvals,
  mobile) proposed to even the balance. Not built; waiting on Ruthnie.
- Design session next: Home card for the Platform Picker as the blueprint for
  the app's look, platform logos, repo move and DeeBuilt branding.

**2026-10-21, sixth pass (other platforms' strengths):**
- Added: Q1 "6 to 15" ASA 1, MON 1, CU 1, TW 1 (had no votes). Q8 Dashboards
  MON 1, SS 1. Q17 CRM adds MON 1. Q17 Email and calendar ASA 1, CU 1.
- Balance after: SU 23.7%, AT 23.6%, TW 17.1%, ASA 11.1%, MON 9.4%, CU 9.0%,
  SS 6.1%. Small movement: the quiz asks far more about data than about what
  task tools do best, so votes on existing answers can only move it a little.
  The real lever is new questions (workload, goals, approvals, mobile),
  pending Ruthnie.

**2026-10-21, fifth pass (SmartSuite review):**
- Where SmartSuite matched Airtable's points without matching it in practice:
  Q9 5,000 to 50,000 SU 2 → 1 (Team holds 5,000 per solution), Q11 "Most of our
  process, including other apps" SU 2 → 1 (fewer outside integrations), volume
  combination bonus SU +2 → +1 (stops at 400,000; Airtable has HyperDB).
- Q14 "Only their own records" left equal: SmartSuite's docs don't name the plan
  for record-level permissions, and Airtable gates its version too.
- Balance after: SU 24.6%, AT 24.0%, TW 16.5%, ASA 10.1%, MON 9.5%, CU 8.9%,
  SS 6.4%. 8 of 8 personas pass.

**2026-10-21, fourth pass:**
- Q2 split into trades and healthcare; healthcare adds the HIPAA/BAA pointer.
- Custom-build box and "Not built for this many records" gap for high volume.
  New "High volume" persona; 8 of 8 pass.
- Balance after this pass: SU 27.6%, AT 21.9%, TW 16.3%, ASA 9.8%, CU 9.0%,
  MON 9.0%, SS 6.3%. The volume gap lifts AT and SU, so the SmartSuite tilt
  grew. The SmartSuite vote review (third pass) is still waiting on Ruthnie.

**2026-10-21, third pass (balance):**
- Gaps added for invoicing and time tracking; all gaps cost 2 and don't stack
  per question. Votes corrected for linked records, Map view, time tracking.
- Result subtitle: "Ranked by the features that matter to you." Title:
  "Platforms to consider." Intro: "20 questions about your team and clients,
  to help you choose the platform that may fit best."
- Top platform shows "What tipped the scales:" with the dealbreakers it meets.
- Verify script now runs a balance check (20,000 random answer sets, fixed
  seed). Result: SU 23.5%, AT 19.5%, TW 18.3%, ASA 11.3%, CU 10.4%, MON 10.0%,
  SS 7.1%. SmartSuite leads because it shares most of Airtable's votes with
  fewer chances to score, so fair scoring flatters it. Not tuned yet: waiting
  on Ruthnie.

**2026-10-21, second pass after Ruthnie's test:**
- Result is now a ranking of all seven with point bars, not a single winner.
- Feature gaps added (client portal, −3). Q12 votes corrected. Portal line
  names Airtable Portals first, Softr second.
- "Why" lines now show what put #1 ahead of #2.
- Copy: "Run one now" removed, Home section renamed "DeeBuilt quizzes", intro
  rewritten without three-item lists, "Nothing you answer leaves this page"
  removed.
- Every left-edge bar removed app-wide (sidebar active item, DeeBuilt box,
  missing-answer row, dealbreaker row, disqualified verdict, focused question
  card). Those states now color the whole border.
- 7 of 7 personas pass, including the new portal persona (Airtable on top,
  SmartSuite #2 with "No built-in client portal").

**2026-10-21: built, waiting on Ruthnie's test.**

What shipped (uncommitted):
- `src/quizzes/platform-picker/`: `platforms.ts` (names, blurbs, pricing links,
  `DEEBUILT_CONTACT_URL`), `questions.ts` (questions, votes, bonuses, pointers),
  `engine.ts` (pure scoring), `PlatformPickerPage.tsx`, `components/PickerQuestion.tsx`,
  `components/PickerResult.tsx`, `platform-picker.css`. Self-contained, so it can
  move to another app later.
- Route `/platform-picker`, a "Platform Picker" nav item, and a "Ready-made
  quizzes" section on Home.
- `scripts/verify-platform-picker.mjs` imports the real engine (Node 22.18 strips
  the types). All 6 personas pass. The ops-team persona lands on SmartSuite
  (fit 0.609) with Airtable runner-up (0.467): they tie at 14 points.
- Question rows reuse the questionnaire's `run-row.css`. Typecheck clean.

Small departures from the text above:
- No match percentage on the result. A winner at 47% reads as a weak pick even
  when it's the clear winner, so the result names the platform and its reasons.
- A platform's fit floors at 0 when bonuses push its earned below 0.

Still open:
- `DEEBUILT_CONTACT_URL` is `https://deebuilt.co` until Ruthnie gives the real link.
- Result copy needs Ruthnie's approval (§7).
- Map view fact check (§10).
