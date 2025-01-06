const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test timeout
jest.setTimeout(30000);

const prisma = new PrismaClient();

beforeAll(async () => {
  // Run migrations on test database
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = {
  prisma,
};
