import { useEffect, useState } from "react";
import { exampleTrip, showExampleResults, trip, type CourseHandicap, type Team, type TripData } from "./data/trip";
import { getDayScore, getMatchScore, getScoreboard } from "./lib/scoring";

const baseTrip = showExampleResults ? exampleTrip : trip;
const SATURDAY_PAIRINGS_URL = "https://raw.githubusercontent.com/osalyer02/screen-door-open/main/public/saturday-pairings.json";

type SaturdayPairings = {
  updated?: string;
  pairings?: { teamJeremy?: string; teamChane?: string }[];
};

function playerIds(value: string | undefined) {
  return (value ?? "").split(/[,&]/).map((name) => name.trim().toLowerCase()).filter(Boolean).map((name) =>
    baseTrip.players.find((player) => player.firstName.toLowerCase() === name)?.id,
  ).filter((id): id is string => Boolean(id));
}

function saturdayMatches(pairings: SaturdayPairings["pairings"]): TripData["matches"] {
  if (!pairings?.length) return [];
  return pairings.map((pairing, index) => {
    const playersA = playerIds(pairing.teamJeremy);
    const playersB = playerIds(pairing.teamChane);
    return {
      id: `saturday-pairing-${index + 1}`,
      dayId: "day-2",
      teamA: "team-a",
      teamB: "team-b",
      playersA,
      playersB,
      status: "scheduled" as const,
      result: "",
      pointsA: 0,
      pointsB: 0,
      ...(index === 2 ? { handicapAllowances: { a: [35, 15], b: [100] } } : {}),
    };
  }).filter((match) => match.playersA.length > 0 && match.playersB.length > 0);
}

function playerNames(ids: string[], data: TripData) {
  return ids.map((id) => data.players.find((player) => player.id === id)?.firstName ?? id).join(" & ");
}

function playerLabel(id: string, data: TripData) {
  const player = data.players.find((item) => item.id === id);
  if (!player) return id;
  return `${player.firstName}${Number.isFinite(player.handicapIndex) ? ` · ${player.handicapIndex} HI` : ""}`;
}

function TeamMark({ team, compact = false }: { team: Team; compact?: boolean }) {
  return <span className={compact ? "team-mark compact" : "team-mark"} style={{ "--team-color": team.color } as React.CSSProperties}>{team.name}</span>;
}

function CourseScorecard({ course }: { course: CourseHandicap }) {
  if (!course.holePars || !course.strokeIndexes) return null;
  return <details className="course-scorecard">
    <summary>{course.tee} tee scorecard · hole handicaps</summary>
    <div className="course-scorecard-scroll"><table><thead><tr><th>Hole</th>{course.holePars.map((_, index) => <th key={index}>{index + 1}</th>)}</tr></thead><tbody>
      <tr><th>Par</th>{course.holePars.map((par, index) => <td key={index}>{par}</td>)}</tr>
      <tr><th>Stroke index</th>{course.strokeIndexes.map((strokeIndex, index) => <td key={index}>{strokeIndex}</td>)}</tr>
    </tbody></table></div>
  </details>;
}

