# Laboratory Management System API Documentation

## Overview

Comprehensive Swagger API documentation has been created for all major API controllers in the laboratory management system, including Test Requests, Customers, Lab Management, and Doctors.

## API Controllers Documented

### 1. Authentication API

- **Base Route**: `/api/v1/auth`
- **Documentation**: Complete Swagger documentation for authentication and authorization
- **Features**: User registration, login, email verification, profile management, password changes
- **Access Control**: JWT-based authentication with role-based permissions
- **Detailed Documentation**: [AUTHENTICATION_API_DOCUMENTATION_V2.md](./AUTHENTICATION_API_DOCUMENTATION_V2.md)
- **Legacy Documentation**: [AUTHENTICATION_API_DOCUMENTATION.md](./AUTHENTICATION_API_DOCUMENTATION.md)

### 2. Test Request API

- **Base Route**: `/api/v1/test-requests`
- **Documentation**: Complete Swagger documentation for all test request operations
- **Features**: Create, retrieve, update test requests and samples
- **Access Control**: Role-based access for customers, admins, and technicians

### 3. Customer API

- **Base Route**: `/api/customers`
- **Documentation**: Complete Swagger documentation for customer management
- **Features**: Profile management, statistics, admin operations
- **Access Control**: Customers can manage own profiles, admins have full access
- **Detailed Documentation**: [CUSTOMER_API_DOCUMENTATION.md](./CUSTOMER_API_DOCUMENTATION.md)

### 4. Lab Management API

- **Base Route**: `/api/lab`
- **Documentation**: Complete Swagger documentation for lab operations
- **Features**: Lab test management, result handling, statistics
- **Access Control**: Role-based access for different lab operations
- **Detailed Documentation**: [LAB_API_DOCUMENTATION.md](./LAB_API_DOCUMENTATION.md)

### 5. Doctor API

- **Base Route**: `/api/doctors`
- **Documentation**: Complete Swagger documentation for doctor management
- **Features**: Doctor profiles, workload tracking, test request assignments
- **Access Control**: Role-based access with profile management for doctors
- **Detailed Documentation**: [DOCTOR_API_DOCUMENTATION.md](./DOCTOR_API_DOCUMENTATION.md)

### 6. Invoice API

- **Base Route**: `/api/invoices`
- **Documentation**: Complete Swagger documentation for invoice and billing management
- **Features**: Invoice generation, payment tracking, financial statistics
- **Access Control**: Role-based access for billing operations
- **Detailed Documentation**: [INVOICE_API_DOCUMENTATION.md](./INVOICE_API_DOCUMENTATION.md)

## Test Request Endpoints Documented

### 1. Create Test Request

- **POST** `/api/v1/test-requests`
- **Access**: Customer only
- **Description**: Create a new test request with samples
- **Required Fields**: requesterName, samples (at least one)

### 2. Get Test Request by ID

- **GET** `/api/v1/test-requests/{id}`
- **Access**: Customers (own requests only), Admins (all requests)
- **Description**: Retrieve detailed information about a specific test request

### 3. Get Customer's Test Requests

- **GET** `/api/v1/test-requests/my-requests`
- **Access**: Customer only
- **Description**: Paginated list of test requests for the authenticated customer
- **Query Params**: page, limit

### 4. Get All Test Requests (Admin)

- **GET** `/api/v1/test-requests`
- **Access**: Admin/Lab Admin only
- **Description**: Paginated list of all test requests with filtering
- **Query Params**: page, limit, status, documentStatus

### 5. Update Test Request

- **PUT** `/api/v1/test-requests/{id}`
- **Access**: Admin/Lab Admin only
- **Description**: Update test request details and status

### 6. Update Test Request Sample

- **PUT** `/api/v1/test-requests/samples/{id}`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Update sample details like received quantity and status

### 7. Assign Technician to Sample

- **POST** `/api/v1/test-requests/samples/{id}/assign-technician`
- **Access**: Admin/Lab Admin only
- **Description**: Assign a lab technician to a specific sample

### 8. Get Test Request Statistics

- **GET** `/api/v1/test-requests/statistics`
- **Access**: Admin/Lab Admin only
- **Description**: Dashboard statistics for test requests and samples

### 9. Search Test Requests

