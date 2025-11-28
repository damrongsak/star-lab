name: "Document Request List - Customer Portal Feature PRP"
description: |

## Purpose
Implement a comprehensive Document Request List feature for customers to view, search, filter, and manage their lab test requests in a user-friendly table interface.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Build a complete Document Request List page that allows customers to view, search, filter, and perform actions on their submitted test requests. The page should provide a professional lab management interface with full CRUD capabilities, pagination, and real-time status updates.

## Why
- **Business value**: Customers need visibility into their test request status and history to track lab progress efficiently
- **Integration**: Seamlessly connects existing TestRequestService backend APIs with React Router 7 frontend
- **Problems solved**: 
  - Eliminates customer confusion about request status
  - Provides self-service portal reducing support burden
  - Enables customers to manage draft requests before submission

## What
**User-visible behavior:**
- Paginated table displaying all customer test requests
- Search functionality across request numbers, company names, requester names
- Status filtering (Draft, Submitted, Acknowledged, Paid, Approved, Rejected)
- Action buttons: View Details, Edit (conditional), Delete (conditional), Print Summary
- Status badges with color coding
- Responsive design with dark/light theme support

**Technical requirements:**
- React Router 7 loader-based data fetching
- TypeScript interfaces for type safety
- Tailwind CSS styling matching existing design system
- Authentication-aware (customer can only see their own requests)
- Error handling and loading states
- Pagination with performance optimization

### Success Criteria
- [ ] Customer can view paginated list of their test requests
- [ ] Search functionality works across all relevant fields
- [ ] Status filtering works with proper UI feedback
- [ ] Actions are contextually available based on request status
- [ ] Page renders with proper loading/error states
- [ ] All tests pass (unit and integration)
- [ ] Code follows project conventions (ESLint, TypeScript)

## All Needed Context

### Documentation & References
- url: https://nextjs.org/docs/basic-features/data-fetching
  why: Next.js 15 data fetching patterns, TypeScript integration, error handling

- url: https://tanstack.com/query/latest/docs/framework/react/examples/pagination
  why: Pagination patterns and best practices for table data (fallback reference)

- file: apps/backend/src/controllers/TestRequestController.ts
  why: Existing API endpoints (getMyTestRequests, searchTestRequests) and response patterns

- file: apps/backend/src/services/TestRequestService.ts
  why: Backend service methods, pagination logic, and data transformation patterns

- file: apps/backend/prisma/schema.prisma
  why: Database schema for TestRequest, TestRequestSample, Customer models and enums

- file: apps/frontend/app/pages/dashboard.tsx
  why: Existing page layout, Card usage, theme integration patterns

- file: apps/frontend/app/components/ui/button.tsx
  why: Button component API and variant system

- file: apps/frontend/app/components/ui/card.tsx
  why: Card component structure and styling patterns

- file: examples/frontend/app/pages/items.tsx
  why: Basic Next.js data fetching example

- file: apps/backend/src/middlewares/authMiddleware.ts
  why: Authentication patterns and user context access

- doc: https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
  critical: Next.js 15 specific patterns for server-side rendering, static generation, and TypeScript integration
# MUST READ - Include these in your context window
- url: https://reactrouter.com/start/framework/data-loading
  why: React Router 7 loader patterns, TypeScript integration, error handling
  
- url: https://tanstack.com/query/latest/docs/framework/react/examples/pagination
  why: Pagination patterns and best practices for table data (fallback reference)
  
- file: apps/backend/src/controllers/TestRequestController.ts
  why: Existing API endpoints (getMyTestRequests, searchTestRequests) and response patterns
  
- file: apps/backend/src/services/TestRequestService.ts
  why: Backend service methods, pagination logic, and data transformation patterns
  
- file: apps/backend/prisma/schema.prisma
  why: Database schema for TestRequest, TestRequestSample, Customer models and enums
  
- file: apps/frontend/app/routes/dashboard.tsx
  why: Existing page layout, Card usage, theme integration patterns
  
