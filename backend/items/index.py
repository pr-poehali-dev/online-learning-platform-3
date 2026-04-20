import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p54794878_online_learning_plat')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Получение списка курсов и кружков"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    item_type = params.get('type')
    category = params.get('category')

    conn = get_conn()
    try:
        with conn.cursor() as cur:
            query = f"""
                SELECT id, type, title, description, category, teacher, schedule, max_students, price, is_active, created_at
                FROM {SCHEMA}.items
                WHERE is_active = TRUE
            """
            args = []
            if item_type:
                query += " AND type = %s"
                args.append(item_type)
            if category:
                query += " AND category = %s"
                args.append(category)
            query += " ORDER BY created_at DESC"
            cur.execute(query, args)
            rows = cur.fetchall()
            cols = ['id', 'type', 'title', 'description', 'category', 'teacher', 'schedule', 'max_students', 'price', 'is_active', 'created_at']
            items = []
            for row in rows:
                item = dict(zip(cols, row))
                item['created_at'] = str(item['created_at'])
                items.append(item)

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'items': items})}
    finally:
        conn.close()
