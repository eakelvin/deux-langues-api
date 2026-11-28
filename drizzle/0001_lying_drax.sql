CREATE TABLE "daily_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"written" boolean DEFAULT false NOT NULL,
	"mimic" boolean DEFAULT false NOT NULL,
	"conversation" boolean DEFAULT false NOT NULL,
	CONSTRAINT "daily_progress_date_unique" UNIQUE("date")
);
