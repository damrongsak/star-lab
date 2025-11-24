# Manual Testing Plan - STAR-LAB Application

**Version:** 1.0
**Date:** 2025-11-19
**Status:** Ready for Testing
**Estimated Time:** 1-2 hours

---

## 📋 Prerequisites

### Test Accounts (Password: `password123`)

| Role | Email | Access |
|------|-------|--------|
| Customer | `customer@starlab.com` | Customer Portal |
| Technician | `technician@starlab.com` | Lab Interface |
| Doctor | `doctor@starlab.com` | Doctor Interface |
| Admin | `admin@starlab.com` | Admin Interface |

### Setup Commands

**1. Start Services:**
```bash
# Terminal 1 - Database
docker-compose up -d postgres

# Terminal 2 - Backend
pnpm --filter starlab-backend dev

# Terminal 3 - Frontend
pnpm --filter starlab-frontend dev
```

**2. Seed Database (if needed):**
```bash
pnpm --filter starlab-backend exec tsx prisma/seed-user-profiles.ts
```

**3. Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

---

## 🧪 Test Scenarios

### Test 1: Customer Portal (15 min)

**Objective:** Verify customer can manage test requests, view invoices, and update profile.

**Steps:**

1. **Login & Dashboard**
   - [ ] Navigate to http://localhost:3000/login
   - [ ] Login with `customer@starlab.com` / `password123`
   - [ ] Verify dashboard loads with statistics cards
   - [ ] Check quick action buttons visible

2. **Create Test Request**
   - [ ] Click "New Request" button
   - [ ] Fill all required fields:
     - Requester name
     - Objective
     - Project name
     - Add at least 2 samples
   - [ ] Click "Save as Draft"
   - [ ] Verify toast notification appears
   - [ ] Verify redirected to requests list

3. **View & Edit Request**
   - [ ] Click on the created request
   - [ ] Verify all details display correctly
   - [ ] Click "Edit" button
   - [ ] Modify some fields
   - [ ] Click "Submit for Approval"
   - [ ] Verify status changes to SUBMITTED

4. **View Request Detail**
   - [ ] Return to request detail page
   - [ ] Verify status badge shows SUBMITTED
   - [ ] Verify Edit button no longer visible
   - [ ] Check samples table displays correctly

5. **View Invoices**
   - [ ] Navigate to Invoices page
   - [ ] Verify invoice list loads
   - [ ] Try search functionality
   - [ ] Try payment status filter
   - [ ] Click on an invoice
   - [ ] Verify detail page shows correctly

6. **Profile Management**
   - [ ] Navigate to Profile page
   - [ ] Update contact information
   - [ ] Click "Save Changes"
   - [ ] Verify success toast
   - [ ] Change password
   - [ ] Verify password change successful

7. **Logout**
   - [ ] Click user menu (top right)
   - [ ] Click "Sign Out"
   - [ ] Verify redirected to login page

**Expected Results:**
- ✅ All CRUD operations work without errors
- ✅ Form validations work properly
- ✅ Status changes reflect correctly
- ✅ Toast notifications display
- ✅ Navigation flows smoothly

---

### Test 2: Lab Interface (15 min)

**Objective:** Verify lab technician can view requests, acknowledge samples, and enter results.

**Steps:**

1. **Login & Lab Dashboard**
   - [ ] Login with `technician@starlab.com` / `password123`
   - [ ] Verify lab dashboard loads
   - [ ] Check statistics cards display correct counts
   - [ ] Verify quick action buttons work

2. **View Lab Requests**
   - [ ] Navigate to "Test Requests"
   - [ ] Verify request list displays
   - [ ] Try search by request number
   - [ ] Try status filter dropdown
   - [ ] Verify filtering works correctly

3. **Acknowledge Samples**
   - [ ] Click "Acknowledge" on a SUBMITTED request
   - [ ] Verify request details display
   - [ ] Verify samples table shows all samples
   - [ ] Check "All samples received" checkbox
   - [ ] Add notes (optional)
   - [ ] Click "Acknowledge Receipt"
   - [ ] Verify success toast
   - [ ] Verify redirected to requests list
   - [ ] Verify status changed to SAMPLE_RECEIVED

4. **Enter Test Results**
   - [ ] Click "Enter Results" on an IN_TESTING request
   - [ ] Verify samples display in expandable sections
   - [ ] For each sample:
     - [ ] Add test name
     - [ ] Enter result value
     - [ ] Enter unit
     - [ ] Select status (PASS/FAIL)
     - [ ] Add notes
   - [ ] Click "Submit All Results"
   - [ ] Verify success toast
   - [ ] Verify status changes to RESULT_READY

5. **Logout**
   - [ ] Sign out successfully

**Expected Results:**
- ✅ Lab dashboard stats load correctly
- ✅ Search and filters work
- ✅ Sample acknowledgment workflow completes
- ✅ Result entry form works for multiple samples
- ✅ Status transitions correctly

---

### Test 3: Doctor Interface (10 min)

**Objective:** Verify doctor can review requests and approve/reject them.

**Steps:**

