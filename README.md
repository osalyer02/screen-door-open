# Screen Door Open · 2026

A static, mobile-first scoreboard for the September 18–21 golf trip. It is designed for GitHub Pages: there is no server, account, database, or recurring cost.

## Update the trip during the weekend

Most trip content lives in `src/data/trip.ts`. Edit that file directly in GitHub, commit the change to `main`, and GitHub Pages will publish the new scorecard automatically.

### Post Saturday pairings from your phone

Use the GitHub mobile app to edit [`public/saturday-pairings.json`](public/saturday-pairings.json). Change only the quoted player-name lists and the `updated` value, then commit directly to `main`. Separate players with commas. For example:

```json
{
  "updated": "Saturday pairings · 11:15 AM",
  "pairings": [
    { "teamJeremy": "Jeremy, Derek", "teamChane": "Chane, Kirk" },
    { "teamJeremy": "Quinn, Kevin", "teamChane": "Owen, Drew" },
    { "teamJeremy": "Chris, Rylan", "teamChane": "Jared" }
  ]
}
```

The first two entries are the straight-up 2v2 scrambles. The third is the 2v1: Team Jeremy's pair plays without handicap, while Team Chane's solo player receives full course handicap. To post a result, add `result`, `pointsJeremy`, and `pointsChane` to an entry, as shown in the live file. Reload the site after GitHub saves the file; it reads the raw file directly, so a Pages redeploy is not required.

1. Before or during Friday's draft, add each player under `players`, including their `handicapIndex`, assign captain names, and place player IDs into each team's `playerIds` array.
2. When captains set pairings, add a match to `matches`. Use `scheduled` before tee-off and `in_progress` during play.
3. Before each competitive round, fill in the day’s `handicap` object with the actual tee name, par, course rating, and slope rating. The included allowance percentages are 35%/15% for scramble, 60%/40% for alternate shot, and 100% for singles; adjust them if your group uses different rules.
4. For automatic net-stroke scoring, give a completed match `strokeScores: { grossA, grossB, pointValue }`. The site converts each player’s Handicap Index to a Course Handicap, applies the day’s allowance, subtracts it from the entered gross total, and awards the point to the lower net total. Set `status` to `final` for it to count on the overall scoreboard.
5. For match play, continue to enter the result text and points manually. A single round total cannot determine a match-play result because the winner is decided hole by hole.
6. Add a short announcement at the beginning of `updates` to change the “Latest Update” panel. Edit `notes` for weather, logistics, or other trip notes.

The data file includes copy-ready examples for automatic net-stroke and manual match-play results. An automatic net tie splits the match’s `pointValue` evenly.

To preview a fully populated scorecard before the draft, change `showExampleResults` to `true` in `src/data/trip.ts`. It displays fictional teams and results only; set it back to `false` before the trip.
