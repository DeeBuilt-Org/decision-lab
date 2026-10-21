import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PLATFORMS, type PlatformCode } from "../platforms";
import { QUESTIONS } from "../questions";
import { MARKS } from "../marks";
import "./picker-card.css";

/**
 * The Platform Picker's card on Home. Built to look outward: the seven
 * platforms as app tiles in their own colors, a real question from the quiz
 * cycling through, and a small ranking that reshuffles with each question, so
 * a business sees what it's about to find out before it clicks.
 *
 * Motion pauses when the card is off screen and never starts for people who
 * have reduced motion turned on.
 */

/** Real quiz questions the card cycles through. Labels come from questions.ts. */
const SHOWCASE_IDS = ["q12", "q10", "q6", "q16", "q7", "q3"];
const SHOWCASE = SHOWCASE_IDS.map((id) => QUESTIONS.find((q) => q.id === id)?.label ?? "");

/**
 * One illustrative ranking per showcase question, as bar widths in percent.
 * Not computed: the card is a preview, and a real score needs all 20 answers.
 */
const PREVIEWS: Record<PlatformCode, number>[] = [
  { AT: 92, SU: 70, TW: 58, MON: 44, ASA: 40, CU: 32, SS: 22 },
  { SU: 88, AT: 84, SS: 52, MON: 40, CU: 34, ASA: 28, TW: 20 },
  { AT: 90, SU: 86, CU: 50, MON: 46, SS: 30, ASA: 24, TW: 18 },
  { TW: 94, CU: 66, SU: 50, MON: 36, ASA: 30, AT: 22, SS: 16 },
  { SS: 90, MON: 72, TW: 66, ASA: 46, CU: 34, AT: 26, SU: 24 },
  { MON: 86, ASA: 80, SS: 54, CU: 42, TW: 36, SU: 28, AT: 20 },
];

const ROTATE_MS = 3600;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PickerCard() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setStep((s) => (s + 1) % SHOWCASE.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [visible]);

  const preview = PREVIEWS[step];
  const ranked = [...PLATFORMS].sort((a, b) => preview[b.code] - preview[a.code]);
  const rankOf = new Map(ranked.map((p, i) => [p.code, i]));
  const open = () => navigate("/platform-picker");

  return (
    <div
      ref={ref}
      className="pp-card"
      onClick={open}
      // Hovering skips ahead, so the card answers a pointer right away
      // instead of making it wait for the next tick.
      onMouseEnter={() => setStep((s) => (s + 1) % SHOWCASE.length)}
    >
      <p className="pp-card-name">Platform Picker</p>

      <ul className="pp-card-tiles" aria-label="Platforms compared">
        {PLATFORMS.map((p) => {
          const mark = MARKS[p.code];
          return (
            <li
              key={p.code}
              className="pp-tile"
              data-code={p.code}
              data-full-color={mark.shapes || (mark.image && !mark.fillsTile) ? "true" : undefined}
              data-fills={mark.fillsTile ? "true" : undefined}
              title={p.name}
            >
              {mark.image ? (
                <img src={mark.image} alt="" className="pp-tile-img" />
              ) : mark.shapes ? (
                <svg viewBox={mark.viewBox} aria-hidden="true">
                  {mark.shapes.map((s, i) =>
                    s.ellipse ? (
                      <ellipse key={i} {...s.ellipse} fill={s.fill} />
                    ) : (
                      <path key={i} d={s.d} fill={s.fill} />
                    ),
                  )}
                </svg>
              ) : mark.path ? (
                <svg viewBox={mark.viewBox} aria-hidden="true">
                  <path d={mark.path} />
                </svg>
              ) : (
                <span className="pp-tile-letter" aria-hidden="true">
                  {mark.letter}
                </span>
              )}
              <span className="pp-sr">{p.name}</span>
            </li>
          );
        })}
      </ul>

      <div className="pp-card-body">
        <p className="pp-card-kicker">20 questions</p>
        {/* Keyed on the step so each new question replays the entrance. */}
        <p key={step} className="pp-card-question">
          {SHOWCASE[step]}
        </p>
      </div>

      <div className="pp-card-bars" aria-hidden="true">
        {PLATFORMS.map((p) => (
          <span
            key={p.code}
            className="pp-mini"
            data-code={p.code}
            style={{
              transform: `translateY(${(rankOf.get(p.code) ?? 0) * 100}%)`,
            }}
          >
            <span className="pp-mini-fill" style={{ width: `${preview[p.code]}%` }} />
          </span>
        ))}
      </div>

      <div className="pp-card-foot">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          aria-label="Start the Platform Picker"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
