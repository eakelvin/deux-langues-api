I'm building a personal French-practice app. I'm the first and only user for now. The backend is already set up: Node, Express, Postgres on Neon, Drizzle, pg and Zod. The frontend is Next.js. I'm about to build the request layer, which is the core of the MVP. Streaks, notes and progress tracking come later, once the core works.

Before you plan or write anything, talk to me first. Ask me the open questions at the bottom, one or two at a time, and wait for my answers. Then work in small steps, and show me something working after each one. I'll steer by giving short, minimal corrections, so don't try to build everything at once.

THE THREE FLOWS

1. Written
The app fetches an opinion or subject from the AI. I write a response. I post it, and the AI returns corrections.

2. Reading and mimic
The app generates sample text through the AI. I listen to it using browser speech synthesis. I can optionally record a voice note of myself reading it.

3. Conversation
I post a voice note and the AI answers in the conversation.

All three share one shape: the AI generates something, I respond, the AI reacts. Build one reusable request pattern and adapt it for each flow, not three separate systems.

RULES TO FOLLOW

- Store everything from day one, even though streaks and progress come later. For every exercise, save the prompt, my response, the AI's correction or reply, and a timestamp. If I add this later I lose my early data. Design the Drizzle schema with this in mind, and keep it ready for the mistake notebook and progress metrics I'll add later.

- Validate all AI output with Zod before it reaches the client. Corrections should come back as structured JSON, for example: original sentence, corrected sentence, short explanation, and an error type. Models drift in format, so handle parse failures gracefully instead of crashing.

- Voice is the expensive part. "Post a voice note, get an AI reply" is really three steps: transcribe (speech to text), generate a reply, and optionally speak it back. Make sure all three are accounted for, and keep transcription behind a small interface so I can swap the provider later.

- In flow 2, a recording with no feedback is just a mirror. If I record, the AI should compare my transcript to the original text and flag missed or wrong words. If that's too much for the first pass, tell me and we'll leave the recording out of the MVP. The optional recording in flow 2 should not get real feedback for now

- Flow 3 needs conversation history. Don't treat each message as standalone. The AI should speak its replies back. For flow 3, store sessions in Postgres?

- Build order: flow 1 first, since it's text only and proves the whole request pipeline. Then flow 2 without recording. Then add transcription, which unlocks the recording in flow 2 and all of flow 3.

- Keep it practical. Don't over-engineer, don't add features I haven't asked for, and skip auth and multi-user stuff for now.

- All the explanations should be in French

- Open Ai is the Ai provider & GPT-6.2 Sol is the model for the learning mode while GPT-Realtime-2.1 is the model for the conversation flow or voice mode using semantic VAD

- For speech to text, use the browser's built-in SpeechRecognition

IN CASE OF ANY UNCLARITY, OPEN QUESTIONS (ask me, don't decide for me)


