# Technology Stack Specification
## Lab Tracking Web Application

**Version:** 1.0
**Date:** 2025-10-23
**Status:** Approved - Implementation In Progress

---

## Overview

This document defines the complete technology stack for the Lab Tracking Web Application, aligned with the project's deployment infrastructure (Docker + Nginx + Google Cloud Compute Engine).

---

## Technology Decision Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Frontend Framework** | React | 19+ | Modern, component-based, excellent ecosystem |
| | Next.js | 15+ | SSR support, App Router, file-based routing |
| **Backend Framework** | Express.js | 4+ | Mature, flexible, extensive middleware ecosystem |
| **Language** | TypeScript | 5+ | Type safety, better DX, reduced runtime errors |
| **Database** | PostgreSQL | 15+ | ACID compliance, JSONB support, production-ready |
| **ORM** | Prisma | 5+ | Type-safe queries, great migrations, clean API |
| **Styling** | Tailwind CSS | 3+ | Utility-first, rapid development, consistent design |
| **UI Components** | Shadcn UI | Latest | Accessible, customizable, modern components |
| **State Management** | React Query | 5+ | Declarative data fetching, excellent caching |
| | Zustand | Latest | Simple global state without Redux overhead |
| **Form Management** | React Hook Form | 7+ | Performant, minimal re-renders, great DX |
| **Validation** | Zod | 3+ | TypeScript-first, runtime validation, shared schemas |
| **Authentication** | JWT + bcrypt | Latest | Stateless, scalable, industry-standard hashing |
| **File Storage** | Local Filesystem | N/A | Simple, cost-effective for MVP |
| **Containerization** | Docker | Latest | Consistent environments, easy deployment |
| **Reverse Proxy** | Nginx | Latest | High performance, SSL termination, load balancing |
| **Hosting** | GCP Compute Engine | N/A | Full control, cost-effective, scalable |
| **Monorepo** | pnpm Workspaces | Latest | Efficient, fast, excellent workspace support |

---

## Frontend Stack

### Core
- **React 19+**: UI library
- **Next.js 15+**: Framework with App Router for routing and SSR
- **TypeScript 5+**: Type safety across the application

### Styling & UI
- **Tailwind CSS**: All styling
- **Shadcn UI** (Radix UI primitives): Pre-built accessible components
  - Tables, Forms, Modals, Dialogs, Date Pickers, Dropdowns
- **Lucide React**: Consistent iconography

### State Management
- **TanStack Query (React Query) v5+**: Server state, data fetching, caching
- **Zustand** or **Context API**: Global UI state (user auth, theme, notifications)

### Forms & Validation
- **React Hook Form v7+**: Form management
- **Zod v3+**: Validation schemas (shared with backend)
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### HTTP Client
- **Axios**: HTTP requests with interceptors for auth tokens

### File Upload
- **React Dropzone**: Drag-and-drop file uploads

---

## Backend Stack

### Core
- **Express.js v4+** with TypeScript: RESTful API server
- **Node.js**: Runtime environment

### Database
- **PostgreSQL 15+**: Primary data store
  - JSONB support for flexible fields
  - Full-text search
  - Transactions for data integrity

### ORM
- **Prisma v5+**: Database interaction
  - Type-safe queries
  - Schema definition in `schema.prisma`
  - Automated migrations

### Authentication & Security
- **jsonwebtoken (JWT)**: Stateless authentication
  - Token payload: `userId`, `role`, `email`, `exp`
  - Storage: HttpOnly cookies (recommended) or localStorage
- **bcryptjs**: Password hashing (12 salt rounds)
- **cors**: CORS middleware
- **helmet**: Security headers

### Validation
- **Zod v3+**: Runtime validation (shared schemas with frontend)

### File Management
- **Multer**: Handle multipart/form-data uploads
- **Local Filesystem**: File storage in Docker volumes
  - `/uploads/registration-docs`
  - `/uploads/lab-results`
  - `/uploads/payment-slips`

### Logging & Monitoring
- **Winston**: Structured logging with multiple transports
  - Console output for development
  - File output (`server.log`) for production

### Environment Configuration
- **dotenv**: Environment variable management

---

## Shared/Common (Monorepo)

### Monorepo Structure
```
/workspace
  /apps
    /frontend      (Next.js application)
    /backend       (Express API)
  /packages
    /shared        (Common types, schemas, utilities)
```

### Shared Package (`packages/shared`)
- **TypeScript interfaces**: All data models (User, Customer, TestRequest, Sample, Invoice, etc.)
- **Zod schemas**: Validation rules shared between frontend and backend
- **Enum types**: UserRole, RequestStatus, DocumentStatus, etc.
- **API types**: Request/response interfaces

---

## Development Tools

### Code Quality
- **ESLint v8+**: Lint TypeScript/JavaScript
  - Plugins: @typescript-eslint, eslint-plugin-react
- **Prettier v3+**: Code formatting

### Testing
- **Backend**:
  - Jest: Unit and integration tests
  - Supertest: API endpoint testing
