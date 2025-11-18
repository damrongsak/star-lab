# Sign-Out Feature Testing Guide

## Implementation Complete ✅

The sign-out feature has been successfully implemented in the TopNav component.

## What Was Changed

### File: `apps/frontend/app/components/TopNav.tsx`

**Added:**
1. ✅ Imported `useAuth` hook from AuthContext
2. ✅ Imported Shadcn UI DropdownMenu components
3. ✅ Imported Link from Next.js
4. ✅ Integrated user state and logout function from AuthContext
5. ✅ Replaced static user icon button with interactive DropdownMenu
6. ✅ Added user email and role display in dropdown header
7. ✅ Added "Profile Settings" menu item (links to /profile)
8. ✅ Added "Sign Out" menu item with logout functionality

## How It Works

1. **User clicks the user icon** → Dropdown menu opens
2. **Dropdown displays:**
   - User's email address
   - User's role (capitalized, e.g., "Customer", "Admin")
   - "Profile Settings" link
   - "Sign Out" button (in red/destructive color)
3. **User clicks "Sign Out"** → Triggers `logout()` function
4. **Logout process:**
   - Deletes JWT token from cookies
   - Clears user state in AuthContext
   - Redirects to `/login` page
5. **After logout:**
   - User cannot access protected routes
   - Middleware redirects to login if attempting to access protected pages

## Testing Checklist

Please test the following:

### ✅ Visual Tests
- [ ] Click user icon in top navigation bar
- [ ] Verify dropdown menu appears below the icon
- [ ] Verify user email is displayed correctly
- [ ] Verify user role is displayed and capitalized
- [ ] Verify "Profile Settings" link is visible
- [ ] Verify "Sign Out" button is visible in red/destructive color
- [ ] Verify dropdown closes when clicking outside
- [ ] Test dark mode appearance of dropdown

### ✅ Functional Tests
1. **Sign Out Test:**
   - [ ] Click "Sign Out" button
   - [ ] Verify redirect to `/login` page
   - [ ] Open browser DevTools → Application → Cookies
   - [ ] Verify "token" cookie has been deleted

2. **Route Protection Test:**
   - [ ] After logout, try accessing `/dashboard`
   - [ ] Verify redirect back to `/login`
   - [ ] Try accessing `/requests`
   - [ ] Verify redirect back to `/login`

3. **Re-login Test:**
   - [ ] Login again with valid credentials
   - [ ] Verify token is set in cookies
   - [ ] Verify user info appears in dropdown
   - [ ] Verify can access protected routes again

4. **Profile Link Test:**
   - [ ] Click "Profile Settings" in dropdown
   - [ ] Verify navigation to `/profile` page

### ✅ Mobile Responsive Tests
- [ ] Test on mobile viewport (< 768px)
- [ ] Verify dropdown appears correctly
- [ ] Verify touch interactions work
- [ ] Verify text is readable on small screens

### ✅ Edge Cases
- [ ] Test when not logged in (dropdown should show "Guest" / "No role")
- [ ] Test with different user roles (CUSTOMER, ADMIN, LAB_ADMIN, etc.)
- [ ] Test rapid clicking on sign out button
- [ ] Test keyboard navigation (Tab to user icon, Enter to open, Arrow keys to navigate)

## To Start Testing

1. **Start the frontend development server:**
   ```bash
   pnpm --filter starlab-frontend dev
   ```

2. **Open browser to:** `http://localhost:3000`

3. **Login with a test account**

4. **Look for the user icon** in the top right corner of the navigation bar

5. **Click the icon** and test the dropdown menu

## Expected Behavior

### Before Logout:
- User is authenticated
- Can access dashboard, requests, profile pages
- JWT token exists in cookies
- User info displays in dropdown

### After Logout:
- User is not authenticated
- Cannot access protected routes (redirects to login)
- JWT token is deleted from cookies
- Redirected to `/login` page

## Notes

- **Authentication Method:** Client-side JWT with cookie storage
- **No backend logout endpoint required** (stateless JWT architecture)
- **Token expiration:** Already handled by AuthContext (checks on mount)
- **Security:** Middleware validates JWT on server-side before rendering protected pages

## Implementation Details

**Lines Changed:** ~15 new lines, ~5 modified lines
**Components Used:** Shadcn UI DropdownMenu (already installed)
**Integration:** useAuth hook from AuthContext
**Styling:** Tailwind CSS with theme support (dark/light mode)

---

**Status:** ✅ Ready for Testing
**Completed:** 2025-11-18
**Next Steps:** Manual testing, then mark as complete in Implementation-Status.md
