# Authentication and Authorization API Documentation

This document provides comprehensive documentation for the Authentication and Authorization APIs in the StarLab Laboratory Management System. All authentication-related endpoints are located in the `AuthController` and provide secure user registration, login, profile management, and password management functionality.

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Authorization System](#authorization-system)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Schemas](#requestresponse-schemas)
6. [Security Implementation](#security-implementation)
7. [Error Handling](#error-handling)
8. [Business Rules](#business-rules)
9. [Integration Examples](#integration-examples)
10. [Testing Guidelines](#testing-guidelines)

## Overview

The authentication system supports:

- **Customer Registration**: Complete company and operator profile creation
- **Secure Authentication**: JWT-based token authentication
- **Role-Based Access Control**: Support for CUSTOMER, ADMIN, LAB_TECHNICIAN, and DOCTOR roles
- **Email Verification**: Email confirmation workflow
- **Password Management**: Secure password change functionality
- **Profile Management**: User and customer profile retrieval

### Base URL

All authentication endpoints are prefixed with: `/api/v1/auth`

### Authentication Method

- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Token Expiration**: Configurable (default: 24 hours)

## Authentication Flow

### 1. Customer Registration Flow

```
1. POST /api/v1/auth/register (Customer data + User credentials)
2. System creates User account with CUSTOMER role
3. System creates Customer profile linked to User
4. Optional: Email verification token sent
5. Response includes JWT token for immediate access
```

### 2. Login Flow

```
1. POST /api/v1/auth/login (Email + Password)
2. System validates credentials
3. Response includes JWT token + user profile data
4. Token used for subsequent authenticated requests
```

### 3. Email Verification Flow

```
1. GET /api/v1/auth/verify-email/{token}
2. System validates verification token
3. User email status updated to confirmed
4. User gains full system access
```

## Authorization System

### Role Hierarchy

1. **ADMIN**: Full system access
2. **LAB_TECHNICIAN**: Lab operations and test management
3. **DOCTOR**: Medical review and approval functions
4. **CUSTOMER**: Customer portal access, test requests, invoices

### Protected Endpoints

- All endpoints except `/register`, `/login`, and `/verify-email` require authentication
- Role-specific access controlled by middleware in respective controllers
- Token validation handled by `authMiddleware`

## API Endpoints

### 1. Register Customer Account

**POST** `/api/v1/auth/register`

Registers a new customer user with complete company and operator information.

**Request Body:**

```json
{
  "email": "john.doe@starlab.com",
  "password": "SecurePassword123!",
  "companyNameEn": "StarLab Company Ltd.",
  "companyNameTh": "บริษัท สตาร์แล็บ จำกัด",
  "legalEntityId": "0123456789012",
  "companyDescription": "Leading laboratory testing services",
  "companyAddressLine1": "123 Main Street",
  "companyProvince": "Bangkok",
  "companyDistrict": "Chatuchak",
  "companySubDistrict": "Chatuchak",
  "companyZipCode": "10900",
  "companyPhone": "+66-2-123-4567",
  "companyFax": "+66-2-123-4568",
  "operatorIdCard": "1234567890123",
  "operatorPrefix": "Mr.",
  "operatorFirstName": "John",
  "operatorLastName": "Doe",
  "operatorMobilePhone": "+66-81-234-5678",
  "operatorPhone": "+66-2-123-4569",
  "receiptAddressBuildingFloorNumber": "456 Business Center, 5th Floor",
  "receiptProvince": "Bangkok",
  "receiptDistrict": "Watthana",
  "receiptSubDistrict": "Khlong Toei Nuea",
  "receiptZipCode": "10110",
  "receiptPhone": "+66-2-234-5678",
  "receiptFax": "+66-2-234-5679"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@starlab.com",
    "role": "CUSTOMER",
    "isEmailConfirmed": false
  },
  "customer": {
    "id": "cust-123e4567-e89b-12d3-a456-426614174000",
    "companyNameEn": "StarLab Company Ltd.",
    "operatorFirstName": "John",
    "operatorLastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login

**POST** `/api/v1/auth/login`

Authenticate user credentials and receive access token.

**Request Body:**

```json
{
  "email": "john.doe@starlab.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@starlab.com",
    "role": "CUSTOMER",
    "isEmailConfirmed": true
  },
  "customer": {
    "id": "cust-123e4567-e89b-12d3-a456-426614174000",
    "companyNameEn": "StarLab Company Ltd.",
    "operatorFirstName": "John",
    "operatorLastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get User Profile

**GET** `/api/v1/auth/profile`

Retrieve authenticated user's profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@starlab.com",
    "role": "CUSTOMER",
    "isEmailConfirmed": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-06-27T14:20:00Z"
  },
  "customer": {
    "id": "cust-123e4567-e89b-12d3-a456-426614174000",
    "companyNameEn": "StarLab Company Ltd.",
    "companyNameTh": "บริษัท สตาร์แล็บ จำกัด",
    "operatorFirstName": "John",
    "operatorLastName": "Doe",
    "operatorMobilePhone": "+66-81-234-5678",
    "isActive": true
  }
}
```

### 4. Verify Email

**GET** `/api/v1/auth/verify-email/{token}`

Verify user's email address using verification token.

**Parameters:**

- `token` (path): Email verification token

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 5. Change Password

**POST** `/api/v1/auth/change-password`

Change user's password (requires current password verification).

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Request/Response Schemas

### RegisterRequest Schema

```json
{
  "type": "object",
  "required": [
    "email",
    "password",
    "companyNameEn",
    "legalEntityId",
    "companyAddressLine1",
    "companyProvince",
    "companyDistrict",
    "companySubDistrict",
    "companyZipCode",
    "companyPhone",
    "operatorIdCard",
    "operatorFirstName",
    "operatorLastName",
    "operatorMobilePhone",
    "receiptAddressBuildingFloorNumber",
    "receiptProvince",
    "receiptDistrict",
    "receiptSubDistrict",
    "receiptZipCode",
    "receiptPhone"
  ],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "description": "User password (minimum 8 characters)"
    },
    "companyNameEn": {
      "type": "string",
      "description": "Company name in English"
    },
    "companyNameTh": {
      "type": "string",
      "description": "Company name in Thai (optional)"
    },
    "legalEntityId": {
      "type": "string",
      "description": "Legal entity identification number"
    }
    // ... additional properties as defined in schema
  }
}
```

### LoginRequest Schema

```json
{
  "type": "object",
  "required": ["email", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "password": {
      "type": "string",
      "description": "User password"
    }
  }
}
```

### AuthResponse Schema

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Operation success status"
    },
    "message": {
      "type": "string",
      "description": "Response message"
    },
    "user": {
      "$ref": "#/components/schemas/User"
    },
    "customer": {
      "$ref": "#/components/schemas/Customer"
    },
    "token": {
      "type": "string",
      "description": "JWT access token"
    }
  }
}
```

### ChangePasswordRequest Schema

```json
{
  "type": "object",
  "required": ["currentPassword", "newPassword"],
  "properties": {
    "currentPassword": {
      "type": "string",
      "description": "Current user password"
    },
    "newPassword": {
      "type": "string",
      "minLength": 8,
      "description": "New password (minimum 8 characters)"
    }
  }
}
```

### UserProfile Schema

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "user": {
      "$ref": "#/components/schemas/User"
    },
    "customer": {
      "oneOf": [{ "$ref": "#/components/schemas/Customer" }, { "type": "null" }]
    }
  }
}
```

## Security Implementation

### JWT Token Configuration

- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Issuer**: StarLab System
- **Claims**: userId, email, role, isEmailConfirmed

### Password Security

- **Minimum Length**: 8 characters
- **Hashing**: bcrypt with salt rounds
- **Validation**: Server-side validation for strength
- **Storage**: Never stored in plain text

### Middleware Chain

1. **authMiddleware**: Token validation and user context injection
2. **roleMiddleware**: Role-based access control
3. **validateMiddleware**: Request validation using Zod schemas

### Security Headers

- **CORS**: Configured for allowed origins
- **Rate Limiting**: Implemented for authentication endpoints
- **Input Sanitization**: All inputs validated and sanitized

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors array
}
```

### HTTP Status Codes

| Status Code | Description           | Example Scenarios                           |
| ----------- | --------------------- | ------------------------------------------- |
| 200         | Success               | Login, profile retrieval, password change   |
| 201         | Created               | User registration                           |
| 400         | Bad Request           | Validation errors, invalid current password |
| 401         | Unauthorized          | Invalid credentials, missing/invalid token  |
| 404         | Not Found             | User not found                              |
| 409         | Conflict              | Email already exists                        |
| 500         | Internal Server Error | Database errors, system failures            |

### Common Error Scenarios

#### Authentication Errors

- **Invalid Credentials**: `401 - Invalid email or password`
- **Token Expired**: `401 - Token has expired`
- **Invalid Token**: `401 - Invalid token format`

#### Validation Errors

- **Email Format**: `400 - Invalid email format`
- **Password Strength**: `400 - Password must be at least 8 characters`
- **Required Fields**: `400 - Required field missing`

#### Business Logic Errors

- **Email Exists**: `409 - Email already exists`
- **User Not Found**: `404 - User not found`
- **Incorrect Password**: `400 - Current password is incorrect`

## Business Rules

### Registration Rules

1. **Email Uniqueness**: Each email can only be registered once
2. **Password Requirements**: Minimum 8 characters, no specific complexity rules
3. **Role Assignment**: New registrations automatically assigned CUSTOMER role
4. **Customer Profile**: Automatically created for all CUSTOMER users
5. **Email Verification**: Optional but recommended for full access

### Authentication Rules

1. **Login Attempts**: No built-in rate limiting (recommend implementing)
2. **Token Validity**: 24-hour expiration with no refresh mechanism
3. **Session Management**: Stateless JWT-based authentication
4. **Multi-Device**: Same token can be used across multiple devices

### Authorization Rules

1. **Route Protection**: All routes except auth endpoints require valid token
2. **Role Verification**: Performed at controller level for role-specific actions
3. **Customer Data**: Customers can only access their own data
4. **Admin Override**: Admin role has system-wide access

## Integration Examples

### Frontend Authentication Integration

#### Registration Flow

```javascript
// Register new customer
const registerCustomer = async (customerData) => {
  try {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const result = await response.json();

    if (response.ok) {
      // Store token for subsequent requests
      localStorage.setItem("authToken", result.token);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
```

#### Login Flow

```javascript
// User login
const loginUser = async (email, password) => {
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", result.token);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
```

#### Authenticated Requests

```javascript
// Make authenticated API request
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  return fetch(url, { ...defaultOptions, ...options });
};

// Get user profile
const getUserProfile = async () => {
  const response = await makeAuthenticatedRequest("/api/v1/auth/profile");
  return response.json();
};
```

### Backend Service Integration

#### Express.js Middleware Usage

```javascript
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

// Protect route with authentication
app.get("/api/v1/protected", authMiddleware, (req, res) => {
  const userId = req.user.userId;
  // Handle authenticated request
});

// Protect route with role-based access
app.get(
  "/api/v1/admin-only",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (req, res) => {
    // Handle admin-only request
  },
);
```

## Testing Guidelines

### Unit Testing

Test files are located in `src/__tests__/`:

- `UserService.test.ts`: User authentication and management
- `AuthController.test.ts`: Authentication endpoint testing

### Test Scenarios

#### Registration Testing

```javascript
describe("User Registration", () => {
  test("should register new customer successfully", async () => {
    const customerData = {
      email: "test@example.com",
      password: "password123",
      // ... other required fields
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(customerData)
      .expect(201);

    expect(response.body.user.email).toBe(customerData.email);
    expect(response.body.token).toBeDefined();
  });

  test("should reject duplicate email registration", async () => {
    // Test duplicate email scenario
  });
});
```

#### Authentication Testing

```javascript
describe("User Authentication", () => {
  test("should login with valid credentials", async () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test("should reject invalid credentials", async () => {
    // Test invalid login scenario
  });
});
```

### Integration Testing

- Test complete authentication flows
- Verify token-based access to protected endpoints
- Test role-based authorization
- Validate error handling across different scenarios

### Performance Testing

- Monitor JWT token generation/validation performance
- Test concurrent login scenarios
- Validate database query performance for user lookups

---

**Last Updated**: June 28, 2025  
**API Version**: v1  
**Documentation Version**: 2.0

For technical support or questions about the Authentication API, please contact the development team.