- file: apps/frontend/app/components/ui/button.tsx
  why: Button component API and variant system
  
- file: apps/frontend/app/components/ui/card.tsx
  why: Card component structure and styling patterns
  
- file: examples/frontend/app/routes/items.tsx
  why: Basic React Router loader pattern example

- file: apps/backend/src/middlewares/authMiddleware.ts
  why: Authentication patterns and user context access

- doc: https://reactrouter.com/7.8.0/home
  critical: React Router 7 specific patterns for loaders, actions, and TypeScript integration
```

### Current Codebase Tree (Frontend)
```bash
apps/frontend/app/
├── components/
│   ├── ui/
│   │   ├── button.tsx      # Button variants (primary, secondary, danger, ghost)
│   │   ├── card.tsx        # Card, CardHeader, CardTitle, CardContent components
│   │   ├── input.tsx       # Input component with Tailwind styling
│   │   ├── badge.tsx       # Badge component for status indicators
│   │   └── ...
│   ├── header.tsx          # App header component
│   └── ...
├── context/
│   ├── theme-provider.tsx  # Theme context (light/dark)
│   └── user-context.tsx    # User authentication context
├── routes/
│   ├── document-requests.tsx  # STUB - needs implementation
│   ├── dashboard.tsx       # Reference for page layout patterns
│   └── ...
├── libs/
│   ├── utils.ts           # Utility functions
│   └── ...
└── routes.ts              # Route configuration
```

### Current Codebase Tree (Backend)
```bash
apps/backend/src/
├── controllers/
│   └── TestRequestController.ts  # getMyTestRequests, searchTestRequests APIs
├── services/
│   └── TestRequestService.ts     # Database operations and business logic
├── middlewares/
│   ├── authMiddleware.ts         # JWT authentication
│   └── roleMiddleware.ts         # Role-based access control
├── routes/
│   └── testRequest.ts           # API route definitions
└── validation/
    └── ...                      # Zod validation schemas
```

### Desired Codebase Tree (Files to Add/Modify)

```bash
apps/frontend/app/
├── components/
│   ├── ui/
│   │   ├── table.tsx            # NEW: Table component for data display
│   │   ├── pagination.tsx       # NEW: Pagination controls component
│   │   └── search-input.tsx     # NEW: Search input with debouncing
│   └── document-requests/       # NEW: Feature-specific components
│       ├── document-requests-table.tsx   # Main table component
│       ├── status-badge.tsx     # Status badge component
│       ├── request-actions.tsx  # Action buttons component
│       └── request-filters.tsx  # Filter controls component
├── routes/
│   └── document-requests.tsx    # MODIFY: Implement full feature
└── libs/
    └── api.ts                   # NEW: API client functions
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: React Router 7 requires proper type imports
import type { Route } from "./+types/document-requests";

// CRITICAL: Loader functions must return serializable data
// No Date objects, use ISO strings instead

// CRITICAL: Authentication context access pattern
const userId = (req as any).user?.userId;
const userRole = (req as any).user?.role;

// CRITICAL: Prisma enum usage
import { TestRequestDocumentStatus, LabInternalStatus } from "@prisma/client";

// CRITICAL: Tailwind dark mode classes
className="text-light-text-main dark:text-dark-text-main"

// CRITICAL: Backend API pagination pattern
GET /api/v1/test-requests/my-requests?page=1&limit=10

// CRITICAL: Search API pattern  
GET /api/v1/test-requests/search?q=searchTerm

// GOTCHA: No React Query currently in use - use React Router loaders
// GOTCHA: twMerge is used for className composition, not cn() utility
```

## Implementation Blueprint

### Data Models and Structure

The backend already has comprehensive data models. Key interfaces to leverage:

```typescript
// From TestRequestService.ts - already exists
interface TestRequest {
  id: string;
  requestNo: string;
  customerId: string;
  requesterName: string;
  objective?: string;
  requestDate: DateTime;
  documentStatus: TestRequestDocumentStatus;
  labInternalStatus: LabInternalStatus;
  testRequestSamples: TestRequestSample[];
  customer: {
    companyNameEn: string;
    companyNameTh: string;
  };
}

