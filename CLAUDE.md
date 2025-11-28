# CLAUDE Development Guide - STAR-LAB Project

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

## 🤝 Claude vs Codex - Division of Labor

This project uses **TWO AI assistants** working together in a strategic workflow:

### 👨‍🏫 **Claude (This Assistant) - The Architect & Planner**

**Primary Role**: Strategic planning, architecture review, code review, documentation, guidance

**Use Claude for:**

- ✅ **Reading SDD documentation** - Understanding project status and architecture
- ✅ **Analyzing gaps** - Identifying what needs to be built
- ✅ **Planning strategy** - Breaking down features into implementation steps
- ✅ **Providing specifications** - Clear requirements for Codex to implement
- ✅ **Reviewing code** - Quality checks and suggesting improvements
- ✅ **Architectural decisions** - Database schema, API design, system architecture
- ✅ **Answering questions** - Clarifying requirements and technical approach
- ✅ **Creating documentation** - Writing specs, updating SDD docs
- ✅ **Task coordination** - Managing the implementation plan

**⚠️ Claude does NOT write code directly** - Instead provides clear specifications for Codex to implement.

### 🤖 **Codex CLI - The Code Implementer**

**Primary Role**: Write code, create files, run commands, execute implementation tasks

**Use Codex for:**

- ✅ **Implementing features** - Based on Claude's specifications
- ✅ **Creating files** - Components, services, utilities, routes
- ✅ **Writing tests** - Unit tests, integration tests
- ✅ **Running commands** - npm, pnpm, prisma, docker, git
- ✅ **Refactoring code** - Following improvement suggestions
- ✅ **Fixing bugs** - Based on identified issues
- ✅ **Managing dependencies** - Installing packages, updating versions
- ✅ **Database operations** - Running migrations, seeding data
- ✅ **Building & deploying** - Docker builds, deployments

**⚠️ Codex does NOT plan architecture** - Follows specifications from Claude.

---

## 🛠️ Using codex-exec.sh

### Command Syntax

```bash
./codex-exec.sh [reasoning_level] "Your task description"
```

**Reasoning Levels**: `low`, `medium`, `high`

### Reasoning Level Guide

#### **Low** - Fast execution (simple, straightforward tasks)

**When to use:**

- File operations (list, copy, move)
- Running simple commands
- Creating basic directory structures
- Installing packages
- Viewing logs or status

**Examples:**

```bash
./codex-exec.sh low "List all TypeScript files in src/services/"
./codex-exec.sh low "Create directory structure for app/(customer)/requests/"
./codex-exec.sh low "Install axios and @types/axios"
./codex-exec.sh low "Check git status and show recent commits"
./codex-exec.sh low "Run pnpm --filter starlab-backend test"
```

#### **Medium** - Standard implementation (typical features)

**When to use:**

- Creating API endpoints
- Building React components
- Writing standard tests
- Implementing services with clear specifications
- Standard CRUD operations

**Examples:**

```bash
./codex-exec.sh medium "Create REST API endpoint GET /api/v1/customers/profile
with authentication middleware and return customer data from database"

./codex-exec.sh medium "Create React component LoginForm.tsx using React Hook Form,
Zod validation, and Shadcn UI Input/Button components"

./codex-exec.sh medium "Write unit tests for CustomerService.getProfile() method
including success case, not found case, and error case"

./codex-exec.sh medium "Implement PUT /api/v1/test-requests/:id endpoint
with RBAC middleware (CUSTOMER role only) and Zod validation"
```

#### **High** - Complex implementation (requires deep reasoning)

**When to use:**

- Complex algorithms or business logic
- Database schema changes and migrations
- Architectural refactoring
- Security-critical implementations
- Complex state management
- Performance optimizations

**Examples:**

```bash
./codex-exec.sh high "Implement Request Number Generator in apps/backend/src/utils/requestNoGenerator.ts
Requirements:
- Format: {companyCode}-{YYYYMMDD}-{sequence}
- Use Prisma to track sequences per company per day
- Ensure atomicity with database transactions
- Handle race conditions with proper locking
- Include comprehensive JSDoc comments
- Add error handling for all edge cases
- Follow existing code style in utils/"

./codex-exec.sh high "Implement centralized error handling middleware in apps/backend/src/utils/errorHandler.ts
- Create AppError class with statusCode and message
- Handle different error types (Prisma, JWT, Zod, custom)
- Return consistent JSON error responses
- Log errors with Winston
- Include stack traces in development only
- Integrate with existing server.ts"

./codex-exec.sh high "Create EmailService in apps/backend/src/services/EmailService.ts
- Use Nodemailer with SMTP configuration from .env
- Implement sendVerificationEmail(email, token)
- Implement sendApprovalNotification(customerId, requestId)
- Implement sendRejectionNotification(customerId, requestId, reason)
- Handle email template rendering
- Add retry logic for failed sends
- Include comprehensive error handling"
```

