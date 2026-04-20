import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p54794878_online_learning_plat')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def create_token(user_id: int, conn) -> str:
    token = secrets.token_hex(32)
    expires_at = datetime.now() + timedelta(days=30)
    with conn.cursor() as cur:
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, token, expires_at)
        )
    conn.commit()
    return token

def get_user_by_token(token: str, conn):
    with conn.cursor() as cur:
        cur.execute(
            f"""SELECT u.id, u.name, u.email, u.role
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON u.id = s.user_id
                WHERE s.token = %s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        if row:
            return {'id': row[0], 'name': row[1], 'email': row[2], 'role': row[3]}
    return None

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация, вход, выход, проверка сессии"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    token = (event.get('headers') or {}).get('X-Authorization', '').replace('Bearer ', '')

    conn = get_conn()
    try:
        # POST /register
        if method == 'POST' and '/register' in path:
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            if not name or not email or not password:
                return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}
            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}
            pw_hash = hash_password(password)
            with conn.cursor() as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}
                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (name, email, password_hash, role) VALUES (%s, %s, %s, 'student') RETURNING id",
                    (name, email, pw_hash)
                )
                user_id = cur.fetchone()[0]
            conn.commit()
            token_val = create_token(user_id, conn)
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
                'token': token_val,
                'user': {'id': user_id, 'name': name, 'email': email, 'role': 'student'}
            })}

        # POST /login
        if method == 'POST' and '/login' in path:
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            pw_hash = hash_password(password)
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, name, email, role FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
                    (email, pw_hash)
                )
                row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный email или пароль'})}
            user_id, name, email, role = row
            token_val = create_token(user_id, conn)
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
                'token': token_val,
                'user': {'id': user_id, 'name': name, 'email': email, 'role': role}
            })}

        # GET /me
        if method == 'GET' and '/me' in path:
            if not token:
                return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет токена'})}
            user = get_user_by_token(token, conn)
            if not user:
                return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'user': user})}

        return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()
