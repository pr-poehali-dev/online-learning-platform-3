INSERT INTO t_p54794878_online_learning_plat.users (name, email, password_hash, role)
SELECT 'Администратор', 'admin@learnhub.ru', '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM t_p54794878_online_learning_plat.users WHERE email = 'admin@learnhub.ru');
