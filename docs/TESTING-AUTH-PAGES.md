# Authentication Pages Testing Guide

## 🚀 Setup

### 1. Start Backend
```bash
pnpm --filter starlab-backend dev
```
Backend should be running on: http://localhost:5001

### 2. Start Frontend
```bash
pnpm --filter starlab-frontend dev
```
Frontend should be running on: http://localhost:3000

### 3. Ensure Database is Running
```bash
docker-compose up -d
```

---

## 🧪 Test Suite

### TEST 1: Registration Page (/register)

**URL**: http://localhost:3000/register

**Test Steps:**

1. **Navigate** to registration page
2. **Fill in Account Information:**
   - Email: `testuser@example.com`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Fill in Company Information:**
   - Company Name: `Test Company Ltd`
   - Tax ID: `1234567890` (optional)

4. **Fill in Billing Address:**
   - Address Line 1: `123 Main Street`
   - Address Line 2: `Suite 100` (optional)
   - City: `Bangkok`
   - State/Province: `Bangkok`
   - Zip Code: `10100`
   - Country: `Thailand`

5. **Test Shipping Address Toggle:**
   - Check "Same as billing address" → Shipping fields should hide
   - Uncheck it → Shipping fields should appear
   - Check it again for testing

6. **Submit Form:**
   - Click "Register" button
   - Watch for loading spinner
   - Verify success message appears

**Expected Results:**
- ✅ Form validation works (try submitting empty fields)
- ✅ Password confirmation validation works
- ✅ Loading state shows during submission
- ✅ Success message: "Registration successful! Please check your email to verify your account."
- ✅ No console errors
- ✅ Backend receives registration request

**Error Cases to Test:**
- Try registering with the same email twice (should show "Email already exists")
- Password mismatch (should show validation error)
- Missing required fields (should show field-level errors)

---

### TEST 2: Login Page (/login)

**URL**: http://localhost:3000/login

**Test Steps:**

1. **Navigate** to login page
2. **View the UI:**
   - Verify "STAR-LAB Login" heading
   - Check "Remember me" checkbox
   - See "Forgot password?" link
   - See "Register here" link

3. **Attempt Login with Invalid Credentials:**
   - Email: `wrong@example.com`
   - Password: `wrongpassword`
   - Submit
   - Verify error message appears

4. **Login with Valid Credentials:**
   - Email: `testuser@example.com` (from registration)
   - Password: `password123`
   - Check "Remember me"
   - Submit

