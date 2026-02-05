# app/dao/queries.py

CREATE_TASK_SQL = """
INSERT INTO tasks (
    title,
    description,
    assigned_to_id,
    due_date,
    status,
    created_at,
    updated_at
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;
"""

GET_TASKS_BY_USER_SQL = """
SELECT * FROM tasks WHERE assigned_to_id=$1 ORDER BY id DESC;
"""


GET_ALL_TASKS_SQL = """
SELECT * FROM tasks ORDER BY id DESC;
"""

GET_TASK_BY_ID_SQL = """
SELECT * FROM tasks WHERE id=$1;
"""

UPDATE_TASK_SQL = """
UPDATE tasks
SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
    assigned_to_id = COALESCE($3, assigned_to_id),
    due_date = COALESCE($4, due_date),
    status = COALESCE($5, status),
    updated_at = $6
WHERE id = $7
RETURNING *;
"""
# --- USER QUERIES ---

GET_USER_BY_ID_SQL = """
    SELECT id, email, password_hash, role, created_at, updated_at 
    FROM users 
    WHERE id = $1;
"""

GET_USER_BY_EMAIL_SQL = """
    SELECT id, email, password_hash, role, created_at, updated_at 
    FROM users 
    WHERE email = $1;
"""

CREATE_USER_SQL = """
    INSERT INTO users (email, password_hash, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, role, created_at, updated_at;
"""

# USER QUERIES
CREATE_USER_SQL = """
    INSERT INTO users (email, password_hash, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, password_hash, role, created_at, updated_at;
"""

GET_USER_BY_EMAIL_SQL = """
    SELECT id, email, password_hash, role, created_at, updated_at 
    FROM users WHERE email = $1;
"""

GET_USER_BY_ID_SQL = """
    SELECT id, email, password_hash, role, created_at, updated_at 
    FROM users WHERE id = $1;
"""