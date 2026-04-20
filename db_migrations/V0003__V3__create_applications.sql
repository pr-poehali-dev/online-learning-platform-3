CREATE TABLE IF NOT EXISTS t_p54794878_online_learning_plat.applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p54794878_online_learning_plat.users(id),
    item_id INTEGER NOT NULL REFERENCES t_p54794878_online_learning_plat.items(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);