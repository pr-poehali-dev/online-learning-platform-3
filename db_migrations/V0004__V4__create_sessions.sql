CREATE TABLE IF NOT EXISTS t_p54794878_online_learning_plat.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p54794878_online_learning_plat.users(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);