CREATE TYPE "public"."error_category" AS ENUM('adjective_agreement', 'noun_agreement', 'verb_tense', 'verb_conjugation', 'mood', 'auxiliary', 'preposition', 'gender', 'article', 'pronoun', 'negation', 'vocabulary', 'word_order', 'spelling', 'plural');--> statement-breakpoint
CREATE TABLE "mistakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flow" "exercise_flow" NOT NULL,
	"category" "error_category" NOT NULL,
	"phrase" text NOT NULL,
	"original" text NOT NULL,
	"corrected" text NOT NULL,
	"explanation" text NOT NULL,
	"source_id" uuid NOT NULL,
	"word_count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
