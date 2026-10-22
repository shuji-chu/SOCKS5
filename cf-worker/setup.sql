CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    nickname TEXT,
    avatar TEXT,
    user_id INTEGER UNIQUE,
    app_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
