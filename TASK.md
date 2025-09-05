# TASK.md

## 📅 Active Sprint (Sept 2025)

---

### 1. User Management & Authentication

#### Frontend (`apps/frontend`)

* [ ] `routes/auth/Register.tsx`

  * Form: company name, ID/tax ID, addresses
  * File upload for license/tax docs
  * React Hook Form + Zod validation
* [ ] `routes/auth/Login.tsx`

  * Login form with JWT handling
* [ ] `routes/admin/Users.tsx`

  * Table + CRUD UI for internal users
  * Role selector (Admin, Technician, Doctor, Approval)
* [ ] `context/AuthContext.tsx`

  * Persist session, redirect by role
* [ ] Protected routes in `router.tsx`

#### Backend (`apps/backend`)

* [ ] `routes/auth/register.ts`

  * Input validation (Zod), multer for docs, store in GCS
* [ ] `routes/auth/login.ts`

  * JWT issuance, bcrypt password check
* [ ] `routes/admin/users.ts`

  * CRUD endpoints for internal users
* [ ] Middleware

  * `authMiddleware.ts`: verify JWT
  * `rbacMiddleware.ts`: check role

---

### 2. Customer Portal

#### Frontend

* [ ] `routes/customer/Requests.tsx`

  * List + search requests (React Query)
  * Columns: date, request no., status
  * Actions: view/edit/delete
* [ ] `routes/customer/RequestForm.tsx`

  * Dynamic sample list (add/edit/delete rows)
  * Auto-gen request number
  * Save Draft / Submit
* [ ] `routes/customer/Invoice.tsx`

  * Display invoice details
  * Upload payment slip

#### Backend

* [ ] `routes/customer/requests.ts`

  * CRUD for test requests
  * Auto-generate request number
* [ ] `routes/customer/invoices.ts`

  * Generate invoice, calculate totals
  * Upload + link payment slip

---

### 3. Lab Internal Operations

#### Frontend

* [ ] `routes/admin/Dashboard.tsx`

  * Search/filter requests
  * Status display & actions
* [ ] `routes/tech/ReceiveSample.tsx`

  * Adjust received qty
  * Confirm acknowledgement
* [ ] `routes/tech/LabResultEntry.tsx`

  * Enter test results
  * Upload result attachments
  * Submit for doctor approval

#### Backend

* [ ] `routes/lab/requests.ts`

  * Search/filter requests
  * Update statuses (acknowledge, mark paid)
* [ ] `routes/lab/samples.ts`

  * Adjust received quantities
* [ ] `routes/lab/results.ts`

  * Store results
  * Handle file uploads (PDF/CSV/image)
  * Queue parsing job (BullMQ stub)

---

### 4. Doctor Approval Workflow

#### Frontend

* [ ] `routes/doctor/Approvals.tsx`

  * List pending documents
  * Review results & attachments
  * Approve → notify customer
  * Reject → capture reason

#### Backend

* [ ] `routes/lab/approvals.ts`

  * Fetch pending approvals
  * Approve/Reject endpoints
  * Trigger notification & invoice release

---

## 🔄 Discovered During Work

* [ ] Add `packages/shared/types.ts` with shared interfaces (`User`, `Request`, `Sample`, `Invoice`, `Result`)
* [ ] Unit + integration tests:

  * **Frontend**: Jest + RTL (components, routes, forms, protected routes)
  * **Backend**: Supertest (auth, RBAC, CRUD endpoints)
* [ ] Configure Google Cloud Storage adapter
* [ ] BullMQ worker in `apps/backend/workers/parser.ts`

---

## ✅ Completed

*(Mark items here after merge)*

---
