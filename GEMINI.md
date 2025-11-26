# Gemini Development Guide - STAR-LAB Project

## 🚀 **START HERE - Every New Session**

**⚠️ CRITICAL**: Before doing ANYTHING, read this file first:

### 📄 **[docs/SDD/05-Implementation-Status.md](docs/SDD/05-Implementation-Status.md)**

This file contains:

- ✅ What's completed (Backend ~70%, Frontend ~5%)
- ❌ What's missing
- 🔴 **Critical gaps** that block functionality
- 🎯 **Immediate next steps** (3 clear options to choose from)
- 📊 Current project status (~35-40% complete)

**Read this FIRST to understand where the project is and what to work on next.**

---

## 🤝 Working with Gemini

This project is developed in collaboration with Gemini, a unified AI assistant that handles both high-level planning and hands-on implementation. The dual-assistant model mentioned in previous guides has been deprecated.

### 🤖 **Gemini - Your Development Partner**

**Primary Role**: A full-stack software engineering assistant responsible for architecture, planning, implementation, and review.

**Use Gemini for:**

- ✅ **Understanding the Goal**: Take high-level requirements and formulate a plan.
- ✅ **Reading Documentation**: Analyze project documents (like the SDD) to understand status and architecture.
- ✅ **Planning and Strategy**: Break down features into concrete implementation steps.
- ✅ **Writing Code**: Implement features, create files, write tests, and refactor code using its integrated tools.
- ✅ **Running Commands**: Execute shell commands for tasks like installing dependencies (`pnpm`), running tests, managing the database (`prisma`), and using version control (`git`).
- ✅ **Architectural Decisions**: Provide insights on database schema, API design, and system architecture.
- ✅ **Reviewing Code**: Perform quality checks and suggest improvements.
- ✅ **Debugging and Fixing Issues**: Analyze errors and implement solutions.
- ✅ **Answering Questions**: Clarify requirements and explain technical approaches.

The workflow is a continuous conversation. You provide the strategic direction, and Gemini handles the end-to-end execution.

---


## 🔄 Recommended Workflow

### **The Strategic Process**

The core development process remains a collaborative loop:

```
1. PLAN (You & Gemini) → 2. IMPLEMENT (Gemini) → 3. REVIEW (You) → 4. REFINE (Gemini)
```

### **Step-by-Step Workflow**

#### **Step 1: Define the Goal (You)**

Start by telling Gemini what you want to accomplish. You can be high-level or specific.

**Examples:**
- "What is the most critical feature to implement next?"
- "Implement the Request Number Generator as specified in the docs."
- "The login form isn't submitting, can you fix it?"

#### **Step 2: Plan & Propose (Gemini)**

Gemini will analyze your request, reference key documents like `Implementation-Status.md`, and propose a detailed, step-by-step plan for your approval. Gemini may also ask clarifying questions to ensure the strategy is sound.

#### **Step 3: Execute the Plan (Gemini)**

Once you greenlight the plan, Gemini will get to work. It will use its tools to write code, create or modify files, run tests, and execute any other necessary commands. You will see the tool calls and their results in real-time.

#### **Step 4: Review & Refine (You & Gemini)**

After an implementation step is complete, Gemini will present the work for your review. You can check the created code or test the functionality. If you have any feedback or changes, simply describe them, and Gemini will perform the refinements. This cycle continues until the task is complete.


## 📋 Example Workflows

### **Example 1: Implementing a Critical Gap (Request Number Generator)**

**You:**
"I want to implement the Request Number Generator. What's the best way to start?"

**Gemini:**
"The Request Number Generator is a critical backend gap (T-4.3). Based on the project documentation, it must be an atomic operation that generates a unique, formatted request number.

Here's my plan:
1.  **Update the Database Schema**: I'll add the `RequestSequence` model to `prisma/schema.prisma` to track the daily sequences.
2.  **Implement the Generator Logic**: I'll create the function in `apps/backend/src/utils/requestNoGenerator.ts` using a Prisma transaction to ensure atomicity.
3.  **Write Unit Tests**: After you review the implementation, I'll add unit tests to ensure it's reliable.

