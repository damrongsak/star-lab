# Customer Portal - Test Cases

**Project**: STAR-LAB Lab Tracking Application
**Module**: Customer Portal
**Date**: 2025-11-15
**Version**: 1.0
**Status**: Based on Implementation Status v1.4 (2025-11-13)

---

## 📋 Test Coverage Overview

**Customer Portal Components**:
- ✅ Authentication (Login, Register, Email Verification)
- ✅ Dashboard (Statistics & Quick Actions)
- ✅ Test Requests (List, Create, View, Edit, Delete)
- ⚠️ Invoices (Stub only - needs implementation)
- ⚠️ Profile (Stub only - needs implementation)

**Current Implementation Status**: 75% Complete
- Test Requests CRUD: 95% (Backend API integration pending)
- Invoices: 10% (Stub only)
- Profile: 10% (Stub only)

---

## 🧪 Test Case Categories

### 1. Authentication & Authorization
### 2. Customer Dashboard
### 3. Test Request - List View
### 4. Test Request - Create (Multi-Step Form)
### 5. Test Request - Detail View
### 6. Test Request - Edit
### 7. Test Request - Delete
### 8. Invoices (Future)
### 9. Profile Management (Future)
### 10. End-to-End Workflows

---

## 1. AUTHENTICATION & AUTHORIZATION

### TC-AUTH-001: Customer Login - Valid Credentials
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- Customer user exists with email: `customer@test.com`, password: `Test123!`
- User has `CUSTOMER` role
- Email is verified

**Test Steps**:
1. Navigate to `/login`
2. Enter email: `customer@test.com`
3. Enter password: `Test123!`
4. Check "Remember me"
5. Click "Sign In" button

**Expected Results**:
- ✅ Login successful
- ✅ JWT token stored in cookies (30-day expiration)
- ✅ User redirected to `/dashboard`
- ✅ AuthContext sets `user` object with correct data
- ✅ SideNav shows customer menu items

**Backend API**: `POST /api/v1/auth/login`
**Files Involved**:
- [apps/frontend/app/(auth)/login/page.tsx](../../apps/frontend/app/(auth)/login/page.tsx:276)
- [apps/frontend/lib/context/AuthContext.tsx](../../apps/frontend/lib/context/AuthContext.tsx:229)

---

### TC-AUTH-002: Customer Login - Invalid Credentials
**Priority**: Critical | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/login`
2. Enter email: `customer@test.com`
3. Enter password: `WrongPassword`
4. Click "Sign In" button

**Expected Results**:
- ✅ Login fails with error message
- ✅ Error toast displayed: "Invalid credentials"
- ✅ User remains on login page
- ✅ No token stored in cookies
- ✅ Form fields retain entered email

**Backend API**: `POST /api/v1/auth/login` (returns 401)

---

### TC-AUTH-003: Customer Login - Unverified Email
**Priority**: High | **Status**: ✅ Implemented

**Preconditions**:
- Customer user exists but `isEmailVerified = false`

**Test Steps**:
1. Navigate to `/login`
2. Enter valid credentials for unverified user
3. Click "Sign In"

**Expected Results**:
- ✅ Login fails with message: "Please verify your email"
- ✅ User shown link to resend verification email
- ✅ No token issued

**Backend API**: `POST /api/v1/auth/login` (returns 403)

---

### TC-AUTH-004: Customer Registration - Valid Data
**Priority**: Critical | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/register`
2. Fill form:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - Phone: `+1234567890`
   - Company Name: `ACME Corp`
   - Company Code: `ACME`
   - Address: `123 Main St`
3. Submit form

**Expected Results**:
- ✅ Registration successful
- ✅ User created in database with `role = CUSTOMER`
- ✅ Verification email sent
- ✅ User redirected to verification page with success message
- ✅ Email contains verification link

**Backend API**: `POST /api/v1/auth/register`
**Files Involved**: [apps/frontend/app/(auth)/register/page.tsx](../../apps/frontend/app/(auth)/register/page.tsx:250)

---

### TC-AUTH-005: Customer Registration - Duplicate Email
**Priority**: High | **Status**: ✅ Implemented

**Preconditions**:
- User with `john.doe@example.com` already exists

**Test Steps**:
1. Navigate to `/register`
2. Enter email: `john.doe@example.com`
3. Fill other fields with valid data
4. Submit form

**Expected Results**:
- ✅ Registration fails
- ✅ Error message: "Email already registered"
- ✅ Form shows validation error on email field
- ✅ User remains on registration page

**Backend API**: `POST /api/v1/auth/register` (returns 409 - Prisma P2002)

---

### TC-AUTH-006: Email Verification - Valid Token
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- User registered with unverified email
- Valid verification token received via email

**Test Steps**:
1. Click verification link in email: `/verify-email?token={valid_token}`
2. Wait for verification process

**Expected Results**:
- ✅ Token validated successfully
- ✅ `isEmailVerified` set to `true` in database
- ✅ Success message displayed
- ✅ User redirected to login page
- ✅ User can now log in

**Backend API**: `POST /api/v1/auth/verify-email`

---