---

## 🔄 Recommended Workflow: Claude + Codex

### **The Strategic Process**

```
1. PLAN with Claude → 2. IMPLEMENT with Codex → 3. REVIEW with Claude → 4. REFINE with Codex
```

### **Step-by-Step Workflow**

#### **Step 1: Start with Claude (Planning)**

Ask Claude:

- "What should I implement next?"
- "What are the critical gaps?"
- "How should [feature] be implemented?"

Claude will:

- Reference Implementation-Status.md
- Identify priority tasks
- Provide architectural guidance
- Give detailed specifications

#### **Step 2: Implement with Codex (Coding)**

Take Claude's specification and execute:

```bash
./codex-exec.sh [reasoning_level] "Detailed task description with all requirements from Claude"
```

Codex will:

- Write the code
- Create necessary files
- Follow specifications
- Run tests if requested

#### **Step 3: Review with Claude (Quality Check)**

Ask Claude:

- "Review the [feature] implementation"
- "Are there any issues or improvements?"
- "Does this follow best practices?"

Claude will:

- Review the code
- Suggest improvements
- Identify potential issues
- Verify it matches specifications

#### **Step 4: Refine with Codex (Improvements)**

Apply Claude's feedback:

```bash
./codex-exec.sh medium "Apply the following improvements to [file]:
- [Improvement 1 from Claude]
- [Improvement 2 from Claude]
- [Improvement 3 from Claude]"
```

---

## 📋 Complete Example Workflows

### **Example 1: Implementing Request Number Generator (Critical Gap)**

```bash
# 1. Ask Claude
You: "I want to implement the Request Number Generator. How should I approach this?"

Claude: "The Request Number Generator is a critical gap (T-4.3). Here's the specification:
- Format: {companyCode}-{YYYYMMDD}-{sequence}
- Must be atomic and handle concurrent requests
- Store sequences in database per company per day
- Use Prisma transactions for safety
[... detailed specification ...]"

# 2. Implement with Codex
./codex-exec.sh high "Implement Request Number Generator in apps/backend/src/utils/requestNoGenerator.ts

Requirements from Claude:
- Format: ABC-20251023-001 (companyCode-YYYYMMDD-sequence)
- Create function: generateRequestNumber(companyCode: string): Promise<string>
- Use Prisma to query/update a RequestSequence table
- Atomic operation using Prisma transaction
- Handle race conditions with database-level locking
- Sequence resets daily per company
- Include JSDoc documentation
- Export as default function
- Add error handling with proper error messages

Database schema needed (if not exists):
model RequestSequence {
  id          String   @id @default(uuid())
  companyCode String
  date        String   // YYYYMMDD format
  sequence    Int      @default(1)
  @@unique([companyCode, date])
}

Follow TypeScript best practices and existing code style in utils/"

# 3. Review with Claude
You: "Please review the Request Number Generator implementation"

Claude: "The implementation looks good. A few suggestions:
1. Add error handling for when companyCode is invalid
2. Consider adding a maximum sequence limit (e.g., 9999)
3. Add unit tests
[... detailed review ...]"

# 4. Refine with Codex
./codex-exec.sh medium "Update apps/backend/src/utils/requestNoGenerator.ts with improvements:
1. Add validation for companyCode (must be 2-10 alphanumeric characters)
2. Add maximum sequence limit of 9999 with error when exceeded
3. Add more detailed error messages
4. Improve JSDoc comments"

./codex-exec.sh medium "Create unit tests in apps/backend/src/utils/__tests__/requestNoGenerator.test.ts
Test cases:
- Generates correct format
- Increments sequence correctly
- Resets sequence on new day
- Handles concurrent requests safely
- Throws error for invalid company code
- Throws error when sequence limit exceeded"

# 5. Verify with Claude
You: "The Request Number Generator is complete with tests. Please verify."

Claude: "✅ Excellent! The implementation is complete.
Now update Implementation-Status.md to mark T-4.3 as complete."
```

### **Example 2: Setting Up Frontend Foundation**

