CREATE TYPE "public"."review_result" AS ENUM('correct', 'incorrect');--> statement-breakpoint
CREATE TABLE "review_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mistake_id" uuid NOT NULL,
	"result" "review_result" NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mistakes" ADD COLUMN "due_on" date DEFAULT current_date NOT NULL;--> statement-breakpoint
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_mistake_id_mistakes_id_fk" FOREIGN KEY ("mistake_id") REFERENCES "public"."mistakes"("id") ON DELETE no action ON UPDATE no action;