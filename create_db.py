import psycopg

# Connect to the default "postgres" database on the same server
conn = psycopg.connect(
    "postgresql://postgres:cybernaut@127.0.0.1:5555/postgres"
)

conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("CREATE DATABASE mydb;")
    print("Database 'mydb' created successfully")

conn.close()
