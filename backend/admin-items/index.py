import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p54794878_online_learning_plat')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

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
    """Управление курсами и кружками (только для администратора)"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    raw_token = headers.get('X-Authorization') or headers.get('Authorization') or ''
    token = raw_token.replace('Bearer ', '').strip()
    body = {}
    if event.get('body'):
        try:
            parsed = json.loads(event['body'])
            body = json.loads(parsed) if isinstance(parsed, str) else parsed
        except Exception:
            pass

    conn = get_conn()
    try:
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Необходима авторизация'})}
        user = get_user_by_token(token, conn)
        if not user or user['role'] != 'admin':
            return {'statusCode': 403, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет доступа'})}

        # POST — создать курс/кружок
        if method == 'POST':
            required = ['type', 'title']
            for f in required:
                if not body.get(f):
                    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': f'Поле {f} обязательно'})}
            with conn.cursor() as cur:
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.items (type, title, description, category, teacher, schedule, max_students, price)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
                """, (
                    body['type'], body['title'],
                    body.get('description', ''), body.get('category', ''),
                    body.get('teacher', ''), body.get('schedule', ''),
                    int(body.get('max_students', 20)), body.get('price', 'Бесплатно')
                ))
                item_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': item_id})}

        # PUT — обновить
        if method == 'PUT':
            item_id = body.get('id')
            if not item_id:
                return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет id'})}
            with conn.cursor() as cur:
                cur.execute(f"""
                    UPDATE {SCHEMA}.items SET
                        title = %s, description = %s, category = %s,
                        teacher = %s, schedule = %s, max_students = %s,
                        price = %s, is_active = %s
                    WHERE id = %s
                """, (
                    body.get('title'), body.get('description'), body.get('category'),
                    body.get('teacher'), body.get('schedule'), int(body.get('max_students', 20)),
                    body.get('price', 'Бесплатно'), body.get('is_active', True), item_id
                ))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

        # GET — все курсы/кружки
        if method == 'GET':
            with conn.cursor() as cur:
                cur.execute(f"""
                    SELECT i.id, i.type, i.title, i.description, i.category, i.teacher,
                           i.schedule, i.max_students, i.price, i.is_active, i.created_at,
                           COUNT(a.id) as app_count
                    FROM {SCHEMA}.items i
                    LEFT JOIN {SCHEMA}.applications a ON a.item_id = i.id
                    GROUP BY i.id ORDER BY i.created_at DESC
                """)
                rows = cur.fetchall()
            cols = ['id','type','title','description','category','teacher','schedule','max_students','price','is_active','created_at','app_count']
            items = []
            for row in rows:
                item = dict(zip(cols, row))
                item['created_at'] = str(item['created_at'])
                items.append(item)
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'items': items})}

        return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()