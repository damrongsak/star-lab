# Lab Management API Documentation Summary

## Overview

Comprehensive Swagger API documentation has been added for all `/api/v1/lab` endpoints in the Laboratory Management System.

## Lab Test Management Endpoints

### 1. Create Lab Test

- **POST** `/api/v1/lab/tests`
- **Access**: Admin/Lab Admin only
- **Description**: Create a new lab test for a test request sample
- **Required Fields**: testRequestSampleId, assignedLabTechnicianId
- **Features**: Automatic case number generation, technician assignment

### 2. Get Lab Test by ID

- **GET** `/api/v1/lab/tests/{id}`
- **Access**: Admin/Lab Admin/Technician/Doctor
- **Description**: Retrieve detailed lab test information with related data
- **Returns**: Complete lab test with sample info, assigned technician, and results

### 3. Get Technician's Assigned Tests

- **GET** `/api/v1/lab/my-tests`
- **Access**: Technician only
- **Description**: Paginated list of tests assigned to authenticated technician
- **Query Parameters**: page, limit, status
- **Returns**: Tests with customer and sample information

### 4. Get All Lab Tests (Admin)

- **GET** `/api/v1/lab/tests`
- **Access**: Admin/Lab Admin only
- **Description**: Paginated list of all lab tests with filtering
- **Query Parameters**: page, limit, status
- **Returns**: Complete test listing with technician assignments

### 5. Update Lab Test

- **PUT** `/api/v1/lab/tests/{id}`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Update test details, status, and assignments
- **Features**: Technician reassignment, status updates, method changes

### 6. Complete Lab Test

- **POST** `/api/v1/lab/tests/{id}/complete`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Mark test as completed and update status
- **Validation**: Cannot complete without lab results

## Lab Result Management Endpoints

### 7. Create Lab Result

- **POST** `/api/v1/lab/results`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Create individual test result for a lab test
- **Required Fields**: labTestId, parameter, value
- **Features**: Abnormal result flagging, reference range validation

### 8. Update Lab Result

- **PUT** `/api/v1/lab/results/{id}`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Update existing lab result values
- **Features**: Value corrections, note updates, abnormal status changes

### 9. Delete Lab Result

- **DELETE** `/api/v1/lab/results/{id}`
- **Access**: Admin/Lab Admin only
- **Description**: Remove lab result (high privilege operation)
- **Use Cases**: Error corrections, invalid results removal

## Statistics and Utility Endpoints

### 10. Get Lab Statistics

- **GET** `/api/v1/lab/statistics`
- **Access**: Admin/Lab Admin only
- **Description**: Comprehensive lab metrics and KPIs
- **Returns**: Test counts, completion rates, technician workload, abnormal results

### 11. Search Lab Tests

- **GET** `/api/v1/lab/search`
- **Access**: Admin/Lab Admin/Technician
- **Description**: Search tests by case number, customer, or sample ID
- **Query Parameters**: q (search query)
- **Returns**: Matching tests with customer and technician info

### 12. Get Available Technicians

- **GET** `/api/v1/lab/technicians`
- **Access**: Admin/Lab Admin only
- **Description**: List of available technicians for assignment
- **Returns**: Technician details with current workload information

## Enhanced Schema Definitions

### LabTest Schema Includes:

- **Basic Information**: ID, case number, dates, status
- **Test Details**: Panel, method, notes
- **Assignments**: Technician information
- **Relations**: Test request sample, results
- **Workflow**: Start/end dates, review information
- **Approval**: Doctor review, lab admin approval

### LabResult Schema Includes:

- **Test Data**: Parameter, value, unit, reference range
- **Analysis**: Abnormal flags, status indicators
- **Metadata**: Recording technician, timestamps
- **Quality**: Notes, corrections, validation info

## Role-Based Access Control

### Access Levels Documented:

- **Technician**: Can view assigned tests, create/update results
- **Lab Admin**: Full lab operations access, can assign technicians
- **Admin**: Complete system access including deletions
- **Doctor**: Can view tests for review purposes

### Security Features:

- JWT Bearer token authentication required
- Role-based middleware protection
- User ID extraction for ownership validation
- Proper error handling for unauthorized access

## Comprehensive Error Handling

### HTTP Status Codes:

- **200**: Successful operations
- **201**: Resource creation successful
- **400**: Bad request (validation, missing results)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **500**: Internal server error

### Business Logic Validation:

- Cannot complete tests without results
- Required field validation for test creation
- Proper technician assignment validation
- Result value and range validation

## Data Examples

### Lab Test Creation:

```json
{
  "testRequestSampleId": "123e4567-e89b-12d3-a456-426614174000",
  "assignedLabTechnicianId": "456e7890-e89b-12d3-a456-426614174000",
  "testPanel": "Complete Blood Count",
  "testMethod": "Automated Hematology Analyzer",
  "notes": "Priority test - rush processing required"
}
```

### Lab Result Creation:

```json
{
  "labTestId": "123e4567-e89b-12d3-a456-426614174000",
  "parameter": "Hemoglobin",
  "value": "14.2",
  "unit": "g/dL",
  "referenceRange": "12.0-16.0",
  "isAbnormal": false,
  "notes": "Result within normal limits"
}
```

### Statistics Response:

```json
{
  "totalLabTests": 250,
  "pendingTests": 35,
  "inProgressTests": 45,
  "completedTests": 170,
  "totalResults": 850,
  "abnormalResults": 125,
  "averageCompletionTime": 24.5,
  "activeTechnicians": 12
}
```

## Quality & Workflow Features

### Test Workflow Management:

- Proper status progression (Pending → In Progress → Completed → Reviewed → Approved)
- Technician workload tracking
- Completion time analytics
- Quality control through review processes

### Result Management:

- Parameter-based result recording
- Abnormal result flagging and tracking
- Reference range validation
- Result correction and audit trail

### Administrative Tools:

- Comprehensive search across all test data
- Statistical reporting for performance monitoring
- Technician assignment optimization
- Resource utilization tracking

The Lab Management API documentation is now complete and production-ready, providing developers with comprehensive information for integrating with all laboratory testing functionality, from test creation through result recording and statistical analysis.