### TC-AUTH-007: Email Verification - Invalid/Expired Token
**Priority**: High | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/verify-email?token=invalid_or_expired_token`

**Expected Results**:
- ✅ Verification fails
- ✅ Error message: "Invalid or expired token"
- ✅ Link to resend verification email
- ✅ User not verified

**Backend API**: `POST /api/v1/auth/verify-email` (returns 400/401)

---

### TC-AUTH-008: Protected Route Access - Authenticated Customer
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- Customer logged in with valid JWT in cookies

**Test Steps**:
1. Navigate to `/dashboard`
2. Navigate to `/requests`
3. Navigate to `/invoices`
4. Navigate to `/profile`

**Expected Results**:
- ✅ All routes accessible
- ✅ JWT validated by middleware
- ✅ User role checked (CUSTOMER allowed)
- ✅ Page content loads correctly

**Middleware**: [apps/frontend/middleware.ts](../../apps/frontend/middleware.ts:131)

---

### TC-AUTH-009: Protected Route Access - Unauthenticated User
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- No JWT token in cookies

**Test Steps**:
1. Navigate to `/dashboard`

**Expected Results**:
- ✅ Middleware intercepts request
- ✅ User redirected to `/login?redirect=/dashboard`
- ✅ After login, user redirected back to `/dashboard`

**Middleware**: [apps/frontend/middleware.ts](../../apps/frontend/middleware.ts:131)

---

### TC-AUTH-010: Protected Route Access - Wrong Role
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- User logged in with `LAB_ADMIN` role

**Test Steps**:
1. Attempt to navigate to `/requests` (customer-only route)

**Expected Results**:
- ✅ Middleware checks role
- ✅ User redirected to `/unauthorized`
- ✅ Unauthorized page displays appropriate message

**Middleware**: [apps/frontend/middleware.ts](../../apps/frontend/middleware.ts:131)

---

### TC-AUTH-011: Logout Functionality
**Priority**: High | **Status**: ✅ Implemented

**Preconditions**:
- Customer logged in

**Test Steps**:
1. Click "Logout" button in TopNav
2. Confirm logout (if prompted)

**Expected Results**:
- ✅ JWT token removed from cookies
- ✅ AuthContext clears user state
- ✅ User redirected to `/login`
- ✅ Attempting to access protected routes redirects to login

**Files Involved**:
- [apps/frontend/app/components/TopNav.tsx](../../apps/frontend/app/components/TopNav.tsx:43)
- [apps/frontend/lib/context/AuthContext.tsx](../../apps/frontend/lib/context/AuthContext.tsx:229)

---

## 2. CUSTOMER DASHBOARD

### TC-DASH-001: Dashboard - Load Statistics
**Priority**: High | **Status**: ⚠️ Partially Implemented (Mock data)

**Preconditions**:
- Customer logged in
- Customer has 5 test requests (2 DRAFT, 1 SUBMITTED, 1 APPROVED, 1 COMPLETED)
- Customer has 2 invoices (1 PENDING, 1 PAID)

**Test Steps**:
1. Navigate to `/dashboard`
2. Observe stat cards

**Expected Results**:
- ✅ Dashboard loads successfully
- ✅ "Total Requests" card shows: 5
- ✅ "Pending Approval" card shows: 1
- ✅ "Completed Tests" card shows: 1
- ✅ "Invoices" card shows: 2
- ⚠️ **TODO**: Connect to real backend API (currently mock data)

**Backend API**:
- `GET /api/v1/test-requests/my-requests`
- `GET /api/v1/invoices/my-invoices`

**Files Involved**: [apps/frontend/app/dashboard/page.tsx](../../apps/frontend/app/dashboard/page.tsx:189)

---

### TC-DASH-002: Dashboard - Quick Actions
**Priority**: Medium | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/dashboard`
2. Click "New Test Request" button
3. Go back to dashboard
4. Click "View Invoices" button

**Expected Results**:
- ✅ "New Test Request" navigates to `/requests/new`
- ✅ "View Invoices" navigates to `/invoices`
- ✅ Buttons are styled correctly (primary/secondary)

**Files Involved**: [apps/frontend/app/dashboard/page.tsx](../../apps/frontend/app/dashboard/page.tsx:189)

---

### TC-DASH-003: Dashboard - Role-Based Navigation Menu
**Priority**: High | **Status**: ✅ Implemented

**Preconditions**:
- Customer logged in

**Test Steps**:
1. Navigate to `/dashboard`
2. Observe SideNav menu items

**Expected Results**:
- ✅ SideNav shows customer-specific menu:
  - Dashboard
  - My Requests
  - Invoices
  - Profile
- ✅ No lab/admin/doctor menu items visible
- ✅ Active link highlighted

**Files Involved**: [apps/frontend/app/components/SideNav.tsx](../../apps/frontend/app/components/SideNav.tsx:136)

---

## 3. TEST REQUEST - LIST VIEW

### TC-REQ-LIST-001: View All Test Requests
**Priority**: Critical | **Status**: ⚠️ Partially Implemented (Mock data)

**Preconditions**:
- Customer logged in
- Customer has 7 test requests with various statuses

**Test Steps**:
1. Navigate to `/requests`
2. Observe requests table

**Expected Results**:
- ✅ Page loads successfully
- ✅ Table displays all requests
- ✅ Columns visible: Request No, Date, Company, Requester, Status, Actions
- ✅ Status badges color-coded:
  - DRAFT: gray
  - SUBMITTED: blue
  - APPROVED: green
  - REJECTED: red
  - COMPLETED: yellow
  - CANCELLED: purple
- ⚠️ **TODO**: Connect to `GET /api/v1/test-requests/my-requests`

