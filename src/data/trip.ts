export type MatchStatus = "scheduled" | "in_progress" | "final";

export type Team = {
  id: string;
  name: string;
  captain: string | null;
  color: string;
  playerIds: string[];
};

export type CourseHandicap = {
  tee: string;
  par: number;
  courseRating: number;
  slopeRating: number;
  /** Hole 1 through 18, in order. */
  holePars?: number[];
  /** Men's stroke index for holes 1 through 18, in order. */
  strokeIndexes?: number[];
  allowance?: { percentages: number[] };
};

export type TripData = {
  title: string;
  dates: string;
  totalPoints: number;
  teams: Team[];
  players: { id: string; firstName: string; handicapIndex?: number }[];
  days: {
    id: string; day: string; date: string; course: string; teeTime: string;
    format: string; points: number; detail: string; type: "travel" | "competition"; handicap?: CourseHandicap;
  }[];
  matches: {
    id: string; dayId: string; teamA: string; teamB: string; playersA: string[];
    playersB: string[]; status: MatchStatus; result: string; pointsA: number; pointsB: number;
    /** Optional per-side Course Handicap allowances, ordered low-to-high handicap. */
    handicapAllowances?: { a?: number[]; b?: number[] };
    strokeScores?: { grossA: number; grossB: number; pointValue?: number };
  }[];
  updates: { date: string; title: string; detail: string }[];
  notes: string[];
};

/**
 * THE ONLY FILE TO EDIT DURING THE TRIP.
 *
 * Add player Handicap Indexes, set captains, and update pairings as they are
 * announced. Before play, add each course's tee, par, rating, slope, hole
 * pars, stroke indexes, and handicap allowance to its day.
 * Add matches after pairings are set.
 * Only matches with status "final" count toward the main scoreboard.
 * Split points are supported (for example, 0.5 and 0.5 for a tied match).
 *
 * Example automatic net-stroke match. Enter each side's round total in
 * `strokeScores`; its lower net score automatically receives the point. Use
 * `handicapAllowances` when a match has a different allowance than its day.
 * { id: "scramble-1", dayId: "day-2", teamA: "team-a", teamB: "team-b",
 *   playersA: ["alex", "sam"], playersB: ["jordan"], status: "final",
 *   result: "", pointsA: 0, pointsB: 0,
 *   handicapAllowances: { a: [35, 15], b: [100] },
 *   strokeScores: { grossA: 75, grossB: 77, pointValue: 1 } }
 *
 * Example manual match-play result:
 * { id: "scramble-1", dayId: "day-2", teamA: "team-a", teamB: "team-b",
 *   playersA: ["alex", "sam"], playersB: ["jordan", "casey"],
 *   status: "final", result: "Team A won 2 & 1", pointsA: 1, pointsB: 0 }
 */
