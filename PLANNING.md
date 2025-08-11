# Project Planning: Lab Tracking Web Application

## For Claude Code AI
**Start a new conversation to understand this project's architecture, goals, style, and constraints before making any changes.**

## Core Project Overview
This is a **Lab Tracking Web Application** - a comprehensive system for managing laboratory test requests, sample tracking, and customer interactions with internal lab operations.

**Tech Stack:**
- Frontend: React 19, React Router 7, Tailwind CSS, Shadcn UI
- Backend: Express.js with TypeScript, PostgreSQL, Prisma ORM
- Authentication: JWT-based with role-based access control (RBAC)
- Deployment: Google Cloud Platform

## Naming Conventions
- Use **camelCase** for variables and functions
- Use **PascalCase** for class and component names
- Use **kebab-case** for file and folder names
- Prefix interfaces with `I` (e.g., `IUser`, `ITestRequest`)

## Architecture Patterns
- **Monorepo structure** with pnpm workspaces
- **Feature-based** organization with MVC separation
- **Role-Based Access Control**: Customer, Admin, Lab Technician, Doctor/Approver roles
- **Shared types** between frontend/backend in `packages/shared/types.ts`

---

## Lab Tracking Web Application Development Plan - Refined

This refined plan integrates the detailed requirements for both external customers and internal lab personnel, leveraging your chosen tech stack: React 19, React Router 7, Tailwind CSS for the frontend, and Express.js with TypeScript, PostgreSQL, and Prisma for the backend, authenticated with JWT and deployed on Google Cloud.

### I. Core Requirements & Features (Minimum Viable Product - MVP)

The MVP is expanded to include comprehensive customer-facing and lab-internal workflows.

#### A. User Management & Authentication

**1. Customer Registration & Profile:**
- Information Capture: Company name, ID card/tax ID, primary address, shipping address for receiving samples/results
- File Attachments: Allow customers to upload relevant documents during registration (e.g., business license, tax documents)
- Email Confirmation: Mandatory email verification for new customer registrations
- Login/Logout: Secure authentication for customers

**2. Internal Lab User Management (Admin):**
- Roles: Admin, Lab Technician, Doctor/Approver, Lab Manager
- Secure Authentication: Login/Logout for internal staff
- User Administration: Admins can add, edit, delete internal users and assign their roles
- Authorization (RBAC): Implement granular role-based access control to restrict features and data based on user roles

#### B. Customer Portal Features

**1. Document Request List:**
- Listing & Search: Customers can view and search all their submitted test requests
- Key Information: Display Request Date, Request Number, Company Name, Requester, Document Status
- Document Status Lifecycle: "Submitted" → "Acknowledged and Received Sample" → "Paid" → "Approved" → "Rejected"
- Actions: View, Edit (if status allows), Delete (if status allows), Print Request Summary

**2. Add/Edit Requesting Test:**
- Auto-Generated Request No.: Automatically generate a unique request number based on company and sender
- Sample List Management: A dynamic list where customers can add/edit/delete individual samples within a request
  - Sample Details: For each sample: Sample ID, Sent Sample Date, Animal Type, Sample Specimen, Panel, Method, Sample Quantity
- Saving Options:
  - Save Draft: Allow customers to save incomplete requests to continue later
  - Submit for Approval: Submit the request to the lab for review and processing

**3. Invoice Page:**
- Detailed Invoice Display: Show Lab's Company Info, Customer's Tax Company Info, Invoice Number
- Itemized Details: Running Item ID, Detail (description of service/test), Quantity, Unit Price, Total for item
- Summary: Calculate Sub-total, Tax (7%), and Net Total
- Actions: Print Invoice, Attach Payment Slip (for customer to upload proof of payment)

#### C. Lab Internal Operations (Admin / Lab Technician / Doctor)

**1. Admin Dashboard & Request Overview:**
- Search & Filtering: Powerful search capabilities by Request Number, Document Status, Objective, Requester, Company, Request Date Range
- Request Listing: Display all customer requests with: Request Date, Request No., Company, Objective, Requester, Document Status
- Document Status (Internal View): "Waiting Approval Lab" → "Submitted" → "Acknowledged" → "Lab Result Entry" → "Waiting Doctor Approval" → "Approved" → "Paid" → "Rejected"
- Actions: Acknowledge (Receive Sample), View Lab Result, Approve/Reject (for Admin/Doctor), Mark as Paid

