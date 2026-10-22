import type { QuizQuestion } from "../questions";
import "../../question-row.css";

/**
 * One Platform Picker question. Wears the questionnaire's run-row styles
 * (.dl-frow / .dl-fanswer) so the quiz reads as part of Decision Lab, not a
 * second app bolted on.
 */
export function PickerQuestion({
  question,
  index,
  value,
  onChange,
  showMissing,
}: {
  question: QuizQuestion;
  index: number;
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
  showMissing: boolean;
}) {
  const chosen = value === undefined ? [] : Array.isArray(value) ? value : [value];
  const answered = chosen.length > 0;
  const missing = showMissing && !answered;
  const kind = question.multi ? "checkboxes" : "choice";

  function toggle(optionId: string) {
    if (!question.multi) {
      onChange(optionId);
      return;
    }
    const next = chosen.includes(optionId)
      ? chosen.filter((id) => id !== optionId)
      : [...chosen, optionId];
    onChange(next.length > 0 ? next : undefined);
  }

  return (
    <div className="dl-frow" data-answered={answered} data-missing={missing}>
      <div className="dl-frow-head">
        <span className="dl-frow-num">{index}</span>
        <div className="dl-frow-text">
          <p className="dl-frow-label">{question.label}</p>
          {question.multi && <p className="dl-frow-desc">Pick all that apply.</p>}
        </div>
      </div>

      <div
        className="dl-frow-options"
        role={question.multi ? "group" : "radiogroup"}
        aria-label={question.label}
      >
        {question.options.map((option) => {
          const selected = chosen.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className="dl-fanswer"
              data-selected={selected}
              role={question.multi ? "checkbox" : "radio"}
              aria-checked={selected}
              onClick={() => toggle(option.id)}
            >
              <span className="dl-fanswer-mark" data-kind={kind} aria-hidden="true" />
              <span className="dl-fanswer-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      {missing && <p className="dl-frow-missing">Pick an answer to keep going.</p>}
    </div>
  );
}
