# Customer API Documentation Summary

## Overview

Comprehensive Swagger API documentation has been added for all `/api/v1/customers` endpoints in the Customer Management System.

## Customer Profile Endpoints (Authenticated Customer Access)

### 1. Get Customer Profile

- **GET** `/api/v1/customers/profile`
- **Access**: Authenticated customers only
- **Description**: Retrieve the authenticated customer's complete profile information
- **Returns**: Full customer object with user details

### 2. Update Customer Profile

- **PUT** `/api/v1/customers/profile`
- **Access**: Authenticated customers only
- **Description**: Update customer profile information with validation
- **Features**:
  - Complete form validation using Zod schema
  - All fields are optional for updates
  - Conflict detection for duplicate data
  - Detailed error messages for validation failures

### 3. Get Customer Statistics

- **GET** `/api/v1/customers/statistics`
- **Access**: Authenticated customers only
- **Description**: Retrieve dashboard statistics including:
  - Total/pending/completed test requests
  - Total/paid/pending invoices
  - Amount summaries

## Admin Management Endpoints (Admin/Lab Admin Access Only)

### 4. Get All Customers

- **GET** `/api/v1/customers`
- **Access**: Admin/Lab Admin only
- **Description**: Paginated list of all customers
- **Query Parameters**: page, limit
- **Returns**: Customers with user information and pagination metadata

### 5. Get Customer by ID

- **GET** `/api/v1/customers/{id}`
- **Access**: Admin/Lab Admin only
- **Description**: Detailed customer information by ID
- **Returns**: Complete customer profile with user details and test request summary

### 6. Search Customers

- **GET** `/api/v1/customers/search`
- **Access**: Admin/Lab Admin only
- **Description**: Search customers by company name, email, or other criteria
- **Query Parameters**: q (search query)
- **Returns**: Array of matching customers

### 7. Delete Customer

- **DELETE** `/api/v1/customers/{id}`
- **Access**: Admin only (highest privilege required)
- **Description**: Delete customer and associated data
- **Validation**: Cannot delete customers with active test requests
- **Returns**: Success confirmation or conflict error

## Enhanced Customer Schema

### Complete Customer Object Includes:

- **Company Information**: English/Thai names, legal entity ID, description
- **Company Address**: Full address with province, district, sub-district, postal code
- **Contact Information**: Phone, fax numbers
- **Operator Details**: ID card, name, contact information
- **Receipt Address**: Separate billing address information
- **System Fields**: Active status, timestamps
- **Relations**: User account information

### Key Schema Features:

- All optional fields properly marked as nullable
- Realistic example values for Thai business context
- Proper field validation and constraints
- Comprehensive error response schemas

## Authentication & Authorization

### Role-Based Access Control:

- **Customer Profile Endpoints**: Require authentication, customer can only access own data
- **Admin List/Search Endpoints**: Require Admin or Lab Admin role
- **Admin Delete Endpoint**: Requires Admin role only (highest privilege)

### Security Features:

- Bearer token authentication required for all endpoints
- User ID extraction from JWT token
- Role-based middleware protection
- Proper unauthorized/forbidden error handling

## Validation & Error Handling

### Request Validation:

- Comprehensive Zod schema validation for profile updates
- Required field validation
- Format validation (emails, phone numbers, etc.)
- Business rule validation (unique constraints)

### Error Response Codes:

- **400**: Bad request/validation errors
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate data, active dependencies)
- **500**: Internal server error

### Detailed Error Messages:

- Validation errors include field paths and specific messages
- Business logic errors provide clear explanations
- Consistent error response format across all endpoints

## Data Examples

### Profile Update Example:

```json
{
  "companyNameEn": "StarLab Company Ltd.",
  "companyNameTh": "บริษัท สตาร์แล็บ จำกัด",
  "legalEntityId": "0123456789012",
  "companyPhone": "+66-2-123-4567",
  "operatorFirstName": "John",
  "operatorLastName": "Doe"
}
```

### Statistics Response Example:

```json
{
  "totalTestRequests": 25,
  "pendingRequests": 5,
  "completedRequests": 18,
  "totalInvoices": 20,
  "paidInvoices": 15,
  "totalAmount": 125000.0,
  "paidAmount": 95000.0
}
```

## Implementation Quality

### Code Quality Features:

- Comprehensive JSDoc comments with OpenAPI 3.0 specifications
- Proper TypeScript typing throughout
- Error handling with detailed logging
- Consistent response formats
- Production-ready validation and security

### Documentation Quality:

- Detailed request/response examples
- Clear parameter descriptions
- Comprehensive error handling documentation
- Role-based access clearly specified
- Realistic Thai business context examples

The Customer API documentation is now complete and production-ready, providing developers with comprehensive information for integrating with all customer management functionality.