I'll start with the database schema change."

*Gemini executes the following tool call:*
```typescript
// TOOL CODE
write_file('apps/backend/prisma/schema.prisma', '... (new schema content with RequestSequence model)');
```

**Gemini:**
"The schema is updated. Now, I will implement the generator function itself."

*Gemini executes the following tool call:*
```typescript
// TOOL CODE
write_file('apps/backend/src/utils/requestNoGenerator.ts', '... (TypeScript code for the generator)');
```

**Gemini:**
"The core logic for the `requestNoGenerator` has been created. Please review the file. Once you approve it, I will proceed with writing the unit tests."

**You:**
"The code looks solid. Go ahead and write the tests."

**Gemini:**
"Great. I will now create the corresponding test file."

*Gemini executes the following tool call:*
```typescript
// TOOL CODE
write_file('apps/backend/src/__tests__/utils/requestNoGenerator.test.ts', '... (Jest test code)');
```

**Gemini:**
"The unit tests have been added. This completes the implementation for the Request Number Generator. I will now update the `Implementation-Status.md` to reflect that task T-4.3 is complete."

### **Example 2: Setting Up The Frontend Foundation**

**You:**
"I want to start building the frontend. What are the first steps?"

**Gemini:**
"To begin the frontend, we need to establish the foundation as outlined in the implementation plan (Phase 10).

My plan is as follows:
1.  **Install Shadcn UI**: This is the primary component library for the project (T-10.3).
2.  **Set up React Query**: For managing server state (T-10.4).
3.  **Create an API Client**: An `axios` instance to communicate with the backend (T-10.5).
4.  **Create an Auth Context**: To manage user authentication state globally (T-10.6).

I will start by initializing Shadcn UI and adding the core components."

*Gemini executes the following tool call:*
```bash
// TOOL CODE
run_shell_command(
  'cd apps/frontend && npx shadcn-ui@latest init && npx shadcn-ui@latest add button input form card'
);
```

**Gemini:**
"Shadcn UI is installed. Next, I'll set up the React Query provider to wrap the application."

*Gemini executes tool calls to create `QueryProvider.tsx` and then modify `layout.tsx` to include it.*

**Gemini:**
"The frontend foundation is taking shape. The process will continue until all four steps are complete. We can then move on to building the UI pages."

### **Example 3: Building the Customer Request List Page**

**You:**
"How should I implement the Customer Request List page?"

**Gemini:**
"This corresponds to Phase 12, Task T-12.4 in the plan. To build this page, I will:

1.  **Create the Page Component**: Set up the main page file at `apps/frontend/app/(customer)/requests/page.tsx`.
2.  **Build the Data Table**: Create a reusable `RequestsTable.tsx` component using Shadcn UI's Table and Badge components.
3.  **Fetch Data**: Implement a React Query hook (`useRequests`) to fetch the user's requests from the backend API.
4.  **Add Interactivity**: Include functionality for searching and filtering the requests.

I'll begin by creating the React Query hook to fetch data."

*Gemini executes a tool call to create the `apps/frontend/lib/api/requests.ts` file with the `useRequests` hook.*

**Gemini:**
"The data-fetching hook is ready. Next, I will build the `RequestsTable` component to display the data."

*Gemini executes a tool call to create the `apps/frontend/components/tables/RequestsTable.tsx` file.*

**Gemini:**
"With the data fetching and table component in place, I will now create the main page component and integrate them."

*Gemini creates the page file, imports the necessary components and hooks, and wires everything together.*

**Gemini:**
"The Customer Request List page is now implemented. You can test it by running the frontend dev server and logging in as a customer. Let me know if you'd like to add sorting or pagination functionality."


## 🎯 Task-Specific Prompts

Here are examples of how you can phrase your requests to Gemini for common, complex tasks.

### **Critical Gap 1: Request Number Generator**

**Prompt Example:**
"Implement the Request Number Generator in `apps/backend/src/utils/requestNoGenerator.ts`.