5. **After Successful Login:**
   - Should redirect to `/dashboard` (or show error if dashboard doesn't exist yet)
   - Check localStorage for token

**Expected Results:**
- ✅ Form validation works
- ✅ Loading spinner appears during submission
- ✅ Invalid credentials show error message
- ✅ Valid credentials redirect to dashboard
- ✅ "Remember me" stores email in localStorage
- ✅ Token is stored in localStorage

**Test Redirect Parameter:**
- Navigate to: `http://localhost:3000/login?redirect=/profile`
- Login successfully
- Should redirect to `/profile` instead of `/dashboard`

---

### TEST 3: Email Verification Page (/verify-email)

**URL**: http://localhost:3000/verify-email?token=YOUR_TOKEN_HERE

**Test Steps:**

1. **Test Without Token:**
   - Navigate to: `http://localhost:3000/verify-email`
   - Should show error: "Invalid verification link"

2. **Test With Invalid Token:**
   - Navigate to: `http://localhost:3000/verify-email?token=invalid123`
   - Should show loading state briefly
   - Then show error: "Invalid or expired verification token"

3. **Test With Valid Token:**
   (You'll need a real token from the registration email or database)
   - Get token from backend logs or database
   - Navigate to: `http://localhost:3000/verify-email?token=REAL_TOKEN`
   - Should show loading state
   - Then show success with checkmark icon
   - Should show countdown: "Redirecting in X seconds..."
   - Should auto-redirect to `/dashboard` after 5 seconds

**Expected Results:**
- ✅ Loading state shows initially
- ✅ Success state shows green checkmark icon
- ✅ Error state shows red X icon
- ✅ Countdown works correctly
- ✅ Auto-redirect happens after countdown
- ✅ "Go to Dashboard" button works

---

### TEST 4: Unauthorized Page (/unauthorized)

**URL**: http://localhost:3000/unauthorized

**Test Steps:**

1. **Navigate** to unauthorized page
2. **Verify UI:**
   - Shows shield/warning icon
   - Displays "403 - Unauthorized"
   - Shows helpful message
   - Has "Go to Home" button

3. **Click "Go to Home":**
   - Should navigate to homepage

**Expected Results:**
- ✅ Page displays correctly
- ✅ Warning icon is visible
- ✅ Professional, clear messaging
- ✅ Navigation button works

---

### TEST 5: Protected Route Middleware

**Test Steps:**

1. **Test Unauthenticated Access:**
   - Clear localStorage (to remove token)
   - Try to access: `http://localhost:3000/dashboard`
   - Should redirect to: `/login?redirect=/dashboard`

2. **Test Authenticated Access:**
   - Login successfully
   - Try to access: `http://localhost:3000/dashboard`
   - Should allow access (or show 404 if dashboard doesn't exist yet)

3. **Test Role-Based Access:**
   - Login as CUSTOMER role
   - Try to access: `http://localhost:3000/admin/users`
   - Should redirect to `/unauthorized`

**Expected Results:**
- ✅ Unauthenticated users redirected to login
- ✅ Redirect parameter preserved
- ✅ Authenticated users can access protected routes
- ✅ Wrong roles redirect to unauthorized page

---

## 🐛 Common Issues & Solutions

### Issue: "Token is not defined"
**Solution**: Make sure AuthContext is wrapped around your app in layout.tsx

### Issue: "Cannot connect to backend"
**Solution**:
- Check backend is running on port 5001
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS is enabled in backend

### Issue: Forms not submitting
**Solution**:
- Check browser console for errors
- Verify React Hook Form and Zod are installed
- Check network tab for API calls

### Issue: Middleware not working
**Solution**:
- Verify middleware.ts is in the app directory root
- Check token is in cookies (not just localStorage)
- Note: Middleware reads from cookies, AuthContext uses localStorage

### Issue: Registration succeeds but email not sent
**Solution**:
- Check backend SMTP configuration
- Verify EmailService is properly configured
- Check backend logs for email errors

---

## ✅ Testing Checklist

### Registration Page
- [ ] Form renders correctly
- [ ] All fields have proper validation
- [ ] Password confirmation works
- [ ] "Same as billing" toggle works
- [ ] Loading state displays
- [ ] Success message shows
- [ ] Error handling works
- [ ] Mobile responsive

### Login Page
- [ ] Form renders correctly
- [ ] Email and password validation
- [ ] "Remember me" works
- [ ] Loading spinner shows
- [ ] Successful login redirects correctly
- [ ] Error messages display
- [ ] Redirect parameter works
- [ ] Mobile responsive

### Email Verification Page
- [ ] No token shows error
- [ ] Invalid token shows error
- [ ] Valid token shows success
- [ ] Loading state works
- [ ] Countdown timer works
- [ ] Auto-redirect works
- [ ] Manual redirect button works
- [ ] Mobile responsive

### Unauthorized Page
- [ ] Page displays correctly
- [ ] Icon shows properly
- [ ] Navigation button works
- [ ] Mobile responsive

### Middleware
- [ ] Blocks unauthenticated access
- [ ] Allows authenticated access
- [ ] Enforces role-based access
- [ ] Redirect parameter works
- [ ] Token expiration handled

---

## 📊 Test Results

| Page/Feature | Status | Notes |
|--------------|--------|-------|
| Registration | ⬜ | |
| Login | ⬜ | |
| Email Verification | ⬜ | |
| Unauthorized | ⬜ | |
| Middleware | ⬜ | |

**Legend**: ✅ Pass | ❌ Fail | ⬜ Not Tested | ⚠️ Partial

---

## 🚀 Next Steps After Testing

1. Fix any bugs found during testing
2. Add forgot password functionality (optional)
3. Implement dashboard page (to complete the auth flow)
4. Add toast notifications for better UX
5. Implement proper error boundaries
6. Add loading skeletons
7. Move to Customer Portal features

---

**Testing Date**: ___________
**Tested By**: ___________
**Results**: ___________