1. **Login & Doctor Dashboard**
   - [ ] Login with `doctor@starlab.com` / `password123`
   - [ ] Verify dashboard loads
   - [ ] Check statistics cards (pending, approved, rejected)
   - [ ] Verify numbers are accurate

2. **View Pending Approvals**
   - [ ] Navigate to "Pending Approvals"
   - [ ] Verify list of RESULT_READY requests
   - [ ] Try search functionality
   - [ ] Try status filter

3. **Review Request**
   - [ ] Click "Review" on a pending request
   - [ ] Verify all request details display:
     - Request information
     - Company details
     - Samples and test results
   - [ ] Verify all data is readable

4. **Approve Request**
   - [ ] Click "Approve" button
   - [ ] Verify confirmation dialog appears
   - [ ] Confirm approval
   - [ ] Verify success toast
   - [ ] Verify redirected to pending approvals
   - [ ] Verify request no longer in pending list

5. **Check Approved List**
   - [ ] Navigate to "Approved" page
   - [ ] Verify approved request appears in list
   - [ ] Check status badge shows APPROVED

6. **Reject Request (if available)**
   - [ ] Find another RESULT_READY request
   - [ ] Click "Reject" button
   - [ ] Verify confirmation dialog with reason field
   - [ ] Enter rejection reason
   - [ ] Confirm rejection
   - [ ] Verify success toast
   - [ ] Verify status changes to REJECTED

7. **Check Workload**
   - [ ] Navigate to "My Workload"
   - [ ] Verify statistics display
   - [ ] Check recent activity

8. **Logout**
   - [ ] Sign out successfully

**Expected Results:**
- ✅ Pending approvals load correctly
- ✅ Request review page shows all details
- ✅ Approve workflow completes
- ✅ Reject workflow with reason works
- ✅ Email notifications sent (check backend logs)

---

### Test 4: Admin Interface (10 min)

**Objective:** Verify admin can manage users and view system statistics.

**Steps:**

1. **Login & Admin Dashboard**
   - [ ] Login with `admin@starlab.com` / `password123`
   - [ ] Verify admin dashboard loads
   - [ ] Check 6 statistics cards display:
     - Total Users
     - Total Customers
     - Total Test Requests
     - Pending Approvals
     - Active Technicians
     - Total Invoices
   - [ ] Verify numbers are accurate

2. **View Users**
   - [ ] Navigate to "Users" page (or click "Manage Users")
   - [ ] Verify user list displays
   - [ ] Check all roles shown (CUSTOMER, TECHNICIAN, DOCTOR, etc.)
   - [ ] Verify role badges have correct colors

3. **Create New User**
   - [ ] Click "Add New User" button
   - [ ] Verify dialog opens
   - [ ] Fill in all fields:
     - Name: Test User
     - Email: testuser@test.com
     - Password: password123
     - Role: TECHNICIAN
     - Status: Active
   - [ ] Click "Create User"
   - [ ] Verify success toast
   - [ ] Verify new user appears in list

4. **Edit User**
   - [ ] Click "Edit" button on the new user
   - [ ] Verify dialog opens with pre-filled data
   - [ ] Modify user name
   - [ ] Change role to DOCTOR
   - [ ] Click "Update User"
   - [ ] Verify success toast
   - [ ] Verify changes reflected in list

5. **Search Users**
   - [ ] Type user name in search box
   - [ ] Verify debounced search works
   - [ ] Verify filtered results display
   - [ ] Clear search

6. **Filter by Role**
   - [ ] Select "CUSTOMER" from role dropdown
   - [ ] Verify only customers display
   - [ ] Select "ALL" to reset

7. **Delete User**
   - [ ] Click "Delete" button on test user
   - [ ] Verify confirmation dialog appears
   - [ ] Confirm deletion
   - [ ] Verify success toast
   - [ ] Verify user removed from list

8. **Logout**
   - [ ] Sign out successfully

**Expected Results:**
- ✅ Admin dashboard stats accurate
- ✅ User list loads with all users
- ✅ Create user form validates and saves
- ✅ Edit user updates correctly
- ✅ Search and filter work
- ✅ Delete with confirmation works

---

### Test 5: Cross-Role Integration (10 min)

**Objective:** Verify complete end-to-end workflow across all roles.

**Full Workflow:**

1. **Customer Creates Request**
   - [ ] Login as customer
   - [ ] Create new test request with 2 samples
   - [ ] Submit request (status: SUBMITTED)
   - [ ] Note request number
   - [ ] Logout

2. **Technician Acknowledges Samples**
   - [ ] Login as technician
   - [ ] Find the submitted request
   - [ ] Acknowledge samples (status: SAMPLE_RECEIVED)
   - [ ] Enter test results (status: RESULT_READY)
   - [ ] Logout

3. **Doctor Approves**
   - [ ] Login as doctor
   - [ ] Find request in pending approvals
   - [ ] Review and approve (status: APPROVED)
   - [ ] Logout

4. **Check Invoice Generated**
   - [ ] Login as customer
   - [ ] Navigate to Invoices
   - [ ] Verify invoice exists for approved request
   - [ ] Logout

