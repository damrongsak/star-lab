# Invoice API Documentation

## Overview

The Invoice API provides comprehensive endpoints for managing invoices and billing in the laboratory management system. This API supports automatic invoice generation from test requests, payment tracking, and financial reporting with role-based access control.

## Base URL

```
/api/invoices
```

## Authentication

All endpoints require Bearer token authentication in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Invoice from Test Request

- **POST** `/api/invoices/test-request/{testRequestId}`
- **Description**: Generate a new invoice based on a completed test request
- **Access**: Admin, Lab Admin
- **Parameters**:
  - `testRequestId` (path): Test request ID to create invoice from (UUID)
- **Response**: Created invoice object with calculated totals and tax

### 2. Get Invoice by ID

- **GET** `/api/invoices/{invoiceId}`
- **Description**: Retrieve detailed information about a specific invoice
- **Access**: Admin, Lab Admin (all invoices), Customer (own invoices only)
- **Parameters**:
  - `invoiceId` (path): Invoice's unique identifier (UUID)
- **Response**: Invoice object with customer and test request details

### 3. Get Invoice by Number

- **GET** `/api/invoices/by-number/{invoiceNo}`
- **Description**: Retrieve invoice details using the invoice number
- **Access**: Admin, Lab Admin (all invoices), Customer (own invoices only)
- **Parameters**:
  - `invoiceNo` (path): Invoice number (e.g., "INV-2025-001234")
- **Response**: Invoice object with customer and test request details

### 4. Get Invoices with Pagination

- **GET** `/api/invoices`
- **Description**: Retrieve paginated list of invoices with optional filtering
- **Access**: Admin, Lab Admin (all invoices), Customer (own invoices only)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `status` (optional): Filter by payment status (PENDING, PAID, OVERDUE, CANCELLED, REFUNDED)
- **Response**: Paginated list of invoices with pagination metadata

### 5. Update Invoice Details

- **PUT** `/api/invoices/{invoiceId}`
- **Description**: Update invoice information such as due date, notes, or payment status
- **Access**: Admin, Lab Admin
- **Parameters**:
  - `invoiceId` (path): Invoice's unique identifier (UUID)
- **Request Body**:
  ```json
  {
    "dueDate": "2025-07-28",
    "notes": "Extended payment terms approved",
    "paymentStatus": "PENDING"
  }
  ```
- **Response**: Updated invoice object

### 6. Mark Invoice as Paid

- **PUT** `/api/invoices/{invoiceId}/mark-paid`
- **Description**: Update invoice payment status to paid with optional payment slip
- **Access**: Admin, Lab Admin, Customer (own invoices only)
- **Parameters**:
  - `invoiceId` (path): Invoice's unique identifier (UUID)
- **Request Body**:
  ```json
  {
    "paymentSlipUrl": "https://storage.example.com/payment-slips/payment-123.pdf"
  }
  ```
- **Response**: Updated invoice with payment confirmation

### 7. Search Invoices

- **GET** `/api/invoices/search`
- **Description**: Search invoices by invoice number, customer name, or company name
- **Access**: Admin, Lab Admin, Technician
- **Query Parameters**:
  - `q` (required): Search query string
- **Response**: Array of matching invoices

### 8. Get Invoice Statistics

- **GET** `/api/invoices/statistics`
- **Description**: Retrieve comprehensive invoice and revenue statistics
- **Access**: Admin, Lab Admin
- **Response**: Statistics object with revenue breakdown and trends
  ```json
  {
    "totalInvoices": 150,
    "totalRevenue": 125000.5,
    "paidInvoices": 120,
    "pendingInvoices": 25,
    "overdueInvoices": 5,
    "averageInvoiceValue": 833.33,
    "monthlyRevenue": [
      {
        "month": "2025-06",
        "revenue": 15000.0,
        "count": 18
      }
    ]
  }
  ```

## Data Models

### Invoice Schema

```json
{
  "id": "string (UUID)",
  "invoiceNo": "string",
  "testRequestId": "string (UUID)",
  "customerId": "string (UUID)",
  "invoiceDate": "string (date)",
  "dueDate": "string (date, nullable)",
  "subTotal": "number",
  "taxRate": "number",
  "taxAmount": "number",
  "netTotal": "number",
  "paymentStatus": "enum [PENDING, PAID, OVERDUE, CANCELLED, REFUNDED]",
  "paymentDate": "string (date-time, nullable)",
  "paymentSlipUrl": "string (URL, nullable)",
  "notes": "string (nullable)",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "customer": "Customer object",
  "testRequest": "TestRequest object"
}
```

### Invoice Statistics Schema

```json
{
  "totalInvoices": "number",
  "totalRevenue": "number",
  "paidInvoices": "number",
  "pendingInvoices": "number",
  "overdueInvoices": "number",
  "averageInvoiceValue": "number",
  "monthlyRevenue": [
    {
      "month": "string (YYYY-MM)",
      "revenue": "number",
      "count": "number"
    }
  ]
}
```

