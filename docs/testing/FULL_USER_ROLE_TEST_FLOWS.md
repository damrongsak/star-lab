# STAR-LAB Full User Role Test Flows

**Version:** 1.0
**Date:** 2025-11-28
**Purpose:** Comprehensive end-to-end test scenarios for all user roles in the STAR-LAB system

---

## Table of Contents

1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Test Data Requirements](#test-data-requirements)
4. [Role-Based Test Flows](#role-based-test-flows)
   - [CUSTOMER Role](#1-customer-role-test-flow)
   - [TECHNICIAN Role](#2-technician-role-test-flow)
   - [DOCTOR Role](#3-doctor-role-test-flow)
   - [LAB_ADMIN Role](#4-lab_admin-role-test-flow)
   - [ADMIN Role](#5-admin-role-test-flow)
   - [APPROVAL Role](#6-approval-role-test-flow)
5. [Cross-Role Integration Tests](#cross-role-integration-tests)
6. [Status Flow Verification](#status-flow-verification)
7. [Test Checklist](#test-checklist)

---

## Overview

### System Architecture
- **Frontend**: Next.js 15 (React 19) with Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with cookie-based storage
- **Authorization**: Role-Based Access Control (RBAC)

### User Roles Summary

| Role | Description | Primary Portal | Key Responsibilities |
|------|-------------|----------------|---------------------|
| **CUSTOMER** | External clients (companies) | Customer Portal | Submit test requests, view results, manage invoices |
| **TECHNICIAN** | Lab staff | Lab Portal | Acknowledge samples, enter test results |
| **DOCTOR** | Medical professionals | Doctor Portal | Review and approve/reject test results |
| **LAB_ADMIN** | Lab administrators | Admin Portal | Manage operations, oversee requests |
| **ADMIN** | System administrators | Admin Portal | User management, system settings |
| **APPROVAL** | Approval workflow role | Admin Portal | Special approval tasks |

---

## Test Environment Setup

### Prerequisites

1. **Development Environment Running**
   ```bash
   # Start backend
   cd apps/backend
   pnpm dev

   # Start frontend
   cd apps/frontend
   pnpm dev

   # Ensure database is running
   docker-compose up -d postgres
   ```

2. **Database Seeded**
   ```bash
   cd apps/backend
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

3. **Test Accounts Available** (from seed data)
   - Customer: `customer@example.com` / password
   - Technician: `tech@starlab.com` / password
   - Doctor: `doctor@starlab.com` / password
   - Lab Admin: `labadmin@starlab.com` / password
   - System Admin: `admin@starlab.com` / password

### Base URLs
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001/api/v1`

---

## Test Data Requirements

### Required Test Data

#### 1. Companies
- At least 2 companies with different tax IDs
- Company codes: "ABC", "XYZ"

#### 2. Test Requests
- Multiple requests in different statuses:
  - DRAFT (editable)
  - SUBMITTED (pending acknowledgment)
  - APPROVED (completed)
  - REJECTED (with reasons)

#### 3. Samples
- Various animal types: Dog, Cat, Bird, etc.
- Various specimens: Blood, Tissue, Swab
- Multiple test panels: CBC, Chemistry, Microbiology
- Different statuses: RECEIVED, IN_TESTING, COMPLETED

#### 4. Invoices
- Invoices in different payment statuses:
  - PENDING
  - PAID (with payment slips)
  - OVERDUE

#### 5. Users
- At least 2 users per role for testing isolation
- Mix of active and inactive accounts

---

## Role-Based Test Flows

## 1. CUSTOMER Role Test Flow

### Test Objective
Verify complete customer journey from registration through request submission, result viewing, and invoice payment.

### Prerequisites
- Backend and frontend running
- Email service configured (or mocked)
- File upload functionality working

---

### Test Flow 1.1: Customer Registration

**Steps:**

1. **Navigate to Registration Page**
   - URL: `http://localhost:3000/register`
   - Verify page loads without errors

2. **Fill Registration Form**
   - **Email**: `testcustomer@example.com`
   - **Password**: `Test123!@#`
   - **Confirm Password**: `Test123!@#`
   - **Company Name (EN)**: `Test Company Ltd`
   - **Company Name (TH)**: `บริษัท เทสต์ จำกัด`
   - **Legal Entity ID (Tax ID)**: `0105123456789`
   - **Company Description**: `Testing company for STAR-LAB`
   - **Address**: Complete all address fields
   - **Phone**: `02-123-4567`
   - **Operator First Name**: `John`
   - **Operator Last Name**: `Doe`
   - **Operator ID Card**: `1234567890123`
   - **Operator Mobile**: `081-234-5678`
   - **Receipt Address**: Complete all receipt address fields

3. **Upload Documents**
   - Upload company registration document (PDF)
   - Upload operator ID card (Image/PDF)

4. **Submit Registration**
   - Click "Register" button
   - **Expected**: Success message, redirect to email verification page

5. **Email Verification**
   - Check email for verification link (or copy token from database)
   - Click verification link: `http://localhost:3000/verify-email?token={token}`
   - **Expected**: "Email verified successfully" message
   - **Expected**: Redirect to login page

**Validation Points:**
- ✅ All form validation working (required fields, email format, password strength)
- ✅ Duplicate email rejected
- ✅ File uploads successful
- ✅ User created in database with `isEmailConfirmed = false`
- ✅ Customer record created with all details
- ✅ Verification email sent
- ✅ Email verification updates `isEmailConfirmed = true`

**API Endpoints Tested:**
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/verify-email/:token`

---

### Test Flow 1.2: Customer Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Credentials**
   - Email: `testcustomer@example.com`
   - Password: `Test123!@#`
   - Check "Remember me" (optional)

3. **Submit Login**
   - Click "Login" button
   - **Expected**: Success message
   - **Expected**: Redirect to customer dashboard `/dashboard`

4. **Verify Session**
   - Check cookie stored: `star_lab_token`
   - Check user info loaded in navigation
   - Verify role-specific menu items visible

**Validation Points:**
- ✅ Login successful with correct credentials
- ✅ Login rejected with wrong password
- ✅ JWT token stored in HttpOnly cookie
- ✅ User redirected to appropriate dashboard based on role
- ✅ Navigation shows correct menu for CUSTOMER role

**API Endpoints Tested:**
- `POST /api/v1/auth/login`

---

### Test Flow 1.3: View Customer Dashboard

**Steps:**

1. **Dashboard Loads**
   - URL: `http://localhost:3000/dashboard`
   - **Expected**: Dashboard page loads with customer data

2. **Verify Statistics Cards**
   - **Total Requests**: Count of all test requests
   - **Pending Approvals**: Count of submitted requests
   - **Completed**: Count of approved requests
   - **Total Invoices**: Count of invoices

3. **Verify Quick Actions**
   - "New Request" button visible
   - "View Invoices" button visible
   - Both buttons functional

4. **Verify Recent Activity**
   - Recent test requests displayed (if any)
   - Correct status badges
   - Clickable request numbers

**Validation Points:**
- ✅ Statistics cards show correct counts
- ✅ Quick action buttons work
- ✅ Recent activity table populated
- ✅ No errors in console
- ✅ Responsive design on mobile/tablet

**API Endpoints Tested:**
- `GET /api/v1/test-requests/my-requests`
- `GET /api/v1/invoices`

---

### Test Flow 1.4: Create New Test Request (Draft)

**Steps:**

1. **Navigate to New Request Page**
   - Click "New Request" button OR
   - Navigate to `/requests/new`

2. **Fill Request Form**
   - **Requester Name**: `John Doe`
   - **Objective**: `Routine health screening`
   - **Project Name**: (Optional) `Project Alpha`
   - **Notes**: `Urgent processing required`

3. **Add Sample 1**
   - **Customer Sample ID**: `SAMPLE-001`
   - **Sent Sample Date**: Select today's date
   - **Animal Type**: `Dog`
   - **Sample Specimen**: `Blood`
   - **Panel**: `CBC (Complete Blood Count)`
   - **Method**: `Automated Analyzer`
   - **Quantity**: `5`
   - **Unit**: `mL`
   - **Notes**: `Collected in the morning`

4. **Add Sample 2**
   - Click "Add Sample" button
   - **Customer Sample ID**: `SAMPLE-002`
   - **Sent Sample Date**: Select today's date
   - **Animal Type**: `Cat`
   - **Sample Specimen**: `Tissue`
   - **Panel**: `Histopathology`
   - **Method**: `Microscopy`
   - **Quantity**: `1`
   - **Unit**: `piece`

5. **Save as Draft**
   - Click "Save as Draft" button
   - **Expected**: Success toast notification
   - **Expected**: Redirect to requests list `/requests`
   - **Expected**: New request visible with status "DRAFT"

**Validation Points:**
- ✅ Form validation working (required fields)
- ✅ Can add multiple samples dynamically
- ✅ Can remove samples
- ✅ Request number auto-generated in format: `{companyCode}-{YYYYMMDD}-{sequence}`
- ✅ Draft saved successfully
- ✅ Status = "DRAFT"
- ✅ documentStatus = "DRAFT"
- ✅ labInternalStatus = "WAITING_APPROVAL_LAB"

**API Endpoints Tested:**
- `POST /api/v1/test-requests`

**Database Verification:**
```sql
-- Verify request created
SELECT * FROM test_requests WHERE request_no = 'ABC-20251128-001';

-- Verify samples created
SELECT * FROM test_request_samples WHERE test_request_id = '{request_id}';
```

---

### Test Flow 1.5: Edit Draft Request

**Steps:**

1. **Navigate to Requests List**
   - URL: `/requests`
   - Locate the draft request created in Flow 1.4

2. **Open Edit Page**
   - Click "Edit" button for the draft request
   - **Expected**: Edit page loads with pre-filled data
   - URL: `/requests/{id}/edit`

3. **Modify Request Details**
   - Change **Objective**: `Updated objective - Comprehensive screening`
   - Change **Notes**: `Added notes for clarification`

4. **Modify Sample 1**
   - Change **Quantity**: `7` (from 5)
   - Add **Notes**: `Quantity updated`

5. **Add Sample 3**
   - **Customer Sample ID**: `SAMPLE-003`
   - **Animal Type**: `Bird`
   - **Sample Specimen**: `Swab`
   - **Panel**: `Microbiology`
   - **Method**: `Culture`
   - **Quantity**: `2`
   - **Unit**: `swab`

6. **Remove Sample 2**
   - Click "Remove" button next to Sample 2

7. **Save Changes**
   - Click "Save as Draft" button
   - **Expected**: Success toast
   - **Expected**: Redirect to requests list
   - **Expected**: Changes reflected

**Validation Points:**
- ✅ Edit page only accessible for DRAFT requests
- ✅ Non-DRAFT requests show error when accessing edit page
- ✅ All existing data pre-populated correctly
- ✅ Can modify all fields
- ✅ Can add/remove samples
- ✅ Changes saved successfully
- ✅ Request remains in DRAFT status

**API Endpoints Tested:**
- `GET /api/v1/test-requests/:id`
- `PUT /api/v1/test-requests/:id`

---

### Test Flow 1.6: Submit Test Request

**Steps:**

1. **Navigate to Requests List**
   - URL: `/requests`
   - Locate the draft request

2. **Open Edit Page**
   - Click "Edit" button
   - **Expected**: Edit page loads

3. **Submit Request**
   - Click "Submit" button (instead of "Save as Draft")
   - **Expected**: Confirmation dialog appears
   - Click "Confirm"
   - **Expected**: Success toast
   - **Expected**: Redirect to requests list
   - **Expected**: Status changed to "SUBMITTED"

4. **Verify Submitted Request**
   - Locate request in list
   - **Status Badge**: Blue "SUBMITTED"
   - **Edit Button**: Should NOT be visible
   - **Delete Button**: Should NOT be visible
   - **View Button**: Should be visible

**Validation Points:**
- ✅ Submit button works
- ✅ Confirmation dialog appears
- ✅ Status changed from DRAFT to SUBMITTED
- ✅ documentStatus = "SUBMITTED"
- ✅ Request no longer editable
- ✅ Request visible in lab portal for processing

**API Endpoints Tested:**
- `PUT /api/v1/test-requests/:id`

**Database Verification:**
```sql
-- Verify status changed
SELECT document_status, lab_internal_status
FROM test_requests
WHERE request_no = 'ABC-20251128-001';

-- Expected: document_status = 'SUBMITTED', lab_internal_status = 'WAITING_APPROVAL_LAB'
```

---

### Test Flow 1.7: View Request Details

**Steps:**

1. **Navigate to Requests List**
   - URL: `/requests`

2. **Open Request Detail**
   - Click on request number or "View" button
   - URL: `/requests/{id}`

3. **Verify Request Information Displayed**
   - **Status Card**: Shows current status with color-coded badge
   - **Request Details**:
     - Request No
     - Request Date
     - Requester Name
     - Objective
     - Project Name (if any)
     - Notes
   - **Company Information**:
     - Company Name
     - Tax ID
     - Address
     - Phone
   - **Samples Table**:
     - Customer Sample ID
     - Animal Type
     - Specimen
     - Panel
     - Method
     - Quantity
     - Unit
     - Status
     - Notes

4. **Verify Action Buttons**
   - **If DRAFT**: "Edit" and "Delete" buttons visible
   - **If SUBMITTED or later**: Only "View" actions available
   - "Back to Requests" button visible

**Validation Points:**
- ✅ All request information displayed correctly
- ✅ Status badge color-coded correctly
- ✅ Samples table shows all samples
- ✅ Action buttons appropriate for status
- ✅ Navigation back to list works

**API Endpoints Tested:**
- `GET /api/v1/test-requests/:id`

---

### Test Flow 1.8: Search and Filter Requests

**Steps:**

1. **Navigate to Requests List**
   - URL: `/requests`

2. **Test Search by Request Number**
   - Type request number in search box: `ABC-20251128-001`
   - Wait for debounce (300ms)
   - **Expected**: Only matching request(s) displayed

3. **Clear Search**
   - Clear search box
   - **Expected**: All requests displayed again

4. **Test Status Filter**
   - Select "DRAFT" from status dropdown
   - **Expected**: Only DRAFT requests displayed
   - Select "SUBMITTED"
   - **Expected**: Only SUBMITTED requests displayed
   - Select "All Statuses"
   - **Expected**: All requests displayed

5. **Test Combined Search and Filter**
   - Enter partial request number in search
   - Select status "SUBMITTED"
   - **Expected**: Only submitted requests matching search displayed

**Validation Points:**
- ✅ Search debounced (not querying on every keystroke)
- ✅ Search matches request numbers
- ✅ Status filter works correctly
- ✅ Combined search + filter works
- ✅ Loading skeleton shown during search
- ✅ Empty state shown when no results

**API Endpoints Tested:**
- `GET /api/v1/test-requests/my-requests?search=...&status=...`

---

### Test Flow 1.9: Delete Draft Request

**Steps:**

1. **Navigate to Requests List**
   - URL: `/requests`
   - Ensure at least one DRAFT request exists

2. **Click Delete Button**
   - Click "Delete" button for a DRAFT request
   - **Expected**: Confirmation dialog appears
   - Dialog message: "Are you sure you want to delete this request?"

3. **Confirm Deletion**
   - Click "Delete" button in dialog
   - **Expected**: Success toast notification
   - **Expected**: Request removed from list
   - **Expected**: List refreshes automatically

4. **Verify Deletion**
   - Request no longer visible in list
   - Attempt to access deleted request URL directly
   - **Expected**: 404 error or "Request not found"

**Validation Points:**
- ✅ Delete only allowed for DRAFT requests
- ✅ Confirmation dialog prevents accidental deletion
- ✅ Request deleted from database
- ✅ Associated samples also deleted (cascade)
- ✅ List updates without manual refresh
- ✅ Cannot delete non-DRAFT requests

**API Endpoints Tested:**
- `DELETE /api/v1/test-requests/:id`

**Database Verification:**
```sql
-- Verify request deleted
SELECT * FROM test_requests WHERE id = '{deleted_request_id}';
-- Expected: 0 rows

-- Verify samples also deleted
SELECT * FROM test_request_samples WHERE test_request_id = '{deleted_request_id}';
-- Expected: 0 rows
```

---

### Test Flow 1.10: View Invoice List

**Steps:**

1. **Navigate to Invoices Page**
   - Click "Invoices" in navigation OR
   - URL: `/invoices`

2. **Verify Invoice List**
   - **Table Columns**:
     - Invoice No
     - Date
     - Request No (clickable link)
     - Amount
     - Payment Status (badge)
     - Actions (View button)
   - **Status Badges**:
     - PENDING: Yellow
     - PAID: Green
     - OVERDUE: Red
     - CANCELLED: Gray

3. **Test Search**
   - Type invoice number in search box
   - Wait for debounce
   - **Expected**: Matching invoices displayed

4. **Test Status Filter**
   - Select "PENDING" from payment status dropdown
   - **Expected**: Only pending invoices shown
   - Select "PAID"
   - **Expected**: Only paid invoices shown

**Validation Points:**
- ✅ All customer's invoices displayed
- ✅ Cannot see other customers' invoices
- ✅ Status badges color-coded correctly
- ✅ Search and filter work
- ✅ Request numbers are clickable links
- ✅ Amounts formatted correctly (2 decimal places)

**API Endpoints Tested:**
- `GET /api/v1/invoices?search=...&paymentStatus=...`

---

### Test Flow 1.11: View Invoice Detail

**Steps:**

1. **Navigate to Invoice Detail**
   - From invoices list, click "View" button
   - URL: `/invoices/{id}`

2. **Verify Invoice Header**
   - **Invoice Number**: Unique invoice number
   - **Invoice Date**: Date invoice was generated
   - **Due Date**: Payment due date (if applicable)
   - **Payment Status**: Badge with current status

3. **Verify Invoice Information**
   - **Lab Information**:
     - Lab name
     - Tax ID
     - Address
     - Phone
   - **Customer Information**:
     - Company name
     - Tax ID
     - Address
     - Phone
   - **Test Request Link**:
     - Clickable request number
     - Link to request detail page

4. **Verify Line Items Table**
   - **Columns**: Description, Quantity, Unit Price, Line Total
   - **Data**: All test services itemized
   - **Calculations**:
     - Subtotal
     - Tax (7%)
     - Net Total

5. **Verify Payment Section**
   - **If PENDING/WAITING_VERIFICATION**:
     - Payment slip upload section visible
     - "Upload Payment Slip" button enabled
   - **If PAID**:
     - Payment slip displayed (if available)
     - Upload section hidden

**Validation Points:**
- ✅ All invoice information displayed correctly
- ✅ Lab and customer details accurate
- ✅ Line items match test request
- ✅ Tax calculation correct (7%)
- ✅ Total calculations accurate
- ✅ Payment section visibility based on status
- ✅ Request link works

**API Endpoints Tested:**
- `GET /api/v1/invoices/:id`

---

### Test Flow 1.12: Upload Payment Slip

**Steps:**

1. **Navigate to Invoice Detail**
   - Open a PENDING invoice
   - URL: `/invoices/{id}`

2. **Prepare Payment Slip File**
   - Valid file formats: PDF, JPG, PNG
   - File size: < 5MB

3. **Upload Payment Slip**
   - Click "Choose File" or drag-and-drop
   - Select payment slip file
   - **Expected**: File preview shown (if image)
   - **Expected**: File name displayed

4. **Submit Payment Proof**
   - Click "Submit Payment Proof" button
   - **Expected**: Loading indicator shown
   - **Expected**: Success toast notification
   - **Expected**: Payment status changes to "WAITING_VERIFICATION"
   - **Expected**: Payment slip displayed on page

5. **Verify Upload**
   - Refresh page
   - **Expected**: Payment slip still visible
   - **Expected**: Download link available
   - **Expected**: Upload section now hidden

**Validation Points:**
- ✅ File upload works
- ✅ Only valid file types accepted
- ✅ File size validation enforced
- ✅ Payment slip stored securely
- ✅ Status updated to WAITING_VERIFICATION
- ✅ Admin can view payment slip for verification
- ✅ Cannot upload multiple times (once uploaded, section hidden)

**API Endpoints Tested:**
- `PATCH /api/v1/invoices/:id/mark-paid` (with file upload)

**Database Verification:**
```sql
-- Verify payment slip URL stored
SELECT payment_status, payment_slip_attachment_url
FROM invoices
WHERE id = '{invoice_id}';

-- Expected: payment_status = 'WAITING_VERIFICATION', payment_slip_attachment_url = '/uploads/payment-slips/{filename}'
```

---

### Test Flow 1.13: View Profile

**Steps:**

1. **Navigate to Profile Page**
   - Click "Profile" in navigation OR
   - URL: `/profile`

2. **Verify Company Information Card** (Read-only)
   - Company Name (EN)
   - Company Name (TH)
   - Tax ID (Legal Entity ID)
   - Company Code

3. **Verify Contact Information Card** (Editable)
   - **Operator Details**:
     - Prefix
     - First Name
     - Last Name
     - Mobile Phone
     - Phone (optional)
   - **Company Contact**:
     - Phone
     - Fax
   - **Receipt Address**:
     - Building/Floor/Number
     - Province
     - District
     - Sub-district
     - Zip Code
     - Phone
     - Fax

4. **View Current Information**
   - All fields populated with current data
   - "Edit" button visible

**Validation Points:**
- ✅ Profile data loads correctly
- ✅ Company information displayed (read-only)
- ✅ Contact information displayed (editable)
- ✅ No errors in console
- ✅ Responsive layout

**API Endpoints Tested:**
- `GET /api/v1/customers/profile`

---

### Test Flow 1.14: Edit Profile

**Steps:**

1. **Navigate to Profile Page**
   - URL: `/profile`

2. **Click Edit Button**
   - Click "Edit" button on Contact Information card
   - **Expected**: Form fields become editable

3. **Modify Contact Information**
   - Change **Operator First Name**: `Jane`
   - Change **Operator Mobile Phone**: `081-999-8888`
   - Change **Company Phone**: `02-987-6543`
   - Change **Receipt Address**: Update building/floor number

4. **Save Changes**
   - Click "Save Changes" button
   - **Expected**: Loading indicator shown
   - **Expected**: Success toast notification
   - **Expected**: Form fields become read-only again
   - **Expected**: Updated information displayed

5. **Verify Changes Persisted**
   - Refresh page
   - **Expected**: New information still displayed
   - Logout and login again
   - Navigate to profile
   - **Expected**: Changes still visible

**Validation Points:**
- ✅ Edit mode toggles correctly
- ✅ Form validation works (required fields, phone format)
- ✅ Changes saved to database
- ✅ Changes persist across sessions
- ✅ Cannot edit company information (read-only)
- ✅ Can cancel edit without saving

**API Endpoints Tested:**
- `PUT /api/v1/customers/profile`

**Database Verification:**
```sql
-- Verify profile updated
SELECT operator_first_name, operator_mobile_phone, company_phone
FROM customers
WHERE user_id = '{user_id}';

-- Expected: Updated values
```

---

### Test Flow 1.15: Change Password

**Steps:**

1. **Navigate to Profile Page**
   - URL: `/profile`

2. **Locate Change Password Card**
   - "Change Password" section visible
   - Form fields:
     - Current Password
     - New Password
     - Confirm New Password

3. **Enter Password Details**
   - **Current Password**: `Test123!@#`
   - **New Password**: `NewPass456!@#`
   - **Confirm New Password**: `NewPass456!@#`

4. **Submit Password Change**
   - Click "Change Password" button
   - **Expected**: Loading indicator
   - **Expected**: Success toast notification
   - **Expected**: Form fields cleared

5. **Verify Password Changed**
   - Logout
   - Try logging in with **old password**: `Test123!@#`
   - **Expected**: Login fails with "Invalid credentials"
   - Try logging in with **new password**: `NewPass456!@#`
   - **Expected**: Login successful

**Validation Points:**
- ✅ Current password validated
- ✅ New password strength validation enforced
- ✅ Confirm password must match
- ✅ Password updated in database (hashed)
- ✅ Old password no longer works
- ✅ New password works immediately
- ✅ Session remains active after password change

**API Endpoints Tested:**
- `POST /api/v1/auth/change-password`

**Database Verification:**
```sql
-- Verify password hash changed (DO NOT reveal actual hash)
SELECT updated_at FROM users WHERE email = 'testcustomer@example.com';
-- Expected: updated_at timestamp changed
```

---

### Test Flow 1.16: View Approved Results

**Steps:**

1. **Prerequisites**
   - Test request must be in "APPROVED" status
   - Results uploaded by technician
   - Approved by doctor

2. **Navigate to Request Detail**
   - URL: `/requests/{id}` (for approved request)

3. **Verify Approved Status**
   - **Status Badge**: Green "APPROVED"
   - **Approval Information**: Approved by, Approved date

4. **View Results Section**
   - **Results Available**: Message indicating results are ready
   - **Download Results**: Button to download result files
   - **View Results**: Link to view results online (if applicable)

5. **Download Result Files**
   - Click "Download Results" button
   - **Expected**: File download starts
   - **Expected**: PDF or ZIP file downloaded
   - Open file
   - **Expected**: Lab results document displayed

**Validation Points:**
- ✅ Results only visible after approval
- ✅ Results section not shown for non-approved requests
- ✅ Download link works
- ✅ Downloaded file is valid and readable
- ✅ Results contain all test data
- ✅ Results formatted professionally

**API Endpoints Tested:**
- `GET /api/v1/test-requests/:id`
- `GET /api/v1/test-requests/:id/results` (or similar)

---

### Test Flow 1.17: Logout

**Steps:**

1. **Click Logout Button**
   - Locate logout button in navigation (top-right)
   - Click "Logout" or user menu → "Logout"

2. **Verify Logout**
   - **Expected**: Success message (optional)
   - **Expected**: Redirect to login page `/login`
   - **Expected**: JWT token removed from cookies
   - **Expected**: User session cleared

3. **Verify Session Ended**
   - Try accessing protected page: `/dashboard`
   - **Expected**: Redirect to login page
   - **Expected**: "Please log in" message

4. **Verify Cookie Cleared**
   - Open browser DevTools
   - Check Application → Cookies
   - **Expected**: `star_lab_token` cookie removed or expired

**Validation Points:**
- ✅ Logout button accessible
- ✅ Logout clears authentication
- ✅ Protected routes inaccessible after logout
- ✅ Cookie removed
- ✅ Redirect to login page works

---

## 2. TECHNICIAN Role Test Flow

### Test Objective
Verify lab technician can view submitted requests, acknowledge samples, enter test results, and submit for doctor approval.

### Prerequisites
- Customer has submitted at least one test request
- Technician account exists: `tech@starlab.com` / `password`

---

### Test Flow 2.1: Technician Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Technician Credentials**
   - Email: `tech@starlab.com`
   - Password: `password`

3. **Submit Login**
   - Click "Login" button
   - **Expected**: Redirect to lab dashboard `/lab-dashboard`

4. **Verify Navigation**
   - Menu items visible:
     - Dashboard
     - Lab Requests
     - My Assigned Tests
     - Samples
     - Profile
     - Logout

**Validation Points:**
- ✅ Login successful
- ✅ Redirected to lab-specific dashboard
- ✅ Technician role menu displayed
- ✅ Cannot access customer or admin pages

**API Endpoints Tested:**
- `POST /api/v1/auth/login`

---

### Test Flow 2.2: View Lab Dashboard

**Steps:**

1. **Dashboard Loads**
   - URL: `/lab-dashboard`

2. **Verify Statistics Cards**
   - **Total Requests**: Count of all lab requests
   - **Pending Acknowledgment**: Submitted but not acknowledged
   - **In Progress**: Requests being processed
   - **Completed**: Finished tests

3. **Verify Recent Requests Table**
   - Recent test requests listed
   - Status badges displayed
   - Quick action buttons

**Validation Points:**
- ✅ Statistics cards show correct data
- ✅ Recent requests table populated
- ✅ Status badges color-coded
- ✅ No access errors

**API Endpoints Tested:**
- `GET /api/v1/lab/dashboard/statistics`
- `GET /api/v1/lab/requests`

---

### Test Flow 2.3: View Lab Requests List

**Steps:**

1. **Navigate to Lab Requests**
   - Click "Lab Requests" in navigation
   - URL: `/lab-requests`

2. **Verify Requests Table**
   - **Columns**:
     - Request No
     - Customer Name
     - Request Date
     - Status
     - Samples Count
     - Actions (View, Acknowledge)

3. **Test Search Functionality**
   - Type request number in search
   - **Expected**: Matching requests displayed

4. **Test Status Filter**
   - Select "Submitted" status
   - **Expected**: Only submitted requests shown

**Validation Points:**
- ✅ All submitted requests visible
- ✅ Requests sorted by date (newest first)
- ✅ Search works correctly
- ✅ Status filter functional
- ✅ Pagination works (if applicable)

**API Endpoints Tested:**
- `GET /api/v1/lab/requests?search=...&status=...`

---

### Test Flow 2.4: View Request Detail

**Steps:**

1. **Open Request Detail**
   - Click "View" button on a submitted request
   - URL: `/lab-requests/{id}`

2. **Verify Request Information**
   - **Request Details**: Request No, Date, Customer, Requester, Objective
   - **Customer Information**: Company name, contact details
   - **Samples Table**: All samples with details
   - **Lab Tests Section**: Tests created for each sample (if acknowledged)
   - **Actions**: "Acknowledge Samples" button (if not acknowledged)

**Validation Points:**
- ✅ All request info displayed
- ✅ Customer details visible
- ✅ Samples table complete
- ✅ Appropriate action buttons shown based on status

**API Endpoints Tested:**
- `GET /api/v1/lab/requests/:id`

---

### Test Flow 2.5: Acknowledge Sample Receipt

**Steps:**

1. **Navigate to Acknowledge Page**
   - From request detail, click "Acknowledge Samples"
   - URL: `/lab-requests/{id}/acknowledge`

2. **Review Samples**
   - List of all samples to acknowledge
   - For each sample:
     - Customer Sample ID
     - Animal Type
     - Specimen
     - Requested Quantity
     - **Received Quantity** (editable field)
     - Status

3. **Enter Received Quantities**
   - **Sample 1**:
     - Requested: 5 mL
     - Received: Enter `4.5` mL (quantity discrepancy)
     - Notes: `Slight volume loss during transport`
   - **Sample 2**:
     - Requested: 1 piece
     - Received: Enter `1` piece
     - Notes: `Sample received in good condition`

4. **Acknowledge Receipt**
   - Click "Acknowledge Receipt" button
   - **Expected**: Confirmation dialog
   - Confirm acknowledgment
   - **Expected**: Success toast
   - **Expected**: Redirect to request detail
   - **Expected**: Status changed to "RECEIVED_SAMPLES"

5. **Verify Lab Tests Created**
   - Return to request detail page
   - **Expected**: Lab tests automatically created for each sample
   - **Expected**: Tests assigned to technician or unassigned
   - **Expected**: "Enter Results" button visible

**Validation Points:**
- ✅ Acknowledgment form displays all samples
- ✅ Can modify received quantities
- ✅ Can add notes per sample
- ✅ Quantity discrepancies recorded
- ✅ Status updated to RECEIVED_SAMPLES
- ✅ Lab tests auto-generated from samples
- ✅ Cannot acknowledge twice

**API Endpoints Tested:**
- `POST /api/v1/lab/requests/:id/acknowledge`

**Database Verification:**
```sql
-- Verify samples acknowledged
SELECT customer_sample_id, requested_qty, received_qty, current_status
FROM test_request_samples
WHERE test_request_id = '{request_id}';

-- Expected: received_qty filled, current_status = 'RECEIVED'

-- Verify lab tests created
SELECT * FROM lab_tests WHERE test_request_sample_id IN (
  SELECT id FROM test_request_samples WHERE test_request_id = '{request_id}'
);

-- Expected: Lab tests created for each sample
```

---

### Test Flow 2.6: View My Assigned Tests

**Steps:**

1. **Navigate to My Tests**
   - Click "My Assigned Tests" in navigation
   - URL: `/lab/my-tests`

2. **Verify Assigned Tests Table**
   - **Columns**:
     - Case No (if assigned)
     - Test Panel
     - Sample ID
     - Request No
     - Status
     - Actions (Enter Results)

3. **Test Status Filter**
   - Select "PENDING" status
   - **Expected**: Only pending tests shown
   - Select "COMPLETED"
   - **Expected**: Only completed tests shown

4. **Test Search**
   - Type request number or sample ID
   - **Expected**: Matching tests displayed

**Validation Points:**
- ✅ Only tests assigned to logged-in technician shown
- ✅ Status filter works
- ✅ Search functional
- ✅ "Enter Results" button visible for pending tests

**API Endpoints Tested:**
- `GET /api/v1/lab/my-tests?status=...&search=...`

---

### Test Flow 2.7: Enter Test Results

**Steps:**

1. **Navigate to Results Entry**
   - From "My Assigned Tests", click "Enter Results" for a test
   - OR from request detail, click "Enter Results" for a lab test
   - URL: `/lab-requests/{requestId}/results?testId={testId}`

2. **Verify Test Information**
   - Test Panel name
   - Sample ID
   - Request No
   - Customer name

3. **Enter Result Parameters**
   - **For CBC Panel Example**:
     - **Parameter 1**: `WBC (White Blood Cells)`
       - Value: `8.5`
       - Unit: `10^3/μL`
       - Reference Range: `6.0-17.0`
       - Is Abnormal: `No`
     - **Parameter 2**: `RBC (Red Blood Cells)`
       - Value: `5.2`
       - Unit: `10^6/μL`
       - Reference Range: `5.5-8.5`
       - Is Abnormal: `Yes` (below range)
       - Notes: `Slightly below normal range`
     - **Parameter 3**: `Hemoglobin`
       - Value: `14.0`
       - Unit: `g/dL`
       - Reference Range: `12.0-18.0`
       - Is Abnormal: `No`

4. **Upload Result Attachments**
   - Click "Upload Files" button
   - Select result document (PDF report)
   - **Expected**: File uploaded successfully
   - **Expected**: File name displayed with remove option

5. **Add General Notes**
   - Enter notes: `All tests completed successfully. No equipment issues.`

6. **Save Results**
   - Click "Save Results" button
   - **Expected**: Loading indicator
   - **Expected**: Success toast
   - **Expected**: Redirect to request detail
   - **Expected**: Test status changed to "COMPLETED"

**Validation Points:**
- ✅ Result entry form loads correctly
- ✅ Can add multiple result parameters dynamically
- ✅ Can mark parameters as abnormal
- ✅ File upload works for attachments
- ✅ Results saved to database
- ✅ Test status updated to COMPLETED
- ✅ Results visible in request detail
- ✅ Cannot modify results after submission (optional: allow editing before doctor approval)

**API Endpoints Tested:**
- `POST /api/v1/lab/results`

**Database Verification:**
```sql
-- Verify lab results created
SELECT parameter, value, unit, is_abnormal
FROM lab_results
WHERE lab_test_id = '{test_id}';

-- Expected: All result parameters saved

-- Verify test status updated
SELECT lab_result_status FROM lab_tests WHERE id = '{test_id}';

-- Expected: lab_result_status = 'COMPLETED'
```

---

### Test Flow 2.8: Submit Results for Doctor Approval

**Steps:**

1. **Prerequisites**
   - All lab tests for a request must have results entered
   - Test results completed

2. **Navigate to Request Detail**
   - URL: `/lab-requests/{id}`

3. **Verify All Tests Completed**
   - Check that all lab tests have status "COMPLETED"
   - **Expected**: "Submit for Approval" button visible

4. **Submit for Doctor Approval**
   - Click "Submit for Doctor Approval" button
   - **Expected**: Confirmation dialog
   - Dialog message: "Submit all results to doctor for approval?"
   - Click "Confirm"
   - **Expected**: Success toast
   - **Expected**: Request status changed to "REVIEWED_BY_DOCTOR" or "READY_FOR_APPROVAL"
   - **Expected**: Doctor notified (if email service enabled)

5. **Verify Submission**
   - Request status badge updated
   - "Submit for Approval" button no longer visible
   - Doctor can now see request in pending approvals

**Validation Points:**
- ✅ Submit button only enabled when all tests completed
- ✅ Confirmation required before submission
- ✅ Request status updated
- ✅ Lab internal status changed
- ✅ Doctor receives notification
- ✅ Request visible in doctor's pending queue

**API Endpoints Tested:**
- `POST /api/v1/lab/requests/:id/submit-for-approval`

**Database Verification:**
```sql
-- Verify request status changed
SELECT document_status, lab_internal_status
FROM test_requests
WHERE id = '{request_id}';

-- Expected: document_status = 'RESULT_READY', lab_internal_status = 'READY_FOR_APPROVAL'
```

---

### Test Flow 2.9: View Samples List

**Steps:**

1. **Navigate to Samples Page**
   - Click "Samples" in navigation
   - URL: `/lab/samples`

2. **Verify Samples Table**
   - **Columns**:
     - Sample ID
     - Request No
     - Customer Name
     - Animal Type
     - Specimen
     - Quantity
     - Status
     - Storage Location (if assigned)
     - Lab Tests Count

3. **Test Search**
   - Type sample ID in search
   - **Expected**: Matching samples displayed

4. **Test Status Filter**
   - Select "RECEIVED" status
   - **Expected**: Only received samples shown
   - Select "IN_TESTING"
   - **Expected**: Only samples currently being tested shown

5. **Test Pagination**
   - Navigate through pages (if applicable)
   - **Expected**: Pagination works correctly

**Validation Points:**
- ✅ All samples across all requests visible
- ✅ Search works for sample ID, request number, customer name
- ✅ Status filter functional
- ✅ Lab tests count accurate
- ✅ Storage location displayed (if assigned)

**API Endpoints Tested:**
- `GET /api/v1/lab/samples?search=...&status=...&page=...`

---

## 3. DOCTOR Role Test Flow

### Test Objective
Verify doctor can view pending approvals, review test results, and approve or reject requests with reasons.

### Prerequisites
- Technician has submitted at least one request for approval
- Doctor account exists: `doctor@starlab.com` / `password`

---

### Test Flow 3.1: Doctor Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Doctor Credentials**
   - Email: `doctor@starlab.com`
   - Password: `password`

3. **Submit Login**
   - **Expected**: Redirect to doctor dashboard `/dashboard` (doctor version)

4. **Verify Navigation**
   - Menu items:
     - Dashboard
     - Pending Approvals
     - Approved Requests
     - Workload
     - Profile
     - Logout

**Validation Points:**
- ✅ Login successful
- ✅ Redirected to doctor dashboard
- ✅ Doctor role menu displayed
- ✅ Cannot access customer or lab pages

**API Endpoints Tested:**
- `POST /api/v1/auth/login`

---

### Test Flow 3.2: View Doctor Dashboard

**Steps:**

1. **Dashboard Loads**
   - URL: `/dashboard` (doctor view)

2. **Verify Statistics Cards**
   - **Pending Approvals**: Count of requests awaiting approval
   - **Approved Today**: Count of approvals today
   - **Rejected Today**: Count of rejections today
   - **Total Reviews**: Total requests reviewed

3. **Verify Quick Actions**
   - "View Pending Approvals" button
   - "Check Workload" button

4. **Verify Recent Activity**
   - Recently reviewed requests listed
   - Status and dates displayed

**Validation Points:**
- ✅ Statistics accurate
- ✅ Quick actions work
- ✅ Recent activity populated
- ✅ No access errors

**API Endpoints Tested:**
- `GET /api/v1/doctors/dashboard/statistics`
- `GET /api/v1/doctors/recent-approvals`

---

### Test Flow 3.3: View Pending Approvals

**Steps:**

1. **Navigate to Pending Approvals**
   - Click "Pending Approvals" in navigation
   - URL: `/pending-approvals`

2. **Verify Pending Requests Table**
   - **Columns**:
     - Request No
     - Customer Name
     - Submission Date
     - Number of Tests
     - Status
     - Actions (Review button)
   - **Data**: All requests with status "RESULT_READY" or "READY_FOR_APPROVAL"

3. **Test Search**
   - Type request number or customer name
   - **Expected**: Matching requests displayed

4. **Test Sorting**
   - Click column headers to sort
   - **Expected**: Table sorts by selected column

**Validation Points:**
- ✅ All pending requests visible
- ✅ Only requests ready for approval shown
- ✅ Search functional
- ✅ Sorting works
- ✅ Review button enabled

**API Endpoints Tested:**
- `GET /api/v1/doctors/pending-approvals`

---

### Test Flow 3.4: Review Test Results

**Steps:**

1. **Open Request for Review**
   - From pending approvals, click "Review" button
   - URL: `/requests/{id}` (doctor view with approval actions)

2. **Verify Request Information**
   - **Request Details**: Request No, Customer, Date, Objective
   - **Customer Information**: Company details
   - **Samples Section**: All samples with test details

3. **Review Test Results**
   - For each lab test:
     - **Test Panel**: Panel name
     - **Status**: COMPLETED
     - **Results Table**:
       - Parameter
       - Value
       - Unit
       - Reference Range
       - Is Abnormal (highlighted if yes)
       - Notes
     - **Attachments**: Download links for result files

4. **Check for Abnormal Results**
   - Abnormal results highlighted in red or with warning icon
   - Review notes for abnormal results

5. **Download Result Files**
   - Click "Download" button for attachments
   - **Expected**: PDF or Excel file downloads
   - Open and review file
   - **Expected**: File contains detailed lab results

**Validation Points:**
- ✅ All test results displayed clearly
- ✅ Abnormal results highlighted
- ✅ Result attachments downloadable
- ✅ All test information complete
- ✅ Customer and sample info visible for context

**API Endpoints Tested:**
- `GET /api/v1/doctors/requests/:id`

---

### Test Flow 3.5: Approve Test Request

**Steps:**

1. **Prerequisites**
   - Reviewed all test results
   - Results are satisfactory

2. **Initiate Approval**
   - Click "Approve" button
   - **Expected**: Approval confirmation dialog appears

3. **Confirmation Dialog**
   - Dialog message: "Are you sure you want to approve this request?"
   - Shows request number and customer name
   - Optional field: "Approval Notes" (comments)
   - Actions: "Cancel" and "Approve" buttons

4. **Add Approval Notes** (Optional)
   - Enter notes: `All test results reviewed and approved. No concerns identified.`

5. **Confirm Approval**
   - Click "Approve" button
   - **Expected**: Loading indicator
   - **Expected**: Success toast: "Request approved successfully"
   - **Expected**: Redirect to pending approvals list
   - **Expected**: Request removed from pending list
   - **Expected**: Customer notified (if email enabled)
   - **Expected**: Invoice auto-generated

6. **Verify Approval**
   - Navigate to "Approved Requests" page
   - **Expected**: Newly approved request visible
   - **Status**: "APPROVED"
   - **Approved By**: Doctor's name
   - **Approved Date**: Current date/time

**Validation Points:**
- ✅ Approval dialog requires confirmation
- ✅ Can add approval notes
- ✅ Request status changed to APPROVED
- ✅ Approval timestamp recorded
- ✅ Doctor ID recorded as approver
- ✅ Customer receives notification
- ✅ Invoice auto-generated for request
- ✅ Request no longer in pending queue

**API Endpoints Tested:**
- `POST /api/v1/doctors/approve/:requestId`

**Database Verification:**
```sql
-- Verify approval
SELECT document_status, lab_internal_status, approved_at, approved_by_id
FROM test_requests
WHERE id = '{request_id}';

-- Expected: document_status = 'APPROVED', approved_at = timestamp, approved_by_id = doctor's user_id

-- Verify invoice created
SELECT * FROM invoices WHERE test_request_id = '{request_id}';

-- Expected: Invoice record exists
```

---

### Test Flow 3.6: Reject Test Request

**Steps:**

1. **Prerequisites**
   - Reviewed test results
   - Found issues requiring rejection (e.g., incomplete data, errors)

2. **Initiate Rejection**
   - Click "Reject" button
   - **Expected**: Rejection dialog appears

3. **Rejection Dialog**
   - Dialog message: "Please provide a reason for rejection"
   - **Required field**: "Rejection Reason" (textarea)
   - Actions: "Cancel" and "Reject" buttons

4. **Enter Rejection Reason**
   - Type reason: `Insufficient sample quality for accurate testing. Please resubmit with fresh samples. WBC count inconsistent with sample condition.`
   - **Note**: Rejection reason is REQUIRED

5. **Confirm Rejection**
   - Click "Reject" button
   - **Expected**: Validation - reason must be provided
   - **Expected**: Loading indicator
   - **Expected**: Success toast: "Request rejected"
   - **Expected**: Redirect to pending approvals
   - **Expected**: Request removed from pending
   - **Expected**: Customer notified with rejection reason
   - **Expected**: Lab staff notified

6. **Verify Rejection**
   - Check request detail page
   - **Status**: "REJECTED"
   - **Rejection Reason**: Displayed clearly
   - **Rejected By**: Doctor's name
   - **Rejected Date**: Current date/time
   - **Expected**: No invoice generated

**Validation Points:**
- ✅ Rejection requires reason (validation enforced)
- ✅ Rejection reason field is required
- ✅ Cannot reject without reason
- ✅ Request status changed to REJECTED
- ✅ Rejection timestamp and doctor ID recorded
- ✅ Rejection reason stored and visible
- ✅ Customer notified with reason
- ✅ Request removed from pending approvals
- ✅ No invoice created for rejected requests

**API Endpoints Tested:**
- `POST /api/v1/doctors/reject/:requestId`

**Database Verification:**
```sql
-- Verify rejection
SELECT document_status, rejected_at, rejection_reason
FROM test_requests
WHERE id = '{request_id}';

-- Expected: document_status = 'REJECTED', rejected_at = timestamp, rejection_reason = provided reason

-- Verify no invoice created
SELECT * FROM invoices WHERE test_request_id = '{request_id}';

-- Expected: 0 rows (no invoice for rejected requests)
```

---

### Test Flow 3.7: View Doctor Workload

**Steps:**

1. **Navigate to Workload Page**
   - Click "Workload" in navigation
   - URL: `/workload`

2. **Verify Workload Statistics**
   - **Total Assigned**: Count of all requests assigned to doctor
   - **Pending Review**: Count awaiting approval
   - **Approved This Week**: Weekly approval count
   - **Rejected This Week**: Weekly rejection count
   - **Average Review Time**: Average time from submission to approval

3. **Verify Workload Chart**
   - Chart showing approvals/rejections over time
   - Weekly or monthly breakdown
   - Visual representation of workload trends

4. **Verify Assigned Requests Table**
   - List of all requests assigned to doctor
   - Columns: Request No, Customer, Status, Assigned Date, Review Date
   - Filter by status: Pending, Approved, Rejected

**Validation Points:**
- ✅ Workload statistics accurate
- ✅ Chart displays correctly
- ✅ Assigned requests list complete
- ✅ Filter works
- ✅ Average review time calculated correctly

**API Endpoints Tested:**
- `GET /api/v1/doctors/workload`
- `GET /api/v1/doctors/profile/test-requests`

---

## 4. LAB_ADMIN Role Test Flow

### Test Objective
Verify lab admin can oversee all lab operations, manage requests, assign doctors, and access all lab data.

### Prerequisites
- Lab admin account exists: `labadmin@starlab.com` / `password`
- Various requests in different statuses exist

---

### Test Flow 4.1: Lab Admin Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Lab Admin Credentials**
   - Email: `labadmin@starlab.com`
   - Password: `password`

3. **Submit Login**
   - **Expected**: Redirect to admin dashboard

4. **Verify Navigation**
   - Menu items:
     - Dashboard
     - All Requests
     - Lab Operations
     - Doctor Management
     - Customer Management
     - Reports
     - Profile
     - Logout

**Validation Points:**
- ✅ Login successful
- ✅ Admin dashboard accessible
- ✅ Full navigation menu visible
- ✅ Can access all sections

**API Endpoints Tested:**
- `POST /api/v1/auth/login`

---

### Test Flow 4.2: View All Test Requests

**Steps:**

1. **Navigate to All Requests**
   - URL: `/admin/requests` or similar

2. **Verify All Requests Table**
   - **Columns**:
     - Request No
     - Customer Name
     - Request Date
     - Document Status
     - Lab Status
     - Assigned Doctor (if any)
     - Actions (View, Assign, Edit)

3. **Verify Can See All Requests**
   - **Expected**: All requests from all customers visible
   - Unlike customers who see only their own
   - Unlike doctors who see only assigned requests

4. **Test Advanced Search**
   - Search by:
     - Request number
     - Customer name
     - Date range
     - Status
   - **Expected**: Filtering works correctly

5. **Test Status Filters**
   - Filter by document status: DRAFT, SUBMITTED, APPROVED, REJECTED
   - Filter by lab status: RECEIVED_SAMPLES, IN_PROGRESS, COMPLETED
   - **Expected**: Multiple filters can be applied

**Validation Points:**
- ✅ Can view all requests (not limited to own)
- ✅ Search and filter very flexible
- ✅ Both customer view and lab view status visible
- ✅ Can see assigned doctors
- ✅ Action buttons appropriate for admin role

**API Endpoints Tested:**
- `GET /api/v1/lab/requests` (admin access)

---

### Test Flow 4.3: Assign Doctor to Request

**Steps:**

1. **Open Request Detail**
   - Select a request without assigned doctor
   - URL: `/admin/requests/{id}`

2. **Verify Doctor Assignment Section**
   - "Assign Doctor" button visible
   - Current assigned doctor: "Not assigned"

3. **Click Assign Doctor**
   - Click "Assign Doctor" button
   - **Expected**: Doctor selection dialog appears

4. **Select Doctor**
   - Dialog shows list of doctors:
     - Name
     - Email
     - Current workload (pending approvals)
   - Select doctor with lowest workload
   - Click "Assign"

5. **Confirm Assignment**
   - **Expected**: Success toast
   - **Expected**: Doctor assigned field updated
   - **Expected**: Doctor notified (if email enabled)
   - **Expected**: Request visible in doctor's pending queue

6. **Verify Assignment**
   - Refresh page
   - **Expected**: Assigned doctor name displayed
   - **Expected**: Cannot assign different doctor without unassigning first

**Validation Points:**
- ✅ Can assign any doctor to any request
- ✅ Doctor workload visible when selecting
- ✅ Assignment recorded in database
- ✅ Doctor receives notification
- ✅ Request appears in doctor's queue
- ✅ Can reassign if needed (with confirmation)

**API Endpoints Tested:**
- `POST /api/v1/doctors/assign-test-request`
- `GET /api/v1/doctors` (list doctors with workload)

**Database Verification:**
```sql
-- Verify doctor assigned
SELECT doctor_id FROM test_requests WHERE id = '{request_id}';

-- Expected: doctor_id = selected doctor's ID
```

---

### Test Flow 4.4: View Customer Management

**Steps:**

1. **Navigate to Customers**
   - URL: `/admin/customers`

2. **Verify Customers Table**
   - **Columns**:
     - Company Name
     - Tax ID
     - Operator Name
     - Email
     - Phone
     - Registration Date
     - Status (Active/Inactive)
     - Actions (View, Edit)

3. **View Customer Details**
   - Click "View" for a customer
   - **Expected**: Modal or page with all customer information
     - Company details
     - Operator information
     - Contact details
     - Registration documents
     - Request history

4. **Test Search**
   - Search by company name
   - Search by tax ID
   - **Expected**: Matching customers displayed

5. **Test Status Filter**
   - Filter by "Active"
   - Filter by "Inactive"
   - **Expected**: Filter works

**Validation Points:**
- ✅ All customers visible (all companies)
- ✅ Customer details accessible
- ✅ Registration documents viewable
- ✅ Request history linked
- ✅ Search and filter functional

**API Endpoints Tested:**
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`

---

### Test Flow 4.5: View Lab Operations Dashboard

**Steps:**

1. **Navigate to Lab Operations**
   - URL: `/admin/lab-operations`

2. **Verify Real-Time Metrics**
   - **Samples Received Today**: Count
   - **Tests In Progress**: Count
   - **Tests Completed Today**: Count
   - **Pending Doctor Approvals**: Count
   - **Average Processing Time**: Duration

3. **Verify Technician Workload**
   - Table showing each technician:
     - Name
     - Assigned Tests
     - Completed Today
     - Pending Tests
     - Status (Available, Busy)

4. **Verify Equipment Status** (if implemented)
   - List of lab equipment
   - Status: Operational, Maintenance, Out of Service

5. **Verify Recent Activity Log**
   - Recent actions by lab staff
   - Timestamps and user names

**Validation Points:**
- ✅ Real-time metrics accurate
- ✅ Technician workload balanced
- ✅ Activity log comprehensive
- ✅ Dashboard refreshes automatically (optional)

**API Endpoints Tested:**
- `GET /api/v1/lab/operations/dashboard`
- `GET /api/v1/lab/technicians/workload`

---

### Test Flow 4.6: Generate Reports

**Steps:**

1. **Navigate to Reports**
   - URL: `/admin/reports`

2. **Select Report Type**
   - Options:
     - Requests Summary Report (by date range)
     - Revenue Report (invoices by period)
     - Technician Performance Report
     - Doctor Approval Time Report
     - Sample Throughput Report

3. **Generate Requests Summary Report**
   - **Date Range**: Select last 30 days
   - **Grouping**: By status
   - Click "Generate Report"
   - **Expected**: Report displayed with:
     - Total requests
     - Breakdown by status
     - Charts/graphs
     - Export to PDF/Excel button

4. **Export Report**
   - Click "Export to PDF"
   - **Expected**: PDF download starts
   - Open PDF
   - **Expected**: Professional report with charts and data

**Validation Points:**
- ✅ Various report types available
- ✅ Date range filtering works
- ✅ Reports accurate
- ✅ Charts/graphs render correctly
- ✅ Export functionality works
- ✅ Reports formatted professionally

**API Endpoints Tested:**
- `GET /api/v1/admin/reports/requests-summary`
- `GET /api/v1/admin/reports/export/pdf`

---

## 5. ADMIN Role Test Flow

### Test Objective
Verify system admin can manage all users, access system settings, and oversee entire system.

### Prerequisites
- Admin account exists: `admin@starlab.com` / `password`

---

### Test Flow 5.1: Admin Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Admin Credentials**
   - Email: `admin@starlab.com`
   - Password: `password`

3. **Submit Login**
   - **Expected**: Redirect to admin dashboard `/admin-dashboard`

4. **Verify Full Access Navigation**
   - Menu items:
     - Admin Dashboard
     - User Management
     - Customer Management
     - Lab Operations
     - Invoices
     - System Settings
     - Audit Logs
     - Profile
     - Logout

**Validation Points:**
- ✅ Login successful
- ✅ Admin-specific dashboard
- ✅ Full navigation menu
- ✅ Can access all system areas

**API Endpoints Tested:**
- `POST /api/v1/auth/login`

---

### Test Flow 5.2: View Admin Dashboard

**Steps:**

1. **Dashboard Loads**
   - URL: `/admin-dashboard`

2. **Verify System-Wide Metrics**
   - **Total Users**: All users across all roles
   - **Total Customers**: Customer count
   - **Total Requests**: All test requests
   - **Total Invoices**: All invoices
   - **System Health**: Server status, database connections

3. **Verify Recent Activity**
   - System-wide recent actions
   - User logins
   - Critical events

**Validation Points:**
- ✅ System-wide metrics displayed
- ✅ Metrics accurate
- ✅ Recent activity comprehensive
- ✅ No access restrictions

**API Endpoints Tested:**
- `GET /api/v1/admin/dashboard`

---

### Test Flow 5.3: User Management - Create User

**Steps:**

1. **Navigate to User Management**
   - URL: `/users`

2. **Click Create User**
   - Click "Create User" button
   - **Expected**: Create user dialog/modal appears

3. **Fill User Details**
   - **Email**: `newtech@starlab.com`
   - **Password**: `NewTech123!`
   - **Confirm Password**: `NewTech123!`
   - **Role**: Select "TECHNICIAN" from dropdown
   - **First Name**: `New`
   - **Last Name**: `Technician`
   - **Phone**: `081-555-1234`

4. **Submit Creation**
   - Click "Create User" button
   - **Expected**: Validation passes
   - **Expected**: Success toast
   - **Expected**: Dialog closes
   - **Expected**: New user appears in users table

5. **Verify New User**
   - Search for `newtech@starlab.com`
   - **Expected**: User found
   - **Role**: TECHNICIAN
   - **Status**: Active

**Validation Points:**
- ✅ Create user form validation works
- ✅ Can create users of any role
- ✅ Password hashing applied
- ✅ Email uniqueness enforced
- ✅ User appears immediately in list
- ✅ New user can login

**API Endpoints Tested:**
- `POST /api/v1/admin/users`

**Database Verification:**
```sql
-- Verify user created
SELECT email, role, is_email_confirmed FROM users WHERE email = 'newtech@starlab.com';

-- Expected: User exists with role = 'TECHNICIAN'

-- Verify user profile created (for non-CUSTOMER roles)
SELECT * FROM user_profiles WHERE user_id = (
  SELECT id FROM users WHERE email = 'newtech@starlab.com'
);

-- Expected: User profile exists
```

---

### Test Flow 5.4: User Management - Edit User

**Steps:**

1. **Select User to Edit**
   - From users table, click "Edit" for a user
   - **Expected**: Edit user dialog appears with pre-filled data

2. **Modify User Details**
   - Change **First Name**: `UpdatedName`
   - Change **Phone**: `081-999-9999`
   - Change **Role**: Change from TECHNICIAN to LAB_ADMIN (if applicable)

3. **Save Changes**
   - Click "Save Changes"
   - **Expected**: Validation passes
   - **Expected**: Success toast
   - **Expected**: Dialog closes
   - **Expected**: Changes reflected in table

4. **Verify Changes Persisted**
   - Refresh page
   - **Expected**: Updated information still displayed
   - User logs in
   - **Expected**: New role takes effect immediately

**Validation Points:**
- ✅ Edit form pre-populated correctly
- ✅ Can modify all fields
- ✅ Can change user role
- ✅ Changes saved to database
- ✅ Role change takes effect immediately
- ✅ Cannot change email (or requires confirmation)

**API Endpoints Tested:**
- `PUT /api/v1/admin/users/:id`

---

### Test Flow 5.5: User Management - Deactivate User

**Steps:**

1. **Select User to Deactivate**
   - From users table, find an active user
   - Click "Deactivate" or toggle status button

2. **Confirm Deactivation**
   - **Expected**: Confirmation dialog appears
   - Dialog message: "Deactivate this user? They will not be able to log in."
   - Click "Confirm"

3. **Verify Deactivation**
   - **Expected**: Success toast
   - **Expected**: User status changed to "Inactive"
   - **Expected**: User row styled differently (grayed out)

4. **Test Login Disabled**
   - Logout
   - Attempt to login as deactivated user
   - **Expected**: Login fails with "Account inactive" message

5. **Reactivate User**
   - Login as admin
   - Navigate to user management
   - Click "Activate" button for deactivated user
   - **Expected**: User reactivated
   - **Expected**: User can login again

**Validation Points:**
- ✅ Deactivation requires confirmation
- ✅ Deactivated users cannot login
- ✅ Status displayed clearly
- ✅ Can reactivate users
- ✅ Cannot delete users (soft delete only)

**API Endpoints Tested:**
- `PATCH /api/v1/admin/users/:id/deactivate`
- `PATCH /api/v1/admin/users/:id/activate`

---

### Test Flow 5.6: Invoice Management - Search and Filter

**Steps:**

1. **Navigate to Invoices**
   - URL: `/admin/invoices`

2. **Verify All Invoices Visible**
   - **Expected**: All invoices from all customers displayed
   - **Columns**:
     - Invoice No
     - Request No
     - Customer Name
     - Invoice Date
     - Amount
     - Payment Status
     - Actions (View, Mark Paid, Download)

3. **Test Search Functionality**
   - **Search by Invoice Number**:
     - Type invoice number
     - **Expected**: Matching invoices displayed
   - **Search by Customer Name**:
     - Type customer name
     - **Expected**: Customer's invoices shown
   - **Search by Request Number**:
     - Type request number
     - **Expected**: Associated invoice displayed

4. **Test Status Filter**
   - Select "PENDING"
   - **Expected**: Only pending invoices shown
   - Select "PAID"
   - **Expected**: Only paid invoices shown
   - Select "OVERDUE"
   - **Expected**: Only overdue invoices shown

5. **Test Date Range Filter**
   - Select date range: Last 30 days
   - **Expected**: Only invoices within range displayed

6. **Test Combined Filters**
   - Search: Customer name
   - Status: PENDING
   - Date: Last week
   - **Expected**: Filters combined correctly

**Validation Points:**
- ✅ All invoices accessible (not limited to own)
- ✅ Search works for invoice no, customer, request
- ✅ Status filter functional
- ✅ Date range filter works
- ✅ Multiple filters can be combined
- ✅ Pagination works (if applicable)

**API Endpoints Tested:**
- `GET /api/v1/invoices?search=...&paymentStatus=...&dateFrom=...&dateTo=...`

---

### Test Flow 5.7: Invoice Management - Mark as Paid

**Steps:**

1. **Select Pending Invoice**
   - From invoices list, find invoice with status "WAITING_VERIFICATION"
   - (Customer uploaded payment slip)

2. **View Payment Slip**
   - Click "View" to see invoice detail
   - **Expected**: Payment slip image/PDF displayed
   - Download and verify payment slip
   - **Expected**: Payment slip is valid

3. **Mark Invoice as Paid**
   - Click "Mark as Paid" button
   - **Expected**: Confirmation dialog appears
   - Dialog shows:
     - Invoice amount
     - Payment slip preview
     - Confirmation message
   - Click "Confirm"

4. **Verify Payment Status Updated**
   - **Expected**: Success toast
   - **Expected**: Payment status changed to "PAID"
   - **Expected**: Badge color changed to green
   - **Expected**: "Mark as Paid" button no longer visible

5. **Verify in Customer Portal**
   - Login as customer
   - View the invoice
   - **Expected**: Status shows "PAID"
   - **Expected**: No upload payment slip section

**Validation Points:**
- ✅ Can view all pending invoices
- ✅ Payment slip accessible
- ✅ Marking as paid requires confirmation
- ✅ Status updated correctly
- ✅ Change visible to customer immediately
- ✅ Audit trail logged (if enabled)

**API Endpoints Tested:**
- `PATCH /api/v1/invoices/:id/mark-paid`

**Database Verification:**
```sql
-- Verify payment status updated
SELECT payment_status FROM invoices WHERE id = '{invoice_id}';

-- Expected: payment_status = 'PAID'
```

---

### Test Flow 5.8: Audit Logs

**Steps:**

1. **Navigate to Audit Logs**
   - URL: `/admin/audit`

2. **Verify Audit Trail Table**
   - **Columns**:
     - Timestamp
     - User
     - Action
     - Entity Type
     - Entity ID
     - Details
   - **Data**: All system actions logged

3. **Test Filters**
   - **Filter by User**: Select specific user
     - **Expected**: Only actions by that user shown
   - **Filter by Action**: Select "CREATE_TEST_REQUEST"
     - **Expected**: Only test request creations shown
   - **Filter by Entity Type**: Select "TestRequest"
     - **Expected**: Only actions on test requests shown
   - **Filter by Date Range**: Last 7 days
     - **Expected**: Only recent actions shown

4. **View Action Details**
   - Click "View Details" for an action
   - **Expected**: Modal shows:
     - Full request details (method, URL, statusCode)
     - User info (userId, email, role, IP, userAgent)
     - Timestamp
     - Any metadata

5. **Test Search**
   - Search by entity ID (e.g., request ID)
   - **Expected**: All actions related to that entity shown

**Validation Points:**
- ✅ All system actions logged
- ✅ User info captured correctly
- ✅ Timestamps accurate
- ✅ Filters work correctly
- ✅ Details view comprehensive
- ✅ Search functional

**API Endpoints Tested:**
- `GET /api/v1/audit?userId=...&action=...&entityType=...&dateFrom=...&dateTo=...`

---

### Test Flow 5.9: System Settings

**Steps:**

1. **Navigate to System Settings**
   - URL: `/admin/settings`

2. **Verify Settings Categories**
   - **Email Settings**:
     - SMTP configuration
     - Email templates
   - **Invoice Settings**:
     - Tax rate (default 7%)
     - Invoice number format
     - Payment due days
   - **Request Settings**:
     - Request number format
     - Auto-assignment rules
   - **System Settings**:
     - System name
     - Logo
     - Contact information

3. **Update Tax Rate**
   - Current: 7%
   - Change to: 8%
   - Click "Save"
   - **Expected**: Success toast
   - **Expected**: New invoices use 8% tax

4. **Update Email Settings**
   - Change SMTP host, port, credentials
   - Click "Save"
   - **Expected**: Settings saved
   - Test email send
   - **Expected**: Email sent successfully with new config

**Validation Points:**
- ✅ Settings organized by category
- ✅ Can modify all settings
- ✅ Changes take effect immediately
- ✅ Validation prevents invalid settings
- ✅ Settings persisted across restarts

**API Endpoints Tested:**
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`

---

## 6. APPROVAL Role Test Flow

### Test Objective
Verify approval role can perform special approval tasks (if applicable to the system).

### Prerequisites
- Approval account exists: `approval@starlab.com` / `password`

**Note**: Based on the schema, APPROVAL is a defined role but may not have specific workflows implemented beyond what DOCTOR or LAB_ADMIN can do. This section will test basic access and determine role-specific functionality.

---

### Test Flow 6.1: Approval Role Login

**Steps:**

1. **Navigate to Login Page**
   - URL: `http://localhost:3000/login`

2. **Enter Approval Credentials**
   - Email: `approval@starlab.com`
   - Password: `password`

3. **Submit Login**
   - **Expected**: Login successful
   - **Expected**: Redirect to appropriate dashboard

4. **Verify Access**
   - Check navigation menu
   - Determine what pages are accessible
   - **Expected**: Access level between TECHNICIAN and LAB_ADMIN

**Validation Points:**
- ✅ Login works
- ✅ Role-specific menu displayed
- ✅ Access appropriate for approval tasks

---

### Test Flow 6.2: Approval-Specific Workflows

*To be implemented based on specific approval role responsibilities in the system. Possible scenarios:*

- Approving customer registrations
- Approving special requests
- Secondary approval for high-value invoices
- Approving system configuration changes

**If no specific approval workflows implemented, this role may be reserved for future use.**

---

## Cross-Role Integration Tests

### Integration Test 1: Complete Request Lifecycle

**Objective**: Test full workflow from customer submission to doctor approval and payment.

**Participants**: CUSTOMER, TECHNICIAN, DOCTOR, ADMIN

**Steps:**

1. **Customer Submits Request**
   - Login as customer
   - Create and submit test request with 2 samples
   - **Expected**: Request status = SUBMITTED

2. **Lab Technician Acknowledges**
   - Login as technician
   - View submitted request
   - Acknowledge sample receipt (adjust quantity if needed)
   - **Expected**: Status = RECEIVED_SAMPLES
   - **Expected**: Lab tests created

3. **Lab Technician Enters Results**
   - View assigned tests
   - Enter results for all lab tests
   - Upload result attachments
   - Submit for doctor approval
   - **Expected**: Status = RESULT_READY or READY_FOR_APPROVAL

4. **Doctor Reviews and Approves**
   - Login as doctor
   - View pending approvals
   - Review test results
   - Approve request
   - **Expected**: Status = APPROVED
   - **Expected**: Invoice auto-generated

5. **Customer Views Invoice**
   - Login as customer
   - Navigate to invoices
   - View generated invoice
   - **Expected**: Invoice displayed correctly
   - **Expected**: Payment status = PENDING

6. **Customer Uploads Payment**
   - Upload payment slip
   - **Expected**: Payment status = WAITING_VERIFICATION

7. **Admin Verifies Payment**
   - Login as admin
   - View pending invoices
   - Verify payment slip
   - Mark as paid
   - **Expected**: Payment status = PAID

8. **Customer Views Final Status**
   - Login as customer
   - View request detail
   - **Expected**: Status = APPROVED
   - View invoice
   - **Expected**: Status = PAID
   - **Expected**: Can download results

**Validation Points:**
- ✅ Complete lifecycle works end-to-end
- ✅ Status transitions correct at each step
- ✅ Each role can perform their tasks
- ✅ Notifications sent at appropriate steps (if enabled)
- ✅ Data consistent across all views
- ✅ No permissions errors
- ✅ Timeline accurate

---

### Integration Test 2: Rejection and Resubmission Flow

**Objective**: Test rejection workflow and resubmission process.

**Steps:**

1. **Customer Submits Request**
   - Create and submit request

2. **Lab Processing**
   - Technician acknowledges samples
   - Technician enters results

3. **Doctor Rejects**
   - Doctor reviews results
   - Finds issue (e.g., insufficient data quality)
   - Rejects with reason
   - **Expected**: Status = REJECTED
   - **Expected**: Customer notified

4. **Customer Views Rejection**
   - Login as customer
   - View request detail
   - **Expected**: Rejection reason displayed clearly
   - **Expected**: Status badge red "REJECTED"

5. **Customer Creates New Request**
   - Create new request (correcting issues)
   - Submit for processing
   - **Expected**: New request number generated

6. **Normal Approval Flow**
   - Lab processes new request
   - Doctor approves
   - **Expected**: New request approved successfully

**Validation Points:**
- ✅ Rejection workflow works
- ✅ Rejection reason communicated clearly
- ✅ Customer can create new request
- ✅ Original rejected request remains in history
- ✅ No invoice generated for rejected request

---

### Integration Test 3: Multi-Doctor Assignment

**Objective**: Test doctor assignment and workload balancing.

**Steps:**

1. **Admin Creates Multiple Requests**
   - Login as different customers
   - Submit 5 test requests

2. **Lab Processing**
   - Technician processes all requests
   - Submits all for approval

3. **Lab Admin Assigns Doctors**
   - Login as lab admin
   - View pending requests
   - Assign 3 requests to Doctor A
   - Assign 2 requests to Doctor B
   - **Expected**: Assignments successful

4. **Doctor A Views Queue**
   - Login as Doctor A
   - View pending approvals
   - **Expected**: Only 3 assigned requests visible

5. **Doctor B Views Queue**
   - Login as Doctor B
   - View pending approvals
   - **Expected**: Only 2 assigned requests visible

6. **Doctor A Approves 2, Rejects 1**
   - Review and approve 2 requests
   - Reject 1 request with reason
   - **Expected**: Only 2 invoices generated

7. **Doctor B Approves All**
   - Review and approve both requests
   - **Expected**: 2 invoices generated

8. **Verify Workload**
   - Lab admin views workload dashboard
   - **Expected**: Doctor A: 2 approved, 1 rejected
   - **Expected**: Doctor B: 2 approved, 0 rejected

**Validation Points:**
- ✅ Multiple doctors can be assigned
- ✅ Doctors only see their assigned requests
- ✅ Workload tracking accurate
- ✅ Approval/rejection counts correct
- ✅ No cross-contamination of doctor queues

---

### Integration Test 4: Concurrent Access

**Objective**: Test system behavior with multiple users accessing simultaneously.

**Steps:**

1. **Setup**
   - Open 4 browser sessions (or use different browsers)
   - Login as CUSTOMER, TECHNICIAN, DOCTOR, ADMIN simultaneously

2. **Customer Creates Request**
   - Customer creates and submits request
   - **Expected**: Request visible to all roles appropriately

3. **Technician Acknowledges**
   - Technician acknowledges samples
   - Refresh customer view
   - **Expected**: Customer sees updated status

4. **Doctor Assigns Self** (if feature exists)
   - Admin assigns doctor to request
   - Refresh doctor view
   - **Expected**: Doctor sees request in queue

5. **Real-Time Updates Test**
   - Technician enters results
   - Refresh doctor view
   - **Expected**: Results visible immediately

6. **Concurrent Editing Prevention**
   - Two admins attempt to edit same request
   - **Expected**: Conflict prevention or last-write-wins (with warning)

**Validation Points:**
- ✅ System handles concurrent users
- ✅ Data consistency maintained
- ✅ No race conditions
- ✅ Updates visible across sessions (after refresh)
- ✅ No permission errors
- ✅ Performance acceptable

---

## Status Flow Verification

### Customer View Status Flow

**Status Progression:**

```
DRAFT → SUBMITTED → PENDING_PAYMENT → RESULT_READY → APPROVED / REJECTED / CANCELLED
```

**Verification Tests:**

1. **DRAFT Status**
   - **When**: Request saved but not submitted
   - **Actions**: Edit, Delete, Submit
   - **Badge Color**: Gray
   - ✅ Can modify all fields
   - ✅ Can add/remove samples
   - ✅ Not visible to lab staff

2. **SUBMITTED Status**
   - **When**: Customer submits request
   - **Actions**: View only (no edit/delete)
   - **Badge Color**: Blue
   - ✅ Request locked for editing
   - ✅ Visible to lab staff
   - ✅ Awaiting acknowledgment

3. **PENDING_PAYMENT Status**
   - **When**: Lab processing requiring advance payment (if applicable)
   - **Actions**: Upload payment proof
   - **Badge Color**: Yellow
   - ✅ Payment upload section visible
   - ✅ Cannot proceed without payment

4. **RESULT_READY Status**
   - **When**: Results entered, awaiting doctor approval
   - **Actions**: View status, wait for approval
   - **Badge Color**: Purple
   - ✅ Customer notified (optional)
   - ✅ Results not yet visible to customer

5. **APPROVED Status**
   - **When**: Doctor approves request
   - **Actions**: View results, download, view invoice
   - **Badge Color**: Green
   - ✅ Results visible and downloadable
   - ✅ Invoice generated
   - ✅ Can upload payment

6. **REJECTED Status**
   - **When**: Doctor rejects request
   - **Actions**: View rejection reason, create new request
   - **Badge Color**: Red
   - ✅ Rejection reason displayed
   - ✅ No invoice generated
   - ✅ Request marked as final (no further changes)

7. **CANCELLED Status**
   - **When**: Customer or admin cancels request
   - **Actions**: View only
   - **Badge Color**: Gray
   - ✅ Request marked cancelled
   - ✅ No further processing

---

### Lab Internal Status Flow

**Status Progression:**

```
WAITING_APPROVAL_LAB → RECEIVED_SAMPLES → ASSIGNED_TECHNICIAN → IN_PROGRESS → RESULTS_UPLOADED → REVIEWED_BY_DOCTOR → READY_FOR_APPROVAL → COMPLETED
```

**Verification Tests:**

1. **WAITING_APPROVAL_LAB**
   - Customer submitted, awaiting lab acknowledgment
   - ✅ Visible in lab pending list

2. **RECEIVED_SAMPLES**
   - Samples acknowledged by technician
   - ✅ Lab tests created
   - ✅ Quantities recorded

3. **ASSIGNED_TECHNICIAN**
   - Lab tests assigned to specific technician
   - ✅ Visible in technician's "My Tests"

4. **IN_PROGRESS**
   - Technician actively working on tests
   - ✅ Status indicates work in progress

5. **RESULTS_UPLOADED**
   - Technician entered all results
   - ✅ Results saved in database
   - ✅ Attachments uploaded

6. **REVIEWED_BY_DOCTOR** (optional intermediate status)
   - Results submitted for doctor review
   - ✅ Visible in doctor's pending queue

7. **READY_FOR_APPROVAL**
   - All results ready, awaiting doctor decision
   - ✅ Doctor can approve or reject

8. **COMPLETED**
   - Doctor approved, invoice generated
   - ✅ Customer can view results
   - ✅ Workflow complete

---

## Test Checklist

### Pre-Test Setup

- [ ] Backend server running (`pnpm --filter starlab-backend dev`)
- [ ] Frontend server running (`pnpm --filter starlab-frontend dev`)
- [ ] Database running and seeded (`pnpm prisma db seed`)
- [ ] Test accounts available for all roles
- [ ] Test data includes requests in various statuses
- [ ] File upload directories exist and are writable
- [ ] Email service configured (or mocked for testing)

### Role-Based Tests

#### CUSTOMER Role
- [ ] Registration with email verification
- [ ] Login and dashboard access
- [ ] Create draft request
- [ ] Edit draft request
- [ ] Submit request
- [ ] View request details
- [ ] Search and filter requests
- [ ] Delete draft request
- [ ] View invoice list
- [ ] View invoice detail
- [ ] Upload payment slip
- [ ] View and edit profile
- [ ] Change password
- [ ] View approved results
- [ ] Logout

#### TECHNICIAN Role
- [ ] Login and lab dashboard access
- [ ] View lab requests list
- [ ] View request detail
- [ ] Acknowledge sample receipt
- [ ] View assigned tests
- [ ] Enter test results
- [ ] Submit results for approval
- [ ] View samples list

#### DOCTOR Role
- [ ] Login and doctor dashboard access
- [ ] View pending approvals
- [ ] Review test results
- [ ] Approve test request
- [ ] Reject test request with reason
- [ ] View doctor workload

#### LAB_ADMIN Role
- [ ] Login and admin dashboard access
- [ ] View all test requests
- [ ] Assign doctor to request
- [ ] View customer management
- [ ] View lab operations dashboard
- [ ] Generate reports

#### ADMIN Role
- [ ] Login and system admin dashboard
- [ ] Create user (all roles)
- [ ] Edit user
- [ ] Deactivate/activate user
- [ ] Search and filter invoices
- [ ] Mark invoice as paid
- [ ] View audit logs
- [ ] Update system settings

#### APPROVAL Role
- [ ] Login and role verification
- [ ] Approval-specific workflows (TBD)

### Integration Tests
- [ ] Complete request lifecycle (customer → lab → doctor → payment)
- [ ] Rejection and resubmission flow
- [ ] Multi-doctor assignment and workload
- [ ] Concurrent user access

### Status Flow Verification
- [ ] Customer status transitions
- [ ] Lab internal status transitions
- [ ] Status badges display correctly
- [ ] Status-based action buttons

### Cross-Cutting Concerns
- [ ] RBAC working (users cannot access unauthorized pages)
- [ ] Authentication persists across page refreshes
- [ ] Logout clears session correctly
- [ ] Error handling displays user-friendly messages
- [ ] Loading states show during async operations
- [ ] Form validation prevents invalid submissions
- [ ] File uploads work for all file types
- [ ] Search and filter functions performant
- [ ] Pagination works correctly
- [ ] Responsive design on mobile/tablet
- [ ] No console errors on any page
- [ ] API endpoints return correct status codes
- [ ] Database constraints enforced

### Performance Tests
- [ ] Dashboard loads within 2 seconds
- [ ] Search results appear within 1 second
- [ ] File uploads complete successfully (< 5MB files)
- [ ] Can handle 10+ concurrent users
- [ ] No memory leaks in long sessions

### Security Tests
- [ ] Cannot access other users' data
- [ ] Cannot modify other customers' requests
- [ ] Cannot delete requests after submission
- [ ] JWT tokens expire after timeout
- [ ] Passwords hashed in database
- [ ] CSRF protection working (if implemented)
- [ ] XSS protection in place
- [ ] File upload restrictions enforced

---

## Test Data Setup Script

### Database Seed Requirements

**Users:**
```json
[
  {"email": "customer@example.com", "role": "CUSTOMER", "password": "password", "emailConfirmed": true},
  {"email": "tech@starlab.com", "role": "TECHNICIAN", "password": "password"},
  {"email": "doctor@starlab.com", "role": "DOCTOR", "password": "password"},
  {"email": "labadmin@starlab.com", "role": "LAB_ADMIN", "password": "password"},
  {"email": "admin@starlab.com", "role": "ADMIN", "password": "password"},
  {"email": "approval@starlab.com", "role": "APPROVAL", "password": "password"}
]
```

**Companies:**
```json
[
  {"code": "ABC", "nameEn": "ABC Company Ltd", "taxId": "0105123456789"},
  {"code": "XYZ", "nameEn": "XYZ Corporation", "taxId": "0205987654321"}
]
```

**Test Requests (Various Statuses):**
- 2 DRAFT requests (customer can edit/delete)
- 3 SUBMITTED requests (awaiting lab acknowledgment)
- 2 RECEIVED_SAMPLES (acknowledged, results entry in progress)
- 2 RESULT_READY (awaiting doctor approval)
- 3 APPROVED (with results and invoices)
- 1 REJECTED (with rejection reason)

**Invoices:**
- 2 PENDING (no payment yet)
- 2 WAITING_VERIFICATION (payment slip uploaded)
- 2 PAID (payment verified)
- 1 OVERDUE (past due date)

**Samples:**
- Various animal types: Dog, Cat, Bird, Horse, Cow
- Various specimens: Blood, Tissue, Swab, Urine, Feces
- Various panels: CBC, Chemistry, Microbiology, Histopathology
- Various statuses: RECEIVED, IN_TESTING, COMPLETED, CONSUMED

---

## Test Execution Guidelines

### Manual Testing

1. **Start with CUSTOMER flow**
   - Complete all customer test flows first
   - This creates data for other roles to use

2. **Then LAB TECHNICIAN**
   - Process requests created by customer
   - Enter results for review

3. **Then DOCTOR**
   - Approve/reject requests processed by technician

4. **Then ADMIN roles**
   - Verify management functions
   - Test oversight and reporting

5. **Finally, Integration Tests**
   - Test complete workflows across roles
   - Verify data consistency

### Automated Testing (Future)

- Convert these manual tests to automated Playwright or Cypress tests
- Set up CI/CD pipeline to run tests on every commit
- Generate test reports automatically

---

## Bug Reporting Template

When issues are found during testing, report using this format:

**Title**: [Role] Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
- What should happen

**Actual Behavior**:
- What actually happened

**Screenshots/Logs**:
- Attach screenshots or error logs

**Environment**:
- Browser: Chrome/Firefox/Safari
- Device: Desktop/Mobile
- User Role: CUSTOMER/TECHNICIAN/etc.

**Severity**:
- Critical: Blocks workflow
- High: Major feature broken
- Medium: Feature works but has issues
- Low: Minor cosmetic issue

---

## Conclusion

This comprehensive test flow document covers all user roles in the STAR-LAB system:

- **CUSTOMER**: Complete registration through invoice payment
- **TECHNICIAN**: Sample acknowledgment and result entry
- **DOCTOR**: Result review and approval/rejection
- **LAB_ADMIN**: Lab operations oversight and doctor assignment
- **ADMIN**: Complete system administration
- **APPROVAL**: Special approval workflows (TBD)

By following these test flows, you can verify that:
- ✅ All user roles can perform their functions
- ✅ Role-Based Access Control (RBAC) works correctly
- ✅ Status transitions occur as expected
- ✅ Data consistency is maintained across workflows
- ✅ Integration between roles is seamless
- ✅ The system is ready for production deployment

**Next Steps:**
1. Execute all test flows manually
2. Document any bugs or issues found
3. Fix identified issues
4. Re-test affected flows
5. Convert critical tests to automated tests
6. Prepare for production deployment

---

**Last Updated**: 2025-11-28
**Document Version**: 1.0
**Status**: Ready for Testing
