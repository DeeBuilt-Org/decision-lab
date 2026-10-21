import { useMemo, useState } from "react";
import { Button, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { haptic } from "@/lib/haptics";
import { PLATFORMS } from "./platforms";
import { QUESTIONS, SECTIONS, type QuizAnswers } from "./questions";
import { isAnswered, scoreQuiz } from "./engine";
import { PickerQuestion } from "./components/PickerQuestion";
import { PickerResult } from "./components/PickerResult";
import "./platform-picker.css";

/**
 * The Platform Picker: a fixed, ready-made quiz (docs/PLATFORM_PICKER_SPEC.md).
 *
 * One section per step, then the result. Answers live in component state only:
 * the spec says the quiz saves nothing, so leaving the page starts it fresh.
 */

type Step = "intro" | number | "result";

const LAST_SECTION = SECTIONS.length - 1;

/** Question numbers run across sections, so the last one reads "20". */
const NUMBER_OF = new Map(QUESTIONS.map((q, i) => [q.id, i + 1]));

const PLATFORM_LIST = PLATFORMS.map((p) => p.name).join(", ");

export default function PlatformPickerPage() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showMissing, setShowMissing] = useState(false);

  const result = useMemo(() => (step === "result" ? scoreQuiz(answers) : null), [step, answers]);

  function go(next: Step) {
    setShowMissing(false);
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  function answer(questionId: string, value: string | string[] | undefined) {
    haptic("tap");
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[questionId];
      else next[questionId] = value;
      return next;
    });
  }

  if (step === "intro") {
    return (
      <div className="pp">
        <header className="pp-intro">
          <p className="dl-eyebrow">Platform Picker</p>
          <h1 className="pp-title">Which work-management platform fits your business?</h1>
          <p className="pp-lede">
            20 questions about your team and clients, to help you choose the platform that may fit
            best.
          </p>
          <p className="pp-fine">Compares {PLATFORM_LIST}.</p>
          <div>
            <Button type="primary" size="large" onClick={() => go(0)}>
              Start <ArrowRightOutlined />
            </Button>
          </div>
        </header>
      </div>
    );
  }

  if (step === "result" && result) {
    return (
      <div className="pp">
        <PickerResult
          result={result}
          onEdit={() => go(0)}
          onRestart={() => {
            setAnswers({});
            go("intro");
          }}
        />
      </div>
    );
  }

  const sectionIndex = typeof step === "number" ? step : 0;
  const section = SECTIONS[sectionIndex];
  const questions = QUESTIONS.filter((q) => q.section === section.id);
  const isLast = sectionIndex === LAST_SECTION;

  function next() {
    const missing = questions.filter((q) => !isAnswered(answers, q));
    if (missing.length > 0) {
      setShowMissing(true);
      message.warning(
        missing.length === 1
          ? "One question on this page still needs an answer."
          : `${missing.length} questions on this page still need answers.`,
      );
      return;
    }
    haptic("tap");
    go(isLast ? "result" : sectionIndex + 1);
  }

  return (
    <div className="pp">
      <header className="pp-step-head">
        <p className="dl-eyebrow">
          Step {sectionIndex + 1} of {SECTIONS.length}
        </p>
        <h1 className="dl-h1">{section.title}</h1>
        <div
          className="pp-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={SECTIONS.length}
          aria-valuenow={sectionIndex + 1}
          aria-label="Quiz progress"
        >
          {SECTIONS.map((s, i) => (
            <span key={s.id} className="pp-progress-seg" data-done={i <= sectionIndex} />
          ))}
        </div>
      </header>

      <ol className="pp-questions">
        {questions.map((q) => (
          <li key={q.id}>
            <PickerQuestion
              question={q}
              index={NUMBER_OF.get(q.id) ?? 0}
              value={answers[q.id]}
              onChange={(value) => answer(q.id, value)}
              showMissing={showMissing}
            />
          </li>
        ))}
      </ol>

      <div className="pp-nav">
        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => go(sectionIndex === 0 ? "intro" : sectionIndex - 1)}
        >
          Back
        </Button>
        <Button type="primary" size="large" onClick={next}>
          {isLast ? "See your result" : "Next"} <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
}