### Update Invoice Request Schema

```json
{
  "dueDate": "string (date, optional)",
  "notes": "string (optional)",
  "paymentStatus": "enum [PENDING, PAID, OVERDUE, CANCELLED, REFUNDED] (optional)"
}
```

### Mark as Paid Request Schema

```json
{
  "paymentSlipUrl": "string (URL, optional)"
}
```

## Payment Status Flow

### Status Transitions

1. **PENDING** → Initial status when invoice is created
2. **PAID** → When payment is received and confirmed
3. **OVERDUE** → Automatically set when due date is passed
4. **CANCELLED** → When invoice is cancelled (admin only)
5. **REFUNDED** → When payment is refunded (admin only)

### Automatic Status Updates

- **OVERDUE**: System automatically updates status when due date passes
- **PAID**: Updated manually or via payment gateway integration

## Role-Based Access Control

### Admin

- Full access to all invoice endpoints
- Can create, read, update invoices
- Can view all statistics and reports
- Can mark invoices as paid/cancelled/refunded

### Lab Admin

- Can create invoices from test requests
- Can read and update invoice details
- Can view statistics and reports
- Cannot cancel or refund invoices

### Customer

- Can view only their own invoices
- Can mark their invoices as paid (with payment slip)
- Cannot create or update invoice details
- Cannot access statistics

### Technician

- Read-only access to invoice search
- Cannot modify invoice information
- Cannot access sensitive financial data

## Business Rules

### Invoice Creation

- Only completed test requests can be invoiced
- Each test request can only have one active invoice
- Invoice numbers are auto-generated in format: INV-YYYY-NNNNNN
- Tax rate is configurable (default 7% VAT)

### Payment Processing

- Invoices can be marked as paid with optional payment slip URL
- Payment date is automatically set when marked as paid
- Customers can upload payment proof for verification

### Financial Calculations

- **Subtotal**: Sum of all test costs
- **Tax Amount**: Subtotal × Tax Rate
- **Net Total**: Subtotal + Tax Amount

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid request data or business rule violation
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions for the requested operation
- **404 Not Found**: Invoice or resource not found
- **500 Internal Server Error**: Server-side error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details (in development mode)"
}
```

## Validation Rules

### Invoice Creation

- Test request must exist and be completed
- Test request must not already have an active invoice
- User must have appropriate permissions

### Payment Updates

- Invoice must be in PENDING or OVERDUE status
- Payment slip URL must be valid URL format (if provided)
- Only authorized users can mark invoices as paid

### Search Query

- Minimum 1 character
- Maximum 100 characters
- Searches across invoice number, customer name, and company name

## Rate Limiting

- Standard rate limiting applies to all endpoints
- Higher limits for authenticated users
- Stricter limits for search and bulk operations

## Best Practices

1. **Authentication**: Always include valid Bearer token in requests
2. **Pagination**: Use appropriate page sizes for invoice lists
3. **Error Handling**: Implement proper error handling for all response codes
4. **Payment Tracking**: Always upload payment slips for audit trails
5. **Status Monitoring**: Regularly check for overdue invoices
6. **Security**: Never expose financial data in client-side code

## Integration Notes

### Payment Gateway Integration

- The API is designed to support integration with payment gateways
- Payment webhook endpoints can be added to automatically update invoice status
- Payment slip URLs can store gateway transaction references

### Accounting System Integration

- Invoice data can be exported in standard formats (JSON, CSV)
- API supports bulk operations for synchronization
- Audit trails are maintained for all financial transactions

## Examples

### Create Invoice Example

```bash
curl -X POST https://api.starlab.com/api/invoices/test-request/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

### Mark as Paid Example

```bash
curl -X PUT https://api.starlab.com/api/invoices/inv-550e8400-e29b-41d4-a716-446655440000/mark-paid \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentSlipUrl": "https://storage.example.com/payment-slips/payment-123.pdf"
  }'
```

### Search Invoices Example

```bash
curl -X GET "https://api.starlab.com/api/invoices/search?q=INV-2025" \
  -H "Authorization: Bearer your-jwt-token"
```

### Get Statistics Example

```bash
curl -X GET https://api.starlab.com/api/invoices/statistics \
  -H "Authorization: Bearer your-jwt-token"
```

## Reporting and Analytics

### Available Reports

- Monthly revenue trends
- Payment status breakdown
- Customer payment behavior
- Overdue invoice tracking
- Average invoice values

### Export Formats

- JSON for API integration
- CSV for spreadsheet analysis
- PDF for official reports

### Real-time Metrics

- Total outstanding amount
- Collection efficiency
- Payment velocity
- Revenue forecasting
