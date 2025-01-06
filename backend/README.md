# Everything App Backend

Backend services for the Everything App platform, providing API endpoints for market data, social features, news aggregation, and calendar management.

## Architecture

The backend is built using a microservices architecture with the following services:

- User Service (Authentication & Profiles)
- Social Service (Posts & Interactions)
- News Service (Article Aggregation)
- Calendar Service (Events & Reminders)
- Notification Service (Real-time Updates)
- Storage Service (File Management)

## Technology Stack

- Node.js & TypeScript
- PostgreSQL (Primary Database)
- Redis (Caching & Real-time)
- Elasticsearch (Search)
- AWS Services
  - ECS (Container Orchestration)
  - RDS (Database)
  - ElastiCache (Redis)
  - OpenSearch (Elasticsearch)
  - S3 (File Storage)
  - CloudFront (CDN)

## Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js >= 18.0.0
- Make (optional, but recommended)
- AWS CLI (for deployment)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/username/everything-app.git
cd everything-app/backend
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development environment:
```bash
make dev
```

4. Run database migrations and seed data:
```bash
make dev-migrate
make dev-seed
```

5. View logs:
```bash
make dev-logs
```

### Available Make Commands

#### Development
- `make dev` - Start development environment
- `make dev-down` - Stop development environment
- `make dev-logs` - View development logs
- `make dev-migrate` - Run database migrations
- `make dev-seed` - Seed development database
- `make dev-shell` - Open shell in API container

#### Testing
- `make test` - Run tests
- `make test-watch` - Run tests in watch mode
- `make test-coverage` - Run tests with coverage

#### Database
- `make db-studio` - Start Prisma Studio
- `make db-reset` - Reset development database

#### Utility
- `make clean` - Clean up all containers and volumes
- `make lint` - Run linter
- `make format` - Format code

## Production Setup

### Local Production Testing

Test the production setup locally:

```bash
make prod
```

This will start all services in production mode using the production Docker configuration.

### AWS Deployment

1. Configure AWS credentials:
```bash
aws configure
```

2. Login to ECR:
```bash
make aws-login
```

3. Build and push image:
```bash
make build
make aws-push
```

4. Deploy to ECS:
```bash
make aws-deploy
```

## Project Structure

```
backend/
├── docker/                 # Docker configurations
│   ├── local/             # Local development setup
│   └── production/        # Production setup
├── prisma/                # Database schema and migrations
├── src/                   # Source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── middleware/      # Express middleware
└── tests/                # Test files
```

## Service Dependencies

Each service has its own set of dependencies that are automatically managed by Docker Compose:

- PostgreSQL (Database)
  - Port: 5432
  - Data: Persistent volume

- Redis (Cache)
  - Port: 6379
  - Data: Persistent volume

- Elasticsearch (Search)
  - Port: 9200
  - Data: Persistent volume

- MinIO (S3-compatible storage)
  - Port: 9000 (API)
  - Port: 9001 (Console)
  - Data: Persistent volume

- LocalStack (AWS services mock)
  - Port: 4566
  - Services: SQS, SNS, SES, CloudWatch

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## Documentation

- [API Documentation](docs/api-endpoints.md)
- [Data Models](docs/data-models.md)
- [Deployment Guide](docs/deployment.md)
- [Development Roadmap](docs/roadmap.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
