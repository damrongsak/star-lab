# Doctor API Documentation

## Overview

The Doctor API provides comprehensive endpoints for managing doctor profiles, workload tracking, and test request assignments in the laboratory management system. This API supports role-based access control and includes full CRUD operations for doctor management.

## Base URL

```
/api/doctors
```

## Authentication

All endpoints require Bearer token authentication in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Doctor

- **POST** `/api/doctors`
- **Description**: Create a new doctor profile in the system
- **Access**: Admin, Lab Admin
- **Request Body**:
  ```json
  {
    "email": "dr.smith@hospital.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Smith",
    "licenseNumber": "MD789012345",
    "specialization": "Pathology",
    "qualifications": "MD, PhD in Pathology",
    "experience": 8
  }
  ```
- **Response**: Created doctor object with user details

### 2. Get Doctor by ID

- **GET** `/api/doctors/{doctorId}`
- **Description**: Retrieve detailed information about a specific doctor
- **Access**: Admin, Lab Admin
- **Parameters**:
  - `doctorId` (path): Doctor's unique identifier (UUID)
- **Response**: Doctor object with user information

### 3. Get Doctor Profile

- **GET** `/api/doctors/profile`
- **Description**: Get the authenticated doctor's own profile
- **Access**: Doctor (own profile only)
- **Response**: Doctor profile with user details

### 4. Get All Doctors

- **GET** `/api/doctors`
- **Description**: Retrieve paginated list of all doctors
- **Access**: Admin, Lab Admin, Technician
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
- **Response**: Paginated list of doctors with pagination metadata

### 5. Update Doctor

- **PUT** `/api/doctors/{doctorId}`
- **Description**: Update a doctor's profile information
- **Access**: Admin, Lab Admin
- **Parameters**:
  - `doctorId` (path): Doctor's unique identifier (UUID)
- **Request Body**:
  ```json
  {
    "licenseNumber": "MD789012345",
    "specialization": "Clinical Pathology",
    "qualifications": "MD, PhD in Pathology, Board Certified",
    "experience": 10,
    "isActive": true
  }
  ```
- **Response**: Updated doctor object

### 6. Update Doctor Profile

- **PUT** `/api/doctors/profile`
- **Description**: Update the authenticated doctor's own profile
- **Access**: Doctor (own profile only)
- **Request Body**: Same as Update Doctor
- **Response**: Updated doctor profile

### 7. Delete/Deactivate Doctor

- **DELETE** `/api/doctors/{doctorId}`
- **Description**: Deactivate a doctor account (soft delete)
- **Access**: Admin only
- **Parameters**:
  - `doctorId` (path): Doctor's unique identifier (UUID)
- **Response**: Success confirmation message

### 8. Search Doctors

- **GET** `/api/doctors/search`
- **Description**: Search doctors by name, specialization, or license number
- **Access**: Admin, Lab Admin, Technician
- **Query Parameters**:
  - `q` (required): Search query string
- **Response**: Array of matching doctors

### 9. Get Doctor Workload

- **GET** `/api/doctors/{doctorId}/workload`
- **Description**: Get workload statistics for a specific doctor
- **Access**: Admin, Lab Admin, Doctor (own workload)
- **Parameters**:
  - `doctorId` (path): Doctor's unique identifier (UUID)
- **Response**: Workload statistics object
  ```json
  {
    "doctorId": "uuid",
    "totalAssigned": 45,
    "completed": 38,
    "pending": 7,
    "overdue": 2,
    "completionRate": 84.4,
    "averageCompletionTime": 2.3,
    "currentWeekAssigned": 8,
    "currentWeekCompleted": 6
  }
  ```

### 10. Get My Workload

- **GET** `/api/doctors/workload`
- **Description**: Get workload statistics for the authenticated doctor
- **Access**: Doctor (own workload only)
- **Response**: Same as Get Doctor Workload

### 11. Assign Test Request to Doctor