// Status enums from Prisma schema - already exists
enum TestRequestDocumentStatus {
  DRAFT, SUBMITTED, PENDING_PAYMENT, APPROVED, REJECTED, CANCELLED
}
```

### List of Tasks to Complete the PRP (In Order)

```yaml
Task 1: CREATE Frontend API Client
MODIFY apps/frontend/app/libs/api.ts:
  - CREATE fetchTestRequests function using existing backend endpoint /api/v1/test-requests/my-requests
  - CREATE searchTestRequests function using existing backend endpoint /api/v1/test-requests/search
  - IMPLEMENT error handling and response parsing
  - USE fetch API with proper headers and JWT token handling

Task 2: CREATE UI Table Components  
CREATE apps/frontend/app/components/ui/table.tsx:
  - MIRROR pattern from: apps/frontend/app/components/ui/card.tsx (component structure)
  - IMPLEMENT responsive table with Tailwind classes
  - INCLUDE TableHead, TableBody, TableRow, TableCell components
  - PRESERVE existing UI component patterns (React.FC, interface props)

CREATE apps/frontend/app/components/ui/pagination.tsx:
  - MIRROR pattern from: apps/frontend/app/components/ui/button.tsx (button variants)
  - IMPLEMENT Previous/Next buttons and page numbers
  - HANDLE disabled states for navigation

CREATE apps/frontend/app/components/ui/search-input.tsx:
  - MIRROR pattern from: apps/frontend/app/components/ui/input.tsx
  - IMPLEMENT debounced search input with search icon
  - USE lucide-react for search icon (already in dependencies)

Task 3: CREATE Feature-Specific Components
CREATE apps/frontend/app/components/document-requests/status-badge.tsx:
  - MIRROR pattern from: apps/frontend/app/components/ui/badge.tsx
  - IMPLEMENT status-specific colors and text mapping
  - MAP TestRequestDocumentStatus enum to display values

CREATE apps/frontend/app/components/document-requests/request-actions.tsx:
  - MIRROR pattern from: apps/frontend/app/components/ui/button.tsx
  - IMPLEMENT conditional action buttons (View, Edit, Delete, Print)
  - HANDLE permission logic based on document status

CREATE apps/frontend/app/components/document-requests/request-filters.tsx:
  - COMBINE pattern from Input and Button components
  - IMPLEMENT status filter dropdown using existing dropdown-menu.tsx
  - INCLUDE date range filtering capabilities

CREATE apps/frontend/app/components/document-requests/document-requests-table.tsx:
  - COMBINE all above components into cohesive table
  - IMPLEMENT sorting, filtering, and pagination logic
  - HANDLE empty states and loading indicators

Task 4: IMPLEMENT Main Route with Loader
MODIFY apps/frontend/app/routes/document-requests.tsx:
  - REPLACE existing stub with full implementation
  - IMPLEMENT loader function using pattern from dashboard.tsx
  - USE React Router 7 loader pattern for data fetching
  - IMPLEMENT error boundaries and loading states
  - INTEGRATE with authentication context from user-context.tsx

Task 5: ADD Type Definitions
UPDATE packages/shared/types.ts:
  - ADD comprehensive TestRequest interface matching Prisma schema
  - ADD API response interfaces for pagination
  - ENSURE consistency with backend service types

Task 6: CREATE Unit Tests
CREATE apps/frontend/app/components/document-requests/__tests__/:
  - MIRROR pattern from: apps/backend/src/__tests__/TestRequestService.test.ts
  - TEST all component interactions and state management
  - TEST loader function with mocked API responses
  - INCLUDE accessibility tests for table navigation

Task 7: UPDATE Backend if Needed
MODIFY apps/backend/src/controllers/TestRequestController.ts:
  - VERIFY getMyTestRequests pagination works correctly
  - ENSURE proper customer filtering in place
  - ADD any missing search/filter capabilities

