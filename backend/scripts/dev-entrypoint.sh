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

# Wait for required services based on environment variables
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    wait_for_service "$DB_HOST" "$DB_PORT" "PostgreSQL"
fi

if [[ $REDIS_URL =~ redis://([^:]+):([0-9]+) ]]; then
    wait_for_service "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "Redis"
fi

if [[ $ELASTICSEARCH_URL =~ http://([^:]+):([0-9]+) ]]; then
    wait_for_service "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "Elasticsearch"
fi

# Run database migrations if needed
if [ -n "$DB_HOST" ] && [ -f "./migrations" ]; then
    echo "Running database migrations..."
    npm run migrate
fi

# Check if we need to run tests
if [ "$RUN_TESTS" = "true" ]; then
    echo "Running tests..."
    npm test
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build TypeScript if needed
if [ -f "tsconfig.json" ]; then
    echo "Building TypeScript..."
    npm run build
fi

# Start the application with the appropriate command
if [ "$NODE_ENV" = "development" ]; then
    echo "Starting development server..."
    exec npm run dev
else
    echo "Starting production server..."
    exec npm start
fi
