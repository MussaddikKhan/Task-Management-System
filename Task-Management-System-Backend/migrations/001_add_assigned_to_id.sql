-- Migration: Add assigned_to_id to tasks table
-- Run this against your PostgreSQL database to fix: column "assigned_to_id" of relation "tasks" does not exist
--
-- Option A: If your tasks table has NO assignee column yet, run:
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to_id INTEGER REFERENCES users(id);

-- Option B: If your tasks table already has a column named "assigned_user_id", run this instead (and skip Option A):
-- ALTER TABLE tasks RENAME COLUMNassigned_user TO assigned_to_id;

-- After running, restart the backend and try creating a task again.