**Requirements:**
- It needs to produce a format like `{companyCode}-{YYYYMMDD}-{sequence}` (e.g., ABC-20251023-001).
- The core function should be `generateRequestNumber(companyCode: string): Promise<string>`.
- Use a Prisma transaction to make the operation atomic and handle race conditions, tracking the sequence per company per day. The sequence should reset daily.
- Validate the `companyCode` (must be 2-10 alphanumeric characters) and enforce a maximum sequence limit of 9999.
- Include comprehensive JSDoc comments and follow the existing TypeScript style.
- If the `RequestSequence` table is not in the Prisma schema, please add it first."

### **Critical Gap 2: Error Handler Middleware**

**Prompt Example:**
"Implement the centralized error handling middleware in `apps/backend/src/utils/errorHandler.ts`.

**Implementation Details:**
1.  **Create an `AppError` class** that extends `Error` and includes `statusCode`, `message`, and `isOperational` properties.
2.  **Build the middleware function** to handle various error types, including `AppError`, Prisma errors (`P2002`, `P2025`), JWT errors, and Zod errors, returning consistent JSON responses.
3.  **Integrate the middleware** into `apps/backend/src/server.ts` as the final piece of middleware.
4.  Log all errors using the existing Winston logger, including stack traces only in non-production environments."

### **Critical Gap 3: Email Service**

**Prompt Example:**
"Create the `EmailService` in `apps/backend/src/services/EmailService.ts`.

**Requirements:**
- Use `Nodemailer` for sending emails via SMTP, with configuration loaded from environment variables.
- The service should be a class with methods like `sendVerificationEmail`, `sendApprovalNotification`, and `sendRejectionNotification`.
- It needs to fetch customer data from the database using Prisma to get recipient email addresses.
- Implement a retry logic for sending emails (e.g., up to 3 attempts).
- Use simple HTML templates for the email bodies.
- Ensure all operations have robust error handling and logging."

### **Frontend: Install Shadcn UI Components**

**Prompt Example:**
"Please install the following Shadcn UI components in the `apps/frontend` project: button, input, form, card, dialog, table, badge, select, textarea, checkbox, label, toast, dropdown-menu, and skeleton."

### **Frontend: Create Auth Context**

**Prompt Example:**
"Create the global authentication context in `apps/frontend/lib/context/AuthContext.tsx`.

**It should include:**
- An `AuthContext` that provides the user, token, `isAuthenticated` status, and `isLoading` state.
- An `AuthProvider` component that manages the state.
- On initial load, it should check `localStorage` for an existing token.
- A `login` function that calls the `/api/v1/auth/login` endpoint and stores the token.
- A `logout` function that clears the token and user state.
- A `useAuth` hook for easy consumption of the context."


## 📊 Debugging & Verification

The primary way to understand and debug the development process is by observing the conversation and my tool usage.

- **Review Tool Calls**: My requests to use tools (like `run_shell_command` or `write_file`) and their corresponding outputs are the "logs." If something goes wrong, the error messages will appear here.
- **Ask for Clarification**: If you don't understand why I'm taking a certain action, just ask. I can explain my reasoning, the plan I'm following, or the output of a previous command.
- **Manual Verification**: Always feel free to manually inspect the code that I've written or run commands (like `pnpm test` or `git status`) yourself to verify the state of the project.

---

## ✅ Best Practices

### DO

- ✅ **Start with a Clear Goal**: Clearly state what you want to achieve. The more context you provide, the better my plan will be.
- ✅ **Reference Project Docs**: Refer to the SDD and other documents. For example, "Implement task T-4.3 from `Implementation-Status.md`."
- ✅ **Review My Plans**: Before I start executing, review the plan I propose. It's easier to adjust the strategy before the code is written.
- ✅ **Provide Iterative Feedback**: Review the code and functionality after each major step. Provide clear, specific feedback for refinements.
- ✅ **Trust the Process**: Allow me to follow the established `Plan -> Implement -> Review -> Refine` loop for best results.
- ✅ **Update Status Documents**: Ensure `Implementation-Status.md` is updated after a feature is complete.

### DON'T

- ❌ **Don't give ambiguous instructions**: Vague requests can lead to unexpected results. Provide concrete requirements.
- ❌ **Don't forget to test**: While I will write tests, it's good practice to manually verify critical features.
- ❌ **Don't hesitate to course-correct**: If you see me going down the wrong path, interrupt and provide clarification.