```bash
# 1. Ask Claude
You: "I want to start the frontend. What's the first step?"

Claude: "Start with Phase 2: Frontend Foundation. First task is installing Shadcn UI.
Then set up React Query, API client, and Auth Context.
Here's the order:
1. Install Shadcn UI (T-10.3)
2. Configure React Query (T-10.4)
3. Create API client (T-10.5)
4. Create Auth Context (T-10.6)
[... detailed guidance ...]"

# 2. Install Shadcn UI with Codex
./codex-exec.sh low "Install Shadcn UI in apps/frontend
Steps:
1. cd apps/frontend
2. Run: npx shadcn-ui@latest init
3. Choose options: TypeScript, Tailwind CSS, src directory
4. Install commonly needed components: button, input, form, card, dialog, table"

# 3. Set up React Query with Codex
./codex-exec.sh medium "Set up React Query in apps/frontend

Create file: apps/frontend/lib/providers/QueryProvider.tsx
- Import QueryClient, QueryClientProvider from @tanstack/react-query
- Configure QueryClient with defaults (staleTime: 5 minutes, retry: 1)
- Export QueryProvider component that wraps children
- Add React Query Devtools for development

Then update apps/frontend/app/layout.tsx:
- Import QueryProvider
- Wrap children with QueryProvider"

# 4. Create API Client with Codex
./codex-exec.sh medium "Create API client in apps/frontend/lib/api/client.ts

Requirements:
- Use axios
- Base URL from environment variable (NEXT_PUBLIC_API_URL) or default to http://localhost:5001/api/v1
- Add request interceptor to include Authorization header with JWT token from localStorage
- Add response interceptor to handle 401 errors (logout user)
- Export configured axios instance as 'apiClient'
- Add TypeScript types for common responses"

# 5. Review with Claude
You: "Frontend foundation is set up. Please review."

Claude: "Good start! A few things to add:
1. Add error handling to the API client interceptor
2. Consider using HttpOnly cookies instead of localStorage for JWT
3. Add loading states
[... suggestions ...]"

# 6. Apply improvements with Codex
./codex-exec.sh medium "Update apps/frontend/lib/api/client.ts:
- Add try-catch error handling in response interceptor
- Add comment about HttpOnly cookies as future enhancement
- Add request cancellation support
- Improve TypeScript types"
```

### **Example 3: Building Customer Portal - Request List Page**

```bash
# 1. Ask Claude
You: "How should I implement the Customer Request List page?"

Claude: "This is Phase 12, Task T-12.4. Here's the breakdown:
1. Create the page component
2. Create React Query hook for fetching requests
3. Create RequestsTable component using Shadcn UI
4. Add search and filter functionality
5. Implement status badges
[... detailed specification ...]"

# 2. Create React Query hook with Codex
./codex-exec.sh medium "Create React Query hook in apps/frontend/lib/api/requests.ts

Export function: useRequests(filters?: RequestFilters)
- Use useQuery from @tanstack/react-query
- Query key: ['requests', filters]
- Fetch from GET /test-requests/my-requests with apiClient
- Pass filters as query parameters
- Return: data, isLoading, error, refetch
- TypeScript types from @star-lab/shared"

# 3. Create RequestsTable component with Codex
./codex-exec.sh medium "Create RequestsTable component in apps/frontend/components/tables/RequestsTable.tsx

Requirements:
- Use Shadcn UI Table components
- Props: requests[] (array of TestRequest)
- Columns: Request No, Date, Company, Requester, Status, Actions
- Status column uses Badge component with color coding:
  - DRAFT: gray
  - SUBMITTED: blue
  - APPROVED: green
  - REJECTED: red
- Actions column: View, Edit (if DRAFT), Delete (if DRAFT) buttons
- Responsive design with Tailwind CSS
- TypeScript interface for props"

# 4. Create page with Codex
./codex-exec.sh medium "Create page in apps/frontend/app/(customer)/requests/page.tsx

Requirements:
- Use useRequests hook
- Show loading state with Skeleton from Shadcn UI
- Show error state with error message
- Add search input (debounced) and status filter dropdown
- Render RequestsTable with data
- Add 'New Request' button (links to /requests/new)
- Implement URL-based filtering (query params)
- Use Next.js App Router conventions
- Protected route (requires CUSTOMER role)"

# 5. Review and test with Claude
You: "Request list page is complete. Please review."

Claude: "Looks good! Test it by:
1. Running the frontend dev server
2. Logging in as a customer
3. Verifying the table displays correctly
4. Testing search and filters
Let me know if you encounter any issues."
```

