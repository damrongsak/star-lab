# Implementation Plan - Task Breakdown
## Lab Tracking Web Application

**Version:** 1.0
**Date:** 2025-10-23
**Total Tasks:** 158 organized into 18 phases

---

## Overview

This implementation plan breaks down the entire STAR-LAB project into 158 atomic, testable tasks. Each task includes:
- ✅ Clear, specific instruction
- ✅ Validation/test criteria
- ✅ File references where applicable

**Estimated Timeline:** 10-12 weeks for full implementation

---

## Phase Summary

| Phase | Name | Tasks | Est. Time | Status |
|-------|------|-------|-----------|--------|
| 1 | Foundation & Setup | 10 | 1-2 days | ✅ Complete |
| 2 | Backend Auth & Authorization | 13 | 2-3 days | ✅ ~95% Complete |
| 3 | File Upload & Storage | 5 | 1 day | ⚠️ Needs Verification |
| 4 | Customer Profile & Requests | 12 | 2-3 days | ✅ ~90% Complete |
| 5 | Lab Internal Operations | 8 | 2 days | ✅ ~90% Complete |
| 6 | Doctor Approval Workflow | 6 | 1-2 days | ✅ ~90% Complete |
| 7 | Invoice Management | 6 | 1-2 days | ✅ ~90% Complete |
| 8 | Admin User Management | 5 | 1 day | ✅ ~90% Complete |
| 9 | Audit Trail & Logging | 3 | 0.5 day | ⚠️ Needs Verification |
| 10 | Frontend Auth Pages | 15 | 2 days | ❌ Not Started |
| 11 | Protected Routes & Navigation | 5 | 1 day | ❌ Not Started |
| 12 | Customer Portal | 17 | 4-5 days | ❌ Not Started |
| 13 | Lab Internal Interface | 9 | 3-4 days | ❌ Not Started |
| 14 | Doctor Approval Interface | 6 | 2 days | ❌ Not Started |
| 15 | Admin Interface | 13 | 2-3 days | ❌ Not Started |
| 16 | Testing | 12 | 3-4 days | ⚠️ Partial (backend unit tests exist) |
| 17 | Deployment Preparation | 10 | 1-2 days | ⚠️ Partial (Docker files exist) |
| 18 | Documentation & Polish | 15 | 3-4 days | ❌ Not Started |

---

## PHASE 1: Foundation & Setup ✅

**Status:** Complete
**Tasks:** T-1.1 through T-1.10

| Task | Description | Status | Validation |
|------|-------------|--------|------------|
| T-1.1 | Verify monorepo structure | ✅ | Confirmed apps/backend, apps/frontend, packages/shared |
| T-1.2 | Create shared types directory | ✅ | packages/shared/src/types exists |
| T-1.3 | Define core TypeScript types | ✅ | All enums and interfaces in types.ts |
| T-1.4 | Create Zod validation schemas | ✅ | Auth schemas exist, more needed |
| T-1.5 | Review Prisma schema | ✅ | Complete schema verified |
| T-1.6 | Define Prisma models | ✅ | All models defined |
| T-1.7 | Generate Prisma Client | ✅ | `npx prisma generate` |
| T-1.8 | Create initial migration | ✅ | Migration files exist |
| T-1.9 | Apply migration | ⚠️ | Run `npx prisma migrate deploy` |
| T-1.10 | Set up .env.example files | ⚠️ | Verify exists |

---

## PHASE 2: Backend Auth & Authorization ✅

**Status:** ~95% Complete (Email service missing)
**Tasks:** T-2.1 through T-2.13

### Critical Gap:
- **T-2.10**: ❌ Email service missing (`EmailService.ts`)
- **T-2.2**: ❌ Error handler middleware empty

### Completed:
- ✅ T-2.1: Express server setup with middleware
- ✅ T-2.3: Winston logger configured
- ✅ T-2.4: Password hashing with bcrypt
- ✅ T-2.5: JWT token generation/verification
- ✅ T-2.6: Authentication middleware
- ✅ T-2.7: Authorization (RBAC) middleware
- ✅ T-2.8: POST /api/v1/auth/register endpoint
- ✅ T-2.9: Email verification token generation
- ✅ T-2.11: POST /api/v1/auth/verify-email endpoint
- ✅ T-2.12: POST /api/v1/auth/login endpoint
- ✅ T-2.13: GET /api/v1/auth/me endpoint

