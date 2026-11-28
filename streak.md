I'm building a personal French-practice app (Node, Express, Postgres on Neon, Drizzle, pg, Zod; Next.js frontend). The three core flows already exist: written, reading/mimic, and conversation. Now I want to add the streak. Before you write anything, tell me in a few lines what you plan to change, and wait for my go-ahead. After that, work in small steps and show me each one working before moving on. I'll steer with short corrections.

WHAT THE STREAK IS

- A day counts only when all 3 flows are completed that day. Strictly 3, no partial credit.
- The streak is the number of consecutive complete days, counting back from today.
- It starts on the first day I complete all 3. Day one is a streak of 1.
- Time is based on my local time zone.

HOW TO BUILD IT

- Do NOT keep a stored counter that gets incremented. Retrying a flow, a double tap or a duplicate request must never add to the streak twice.
- Create a daily progress table with one row per local date. It has a unique constraint on the date, plus a done flag for each of the 3 flows. (Single user for now, so no user_id yet, but keep it easy to add later.)
- When a flow completes, upsert that day's row and set that flow's flag to true. Doing it again changes nothing, so the operation is idempotent.
- A day is complete when all 3 flags are true.
- Compute the streak by reading the rows and counting consecutive complete days backward from today. If today isn't complete yet, the streak still shows yesterday's count and doesn't reset until the day ends without completion.
- Expose one endpoint that returns the current streak, whether today is complete, and which flows are done today.

TIME ZONE

- Store the IANA zone name (for example Europe/Paris), never a fixed offset, so daylight saving works.
- Work out "today" on the server from that zone and store it as a plain date column. Don't derive the day from UTC timestamps.
- A flow counts for the local date on which it was completed, even if it was started before midnight.
- Validate the zone name with Zod.

NOT NOW

- Forgiveness rules (skipped-day passes and so on). Don't build them, but keep the logic in one readable function so I can change how the rows are interpreted later without touching the stored data.
- Notes and progress metrics.
- Auth or multiple users.

Keep it practical and small. Don't add features I haven't asked for.

OPEN QUESTIONS (ask me, don't decide for me)