export default function App() {
  const [livePairings, setLivePairings] = useState<SaturdayPairings | null>(null);
  useEffect(() => {
    let disposed = false;
    fetch(`${SATURDAY_PAIRINGS_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Pairings file unavailable")))
      .then((data: SaturdayPairings) => { if (!disposed) setLivePairings(data); })
      .catch(() => { /* The built-in schedule remains available when offline. */ });
    return () => { disposed = true; };
  }, []);

  const liveMatches = saturdayMatches(livePairings?.pairings);
  const activeTrip: TripData = liveMatches.length
    ? { ...baseTrip, matches: [...baseTrip.matches.filter((match) => match.dayId !== "day-2"), ...liveMatches] }
    : baseTrip;
  const scoreboard = getScoreboard(activeTrip);
  const [teamA, teamB] = activeTrip.teams;
  const leader = scoreboard.leader ? activeTrip.teams.find((team) => team.id === scoreboard.leader) : null;
  return <main>
    <section className="hero" aria-labelledby="site-title">
      <div className="hero-grain" />
      <nav aria-label="Page sections"><a href="#scoreboard">Scoreboard</a><a href="#itinerary">Itinerary</a><a href="#results">Results</a></nav>
      <div className="eyebrow">Northern Michigan · 2026</div>
      <h1 id="site-title">Screen Door<br /><em>Open.</em></h1>
      <p className="hero-subtitle">{activeTrip.dates} · A four-day match for the cup.</p>
      <a className="scroll-cue" href="#scoreboard">Follow the score <span aria-hidden="true">↓</span></a>
    </section>

    <section id="scoreboard" className="scoreboard section-shell" aria-labelledby="scoreboard-title">
      <div className="section-label">The Scorecard</div>
      <div className="scoreboard-heading"><h2 id="scoreboard-title">Race to 12</h2><p>{leader ? `${leader.name} leads the way.` : "The cup is still level."}</p></div>
      <div className="score-card">
        <div className="score-team"><TeamMark team={teamA} /><strong>{scoreboard.totals[teamA.id]}</strong></div>
        <div className="score-middle"><span>{scoreboard.pointsAwarded} awarded</span><div className="track" aria-label={`${scoreboard.pointsAwarded} of ${activeTrip.totalPoints} points awarded`}><span style={{ width: `${(scoreboard.pointsAwarded / activeTrip.totalPoints) * 100}%` }} /></div><b>{scoreboard.pointsRemaining} points remaining</b></div>
        <div className="score-team right"><TeamMark team={teamB} /><strong>{scoreboard.totals[teamB.id]}</strong></div>
      </div>
      <p className="status-line"><span className="status-dot" /> {activeTrip.matches.length ? "Results update as matches are completed." : "Teams are set; competitive pairings will be posted before tee-off."}</p>
    </section>

    <section className="latest section-shell" aria-labelledby="latest-title"><div className="latest-stamp">Latest<br />Update</div><div><div className="section-label">From the clubhouse · {activeTrip.updates[0]?.date}</div><h2 id="latest-title">{activeTrip.updates[0]?.title}</h2><p>{activeTrip.updates[0]?.detail}</p></div></section>

    <section id="itinerary" className="section-shell itinerary" aria-labelledby="itinerary-title">
      <div className="section-label">The Itinerary</div><h2 id="itinerary-title">Four rounds.<br /><em>One cup.</em></h2>
      <div className="day-list">{activeTrip.days.map((day, index) => <article className={`day-card ${day.type}`} key={day.id}>
        <div className="day-number">0{index + 1}</div><div className="day-date"><span>{day.day}</span><strong>{day.date}</strong></div>
        <div className="day-main"><h3>{day.course}</h3><p>{day.format}</p><small>{day.detail}</small>{day.handicap && <><small className="course-handicap">{day.handicap.tee} tees · Par {day.handicap.par} · {day.handicap.courseRating}/{day.handicap.slopeRating} rating/slope</small><CourseScorecard course={day.handicap} /></>}</div>
        <div className="day-meta"><span>{day.teeTime}</span>{day.points > 0 && <b>{day.points} pts</b>}</div>
      </article>)}</div>
    </section>

    <section className="teams section-shell" aria-labelledby="teams-title">
      <div><div className="section-label">The Sides</div><h2 id="teams-title">The teams<br /><em>are set.</em></h2><p>Jeremy leads a six-man side against Chane&apos;s five. Pairings will be posted before each competitive round.</p></div>
      <div className="team-cards">{activeTrip.teams.map((team) => <article className="team-card" key={team.id} style={{ "--team-color": team.color } as React.CSSProperties}>
        <div className="team-card-rule" /><p>{team.captain ? `Captain ${team.captain}` : "Captain TBD"}</p><h3>{team.name}</h3>
        {team.playerIds.length ? <ul>{team.playerIds.map((id) => <li key={id}>{playerLabel(id, activeTrip)}</li>)}</ul> : <div className="draft-pending">Draft pending</div>}
      </article>)}</div>
    </section>

    <section id="results" className="results section-shell" aria-labelledby="results-title">
      <div className="section-label">Match Results</div><h2 id="results-title">The matches</h2>
      <div className="results-list">{activeTrip.days.filter((day) => day.type === "competition").map((day) => {
        const matches = activeTrip.matches.filter((match) => match.dayId === day.id); const scores = getDayScore(activeTrip, day.id);
        return <article className="result-day" key={day.id}><header><div><span>{day.day} · {day.date}</span><h3>{day.course}</h3><p>{day.format}</p></div><div className="day-score"><span>{scores[teamA.id]} — {scores[teamB.id]}</span><small>of {day.points} pts</small></div></header>
          {matches.length ? <div className="match-list">{matches.map((match) => {
            const matchScore = getMatchScore(activeTrip, match);
            const completed = match.status === "final";
            const result = matchScore.automatic
              ? `Net ${matchScore.netA} — ${matchScore.netB}`
              : completed ? match.result : match.status === "in_progress" ? "In progress" : "Teeing off soon";
            return <div className="match-row" key={match.id}>
              <div><TeamMark compact team={activeTrip.teams.find((team) => team.id === match.teamA)!} /><strong>{playerNames(match.playersA, activeTrip)}</strong>{matchScore.automatic && <small>Gross {matchScore.grossA} · {matchScore.handicapA} strokes</small>}</div>
              <div className="match-result"><span>{result}</span><b>{matchScore.pointsA}–{matchScore.pointsB} pts</b></div>
              <div className="match-right"><TeamMark compact team={activeTrip.teams.find((team) => team.id === match.teamB)!} /><strong>{playerNames(match.playersB, activeTrip)}</strong>{matchScore.automatic && <small>Gross {matchScore.grossB} · {matchScore.handicapB} strokes</small>}</div>
            </div>;
          })}</div> : <div className="pairings-empty"><span>○</span><div><strong>Pairings forthcoming</strong><p>Captains will post the matchups after the draft.</p></div></div>}
        </article>;
      })}</div>
    </section>

    <section className="notes section-shell" aria-labelledby="notes-title"><div><div className="section-label">Trip Notes</div><h2 id="notes-title">From the first tee</h2></div><ul>{activeTrip.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>
    <footer><span>Screen Door Open · 2026</span><span>Play hard. Keep score.</span></footer>
  </main>;
}
