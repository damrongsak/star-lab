# Repository Guidelines

## Project Structure & Module Organization
- apps/backend: Express + TypeScript API (Prisma, JWT). Tests in `src/__tests__`.
- apps/frontend: React Router + Tailwind UI. App code in `app/`.
- util-services/database-service: Knex migrations/seeds and utilities.
- util-services/helper-service: Auxiliary TypeScript utilities.
- packages/shared: Shared TypeScript types/utilities.
- docs, diagrams, examples: Reference materials and samples.

## Build, Test, and Development Commands
- Install workspace deps: `pnpm install`
- Run backend in dev: `pnpm --filter starlab-backend dev`
- Run frontend in dev: `pnpm --filter starlab-frontend dev`
- Build shared package: `pnpm --filter shared build`
- Lint all packages: `pnpm -r run lint` (fix: `pnpm -r run lint:fix`)
- Format all: `pnpm -r run format`
- Bring up services (db, etc.): `docker-compose up -d`

## Coding Style & Naming Conventions
- Language: TypeScript (2-space indent, semicolons via Prettier).
- Linting/Formatting: ESLint + Prettier (configs per package). Ensure both pass before committing.
- File/Type names: PascalCase for classes/services (e.g., `UserService.ts`); camelCase for variables/functions.
- Paths and modules: Prefer absolute aliases if configured; otherwise relative paths kept short and clear.

## Testing Guidelines
- Framework: Jest (ts-jest) for backend and util services.
- Locations: Backend tests in `apps/backend/src/__tests__/*.test.ts`; util-service tests in `util-services/database-service/__tests__`.
- Run backend tests: `pnpm --filter starlab-backend test` (add `--coverage` if needed).
- Run util-service tests: `pnpm --filter database-service test`.
- Tests should assert happy paths, validation, and failure modes; mock external I/O.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Scope by package when helpful.
- Before PR: `pnpm -r run lint`, run relevant tests, update docs as needed.
- PRs must include: concise description, linked issues (e.g., `Closes #123`), screenshots for UI changes, and steps to verify.

## Security & Configuration Tips
- Environment: Keep `.env` per app (`apps/backend`, `apps/frontend`). Do not commit secrets.
- Backend: set `JWT_SECRET`, database URL. Use Docker Compose for local DB.
- Data/migrations: Knex commands live in `util-services/database-service` (e.g., `pnpm --filter database-service migrate:latest`).

