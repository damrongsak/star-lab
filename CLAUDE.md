# ROLES & GUIDELINES FOR USING CODEX CLI IN STAR-LAB MONOREPO

You are the orchestrator. Use Codex CLI via `codex exec` (or ./codex-exec.sh) to implement an end-to-end feature in a monorepo:

- Frontend: Next.js 15 in ./apps/frontend
- Backend: Express + TypeScript + Prisma + PostgreSQL in ./apps/backend
- API base: /api/v1
- Roles: ADMIN, TECHNICIAN, DOCTOR, APPROVAL. Auth middleware already exists.
- Goal: Add result upload (PDF/CSV/image) + results dashboard, with background parsing stub (BullMQ).
- Constraints: Minimal invasive changes, clean diffs, TypeScript safe, add tests.
- Use reasoning_level: 
  - low for scaffolding/formatting
  - medium for API & UI codegen
  - high for DB schema, background workers, tests
- Run work in project subdirs (no global side effects).
- For long tasks (install/build/test), run in background and report exit codes.
- Output clean commands, short status after each step.

### Basic Usage
```bash
# Direct execution with custom settings
codex exec -s danger-full-access -c model_reasoning_effort="low" "Your task here"

# Examples
codex exec -s danger-full-access -c model_reasoning_effort="high" "Refactor the API to use TypeScript interfaces"
codex exec -s danger-full-access -c model_reasoning_effort="low" "List all files in src/"
```

### Helper Script Usage
A helper script `codex-exec.sh` simplifies common operations:
```bash
# Usage: ./codex-exec.sh [reasoning_level] "task"
./codex-exec.sh low "Quick file listing"
./codex-exec.sh high "Complex refactoring task"
./codex-exec.sh "Default task" # defaults to low reasoning
```

### Background Execution with Monitoring
For long-running tasks, use background execution:
```bash
# In Claude, use run_in_background parameter:
# Bash tool with run_in_background: true
# Then monitor with BashOutput tool using the returned bash_id
```

### Parallel Execution
Multiple Codex instances can run simultaneously:
```bash
# Start multiple background tasks
codex exec -s danger-full-access "Task 1" &
codex exec -s danger-full-access "Task 2" &
wait # Wait for all to complete
```

### Key Advantages Over TMux Approach
1. **No timing issues** - No sleep/wait commands needed
2. **Clean output** - Direct JSON/text without UI elements  
3. **Exit codes** - Proper error handling with return codes
4. **Parallel execution** - Run multiple instances simultaneously
5. **Scriptable** - Easy integration with CI/CD pipelines

### Reasoning Levels
- `minimal` - Fastest, limited reasoning (~5-10s for simple tasks)
- `low` - Balanced speed with some reasoning (~10-15s)
- `medium` - Default, solid reasoning (~15-25s)
- `high` - Maximum reasoning depth (~30-60s+)

### Safety Considerations
- Using `danger-full-access` grants full system access
- Auto-approval with `--ask-for-approval never` bypasses confirmations
- Consider permission models for production use

### Common Patterns
```bash
# Add new API endpoint
codex exec -s danger-full-access -c model_reasoning_effort="high" \
  "Add a new REST endpoint /api/users that returns user data"

# Refactor code
codex exec -s danger-full-access -c model_reasoning_effort="high" \
  "Refactor the authentication module to use JWT tokens"

# Generate tests
codex exec -s danger-full-access -c model_reasoning_effort="medium" \
  "Write unit tests for the user service module"

# Quick fixes
codex exec -s danger-full-access -c model_reasoning_effort="low" \
  "Fix the typo in README.md"
```

## Key Files

-   `apps/backend/src/server.ts`: Backend application entry point.
-   `apps/frontend/app/root.tsx`: Frontend application entry point.
t-   `docker-compose.yml`: Defines the services for the project.
-   `pnpm-workspace.yaml`: Defines the workspace for the pnpm monorepo.

### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn’t listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Never suggest changes to the project structure or architecture** unless explicitly requested or if it significantly improves the project.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Avoid circular imports** by carefully structuring dependencies and using local imports where necessary.

### 🧪 Testing & Reliability
- **Always create unit tests for new features** (components, hooks, routes, etc.) using Jest and React Testing Library.
- **After updating any logic**, ensure existing tests are reviewed and updated if necessary.
- **Tests should live in a `/tests` folder** mirroring the main app structure.
    - Include at least:
        - 1 test for expected behavior
        - 1 edge case
        - 1 failure case
- **For routing-related features:**
    - Test route rendering using `MemoryRouter` from React Router.
    - Verify protected routes by mocking authentication and role-based access.
    - Test loader and action functions for proper data fetching and mutation handling.
- **For components:**
    - Test props, events, and conditional rendering.
    - Ensure accessibility using tools like `axe` or `eslint-plugin-jsx-a11y`.
- **For forms:**
    - Validate form submission and error handling using React Hook Form and Zod schemas.
    - Test dynamic fields and validation rules.
