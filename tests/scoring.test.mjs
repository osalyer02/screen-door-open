import assert from "node:assert/strict";
import test from "node:test";
import { getCourseHandicap, getDayScore, getMatchScore, getScoreboard, getStrokesOnHole } from "../src/lib/scoring.js";

const base = { totalPoints: 12, teams: [{ id: "a" }, { id: "b" }], matches: [] };

test("does not award points for scheduled or in-progress matches", () => {
  const score = getScoreboard({ ...base, matches: [
    { dayId: "d2", teamA: "a", teamB: "b", status: "scheduled", pointsA: 1, pointsB: 0 },
    { dayId: "d2", teamA: "a", teamB: "b", status: "in_progress", pointsA: 1, pointsB: 0 },
  ] });
  assert.deepEqual(score.totals, { a: 0, b: 0 }); assert.equal(score.pointsRemaining, 12); assert.equal(score.leader, null);
});
test("adds final scores and supports split points", () => {
  const data = { ...base, matches: [
    { dayId: "d2", teamA: "a", teamB: "b", status: "final", pointsA: 1, pointsB: 0 },
    { dayId: "d3", teamA: "a", teamB: "b", status: "final", pointsA: .5, pointsB: .5 },
  ] };
  assert.deepEqual(getScoreboard(data).totals, { a: 1.5, b: .5 }); assert.equal(getScoreboard(data).leader, "a"); assert.deepEqual(getDayScore(data, "d3"), { a: .5, b: .5 });
});
test("recognizes a completed 12-point tournament", () => {
  const score = getScoreboard({ ...base, matches: [{ dayId: "d2", teamA: "a", teamB: "b", status: "final", pointsA: 7, pointsB: 5 }] });
  assert.equal(score.pointsAwarded, 12); assert.equal(score.pointsRemaining, 0);
});

test("calculates a Course Handicap from index, rating, and slope", () => {
  assert.equal(getCourseHandicap(10, { par: 72, courseRating: 71.4, slopeRating: 126 }), 11);
});

test("assigns strokes to the proper holes from the stroke index", () => {
  assert.equal(getStrokesOnHole(7, 7), 1);
  assert.equal(getStrokesOnHole(7, 8), 0);
  assert.equal(getStrokesOnHole(22, 3), 2);
  assert.equal(getStrokesOnHole(22, 5), 1);
});

test("automatically awards a net-stroke match from entered gross totals", () => {
  const data = {
    totalPoints: 1,
    teams: [{ id: "a" }, { id: "b" }],
    players: [{ id: "alex", handicapIndex: 10 }, { id: "blair", handicapIndex: 20 }],
    days: [{ id: "d2", handicap: { par: 72, courseRating: 72, slopeRating: 113, allowance: { percentages: [100] } } }],
    matches: [{ id: "m1", dayId: "d2", teamA: "a", teamB: "b", playersA: ["alex"], playersB: ["blair"], status: "final", pointsA: 0, pointsB: 0, strokeScores: { grossA: 84, grossB: 92 } }],
  };
  assert.deepEqual(getMatchScore(data, data.matches[0]), { pointsA: 0, pointsB: 1, automatic: true, grossA: 84, grossB: 92, handicapA: 10, handicapB: 20, netA: 74, netB: 72 });
  assert.deepEqual(getScoreboard(data).totals, { a: 0, b: 1 });
});

test("supports side-specific allowances for a 2v1 scramble", () => {
  const data = {
    teams: [{ id: "a" }, { id: "b" }],
    players: [{ id: "alex", handicapIndex: 10 }, { id: "blair", handicapIndex: 20 }, { id: "casey", handicapIndex: 18 }],
    days: [{ id: "d2", handicap: { par: 72, courseRating: 72, slopeRating: 113 } }],
    matches: [{ id: "m1", dayId: "d2", teamA: "a", teamB: "b", playersA: ["alex", "blair"], playersB: ["casey"], handicapAllowances: { a: [35, 15], b: [100] }, status: "final", pointsA: 0, pointsB: 0, strokeScores: { grossA: 76, grossB: 88 } }],
  };
  assert.deepEqual(getMatchScore(data, data.matches[0]), { pointsA: 1, pointsB: 0, automatic: true, grossA: 76, grossB: 88, handicapA: 7, handicapB: 18, netA: 69, netB: 70 });
});