---

## 📚 Additional SDD Documentation (Read as Needed)

After reading Implementation-Status.md, refer to these for detailed information:

1. **[docs/SDD/04-Implementation-Plan.md](docs/SDD/04-Implementation-Plan.md)** - Task breakdown (158 tasks in 18 phases)
   - Specific task instructions
   - Validation criteria
   - Phase-by-phase organization

2. **[docs/SDD/03-Technical-Architecture.md](docs/SDD/03-Technical-Architecture.md)** - System architecture
   - Database schema
   - API endpoints
   - Authentication/authorization flows

3. **[docs/SDD/01-PRD.md](docs/SDD/01-PRD.md)** - Product requirements (when clarifying requirements)
   - User journeys
   - Success criteria
   - Functional requirements

---

## 🎯 Current Project Status

**Overall Completion**: ~85%

- **Backend**: ~95% complete (Production Ready)
- **Frontend**: ~85% complete (Customer Portal & Doctor Interface are complete)
- **Database**: 100% schema complete (Prisma)

### 🔴 Critical Gaps (Block Full Functionality)

**Status**: ✅ **ALL RESOLVED**

All three critical backend gaps (Request Number Generator, Error Handler Middleware, and Email Service) have been implemented, tested, and verified as of 2025-10-24. The backend is considered production-ready.

---

## 🏗️ Project Architecture Overview

### Monorepo Structure

```
star-lab/
├── apps/
│   ├── backend/          # Express.js API (TypeScript)
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── frontend/         # Next.js 15 App (React 19)
│   │   └── app/
│   │       ├── layout.tsx (ROOT ENTRY POINT)
│   │       ├── page.tsx
│   │       ├── components/
│   │       └── lib/
│   └── helper-service/
├── packages/
│   └── shared/           # Shared types and schemas
│       ├── types.ts      # All TypeScript interfaces
│       └── index.ts
├── docs/
│   └── SDD/              # Spec-Driven Development docs
│       ├── 00-README.md
│       ├── 01-PRD.md
│       ├── 02-TechStack.md
│       ├── 03-Technical-Architecture.md
│       ├── 04-Implementation-Plan.md
│       └── 05-Implementation-Status.md
└── docker-compose.yml
```

### Key Files Reference

- **Backend Entry**: `apps/backend/src/server.ts`
- **Frontend Entry**: `apps/frontend/app/layout.tsx`
- **Database Schema**: `apps/backend/prisma/schema.prisma`
- **Shared Types**: `packages/shared/types.ts`
- **Workspace Config**: `pnpm-workspace.yaml`

---

## 🔄 Development Workflow

### For Backend Tasks

1. Check [Implementation-Status.md](docs/SDD/05-Implementation-Status.md) for what needs implementation
2. Review [Technical-Architecture.md](docs/SDD/03-Technical-Architecture.md) for API/service design
3. Implement feature in appropriate service/controller
4. Add/update tests in `__tests__/` directory
5. Update Implementation-Status.md when complete

### For Frontend Tasks

1. Install Shadcn UI first (if not done): `npx shadcn-ui@latest init`
2. Set up React Query provider
3. Create API client with axios
4. Build components using Shadcn UI + Tailwind CSS
5. Integrate with backend API using React Query hooks

### For Full-Stack Features

1. Complete backend API endpoint first
2. Test with Postman or curl
3. Then build frontend UI
4. Integrate and test end-to-end

---

## 🧱 Code Structure & Modularity

- **Max file size**: 500 lines of code
  - If approaching limit, refactor into modules or helper files
- **Module organization**: Group by feature or responsibility
  - Backend: `services/`, `controllers/`, `routes/`, `middleware/`, `utils/`
  - Frontend: `components/`, `lib/`, `hooks/`
- **Import style**: Prefer relative imports within packages
- **Avoid circular imports**: Structure dependencies carefully

---

## 📦 Using the Shared Package (`@star-lab/shared`)

### Overview

The `packages/shared` directory contains **shared types, interfaces, and validation schemas** used across both frontend and backend. This ensures type consistency and reduces duplication.

