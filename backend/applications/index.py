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
    """Управление заявками: подача, просмотр, обновление статуса (для админа)"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    token = (event.get('headers') or {}).get('X-Authorization', '').replace('Bearer ', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    try:
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Необходима авторизация'})}

        user = get_user_by_token(token, conn)
        if not user:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}

        # POST — подать заявку
        if method == 'POST':
            item_id = body.get('item_id')
            if not item_id:
                return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите item_id'})}
            with conn.cursor() as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.applications WHERE user_id = %s AND item_id = %s", (user['id'], item_id))
                if cur.fetchone():
                    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Вы уже подали заявку'})}
                cur.execute(
                    f"INSERT INTO {SCHEMA}.applications (user_id, item_id, status) VALUES (%s, %s, 'pending') RETURNING id",
                    (user['id'], item_id)
                )
                app_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': app_id, 'status': 'pending'})}

        # PUT — обновить статус (только админ)
        if method == 'PUT':
            if user['role'] != 'admin':
                return {'statusCode': 403, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет доступа'})}
            app_id = body.get('id')
            new_status = body.get('status')
            comment = body.get('comment', '')
            allowed = ['pending', 'approved', 'rejected', 'waitlist', 'in_progress', 'completed']
            if new_status not in allowed:
                return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный статус'})}
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE {SCHEMA}.applications SET status = %s, comment = %s, updated_at = NOW() WHERE id = %s",
                    (new_status, comment, app_id)
                )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

        # GET — мои заявки (студент) или все (админ)
        if method == 'GET':
            with conn.cursor() as cur:
                if user['role'] == 'admin':
                    cur.execute(f"""
                        SELECT a.id, a.status, a.comment, a.created_at, a.updated_at,
                               u.id, u.name, u.email,
                               i.id, i.type, i.title, i.category
                        FROM {SCHEMA}.applications a
                        JOIN {SCHEMA}.users u ON u.id = a.user_id
                        JOIN {SCHEMA}.items i ON i.id = a.item_id
                        ORDER BY a.created_at DESC
                    """)
                else:
                    cur.execute(f"""
                        SELECT a.id, a.status, a.comment, a.created_at, a.updated_at,
                               u.id, u.name, u.email,
                               i.id, i.type, i.title, i.category
                        FROM {SCHEMA}.applications a
                        JOIN {SCHEMA}.users u ON u.id = a.user_id
                        JOIN {SCHEMA}.items i ON i.id = a.item_id
                        WHERE a.user_id = %s
                        ORDER BY a.created_at DESC
                    """, (user['id'],))
                rows = cur.fetchall()

            apps = []
            for r in rows:
                apps.append({
                    'id': r[0], 'status': r[1], 'comment': r[2],
                    'created_at': str(r[3]), 'updated_at': str(r[4]),
                    'user': {'id': r[5], 'name': r[6], 'email': r[7]},
                    'item': {'id': r[8], 'type': r[9], 'title': r[10], 'category': r[11]},
                })
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'applications': apps})}

        return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()
