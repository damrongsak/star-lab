# Lab Tracking Web Application Development Plan - Refined

This refined plan integrates the detailed requirements for both external customers and internal lab personnel, leveraging your chosen tech stack: React 19, NextJs 15, Tailwind CSS for the frontend, and Express.js with TypeScript, PostgreSQL, and Prisma for the backend, authenticated with JWT and deployed on Google Cloud.

## I. Core Requirements & Features (Minimum Viable Product - MVP)

The MVP is expanded to include comprehensive customer-facing and lab-internal workflows.

### A. User Management & Authentication

#### 1. Customer Registration & Profile
- **Information Capture**: Company name, ID card/tax ID, primary address, shipping address for receiving samples/results.
- **File Attachments**: Allow customers to upload relevant documents during registration (e.g., business license, tax documents).
- **Email Confirmation**: Mandatory email verification for new customer registrations.
- **Login/Logout**: Secure authentication for customers.

#### 2. Internal Lab User Management (Admin)
- **Roles**: Admin, Lab Technician, Doctor/Approver, Lab Manager.
- **Secure Authentication**: Login/Logout for internal staff.
- **User Administration**: Admins can add, edit, delete internal users and assign their roles.
- **Authorization (RBAC)**: Implement granular role-based access control to restrict features and data based on user roles.

### B. Customer Portal Features

#### 1. Document Request List
- **Listing & Search**: Customers can view and search all their submitted test requests.
- **Key Information**: Display Request Date, Request Number, Company Name, Requester, Document Status.
- **Document Status Lifecycle**: "Submitted" -> "Acknowledged and Received Sample" -> "Paid" -> "Approved" -> "Rejected".
- **Actions**: View, Edit (if status allows), Delete (if status allows), Print Request Summary.

#### 2. Add/Edit Requesting Test
- **Auto-Generated Request No.**: Automatically generate a unique request number based on company and sender.
- **Sample List Management**: A dynamic list where customers can add/edit/delete individual samples within a request.
    - **Sample Details**: For each sample: Sample ID, Sent Sample Date, Animal Type, Sample Specimen, Panel, Method, Sample Quantity.
- **Saving Options**:
    - **Save Draft**: Allow customers to save incomplete requests to continue later.
    - **Submit for Approval**: Submit the request to the lab for review and processing.

#### 3. Invoice Page
- **Detailed Invoice Display**: Show Lab's Company Info, Customer's Tax Company Info, Invoice Number.
- **Itemized Details**: Running Item ID, Detail (description of service/test), Quantity, Unit Price, Total for item.
- **Summary**: Calculate Sub-total, Tax (7%), and Net Total.
- **Actions**: Print Invoice, Attach Payment Slip (for customer to upload proof of payment).

### C. Lab Internal Operations (Admin / Lab Technician / Doctor)

#### 1. Admin Dashboard & Request Overview
- **Search & Filtering**: Powerful search capabilities by Request Number, Document Status, Objective, Requester, Company, Request Date Range.
- **Request Listing**: Display all customer requests with: Request Date, Request No., Company, Objective, Requester, Document Status.
- **Document Status (Internal View)**: "Waiting Approval Lab" -> "Submitted" -> "Acknowledged" -> "Lab Result Entry" -> "Waiting Doctor Approval" -> "Approved" -> "Paid" -> "Rejected".
- **Actions**: Acknowledge (Receive Sample), View Lab Result, Approve/Reject (for Admin/Doctor), Mark as Paid.

#### 2. Receive Sample & Acknowledge Request (Lab Technician)
- **Request Details**: Display the full request information from the customer.
- **Quantity Adjustment**: Ability to adjust the received quantity of each sample if it differs from the requested quantity.
- **Acknowledgement**: Confirm sample reception, update status, and move to "Lab Result Entry" step.

#### 3. Lab Result Entry (Lab Technician)
- **Request & Case Info**: Show Request No., Case No., Case Date, Company, Sender, Admin (who received sample) Name.
- **Result Input**: Fields to enter test results for each sample/panel.
- **Attachment**: Ability to attach final lab result documents (e.g., PDF reports, raw data files).
- **Result Status**: Set status (e.g., "Pending Review," "Completed").
- **Request Approval Button**: Submit the entered results for Doctor's approval.

### D. Doctor Approval Workflow (Doctor / Approver)

