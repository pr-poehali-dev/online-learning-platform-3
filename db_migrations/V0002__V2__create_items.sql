CREATE TABLE IF NOT EXISTS t_p54794878_online_learning_plat.items (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('course', 'circle')),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    teacher VARCHAR(200),
    schedule VARCHAR(200),
    max_students INTEGER DEFAULT 20,
    price VARCHAR(100) DEFAULT 'Бесплатно',
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);