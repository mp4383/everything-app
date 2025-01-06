#!/bin/bash
set -e

echo "Starting database initialization..."

# Check if docker-compose is running
if ! docker-compose ps | grep -q "postgres.*running"; then
  echo "Starting Docker services..."
  docker-compose up -d postgres redis elasticsearch
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database..."
npx prisma db seed

echo "Database initialization completed successfully!"

# Optional: Show current database tables
echo "Current database schema:"
npx prisma db pull

# Optional: Open Prisma Studio
if [[ "$1" == "--studio" ]]; then
  echo "Starting Prisma Studio..."
  npx prisma studio
fi
