# cyberSpacer


TO create a shell terminal for viewing and adding database 
#python -m flask --app backend:create_app shell

python -m flask --app backend:create_app db migrate -m "message"
python -m flask --app backend:create_app db upgrade