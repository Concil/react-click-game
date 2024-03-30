#!/bin/sh

# Starte die API im Hintergrund mit allen Umgebungsvariablen
cd api && DATABASE_HOST=$DATABASE_HOST DATABASE_USER=$DATABASE_USER DATABASE_PASS=$DATABASE_PASS DATABASE_NAME=$DATABASE_NAME DATABASE_PORT=$DATABASE_PORT npm start &

# Gehe zum Frontend-Verzeichnis und starte das Frontend
cd ../app && npm install && npm run build && npx serve -s build -l 5000