**Files:**
- `apps/backend/src/server.ts`
- `apps/backend/src/middleware/authMiddleware.ts`
- `apps/backend/src/middleware/rbacMiddleware.ts`
- `apps/backend/src/routes/authRoutes.ts`
- `apps/backend/src/utils/jwt.ts`
- `apps/backend/src/utils/password.ts`

---

## PHASE 3: File Upload & Storage ⚠️

**Status:** Needs Verification
**Tasks:** T-3.1 through T-3.5

| Task | Description | Status | File |
|------|-------------|--------|------|
| T-3.1 | Create upload directories | ⚠️ | Check `/uploads/*` directories |
| T-3.2 | Configure Multer middleware | ⚠️ | Check for Multer config |
| T-3.3 | Create FileStorageService | ✅ | `apps/backend/src/services/FileService.ts` exists |
| T-3.4 | POST /customers/documents endpoint | ⚠️ | Verify implementation |
| T-3.5 | Serve uploaded files securely | ⚠️ | Verify static file route |

---

## PHASE 4: Customer Profile & Requests ✅

**Status:** ~90% Complete (Request number generator missing)
**Tasks:** T-4.1 through T-4.12

### Critical Gap:
- **T-4.3**: ❌ Request number generator empty file

### Completed:
- ✅ T-4.1: GET /api/v1/customers/profile
- ✅ T-4.2: PUT /api/v1/customers/profile
- ✅ T-4.4: POST /api/v1/requests (draft creation)
- ✅ T-4.5: GET /api/v1/requests (list with filters)
- ✅ T-4.6: GET /api/v1/requests/:id
- ✅ T-4.7: PUT /api/v1/requests/:id (update draft)
- ✅ T-4.8: DELETE /api/v1/requests/:id
- ✅ T-4.9-12: Sample management endpoints

**Files:**
- `apps/backend/src/routes/customers.ts`
- `apps/backend/src/routes/testRequest.ts`
- `apps/backend/src/services/TestRequestService.ts`
- `apps/backend/src/services/CustomerService.ts`

---

## PHASE 5: Lab Internal Operations ✅

**Status:** ~90% Complete
**Tasks:** T-5.1 through T-5.8

All endpoints and services exist:
- ✅ GET /api/v1/lab/requests (filtering)
- ✅ GET /api/v1/lab/requests/:id
- ✅ POST /api/v1/lab/requests/:id/acknowledge
- ✅ PUT /api/v1/lab/requests/:id/samples/:sampleId/quantity
- ✅ POST /api/v1/lab/results
- ✅ PUT /api/v1/lab/results/:id
- ✅ POST /api/v1/lab/results/:resultId/submit-approval

**Files:**
- `apps/backend/src/routes/lab.ts`
- `apps/backend/src/services/LabService.ts`

---

## PHASE 6: Doctor Approval Workflow ✅

**Status:** ~90% Complete (Email notifications missing)
**Tasks:** T-6.1 through T-6.6

### Critical Gap:
- **T-6.6**: ❌ Email notification service missing

### Completed:
- ✅ GET /api/v1/doctor/pending-approvals
- ✅ GET /api/v1/doctor/requests/:id
- ✅ POST /api/v1/doctor/requests/:id/approve
- ✅ POST /api/v1/doctor/requests/:id/reject

**Files:**
- `apps/backend/src/routes/doctor.ts`
- `apps/backend/src/services/DoctorService.ts`

---

## PHASE 7: Invoice Management ✅

**Status:** ~90% Complete
**Tasks:** T-7.1 through T-7.6

All invoice functionality exists:
- ✅ Invoice generation logic
- ✅ Calculation methods (subtotal, tax, net)
- ✅ Auto-generation on approval
- ✅ GET /api/v1/invoices/:requestId
- ✅ POST /api/v1/invoices/:id/payment-slip
- ✅ POST /api/v1/admin/invoices/:id/mark-paid

**Files:**
- `apps/backend/src/routes/invoice.ts`
- `apps/backend/src/services/InvoiceService.ts`

---

## PHASE 8: Admin User Management ✅

**Status:** ~90% Complete
**Tasks:** T-8.1 through T-8.5

All admin endpoints exist:
- ✅ GET /api/v1/admin/users
- ✅ POST /api/v1/admin/users
- ✅ PUT /api/v1/admin/users/:id
- ✅ DELETE /api/v1/admin/users/:id
- ✅ PUT /api/v1/admin/users/:id/role