5. **Admin Verifies**
   - [ ] Login as admin
   - [ ] Check dashboard stats updated
   - [ ] Verify all user roles involved
   - [ ] Logout

**Expected Results:**
- ✅ Complete workflow executes without errors
- ✅ Status transitions correctly at each stage
- ✅ Invoice generates after approval
- ✅ All data persists correctly
- ✅ No broken links or missing data

---

### Test 6: Edge Cases & Error Handling (10 min)

**Objective:** Verify application handles errors and edge cases gracefully.

**Tests:**

1. **Unauthorized Access**
   - [ ] Login as customer
   - [ ] Try accessing `/lab-dashboard` directly
   - [ ] Verify redirected to `/unauthorized`
   - [ ] Try accessing `/admin-dashboard`
   - [ ] Verify redirected to `/unauthorized`

2. **Form Validation**
   - [ ] Try submitting forms with missing required fields
   - [ ] Verify validation errors display
   - [ ] Try invalid email formats
   - [ ] Try short passwords
   - [ ] Verify all validations work

3. **Invalid IDs**
   - [ ] Navigate to `/requests/invalid-uuid`
   - [ ] Verify 404 or "Request not found" message
   - [ ] Navigate to `/invoices/999999`
   - [ ] Verify error handling

4. **Edit Restrictions**
   - [ ] Login as customer
   - [ ] Try editing a SUBMITTED request
   - [ ] Verify Edit button not visible
   - [ ] Try accessing edit URL directly
   - [ ] Verify proper error message

5. **Delete Restrictions**
   - [ ] Try deleting a request with status other than DRAFT
   - [ ] Verify proper error message or button disabled

6. **Network Errors**
   - [ ] Stop backend server
   - [ ] Try loading any page with API calls
   - [ ] Verify error state displays
   - [ ] Restart backend
   - [ ] Verify data loads after retry

**Expected Results:**
- ✅ Proper error messages display
- ✅ Unauthorized access redirected
- ✅ Form validations prevent bad data
- ✅ 404 pages for invalid routes
- ✅ Edit/delete restrictions enforced
- ✅ Network errors handled gracefully

---

### Test 7: Mobile Responsiveness (5 min)

**Objective:** Verify UI adapts to mobile screen sizes.

**Tests:**

1. **Resize Browser**
   - [ ] Open Chrome DevTools (F12)
   - [ ] Toggle device toolbar (Ctrl+Shift+M)
   - [ ] Set to iPhone 12 Pro (390x844)

2. **Test Key Pages**
   - [ ] Login page
     - [ ] Form centered and readable
     - [ ] Buttons accessible
   - [ ] Dashboard (any role)
     - [ ] Stats cards stack vertically
     - [ ] Navigation menu works
   - [ ] Request List
     - [ ] Table scrolls horizontally if needed
     - [ ] Action buttons accessible
   - [ ] Create/Edit Forms
     - [ ] Form fields full width
     - [ ] All inputs accessible
   - [ ] Request Detail
     - [ ] Content readable
     - [ ] No horizontal overflow

3. **Navigation**
   - [ ] Verify mobile menu (hamburger) works
   - [ ] Check side navigation drawer opens/closes
   - [ ] Verify all links accessible

4. **Touch Interactions**
   - [ ] Buttons have adequate touch targets (44x44px min)
   - [ ] Dropdowns work on touch
   - [ ] Dialogs display correctly

**Expected Results:**
- ✅ All pages adapt to mobile width
- ✅ No horizontal scroll (except tables)
- ✅ Navigation menu accessible
- ✅ Forms usable on mobile
- ✅ Touch targets adequate

---

## 🐛 Bug Report Template

If you find bugs during testing, document them using this format:

```markdown
### Bug #[number]

**Page:** [page name or route]

**Issue:** [brief description]

**Steps to Reproduce:**
1. [step 1]
2. [step 2]
3. [step 3]

**Expected Behavior:**
[what should happen]

**Actual Behavior:**
[what actually happens]

**Priority:** High / Medium / Low

**Screenshots/Logs:** [if applicable]
```

---

## ✅ Test Completion Checklist

- [ ] All 7 test scenarios completed
- [ ] Bug report created (if issues found)
- [ ] Performance notes documented
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing (Chrome, Firefox, Safari - optional)

---

## 📊 Test Results Summary

**Date Tested:** _________________
**Tester:** _________________
**Overall Status:** ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

**Tests Passed:** ___ / 7
**Bugs Found:** ___
**Critical Issues:** ___

**Notes:**
```
[Add any general observations, performance issues, or recommendations]
```

---

## 🚀 Next Steps After Testing

**If All Tests Pass:**
1. Push to main branch
2. Create deployment plan
3. Deploy to production

**If Bugs Found:**
1. Prioritize bugs (High/Medium/Low)
2. Fix critical bugs first
3. Re-test after fixes
4. Deploy when stable

---

**Document Version:** 1.0
**Last Updated:** 2025-11-19
**Maintained By:** Development Team