- **For API interactions:**
    - Mock API calls using libraries like `msw` (Mock Service Worker) to simulate backend responses.
    - Test React Query hooks for caching, refetching, and error states.
- **Run tests regularly** as part of the CI/CD pipeline to ensure reliability and prevent regressions.

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a “Discovered During Work” section.
### 📎 Style & Conventions
- **Use TypeScript** as the primary language for both frontend and backend development.
- **Follow ESLint** and **Prettier** for code quality and formatting. Ensure configurations support React with TypeScript.
- **Use `zod` for data validation** on both frontend and backend to maintain consistency.
- **React-Specific Conventions:**
    - Use functional components with TypeScript.
    - Define prop types using `interface` or `type` aliases.
    - Leverage React's built-in types (e.g., `React.FC`, `React.ReactNode`) for better type safety.
    - Use `React Hook Form` with `zod` for form handling and validation.
- **Write JSDoc comments for components and functions** using the following style:
    ```typescript
    /**
     * Brief summary of the component or function.
     *
     * @param {type} paramName - Description of the parameter.
     * @returns {type} Description of the return value.
     */
    ```
- **Component Structure:**
    - Organize components into a `components/` folder, grouped by feature or domain.
    - Use a consistent file naming convention (e.g., `ComponentName.tsx` for components and `ComponentName.module.css` for styles if applicable).
- **Styling:** Prefer Tailwind CSS for styling. Use utility classes directly in JSX or extract reusable styles into `className` constants.
- **State Management:** Use React Query for data fetching and caching. For global state, use Context API or Zustand.
- **Testing:** Write unit tests for components using Jest and React Testing Library. Include tests for props, events, and edge cases.
- **API Interaction:** Use `axios` or the native `fetch` API with React Query for API calls, ensuring proper typing for request and response data.
- **Error Boundaries:** Implement error boundaries for critical components to gracefully handle runtime errors.
- **Accessibility:** Follow WCAG guidelines and use tools like `eslint-plugin-jsx-a11y` to ensure accessible components.

### 🌐 Backend Development Guidelines (Node.js/Express.js - STAR-LAB)
- **Framework:** Express.js with TypeScript for all backend applications.
- **Database:** PostgreSQL as the primary database, leveraging JSONB support for flexible fields.
- **ORM:** Prisma for type-safe queries, powerful migrations, and clean database interaction. Define schema in `prisma/schema.prisma` and use `prisma generate` for client generation.
- **Authentication:** Implement JWT (JSON Web Tokens) for stateless authentication. Use `bcrypt` for securely hashing passwords.
- **Authorization (RBAC):** Implement granular role-based access control using Express middleware to protect routes based on user roles (e.g., `isAdmin`, `isLabTech`, `isDoctor`, `isCustomerOrAdmin`).
- **API Design:** Build clear and consistent RESTful APIs. Use versioning (e.g., `/api/v1/...`). Define clear resources (e.g., `/api/v1/customers`, `/api/v1/lab/requests`).
- **Input Validation:** Use Zod (or Joi) on the backend to validate all incoming request bodies and query parameters, preventing invalid or malicious data.
- **Error Handling:** Implement a centralized error handling middleware in Express to catch all errors and send consistent, user-friendly error responses (e.g., 400, 401, 403, 404, 500).
- **Environment Variables:** Use `dotenv` for all configurations and secrets. Never commit `.env` files to Git.
- **File Uploads:** Use `multer` middleware for handling `multipart/form-data` uploads. Integrate with Google Cloud Storage (or equivalent object storage) for secure and scalable file storage, saving file URLs/paths in the database.
- **Modular Structure:** Organize backend code into clearly separated modules (e.g., `routes/`, `controllers/`, `services/`, `middleware/`, `utils/`, `models/`, `types/`, `common/`).
- **Auto-Generating Request Numbers:** Implement a service/utility function to generate unique request numbers based on company ID/name and date, ensuring atomicity.
- **Complex Queries:** Leverage Prisma's powerful querying capabilities for complex searches and filtering.
- **Transactional Operations:** Use database transactions for multi-step operations to ensure data consistency.
- **Background Tasks (Optional):** Consider dedicated email services or simple background job queues for tasks like email sending (registration confirmation, lab result notification) if volume is high.

### ⚙️ General Development Practices (STAR-LAB)
- **Project Structure:** Utilize a monorepo setup (e.g., pnpm workspaces) to allow for a single `node_modules` structure, easy sharing of types (e.g., `packages/shared/types.ts`) between frontend and backend, and simplified tooling.
- **Shared Types:** Define common TypeScript interfaces for all data models (e.g., `Customer`, `TestRequest`, `Sample`, `Invoice`) in a `packages/shared/types.ts` file within your monorepo. This ensures type consistency across the full stack.
- **API Contract:** Prioritize defining your API endpoints, request/response bodies, and error formats (e.g., using OpenAPI/Swagger or clear TypeScript interfaces).
- **Version Control:** Use Git, with a feature-branching workflow and pull requests for code reviews.
- **Testing Strategy:**
    - **Frontend:** Unit/Component tests with Jest/Vitest and React Testing Library. E2E tests with Cypress/Playwright for full user flows.
    - **Backend:** Unit tests for services and utilities. Integration tests with Supertest for API endpoints, including authentication and authorization checks. Database integration tests using a dedicated test database.