**Files:**
- `apps/backend/src/routes/admin/users.ts`
- `apps/backend/src/controllers/AdminUserController.ts`

---

## PHASE 9: Audit Trail & Logging ⚠️

**Status:** Needs Verification
**Tasks:** T-9.1 through T-9.3

| Task | Description | Status |
|------|-------------|--------|
| T-9.1 | Audit logging middleware | ⚠️ Verify exists |
| T-9.2 | Create audit logs in operations | ⚠️ Verify usage |
| T-9.3 | GET /api/v1/admin/audit-logs | ⚠️ Verify endpoint |

**Database:** AuditLog model exists in Prisma schema

---

## PHASE 10: Frontend Auth Pages ❌

**Status:** Not Started (0%)
**Tasks:** T-10.1 through T-10.15

### Setup Tasks:
- ❌ T-10.1: Verify Next.js setup
- ❌ T-10.2: Configure Tailwind CSS
- ❌ T-10.3: Install Shadcn UI (`npx shadcn-ui@latest init`)
- ❌ T-10.4: Set up React Query Provider
- ❌ T-10.5: Create API client with axios
- ❌ T-10.6: Create auth context

### Auth Pages:
- ❌ T-10.7: Create registration Zod schema
- ❌ T-10.8: Create RegisterForm component
- ❌ T-10.9: Create registration page
- ❌ T-10.10: Implement useRegister mutation
- ❌ T-10.11: Create email verification page
- ❌ T-10.12: Create LoginForm component
- ❌ T-10.13: Create login page
- ❌ T-10.14: Implement useLogin mutation
- ❌ T-10.15: Implement logout functionality

**Files to Create:**
- `apps/frontend/lib/api/client.ts`
- `apps/frontend/lib/providers/QueryProvider.tsx`
- `apps/frontend/lib/context/AuthContext.tsx`
- `apps/frontend/app/(auth)/register/page.tsx`
- `apps/frontend/app/(auth)/login/page.tsx`
- `apps/frontend/app/(auth)/verify-email/page.tsx`
- `apps/frontend/components/forms/RegisterForm.tsx`
- `apps/frontend/components/forms/LoginForm.tsx`

---

## PHASE 11: Protected Routes & Navigation ❌

**Status:** Not Started (0%)
**Tasks:** T-11.1 through T-11.5

- ❌ T-11.1: Create Next.js middleware for auth
- ❌ T-11.2: Create CustomerLayout component
- ❌ T-11.3: Create LabLayout component
- ❌ T-11.4: Create AdminLayout component
- ❌ T-11.5: Apply layouts to route groups

**Files to Create:**
- `apps/frontend/middleware.ts`
- `apps/frontend/components/layouts/CustomerLayout.tsx`
- `apps/frontend/components/layouts/LabLayout.tsx`
- `apps/frontend/components/layouts/AdminLayout.tsx`

---

## PHASE 12: Customer Portal ❌

**Status:** Not Started (0%)
**Tasks:** T-12.1 through T-12.17

### Pages & Components:
- ❌ Dashboard with statistics
- ❌ Requests list with table
- ❌ Create/edit request forms
- ❌ Sample management
- ❌ Invoice page
- ❌ Profile page

### React Query Hooks:
- ❌ useRequests()
- ❌ useCreateRequest()
- ❌ useUpdateRequest()
- ❌ useDeleteRequest()
- ❌ useSubmitRequest()
- ❌ useUploadPaymentSlip()
- ❌ useUpdateProfile()

**Directory Structure:**
```
apps/frontend/app/(customer)/
  ├── dashboard/page.tsx
  ├── requests/
  │   ├── page.tsx
  │   ├── new/page.tsx
  │   └── [id]/
  │       ├── page.tsx
  │       └── invoice/page.tsx
  └── profile/page.tsx
```

---

## PHASE 13: Lab Internal Interface ❌

**Status:** Not Started (0%)
**Tasks:** T-13.1 through T-13.9

### Pages:
- ❌ Lab dashboard
- ❌ Lab requests list with filters
- ❌ Acknowledge sample page
- ❌ Result entry page

### Hooks:
- ❌ useLabRequests()
- ❌ useAcknowledgeRequest()
- ❌ useCreateLabResult()
- ❌ useSubmitForApproval()