- **Frontend**:
  - Vitest or Jest: Unit tests
  - React Testing Library: Component tests
  - (Future) Playwright or Cypress: E2E tests

### Version Control
- **Git** with GitHub
- **Branching Strategy**: Feature branches with PR-based workflow
- **Commit Convention**: Conventional Commits

### API Documentation
- **Swagger/OpenAPI**: API documentation (already configured)

---

## Infrastructure & Deployment

### Deployment Architecture
```
┌─────────────────────────────────────────┐
│   Google Cloud Compute Engine (VM)     │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │         Nginx (Port 80/443)       │ │
│  │  - Reverse Proxy                  │ │
│  │  - SSL Termination                │ │
│  │  - Static File Serving            │ │
│  └───────────────────────────────────┘ │
│              ↓                          │
│  ┌───────────────────────────────────┐ │
│  │         Docker Containers         │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Frontend (Next.js)         │ │ │
│  │  │  Port: 3000                 │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  Backend (Express)          │ │ │
│  │  │  Port: 5001                 │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │  PostgreSQL                 │ │ │
│  │  │  Port: 5432                 │ │ │
│  │  │  Volume: /var/lib/postgres  │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  Volumes:                         │ │
│  │  - /uploads (file storage)        │ │
│  │  - /var/lib/postgresql/data       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Containerization
- **Docker**: Container runtime
  - `Dockerfile` for frontend (Next.js build)
  - `Dockerfile` for backend (Node.js)
  - PostgreSQL official image
- **Docker Compose**: Multi-container orchestration
  - Defines all services (frontend, backend, database)
  - Manages volumes and networks

### Reverse Proxy
- **Nginx**:
  - Route `/` to frontend container
  - Route `/api` to backend container
  - Serve static files efficiently
  - SSL/TLS termination (Let's Encrypt)

### File Storage
- **Local Filesystem** with Docker Volumes:
  - Persistent storage across container restarts
  - Mapped to host directories on Compute Engine
  - Backed up regularly

### Database
- **PostgreSQL in Docker**:
  - Persistent volume for data
  - Regular automated backups
  - Connection pooling configured in Prisma

### CI/CD (Optional Enhancement)
- **Google Cloud Build** or **GitHub Actions**:
  - Run tests on PR
  - Build Docker images
  - Deploy to Compute Engine
  - Run database migrations

---

## Environment Configuration

### Development Environment
- Local Docker Compose
- Hot reload enabled
- `.env.development`

### Production Environment
- Docker containers on Compute Engine
- Nginx with SSL
- `.env.production`
- Automated backups

---

## Security Considerations

### Backend
- Input validation (Zod)
- SQL injection protection (Prisma ORM)
- XSS protection (sanitize inputs, CSP headers)
- CSRF protection (SameSite cookies)
- Rate limiting on auth endpoints
- CORS restricted to frontend domain
- Password hashing (bcrypt, 12 rounds)
- JWT with short expiration

### Frontend
- XSS prevention (React auto-escaping)
- Secure token storage (HttpOnly cookies preferred)
- HTTPS only in production
- Content Security Policy

### Infrastructure
- Firewall rules on Compute Engine
- SSH key-based authentication
- Regular security updates
- SSL/TLS with Let's Encrypt

---

## Rationale for Key Decisions

### Why Local File Storage vs Cloud Storage?
- **Cost**: No additional cloud storage fees
- **Simplicity**: Easier to manage in Docker environment
- **Performance**: Local disk I/O is fast
- **Future**: Can migrate to Cloud Storage if scaling requires

### Why Docker + Nginx vs Cloud Run?
- **Control**: Full control over environment
- **Cost**: More predictable costs
- **Flexibility**: Custom configurations possible
- **Nginx**: Efficient static file serving and SSL termination

### Why pnpm vs npm/yarn?
- **Efficiency**: Disk space savings with shared dependencies
- **Speed**: Faster installs
- **Workspace Support**: Excellent monorepo support

### Why Prisma vs TypeORM?
- **Type Safety**: Better TypeScript integration
- **Migrations**: More reliable migration system
- **DX**: Cleaner, more intuitive API
- **Performance**: Efficient query generation

---

## Dependencies Summary

### Frontend Key Packages
```json
{
  "@tanstack/react-query": "^5.86.0",
  "next": "^15.5.2",
  "react": "19.1.0",
  "react-hook-form": "^7.62.0",
  "zod": "^3.25.76",
  "@star-lab/shared": "workspace:*",
  "axios": "^1.x",
  "clsx": "^2.1.1",
  "tailwindcss": "^4"
}
```

### Backend Key Packages
```json
{
  "@prisma/client": "^6.18.0",
  "express": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "multer": "^1.x",
  "winston": "^3.x",
  "zod": "^3.22.0",
  "@star-lab/shared": "workspace:*",
  "cors": "^2.x",
  "helmet": "^7.x"
}
```

---

**Last Updated**: 2025-10-23
**Version**: 1.0
**Status**: Approved - Aligned with Existing Infrastructure