export const trip: TripData = {
  title: "Screen Door Open",
  dates: "September 18–21, 2026",
  totalPoints: 12,
  teams: [
    { id: "team-a", name: "Team Jeremy", captain: "Jeremy", color: "#b94d35", playerIds: ["jeremy", "derek", "quinn", "kevin", "chris", "rylan"] },
    { id: "team-b", name: "Team Chane", captain: "Chane", color: "#2f7180", playerIds: ["chane", "kirk", "owen", "drew", "jared"] },
  ],
  players: [
    { id: "jeremy", firstName: "Jeremy", handicapIndex: 14 },
    { id: "derek", firstName: "Derek", handicapIndex: 22 },
    { id: "quinn", firstName: "Quinn", handicapIndex: 10 },
    { id: "kevin", firstName: "Kevin", handicapIndex: 16 },
    { id: "chris", firstName: "Chris", handicapIndex: 19 },
    { id: "rylan", firstName: "Rylan", handicapIndex: 27 },
    { id: "chane", firstName: "Chane", handicapIndex: 16 },
    { id: "kirk", firstName: "Kirk", handicapIndex: 18 },
    { id: "owen", firstName: "Owen", handicapIndex: 19 },
    { id: "drew", firstName: "Drew", handicapIndex: 18 },
    { id: "jared", firstName: "Jared", handicapIndex: 24 },
  ],
  days: [
    { id: "day-1", day: "Day 1 · Friday", date: "September 18", course: "Doon Brae", teeTime: "Tee times begin 8:40 PM", format: "Travel · Night Par 3", points: 0, detail: "Walking only. Casual nighttime golf, followed by the snake draft and team selections.", type: "travel" },
    { id: "day-2", day: "Day 2 · Saturday", date: "September 19", course: "Alpine Golf Course", teeTime: "Tee times begin 11:30 AM", format: "18 holes · 2-man scramble", points: 3, detail: "Three points available: two 2v2 scramble matches played gross, plus one handicapped 2-man scramble versus a single player. The scramble pair receives 35% of the lower and 15% of the higher Course Handicap; the solo player receives 100%.", type: "competition", handicap: { tee: "Blue", par: 72, courseRating: 69.5, slopeRating: 130, holePars: [4, 4, 3, 4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 4, 3, 5], strokeIndexes: [5, 13, 17, 1, 15, 7, 11, 9, 3, 6, 16, 14, 2, 8, 10, 4, 18, 12], allowance: { percentages: [100] } } },
    { id: "day-3", day: "Day 3 · Sunday", date: "September 20", course: "The Heather", teeTime: "Tee times begin 1:10 PM", format: "18 holes · Alternate shot", points: 3, detail: "Three points available. Team Chane will use a substitute so alternate shot is played as intended.", type: "competition", handicap: { tee: "Blue", par: 72, courseRating: 70.2, slopeRating: 137, holePars: [4, 4, 4, 3, 5, 3, 4, 4, 5, 4, 5, 3, 4, 4, 5, 3, 4, 4], strokeIndexes: [15, 5, 13, 11, 1, 17, 7, 3, 9, 6, 18, 16, 8, 10, 2, 14, 12, 4], allowance: { percentages: [60, 40] } } },
    { id: "day-4", day: "Day 4 · Monday", date: "September 21", course: "Arthur Hills", teeTime: "Tee times begin 11:00 AM", format: "18 holes · Singles match play", points: 6, detail: "Six points available: five singles matches, plus an extra-player point. Team Jeremy's unmatched player earns the point with a net score under par, halves it at net par, and concedes it with a net score above par.", type: "competition", handicap: { tee: "Blue", par: 73, courseRating: 69.3, slopeRating: 128, holePars: [4, 4, 5, 4, 4, 5, 3, 4, 3, 4, 5, 4, 5, 3, 4, 3, 4, 5], strokeIndexes: [9, 17, 5, 7, 1, 13, 15, 3, 11, 18, 4, 8, 14, 12, 2, 16, 6, 10], allowance: { percentages: [100] } } },
  ],
  matches: [],
  updates: [{ date: "Sept 19", title: "Teams are set", detail: "Jeremy leads a six-man side against Chane's five. Saturday's final point is a handicapped 2-man scramble versus a solo player." }],
  notes: [
    "Team Jeremy: Jeremy, Derek, Quinn, Kevin, Chris, and Rylan.",
    "Team Chane: Chane, Kirk, Owen, Drew, and Jared.",
    "Saturday: two gross 2v2 scramble points, then a handicapped 2-man scramble versus Team Chane's remaining player. All 11 players are in scoring matches.",
    "For the Saturday 2v1: use 35% of the lower and 15% of the higher scramble-player Course Handicap; the solo player receives 100%.",
    "Team Chane has a substitute for Sunday's alternate shot, keeping all three matches 2v2.",
    "Three points are available Saturday and Sunday; six are available Monday.",
  ],
};

/** Set to true to preview the finished scorecard with fictional sample teams and results. */
export const showExampleResults = false;

const examplePlayers = [
  { id: "mason", firstName: "Mason", handicapIndex: 8.4 }, { id: "jules", firstName: "Jules", handicapIndex: 12.1 },
  { id: "theo", firstName: "Theo", handicapIndex: 15.6 }, { id: "ross", firstName: "Ross", handicapIndex: 18.2 },
  { id: "miles", firstName: "Miles", handicapIndex: 6.8 }, { id: "owen", firstName: "Owen 😜", handicapIndex: 10.3 },
  { id: "sam", firstName: "Sam", handicapIndex: 14.7 }, { id: "cole", firstName: "Cole", handicapIndex: 19.4 },
];

export const exampleTrip: TripData = {
  ...trip,
  teams: [
    { id: "team-a", name: "Team Pine", captain: "Mason", color: "#b94d35", playerIds: ["mason", "jules", "theo", "ross"] },
    { id: "team-b", name: "Team Lake", captain: "Miles", color: "#2f7180", playerIds: ["miles", "owen", "sam", "cole"] },
  ],
  players: examplePlayers,
  matches: [
    { id: "scramble-1", dayId: "day-2", teamA: "team-a", teamB: "team-b", playersA: ["mason", "jules"], playersB: ["miles", "owen"], status: "final", result: "Team Pine won 2 & 1", pointsA: 1, pointsB: 0 },
    { id: "scramble-2", dayId: "day-2", teamA: "team-a", teamB: "team-b", playersA: ["theo", "ross"], playersB: ["sam", "cole"], status: "final", result: "Halved", pointsA: 0.5, pointsB: 0.5 },
    { id: "alternate-1", dayId: "day-3", teamA: "team-a", teamB: "team-b", playersA: ["mason", "theo"], playersB: ["miles", "sam"], status: "in_progress", result: "", pointsA: 0, pointsB: 0 },
  ],
  updates: [{ date: "Sept 20", title: "Saturday ends all square", detail: "Team Pine’s opening win was answered by a hard-fought halve. Alternate shot is underway at The Heather." }],
};