**Location**: `packages/shared/types.ts` (466 lines)

### What's in the Shared Package

1. **Zod Validation Schemas**
   - `customerRegistrationSchema` - Customer registration validation
   - `customerLoginSchema` - Login validation
   - `customerProfileUpdateSchema` - Profile update validation

2. **Enum Types** (matching Prisma schema)
   - `UserRole` - ADMIN, LAB_ADMIN, CUSTOMER, TECHNICIAN, DOCTOR, APPROVAL
   - `TestRequestDocumentStatus` - DRAFT, SUBMITTED, PENDING_PAYMENT, RESULT_READY, APPROVED, REJECTED, CANCELLED
   - `LabInternalStatus` - Workflow states for lab processing
   - `TestRequestSampleStatus` - Sample lifecycle states
   - `InvoicePaymentStatus` - Payment statuses
   - `LabResultStatus` - Lab result states

3. **TypeScript Interfaces** (Domain Models)
   - `User`, `Customer`, `Doctor`, `UserProfile`
   - `TestRequest`, `TestRequestSample`, `Project`
   - `Invoice`, `InvoiceLineItem`
   - `LabTest`, `LabResult`, `StorageLocation`
   - `DocumentAttachment`, `AuditTrail`

4. **API Types**
   - `PaginatedResponse<T>` - Standardized pagination
   - `AuthResponse` - Authentication responses
   - `ApiResponse<T>` - Generic API response wrapper
   - `ApiError`, `ValidationError` - Error types
   - Request/Response types for test requests, invoices, etc.

5. **Frontend-Specific Types**
   - `TestRequestTableItem` - Table display format
   - `TestRequestFilters` - Filter state
   - `StatusCount` - Status aggregations

### Usage Guidelines

#### ✅ **ALWAYS Use Shared Types For:**

1. **Enum Values** (instead of Prisma enums directly)
   ```typescript
   // ✅ CORRECT
   import { UserRole, TestRequestDocumentStatus } from "@star-lab/shared";
   
   // ❌ WRONG - Don't import from @prisma/client in controllers
   import { UserRole } from "@prisma/client";
   ```

2. **API Request/Response Types**
   ```typescript
   // ✅ CORRECT
   import { AuthResponse, PaginatedResponse } from "@star-lab/shared";
   
   const response: AuthResponse = {
     message: "Login successful",
     user: { id, email, role },
     token
   };
   ```

3. **Zod Validation Schemas**
   ```typescript
   // ✅ CORRECT
   import { customerLoginSchema } from "@star-lab/shared";
   
   const result = customerLoginSchema.safeParse(req.body);
   ```

4. **Domain Model Interfaces** (for function parameters/returns)
   ```typescript
   // ✅ CORRECT
   import { Customer, TestRequest } from "@star-lab/shared";
   
   async function getCustomerRequests(customerId: string): Promise<TestRequest[]> {
     // ...
   }
   ```

#### ⚠️ **When to Use Prisma Types Instead:**

- **Only in service layer** when directly interacting with database
- Use Prisma types for database operations, then map to shared types for API responses

```typescript
// Service layer - OK to use Prisma types
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// But return shared types from service methods
import { Customer } from "@star-lab/shared";

async function getCustomer(id: string): Promise<Customer> {
  const customer = await prisma.customer.findUnique({ where: { id } });
  return customer as Customer; // Map to shared type
}
```

### Current State Analysis

**Frontend**: ✅ **Excellent usage** - 19 imports across components, hooks, and pages  
**Backend**: ⚠️ **Underutilized** - Only 1 file (AuthController.ts) imports shared types

### Migration Strategy (Gradual)

**Phase 1: Fix Conflicts** (Priority)
- Remove duplicate `UserRole` imports (use `@star-lab/shared` instead of `@prisma/client`)

**Phase 2: New Code** (Enforce)
- All new controllers/services **must** use shared types
- All new API endpoints **must** use shared request/response types

**Phase 3: Gradual Refactor** (As you touch files)
- When modifying a controller, migrate it to use shared types
- When adding features, ensure consistency with shared package

