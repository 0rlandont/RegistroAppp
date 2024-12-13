#!/bin/bash

# Cambia a la carpeta _JSON-SERVER
cd "$(dirname "$0")/_JSON-SERVER" || exit 1

# Ejecuta json-server usando el archivo db.json (o especifica otro archivo JSON)
# Reemplaza db.json por el archivo que deseas usar
json-server --watch posts.json --port 3000