**Directory Structure:**
```
apps/frontend/app/(lab)/lab/
  ├── dashboard/page.tsx
  └── requests/
      ├── page.tsx
      └── [id]/
          ├── acknowledge/page.tsx
          └── results/page.tsx
```

---

## PHASE 14: Doctor Approval Interface ❌

**Status:** Not Started (0%)
**Tasks:** T-14.1 through T-14.6

### Pages:
- ❌ Pending approvals list
- ❌ Review page with full details
- ❌ Approve/reject dialogs

### Hooks:
- ❌ usePendingApprovals()
- ❌ useApproveRequest()
- ❌ useRejectRequest()

**Directory Structure:**
```
apps/frontend/app/(lab)/doctor/
  ├── pending-approvals/page.tsx
  └── requests/[id]/page.tsx
```

---

## PHASE 15: Admin Interface ❌

**Status:** Not Started (0%)
**Tasks:** T-15.1 through T-15.13

### Pages:
- ❌ User management page
- ❌ Create/edit user dialogs
- ❌ Role management

### Hooks:
- ❌ useInternalUsers()
- ❌ useCreateInternalUser()
- ❌ useUpdateUser()
- ❌ useChangeUserRole()
- ❌ useDeleteUser()
- ❌ useMarkInvoicePaid()

**Directory Structure:**
```
apps/frontend/app/(admin)/admin/
  ├── dashboard/page.tsx
  └── users/page.tsx
```

---

## PHASE 16: Testing ⚠️

**Status:** Partial (backend unit tests exist)
**Tasks:** T-16.1 through T-16.12

### Backend Testing:
- ✅ T-16.1: Jest setup exists
- ✅ T-16.2: Unit tests for AuthService exist
- ✅ T-16.3: Unit tests for RequestService exist
- ✅ T-16.4: Unit tests for InvoiceService exist
- ⚠️ T-16.5-8: Integration tests with Supertest

### Frontend Testing:
- ❌ T-16.9: Vitest setup
- ❌ T-16.10: Component tests for forms
- ❌ T-16.11: Component tests for tables
- ❌ T-16.12: Hook tests

---

## PHASE 17: Deployment Preparation ⚠️

**Status:** Partial (Dockerfiles exist)
**Tasks:** T-17.1 through T-17.10

### Completed:
- ✅ T-17.1: Backend Dockerfile exists
- ✅ T-17.2: Frontend Dockerfile exists

### To Do:
- ⚠️ T-17.3: docker-compose.yml verification
- ⚠️ T-17.4: PostgreSQL container setup
- ⚠️ T-17.5: Environment variables
- ⚠️ T-17.6: Nginx configuration
- ⚠️ T-17.7: SSL/TLS setup
- ❌ T-17.8: Deployment scripts
- ❌ T-17.9: Database backup script
- ❌ T-17.10: Log rotation

---

## PHASE 18: Documentation & Polish ❌

**Status:** Not Started (0%)
**Tasks:** T-18.1 through T-18.15

### Documentation:
- ❌ README.md with setup instructions
- ❌ API documentation
- ❌ User guides (Customer, Lab Tech, Doctor, Admin)

### UI Polish:
- ❌ Loading states (Skeleton components)
- ❌ Error states with messages
- ❌ Toast notifications
- ❌ Form validation messages
- ❌ Confirmation dialogs
- ❌ Mobile responsiveness
- ❌ Accessibility audit (Lighthouse/axe)
- ❌ End-to-end manual testing

---

## Quick Task Reference

### 🔴 Critical Missing Tasks (Block Functionality)
1. **T-2.2**: Error handler middleware
2. **T-2.10**: Email service
3. **T-4.3**: Request number generator

### 🟠 High Priority (Foundation for Frontend)
1. **T-10.3**: Install Shadcn UI
2. **T-10.4**: Set up React Query
3. **T-10.5**: Create API client
4. **T-10.6**: Auth context
5. **T-11.1**: Protected routes middleware

### 🟡 Next Steps (After Foundation)
- Complete Phase 10: Auth pages
- Complete Phase 12: Customer portal
- Complete Phase 13: Lab interface

---

## Task Validation Checklist

When completing a task:
- [ ] Implementation matches specification
- [ ] Validation criteria met
- [ ] Tests written (if applicable)
- [ ] Code reviewed for errors
- [ ] Integration tested
- [ ] Mark as complete in Implementation-Status.md

---

**Last Updated**: 2025-10-23
**Version**: 1.0
**For Full Task Details**: See original Phase 3 planning session output
