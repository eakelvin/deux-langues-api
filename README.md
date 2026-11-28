# deux-langues-api

API for DeuxLangues. Express and TypeScript, with Postgres on Neon through Drizzle ORM and `pg`.

## Setup

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to the Neon connection string, and `OPENAI_API_KEY` for the written exercise. `PORT` is optional. The server uses `4000` when it is missing. `.env.example` shows `8000`.

```bash
npm run dev
```

The server runs `select 1` before it listens.

- Connected: the process prints `Listening on http://localhost:<port>`.
- Not connected: it prints `Database connection failed: ...` and exits, so the listening line never appears.

`pg` may also print a long SSL warning about `sslmode=require`. That warning is not a failed connection.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the API with reload |
| `npm run typecheck` | Typecheck without emitting files |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled server |
| `npm run db:generate` | Create a migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations in `drizzle/` |
| `npm run db:studio` | Open Drizzle Studio |

## Layout

```
src/
  server.ts                 starts the app after the database check
  app.ts                    Express, Helmet, CORS, JSON
  config/env.ts             validates PORT, NODE_ENV, and DATABASE_URL
  db/index.ts               pg pool and Drizzle client
  db/schema.ts              Drizzle tables
  routes/                   mounts /users, /writing, /mimic, and /conversations
  controllers/
  services/
  middleware/               404 and 500 handlers
drizzle.config.ts
```

`/users` is mounted and has no routes yet. Unknown routes respond with `{ "message": "Not found" }`.

## Written exercise

`gpt-6.2-sol` writes the topic and the correction. Explanations come back in French. The correction is checked with Zod before it is stored. Each row keeps the prompt, your text, the correction, and timestamps.

```bash
curl -X POST http://localhost:4000/writing
curl -X POST http://localhost:4000/writing/<id> -H 'content-type: application/json' -d '{"text":"Je suis aller au marché."}'
curl http://localhost:4000/writing/<id>
```

If the model reply is not the expected JSON, the text stays saved and the API returns `502`.

## Mimic

`POST /mimic` asks for a French passage of about 150 words and stores it as the text to read. Listening stays in the browser. `POST /mimic/<id>` saves the browser transcript of a reading. It does not correct the recording.

```bash
curl -X POST http://localhost:4000/mimic
curl -X POST http://localhost:4000/mimic/<id> \
  -H 'content-type: application/json' \
  -d '{"transcript":"Ce matin, en ouvrant la fenêtre."}'
curl http://localhost:4000/mimic/<id>
```

## Conversation

`POST /conversations` opens a `gpt-realtime-2.1` session with semantic voice detection and spoken replies. The response includes a short-lived `clientSecret` for the browser. Turns are stored on that session, in order.

```bash
curl -X POST http://localhost:4000/conversations
curl -X POST http://localhost:4000/conversations/<id>/turns \
  -H 'content-type: application/json' \
  -d '{"role":"user","content":"Bonjour, je voudrais une table."}'
curl http://localhost:4000/conversations/<id>
```

## Streak

A day counts when written, mimic, and conversation are all done. Written counts when a correction is saved, mimic when a transcript is saved, and conversation when a user turn is saved. Repeating one does not raise the count. The day is the `TIME_ZONE` calendar date, `Europe/Paris` unless you set another IANA name.

```bash
curl http://localhost:4000/streak
```

## Notes

Each mistake is its own row. A repeat is the same category and the same word or phrase, counted when the list is read. Filter with `flow` and `category`.

```bash
curl http://localhost:4000/notes
curl "http://localhost:4000/notes?flow=written&category=gender"
```

## Review

`GET /reviews` lists mistakes due today. Each one shows the wrong sentence, not the fix. `POST /reviews/<id>` stores what you typed and your own rating, `correct` or `incorrect`. A correct answer is due again in 1, then 3, then 7 days. An incorrect answer is due again tomorrow.

```bash
curl http://localhost:4000/reviews
curl -X POST http://localhost:4000/reviews/<id> \
  -H 'content-type: application/json' \
  -d '{"result":"correct","answer":"un endroit"}'
```

## Progress

`GET /progress` reads the last 7 days in `TIME_ZONE`. Days practiced come from the streak rows. Mistakes per 100 words uses learner responses as the word count. A repeat is a mistake whose category and phrase already appeared. An item is reviewed once it has an attempt, and learned after 3 correct attempts in a row. `days` is the same numbers, one entry per day.

```bash
curl http://localhost:4000/progress
```

Relative imports use a `.js` extension because `tsconfig.json` sets `module` and `moduleResolution` to `NodeNext`. That path is the compiled file. `tsx` still runs the `.ts` source.