- **POST** `/api/doctors/assign-test-request`
- **Description**: Assign a test request to a specific doctor
- **Access**: Admin, Lab Admin
- **Request Body**:
  ```json
  {
    "testRequestId": "123e4567-e89b-12d3-a456-426614174000",
    "doctorId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Response**: Success confirmation message

### 12. Get Doctor's Test Requests

- **GET** `/api/doctors/{doctorId}/test-requests`
- **Description**: Get paginated list of test requests assigned to a specific doctor
- **Access**: Admin, Lab Admin, Doctor (own requests)
- **Parameters**:
  - `doctorId` (path): Doctor's unique identifier (UUID)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- **Response**: Paginated list of test requests

### 13. Get My Test Requests

- **GET** `/api/doctors/my-test-requests`
- **Description**: Get paginated list of test requests assigned to the authenticated doctor
- **Access**: Doctor (own requests only)
- **Query Parameters**: Same as Get Doctor's Test Requests
- **Response**: Paginated list of test requests

## Data Models

### Doctor Schema

```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "licenseNumber": "string",
  "specialization": "string",
  "qualifications": "string",
  "experience": "number",
  "isActive": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "user": {
    "id": "string (UUID)",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "string"
  }
}
```

### Doctor Workload Schema

```json
{
  "doctorId": "string (UUID)",
  "totalAssigned": "number",
  "completed": "number",
  "pending": "number",
  "overdue": "number",
  "completionRate": "number",
  "averageCompletionTime": "number",
  "currentWeekAssigned": "number",
  "currentWeekCompleted": "number"
}
```

## Role-Based Access Control

### Admin

- Full access to all doctor endpoints
- Can create, read, update, and delete doctors
- Can assign test requests to doctors
- Can view all workload statistics

### Lab Admin

- Can create, read, and update doctors
- Cannot delete doctors
- Can assign test requests to doctors
- Can view all workload statistics

### Technician

- Read-only access to doctor lists and search
- Cannot modify doctor information
- Cannot assign test requests

### Doctor

- Can view and update their own profile
- Can view their own workload statistics
- Can view their assigned test requests
- Cannot access other doctors' information

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid request data or parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions for the requested operation
- **404 Not Found**: Doctor or resource not found
- **500 Internal Server Error**: Server-side error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details (in development mode)"
}
```

## Rate Limiting

- Standard rate limiting applies to all endpoints
- Higher limits for authenticated users
- Stricter limits for search and bulk operations

## Validation Rules

### Doctor Creation/Update

- **licenseNumber**: Required, unique, alphanumeric format
- **specialization**: Required string, max 100 characters
- **qualifications**: Required string, max 500 characters
- **experience**: Required number, minimum 0, maximum 50
- **email**: Valid email format, unique
- **password**: Minimum 8 characters, must contain uppercase, lowercase, number, and special character

### Search Query

- Minimum 1 character
- Maximum 100 characters
- Searches across name, specialization, and license number fields

## Best Practices

1. **Authentication**: Always include valid Bearer token in requests
2. **Pagination**: Use appropriate page sizes to avoid performance issues
3. **Error Handling**: Implement proper error handling for all response codes
4. **Caching**: Consider caching doctor lists and profiles for better performance
5. **Validation**: Validate all input data on the client side before sending requests
6. **Security**: Never expose sensitive information in client-side code

## Examples

### Create Doctor Example

```bash
curl -X POST https://api.starlab.com/api/doctors \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@hospital.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Smith",
    "licenseNumber": "MD789012345",
    "specialization": "Pathology",
    "qualifications": "MD, PhD in Pathology",
    "experience": 8
  }'
```

### Search Doctors Example

```bash
curl -X GET "https://api.starlab.com/api/doctors/search?q=pathology" \
  -H "Authorization: Bearer your-jwt-token"
```

### Get Workload Example

```bash
curl -X GET https://api.starlab.com/api/doctors/workload \
  -H "Authorization: Bearer your-jwt-token"
```
