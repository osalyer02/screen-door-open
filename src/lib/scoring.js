const DEFAULT_ALLOWANCE = [100];

function roundHalfUp(value) {
  return Math.floor(value + 0.5);
}

/**
 * Converts a player's Handicap Index to a Course Handicap for the selected
 * tees. The formula is the USGA Course Handicap calculation.
 */
export function getCourseHandicap(handicapIndex, course) {
  if (!Number.isFinite(handicapIndex) || !course) return 0;
  const { slopeRating, courseRating, par } = course;
  if (![slopeRating, courseRating, par].every(Number.isFinite)) return 0;
  return roundHalfUp((handicapIndex * slopeRating) / 113 + (courseRating - par));
}

/**
 * Returns how many strokes a Course Handicap receives on a hole with the
 * supplied stroke index. This supports handicaps above 18 as well.
 */
export function getStrokesOnHole(courseHandicap, strokeIndex) {
  if (!Number.isInteger(courseHandicap) || !Number.isInteger(strokeIndex) || strokeIndex < 1 || strokeIndex > 18) return 0;
  return Math.floor(courseHandicap / 18) + (strokeIndex <= courseHandicap % 18 ? 1 : 0);
}

/**
 * Applies a team's allowance percentages to its players' Course Handicaps.
 * Percentages are applied from the lowest Course Handicap upward, so a
 * two-player alternate-shot allowance of [60, 40] means 60% of the lower
 * handicap plus 40% of the higher handicap. A match may override its day's
 * allowances on either side, such as a 2v1 scramble using [35, 15] vs [100].
 */
export function getTeamHandicap(data, match, side) {
  const day = data.days?.find((item) => item.id === match.dayId);
  const course = day?.handicap;
  if (!course) return 0;
  const playerIds = side === "A" ? match.playersA : match.playersB;
  const handicaps = playerIds
    .map((id) => data.players?.find((player) => player.id === id)?.handicapIndex)
    .map((index) => getCourseHandicap(index, course))
    .sort((a, b) => a - b);
  const matchAllowances = side === "A" ? match.handicapAllowances?.a : match.handicapAllowances?.b;
  const allowances = matchAllowances ?? course.allowance?.percentages ?? DEFAULT_ALLOWANCE;
  return roundHalfUp(handicaps.reduce((total, handicap, index) => total + handicap * ((allowances[index] ?? 0) / 100), 0));
}

/**
 * Returns the display and point result for a match. A completed match with
 * `strokeScores` awards its point value from the lower net total; older,
 * manually-entered matches continue to use pointsA and pointsB unchanged.
 */
export function getMatchScore(data, match) {
  const strokeScores = match.strokeScores;
  const hasStrokeScores = Number.isFinite(strokeScores?.grossA) && Number.isFinite(strokeScores?.grossB);
  if (!hasStrokeScores) {
    return { pointsA: match.pointsA, pointsB: match.pointsB, automatic: false };
  }

  const handicapA = getTeamHandicap(data, match, "A");
  const handicapB = getTeamHandicap(data, match, "B");
  const netA = strokeScores.grossA - handicapA;
  const netB = strokeScores.grossB - handicapB;
  const pointValue = strokeScores.pointValue ?? 1;
  const [pointsA, pointsB] = netA === netB
    ? [pointValue / 2, pointValue / 2]
    : netA < netB ? [pointValue, 0] : [0, pointValue];

  return { pointsA, pointsB, automatic: true, grossA: strokeScores.grossA, grossB: strokeScores.grossB, handicapA, handicapB, netA, netB };
}

export function getScoreboard(data) {
  const totals = Object.fromEntries(data.teams.map((team) => [team.id, 0]));
  for (const match of data.matches) {
    if (match.status !== "final") continue;
    const score = getMatchScore(data, match);
    totals[match.teamA] = (totals[match.teamA] ?? 0) + score.pointsA;
    totals[match.teamB] = (totals[match.teamB] ?? 0) + score.pointsB;
  }
  const [first, second] = data.teams;
  const firstTotal = totals[first.id] ?? 0;
  const secondTotal = totals[second.id] ?? 0;
  return { totals, leader: firstTotal === secondTotal ? null : firstTotal > secondTotal ? first.id : second.id, pointsAwarded: firstTotal + secondTotal, pointsRemaining: Math.max(0, data.totalPoints - firstTotal - secondTotal) };
}

export function getDayScore(data, dayId) {
  const totals = Object.fromEntries(data.teams.map((team) => [team.id, 0]));
  for (const match of data.matches) {
    if (match.dayId !== dayId || match.status !== "final") continue;
    const score = getMatchScore(data, match);
    totals[match.teamA] = (totals[match.teamA] ?? 0) + score.pointsA;
    totals[match.teamB] = (totals[match.teamB] ?? 0) + score.pointsB;
  }
  return totals;
}
