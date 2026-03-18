# 🚀 CVPM Enterprise - Getting Started Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.0.0 or higher
- **npm** 10.0.0 or higher
- **Docker** and **Docker Compose**
- **Git**
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Sanity

## 🏗️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/cvpm/cvpm-enterprise.git
cd cvpm-enterprise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:
```env
# Application
NODE_ENV=development
VITE_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cvpm_enterprise
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# CMS
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production

# Payment
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

### 4. Database Setup

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start Development Server

```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
npm run server:dev

# Start Sanity Studio (in another terminal)
npm run sanity:dev
```

Visit:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Sanity Studio**: http://localhost:3000/studio

## 🐳 Docker Development

### Complete Stack with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

Services included:
- **Frontend** (port 3000)
- **PostgreSQL** (port 5432)
- **Redis** (port 6379)
- **Nginx** (ports 80, 443)
- **Prometheus** (port 9090)
- **Grafana** (port 3001)
- **Elasticsearch** (port 9200)
- **Kibana** (port 5601)

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Performance Tests

```bash
# Build application
npm run build

# Start application
npm run start

# Run Lighthouse audit
npm run performance

# Analyze bundle size
npm run bundle-analyze
```

### Accessibility Tests

```bash
# Run accessibility tests
npm run accessibility
```

## 🎨 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Run linting and formatting

### 3. Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Security audit
npm run security
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "feat: add new feature"

# Push branch
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Ensure all checks pass
- Request code review
- Merge to main branch

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript configuration. Key settings:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true
}
```

### ESLint Configuration

Enterprise-grade linting rules:
- No `any` types
- No unused variables
- No console logs in production
- Security best practices

### Prettier Configuration

Consistent code formatting:
- Single quotes
- No semicolons
- 80 character line width
- Trailing commas

## 📁 Project Structure

```
cvpm-enterprise/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── providers/          # Context providers
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility libraries
│   ├── config/            # Configuration files
│   ├── pages/             # Page components
│   └── styles/            # CSS and styles
├── server/                 # Backend source code
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── services/          # Business logic
├── libs/                  # Shared libraries
│   ├── shared/            # Common utilities
│   ├── database/          # Database helpers
│   ├── security/          # Security utilities
│   └── messaging/         # Message queue helpers
├── sanity/                # CMS configuration
│   ├── schemas/           # Content schemas
│   ├── lib/               # Sanity utilities
│   └── studio/            # Studio customization
├── infrastructure/         # Infrastructure code
│   ├── docker/            # Docker configurations
│   ├── kubernetes/        # K8s manifests
│   ├── terraform/         # IaC scripts
│   └── nginx/             # Nginx configs
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # E2E tests
├── docs/                  # Documentation
├── scripts/               # Automation scripts
└── tools/                 # Development tools
```

## 🔐 Security

### Environment Variables

Never commit sensitive data to version control:

```bash
# ✅ Good - Use environment variables
const apiKey = process.env.API_KEY;

# ❌ Bad - Hardcoded secrets
const apiKey = 'sk_live_1234567890';
```

### Authentication

The application uses JWT-based authentication with refresh tokens:

```typescript
// Login flow
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const { token, refreshToken } = await response.json();
  localStorage.setItem('auth_token', token);
};
```

### Data Validation

All user input is validated using Zod schemas:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});
```

## 📊 Monitoring

### Performance Monitoring

The application includes built-in performance monitoring:

```typescript
import { monitoring } from '@/lib/monitoring';

// Track performance
monitoring.trackPerformance('page_load', loadTime);

// Track errors
monitoring.trackError('api_error', error);

// Track user actions
monitoring.trackUserAction('button_click', { button: 'submit' });
```

### Health Checks

API endpoints include health checks:

```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "sanity": "healthy"
  }
}
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Docker Deployment

```bash
# Build Docker image
docker build -t cvpm-enterprise .

# Run container
docker run -p 3000:3000 cvpm-enterprise
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods -l app=cvpm-enterprise
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Check types
npm run type-check
```

#### 2. Docker Issues

```bash
# Rebuild Docker images
docker-compose build --no-cache

# Check container logs
docker-compose logs app

# Reset Docker
docker-compose down -v
docker system prune -f
```

#### 3. Database Issues

```bash
# Reset database
npm run db:reset

# Check database connection
docker-compose exec postgres psql -U postgres -d cvpm_enterprise

# Run migrations
npm run db:migrate
```

### Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Start a discussion on GitHub
- **Support**: Contact enterprise@cvpm.com

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)

## 🎯 Next Steps

1. **Explore the codebase**: Read through the source code
2. **Run tests**: Ensure everything works correctly
3. **Make changes**: Start contributing to the project
4. **Join the community**: Connect with other developers

Happy coding! 🚀