### Example: Good Usage Pattern

```typescript
// apps/backend/src/controllers/TestRequestController.ts

// ✅ Import types from shared package
import {
  TestRequest,
  TestRequestDocumentStatus,
  CreateTestRequestData,
  PaginatedResponse
} from "@star-lab/shared";

import { Request, Response } from "express";
import { TestRequestService } from "../services/TestRequestService";

export class TestRequestController {
  async list(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10 } = req.query;
    
    const result: PaginatedResponse<TestRequest> = await service.list({
      page: Number(page),
      limit: Number(limit)
    });
    
    res.json(result);
  }
}
```

### Benefits of Using Shared Types

✅ **Type Safety**: Frontend and backend use identical types  
✅ **Single Source of Truth**: Changes propagate to both apps  
✅ **Reduced Duplication**: No need to redefine types in each app  
✅ **Better DX**: IDE autocomplete works across the monorepo  
✅ **Validation Consistency**: Same Zod schemas on both sides  

### Adding New Types

When adding new features:

1. **Define the type in `packages/shared/types.ts`**
2. **Export it** from the file
3. **Import it** in both frontend and backend as needed

```typescript
// packages/shared/types.ts

export interface NewFeature {
  id: string;
  name: string;
  status: NewFeatureStatus;
}

export type NewFeatureStatus = "ACTIVE" | "INACTIVE";

export const newFeatureSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"])
});
```

---

## 🧪 Testing & Reliability

### Backend Testing

- **Unit tests**: For services and utilities (Jest)
  - Located in `apps/backend/src/__tests__/`
  - Test files exist for: CustomerService, TestRequestService, LabService, DoctorService, InvoiceService, UserService, FileService
- **Integration tests**: API endpoints with Supertest
  - Test authentication and RBAC
- **Run tests**: `pnpm --filter starlab-backend test`
- **Run Invoice Workflow Test**:
  ```bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm use 22
  pnpm --filter starlab-backend test src/__tests__/InvoiceWorkflow.test.ts
  ```

### Frontend Testing (To Be Implemented)

- **Component tests**: React Testing Library
- **Hook tests**: For React Query hooks
- **E2E tests**: Playwright or Cypress (future)

### Test Requirements

- At least 1 test for expected behavior
- At least 1 edge case
- At least 1 failure case

---

## 📎 Style & Conventions

### TypeScript

- Primary language for both frontend and backend
- Use `interface` or `type` aliases for prop types
- Write JSDoc comments for components and functions:
  ```typescript
  /**
   * Brief summary of the component or function.
   *
   * @param {type} paramName - Description of the parameter.
   * @returns {type} Description of the return value.
   */
  ```

### Code Quality

- **ESLint**: Configured for TypeScript + React
- **Prettier**: Auto-formatting
- **Zod**: Data validation on both frontend and backend
- Run `pnpm lint` before committing

---

## ⚛️ Frontend Development Guidelines

### Framework & Tools

- **React 19+** with **Next.js 15** (App Router)
- **Styling**: Tailwind CSS for all styling
- **UI Components**: Shadcn UI / Radix UI (accessible, customizable)
- **Icons**: Lucide React or Font Awesome
- **Routing**: Next.js 15 built-in routing (file-based)
- **Protected Routes**: Next.js middleware (`middleware.ts`)

### State Management

- **Server State**: React Query (TanStack Query) for all data fetching/caching
- **Client State**: Context API or Zustand for global UI state

### Forms & Validation

- **React Hook Form**: Form management
- **Zod**: Validation schemas (shared with backend)
- Integration: `@hookform/resolvers`

### Component Structure

- Organize in `app/components/` grouped by feature
- File naming: `ComponentName.tsx`
- Functional components with TypeScript
- Use React's built-in types (`React.FC`, `React.ReactNode`)

### API Interaction

- **HTTP Client**: Axios with interceptors for auth tokens
- **Integration**: React Query hooks
- **Base URL**: Configure in `lib/api/client.ts`

### Accessibility

- Follow WCAG 2.1 Level AA guidelines
- Use `eslint-plugin-jsx-a11y`
- Test with Lighthouse/axe

---

