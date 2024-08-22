CREATE TABLE "scoreboard" (
  "user_id" uuid,
  "score" integer NOT NULL DEFAULT 0
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "name" string,
  "other" string
);

CREATE TABLE "actions" (
  "id" uuid PRIMARY KEY,
  "action_type" string NOT NULL,
  "reward" integer NOT NULL,
  "other" string
);

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "scoreboard" ("user_id");

CREATE TABLE "users_actions" (
  "users_id" uuid,
  "actions_id" uuid,
  PRIMARY KEY ("users_id", "actions_id")
);

ALTER TABLE "users_actions" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "users_actions" ADD FOREIGN KEY ("actions_id") REFERENCES "actions" ("id");

//https://dbdiagram.io/d/CodeChellange-66c6f447a346f9518cc4b5a9