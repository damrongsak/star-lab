/// LAB TEST TRACKING BACKEND (Express + TS + Prisma + Docker)

// ✅ Basic file structure for TypeScript project with JWT Auth, Role Middleware, Prisma, PostgreSQL, and Jest for testing

/\*
README.md
=========

# Lab Test Tracking Backend

This backend application manages lab test workflows including test creation, submission, review, approval, and result uploads. Built using:

- Express.js + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication with Role-based Access (ADMIN, CUSTOMER, TECHNICIAN, DOCTOR, APPROVAL)
- File upload support
- Swagger UI documentation
- Jest for testing

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/labdb
JWT_SECRET=your_jwt_secret_here
```

## API Docs

Visit: `http://localhost:5001/api-docs`

## Test

```bash
npm run test
```
