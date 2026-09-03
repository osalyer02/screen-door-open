export type MatchStatus = "scheduled" | "in_progress" | "final";

export type Team = {
  id: string;
  name: string;
  captain: string | null;
  color: string;
  playerIds: string[];
};

export type TripData = {
  title: string;
  dates: string;
  totalPoints: number;
  teams: Team[];
  players: { id: string; firstName: string }[];
  days: {
    id: string; day: string; date: string; course: string; teeTime: string;
    format: string; points: number; detail: string; type: "travel" | "competition";
  }[];
  matches: {
    id: string; dayId: string; teamA: string; teamB: string; playersA: string[];
    playersB: string[]; status: MatchStatus; result: string; pointsA: number; pointsB: number;
  }[];
  updates: { date: string; title: string; detail: string }[];
  notes: string[];
};

/**
 * THE ONLY FILE TO EDIT DURING THE TRIP.
 *
 * Add first names to `players`, select captains, and put player IDs in each
 * team after the Friday-night draft. Add matches after pairings are set.
 * Only matches with status "final" count toward the main scoreboard.
 * Split points are supported (for example, 0.5 and 0.5 for a tied match).
 *
 * Example final match:
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
    { id: "day-2", day: "Day 2 · Saturday", date: "September 19", course: "Alpine Golf Course", teeTime: "Tee times begin 11:30 AM", format: "18 holes · 2-man scramble", points: 3, detail: "Three points available. Pairings are set by the captains after the draft.", type: "competition" },
    { id: "day-3", day: "Day 3 · Sunday", date: "September 20", course: "The Heather", teeTime: "Tee times begin 1:10 PM", format: "18 holes · Alternate shot", points: 3, detail: "Three points available. Pairings are set by the captains after the draft.", type: "competition" },
    { id: "day-4", day: "Day 4 · Monday", date: "September 21", course: "Arthur Hills", teeTime: "Tee times begin 11:00 AM", format: "18 holes · Singles match play", points: 6, detail: "Six points available. The final day decides the cup.", type: "competition" },
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
  { id: "mason", firstName: "Mason" }, { id: "jules", firstName: "Jules" },
  { id: "theo", firstName: "Theo" }, { id: "ross", firstName: "Ross" },
  { id: "miles", firstName: "Miles" }, { id: "owen", firstName: "Owen 😜" },
  { id: "sam", firstName: "Sam" }, { id: "cole", firstName: "Cole" },
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
