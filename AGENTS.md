# Codex Agent Guidelines

## Follow the Spec-Driven Development (SDD) Flow
- Start every session by skimming `docs/SDD/05-Implementation-Status.md` for current progress and open gaps.
- Use `docs/SDD/04-Implementation-Plan.md` to pick the exact task and validation criteria you are tackling.
- Reference `docs/SDD/03-Technical-Architecture.md` and `docs/SDD/01-PRD.md` whenever requirements or design details are unclear.
- Update `docs/SDD/05-Implementation-Status.md` after completing scoped tasks so documentation stays in sync.

## Project Structure & Ownership
- `apps/backend`: Express 5 + TypeScript API with Prisma/PostgreSQL, JWT auth, file upload support, and Jest tests in `src/__tests__/`.
- `apps/frontend`: Next.js 15 (React 19) App Router project using Tailwind CSS, Shadcn UI, React Query, and React Hook Form. App code lives under `app/`.
- `packages/shared`: Shared TypeScript types, Zod schemas, and utilities consumed by both apps.
- `docs/SDD`: Authoritative specs, architecture, implementation plan, and status tracking.
- `diagrams`, `examples`, `docs`: Reference assets; update as needed when architecture evolves.

## Core Commands
- Install workspace deps: `pnpm install`
- Backend dev server: `pnpm --filter starlab-backend dev`
- Frontend dev server: `pnpm --filter frontend dev`
- Build shared package (when needed): `pnpm --filter @star-lab/shared build`
- Lint all packages: `pnpm -r run lint` (auto-fix: `pnpm -r run lint:fix`)
- Format all: `pnpm -r run format`
- Run backend tests: `pnpm --filter starlab-backend test`
- Bring up local services (PostgreSQL, etc.): `docker-compose up -d`

## Coding Standards
- Language: TypeScript with 2-space indentation; Prettier governs formatting and semicolons.
- Keep modules cohesive; prefer absolute aliases where configured, otherwise use concise relative paths.
- Add focused comments only where the intent is non-obvious; keep code self-descriptive.
- Ensure ESLint and Prettier pass before submitting work.

## Testing Expectations
- Backend: Jest (ts-jest). Unit tests in `apps/backend/src/__tests__`. Add integration tests with Supertest for new endpoints.
- Frontend: Vitest/React Testing Library setup pending—add tests when creating new UI modules and update the SDD status doc.
- Mock all external I/O (email, file storage, database writes) in tests. Cover success, validation errors, and failure modes per SDD validation criteria.

## Workflow & Delivery
- Use Conventional Commits (`feat:`, `fix:`, `chore:`); include package scope where it helps (e.g., `feat(backend):`).
- Before a PR: run linting, relevant tests, and update documentation. Provide verification steps and UI screenshots for frontend changes.
- When closing SDD tasks, document outcomes and any deviations directly in the relevant SDD files.

## Security & Configuration
- Maintain separate `.env` files per app (`apps/backend/.env`, `apps/frontend/.env`). Never commit secrets.
- Backend requires `DATABASE_URL`, `JWT_SECRET`, mail settings for Nodemailer, and file storage paths.
- File uploads persist to `/uploads/*` directories (mounted volumes in Docker). Validate file types and sizes.
- Keep Docker configurations (`docker-compose.yml`, app Dockerfiles, `nginx.conf`) aligned with the deployment architecture defined in the SDD.

