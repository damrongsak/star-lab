# Star-Lab: Lab Test Tracking

Star-Lab is a comprehensive, full-stack web application designed to manage the entire workflow of a laboratory testing facility. It provides a robust backend API and a modern, user-friendly frontend to handle everything from customer registration and test requests to lab processing, invoicing, and results delivery.

## Features

-   **Role-Based Access Control:** A sophisticated permission system with roles like `ADMIN`, `LAB_ADMIN`, `CUSTOMER`, `TECHNICIAN`, and `DOCTOR` to ensure users only access what they need.
-   **End-to-End Test Tracking:** Manage the entire lifecycle of a test request, from submission and payment to sample tracking, result uploads, and final approval.
-   **Customer & Doctor Portals:** Dedicated interfaces for customers to manage their requests and for doctors to review and approve results.
-   **Automated Invoicing:** Generate invoices from completed test requests, track payment statuses, and manage billing.
-   **Comprehensive API:** A well-documented RESTful API built with Express.js and TypeScript, providing endpoints for all system functionalities.
-   **Modern Frontend:** A responsive and intuitive user interface built with React, React Router, and Tailwind CSS.

## Tech Stack

**Backend:**

-   **Framework:** Express.js
-   **Language:** TypeScript
-   **ORM:** Prisma
-   **Database:** PostgreSQL
-   **Authentication:** JWT (JSON Web Tokens)
-   **API Documentation:** Swagger/OpenAPI

**Frontend:**

-   **Framework:** React
-   **Routing:** React Router
-   **Styling:** Tailwind CSS
-   **Build Tool:** Vite

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   pnpm
-   Docker and Docker Compose

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd star-lab
    ```

2.  **Install dependencies:**
    This project uses `pnpm` as a package manager for the monorepo.
    ```bash
    pnpm install
    ```

3.  **Setup Environment Variables:**
    Each package (`apps/backend`, `apps/frontend`) may require its own `.env` file. Refer to the `README.md` within each package for specific environment variables that need to be configured. A typical backend setup will require a `DATABASE_URL` and `JWT_SECRET`.

4.  **Start the development environment:**
    This will start the backend server, frontend development server, and the database using Docker Compose.
    ```bash
    docker-compose up -d
    ```

    -   The backend will be available at `http://localhost:5001`
    -   The frontend will be available at `http://localhost:5173`
    -   The backend API documentation (Swagger) is at `http://localhost:5001/api-docs`

### Running Tests

To run the unit tests for the backend, navigate to the backend directory and run the test command:

```bash
cd apps/backend
pnpm test
```

## Working with the Monorepo (pnpm)

This project is a monorepo managed with `pnpm` workspaces. This makes it easier to manage dependencies and run scripts across multiple projects. Here are some common commands and tips:

### Running Scripts in a Specific Package

You can run scripts defined in a package's `package.json` from the root of the monorepo using the `--filter` flag.

-   **Run the `dev` script for the `backend`:**
    ```bash
    pnpm --filter backend dev
    ```

-   **Run the `build` script for the `frontend`:**
    ```bash
    pnpm --filter frontend build
    ```

### Adding/Removing Dependencies

-   **Add a dependency to a specific package:**
    ```bash
    # Add 'axios' to the frontend
    pnpm --filter frontend add axios

    # Add 'express' to the backend
    pnpm --filter backend add express
    ```

-   **Add a development dependency:**
    ```bash
    # Add 'jest' to the backend as a dev dependency
    pnpm --filter backend add -D jest
    ```

-   **Remove a dependency:**
    ```bash
    pnpm --filter frontend remove axios
    ```

### Running Commands in All Packages

If you have a script that is defined in multiple `package.json` files (e.g., a `lint` or `test` script), you can run it in all packages at once.

```bash
pnpm -r run lint
```

This will run the `lint` script in every package that has it defined.

### Cleaning `node_modules`

To remove all `node_modules` directories from the entire monorepo, you can run:

```bash
pnpm -r exec rm -rf node_modules
```

Then, you can do a clean reinstall with `pnpm install`.

These commands should help you effectively manage this monorepo. For more advanced usage, please refer to the [official pnpm documentation](https://pnpm.io/workspaces).

## How to Work with Your AI Assistant (Gemini)

To ensure a smooth and efficient collaboration, here are some guidelines and tips for interacting with me:

### Best Practices

1.  **Be Specific:** The more specific your request, the better I can assist. Instead of "fix the bug," try "The `login` endpoint is throwing a 500 error when the email is not found. It should return a 404."
2.  **Provide Context:** When asking for changes, mention the relevant files, functions, or API endpoints. For example, "In `apps/backend/src/controllers/AuthController.ts`, I want to add rate limiting to the `login` function."
3.  **One Task at a Time:** For complex changes, it's often better to break them down into smaller, sequential requests. This makes the process more manageable and easier to debug if something goes wrong.
4.  **Review My Plan:** For significant changes, I will propose a plan first. Please review it. If it aligns with your goals, a simple "yes" or "proceed" is enough. If not, provide feedback on what to change.

### Example Prompts

-   **Adding a feature:** "I want to add a new feature to the `Customer` module. Please add an endpoint `GET /api/v1/customers/recent` that returns the 5 most recently registered customers. This should only be accessible to `ADMIN` users."
-   **Writing tests:** "Please write unit tests for the `InvoiceService` in `apps/backend/src/services/InvoiceService.ts`. Make sure to cover the `createInvoice` and `markAsPaid` methods."
-   **Refactoring code:** "Can you refactor the `getTestRequest` function in `TestRequestController.ts` to also include the assigned doctor's name in the response?"
-   **Frontend changes:** "In the frontend, please create a new page at `/dashboard/reports` that displays the statistics from the `GET /api/v1/invoices/statistics` endpoint. This page should only be visible to `ADMIN` and `LAB_ADMIN` roles."

I have access to the project's files and documentation, so I can find the necessary context for most tasks. Let's build something great together!