# Maithil Vivah - Backend API

A comprehensive matrimonial platform backend built with NestJS, PostgreSQL, Redis, Elasticsearch, and BullMQ.

## 🚀 Tech Stack

- **Framework**: NestJS (Node.js 20 LTS)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Search**: Elasticsearch 8.11.0
- **Queue**: BullMQ
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston with daily rotation
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd maithilvivah-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=maithilvivah
DB_SYNC=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX_PREFIX=maithilvivah

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Logging
LOG_LEVEL=info
```

### 4. Start Infrastructure Services

Start PostgreSQL, Redis, and Elasticsearch using Docker Compose:

```bash
docker-compose up -d
```

Verify all services are running:

```bash
docker-compose ps
```

You should see:
- `postgres` - Running on port 5432
- `redis` - Running on port 6379
- `elasticsearch` - Running on port 9200

### 5. Start the Application

**Development mode with hot-reload:**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## 🏗️ Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
│
├── common/                          # Shared utilities
│   ├── constants/                   # API routes, messages, validation rules
│   ├── decorators/                  # Custom decorators
│   ├── dto/                         # Pagination, response DTOs
│   ├── enums/                       # Domain enums
│   ├── filters/                     # Exception filters
│   ├── interceptors/                # Response & logging interceptors
│   ├── repositories/                # Base repository pattern
│   └── services/                    # Logger service
│
├── infrastructure/                  # Infrastructure layer
│   ├── redis/                       # Redis configuration
│   ├── search/                      # Elasticsearch configuration
│   └── queue/                       # BullMQ configuration
│
└── modules/                         # Feature modules (to be created)
    ├── auth/                        # Authentication
    ├── users/                       # User management
    ├── profiles/                    # Profile management
    └── matching/                    # Match recommendations
```

## 🗄️ Database Schema

The database schema is designed with 18 tables covering:

- **Authentication**: Users, sessions, email verification, password resets
- **Profiles**: Basic info, community, location, education, family, lifestyle, astrology
- **Matching**: Partner preferences, match scores, profile views
- **Media**: Photos, documents with approval workflow

View the complete schema in `database_schema.dbml` and visualize it at [dbdiagram.io](https://dbdiagram.io).

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🎨 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Git Hooks (Husky)

Pre-commit hooks automatically:
- ✅ Lint staged files
- ✅ Format code with Prettier

Pre-push hooks automatically:
- ✅ Run all tests

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot-reload |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run lint` | Lint all files |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage report |

## 🔍 Health Check

Check if the application is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status": "ok",
    "services": {
      "database": "connected",
      "redis": "connected",
      "elasticsearch": "connected"
    },
    "uptime": 12345
  },
  "meta": {
    "timestamp": "2026-01-30T00:00:00.000Z",
    "path": "/health",
    "version": "1.0"
  }
}
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart postgres

# Remove all containers and volumes
docker-compose down -v
```

## 📊 Logging

Logs are stored in the `logs/` directory:

- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

Logs are automatically rotated daily and retained for 14 days.

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (TypeORM)
- ✅ XSS protection

## 🚀 Deployment

### Environment Variables

Ensure all production environment variables are set:

```bash
NODE_ENV=production
DB_SYNC=false  # IMPORTANT: Disable auto-sync in production
JWT_SECRET=<strong-random-secret>
```

### Build

```bash
npm run build
```

### Start

```bash
npm run start:prod
```

## 📝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Code is automatically linted and formatted on commit (Husky)

3. **Run tests**
   ```bash
   npm run test
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Tests run automatically before push (Husky)

## 🤝 Contributing

1. Follow the existing code structure
2. Use the BaseRepository for database operations
3. Add proper TypeScript types
4. Write tests for new features
5. Update documentation

## 📄 License

[Your License Here]

## 👥 Team

[Your Team Information]

## 📞 Support

For issues and questions, please contact [Your Contact Information]

---

**Built with ❤️ using NestJS**