#### 1. Document Approval Page
- **List Pending Documents**: Doctors see a list of lab result documents awaiting their approval.
- **Review**: Ability to review all associated lab results and attachments.
- **Actions**:
    - **Approve**: Mark the lab document as "Approved," triggering notification to customer and allowing invoice generation/release.
    - **Reject**: Mark the lab document as "Rejected," providing a reason, and potentially sending it back for re-testing/re-entry.

## II. Full-Stack Architecture Suggestion

Your tech stack choices are excellent and well-suited for these requirements.

### A. Frontend (React with React Router & Tailwind CSS)
- **Framework**: React 19+
- **Routing & Data Layer**: NextJs 15+ will manage navigation and data flow effectively.
    - **Loader & Action Functions**: Crucial for server-side rendering and efficient data fetching/mutations within routes, reducing boilerplate in components.
    - **Protected Routes**: Implement loader functions or custom route components to guard routes based on user authentication status and role (e.g., `/customer/*` for customers, `/admin/*` for lab staff, `/doctor/*` for doctors).
- **UI Components & Styling**:
    - **Tailwind CSS**: For all styling.
    - **Shadcn UI / Radix UI**: Strongly recommend using Shadcn UI for pre-built, accessible, and customizable UI components like tables, forms, modals, date pickers, and file upload areas. This will save significant development time and ensure consistency.
    - **Icons**: Use Font Awesome (you already have it) or Lucide React for consistent iconography.
- **State Management**:
    - **React Query (TanStack Query)**: Essential for managing all data fetching, caching, and synchronization with your backend API. It simplifies complex data flows (e.g., polling for status updates, optimistic UI).
    - **Context API / Zustand**: For global, non-data-related state (e.g., user context, theme settings, notification messages).
- **Form Management & Validation**:
    - **React Hook Form**: For efficient form handling, especially with complex forms like Add Requesting Test and Lab Result Entry.
    - **Zod**: For schema-based validation. You can define validation schemas once and use them on both the frontend and backend, ensuring consistency.
- **API Interaction**: Use fetch API or axios for making HTTP requests to your Express backend, integrated with React Query.

### B. Backend (Express.js with TypeScript, PostgreSQL, Prisma)
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL (with JSONB support for flexible fields like details in `audit_trail` or value in `results`).
- **ORM**: Prisma is an excellent choice. It provides type-safe queries, powerful migrations, and a clean way to interact with your PostgreSQL database.
    - You'll define your schema in `schema.prisma` and use `prisma generate` to create type-safe client.
    - Prisma Migrate will handle database schema changes.
- **Authentication**:
    - **JWT (JSON Web Tokens)**: For stateless authentication. After successful login, issue a JWT containing `userId` and `role`. Clients store this token (preferably in an HttpOnly cookie for browser-based apps).
    - **Password Hashing**: Use bcrypt for securely hashing passwords before storing them.
- **Authorization (RBAC)**:
    - Implement Express middleware that verifies the JWT and extracts the user's role.
    - Create granular middleware functions (e.g., `isAdmin`, `isLabTech`, `isDoctor`, `isCustomerOrAdmin`) to protect specific routes based on the required role.
- **API Design**: Build a clear and consistent RESTful API.
    - **Versioning**: Use `/api/v1/...` for your endpoints.
    - **Resources**: Define clear endpoints for customers (`/api/v1/customers`, `/api/v1/customer-requests`, `/api/v1/invoices`), and lab internal operations (`/api/v1/lab/requests`, `/api/v1/lab/samples`, `/api/v1/lab/results`, `/api/v1/lab/users`).
- **Input Validation**: Use Zod (or Joi) on the backend to validate all incoming request bodies and query parameters. This prevents invalid or malicious data from reaching your database.
- **Error Handling**: Implement a centralized error handling middleware in Express to catch all errors and send consistent, user-friendly error responses (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).
- **Environment Variables**: Use dotenv for all configurations.
- **File Uploads**: Use multer middleware for handling `multipart/form-data` uploads (customer registration attachments, lab result attachments, payment slips). For secure and scalable storage, integrate with Google Cloud Storage (or equivalent object storage) to store files and save the file URLs/paths in your database.

---

This is a condensed version of the original content, formatted for clarity and readability in markdown. Let me know if further adjustments are needed.
