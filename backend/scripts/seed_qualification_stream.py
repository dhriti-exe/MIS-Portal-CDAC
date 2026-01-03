import psycopg2

# Update these variables with your actual database credentials
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_USER = 'cdacuser'
DB_PASSWORD = 'cdacpass'
DB_NAME = 'cdacdb'

qualification_data = [
    (1, 'High School', 101),
    (2, 'Diploma', 102),
    (3, 'Undergraduate', 103),
    (4, 'Postgraduate', 104),
    (5, 'PhD', 105),
]

stream_data = [
    (1, 'Science', 201),
    (2, 'Commerce', 202),
    (3, 'Arts', 203),
    (4, 'Engineering', 204),
    (5, 'Management', 205),
]

def insert_mock_data():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    try:
        cur.executemany(
            "INSERT INTO m_qualification (qualification_id, qualification_name, qual_code) VALUES (%s, %s, %s) ON CONFLICT (qualification_id) DO NOTHING;",
            qualification_data
        )
        cur.executemany(
            "INSERT INTO m_stream (stream_id, stream_name, qual_code) VALUES (%s, %s, %s) ON CONFLICT (stream_id) DO NOTHING;",
            stream_data
        )
        conn.commit()
        print('Mock data inserted successfully!')
    except Exception as e:
        print('Error:', e)
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    insert_mock_data()