**2. Receive Sample & Acknowledge Request (Lab Technician):**
- Request Details: Display the full request information from the customer
- Quantity Adjustment: Ability to adjust the received quantity of each sample if it differs from the requested quantity
- Acknowledgement: Confirm sample reception, update status, and move to "Lab Result Entry" step

**3. Lab Result Entry (Lab Technician):**
- Request & Case Info: Show Request No., Case No., Case Date, Company, Sender, Admin (who received sample) Name
- Result Input: Fields to enter test results for each sample/panel
- Attachment: Ability to attach final lab result documents (e.g., PDF reports, raw data files)
- Result Status: Set status (e.g., "Pending Review," "Completed")
- Request Approval Button: Submit the entered results for Doctor's approval

#### D. Doctor Approval Workflow (Doctor / Approver)

**1. Document Approval Page:**
- List Pending Documents: Doctors see a list of lab result documents awaiting their approval
- Review: Ability to review all associated lab results and attachments
- Actions:
  - Approve: Mark the lab document as "Approved," triggering notification to customer and allowing invoice generation/release
  - Reject: Mark the lab document as "Rejected," providing a reason, and potentially sending it back for re-testing/re-entry

### II. Full-Stack Architecture Suggestion

#### A. Frontend (React with React Router & Tailwind CSS)
- **Framework:** React 19+
- **Routing & Data Layer:** React Router 7+ will manage navigation and data flow effectively
  - Loader & Action Functions: Crucial for server-side rendering and efficient data fetching/mutations within routes
  - Protected Routes: Implement loader functions or custom route components to guard routes based on user authentication status and role
- **UI Components & Styling:**
  - Tailwind CSS: For all styling
  - Shadcn UI / Radix UI: Strongly recommend using Shadcn UI for pre-built, accessible, and customizable UI components
  - Icons: Use Font Awesome or Lucide React for consistent iconography
- **State Management:**
  - React Query (TanStack Query): Essential for managing all data fetching, caching, and synchronization with your backend API
  - Context API / Zustand: For global, non-data-related state
- **Form Management & Validation:**
  - React Hook Form: For efficient form handling
  - Zod: For schema-based validation
- **API Interaction:** Use fetch API or axios for making HTTP requests to your Express backend, integrated with React Query

#### B. Backend (Express.js with TypeScript, PostgreSQL, Prisma)
- **Framework:** Express.js (TypeScript)
- **Database:** PostgreSQL (with JSONB support for flexible fields)
- **ORM:** Prisma provides type-safe queries, powerful migrations, and clean database interaction
- **Authentication:** JWT (JSON Web Tokens) for stateless authentication with bcrypt for password hashing
- **Authorization (RBAC):** Implement Express middleware with granular role-based access control
- **API Design:** RESTful API with clear versioning (`/api/v1/...`)
- **Input Validation:** Use Zod on the backend to validate all incoming requests
- **Error Handling:** Centralized error handling middleware
- **File Uploads:** Use multer middleware with Google Cloud Storage integration

#### C. Database Schema (Key Tables)
- **users**: Authentication and role management
- **customers**: Customer-specific details and company information
- **test_requests**: Main customer requests for tests
- **test_request_samples**: Individual samples within requests
- **lab_tests**: Actual lab tests performed
- **lab_results**: Detailed test results
- **invoices**: Billing information
- **document_attachments**: File management
- **audit_trail**: Activity logging

### III. Development Workflow & Best Practices

**1. Project Structure:**
- **Monorepo (pnpm workspaces)**: Single node_modules, shared types, simplified tooling
```
your-repo/
├── apps/
│   ├── frontend/    # React app
│   └── backend/     # Express app
├── packages/
│   └── shared/      # Shared types, utilities
└── pnpm-workspace.yaml
```

**2. Shared Types:** Define common TypeScript interfaces in `packages/shared/types.ts` for consistency between frontend and backend

By adhering to these guidelines and architecture, the project will maintain consistency, scalability, and meet all laboratory tracking requirements.