## 🌐 Backend Development Guidelines

### Framework & Tools

- **Express.js** with TypeScript
- **Database**: PostgreSQL 15+ in Docker container
- **ORM**: Prisma (type-safe queries, migrations)
- **Authentication**: JWT with bcrypt (12 salt rounds)
- **Logging**: Winston (structured logging)

### Authentication & Authorization

- **JWT Implementation**:
  - File: `apps/backend/src/utils/jwt.ts`
  - Payload: `{userId, email, role, exp}`
  - Middleware: `apps/backend/src/middleware/authMiddleware.ts`
- **RBAC**:
  - Middleware: `apps/backend/src/middleware/rbacMiddleware.ts`
  - Roles: ADMIN, LAB_ADMIN, CUSTOMER, TECHNICIAN, DOCTOR, APPROVAL

### API Design

- **RESTful APIs**: Versioned at `/api/v1/...`
- **Endpoints**:
  - `/api/v1/auth` - Authentication
  - `/api/v1/customers` - Customer profile
  - `/api/v1/test-requests` - Test requests
  - `/api/v1/lab/*` - Lab operations
  - `/api/v1/doctors` - Doctor workflow
  - `/api/v1/invoices` - Invoicing
  - `/api/v1/admin/users` - User management

### Input Validation

- **Zod**: Validate all request bodies and query parameters
- **Shared schemas**: Define in `packages/shared/types.ts`

### Error Handling

- **Centralized middleware**: `apps/backend/src/utils/errorHandler.ts` ❌ NEEDS IMPLEMENTATION
- **Consistent responses**: 400, 401, 403, 404, 500 with JSON error format

### File Uploads

- **Multer**: Handle multipart/form-data
- **Storage**: Local filesystem with Docker volumes
  - `/uploads/registration-docs/`
  - `/uploads/lab-results/`
  - `/uploads/payment-slips/`
- **Service**: `apps/backend/src/services/FileService.ts`

### Modular Structure

```
apps/backend/src/
├── routes/         # Express routes
├── controllers/    # Request handlers
├── services/       # Business logic
├── middleware/     # Auth, RBAC, validation
├── utils/          # Helpers (jwt, password, logger)
└── __tests__/      # Unit and integration tests
```

### Critical Utilities to Implement

1. **Request Number Generator**: `apps/backend/src/utils/requestNoGenerator.ts`
   - Format: `{companyCode}-{YYYYMMDD}-{sequence}`
2. **Error Handler**: `apps/backend/src/utils/errorHandler.ts`
   - AppError class + centralized middleware
3. **Email Service**: `apps/backend/src/services/EmailService.ts`
   - Nodemailer for SMTP
   - Methods: sendVerificationEmail, sendApprovalNotification, sendRejectionNotification

---

## ⚙️ General Development Practices

### Monorepo with pnpm

- **Workspace**: pnpm workspaces for shared dependencies
- **Shared types**: `packages/shared/types.ts` for type consistency
- **Install**: `pnpm install` (at root)
- **Run backend**: `pnpm --filter starlab-backend dev`
- **Run frontend**: `pnpm --filter starlab-frontend dev`

### Node Version Management

- **Required Version**: Node.js 22
- **Usage**: Always run `nvm use 22` before executing any commands (npm, pnpm, node, etc.) to ensure compatibility.

### Version Control

- **Git**: Feature-branching workflow
- **PRs**: For code reviews
- **Current branch**: Check `git status` before starting

### Logging

- **Backend**: Winston with JSON format
  - Console + file output (`server.log`)
  - Log levels: error, warn, info, debug

### Deployment (Docker + Nginx + GCP Compute Engine)

- **Architecture**:
  - Nginx reverse proxy (port 80/443)
  - Frontend container (Next.js on port 3000)
  - Backend container (Express on port 5001)
  - PostgreSQL container (port 5432, internal)
- **Storage**: Local filesystem with Docker volumes
- **SSL**: Let's Encrypt via Nginx
- **Files**:
  - `docker-compose.yml`
  - `apps/backend/Dockerfile`
  - `apps/frontend/Dockerfile`
  - `nginx.conf` (to be created)

