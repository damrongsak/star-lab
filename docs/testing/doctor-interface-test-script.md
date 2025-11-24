# Doctor Interface Test Script

**Feature**: Doctor Approval Interface
**Version**: 1.0
**Date**: 2025-11-18
**Tester**: _______________
**Environment**: Development

---

## 🎯 Test Objectives

Verify the complete doctor workflow:
1. Login as doctor user
2. View pending approval requests
3. Review request details with test results
4. Approve or reject requests with proper validation
5. Verify navigation and UI responsiveness

---

## 📋 Pre-requisites

### 1. Backend Server Running
```bash
cd /home/dan/workspace/star-lab
pnpm --filter starlab-backend dev
```
**Expected**: Server runs on `http://localhost:5001`

### 2. Frontend Server Running
```bash
pnpm --filter starlab-frontend dev
```
**Expected**: App runs on `http://localhost:3000`

### 3. Test Data Setup

**Required test users**:
- **Doctor Account**:
  - Email: `doctor@starlab.com` (or create one with DOCTOR role)
  - Password: _(from your database/seed data)_

- **Customer Account** (for creating test requests):
  - Email: `customer@starlab.com`
  - Password: _(from your database/seed data)_

**Required test data**:
- At least 2 test requests with status: `RESULT_READY` (waiting for doctor approval)
- At least 1 test request with status: `SUBMITTED` or `IN_PROGRESS` (not ready for approval)

---

## 🧪 Test Cases

### **TC-1: Doctor Login**

**Objective**: Verify doctor can login successfully

**Steps**:
1. Navigate to `http://localhost:3000/login`
2. Enter doctor credentials:
   - Email: `doctor@starlab.com`
   - Password: `[doctor_password]`
3. Click "Login" button

**Expected Results**:
- ✅ Login successful
- ✅ Redirected to `/doctor/pending-approvals` OR `/dashboard`
- ✅ SideNav shows Doctor menu items:
  - Pending Approvals
  - Approved
  - My Workload
  - Profile
- ✅ Top navigation shows doctor email
- ✅ No console errors

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
[Write any issues or observations here]
```

---

### **TC-2: View Pending Approvals List**

**Objective**: Verify pending approvals page displays correctly

**Steps**:
1. After login, navigate to `/doctor/pending-approvals`
2. Observe the page layout and data

**Expected Results**:
- ✅ Page title: "Pending Approvals" (or similar)
- ✅ Table displays with columns:
  - Request No
  - Date
  - Company
  - Requester
  - Actions (View button)
- ✅ Shows only requests with status `RESULT_READY`
- ✅ Each row has a clickable "View" button
- ✅ Loading skeleton appears initially (if network is slow)
- ✅ No console errors

**Expected Count**: ___ requests (should match `RESULT_READY` requests in database)

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Actual count: ___
```

---

### **TC-3: Search Pending Approvals**

**Objective**: Verify search functionality works

**Steps**:
1. On pending approvals page, locate search input
2. Type a request number (e.g., "ABC-20251118-001")
3. Wait 300ms (debounce delay)
4. Observe filtered results