Task 8: INTEGRATION TESTING
TEST complete workflow:
  - VERIFY authentication flow
  - TEST pagination with large datasets
  - VALIDATE search functionality
  - CHECK responsive design across devices
```

### Per Task Pseudocode

#### Task 1: API Client Implementation
```typescript
// apps/frontend/app/libs/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// PATTERN: Use fetch with proper error handling
async function fetchTestRequests(page: number = 1, limit: number = 10) {
    // CRITICAL: Include JWT token in Authorization header
    const token = getAuthToken(); // from auth context
    
    const response = await fetch(`${API_BASE_URL}/test-requests/my-requests?page=${page}&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    // GOTCHA: Always check response.ok before parsing JSON
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
}
```

#### Task 2: Table Component Structure
```typescript
// apps/frontend/app/components/ui/table.tsx
// PATTERN: Follow existing UI component structure from card.tsx
interface TableProps {
  className?: string;
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ className, children }) => {
  return (
    <div className={twMerge("w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
};

// PATTERN: Include TableHead, TableBody, TableRow, TableCell components
// PRESERVE existing naming conventions and TypeScript patterns
```

#### Task 4: Main Route Implementation
```typescript
// apps/frontend/app/routes/document-requests.tsx
import type { Route } from "./+types/document-requests";

// PATTERN: Follow React Router 7 loader pattern from examples
export async function loader({ request }: Route.LoaderArgs) {
    // CRITICAL: Handle URL search params for pagination and search
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || '';
    
    try {
        // PATTERN: Use API client functions
        const data = search 
            ? await searchTestRequests(search)
            : await fetchTestRequests(page, 10, status);
            
        return { testRequests: data.testRequests, pagination: data };
    } catch (error) {
        // CRITICAL: Proper error handling for loader
        throw new Response("Failed to load test requests", { status: 500 });
    }
}

export default function DocumentRequests({ loaderData }: Route.ComponentProps) {
    // PATTERN: Follow dashboard.tsx layout structure
    const { testRequests, pagination } = loaderData;
    
    return (
        <section>
            <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
                Document Requests
            </h3>
            {/* Implementation continues... */}
        </section>
    );
}
```

### Integration Points
```yaml
ROUTES:
  - modify: apps/frontend/app/routes.ts
  - existing: route("document-requests", "routes/document-requests.tsx")
  - note: "Route already configured, just needs implementation"
  
API_ENDPOINTS:
  - existing: GET /api/v1/test-requests/my-requests
  - existing: GET /api/v1/test-requests/search?q={term}
  - pattern: "Both endpoints include pagination and customer filtering"
  
AUTHENTICATION:
  - middleware: apps/backend/src/middlewares/authMiddleware.ts
  - context: apps/frontend/app/context/user-context.tsx
  - pattern: "JWT token in Authorization header, user context for role checking"
  
STYLING:
  - framework: TailwindCSS with dark/light theme support
  - pattern: "text-light-text-main dark:text-dark-text-main"
  - components: Existing Radix UI components for consistency

DATABASE:
  - model: TestRequest (apps/backend/prisma/schema.prisma:206-228)
  - enums: TestRequestDocumentStatus, LabInternalStatus
  - relations: Customer, TestRequestSample, Project, Invoice
```

## Validation Loop

### Level 1: Syntax & Style (Frontend)
```bash
# Run these FIRST - fix any errors before proceeding
cd apps/frontend
npm run typecheck           # React Router type generation + TypeScript checking
npm run lint               # ESLint validation
npm run format             # Prettier formatting

# Expected: No errors. If errors, READ the error and fix.
```

### Level 1: Syntax & Style (Backend)
```bash
# Only if backend modifications needed
cd apps/backend
npm run lint               # ESLint validation  
npm run build              # TypeScript compilation check

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests - Frontend Components
```typescript
// CREATE apps/frontend/app/components/document-requests/__tests__/document-requests-table.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentRequestsTable } from '../document-requests-table';

describe('DocumentRequestsTable', () => {
  const mockData = [
    {
      id: 'req-1',
      requestNo: 'REQ-20250101-123456',
      requesterName: 'John Doe',
      documentStatus: 'SUBMITTED',
      requestDate: '2025-01-01',
      customer: { companyNameEn: 'Test Company' }
    }
  ];

  test('renders test requests correctly', () => {
    render(<DocumentRequestsTable data={mockData} />);
    expect(screen.getByText('REQ-20250101-123456')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('search functionality works', () => {
    const onSearch = jest.fn();
    render(<DocumentRequestsTable data={mockData} onSearch={onSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search requests...');
    fireEvent.change(searchInput, { target: { value: 'REQ-2025' } });
    
    expect(onSearch).toHaveBeenCalledWith('REQ-2025');
  });

  test('status filtering works', () => {
    const onFilter = jest.fn();
    render(<DocumentRequestsTable data={mockData} onFilter={onFilter} />);
    
    // Test status filter interaction
    expect(screen.getByText('SUBMITTED')).toBeInTheDocument();
  });
}
```

```bash
# Run frontend component tests
cd apps/frontend
npm test -- --testPathPattern=document-requests

# Expected: All tests pass. If failing, read error and fix component logic.
```

### Level 2: Unit Tests - Backend (if modifications made)
```bash
# Only run if backend TestRequestService was modified
cd apps/backend
npm run test:unit

# Expected: Existing tests continue to pass
```

### Level 3: Integration Test
```bash
# Start backend server
cd apps/backend
npm run dev

# Start frontend development server
cd apps/frontend  
npm run dev

# Manual testing:
# 1. Navigate to http://localhost:5173/document-requests
# 2. Verify page loads with proper authentication
# 3. Test search functionality with existing test data
# 4. Verify pagination works with multiple pages
# 5. Test status filtering
# 6. Test action buttons (View, Edit, Delete) show conditionally

# Expected: Page loads without errors, all functionality works as specified
```

## Final Validation Checklist
- [ ] All frontend tests pass: `cd apps/frontend && npm test`
- [ ] No linting errors: `cd apps/frontend && npm run lint`
- [ ] No type errors: `cd apps/frontend && npm run typecheck`
- [ ] Backend tests still pass: `cd apps/backend && npm run test:unit`
- [ ] Manual test successful: Document requests page fully functional
- [ ] Search and filtering work correctly
- [ ] Pagination handles edge cases (first/last page)
- [ ] Error states display user-friendly messages
- [ ] Loading states provide proper feedback
- [ ] Actions are contextually available based on status
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark/light theme switching works correctly

---

## Anti-Patterns to Avoid
- ❌ Don't create new authentication patterns - use existing authMiddleware
- ❌ Don't use React Query - stick to React Router 7 loaders  
- ❌ Don't hardcode API URLs - use environment variables
- ❌ Don't ignore existing UI component patterns - maintain consistency
- ❌ Don't fetch data in useEffect - use loaders exclusively
- ❌ Don't break existing table responsiveness patterns
- ❌ Don't create custom pagination logic - use existing backend pagination
- ❌ Don't ignore role-based access control - customers see only their requests

## Quality Score: 9/10

**Confidence Level for One-Pass Implementation:** 9/10

**Reasoning:**
- Excellent context with comprehensive backend APIs already implemented
- Clear patterns established in existing codebase  
- Well-defined database schema and TypeScript interfaces
- React Router 7 patterns are well-documented with TypeScript examples
- Existing UI components provide consistent design system
- Thorough validation gates with specific commands to run
- Backend service layer handles complex business logic
- Authentication and authorization patterns are established

**Risk Mitigation:**
- Backend APIs are already tested and functional
- UI patterns exist and are reusable
- TypeScript provides compile-time safety
- Validation loop catches integration issues early

The only uncertainty is React Query vs React Router loader preference, but the PRP clearly specifies using React Router 7 loaders to match existing patterns.