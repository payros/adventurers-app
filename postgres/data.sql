\connect adv_db adv_db_user

-- Schema
CREATE SCHEMA adv_db AUTHORIZATION adv_db_user;
GRANT ALL PRIVILEGES ON SCHEMA adv_db TO adv_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA adv_db GRANT ALL PRIVILEGES ON TABLES TO adv_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA adv_db GRANT ALL PRIVILEGES ON SEQUENCES TO adv_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA adv_db GRANT ALL PRIVILEGES ON FUNCTIONS TO adv_db_user;

-- Tables
CREATE TABLE adv_db.users (
    id SERIAL PRIMARY KEY,
    username character varying(32),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Data
INSERT INTO adv_db.users (id, username, created_at)
VALUES (1, 'Test', '2023-01-01 00:00:00.000000');

-- Reset sequences in case placeholder data has explicit primary key inserts, 
-- regardless whether table has rows or not, otherwise UPDATEs may fail
SELECT setval(pg_get_serial_sequence('adv_db.users', 'id'), coalesce(max(id), 0) + 1, false) FROM adv_db.users;

-- Indexes
CREATE INDEX ON adv_db.users (created_at);
