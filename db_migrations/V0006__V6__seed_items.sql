INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'course', 'Основы веб-разработки', 'HTML, CSS и JavaScript для начинающих. Практические задания и проекты.', 'Разработка', 'Иван Смирнов', 'Пн, Ср 18:00–19:30', 25, 'Бесплатно'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items LIMIT 1);

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'course', 'Python для анализа данных', 'Pandas, NumPy, визуализация данных. Реальные кейсы из бизнеса.', 'Данные', 'Мария Козлова', 'Вт, Чт 19:00–20:30', 20, '1 500 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'Python для анализа данных');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'course', 'UX/UI Дизайн', 'Принципы дизайна, Figma и прототипирование. С нуля до портфолио.', 'Дизайн', 'Анна Петрова', 'Сб 10:00–13:00', 15, '2 000 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'UX/UI Дизайн');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'course', 'React — продвинутый', 'Хуки, контекст, TypeScript и архитектура больших приложений.', 'Разработка', 'Дмитрий Волков', 'Пн, Пт 20:00–21:30', 18, '2 500 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'React — продвинутый');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'circle', 'Шахматный клуб', 'Еженедельные партии, разбор стратегий и турниры среди участников.', 'Спорт', 'Алексей Борисов', 'Пт 17:00–19:00', 30, 'Бесплатно'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'Шахматный клуб');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'circle', 'Кружок рисования', 'Акварель, карандаш и цифровое искусство. Для всех уровней.', 'Искусство', 'Елена Новикова', 'Ср, Вс 16:00–18:00', 12, '800 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'Кружок рисования');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'circle', 'Английский разговорный', 'Практика живого общения, фильмы и дискуссии на английском.', 'Языки', 'Светлана Орлова', 'Вт, Чт 18:30–20:00', 10, '1 200 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'Английский разговорный');

INSERT INTO t_p54794878_online_learning_plat.items (type, title, description, category, teacher, schedule, max_students, price)
SELECT 'circle', 'Робототехника', 'Сборка и программирование роботов на Arduino и Raspberry Pi.', 'Технологии', 'Николай Громов', 'Сб, Вс 11:00–13:00', 8, '1 800 ₽/мес'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.items WHERE title = 'Робототехника');