- **GET** `/api/v1/test-requests/search`
- **Access**: Admin/Lab Admin only
- **Description**: Search test requests by various criteria
- **Query Params**: q (search query)

## Enhanced Swagger Schemas

### New/Updated Schemas:

1. **TestRequest** - Comprehensive test request object with all fields
2. **TestRequestSample** - Detailed sample information including lab tests
3. **LabTest** - Enhanced lab test information with results and assignments

### Key Features:

- Detailed request/response examples
- Comprehensive error handling documentation
- Proper HTTP status codes
- Authentication requirements clearly specified
- Role-based access control documented
- Parameter validation and constraints

## API Tags

Organized endpoints into logical groups:

- **Test Requests** - Main test request operations
- **Test Request Samples** - Sample-specific operations
- **Authentication** - Auth endpoints
- **Customers** - Customer management
- **Lab Management** - Lab operations
- **Invoices** - Billing operations
- **Doctors** - Medical professional management

## Authentication

All endpoints require Bearer token authentication except where explicitly noted.

## Access the Documentation

The Swagger UI is available at: `http://localhost:5001/api-docs`

## Status Enums Documented

### Document Status:

- DRAFT
- SUBMITTED
- PENDING_PAYMENT
- APPROVED
- REJECTED
- CANCELLED

### Lab Internal Status:

- WAITING_APPROVAL_LAB
- RECEIVED_SAMPLES
- ASSIGNED_TECHNICIAN
- IN_PROGRESS
- RESULTS_UPLOADED
- REVIEWED_BY_DOCTOR
- READY_FOR_APPROVAL
- COMPLETED
- RE_SCHEDULED
- HOLD

### Sample Status:

- PENDING
- RECEIVED
- IN_TESTING
- COMPLETED
- REJECTED

### Lab Result Status:

- PENDING
- PARTIAL
- COMPLETED
- REVIEWED
- APPROVED
- REJECTED

## Implementation Files Modified:

1. `/src/controllers/TestRequestController.ts` - Added comprehensive JSDoc comments
2. `/src/controllers/CustomerController.ts` - Added comprehensive JSDoc comments
3. `/src/controllers/LabController.ts` - Added comprehensive JSDoc comments
4. `/src/config/swagger.ts` - Enhanced schemas and added tags
5. All endpoints now have detailed documentation including:
   - Request/response schemas
   - Authentication requirements
   - Role-based access control
   - Error handling
   - Parameter validation
   - Example values

## Customer API Endpoints Added:

### Customer Profile Management:

- **GET** `/api/v1/customers/profile` - Get customer profile
- **PUT** `/api/v1/customers/profile` - Update customer profile
- **GET** `/api/v1/customers/statistics` - Get customer statistics

### Admin Customer Management:

- **GET** `/api/v1/customers` - Get all customers (paginated)
- **GET** `/api/v1/customers/{id}` - Get customer by ID
- **GET** `/api/v1/customers/search` - Search customers
- **DELETE** `/api/v1/customers/{id}` - Delete customer

## Lab Management API Endpoints Added:

### Lab Test Management:

- **POST** `/api/v1/lab/tests` - Create new lab test (Admin/Lab Admin)
- **GET** `/api/v1/lab/tests` - Get all lab tests (Admin/Lab Admin)
- **GET** `/api/v1/lab/my-tests` - Get technician's assigned tests (Technician)
- **GET** `/api/v1/lab/tests/{id}` - Get lab test by ID
- **PUT** `/api/v1/lab/tests/{id}` - Update lab test
- **POST** `/api/v1/lab/tests/{id}/complete` - Complete lab test

### Lab Result Management:

- **POST** `/api/v1/lab/results` - Create lab result
- **PUT** `/api/v1/lab/results/{id}` - Update lab result
- **DELETE** `/api/v1/lab/results/{id}` - Delete lab result (Admin only)

### Lab Statistics & Search:

- **GET** `/api/v1/lab/statistics` - Get lab statistics (Admin/Lab Admin)
- **GET** `/api/v1/lab/search` - Search lab tests
- **GET** `/api/v1/lab/technicians` - Get available technicians (Admin/Lab Admin)

The documentation is now production-ready and provides developers with comprehensive information about Test Request, Customer, and Lab Management API endpoints.