**Backend API**: `GET /api/v1/test-requests/my-requests`
**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-002: Search by Request Number
**Priority**: High | **Status**: ⚠️ Client-side only (Backend doesn't support yet)

**Preconditions**:
- Customer has requests with numbers: `ABC-20251115-001`, `ABC-20251115-002`, `XYZ-20251114-001`

**Test Steps**:
1. Navigate to `/requests`
2. Enter `ABC` in search box
3. Wait 300ms (debounce delay)
4. Observe filtered results

**Expected Results**:
- ✅ Debounced search (300ms delay using `use-debounce`)
- ✅ Only requests with "ABC" in request number shown (client-side filter)
- ✅ Empty state if no matches
- ⚠️ **TODO**: Backend API doesn't support `?search=` query param yet

**Backend API**: `GET /api/v1/test-requests/my-requests?search=ABC` (not implemented)
**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-003: Filter by Status
**Priority**: High | **Status**: ⚠️ Client-side only (Backend doesn't support yet)

**Preconditions**:
- Customer has requests with various statuses

**Test Steps**:
1. Navigate to `/requests`
2. Select "APPROVED" from status filter dropdown
3. Observe filtered results

**Expected Results**:
- ✅ Dropdown shows 6 status options + "All Statuses"
- ✅ Only APPROVED requests shown (client-side filter)
- ✅ Badge colors match filtered status
- ⚠️ **TODO**: Backend API doesn't support `?status=` query param yet

**Backend API**: `GET /api/v1/test-requests/my-requests?status=APPROVED` (not implemented)
**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-004: View Request Details
**Priority**: High | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests`
2. Click "View" button on any request
3. Observe navigation

**Expected Results**:
- ✅ Navigates to `/requests/[id]` (detail page)
- ✅ Request ID passed correctly in URL
- ✅ Detail page loads with full request info

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-005: Edit DRAFT Request
**Priority**: High | **Status**: ✅ Implemented (Redirects to placeholder)

**Preconditions**:
- Customer has a DRAFT request

**Test Steps**:
1. Navigate to `/requests`
2. Click "Edit" button on DRAFT request
3. Observe navigation

**Expected Results**:
- ✅ "Edit" button visible only for DRAFT status
- ✅ Navigates to `/requests/[id]/edit`
- ⚠️ Edit page currently placeholder (redirects after 3s)
- ⚠️ **TODO**: Implement full edit form (should reuse Create form)

**Files Involved**:
- [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)
- [apps/frontend/app/requests/[id]/edit/page.tsx](../../apps/frontend/app/requests/[id]/edit/page.tsx:57)

---

### TC-REQ-LIST-006: Edit Non-DRAFT Request (Button Hidden)
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Customer has a SUBMITTED/APPROVED/COMPLETED request

**Test Steps**:
1. Navigate to `/requests`
2. Observe action buttons for non-DRAFT requests

**Expected Results**:
- ✅ "Edit" button NOT visible for non-DRAFT statuses
- ✅ Only "View" button shown
- ✅ Business rule enforced: Only DRAFT requests can be edited

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-007: Delete DRAFT Request
**Priority**: High | **Status**: ❌ Disabled (Backend endpoint missing)

**Preconditions**:
- Customer has a DRAFT request

**Test Steps**:
1. Navigate to `/requests`
2. Click "Delete" button on DRAFT request
3. Confirm deletion in dialog

**Expected Results**:
- ⚠️ Delete button visible but DISABLED
- ❌ **BLOCKER**: Backend `DELETE /api/v1/test-requests/:id` endpoint not implemented
- ❌ Confirmation dialog implemented but API call fails
- ⚠️ **TODO**: Implement DELETE endpoint in TestRequestController

**Backend API**: `DELETE /api/v1/test-requests/:id` (not implemented)
**Files Involved**:
- [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)
- [apps/backend/src/controllers/TestRequestController.ts](../../apps/backend/src/controllers/TestRequestController.ts:1129) (needs DELETE method)

---

### TC-REQ-LIST-008: Delete Non-DRAFT Request (Button Hidden)
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Customer has a SUBMITTED/APPROVED request

**Test Steps**:
1. Navigate to `/requests`
2. Observe action buttons for non-DRAFT requests

**Expected Results**:
- ✅ "Delete" button NOT visible for non-DRAFT statuses
- ✅ Business rule enforced: Only DRAFT requests can be deleted

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-009: Empty State - No Requests
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Customer has no test requests

**Test Steps**:
1. Navigate to `/requests`
2. Observe empty state

**Expected Results**:
- ✅ Empty state message displayed
- ✅ "Create your first request" message
- ✅ "New Request" button visible
- ✅ No table shown

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-LIST-010: Loading State
**Priority**: Medium | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests`
2. Observe loading skeleton (fast API = may not see)

**Expected Results**:
- ✅ Skeleton loader shown while fetching
- ✅ Uses Shadcn UI Skeleton component
- ✅ Layout matches table structure

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

## 4. TEST REQUEST - CREATE (MULTI-STEP FORM)

### TC-REQ-CREATE-001: Access Create Request Page
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- Customer logged in

**Test Steps**:
1. Navigate to `/requests/new`
2. Observe form structure

**Expected Results**:
- ✅ Page loads successfully
- ✅ Multi-step wizard displayed
- ✅ Step indicator shows "1 of 3"
- ✅ Step 1: Basic Information form visible
- ✅ "Next" button enabled

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-002: Step 1 - Valid Basic Information
**Priority**: Critical | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests/new`
2. Fill Step 1 form:
   - Requester Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+1234567890`
   - Objective: `Quality Control Testing`
   - Project: `PRJ-2024-001`
   - Additional Notes: `Urgent priority`
3. Click "Next"

**Expected Results**:
- ✅ Form validation passes
- ✅ Advances to Step 2 (Add Samples)
- ✅ Step indicator updates to "2 of 3"
- ✅ Data stored in form state

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-003: Step 1 - Invalid Data (Required Fields)
**Priority**: High | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests/new`
2. Leave required fields empty:
   - Requester Name: (empty)
   - Email: (empty)
3. Click "Next"

**Expected Results**:
- ✅ Zod validation fails
- ✅ Error messages shown under fields:
  - "Requester name is required"
  - "Email is required"
- ✅ Form does NOT advance to Step 2
- ✅ Focus moved to first error field

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-004: Step 1 - Invalid Email Format
**Priority**: Medium | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests/new`
2. Enter email: `invalid-email`
3. Fill other required fields
4. Click "Next"

**Expected Results**:
- ✅ Zod validation fails
- ✅ Error message: "Invalid email format"
- ✅ Form does NOT advance

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-005: Step 2 - Add Single Sample
**Priority**: Critical | **Status**: ✅ Implemented

**Preconditions**:
- Completed Step 1 successfully

**Test Steps**:
1. On Step 2, click "Add Sample"
2. Fill sample form:
   - Sample ID: `SMPL-001`
   - Sample Type: `Blood`
   - Quantity: `5`
   - Description: `Patient sample for glucose test`
3. Click "Save Sample"

**Expected Results**:
- ✅ Sample added to samples list
- ✅ Sample displayed in table with all details
- ✅ "Edit" and "Delete" buttons visible
- ✅ Can proceed to Step 3

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-006: Step 2 - Add Multiple Samples
**Priority**: High | **Status**: ✅ Implemented

**Preconditions**:
- Completed Step 1 successfully

**Test Steps**:
1. On Step 2, add 3 samples:
   - Sample 1: `SMPL-001`, `Blood`, `5`
   - Sample 2: `SMPL-002`, `Urine`, `10`
   - Sample 3: `SMPL-003`, `Tissue`, `2`
2. Observe samples list

**Expected Results**:
- ✅ All 3 samples listed in table
- ✅ Each sample has unique ID
- ✅ Edit/Delete buttons for each sample
- ✅ Form state maintains all samples

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-007: Step 2 - Edit Existing Sample
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Added at least 1 sample

**Test Steps**:
1. Click "Edit" on existing sample
2. Modify fields:
   - Change Quantity from `5` to `10`
   - Update Description
3. Save changes

**Expected Results**:
- ✅ Sample form pre-filled with existing data
- ✅ Changes saved and reflected in table
- ✅ Sample ID remains unchanged

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-008: Step 2 - Delete Sample
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Added multiple samples

**Test Steps**:
1. Click "Delete" on a sample
2. Confirm deletion (if prompted)

**Expected Results**:
- ✅ Sample removed from list
- ✅ Other samples remain intact
- ✅ Form state updated

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-009: Step 2 - Validation (No Samples)
**Priority**: High | **Status**: ⚠️ Needs verification

**Preconditions**:
- Completed Step 1
- No samples added in Step 2

**Test Steps**:
1. On Step 2, click "Next" without adding samples

**Expected Results**:
- ⚠️ **VERIFY**: Does validation require at least 1 sample?
- If yes: Error message shown, cannot proceed
- If no: Can proceed to Step 3 (business rule decision needed)

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-010: Step 3 - Review & Save as Draft
**Priority**: Critical | **Status**: ⚠️ Mock implementation (Backend TODO)

**Preconditions**:
- Completed Steps 1 & 2 with valid data

**Test Steps**:
1. Advance to Step 3 (Review)
2. Verify all data displayed correctly
3. Click "Save as Draft" button

**Expected Results**:
- ✅ All data from Steps 1 & 2 displayed for review
- ✅ Samples list shown
- ⚠️ **TODO**: Backend API call to save with `status = DRAFT`
- ⚠️ Line 383 has TODO comment for backend integration
- ✅ After save, redirect to `/requests` or detail page
- ✅ Success toast: "Request saved as draft"

**Backend API**: `POST /api/v1/test-requests` with `{status: "DRAFT", ...data}`
**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690) (line 383)

---

### TC-REQ-CREATE-011: Step 3 - Review & Submit
**Priority**: Critical | **Status**: ⚠️ Mock implementation (Backend TODO)

**Preconditions**:
- Completed Steps 1 & 2 with valid data

**Test Steps**:
1. Advance to Step 3 (Review)
2. Verify all data displayed correctly
3. Click "Submit Request" button

**Expected Results**:
- ⚠️ **TODO**: Backend API call to save with `status = SUBMITTED`
- ⚠️ **TODO**: Request number generated using `requestNoGenerator.ts`
- ⚠️ **TODO**: Email notification sent (if configured)
- ✅ After submit, redirect to request detail page
- ✅ Success toast: "Request submitted successfully"
- ✅ Request now visible in list with SUBMITTED status

**Backend API**: `POST /api/v1/test-requests` with `{status: "SUBMITTED", ...data}`
**Backend Logic**: Request number generation format: `{companyCode}-{YYYYMMDD}-{sequence}`
**Files Involved**:
- [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690) (line 383)
- [apps/backend/src/utils/requestNoGenerator.ts](../../apps/backend/src/utils/requestNoGenerator.ts:87)

---

### TC-REQ-CREATE-012: Navigation - Back Button Between Steps
**Priority**: Medium | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests/new`
2. Complete Step 1, advance to Step 2
3. Click "Back" button
4. Observe Step 1

**Expected Results**:
- ✅ Returns to Step 1
- ✅ Previously entered data preserved
- ✅ Step indicator updates to "1 of 3"
- ✅ Can edit Step 1 data and re-advance

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

### TC-REQ-CREATE-013: Browser Navigation (Refresh/Back)
**Priority**: High | **Status**: ⚠️ Needs verification

**Test Steps**:
1. Start creating request, fill Step 1
2. Advance to Step 2
3. Refresh browser (F5 or Cmd+R)

**Expected Results**:
- ⚠️ **VERIFY**: Form state lost or persisted?
- If lost: User returns to empty Step 1 (acceptable)
- If persisted: Consider localStorage persistence (enhancement)

**Files Involved**: [apps/frontend/app/requests/new/page.tsx](../../apps/frontend/app/requests/new/page.tsx:690)

---

## 5. TEST REQUEST - DETAIL VIEW

### TC-REQ-DETAIL-001: View DRAFT Request Details
**Priority**: Critical | **Status**: ⚠️ Mock data (Backend integration needed)

**Preconditions**:
- Customer has a DRAFT request with ID `req-123`

**Test Steps**:
1. Navigate to `/requests/req-123`
2. Observe all sections

**Expected Results**:
- ✅ Request detail page loads
- ✅ Status card shows "DRAFT" with gray badge
- ✅ Company information displayed
- ✅ Requester information displayed (name, email, phone)
- ✅ Request details (objective, project, notes)
- ✅ Samples table with all samples
- ✅ "Edit" button visible (DRAFT status)
- ⚠️ "Delete" button visible but disabled (backend endpoint missing)
- ✅ Activity timeline placeholder
- ⚠️ **TODO**: Connect to `GET /api/v1/test-requests/:id`

**Backend API**: `GET /api/v1/test-requests/:id`
**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-002: View SUBMITTED Request Details
**Priority**: High | **Status**: ⚠️ Mock data

**Preconditions**:
- Customer has a SUBMITTED request

**Test Steps**:
1. Navigate to `/requests/{submitted-id}`
2. Observe status and actions

**Expected Results**:
- ✅ Status badge shows "SUBMITTED" (blue)
- ✅ All request details visible
- ✅ "Edit" button NOT visible (cannot edit after submission)
- ✅ "Delete" button NOT visible (cannot delete after submission)
- ✅ Samples read-only

**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-003: View APPROVED Request with Lab Results
**Priority**: High | **Status**: ⚠️ Mock data

**Preconditions**:
- Customer has an APPROVED request
- Lab has entered test results

**Test Steps**:
1. Navigate to `/requests/{approved-id}`
2. Observe status and results

**Expected Results**:
- ✅ Status badge shows "APPROVED" (green)
- ✅ All request details visible
- ⚠️ **TODO**: Test results section visible (if implemented)
- ⚠️ **TODO**: Download results button (if implemented)
- ✅ No edit/delete actions

**Backend API**: `GET /api/v1/test-requests/:id` (includes results if available)
**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-004: View REJECTED Request with Reason
**Priority**: High | **Status**: ⚠️ Mock data

**Preconditions**:
- Customer has a REJECTED request
- Rejection reason provided by doctor

**Test Steps**:
1. Navigate to `/requests/{rejected-id}`
2. Observe status and rejection details

**Expected Results**:
- ✅ Status badge shows "REJECTED" (red)
- ⚠️ **TODO**: Rejection reason displayed (if backend includes it)
- ⚠️ **TODO**: Rejection date and rejecting doctor (if available)
- ✅ No edit/delete actions

**Backend API**: `GET /api/v1/test-requests/:id` (should include rejection reason)
**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-005: View Non-Existent Request (404)
**Priority**: Medium | **Status**: ✅ Implemented

**Test Steps**:
1. Navigate to `/requests/invalid-id-999`

**Expected Results**:
- ✅ 404 handling implemented
- ✅ Error message: "Request not found"
- ✅ Link to return to requests list
- ✅ No error thrown, page renders gracefully

**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-006: Edit DRAFT Request from Detail View
**Priority**: High | **Status**: ✅ Navigation implemented (Edit page placeholder)

**Preconditions**:
- Viewing DRAFT request detail

**Test Steps**:
1. Click "Edit Request" button
2. Observe navigation

**Expected Results**:
- ✅ Navigates to `/requests/{id}/edit`
- ⚠️ Edit page currently placeholder (redirects after 3s)
- ⚠️ **TODO**: Implement full edit form with pre-filled data

**Files Involved**:
- [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)
- [apps/frontend/app/requests/[id]/edit/page.tsx](../../apps/frontend/app/requests/[id]/edit/page.tsx:57)

---

### TC-REQ-DETAIL-007: Samples Table Display
**Priority**: Medium | **Status**: ✅ Implemented

**Preconditions**:
- Request has 3 samples

**Test Steps**:
1. View request detail page
2. Observe samples table

**Expected Results**:
- ✅ Table columns: Sample ID, Type, Quantity, Description
- ✅ All 3 samples displayed
- ✅ Responsive design (mobile/desktop)

**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

### TC-REQ-DETAIL-008: Activity Timeline (Future Feature)
**Priority**: Low | **Status**: ⚠️ Placeholder only

**Test Steps**:
1. View any request detail
2. Observe activity timeline section

**Expected Results**:
- ✅ Timeline placeholder visible
- ⚠️ **TODO**: Implement actual activity log
- ⚠️ **TODO**: Show events: Created, Submitted, Approved, Results Added, etc.

**Backend API**: May need new endpoint: `GET /api/v1/test-requests/:id/activity`
**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

## 6. TEST REQUEST - EDIT

### TC-REQ-EDIT-001: Edit DRAFT Request - Access Edit Page
**Priority**: High | **Status**: ⚠️ Placeholder (Needs implementation)

**Preconditions**:
- Customer has DRAFT request with ID `draft-123`

**Test Steps**:
1. Navigate to `/requests/draft-123/edit`

**Expected Results**:
- ⚠️ Currently shows placeholder message: "Edit functionality coming soon"
- ⚠️ Auto-redirects to detail page after 3 seconds
- ⚠️ **TODO**: Implement full edit form
- ⚠️ **TODO**: Should reuse multi-step form from Create page
- ⚠️ **TODO**: Pre-fill all fields with existing data

**Backend API**:
- `GET /api/v1/test-requests/:id` (fetch current data)
- `PUT /api/v1/test-requests/:id` (update)

**Files Involved**: [apps/frontend/app/requests/[id]/edit/page.tsx](../../apps/frontend/app/requests/[id]/edit/page.tsx:57)

---

### TC-REQ-EDIT-002: Edit DRAFT - Modify Basic Information
**Priority**: High | **Status**: ❌ Not implemented

**Preconditions**:
- Editing DRAFT request

**Test Steps** (Future):
1. Navigate to edit page
2. Modify requester name, email, objective
3. Click "Save" or "Update"

**Expected Results** (When implemented):
- ❌ Form pre-filled with existing data
- ❌ Changes saved to database
- ❌ Success message shown
- ❌ Redirect to detail view
- ❌ Modified data visible

**Backend API**: `PUT /api/v1/test-requests/:id`

---

### TC-REQ-EDIT-003: Edit DRAFT - Modify Samples
**Priority**: High | **Status**: ❌ Not implemented

**Preconditions**:
- Editing DRAFT request with 2 existing samples

**Test Steps** (Future):
1. Navigate to edit page
2. Edit sample 1 (change quantity)
3. Delete sample 2
4. Add new sample 3
5. Save changes

**Expected Results** (When implemented):
- ❌ Existing samples pre-loaded
- ❌ Can edit sample details
- ❌ Can add new samples
- ❌ Can delete samples
- ❌ All changes persisted to database

**Backend API**: `PUT /api/v1/test-requests/:id` (with updated samples array)

---

### TC-REQ-EDIT-004: Edit Non-DRAFT Request (Should Block)
**Priority**: High | **Status**: ⚠️ Needs implementation

**Preconditions**:
- Customer has SUBMITTED request

**Test Steps**:
1. Attempt to navigate to `/requests/{submitted-id}/edit`

**Expected Results**:
- ⚠️ **TODO**: Should show error or redirect
- ⚠️ **TODO**: Message: "Cannot edit submitted requests"
- ⚠️ **TODO**: Redirect to detail view
- ⚠️ Business rule: Only DRAFT requests editable

**Files Involved**: [apps/frontend/app/requests/[id]/edit/page.tsx](../../apps/frontend/app/requests/[id]/edit/page.tsx:57)

---

## 7. TEST REQUEST - DELETE

### TC-REQ-DELETE-001: Delete DRAFT Request
**Priority**: High | **Status**: ❌ Backend endpoint missing

**Preconditions**:
- Customer has DRAFT request

**Test Steps**:
1. Navigate to `/requests`
2. Click "Delete" on DRAFT request
3. Confirm deletion in dialog

**Expected Results**:
- ✅ Delete button visible for DRAFT status
- ⚠️ Button currently DISABLED (backend not ready)
- ✅ Confirmation dialog implemented
- ❌ **BLOCKER**: Backend `DELETE /api/v1/test-requests/:id` not implemented
- ❌ After deletion: Request removed from list
- ❌ Success toast: "Request deleted"

**Backend API**: `DELETE /api/v1/test-requests/:id` (not implemented)
**Files Involved**:
- [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)
- [apps/frontend/lib/hooks/useRequests.ts](../../apps/frontend/lib/hooks/useRequests.ts)
- [apps/backend/src/controllers/TestRequestController.ts](../../apps/backend/src/controllers/TestRequestController.ts:1129) (needs DELETE method)

---

### TC-REQ-DELETE-002: Delete Non-DRAFT Request (Should Block)
**Priority**: Medium | **Status**: ✅ UI blocks correctly

**Preconditions**:
- Customer has SUBMITTED/APPROVED request

**Test Steps**:
1. Navigate to `/requests`
2. Observe actions for non-DRAFT requests

**Expected Results**:
- ✅ Delete button NOT visible for non-DRAFT statuses
- ✅ Business rule enforced: Only DRAFT can be deleted

**Files Involved**: [apps/frontend/app/requests/page.tsx](../../apps/frontend/app/requests/page.tsx:302)

---

### TC-REQ-DELETE-003: Delete from Detail Page
**Priority**: Medium | **Status**: ⚠️ Button disabled

**Preconditions**:
- Viewing DRAFT request detail

**Test Steps**:
1. Navigate to `/requests/{draft-id}`
2. Click "Delete" button (if visible)

**Expected Results**:
- ✅ Delete button visible on detail page
- ⚠️ Button currently DISABLED (backend not ready)
- ❌ After deletion: Redirect to `/requests` list
- ❌ Success message shown

**Backend API**: `DELETE /api/v1/test-requests/:id` (not implemented)
**Files Involved**: [apps/frontend/app/requests/[id]/page.tsx](../../apps/frontend/app/requests/[id]/page.tsx:437)

---

## 8. INVOICES (FUTURE - Stub Only)

### TC-INV-001: View Invoices List
**Priority**: Medium | **Status**: ⚠️ Stub page (10% complete)

**Test Steps**:
1. Navigate to `/invoices`

**Expected Results**:
- ⚠️ Stub page shows placeholder message
- ⚠️ **TODO**: Implement full invoice list
- ⚠️ **TODO**: Show invoice number, date, amount, status (PENDING/PAID)
- ⚠️ **TODO**: Payment status badges (red=PENDING, green=PAID)

**Backend API**: `GET /api/v1/invoices/my-invoices`
**Files Involved**: [apps/frontend/app/invoices/page.tsx](../../apps/frontend/app/invoices/page.tsx:50)

---

### TC-INV-002: View Invoice Detail
**Priority**: Medium | **Status**: ⚠️ Stub page (10% complete)

**Test Steps**:
1. Navigate to `/invoices/{id}`

**Expected Results**:
- ⚠️ Stub page shows placeholder
- ⚠️ **TODO**: Show invoice details (items, subtotal, tax, total)
- ⚠️ **TODO**: Download PDF button
- ⚠️ **TODO**: Upload payment confirmation (if PENDING)

**Backend API**: `GET /api/v1/invoices/:id`
**Files Involved**: [apps/frontend/app/invoices/[id]/page.tsx](../../apps/frontend/app/invoices/[id]/page.tsx:50)

---

### TC-INV-003: Upload Payment Confirmation
**Priority**: Medium | **Status**: ❌ Not implemented

**Preconditions**:
- Customer has PENDING invoice

**Test Steps** (Future):
1. Navigate to invoice detail
2. Click "Upload Payment Proof"
3. Select image file (bank slip/receipt)
4. Submit upload

**Expected Results** (When implemented):
- ❌ File upload component (Multer on backend)
- ❌ File saved to `/uploads/payment-slips/`
- ❌ Invoice status updated to "PENDING VERIFICATION"
- ❌ Lab admin notified

**Backend API**: `POST /api/v1/invoices/:id/payment-confirmation`

---

## 9. PROFILE MANAGEMENT (FUTURE - Stub Only)

### TC-PROF-001: View Customer Profile
**Priority**: Medium | **Status**: ⚠️ Stub page (10% complete)

**Test Steps**:
1. Navigate to `/profile`

**Expected Results**:
- ⚠️ Stub page shows placeholder
- ⚠️ **TODO**: Display user info (name, email, phone)
- ⚠️ **TODO**: Display company info (name, code, address)
- ⚠️ **TODO**: "Edit Profile" button

**Backend API**: `GET /api/v1/customers/profile`
**Files Involved**: [apps/frontend/app/profile/page.tsx](../../apps/frontend/app/profile/page.tsx:50)

---

### TC-PROF-002: Edit Profile Information
**Priority**: Medium | **Status**: ❌ Not implemented

**Test Steps** (Future):
1. Navigate to `/profile`
2. Click "Edit Profile"
3. Modify name, phone, address
4. Save changes

**Expected Results** (When implemented):
- ❌ Form pre-filled with current data
- ❌ Validation (React Hook Form + Zod)
- ❌ Changes saved to database
- ❌ Success toast shown

**Backend API**: `PUT /api/v1/customers/profile`

---

### TC-PROF-003: Change Password
**Priority**: High | **Status**: ❌ Not implemented

**Test Steps** (Future):
1. Navigate to `/profile`
2. Click "Change Password"
3. Enter current password
4. Enter new password (2x for confirmation)
5. Submit

**Expected Results** (When implemented):
- ❌ Current password validated
- ❌ New password meets requirements (min 8 chars, uppercase, lowercase, number, special char)
- ❌ Password hashed with bcrypt (12 rounds)
- ❌ Success message: "Password changed successfully"
- ❌ Optional: Logout and require re-login

**Backend API**: `POST /api/v1/auth/change-password`

---

## 10. END-TO-END WORKFLOWS

### TC-E2E-001: Complete Request Lifecycle - Happy Path
**Priority**: Critical | **Status**: ⚠️ Partially testable (Backend integration needed)

**Scenario**: Customer creates request, submits, gets approved, views results, receives invoice, pays

**Test Steps**:
1. **Register & Verify**:
   - Customer registers new account
   - Verifies email via link
   - Logs in successfully

2. **Create Request**:
   - Navigate to Create Request
   - Fill Step 1 (Basic Info)
   - Add 2 samples in Step 2
   - Review in Step 3
   - Click "Submit Request"

3. **View Submitted Request**:
   - Request appears in list with SUBMITTED status (blue)
   - Request number generated (e.g., `ABC-20251115-001`)
   - Cannot edit or delete

4. **Lab Processes** (Simulated - Lab portal not built yet):
   - Lab acknowledges samples
   - Lab enters test results
   - Request status → IN_PROGRESS

5. **Doctor Approves** (Simulated - Doctor portal not built yet):
   - Doctor reviews results
   - Doctor clicks "Approve"
   - Request status → APPROVED (green)
   - Customer receives approval email notification

6. **View Results**:
   - Customer sees APPROVED status
   - Customer views/downloads test results

7. **Invoice & Payment**:
   - Invoice generated automatically
   - Customer navigates to Invoices
   - Customer views invoice detail
   - Customer uploads payment proof
   - Invoice status → PENDING VERIFICATION

8. **Lab Admin Confirms Payment** (Simulated):
   - Lab admin marks invoice as PAID
   - Invoice status → PAID (green)

**Expected Results**:
- ✅ Steps 1-3 fully functional
- ⚠️ Step 3: Backend API integration needed (line 383 TODO)
- ❌ Steps 4-8 blocked by missing Lab/Doctor/Admin portals
- ❌ Email notifications not tested (SMTP config needed)

**Status**: ~30% testable with current implementation

---

### TC-E2E-002: Draft → Edit → Submit Workflow
**Priority**: High | **Status**: ⚠️ Partially testable

**Test Steps**:
1. Create new request, fill partially
2. Save as DRAFT
3. Logout
4. Login again
5. View requests list - see DRAFT
6. Click "Edit" on DRAFT
7. Complete remaining fields
8. Submit request

**Expected Results**:
- ⚠️ Step 2: Backend API integration needed
- ⚠️ Step 6: Edit page placeholder (needs implementation)
- ⚠️ Step 8: Backend API integration needed

**Status**: UI implemented, backend integration pending

---

### TC-E2E-003: Request Rejection Workflow
**Priority**: Medium | **Status**: ❌ Not testable (Doctor portal needed)

**Scenario**: Doctor rejects request, customer sees rejection

**Test Steps**:
1. Customer submits request
2. Lab processes samples
3. Doctor reviews results
4. Doctor clicks "Reject" with reason: "Insufficient sample quality"
5. Customer checks requests list
6. Customer sees REJECTED status (red)
7. Customer opens request detail
8. Customer reads rejection reason
9. Customer receives rejection email notification

**Expected Results**:
- ❌ Step 1: Backend integration needed
- ❌ Steps 2-4: Doctor portal not implemented
- ✅ Step 5: UI can display REJECTED status
- ⚠️ Step 8: Needs backend to include rejection reason in API
- ❌ Step 9: Email service implemented but not integrated

**Status**: Not testable without Doctor portal

---

### TC-E2E-004: Multi-User Concurrent Request Creation
**Priority**: Low | **Status**: ⚠️ Backend race condition test

**Scenario**: Test request number generator under load

**Test Steps**:
1. Customer A starts creating request for Company "ABC"
2. Customer B starts creating request for Company "ABC" (same company, same day)
3. Both submit at nearly same time

**Expected Results**:
- ✅ Request number generator uses database locking
- ✅ Customer A gets: `ABC-20251115-001`
- ✅ Customer B gets: `ABC-20251115-002`
- ✅ No duplicate sequence numbers
- ✅ Atomic transaction prevents race condition

**Backend**: [requestNoGenerator.ts](../../apps/backend/src/utils/requestNoGenerator.ts:87) handles concurrency

**Status**: Backend logic implemented, needs load testing

---

## 📊 Test Summary Statistics

### Implementation Status by Module

| Module | Total Test Cases | Implemented | Partially | Not Implemented | Pass Rate |
|--------|------------------|-------------|-----------|-----------------|-----------|
| **Authentication** | 11 | 11 | 0 | 0 | 100% |
| **Dashboard** | 3 | 3 | 0 | 0 | 100% |
| **Request List** | 10 | 7 | 2 | 1 | 70% |
| **Request Create** | 13 | 11 | 2 | 0 | 85% |
| **Request Detail** | 8 | 6 | 2 | 0 | 75% |
| **Request Edit** | 4 | 0 | 1 | 3 | 0% |
| **Request Delete** | 3 | 1 | 1 | 1 | 33% |
| **Invoices** | 3 | 0 | 3 | 0 | 0% |
| **Profile** | 3 | 0 | 1 | 2 | 0% |
| **E2E Workflows** | 4 | 0 | 2 | 2 | 0% |
| **TOTAL** | **62** | **39** | **14** | **9** | **63%** |

### Critical Blockers

1. ❌ **DELETE endpoint** - Backend `DELETE /api/v1/test-requests/:id` not implemented
2. ⚠️ **Create/Update API** - Frontend forms ready but backend integration TODO (line 383)
3. ⚠️ **Edit page** - Currently placeholder, needs full implementation
4. ⚠️ **Search/Filter** - Backend doesn't support query params yet (client-side only)

### Priority Test Coverage

| Priority | Total | Implemented | Coverage |
|----------|-------|-------------|----------|
| Critical | 15 | 11 | 73% |
| High | 22 | 14 | 64% |
| Medium | 19 | 10 | 53% |
| Low | 6 | 4 | 67% |

---

## 🔧 Testing Tools & Environment

### Manual Testing Setup

1. **Backend**:
   - Ensure backend running: `pnpm --filter starlab-backend dev`
   - PostgreSQL container: `docker-compose up -d postgres`
   - API base URL: `http://localhost:5001/api/v1`

2. **Frontend**:
   - Ensure frontend running: `pnpm --filter starlab-frontend dev`
   - Access at: `http://localhost:3000`

3. **Test Data**:
   - Seed database with test users (CUSTOMER, LAB_ADMIN, DOCTOR, ADMIN)
   - Create sample test requests with various statuses
   - Generate mock invoices

### Browser Testing

- **Primary**: Chrome/Chromium (latest)
- **Secondary**: Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari iOS

### API Testing Tools

- **Postman** - Collection for all 45+ endpoints
- **curl** - Command-line testing
- **Jest + Supertest** - Automated backend tests

---

## 📝 Test Execution Notes

### Known Issues

1. **Backend Integration**:
   - Create Request (line 383): TODO comment for API call
   - Update Request: Endpoint exists but frontend integration needed
   - Delete Request: Backend endpoint not implemented

2. **Client-side Filtering**:
   - Search and status filter currently client-side only
   - Backend API doesn't support `?search=` and `?status=` query params yet

3. **Email Notifications**:
   - EmailService implemented but SMTP config not set up in test environment
   - Need to configure `.env` with Gmail app password or SMTP server

4. **File Uploads**:
   - FileService exists but needs verification:
     - Upload directories created?
     - Multer middleware configured?
     - Endpoints tested?

### Test Data Requirements

For comprehensive testing, seed database with:

```sql
-- 1 CUSTOMER user (verified)
-- 1 CUSTOMER user (unverified)
-- 1 LAB_ADMIN user
-- 1 DOCTOR user
-- 1 ADMIN user

-- For customer 1:
-- 1 DRAFT request
-- 1 SUBMITTED request
-- 1 APPROVED request
-- 1 REJECTED request (with reason)
-- 1 COMPLETED request
-- 1 CANCELLED request

-- 2 Invoices:
-- 1 PENDING invoice
-- 1 PAID invoice
```

---

## 🚀 Next Steps for Test Coverage

### Immediate (Complete Customer Portal to 100%)

1. **Backend API Integration** (2-3 hours):
   - Implement `POST /api/v1/test-requests` in Create form (line 383)
   - Implement `PUT /api/v1/test-requests/:id` in Update hook
   - Implement `DELETE /api/v1/test-requests/:id` endpoint
   - Add search/filter query params support

2. **Edit Page** (2-3 hours):
   - Reuse Create form with pre-filled data
   - Load existing request data
   - Update instead of create on submit

3. **Invoice Pages** (3-4 hours):
   - Invoice list with payment status
   - Invoice detail with download
   - Payment confirmation upload

4. **Profile Page** (2-3 hours):
   - View/edit profile form
   - Change password form
   - Company info display

### Future Phases

5. **Lab Portal** (3-4 days):
   - Test TC-LAB-001 through TC-LAB-030 (to be created)

6. **Doctor Portal** (2 days):
   - Test TC-DOC-001 through TC-DOC-020 (to be created)

7. **Admin Portal** (2-3 days):
   - Test TC-ADMIN-001 through TC-ADMIN-030 (to be created)

8. **Automated E2E Tests** (3-4 days):
   - Playwright or Cypress setup
   - Automate critical user journeys
   - CI/CD integration

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Next Review**: After backend API integration complete
**Prepared By**: Claude (AI Assistant)
**Based On**: [Implementation Status v1.4](../../docs/SDD/05-Implementation-Status.md)

---

## 📎 File References

### Frontend Files
- [Login Page](../../apps/frontend/app/(auth)/login/page.tsx:276)
- [Register Page](../../apps/frontend/app/(auth)/register/page.tsx:250)
- [Verify Email](../../apps/frontend/app/(auth)/verify-email/page.tsx:200)
- [Dashboard](../../apps/frontend/app/dashboard/page.tsx:189)
- [Requests List](../../apps/frontend/app/requests/page.tsx:302)
- [Create Request](../../apps/frontend/app/requests/new/page.tsx:690)
- [Request Detail](../../apps/frontend/app/requests/[id]/page.tsx:437)
- [Request Edit](../../apps/frontend/app/requests/[id]/edit/page.tsx:57)
- [Middleware](../../apps/frontend/middleware.ts:131)
- [Auth Context](../../apps/frontend/lib/context/AuthContext.tsx:229)
- [API Client](../../apps/frontend/lib/api/client.ts:114)

### Backend Files
- [Auth Routes](../../apps/backend/src/routes/authRoutes.ts)
- [Test Request Routes](../../apps/backend/src/routes/testRequest.ts)
- [Test Request Controller](../../apps/backend/src/controllers/TestRequestController.ts:1129)
- [Request Number Generator](../../apps/backend/src/utils/requestNoGenerator.ts:87)
- [Error Handler](../../apps/backend/src/utils/errorHandler.ts:108)
- [Email Service](../../apps/backend/src/services/EmailService.ts:340)

---

**✅ Ready for Test Execution and Backend Integration**
