# cyberSpacer


TO create a shell terminal for viewing and adding database 
#python -m flask --app backend:create_app shell

python -m flask --app backend:create_app db migrate -m "message"
python -m flask --app backend:create_app db upgrade




SELECT u.*, s.*
FROM users u
JOIN user_stats s ON s.user_id = u.id
ORDER BY 1;