### Security Measures

- **Input Validation**: Zod on both frontend and backend
- **Password Hashing**: bcrypt (12 rounds)
- **SQL Injection**: Prevented by Prisma ORM
- **XSS Protection**: React auto-escaping, sanitize inputs
- **CORS**: Configured in Express, limit to frontend domain
- **HTTPS**: Required in production
- **Rate Limiting**: To be implemented for auth endpoints
- **JWT**: Short expiration, HttpOnly cookies recommended

---

## 📚 Documentation & Explainability

### Update Documentation When

- New features added
- Dependencies change
- Setup steps modified
- Architecture changes

### Comment Style

- **Non-obvious code**: Add explanatory comments
- **Complex logic**: Add inline `// Reason:` comments explaining why
- **Functions/components**: JSDoc comments

### README Updates

- Keep `README.md` current with setup instructions
- Include prerequisites and environment setup
- Document any special configuration

---

## 🧠 AI Behavior Rules

### Context & Assumptions

- **Never assume missing context** - Ask questions if uncertain
- **Read SDD docs first** - Always check Implementation-Status.md at session start
- **Verify file paths** - Confirm files exist before referencing
- **No hallucinations** - Only use verified TypeScript/JavaScript packages

### Code Modifications

- **Never delete existing code** unless explicitly instructed
- **Never overwrite working code** without backup/confirmation
- **Test before marking complete** - Ensure validation criteria met

### Task Management

- **Check Implementation-Plan.md** - Use as source of truth for tasks
- **Update Implementation-Status.md** - Mark completed tasks immediately
- **Add discovered tasks** - Document new sub-tasks found during work

---

## 📖 Essential Documentation Links

### Framework Documentation

- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React**: [https://react.dev](https://react.dev)
- **TypeScript**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Express.js**: [https://expressjs.com](https://expressjs.com)

### UI & Styling

- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Shadcn UI**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **Lucide Icons**: [https://lucide.dev](https://lucide.dev)

### Data & Forms

- **Prisma**: [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
- **Zod**: [https://zod.dev](https://zod.dev)
- **React Hook Form**: [https://react-hook-form.com](https://react-hook-form.com)
- **React Query**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)

### HTTP & Auth

- **Axios**: [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
- **JWT**: [https://jwt.io](https://jwt.io)

---

## 🎯 Development Priorities

### Phase 1: Critical Backend Gaps (Do First)

1. Implement Request Number Generator
2. Implement Error Handler Middleware
3. Implement Email Service
4. Verify file upload configuration

### Phase 2: Frontend Foundation

1. Install Shadcn UI
2. Configure React Query
3. Create API client
4. Set up Auth Context
5. Create protected route middleware

### Phase 3: Authentication Flow

1. Login & Registration pages
2. Email verification page
3. Form components with validation

### Phase 4+: Feature Implementation

- Customer Portal (4-5 days)
- Lab Internal Interface (3-4 days)
- Doctor Approval Interface (2 days)
- Admin Interface (2-3 days)

---

## 💡 Quick Command Reference

### Backend

```bash
# Start dev server
pnpm --filter starlab-backend dev

# Run tests
pnpm --filter starlab-backend test

# Prisma commands
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

### Frontend

```bash
# Start dev server
pnpm --filter starlab-frontend dev

# Install Shadcn UI
cd apps/frontend
npx shadcn-ui@latest init
npx shadcn-ui@latest add button

# Build Frontend (with Node 22)
nvm use 22 & pnpm --filter starlab-frontend build
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## ✅ Quality Checklist

Before marking a task complete:

- [ ] Code implements specified functionality
- [ ] Validation criteria met (from Implementation-Plan.md)
- [ ] Tests written and passing (if applicable)
- [ ] Code follows style guidelines (ESLint/Prettier)
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Documentation/comments added for complex logic
- [ ] File size under 500 lines
- [ ] Integration tested with related components
- [ ] Implementation-Status.md updated

---

**Last Updated**: 2025-10-23
**Project Version**: 1.0
**Overall Completion**: ~35-40%

**For detailed implementation guidance, always refer to [docs/SDD/](docs/SDD/) directory.