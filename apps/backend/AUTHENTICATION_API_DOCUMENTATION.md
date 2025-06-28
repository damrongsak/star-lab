# Authentication & Authorization API Documentation

## Overview

The Authentication API provides comprehensive user authentication and authorization services for the laboratory management system. This includes user registration, login, email verification, profile management, and password changes with JWT-based authentication.

## Base URL

```
/api/v1/auth
```

## Authentication Flow

The system uses JWT (JSON Web Tokens) for stateless authentication. After successful login, clients receive a JWT token that must be included in the Authorization header for protected endpoints.

## Endpoints

### 1. Register New User (Customer)

- **POST** `/api/v1/auth/register`
- **Description**: Register a new customer account with complete company and operator information
- **Access**: Public (no authentication required)
- **Request Body**: Complete customer registration data including company details
- **Response**: User account, customer profile, and JWT token
- **Business Logic**:
  - Creates user account with CUSTOMER role
  - Creates associated customer profile
  - Sends email verification link
  - Returns authentication token

### 2. User Login

- **POST** `/api/v1/auth/login`
- **Description**: Authenticate user with email and password
- **Access**: Public (no authentication required)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: User information, customer profile (if applicable), and JWT token
- **Business Logic**:
  - Validates credentials against database
  - For customer users, includes customer profile data
  - Returns JWT token for subsequent requests

### 3. Email Verification

- **GET** `/api/v1/auth/verify-email/{token}`
- **Description**: Verify user's email address using verification token
- **Access**: Public (no authentication required)
- **Parameters**:
  - `token` (path): Email verification token from registration email
- **Response**: Confirmation of email verification
- **Business Logic**:
  - Validates verification token
  - Marks user email as confirmed
  - Token expires after specified time period

### 4. Get User Profile

- **GET** `/api/v1/auth/profile`
- **Description**: Retrieve authenticated user's profile information
- **Access**: Protected (requires valid JWT token)
- **Response**: User account details and associated profile data
- **Business Logic**:
  - Returns user account information
  - For customers, includes complete customer profile
  - For other roles, returns role-specific data

### 5. Change Password

- **POST** `/api/v1/auth/change-password`
- **Description**: Change user's password with current password verification
- **Access**: Protected (requires valid JWT token)
- **Request Body**:
  ```json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword456!"
  }
  ```
- **Response**: Success confirmation
- **Business Logic**:
  - Verifies current password
  - Validates new password strength
  - Updates password with secure hashing

## Data Models

### User Schema

