import { Button } from "antd";
import { ArrowLeftOutlined, ExportOutlined, ReloadOutlined } from "@ant-design/icons";
import type { Edge, LeadLevel, PlatformScore, PortalNote, QuizResult } from "../engine";
import {
  AIRTABLE_PORTALS_URL,
  DEEBUILT_CONTACT_URL,
  SOFTR_PRICING_URL,
  platform,
} from "../platforms";

/** How many "ahead because" lines the top platform gets (spec §7: two to three). */
const REASON_COUNT = 3;

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="pp-link" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ExportOutlined aria-hidden="true" />
    </a>
  );
}

function EdgeList({ edge, top, second }: { edge: Edge; top: string; second: string }) {
  const reasons = edge.reasons.slice(0, REASON_COUNT);
  if (reasons.length === 0 && edge.rivalGaps.length === 0) {
    return (
      <p className="pp-body">
        {top} and {second} scored almost the same on your answers. Look at both.
      </p>
    );
  }
  return (
    <ul className="pp-reasons">
      {edge.rivalGaps.map((gap) => (
        <li key={gap}>
          <span className="pp-reason-topic">{second}</span>
          <span className="pp-reason-detail">{gap}</span>
        </li>
      ))}
      {reasons.map((r) => (
        <li key={r.key}>
          <span className="pp-reason-topic">{r.topic}</span>
          <span className="pp-reason-detail">{r.detail}</span>
        </li>
      ))}
    </ul>
  );
}

function RankRow({
  score,
  rank,
  edge,
  second,
}: {
  score: PlatformScore;
  rank: number;
  /** Only the top row gets its edge over the second, plus the full detail. */
  edge?: Edge;
  second?: string;
}) {
  const info = platform(score.code);
  const top = rank === 1;
  const percent = Math.round(score.fit * 100);
  return (
    <li className="pp-rank" data-top={top}>
      <div className="pp-rank-head">
        <span className="pp-rank-num">{rank}</span>
        <span className="pp-rank-name">{info.name}</span>
        <span className="pp-rank-points">
          {Math.max(0, score.earned)} of {score.possible} points
        </span>
      </div>
      <div className="pp-bar" aria-hidden="true">
        <span className="pp-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      {score.gaps.map((gap) => (
        <p key={gap} className="pp-rank-gap">
          {gap}
        </p>
      ))}

      {top && (
        <div className="pp-rank-detail">
          <p className="pp-body">{info.blurb}</p>
          {score.meets.length > 0 && (
            <p className="pp-rank-meets">
              <span className="pp-rank-meets-label">What tipped the scales:</span>{" "}
              {score.meets.join(", ")}
            </p>
          )}
          {edge && second && (
            <>
              <h3 className="pp-h3">
                Why {info.name} is ahead of {second}
              </h3>
              <EdgeList edge={edge} top={info.name} second={second} />
            </>
          )}
        </div>
      )}

      <ExternalLink href={info.pricingUrl}>{`${info.name} pricing`}</ExternalLink>
    </li>
  );
}

function PortalSection({ note, top }: { note: PortalNote; top: string }) {
  if (note === null) return null;
  return (
    <section className="pp-block">
      <h2 className="pp-h3">Client portal</h2>
      {note === "airtable" ? (
        <>
          <p className="pp-body">
            Airtable Portals gives clients their own login page into your Airtable interfaces. It's
            an add-on on the Team plan and up. Softr is the other common choice, and builds a
            branded portal on top of your Airtable data.
          </p>
          <div className="pp-links">
            <ExternalLink href={AIRTABLE_PORTALS_URL}>Airtable Portals</ExternalLink>
            <ExternalLink href={SOFTR_PRICING_URL}>Softr pricing</ExternalLink>
          </div>
        </>
      ) : (
        <p className="pp-body">
          {top} has no built-in client portal, so a branded client login means adding a separate
          portal tool. Check that the tool connects to {top} before you commit.
        </p>
      )}
    </section>
  );
}

/** Leads the result when their volume is past what these platforms handle well. */
function CustomBuild() {
  return (
    <section className="pp-offer">
      <h2 className="pp-h3">A custom build</h2>
      <p>
        These platforms may not be a good fit for the volume of your work. You might need something
        custom, built on a database that can handle all of your business.
      </p>
      <Button
        type="primary"
        size="large"
        href={DEEBUILT_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Talk to DeeBuilt
      </Button>
    </section>
  );
}

function LeadOffer({ level, name }: { level: LeadLevel; name: string }) {
  if (level === null) return null;
  const strong = level === "strong";
  return (
    <section className="pp-offer">
      <h2 className="pp-h3">{strong ? "Have DeeBuilt build it" : "A hand getting started"}</h2>
      <p>
        {strong
          ? `You said you want someone to build and manage it. DeeBuilt sets up ${name} for your team and maintains it after launch.`
          : `DeeBuilt can set up your first ${name} workspace with you, so your team starts on something that already fits.`}
      </p>
      <Button
        type={strong ? "primary" : "default"}
        size="large"
        href={DEEBUILT_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {strong ? "Talk to DeeBuilt" : "Get setup help"}
      </Button>
    </section>
  );
}

export function PickerResult({
  result,
  onEdit,
  onRestart,
}: {
  result: QuizResult;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const actions = (
    <div className="pp-actions">
      <Button size="large" icon={<ArrowLeftOutlined />} onClick={onEdit}>
        Change my answers
      </Button>
      <Button size="large" type="text" icon={<ReloadOutlined />} onClick={onRestart}>
        Start over
      </Button>
    </div>
  );

  if (result.kind === "conversation") {
    return (
      <div className="pp-result">
        <header className="pp-result-head">
          <p className="dl-eyebrow">Your result</p>
          <h1 className="pp-result-name">Let's talk this one through</h1>
          <p className="pp-result-blurb">
            With more than 200 outside people logging in, the client portal decides the platform,
            and portal pricing moves with every user you add. DeeBuilt can walk through the options
            with you.
          </p>
        </header>
        <div>
          <Button
            type="primary"
            size="large"
            href={DEEBUILT_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk to DeeBuilt
          </Button>
        </div>
        {actions}
      </div>
    );
  }

  const [top, second] = result.ranking;
  const topName = platform(top.code).name;
  const secondName = second ? platform(second.code).name : undefined;

  return (
    <div className="pp-result">
      <header className="pp-result-head">
        <p className="dl-eyebrow">Your results</p>
        <h1 className="pp-result-name">Platforms to consider</h1>
        <p className="pp-fine">
          Ranked by the features that matter to you.
        </p>
      </header>

      {result.custom && <CustomBuild />}

      <ol className="pp-ranking">
        {result.ranking.map((score, i) => (
          <RankRow
            key={score.code}
            score={score}
            rank={i + 1}
            edge={i === 0 ? result.edge : undefined}
            second={i === 0 ? secondName : undefined}
          />
        ))}
      </ol>

      <PortalSection note={result.portal} top={topName} />

      {result.pointers.length > 0 && (
        <section className="pp-block">
          <h2 className="pp-h3">Before you pick a plan</h2>
          <ul className="pp-pointers">
            {result.pointers.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      )}

      {/* The custom-build box already carries the DeeBuilt button; a second
          one at the bottom would ask the same question twice. */}
      {!result.custom && <LeadOffer level={result.lead} name={topName} />}

      {actions}
    </div>
  );
}
