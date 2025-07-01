# Gemini Project Configuration

This file helps Gemini understand the project's structure, conventions, and important commands.

## Project Overview

This is a monorepo project containing a backend, a frontend, and several utility services. The backend is a Node.js application using TypeScript and Express. The frontend is a React application.

## Commands

-   `pnpm install`: Install dependencies for all packages.
-   `pnpm test`: Run tests for all packages.

## Key Files

-   `apps/backend/src/server.ts`: Backend application entry point.
-   `apps/frontend/app/root.tsx`: Frontend application entry point.
t-   `docker-compose.yml`: Defines the services for the project.
-   `pnpm-workspace.yaml`: Defines the workspace for the pnpm monorepo.
