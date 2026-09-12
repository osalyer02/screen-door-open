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
    strokeScores?: { grossA: number; grossB: number; pointValue?: number };
  }[];
  updates: { date: string; title: string; detail: string }[];
  notes: string[];
};

/**
 * THE ONLY FILE TO EDIT DURING THE TRIP.
 *
 * Add first names and Handicap Indexes to `players`, select captains, and put
 * player IDs in each team after the Friday-night draft. Before play, add each
 * course's tee, par, rating, slope, hole pars, stroke indexes, and handicap
 * allowance to its day.
 * Add matches after pairings are set.
 * Only matches with status "final" count toward the main scoreboard.
 * Split points are supported (for example, 0.5 and 0.5 for a tied match).
 *
 * Example automatic net-stroke match. Enter each side's round total in
 * `strokeScores`; its lower net score automatically receives the point.
 * { id: "scramble-1", dayId: "day-2", teamA: "team-a", teamB: "team-b",
 *   playersA: ["alex", "sam"], playersB: ["jordan", "casey"], status: "final",
 *   result: "", pointsA: 0, pointsB: 0,
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
    { id: "team-a", name: "Team A", captain: null, color: "#b94d35", playerIds: [] },
    { id: "team-b", name: "Team B", captain: null, color: "#2f7180", playerIds: [] },
  ],
  players: [],
  days: [
    { id: "day-1", day: "Day 1 · Friday", date: "September 18", course: "Doon Brae", teeTime: "Tee times begin 8:40 PM", format: "Travel · Night Par 3", points: 0, detail: "Walking only. Casual nighttime golf, followed by the snake draft and team selections.", type: "travel" },
    { id: "day-2", day: "Day 2 · Saturday", date: "September 19", course: "Alpine Golf Course", teeTime: "Tee times begin 11:30 AM", format: "18 holes · 2-man scramble", points: 3, detail: "Three points available. Pairings are set by the captains after the draft.", type: "competition", handicap: { tee: "Blue", par: 72, courseRating: 69.5, slopeRating: 130, holePars: [4, 4, 3, 4, 5, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 4, 3, 5], strokeIndexes: [5, 13, 17, 1, 15, 7, 11, 9, 3, 6, 16, 14, 2, 8, 10, 4, 18, 12], allowance: { percentages: [35, 15] } } },
    { id: "day-3", day: "Day 3 · Sunday", date: "September 20", course: "The Heather", teeTime: "Tee times begin 1:10 PM", format: "18 holes · Alternate shot", points: 3, detail: "Three points available. Pairings are set by the captains after the draft.", type: "competition", handicap: { tee: "Blue", par: 72, courseRating: 70.2, slopeRating: 137, holePars: [4, 4, 4, 3, 5, 3, 4, 4, 5, 4, 5, 3, 4, 4, 5, 3, 4, 4], strokeIndexes: [15, 5, 13, 11, 1, 17, 7, 3, 9, 6, 18, 16, 8, 10, 2, 14, 12, 4], allowance: { percentages: [60, 40] } } },
    { id: "day-4", day: "Day 4 · Monday", date: "September 21", course: "Arthur Hills", teeTime: "Tee times begin 11:00 AM", format: "18 holes · Singles match play", points: 6, detail: "Six points available. The final day decides the cup.", type: "competition", handicap: { tee: "Blue", par: 73, courseRating: 69.3, slopeRating: 128, holePars: [4, 4, 5, 4, 4, 5, 3, 4, 3, 4, 5, 4, 5, 3, 4, 3, 4, 5], strokeIndexes: [9, 17, 5, 7, 1, 13, 15, 3, 11, 18, 4, 8, 14, 12, 2, 16, 6, 10], allowance: { percentages: [100] } } },
  ],
  matches: [],
  updates: [{ date: "Aug 27", title: "Itinerary set", detail: "Doon Brae opens the trip Friday night; the team draft follows the round." }],
  notes: [
    "Teams will be selected in a captain-led snake draft after Doon Brae.",
    "Captains determine all competitive pairings for the remainder of the trip.",
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
