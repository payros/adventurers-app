-- Schema

SET search_path  TO adv_db;

CREATE TYPE "sex" AS ENUM (
  'male',
  'female'
);

CREATE TYPE "adventurer_class" AS ENUM (
  'little_lambs',
  'eager_beavers',
  'busy_bees',
  'sunbeams',
  'builders',
  'helping_hands'
);

CREATE TYPE "award_type" AS ENUM (
  'star',
  'chip',
  'award',
  'florida',
  'chesapeake',
  'patch',
  'pin',
  'other'
);

CREATE TYPE "staff_role" AS ENUM (
  'director',
  'associate_director',
  'instructor',
  'secretary',
  'treasurer',
  'chaplain',
  'counselor',
  'cook',
  'general_staff'
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "staff" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar,
  "phone" varchar,
  "background_check_expiration" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "parents" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar,
  "phone" varchar,
  "address" varchar,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "children" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "allergies" varchar,
  "medical_conditions" varchar,
  "sex" sex,
  "date_of_birth" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "parents_children" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "parent_id" integer NOT NULL,
  "child_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "awards" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar,
  "level" adventurer_class,
  "patch_image_url" varchar,
  "link" varchar,
  "type" award_type,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "club_years" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "start_date" timestamp,
  "club_name" varchar,
  "end_date" timestamp,
  "label" varchar UNIQUE,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "club_years_staff" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "club_year_id" integer NOT NULL,
  "staff_id" integer NOT NULL,
  "staff_role" staff_role,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "classes" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "class" adventurer_class,
  "club_year_id" integer NOT NULL,
  "instructor_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "events" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "club_year" integer NOT NULL,
  "title" varchar,
  "award_ceremony" boolean NOT NULL DEFAULT false,
  "event_date" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "events_awards" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "award_id" integer NOT NULL,
  "event_id" integer NOT NULL,
  "class_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "classes_children" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "club_year" integer NOT NULL,
  "class_id" integer NOT NULL,
  "child_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "events_children" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "event_id" integer NOT NULL,
  "child_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "awards_children" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "award_id" integer NOT NULL,
  "child_id" integer NOT NULL,
  "awarded_on" timestamp,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "parents_children" ADD FOREIGN KEY ("parent_id") REFERENCES "parents" ("id");

ALTER TABLE "parents_children" ADD FOREIGN KEY ("child_id") REFERENCES "children" ("id");

ALTER TABLE "club_years_staff" ADD FOREIGN KEY ("club_year_id") REFERENCES "club_years" ("id");

ALTER TABLE "club_years_staff" ADD FOREIGN KEY ("staff_id") REFERENCES "staff" ("id");

ALTER TABLE "classes" ADD FOREIGN KEY ("club_year_id") REFERENCES "club_years" ("id");

ALTER TABLE "classes" ADD FOREIGN KEY ("instructor_id") REFERENCES "staff" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("club_year") REFERENCES "club_years" ("id");

ALTER TABLE "events_awards" ADD FOREIGN KEY ("award_id") REFERENCES "awards" ("id");

ALTER TABLE "events_awards" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "events_awards" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "classes_children" ADD FOREIGN KEY ("club_year") REFERENCES "club_years" ("id");

ALTER TABLE "classes_children" ADD FOREIGN KEY ("class_id") REFERENCES "classes" ("id");

ALTER TABLE "classes_children" ADD FOREIGN KEY ("child_id") REFERENCES "children" ("id");

ALTER TABLE "events_children" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "events_children" ADD FOREIGN KEY ("child_id") REFERENCES "children" ("id");

ALTER TABLE "awards_children" ADD FOREIGN KEY ("award_id") REFERENCES "awards" ("id");

ALTER TABLE "awards_children" ADD FOREIGN KEY ("child_id") REFERENCES "children" ("id");
