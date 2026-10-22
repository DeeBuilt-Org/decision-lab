/**
 * IndexedDB-backed CRUD for the scorecard library — the reusable assets.
 *
 * Type-agnostic: it stores and returns whole `Scorecard` rows and never reaches
 * into `content`. Anything that needs to understand a particular type's payload
 * belongs in that type's own folder under src/types/, not here.
 *
 * Storage is IndexedDB rather than localStorage. Runs each embed a full
 * scorecard snapshot, so the data grows in exactly the shape that silently
 * blows the localStorage quota (this has bitten the family before).
 */

import { uuid } from "@/lib/uuid";
import { typeInfo } from "@/types/registry";
import { getDb } from "./db";
import {
  SCORECARDS_STORE,
  type Scorecard,
  type ScorecardContent,
  type ScorecardType,
} from "./types";

/**
 * Normalize on read. Currently: advanced thresholds always come back
 * highest-floor-first, so the editor and the verdict UI never have to re-sort
 * them independently. Type-specific, but cheap and centralized — the
 * alternative is every consumer remembering to sort.
 */
function normalize(scorecard: Scorecard): Scorecard {
  if (scorecard.content.type === "advanced") {
    return {
      ...scorecard,
      content: {
        type: "advanced",
        doc: {
          ...scorecard.content.doc,
          thresholds: [...scorecard.content.doc.thresholds].sort((a, b) => b.min - a.min),
        },
      },
    };
  }
  return scorecard;
}

export const scorecardsRepo = {
  async list(): Promise<Scorecard[]> {
    const db = await getDb();
    const all = (await db.getAll(SCORECARDS_STORE)) as Scorecard[];
    return all.map(normalize).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async listByType(type: ScorecardType): Promise<Scorecard[]> {
    const db = await getDb();
    const rows = (await db.getAllFromIndex(SCORECARDS_STORE, "type", type)) as Scorecard[];
    return rows.map(normalize).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async get(id: string): Promise<Scorecard | undefined> {
    const db = await getDb();
    const row = (await db.get(SCORECARDS_STORE, id)) as Scorecard | undefined;
    return row ? normalize(row) : undefined;
  },

  async create(opts: {
    type: ScorecardType;
    name?: string;
    description?: string;
    /** A prepared payload (from a template). Omitted, the type's empty one is used. */
    content?: ScorecardContent;
  }): Promise<Scorecard> {
    const db = await getDb();
    const now = Date.now();
    const content = opts.content ?? typeInfo(opts.type).emptyContent();
    const scorecard: Scorecard = {
      id: uuid(),
      // `type` is duplicated onto the row so the library can filter and badge
      // without reaching into content. Sourced from content.type, never from
      // opts.type, so the two can't disagree when a template is passed.
      type: content.type,
      name: opts.name?.trim() || "Untitled scorecard",
      description: opts.description,
      content,
      createdAt: now,
      updatedAt: now,
    };
    await db.put(SCORECARDS_STORE, scorecard);
    return normalize(scorecard);
  },

  /** Patch any subset. `updatedAt` always refreshes; `type` follows content. */
  async update(
    id: string,
    patch: Partial<Omit<Scorecard, "id" | "type" | "createdAt">>,
  ): Promise<Scorecard | undefined> {
    const db = await getDb();
    const existing = (await db.get(SCORECARDS_STORE, id)) as Scorecard | undefined;
    if (!existing) return undefined;
    const content = patch.content ?? existing.content;
    const updated: Scorecard = {
      ...existing,
      ...patch,
      id,
      content,
      type: content.type,
      createdAt: existing.createdAt,
      updatedAt: Date.now(),
    };
    await db.put(SCORECARDS_STORE, updated);
    return normalize(updated);
  },

  async duplicate(id: string): Promise<Scorecard | undefined> {
    const db = await getDb();
    const existing = (await db.get(SCORECARDS_STORE, id)) as Scorecard | undefined;
    if (!existing) return undefined;
    const now = Date.now();
    const copy: Scorecard = {
      ...existing,
      id: uuid(),
      name: `${existing.name} (copy)`,
      content: reidentify(existing.content),
      createdAt: now,
      updatedAt: now,
    };
    await db.put(SCORECARDS_STORE, copy);
    return normalize(copy);
  },

  async remove(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(SCORECARDS_STORE, id);
  },
};

/**
 * Deep-copy a payload with every nested id re-minted.
 *
 * Sharing question or option ids between two scorecards would make a run's
 * answers map ambiguous about which scorecard it was scored against, so a
 * duplicate must be structurally identical but referentially fresh. Each type
 * knows its own nesting, hence the switch — the one place in this file that
 * legitimately looks inside `content`.
 */
function reidentify(content: ScorecardContent): ScorecardContent {
  switch (content.type) {
    case "advanced":
      return {
        type: "advanced",
        doc: {
          criteria: content.doc.criteria.map((c) => ({
            ...c,
            id: uuid(),
            options: c.options.map((o) => ({ ...o, id: uuid() })),
          })),
          thresholds: content.doc.thresholds.map((t) => ({ ...t, id: uuid() })),
        },
      };
    case "forms":
      return {
        type: "forms",
        doc: {
          ...content.doc,
          questions: content.doc.questions.map((q) => ({
            ...q,
            id: uuid(),
            options: q.options.map((o) => ({ ...o, id: uuid() })),
          })),
          thresholds: content.doc.thresholds.map((t) => ({ ...t, id: uuid() })),
        },
      };
  }
}
