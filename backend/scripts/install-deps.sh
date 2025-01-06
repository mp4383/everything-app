#!/bin/bash

# Install production dependencies
npm install express cors helmet morgan dotenv

# Install development dependencies including type declarations
npm install -D \
    @types/express \
    @types/cors \
    @types/helmet \
    @types/morgan \
    @types/node \
    @types/jest \
    @types/supertest \
    typescript \
    ts-node \
    nodemon \
    jest \
    ts-jest \
    jest-extended \
    jest-watch-typeahead \
    supertest \
    jest-junit

# Initialize TypeScript if tsconfig.json doesn't exist
if [ ! -f "tsconfig.json" ]; then
    npx tsc --init
fi

# Create necessary directories
mkdir -p src/__tests__

echo "Dependencies installed successfully!"
