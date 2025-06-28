# StarLab API Postman Collection

This document provides instructions for using the comprehensive Postman collection for the StarLab Laboratory Management System API.

## Files Included

1. **`StarLab_API_Collection.postman_collection.json`** - Complete API collection with all endpoints
2. **`StarLab_Development.postman_environment.json`** - Development environment variables

## Import Instructions

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button
3. Select **`StarLab_API_Collection.postman_collection.json`**
4. Click **Import**

### Step 2: Import Environment

1. In Postman, go to **Environments** (gear icon)
2. Click **Import**
3. Select **`StarLab_Development.postman_environment.json`**
4. Click **Import**
5. Select the **StarLab Development Environment** as active

## Environment Variables

The collection uses the following variables that are automatically managed:

| Variable        | Description                                   | Auto-Set                      |
| --------------- | --------------------------------------------- | ----------------------------- |
| `baseUrl`       | API base URL (default: http://localhost:5001) | ✅                            |
| `authToken`     | JWT authentication token                      | ✅ (from login)               |
| `customerId`    | Customer ID for testing                       | ✅ (from login/register)      |
| `testRequestId` | Test request ID for testing                   | ✅ (from create test request) |
| `invoiceId`     | Invoice ID for testing                        | ✅ (from create invoice)      |
| `doctorId`      | Doctor ID for testing                         | Manual                        |
| `sampleId`      | Sample ID for testing                         | Manual                        |
| `labTestId`     | Lab test ID for testing                       | Manual                        |
| `resultId`      | Lab result ID for testing                     | Manual                        |

## API Collection Structure

### 1. Authentication

- **Register Customer** - Create new customer account
- **Login** - Authenticate and get JWT token (auto-sets `authToken`)
- **Get Profile** - Get authenticated user profile
- **Change Password** - Change user password
- **Verify Email** - Verify email with token

### 2. Test Requests

- **Create Test Request** - Create new test request (auto-sets `testRequestId`)
- **Get My Test Requests** - Customer's test requests
- **Get All Test Requests (Admin)** - All test requests with filtering
- **Get Test Request by ID** - Specific test request details
- **Update Test Request** - Update test request status
- **Update Test Request Sample** - Update sample details
- **Assign Technician to Sample** - Assign technician to sample

### 3. Customers

- **Get Customer Profile** - Customer's own profile
- **Update Customer Profile** - Update customer profile
- **Get Customer Statistics** - Customer statistics
- **Get All Customers (Admin)** - All customers with search/filtering
- **Get Customer by ID (Admin)** - Specific customer details
- **Update Customer (Admin)** - Admin customer updates

### 4. Lab Management

- **Get Available Lab Tests** - Available lab tests with filtering
- **Get Lab Test by ID** - Specific lab test details
- **Create Lab Test (Admin)** - Create new lab test
- **Update Lab Test (Admin)** - Update lab test details
- **Create Lab Result** - Create test result
- **Get Lab Results by Sample** - Results for specific sample
- **Update Lab Result** - Update test result
- **Get Lab Statistics** - Lab performance statistics

### 5. Doctors

- **Get All Doctors** - All doctors with filtering
- **Get Doctor by ID** - Specific doctor details
- **Create Doctor (Admin)** - Create new doctor profile
- **Update Doctor (Admin)** - Update doctor profile
- **Get Doctor Statistics** - Doctor workload statistics
- **Assign Doctor to Test Request** - Assign doctor to test request
- **Get Doctor's Assignments** - Doctor's test request assignments

### 6. Invoices

- **Create Invoice** - Create new invoice (auto-sets `invoiceId`)
- **Get Invoice by ID** - Specific invoice details
- **Get Invoice by Number** - Invoice by invoice number
- **Get All Invoices** - All invoices with filtering
- **Update Invoice** - Update invoice details
- **Mark Invoice as Paid** - Mark invoice as paid
- **Search Invoices** - Search invoices by criteria
- **Get Invoice Statistics** - Invoice and financial statistics

## Testing Workflow

### Basic Testing Flow

1. **Start with Authentication**

   ```
   1. Register Customer (or use existing credentials)
   2. Login (auto-sets authToken and customerId)
   3. Get Profile (verify authentication)
   ```

2. **Test Request Flow**

   ```
   1. Create Test Request (auto-sets testRequestId)
   2. Get My Test Requests
   3. Get Test Request by ID
   4. Update Test Request (Admin role required)
   ```

3. **Customer Management Flow**

   ```
   1. Get Customer Profile
   2. Update Customer Profile
   3. Get Customer Statistics
   ```

4. **Lab Operations Flow**

   ```
   1. Get Available Lab Tests
   2. Create Lab Result
   3. Get Lab Results by Sample
   4. Update Lab Result
   ```

5. **Invoicing Flow**
   ```
   1. Create Invoice (auto-sets invoiceId)
   2. Get Invoice by ID
   3. Update Invoice
   4. Mark Invoice as Paid
   ```

### Admin Testing

For admin operations, you'll need to:

1. Create an admin user account
2. Login with admin credentials
3. Use admin-specific endpoints

### Role-Based Testing

The API supports different user roles:

- **CUSTOMER** - Customer operations, own data access
- **ADMIN** - Full system access
- **LAB_ADMIN** - Lab operations management
- **LAB_TECHNICIAN** - Lab testing operations
- **DOCTOR** - Medical review and approval

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer {{authToken}}
```

The token is automatically set when you login successfully.

## Request Examples

### Register Customer

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
  "operatorIdCard": "1234567890123",
  "operatorFirstName": "John",
  "operatorLastName": "Doe",
  "operatorMobilePhone": "+66-81-234-5678",
  "receiptAddressBuildingFloorNumber": "456 Business Center, 5th Floor",
  "receiptProvince": "Bangkok",
  "receiptDistrict": "Watthana",
  "receiptSubDistrict": "Khlong Toei Nuea",
  "receiptZipCode": "10110",
  "receiptPhone": "+66-2-234-5678"
}
```

### Create Test Request

```json
{
  "requesterName": "John Doe",
  "requestPurpose": "Quality testing for new product line",
  "samples": [
    {
      "sampleName": "Water Sample A",
      "sampleDescription": "Drinking water from source A",
      "quantity": 500,
      "unit": "ml",
      "testIds": ["test-001", "test-002"]
    }
  ]
}
```

### Create Lab Result

```json
{
  "sampleId": "sample-id-here",
  "testId": "test-id-here",
  "result": "7.2",
  "unit": "pH units",
  "status": "COMPLETED",
  "methodology": "Electrochemical pH meter",
  "notes": "Sample measured at room temperature"
}
```

## Response Handling

### Automatic Variable Setting

The collection includes scripts that automatically extract and set environment variables from responses:

- **Login response** → Sets `authToken` and `customerId`
- **Create Test Request response** → Sets `testRequestId`
- **Create Invoice response** → Sets `invoiceId`

### Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Environment Configuration

### Development Environment

- **Base URL**: `http://localhost:5001`
- **Database**: Local development database
- **Authentication**: Local JWT tokens

### Production Environment

To test against production:

1. Update `baseUrl` to `https://lab.orignx.dev`
2. Use production credentials
3. Ensure proper API access permissions

## Advanced Usage

### Pre-request Scripts

Some requests include pre-request scripts for:

- Token validation
- Dynamic data generation
- Environment setup

### Test Scripts

Responses include test scripts for:

- Automatic variable extraction
- Response validation
- Environment variable setting

### Collection Variables

Global collection variables can be used across all requests:

- `{{baseUrl}}` - API base URL
- `{{authToken}}` - Authentication token
- Dynamic IDs for related resources

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Ensure you've logged in successfully
   - Check that `authToken` is set in environment
   - Verify token hasn't expired (24-hour default)

2. **Role Permission Errors**

   - Verify user role for the endpoint
   - Some endpoints require ADMIN role
   - Check role-based access documentation

3. **Validation Errors**

   - Review request body format
   - Check required fields
   - Validate data types and formats

4. **Environment Variables**
   - Ensure development environment is selected
   - Check that auto-set variables are populated
   - Manually set IDs if needed for testing

### API Documentation

For detailed API documentation, refer to:

- [Authentication API Documentation](./AUTHENTICATION_API_DOCUMENTATION_V2.md)
- [Customer API Documentation](./CUSTOMER_API_DOCUMENTATION.md)
- [Lab API Documentation](./LAB_API_DOCUMENTATION.md)
- [Doctor API Documentation](./DOCTOR_API_DOCUMENTATION.md)
- [Invoice API Documentation](./INVOICE_API_DOCUMENTATION.md)

## Support

For API support or questions:

- Review the comprehensive API documentation
- Check endpoint-specific requirements
- Verify authentication and authorization
- Contact the development team for assistance

---

**Collection Version**: 1.0.0  
**Last Updated**: June 28, 2025  
**Compatible with**: StarLab API v1

This Postman collection provides complete coverage of the StarLab Laboratory Management System API with automated authentication handling and comprehensive testing workflows.
