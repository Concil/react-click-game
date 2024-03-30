# Basierend auf einem offiziellen Node-Image
FROM node:16-alpine

# Installiere Shell und weitere Tools, die benötigt werden könnten
RUN apk add --no-cache bash

# Arbeitsverzeichnis im Container festlegen
WORKDIR /usr/src/app

# Kopiere beide Anwendungsverzeichnisse
COPY ./api ./api
COPY ./app ./app

# Installiere API-Abhängigkeiten
RUN cd api && npm install

# Installiere Frontend-Abhängigkeiten
RUN cd ../app && npm install

# Kopiere das Start-Skript
COPY start-both.sh ./start-both.sh

# Setze Umgebungsvariablen für die API
ENV DATABASE_HOST=""
ENV DATABASE_USER=""
ENV DATABASE_PASS=""
ENV DATABASE_NAME=""
ENV DATABASE_PORT=""

# Starte das Start-Skript
CMD ["/bin/sh", "start-both.sh"]