```json
{
  "id": "string (UUID)",
  "email": "string (email format)",
  "role": "enum [ADMIN, LAB_ADMIN, CUSTOMER, TECHNICIAN, DOCTOR, APPROVAL]",
  "isEmailConfirmed": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Register Request Schema

```json
{
  "email": "string (email, required)",
  "password": "string (min 8 chars, required)",
  "companyNameEn": "string (required)",
  "companyNameTh": "string (required)",
  "legalEntityId": "string (required)",
  "companyDescription": "string (optional)",
  "companyAddressLine1": "string (required)",
  "companyProvince": "string (required)",
  "companyDistrict": "string (required)",
  "companySubDistrict": "string (required)",
  "companyZipCode": "string (required)",
  "companyPhone": "string (required)",
  "companyFax": "string (optional)",
  "operatorIdCard": "string (required)",
  "operatorPrefix": "string (required)",
  "operatorFirstName": "string (required)",
  "operatorLastName": "string (required)",
  "operatorMobilePhone": "string (required)",
  "operatorPhone": "string (optional)",
  "receiptAddressBuildingFloorNumber": "string (required)",
  "receiptProvince": "string (required)",
  "receiptDistrict": "string (required)",
  "receiptSubDistrict": "string (required)",
  "receiptZipCode": "string (required)",
  "receiptPhone": "string (required)",
  "receiptFax": "string (optional)"
}
```

### Login Request Schema

```json
{
  "email": "string (email, required)",
  "password": "string (required)"
}
```

### Auth Response Schema

```json
{
  "success": "boolean",
  "message": "string",
  "user": "User object",
  "customer": "Customer object (nullable)",
  "token": "string (JWT token)"
}
```

### Change Password Request Schema

```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (min 8 chars, required)"
}
```

## User Roles and Permissions

### ADMIN

- **Full system access**
- Can manage all users and data
- Access to all administrative functions
- Can create other admin accounts

### LAB_ADMIN

- **Laboratory management access**
- Can manage lab operations
- Can view and manage test requests
- Can manage lab technicians

### CUSTOMER

- **Customer portal access**
- Can create and manage test requests
- Can view own invoices and results
- Limited to own data only

### TECHNICIAN

- **Lab operations access**
- Can process samples and tests
- Can record test results
- Limited administrative access

### DOCTOR

- **Medical review access**
- Can review and approve test results
- Can manage assigned test requests
- Medical expertise validation

### APPROVAL

- **Approval workflow access**
- Can approve test requests
- Limited to approval functions
- Workflow management

## JWT Token Details

### Token Structure

- **Header**: Algorithm and token type
- **Payload**: User ID, role, email, expiration
- **Signature**: Secure signature for verification

### Token Expiration

- **Default**: 24 hours for regular users
- **Admin**: Extended expiration for administrative accounts
- **Refresh**: Automatic refresh mechanism available

### Token Usage

```
Authorization: Bearer <jwt-token>
```

## Security Features

### Password Requirements

- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Must contain at least one special character
- Cannot be common/easily guessable passwords

### Email Verification

- Required for account activation
- Token-based verification system
- Expiration time for security
- Resend verification option available

### Account Security

- Password hashing with bcrypt
- Rate limiting on login attempts
- Account lockout after failed attempts
- Secure session management

## Error Responses

### Common Error Codes

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Invalid credentials, missing token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: User or resource not found
- **409 Conflict**: Email already exists
- **422 Unprocessable Entity**: Validation failed
- **500 Internal Server Error**: Server-side errors

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Validation Rules

### Email Validation

- Valid email format required
- Must be unique in the system
- Case-insensitive comparison
- Domain validation for business emails

### Password Validation

- Minimum 8 characters
- Maximum 128 characters
- Strength requirements enforced
- History check to prevent reuse

### Company Information

- Legal entity ID must be valid format
- Phone numbers must follow Thai format
- Address fields required for billing
- Company names in both English and Thai

## Rate Limiting

### Login Attempts

- Maximum 5 failed attempts per IP per hour
- Account lockout after 10 failed attempts
- Exponential backoff for repeated failures

### Registration

- Maximum 3 registration attempts per IP per hour
- Email domain validation for legitimate businesses

### Email Verification

- Maximum 5 verification attempts per token
- Token expires after 24 hours
- Rate limited resend functionality

## Best Practices

### Client Implementation

1. **Store JWT securely** (httpOnly cookies recommended)
2. **Handle token expiration** gracefully
3. **Implement proper logout** (token invalidation)
4. **Validate all user inputs** on client side
5. **Use HTTPS** for all authentication requests

### Security Considerations

1. **Never log sensitive data** (passwords, tokens)
2. **Implement CSRF protection** for forms
3. **Use secure headers** for authentication
4. **Validate token integrity** on each request
5. **Monitor for suspicious activity**

## Integration Examples

### Registration Flow

```javascript
// 1. Register new customer
const registerData = {
  email: "customer@company.com",
  password: "SecurePass123!",
  companyNameEn: "Company Ltd.",
  // ... other required fields
};

const response = await fetch("/api/v1/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(registerData),
});

const result = await response.json();
// Store token securely
localStorage.setItem("authToken", result.token);
```

### Login Flow

```javascript
// 2. Login existing user
const loginData = {
  email: "customer@company.com",
  password: "SecurePass123!",
};

const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(loginData),
});

const result = await response.json();
// Store token and user data
localStorage.setItem("authToken", result.token);
localStorage.setItem("userData", JSON.stringify(result.user));
```

### Authenticated Requests

```javascript
// 3. Make authenticated requests
const token = localStorage.getItem("authToken");

const response = await fetch("/api/v1/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

const profile = await response.json();
```

### Password Change

```javascript
// 4. Change password
const passwordData = {
  currentPassword: "OldPass123!",
  newPassword: "NewSecurePass456!",
};

const response = await fetch("/api/v1/auth/change-password", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(passwordData),
});
```

## Troubleshooting

### Common Issues

1. **Token Expired**

   - Error: 401 Unauthorized
   - Solution: Refresh token or re-login

2. **Email Not Verified**

   - Error: Account restricted
   - Solution: Check email and click verification link

3. **Invalid Credentials**

   - Error: 401 Invalid email or password
   - Solution: Verify email/password combination

4. **Account Locked**

   - Error: Too many failed attempts
   - Solution: Wait for lockout period or contact admin

5. **Validation Errors**
   - Error: 400 with field-specific messages
   - Solution: Check input format and requirements

### Debug Mode

In development, additional error details are provided in the response for debugging purposes. In production, error messages are sanitized for security.

## API Versioning

The authentication API is versioned using URL path versioning (`/api/v1/auth`). Breaking changes will result in a new version path (`/api/v2/auth`) while maintaining backward compatibility for existing versions.
