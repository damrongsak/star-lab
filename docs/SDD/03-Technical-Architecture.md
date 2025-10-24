# Technical Architecture & Design Plan
## Lab Tracking Web Application

**Version:** 1.0
**Date:** 2025-10-23
**Status:** Approved - Implementation In Progress

---

## 1. System Architecture Overview

### Architecture Pattern
**Monorepo Full-Stack Architecture** with clear separation between frontend, backend, and shared code.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Next.js 15 Frontend (React 19 + TypeScript)         │  │
│  │   - Customer Portal                                    │  │
│  │   - Lab Internal Dashboard                            │  │
│  │   - Doctor Approval Interface                         │  │
│  │   - Admin Panel                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕ HTTPS/REST API                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Express.js API Server (TypeScript)                  │  │
│  │   ┌─────────────────────────────────────────────────┐ │  │
│  │   │ Middleware Layer                                │ │  │
│  │   │ - JWT Authentication                            │ │  │
│  │   │ - RBAC Authorization                            │ │  │
│  │   │ - Input Validation (Zod)                        │ │  │
│  │   │ - Error Handling                                │ │  │
│  │   │ - File Upload (Multer)                          │ │  │
│  │   │ - Logging (Winston)                             │ │  │
│  │   └─────────────────────────────────────────────────┘ │  │
│  │   ┌─────────────────────────────────────────────────┐ │  │
│  │   │ API Routes (/api/v1)                            │ │  │
│  │   │ - /auth (login, register, verify)               │ │  │
│  │   │ - /customers (CRUD, profile)                    │ │  │
│  │   │ - /test-requests (customer requests)            │ │  │
│  │   │ - /lab/* (internal operations)                  │ │  │
│  │   │ - /doctors (approval workflow)                  │ │  │
│  │   │ - /invoices (billing)                           │ │  │
│  │   │ - /admin/users (user management)                │ │  │
│  │   └─────────────────────────────────────────────────┘ │  │
│  │   ┌─────────────────────────────────────────────────┐ │  │
│  │   │ Business Logic Services                         │ │  │
│  │   │ - CustomerService                               │ │  │
│  │   │ - TestRequestService                            │ │  │
│  │   │ - LabService                                    │ │  │
│  │   │ - DoctorService                                 │ │  │
│  │   │ - InvoiceService                                │ │  │
│  │   │ - FileService                                   │ │  │
│  │   │ - UserService                                   │ │  │
│  │   │ - [EmailService - To Be Implemented]           │ │  │
│  │   └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕ Prisma ORM                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATA TIER                            │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │ PostgreSQL Database  │    │ Local File Storage       │  │
│  │ (Docker Container)   │    │ (Docker Volume)          │  │
│  │                      │    │                          │  │
│  │ - users              │    │ - /uploads/              │  │
│  │ - customers          │    │   - registration-docs/   │  │
│  │ - test_requests      │    │   - lab-results/         │  │
│  │ - test_request_samples│   │   - payment-slips/       │  │
│  │ - lab_tests          │    │                          │  │
│  │ - lab_results        │    │                          │  │
│  │ - invoices           │    │                          │  │
│  │ - invoice_line_items │    │                          │  │
│  │ - doctors            │    │                          │  │
│  │ - user_profiles      │    │                          │  │
│  │ - document_attachments│   │                          │  │
│  │ - projects           │    │                          │  │
│  │ - storage_locations  │    │                          │  │
│  │ - audit_trail        │    │                          │  │
│  └──────────────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Design

### Core Entity Relationships

```
User (auth & roles)
  ├─ Customer (1:1) - if role = CUSTOMER
  ├─ Doctor (1:1) - if role = DOCTOR
  ├─ UserProfile (1:1) - for all internal staff
  └─ AuditTrail (1:many) - audit logs

Customer
  ├─ TestRequest (1:many)
  └─ Invoice (1:many)

TestRequest
  ├─ TestRequestSample (1:many)
  ├─ Invoice (1:1)
  ├─ Project (many:1) - optional
  └─ Doctor (many:1) - assigned approver

TestRequestSample
  ├─ LabTest (1:many)
  └─ StorageLocation (many:1) - optional

LabTest
  ├─ LabResult (1:many)
  └─ User (many:1) - assigned technician

Invoice
  └─ InvoiceLineItem (1:many)
```

### Key Schema Features

**Implemented in**: `apps/backend/prisma/schema.prisma`

1. **UUID Primary Keys**: Security and distributed system compatibility
2. **JSONB Columns**: Flexible data (addresses, file metadata, line items)
3. **Enum Types**: Status fields and roles for data integrity
4. **Cascade Deletes**: Configured appropriately (e.g., deleting request deletes samples)
5. **Indexes**: On frequently queried fields (email, requestNo, status, dates)
6. **Timestamps**: createdAt, updatedAt on all main tables

### Status Flow

**TestRequest Document Status** (Customer View):
```
DRAFT → SUBMITTED → PENDING_PAYMENT → APPROVED / REJECTED / CANCELLED
```

**Lab Internal Status** (Staff View):
```
WAITING_APPROVAL_LAB → RECEIVED_SAMPLES → ASSIGNED_TECHNICIAN →
IN_PROGRESS → RESULTS_UPLOADED → REVIEWED_BY_DOCTOR →
READY_FOR_APPROVAL → COMPLETED
```

---

## 3. API Design

### RESTful API Structure

**Base URL:** `http://localhost:5001/api/v1` (dev) or `https://your-domain.com/api/v1` (prod)

### API Endpoints Summary

| Category | Endpoints | Auth | Roles |
|----------|-----------|------|-------|
| **Authentication** | POST /auth/register<br>POST /auth/login<br>GET /auth/verify-email/:token<br>GET /auth/profile<br>POST /auth/change-password | Public for register/login<br>Protected for others | Any |
| **Customer Portal** | GET /customers/profile<br>PUT /customers/profile<br>GET /customers/statistics<br>POST /customers/documents | Protected | CUSTOMER |
| **Test Requests** | POST /test-requests<br>GET /test-requests/my-requests<br>GET /test-requests/:id<br>PUT /test-requests/:id<br>POST /test-requests/:id/samples<br>PUT /test-requests/samples/:id | Protected | CUSTOMER (own), ADMIN/LAB_ADMIN (all) |
| **Lab Operations** | GET /lab/tests<br>GET /lab/my-tests<br>POST /lab/tests<br>POST /lab/results<br>PUT /lab/results/:id<br>POST /lab/tests/:id/complete | Protected | TECHNICIAN, ADMIN, LAB_ADMIN |
| **Doctor Workflow** | GET /doctors/profile/test-requests<br>POST /doctors/assign-test-request<br>GET /doctors/:doctorId/workload | Protected | DOCTOR, ADMIN, LAB_ADMIN |
| **Invoices** | POST /invoices/test-request/:testRequestId<br>GET /invoices/:invoiceId<br>PATCH /invoices/:invoiceId/mark-paid<br>GET /invoices/number/:invoiceNo | Protected | Varies by endpoint |
| **Admin** | GET /admin/users<br>POST /admin/users<br>PUT /admin/users/:id<br>DELETE /admin/users/:id | Protected | ADMIN, LAB_ADMIN |

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## 4. Authentication & Authorization Flow

### Registration Flow (Customers)
1. Customer submits registration form with company details
2. Backend validates input, hashes password (bcrypt, 12 rounds)
3. Create User + Customer records in transaction
4. Generate email verification token (UUID), store in user.verificationToken
5. **[To Implement]** Send verification email with link
6. Customer clicks link → backend verifies token → sets `isEmailConfirmed = true`
7. Customer can now log in

### Login Flow
1. User submits email + password
2. Backend finds user by email
3. Compare password hash with bcrypt
4. If valid, generate JWT with payload: `{userId, email, role, exp}`
5. Return JWT token in response body (or HttpOnly cookie)
6. Frontend stores token and includes in Authorization header for subsequent requests

### Authorization Middleware
```typescript
// Pseudo-code
authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'No token'});

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // {userId, email, role}
    next();
  } catch (err) {
    return res.status(403).json({error: 'Invalid token'});
  }
}

requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({error: 'Insufficient permissions'});
    }
    next();
  };
}
```

**Implemented in**:
- `apps/backend/src/middleware/authMiddleware.ts`
- `apps/backend/src/middleware/rbacMiddleware.ts`

---

## 5. File Upload & Storage Flow

### Upload Process
1. **Frontend**: User selects file(s) via React Dropzone
2. **Frontend**: Validate file type, size (client-side)
3. **Frontend**: Create multipart/form-data request
4. **Backend**: Multer middleware receives file
5. **Backend**: Validate again (type, size, content)
6. **Backend**: Generate unique filename (UUID + original extension)
7. **Backend**: Save to local storage (`/uploads/{category}/`)
8. **Backend**: Create DocumentAttachment record with file metadata
9. **Backend**: Return file info to frontend

### File Access
- **Registration docs**: Private, only visible to admins and owning customer
- **Lab results**: Private, only visible to customer and lab staff after approval
- **Payment slips**: Private, only visible to admins and owning customer

**Security**: Files served through authenticated endpoints, not direct static serving

**Implemented in**:
- `apps/backend/src/services/FileService.ts`
- [Multer middleware - To Verify]

---

## 6. Business Logic Services

### Key Services

**CustomerService** (`apps/backend/src/services/CustomerService.ts`)
- `getProfile(userId)`: Get customer profile
- `updateProfile(userId, data)`: Update customer info
- `getStatistics(customerId)`: Get request statistics

**TestRequestService** (`apps/backend/src/services/TestRequestService.ts`)
- `createTestRequest(data)`: Create draft request
- `generateRequestNumber()`: **[To Implement]** Auto-generate unique number
- `submitRequest(requestId)`: Change status to SUBMITTED
- `getCustomerRequests(customerId, filters)`: List with search/filter
- `updateRequest(requestId, data)`: Update draft

**LabService** (`apps/backend/src/services/LabService.ts`)
- `createLabTest(data)`: Create lab test from sample
- `enterResults(testId, resultData)`: Create lab result records
- `completeLabTest(testId)`: Mark test complete
- `getLabStatistics()`: Dashboard statistics

**DoctorService** (`apps/backend/src/services/DoctorService.ts`)
- `assignTestRequest(testRequestId, doctorId)`: Assign to doctor
- `getDoctorWorkload(doctorId)`: Get assigned requests
- `getMyTestRequests(doctorId)`: Doctor's pending approvals

**InvoiceService** (`apps/backend/src/services/InvoiceService.ts`)
- `generateInvoice(testRequestId)`: Auto-create invoice
- `calculateTotals(items)`: Calculate subtotal, tax (7%), net
- `markAsPaid(invoiceId)`: Update payment status

**FileService** (`apps/backend/src/services/FileService.ts`)
- [To Verify] File upload and retrieval methods

**UserService** (`apps/backend/src/services/UserService.ts`)
- User CRUD operations for admin

**EmailService** **[To Implement]**
- `sendVerificationEmail(email, token)`
- `sendApprovalNotification(customerId, requestId)`
- `sendRejectionNotification(customerId, requestId, reason)`

---

## 7. Frontend Architecture

### Next.js App Structure (Planned)
```
apps/frontend/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── verify-email/page.tsx
├── (customer)/
│   ├── dashboard/page.tsx
│   ├── requests/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── invoice/page.tsx
│   └── profile/page.tsx
├── (lab)/
│   ├── lab/
│   │   ├── dashboard/page.tsx
│   │   └── requests/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           ├── acknowledge/page.tsx
│   │           └── results/page.tsx
│   └── doctor/
│       ├── pending-approvals/page.tsx
│       └── requests/[id]/page.tsx
├── (admin)/
│   └── admin/
│       ├── users/page.tsx
│       └── dashboard/page.tsx
├── layout.tsx
├── middleware.ts
└── components/
    ├── ui/ (Shadcn components)
    ├── forms/ (Form components)
    ├── tables/ (Table components)
    └── layouts/ (Role-based layouts)
```

### State Management Strategy

1. **React Query** for server state:
   - All API calls wrapped in query/mutation hooks
   - Automatic caching and revalidation
   - Optimistic updates for better UX

2. **Zustand/Context** for client state:
   - User authentication state
   - UI state (modals, notifications, theme)
   - Form draft state (local storage sync)

---

## 8. Security Measures

### Backend Security
- **Input Validation**: All endpoints use Zod schemas
- **SQL Injection**: Prisma ORM prevents SQL injection
- **XSS Protection**: Sanitize user input, CSP headers
- **CSRF Protection**: SameSite cookies, CSRF tokens for state-changing operations
- **Rate Limiting**: **[To Implement]** On login, registration endpoints
- **CORS**: Restrict to frontend domain only
- **File Upload Security**:
  - Validate MIME types
  - Limit file sizes
  - Scan for malware (future enhancement)
- **Password Security**: bcrypt with 12 salt rounds
- **JWT Security**:
  - Short expiration (configurable, default 24h)
  - HttpOnly cookies (recommended)
  - Token rotation (optional enhancement)

### Frontend Security
- **XSS Prevention**: React auto-escapes, avoid dangerouslySetInnerHTML
- **Secure Storage**: JWT in HttpOnly cookies preferred over localStorage
- **HTTPS Only**: Enforce in production
- **Content Security Policy**: Restrict script sources

---

## 9. Deployment Architecture

### Docker + Nginx on GCP Compute Engine

```
┌──────────────────────────────────────────────┐
│   Google Cloud Compute Engine VM (Ubuntu)    │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Nginx (Port 80/443)                   │ │
│  │  - Reverse proxy                       │ │
│  │  - SSL termination (Let's Encrypt)     │ │
│  │  - Static file serving                 │ │
│  │                                        │ │
│  │  Location /     → Frontend:3000        │ │
│  │  Location /api  → Backend:5001         │ │
│  └────────────────────────────────────────┘ │
│                    ↓                         │
│  ┌────────────────────────────────────────┐ │
│  │  Docker Compose                        │ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │ frontend-container (Next.js)     │ │ │
│  │  │ Port: 3000                       │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │ backend-container (Express)      │ │ │
│  │  │ Port: 5001                       │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │ postgres-container               │ │ │
│  │  │ Port: 5432 (internal only)       │ │ │
│  │  │ Volume: postgres_data            │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │                                        │ │
│  │  Volumes:                              │ │
│  │  - /uploads (persistent file storage) │ │
│  │  - postgres_data (database)           │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Key Configuration Files**:
- `docker-compose.yml` - orchestrates all services
- `apps/backend/Dockerfile` - backend container
- `apps/frontend/Dockerfile` - frontend container
- `nginx.conf` - reverse proxy configuration

---

## 10. Performance Considerations

### Backend Optimization
- Database indexes on frequently queried fields
- Connection pooling for PostgreSQL (Prisma default)
- Response compression (gzip) **[To Implement]**
- Pagination for list endpoints (default 20 items)
- Caching with Redis (future enhancement)

### Frontend Optimization
- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Lazy loading for heavy components
- React Query caching reduces API calls
- Debounced search inputs

---

**Last Updated**: 2025-10-23
**Version**: 1.0
**Status**: Architecture Approved, Implementation In Progress
