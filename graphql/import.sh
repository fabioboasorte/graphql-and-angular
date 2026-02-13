#!/bin/bash
# Import init.sql into MySQL
# Uses Docker if mysql container is running, otherwise tries local mysql client

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INIT_SQL="$SCRIPT_DIR/init.sql"

# Docker Compose settings (match docker-compose.yml)
DB_NAME="graphql"
DB_USER="admin"
DB_PASS="nimda"
DB_HOST="localhost"
DB_PORT="3306"

import_via_docker() {
  local container=$1
  echo "Importing via Docker ($container)..."
  docker exec -i "$container" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$INIT_SQL"
}

import_via_mysql() {
  echo "Importing via mysql client..."
  mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$INIT_SQL"
}

# Try Docker first if container exists
CONTAINER=$(docker ps --format '{{.Names}}' 2>/dev/null | grep -E 'mysql|graphql' | head -1)
if [ -n "$CONTAINER" ]; then
  import_via_docker "$CONTAINER" && echo "Import successful!" || import_via_mysql
else
  import_via_mysql
fi