- **Linting & Formatting:** Ensure ESLint and Prettier are configured consistently across both frontend and backend to maintain code quality and style.
- **Logging:** Implement structured logging on the backend (e.g., Winston or Pino) for debugging, monitoring, and auditing. Log relevant actions, errors, and system events.
- **Deployment (Google Cloud):**
    - **Backend:** Deploy Express application using Compute Engine, Cloud Run, or Kubernetes Engine. Use Cloud SQL (PostgreSQL) for the managed database and Cloud Storage for file attachments. Utilize Cloud Build for CI/CD.
    - **Frontend:** Serve built React application's static files from a Cloud Storage bucket (exposed via Load Balancer or Cloud CDN) or Firebase Hosting.
    - **IAM:** Configure fine-grained Identity and Access Management (IAM) roles for service accounts and users.
- **Security Measures:**
    - Input Validation: Essential on both frontend and backend.
    - Authentication & Authorization: Robust JWT implementation, HttpOnly cookies for tokens, and thorough RBAC middleware.
    - Password Hashing: Always use `bcrypt` for password storage.
    - CORS: Properly configure the `cors` middleware in Express, limiting origins to your frontend domain.
    - Rate Limiting: Protect API endpoints (especially login and registration) from abuse.
    - SQL Injection / XSS Protection: Use Prisma (ORM) to prevent SQL injection. Sanitize and escape all user-generated content rendered on the frontend to prevent XSS.
    - Dependency Management: Regularly scan for and update vulnerable dependencies.

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### ⚛️ Frontend Development Guidelines (STAR-LAB)
- **Framework:** React 19+ for all frontend applications.
- **Styling:** Utilize Tailwind CSS for all styling. Prefer Shadcn UI / Radix UI for pre-built, accessible, and customizable UI components (tables, forms, modals, date pickers, file upload areas). Use Font Awesome or Lucide React for iconography.
- **Routing & Data Layer:** Implement routing with React Router 7+, leveraging Loader and Action Functions for efficient data fetching/mutations. Ensure Protected Routes are implemented using loader functions or custom route components based on user authentication status and role.
- **State Management:** Use React Query (TanStack Query) for all data fetching, caching, and synchronization with the backend API. For global, non-data-related state (e.g., user context, theme settings, notification messages), use React's Context API or Zustand.
- **Form Management & Validation:** Employ React Hook Form for efficient form handling, especially for complex forms with dynamic fields. Use Zod for schema-based validation, ensuring consistency between frontend and backend.
- **API Interaction:** Use the native `fetch` API or `axios` for making HTTP requests to the Express.js backend, integrated with React Query.
- **Project Structure:** Adhere to a monorepo structure (e.g., using pnpm workspaces) with the frontend application located at `apps/frontend/`. Define common TypeScript interfaces for all data models (e.g., Customer, TestRequest, Sample, Invoice) in a `packages/shared/types.ts` file to ensure type consistency between frontend API calls and backend responses.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified Python packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.


## EXAMPLES:

> "Read and explain the code in the `examples/` folder."

## DOCUMENTATION:

- **Next.js Documentation**: [Next.js Official Docs](https://nextjs.org/docs)
- **React Documentation**: [React Official Docs](https://reactjs.org/docs/getting-started.html)
- **TypeScript Documentation**: [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- **Tailwind CSS Documentation**: [Tailwind CSS Official Docs](https://tailwindcss.com/docs)
- **Prisma Documentation**: [Prisma Official Docs](https://www.prisma.io/docs/)
- **Zod Documentation**: [Zod Official Docs](https://zod.dev/)
- **NextAuth.js Documentation**: [NextAuth.js Official Docs](https://next-auth.js.org/getting-started/introduction)
- **React Hook Form Documentation**: [React Hook Form Official Docs](https://react-hook-form.com/get-started/introduction/)
- **React Query Documentation**: [React Query Official Docs](https://react-query.tanstack.com/overview)
- **Axios Documentation**: [Axios Official Docs](https://axios-http.com/docs/intro)
- **Express.js Documentation**: [Express Official Docs](https://expressjs.com/en/starter/installing.html)

## OTHER CONSIDERATIONS:

ㆍEnsure compatibility with React 19 and NextJs version 15 for seamless integration and modern features.
ㆍCode Quality: Ensure all code follows clean code principles and aligns with the SOLID design
principles to maintain readability, scalability, and maintainability.
ㆍFile Size Management: Avoid bloated files - keep each file under 500 lines of code by applying
modular design and separation of concerns.
ㆍDocumentation: Include a comprehensive README.md file with clear instructions on how to
install, configure, and run the project locally to ensure smooth onboarding and setup.