---

## 🎯 Task-Specific Examples

### **Critical Gap 1: Request Number Generator**

```bash
./codex-exec.sh high "Implement Request Number Generator in apps/backend/src/utils/requestNoGenerator.ts

Requirements:
- Format: {companyCode}-{YYYYMMDD}-{sequence} (e.g., ABC-20251023-001)
- Export function: generateRequestNumber(companyCode: string): Promise<string>
- Use Prisma to track sequences per company per day
- Atomic operation using Prisma transaction with proper locking
- Sequence resets daily per company (starts at 001 each day)
- Include comprehensive JSDoc documentation
- Add error handling for all edge cases
- Validate companyCode (2-10 alphanumeric characters)
- Maximum sequence limit: 9999
- Follow existing TypeScript style in utils/
- Import prisma from '../utils/db'

If RequestSequence table doesn't exist in Prisma schema, add it:
model RequestSequence {
  id          String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid
  companyCode String   @map(\"company_code\") @db.VarChar(50)
  date        String   @db.VarChar(8)
  sequence    Int      @default(1)
  createdAt   DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)
  updatedAt   DateTime @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)

  @@unique([companyCode, date])
  @@map(\"request_sequences\")
}"
```

### **Critical Gap 2: Error Handler Middleware**

```bash
./codex-exec.sh high "Implement centralized error handling in apps/backend/src/utils/errorHandler.ts

Create:
1. AppError class extending Error:
   - Properties: statusCode (number), message (string), isOperational (boolean)
   - Constructor that sets these properties
   - Export as named export

2. Error handler middleware function:
   - Signature: (err: any, req: Request, res: Response, next: NextFunction) => void
   - Handle different error types:
     * AppError: use statusCode and message
     * Prisma errors (PrismaClientKnownRequestError):
       - P2002 (unique constraint): 409 Conflict
       - P2025 (record not found): 404 Not Found
       - Others: 500 Internal Server Error
     * JWT errors (JsonWebTokenError, TokenExpiredError): 401 Unauthorized
     * Zod errors (ZodError): 400 Bad Request with validation details
     * Generic Error: 500 Internal Server Error
   - Response format: {success: false, message: string, error?: {code: string, details: any}}
   - Log errors with Winston logger (import from './logger')
   - Include stack trace only if NODE_ENV !== 'production'
   - Export as default export

3. Update apps/backend/src/server.ts:
   - Import errorHandler from './utils/errorHandler'
   - Add as LAST middleware (after all routes): app.use(errorHandler)

Follow existing TypeScript patterns in utils/"
```

### **Critical Gap 3: Email Service**

```bash
./codex-exec.sh high "Create EmailService in apps/backend/src/services/EmailService.ts

Requirements:
- Use Nodemailer for SMTP
- Read SMTP config from environment variables:
  * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
- Create EmailService class with methods:

  1. sendVerificationEmail(email: string, token: string): Promise<void>
     - Subject: 'Verify Your Email - STAR-LAB'
     - Body: HTML with verification link
     - Link format: {FRONTEND_URL}/verify-email?token={token}

  2. sendApprovalNotification(customerId: string, requestId: string): Promise<void>
     - Fetch customer email from database
     - Subject: 'Test Request Approved - STAR-LAB'
     - Body: HTML with request details and link to view results

  3. sendRejectionNotification(customerId: string, requestId: string, reason: string): Promise<void>
     - Fetch customer email from database
     - Subject: 'Test Request Rejected - STAR-LAB'
     - Body: HTML with rejection reason and support contact

- Use Prisma client from '../utils/db' for database queries
- Add proper error handling and logging (import logger from '../utils/logger')
- Include retry logic (max 3 attempts) for failed sends
- Create simple HTML email templates inline or in separate template functions
- Export EmailService class as default
- Add comprehensive JSDoc comments

Environment variables to add to .env.example:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=STAR-LAB <noreply@starlab.com>
FRONTEND_URL=http://localhost:3000"
```

### **Frontend: Install Shadcn UI Components**

```bash
./codex-exec.sh low "Install Shadcn UI components in apps/frontend

Steps:
1. cd apps/frontend
2. Run: npx shadcn-ui@latest init (if not already initialized)
3. Install these components:
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add form
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add table
   npx shadcn-ui@latest add badge
   npx shadcn-ui@latest add select
   npx shadcn-ui@latest add textarea
   npx shadcn-ui@latest add checkbox
   npx shadcn-ui@latest add label
   npx shadcn-ui@latest add toast
   npx shadcn-ui@latest add dropdown-menu
   npx shadcn-ui@latest add skeleton"
```