**Expected Results**:
- ✅ Search input visible and functional
- ✅ Results filter based on request number
- ✅ Matching requests displayed
- ✅ Non-matching requests hidden
- ✅ Debounce works (doesn't search on every keystroke)
- ✅ Empty state message if no matches

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Search term used: ___
Results: ___
```

---

### **TC-4: Empty State - No Pending Approvals**

**Objective**: Verify empty state when no requests are pending

**Pre-condition**: Approve/reject all pending requests OR test with clean database

**Steps**:
1. Navigate to `/doctor/pending-approvals` when no requests exist
2. Observe the page

**Expected Results**:
- ✅ Empty state message: "No pending approvals" (or similar)
- ✅ No table or empty table displayed
- ✅ No loading spinner after initial load
- ✅ UI remains functional

**Status**: ☐ Pass / ☐ Fail (Optional test)

**Notes**:
```
[Empty state message text: ___]
```

---

### **TC-5: View Request Detail**

**Objective**: Verify request detail page displays complete information

**Steps**:
1. From pending approvals list, click "View" button on any request
2. Observe the detail page

**Expected Results**:
- ✅ Navigates to `/doctor/requests/[id]`
- ✅ Page displays request information card:
  - Request Number
  - Date
  - Status badge (should show RESULT_READY)
  - Company name
  - Requester name
  - Objective/Notes
- ✅ Samples table displays:
  - Sample ID
  - Sample Type
  - Quantity
  - Storage Condition
  - Additional Details
- ✅ **Test Results section** displays (if backend returns results)
- ✅ Action buttons visible at bottom:
  - "Approve" button (green)
  - "Reject" button (red)
- ✅ No console errors

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Request ID tested: ___
Test results displayed: ☐ Yes / ☐ No
```

---

### **TC-6: Approve Request - Dialog**

**Objective**: Verify approve dialog opens and displays correctly

**Steps**:
1. On request detail page, click "Approve" button
2. Observe the dialog

**Expected Results**:
- ✅ Approve dialog opens
- ✅ Dialog shows confirmation message: "Are you sure you want to approve request [Request No]?"
- ✅ Two buttons visible:
  - "Cancel" button
  - "Approve" button (green/primary)
- ✅ Click "Cancel" → Dialog closes, stays on same page
- ✅ No API call made when canceling

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
[Dialog message text: ___]
```

---

### **TC-7: Approve Request - Confirm**

**Objective**: Verify approve request functionality works

**Pre-condition**: Have at least 1 request with status `RESULT_READY`

**Steps**:
1. On request detail page, click "Approve" button
2. In dialog, click "Approve" button (confirm)
3. Wait for API response

**Expected Results**:
- ✅ Loading indicator during API call (button disabled or spinner)
- ✅ Success toast notification: "Request approved successfully" (or similar)
- ✅ Redirects to `/doctor/pending-approvals` list
- ✅ Approved request **no longer appears** in pending list
- ✅ Backend request status updated to `APPROVED` (verify in database or admin panel)
- ✅ No console errors

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Request ID approved: ___
API endpoint called: POST /api/v1/doctors/requests/:id/approve
Response status: ___
```

---

### **TC-8: Reject Request - Dialog with Validation**

**Objective**: Verify reject dialog validation works

**Steps**:
1. On request detail page, click "Reject" button
2. Observe the dialog
3. Try to submit without entering reason
4. Enter a reason and observe button state

**Expected Results**:
- ✅ Reject dialog opens
- ✅ Dialog shows:
  - Title: "Reject request [Request No]" (or similar)
  - Label: "Rejection Reason" (with required indicator)
  - Textarea for reason input
  - "Cancel" button
  - "Reject" button (red/destructive)
- ✅ "Reject" button is **disabled** when textarea is empty
- ✅ After typing reason, "Reject" button becomes **enabled**
- ✅ Click "Cancel" → Dialog closes without action

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
[Dialog title: ___]
[Required validation working: ☐ Yes / ☐ No]
```

---

### **TC-9: Reject Request - Confirm**

**Objective**: Verify reject request functionality works

**Pre-condition**: Have at least 1 request with status `RESULT_READY`

**Steps**:
1. On request detail page, click "Reject" button
2. Enter rejection reason: "Test results do not meet quality standards"
3. Click "Reject" button (confirm)
4. Wait for API response

**Expected Results**:
- ✅ Loading indicator during API call
- ✅ Success toast notification: "Request rejected successfully" (or similar)
- ✅ Redirects to `/doctor/pending-approvals` list
- ✅ Rejected request **no longer appears** in pending list
- ✅ Backend request status updated to `REJECTED` (verify in database)
- ✅ Rejection reason saved in database
- ✅ No console errors

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Request ID rejected: ___
Rejection reason: ___
API endpoint called: POST /api/v1/doctors/requests/:id/reject
Response status: ___
```

---

### **TC-10: Navigation Between Pages**

**Objective**: Verify navigation works correctly

**Steps**:
1. From pending approvals, click "View" → Detail page
2. Click browser back button
3. From pending approvals, click "Profile" in SideNav
4. Click "Pending Approvals" in SideNav
5. Log out and verify redirect

**Expected Results**:
- ✅ Browser back button works (returns to pending list)
- ✅ SideNav links work correctly
- ✅ Active link highlighted in SideNav
- ✅ Profile page accessible
- ✅ Logout redirects to login page
- ✅ After logout, cannot access doctor pages (redirected to login)

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
[Any navigation issues: ___]
```

---

### **TC-11: Authorization - Non-Doctor Access**

**Objective**: Verify only doctors can access doctor pages

**Steps**:
1. Logout if logged in
2. Login as **customer** (not doctor)
3. Try to access `/doctor/pending-approvals` directly

**Expected Results**:
- ✅ Redirected to `/unauthorized` page OR `/dashboard` (customer dashboard)
- ✅ Cannot access doctor routes with customer credentials
- ✅ Appropriate error message displayed

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
User role tested: CUSTOMER
Redirect destination: ___
```

---

### **TC-12: Error Handling - Invalid Request ID**

**Objective**: Verify 404 handling for non-existent requests

**Steps**:
1. Login as doctor
2. Navigate to `/doctor/requests/invalid-uuid-12345`
3. Observe behavior

**Expected Results**:
- ✅ Shows 404 error message OR "Request not found"
- ✅ No application crash
- ✅ Can navigate back to pending approvals
- ✅ Appropriate error message in console (expected)

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Error message shown: ___
```

---

### **TC-13: Error Handling - Network Failure**

**Objective**: Verify error handling when backend is unavailable

**Steps**:
1. Stop backend server
2. Login as doctor (may need to login before stopping backend)
3. Try to access pending approvals
4. Observe error state

**Expected Results**:
- ✅ Error message displayed: "Failed to load data" (or similar)
- ✅ No infinite loading state
- ✅ Error toast notification appears
- ✅ Application doesn't crash
- ✅ Can retry after backend restarts

**Status**: ☐ Pass / ☐ Fail (Optional test)

**Notes**:
```
Error message: ___
Recovery: ☐ Manual refresh needed / ☐ Auto-retry worked
```

---

### **TC-14: Responsive Design - Mobile View**

**Objective**: Verify UI works on mobile devices

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Test pending approvals page and detail page

**Expected Results**:
- ✅ Layout adapts to mobile screen
- ✅ Table scrollable horizontally (if needed)
- ✅ Buttons accessible and tappable
- ✅ Dialogs displayed correctly
- ✅ SideNav becomes mobile drawer/menu
- ✅ No horizontal overflow

**Status**: ☐ Pass / ☐ Fail

**Notes**:
```
Device tested: ___
Issues: ___
```

---

### **TC-15: Performance - Loading States**

**Objective**: Verify loading states display correctly

**Steps**:
1. Open Network tab in DevTools
2. Throttle network to "Slow 3G"
3. Navigate to pending approvals
4. Navigate to request detail
5. Observe loading states

**Expected Results**:
- ✅ Skeleton loaders appear while data fetching
- ✅ Skeleton matches final layout
- ✅ Buttons show loading state during API calls
- ✅ No "flash of empty content"
- ✅ Data appears smoothly after loading

**Status**: ☐ Pass / ☐ Fail (Optional test)

**Notes**:
```
Loading experience: ☐ Good / ☐ Needs improvement
```

---

## 🐛 Bug Report Template

If you find bugs, use this template:

```
**Bug ID**: DR-[number]
**Severity**: Critical / High / Medium / Low
**Test Case**: TC-[number]
**Environment**: Development / Staging / Production

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots**:
[Attach if applicable]

**Console Errors**:
[Copy any error messages]

**Additional Notes**:
[Any other relevant information]
```

---

## 📊 Test Summary

**Tester Name**: _______________
**Test Date**: _______________
**Test Duration**: ___ minutes
**Environment**: Development

### Results

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| Login & Auth | 2 | ___ | ___ | ___ |
| List View | 3 | ___ | ___ | ___ |
| Detail View | 1 | ___ | ___ | ___ |
| Approve Flow | 2 | ___ | ___ | ___ |
| Reject Flow | 2 | ___ | ___ | ___ |
| Navigation | 1 | ___ | ___ | ___ |
| Error Handling | 2 | ___ | ___ | ___ |
| Responsive | 1 | ___ | ___ | ___ |
| Performance | 1 | ___ | ___ | ___ |
| **TOTAL** | **15** | **___** | **___** | **___** |

### Overall Status
☐ **PASS** - All critical tests passed, ready for next phase
☐ **PASS WITH ISSUES** - Minor issues found, can proceed with fixes
☐ **FAIL** - Critical issues found, requires fixes before proceeding

### Critical Issues Found
```
[List any blocking issues that must be fixed]
```

### Non-Critical Issues
```
[List minor issues or improvements]
```

### Recommendations
```
[Any suggestions for improvement]
```

---

## 🔗 Backend Endpoints to Verify

QA team should coordinate with backend team to verify these endpoints exist:

1. **GET** `/api/v1/doctors/pending-approvals`
   - Returns: Array of TestRequest with status `RESULT_READY`
   - Auth: Required (DOCTOR role)

2. **GET** `/api/v1/doctors/requests/:id`
   - Returns: Single TestRequest with samples and results
   - Auth: Required (DOCTOR role)

3. **POST** `/api/v1/doctors/requests/:id/approve`
   - Body: None (or minimal)
   - Returns: Success message
   - Auth: Required (DOCTOR role)

4. **POST** `/api/v1/doctors/requests/:id/reject`
   - Body: `{reason: string}` (required)
   - Returns: Success message
   - Auth: Required (DOCTOR role)

---

## 📝 Notes for QA Team

1. **Test Data**: Coordinate with backend team to ensure adequate test data exists
2. **User Accounts**: Verify you have access to a DOCTOR role account
3. **Database State**: Some tests may modify data - use development environment only
4. **Browser**: Test on Chrome, Firefox, and Safari if possible
5. **Console Errors**: Always check browser console for JavaScript errors
6. **Network Tab**: Monitor API calls to verify correct endpoints being called

---

**Document Version**: 1.0
**Created**: 2025-11-18
**Last Updated**: 2025-11-18
**Contact**: Development Team
