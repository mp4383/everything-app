#!/bin/bash
set -e

# Function to wait for a service to be ready
wait_for_service() {
    local host="$1"
    local port="$2"
    local service="$3"

    echo "Waiting for $service to be ready..."
    while ! nc -z "$host" "$port"; do
        echo "Waiting for $service connection..."
        sleep 1
    done
    echo "$service is ready!"
}

# Wait for required services
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

# Install and configure MinIO client if needed
if [ -n "$S3_ENDPOINT" ]; then
    echo "Setting up MinIO client..."
    wget https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
    chmod +x /usr/local/bin/mc
    
    echo "Initializing MinIO buckets..."
    mc alias set minio $S3_ENDPOINT $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY
    mc mb minio/uploads --ignore-existing || true
    mc policy set public minio/uploads || true
fi

# Database operations in development
if [ "$NODE_ENV" = "development" ]; then
    echo "Running database migrations..."
    npx prisma migrate dev

    # Only seed in development if explicitly requested
    if [ "$SEED_DB" = "true" ]; then
        echo "Seeding database..."
        npx prisma db seed
    fi
fi

# Generate Prisma client if needed
if [ ! -d "node_modules/.prisma/client" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

# Start the application
echo "Starting application..."
exec "$@"