### **Frontend: Create Auth Context**

```bash
./codex-exec.sh medium "Create Auth Context in apps/frontend/lib/context/AuthContext.tsx

Requirements:
- Create AuthContext with interface:
  * user: User | null (from @star-lab/shared)
  * token: string | null
  * isAuthenticated: boolean
  * login: (email: string, password: string) => Promise<void>
  * logout: () => void
  * isLoading: boolean

- Implement AuthProvider component:
  * Use useState for user, token, isLoading
  * Use useEffect to load token from localStorage on mount
  * Decode JWT to get user info (use jwt-decode library)
  * login function: call /api/v1/auth/login, store token, set user
  * logout function: clear localStorage, reset state, redirect to /login
  * Provide context value to children

- Export useAuth hook:
  * Use useContext(AuthContext)
  * Throw error if used outside AuthProvider

- Add TypeScript interfaces for all props and state
- Handle errors with try-catch and proper error messages
- Use apiClient from '../api/client' for API calls"
```

---

## 📊 Logs and Debugging

### Log Files

- **`codex-execution.log`** - Timestamps and task descriptions
- **`codex-output.log`** - Full command output and results

### View Recent Executions

```bash
tail -20 codex-execution.log
```

### View Real-Time Output

```bash
tail -f codex-output.log
```

### Auto-Diagnosis

If a Codex task fails, it automatically runs:

```bash
codex exec "Analyze the last error and suggest fixes"
```

### Manual Diagnosis with Claude

If auto-diagnosis doesn't help:

1. **Copy the error** from `codex-output.log`
2. **Share with Claude**: "Codex encountered this error: [paste error]"
3. **Claude will analyze** and provide guidance
4. **Implement fix** with Codex using Claude's suggestions

---

## ✅ Best Practices

### DO

- ✅ **Always start with Claude** for planning and specifications
- ✅ **Use appropriate reasoning level** (low for simple, high for complex)
- ✅ **Provide detailed task descriptions** to Codex with all requirements
- ✅ **Review implementations with Claude** before moving to next task
- ✅ **Update Implementation-Status.md** after completing tasks
- ✅ **Test implementations** before marking complete
- ✅ **Read error logs** when things fail
- ✅ **Follow the 4-step workflow** (Plan → Implement → Review → Refine)

### DON'T

- ❌ **Don't skip Claude planning** and go straight to Codex
- ❌ **Don't use high reasoning for simple tasks** (wastes time and resources)
- ❌ **Don't give vague instructions** to Codex (be specific with requirements)
- ❌ **Don't forget to review** code with Claude after implementation
- ❌ **Don't implement without specifications** (leads to rework)
- ❌ **Don't forget to run tests** after implementation
- ❌ **Don't ignore errors** - analyze and fix them
- ❌ **Don't skip documentation updates**

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

**Overall Completion**: ~35-40%

- **Backend**: ~70-75% complete (API routes, services, controllers exist)
- **Frontend**: ~5-10% complete (setup only, all UI to be built)
- **Database**: 100% schema complete (Prisma)

### 🔴 Critical Gaps (Block Full Functionality)

These files exist but are EMPTY or MISSING:

1. **`apps/backend/src/utils/requestNoGenerator.ts`** ❌ EMPTY
   - Must generate format: `{companyCode}-{YYYYMMDD}-{sequence}`

2. **`apps/backend/src/utils/errorHandler.ts`** ❌ EMPTY
   - Must implement centralized error handling middleware

3. **`apps/backend/src/services/EmailService.ts`** ❌ MISSING
   - Must implement email verification and notification service

**Priority**: Address these BEFORE frontend development to ensure backend functionality is complete.

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

## 🧪 Testing & Reliability

### Backend Testing

- **Unit tests**: For services and utilities (Jest)
  - Located in `apps/backend/src/__tests__/`
  - Test files exist for: CustomerService, TestRequestService, LabService, DoctorService, InvoiceService, UserService, FileService
- **Integration tests**: API endpoints with Supertest
  - Test authentication and RBAC
- **Run tests**: `pnpm --filter starlab-backend test`

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

**For detailed implementation guidance, always refer to [docs/SDD/](docs/SDD/) directory.**
