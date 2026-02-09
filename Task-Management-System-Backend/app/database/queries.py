# app/dao/queries.py

# Useassigned_user (DB column name); alias to assigned_to_id in SELECT for API
CREATE_TASK_SQL = """
INSERT INTO tasks (
    title,
    description,
    assigned_user,
    due_date,
    status,
    created_at,
    updated_at
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING id, title, description,assigned_user AS assigned_to_id, due_date, status, created_at, updated_at;
"""

GET_TASKS_BY_USER_SQL = """
SELECT id, title, description,assigned_user AS assigned_to_id, due_date, status, created_at, updated_at
FROM tasks WHERE assigned_user = $1 ORDER BY id DESC;
"""

GET_ALL_TASKS_SQL = """
SELECT id, title, description,assigned_user AS assigned_to_id, due_date, status, created_at, updated_at
FROM tasks ORDER BY id DESC;
"""

GET_TASK_BY_ID_SQL = """
SELECT id, title, description,assigned_user AS assigned_to_id, due_date, status, created_at, updated_at
FROM tasks WHERE id=$1;
"""

UPDATE_TASK_SQL = """
UPDATE tasks
SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
   assigned_user = COALESCE($3,assigned_user),
    due_date = COALESCE($4, due_date),
    status = COALESCE($5, status),
    updated_at = $6
WHERE id = $7
RETURNING id, title, description,assigned_user AS assigned_to_id, due_date, status, created_at, updated_at;
"""

DELETE_TASK_SQL = "DELETE FROM tasks WHERE id = $1;"

# --- USER QUERIES ---
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

GET_ALL_USERS_SQL = "SELECT id, email, password_hash, role, created_at, updated_at FROM users ORDER BY id;"