# Swagger API Documentation

## Overview

The Star Lab API now includes comprehensive Swagger/OpenAPI documentation. This provides an interactive interface to explore and test all API endpoints.

## Accessing Swagger UI

Once the server is running, you can access the Swagger UI at:

```url
http://localhost:5002/api-docs
```

## Features

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Authentication Support**: JWT Bearer token authentication integrated
- **Request/Response Examples**: See sample data for all endpoints
- **Schema Documentation**: Detailed information about request and response models
- **Multiple Environment Support**: Development and production server configurations

## Using Authentication

Many endpoints require authentication. To use protected endpoints in Swagger UI:

1. Click the "Authorize" button at the top right of the Swagger UI
2. Enter your JWT token in the format: `Bearer <your-jwt-token>`
3. Click "Authorize" to save the token
4. The token will now be included automatically in requests to protected endpoints

## Getting a JWT Token

To get a JWT token for testing:

1. Use the `/api/v1/auth/register` endpoint to create a new user
2. Use the `/api/v1/auth/login` endpoint with your credentials
3. Copy the `token` from the response
4. Use this token in the Swagger UI authorization

## Available Tags

The API endpoints are organized into the following categories:

- **Authentication**: User registration, login, and profile management
- **Customers**: Customer management operations
- **Doctors**: Doctor profile and management
- **Laboratory**: Lab test management
- **Test Requests**: Test request processing
- **Invoices**: Invoice generation and management

## Schema Definitions

All request and response schemas are documented in the Swagger UI under the "Schemas" section. This includes:

- User models (User, Customer, Doctor)
- Request/Response DTOs
- Authentication payloads
- Error response formats

## Development Notes

### Adding Documentation to New Endpoints

When creating new endpoints, add JSDoc comments with Swagger annotations:

```typescript
/**
 * @swagger
 * /api/v1/your-endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [YourTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 */
```

### Adding New Schemas

To add new schemas, edit `/src/config/swagger.ts` and add them to the `components.schemas` section.

### Configuration

The Swagger configuration is located in `/src/config/swagger.ts`. You can modify:

- API information (title, version, description)
- Server URLs
- Security schemes
- Component schemas
- Global tags

## Production Considerations

- The Swagger UI is enabled in all environments by default
- Consider restricting access in production environments if needed
- Update server URLs in the configuration for different environments
- Ensure sensitive information is not exposed in example data
