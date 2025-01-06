#!/bin/bash
set -e

# Function to wait for a service to be ready
wait_for_service() {
    local host="$1"
    local port="$2"
    local service="$3"
    local max_attempts=30
    local attempt=1

    echo "Waiting for $service to be ready..."
    while ! nc -z "$host" "$port"; do
        if [ $attempt -ge $max_attempts ]; then
            echo "Error: $service not available after $max_attempts attempts"
            exit 1
        fi
        echo "Attempt $attempt: Waiting for $service connection..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "$service is ready!"
}

# Function to safely run migrations
run_migrations() {
    echo "Running database migrations..."
    
    # Acquire migration lock
    if ! npx prisma migrate deploy; then
        echo "Error: Failed to run migrations"
        exit 1
    fi
}

# Wait for required services with proper error handling
if [ -n "$DATABASE_URL" ]; then
    # Extract host and port from DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    wait_for_service "$DB_HOST" "$DB_PORT" "PostgreSQL"
fi

if [ -n "$REDIS_URL" ]; then
    # Extract host and port from REDIS_URL
    REDIS_HOST=$(echo $REDIS_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    REDIS_PORT=$(echo $REDIS_URL | sed -n 's/.*:\([0-9]*\).*/\1/p')
    wait_for_service "$REDIS_HOST" "${REDIS_PORT:-6379}" "Redis"
fi

if [ -n "$ELASTICSEARCH_URL" ]; then
    # Extract host and port from ELASTICSEARCH_URL
    ES_HOST=$(echo $ELASTICSEARCH_URL | sed -n 's/.*\/\/\([^:]*\).*/\1/p')
    ES_PORT=$(echo $ELASTICSEARCH_URL | sed -n 's/.*:\([0-9]*\).*/\1/p')
    wait_for_service "$ES_HOST" "${ES_PORT:-9200}" "Elasticsearch"
fi

# Run migrations in production with proper locking
if [ "$NODE_ENV" = "production" ]; then
    # Check if we should run migrations (controlled by env var)
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        run_migrations
    fi
fi

# Generate Prisma client if needed
if [ ! -d "node_modules/.prisma/client" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

# Print service information
echo "Starting service with:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Database: $DB_HOST"
echo "Redis: $REDIS_HOST"
echo "Elasticsearch: $ES_HOST"

# Start the application
echo "Starting application..."
exec "$@"
