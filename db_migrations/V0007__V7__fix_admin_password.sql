UPDATE t_p54794878_online_learning_plat.users 
SET password_hash = encode(sha256('admin1234'::bytea), 'hex')
WHERE email = 'admin@learnhub.ru';
