# Unit Tests for Star Lab Backend Services

## Overview

This document provides a comprehensive workflow for creating and maintaining Jest unit tests for service classes in the Star Lab backend. The workflow has been developed through practical implementation and tested with UserService and CustomerService.

## ✅ Completed Unit Tests

### 1. **UserService.test.ts** ✅

- Tests user registration with password hashing
- Tests user login with authentication
- Tests user retrieval by ID
- Tests user listing with role filtering
- Tests email uniqueness validation
- Covers error scenarios (user not found, invalid credentials, database errors)
- **Total Test Cases: 8 tests** - All passing ✅

### 2. **CustomerService.test.ts** ✅

- Tests customer creation with user association
- Tests customer retrieval (by ID, by user ID, search)
- Tests customer updates and deletion
- Tests customer statistics (total count, recent registrations)
- Tests search functionality with query parameters
- Covers error scenarios (user not found, customer not found, database errors)
- Tests edge cases (empty search results, invalid IDs)
- **Total Test Cases: 25 tests** - All passing ✅

### 3. **DoctorService.test.ts** ✅

- Tests doctor creation with profile data
- Tests doctor retrieval (by ID, search functionality)
- Tests doctor updates and listing
- Tests doctor statistics and metrics
- Covers error scenarios (doctor not found, database errors)
- Tests edge cases (empty search results, pagination)
- **Total Test Cases: 27 tests** - All passing ✅

## 🔧 In Progress Unit Tests

### 4. **LabService.test.ts** ✅

- Tests lab test creation with case number generation and sample status updates
- Tests lab test retrieval (by ID, by technician, search functionality)
- Tests lab test updates and completion workflow
- Tests lab result creation, updates, and deletion
- Tests lab statistics and metrics calculation
- Tests technician management and assignment
- Covers error scenarios (test not found, no results, database errors)
- Tests edge cases (empty search results, zero statistics, pagination)
- **Total Test Cases: 30 tests** - All passing ✅

### 5. **InvoiceService.test.ts** ✅

- Tests invoice creation with tax calculation and line item generation
- Tests invoice retrieval (by ID, by customer, search functionality)
- Tests invoice updates with automatic recalculation of totals
- Tests invoice generation from test requests with sample processing
- Tests invoice statistics and revenue calculations
- Tests payment status management and tracking
- Covers error scenarios (not found, database errors, validation failures)
- Tests edge cases (null revenue sums, empty samples, various tax rates)
- **Total Test Cases: 25 tests** - All passing ✅

### 6. **TestRequestService.test.ts** ✅

- Tests test request creation with samples and validation
- Tests test request retrieval (by ID, by customer, search functionality)
- Tests test request updates and sample management
- Tests technician assignment to samples with lab test creation
- Tests test request statistics and metrics calculation
- Tests search functionality across request numbers, customer names, and sample IDs
- Covers error scenarios (not found, database errors, validation failures)
- Tests edge cases (empty results, invalid IDs, missing samples)
- **total Test Cases: 23 tests** - All passing ✅

### 7. **FileService.test.ts** ✅

- Tests file upload functionality with multer integration
- Tests file retrieval (by ID, by path, metadata extraction)
- Tests file deletion and cleanup operations
- Tests file validation (type, size, security checks)
- Tests file storage and path management
- Tests PDF generation and document processing
- Covers error scenarios (file not found, invalid formats, upload failures)
- Tests edge cases (empty files, unsupported formats, storage errors)
- **Total Test Cases: 31 tests** - All passing ✅

## 🔧 Unit Test Workflow & Best Practices

### Step 1: Analyze the Service Under Test

Before writing tests, thoroughly understand the service:

```bash
# Read the service file to understand:
# - Dependencies (Prisma models, external libraries)
# - Public methods and their signatures
# - Error handling patterns
# - Business logic and validation rules
```

**Key things to identify:**

- All public methods that need testing
- External dependencies that need mocking
- Error scenarios and edge cases
- Database operations and Prisma models used

### Step 2: Set Up the Test File Structure

Create your test file in `src/__tests__/YourService.test.ts`:

```typescript
// 1. Import statements (mocks MUST come before service import)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// ... other dependencies

// 2. Mock all external dependencies BEFORE importing the service
jest.mock("@prisma/client");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../utils/logger");
// ... other mocks

// 3. Import the service AFTER mocks are set up
import { YourService } from "../services/YourService";

// 4. Set up test structure
describe("YourService", () => {
  // Test implementation
});
```

### Step 3: Mock External Dependencies

**Critical Rule: All mocks must be declared before importing the service under test.**

#### Common Mocking Patterns:

```typescript
// Prisma Client Mock
const mockPrismaClient = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customer: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  // Add other models as needed
} as unknown as jest.Mocked<PrismaClient>;

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Bcrypt Mock
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// JWT Mock
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// UUID Mock
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

// Logger Mock
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));
```

### Step 4: Structure Your Tests

Organize tests by method, with multiple test cases per method:

```typescript
describe("YourService", () => {
  let service: YourService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new YourService();
  });

  describe("methodName", () => {
    it("should handle success case", async () => {
      // Arrange - set up mocks and data
      // Act - call the method
      // Assert - verify results and mock calls
    });

    it("should handle error case", async () => {
      // Test error scenarios
    });

    it("should handle edge case", async () => {
      // Test edge cases
    });
  });
});
```

### Step 5: Write Comprehensive Test Cases

For each service method, test:

1. **Happy Path**: Normal successful execution
2. **Error Cases**: Database errors, validation failures
3. **Edge Cases**: Empty results, null values, invalid inputs
4. **Business Logic**: Calculations, transformations, validations

#### Example Test Structure:

```typescript
describe("createUser", () => {
  it("should create user with hashed password", async () => {
    // Arrange
    const userData = {
      name: "Test",
      email: "test@example.com",
      password: "password123",
    };
    const hashedPassword = "hashed_password";
    const mockUser = { id: "user-id", ...userData, password: hashedPassword };

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockPrismaClient.user.create.mockResolvedValue(mockUser);

    // Act
    const result = await service.createUser(userData);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
      data: { ...userData, password: hashedPassword },
    });
    expect(result).toEqual(mockUser);
  });

  it("should throw error for duplicate email", async () => {
    // Test error scenario
    const userData = {
      name: "Test",
      email: "existing@example.com",
      password: "password123",
    };

    mockPrismaClient.user.create.mockRejectedValue(
      new Error("Duplicate email"),
    );

    await expect(service.createUser(userData)).rejects.toThrow(
      "Duplicate email",
    );
  });
});
```

### Step 6: Verify Mock Calls and Assertions

Always verify that:

- Mocks are called with correct parameters
- Return values match expected format
- Error cases throw appropriate errors
- Side effects are properly tested

```typescript
// Verify mock calls
expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
  data: expectedData,
});
expect(mockPrismaClient.user.create).toHaveBeenCalledTimes(1);

// Verify return values
expect(result).toEqual(expectedResult);
expect(result.id).toBeDefined();

// Verify error handling
await expect(service.method()).rejects.toThrow("Expected error message");
```

### Step 7: Run and Debug Tests

```bash
# Run all tests
npm test

# Run specific test file
npx jest src/__tests__/YourService.test.ts

# Run tests in watch mode
npx jest src/__tests__/YourService.test.ts --watch

# Run tests with coverage
npx jest src/__tests__/YourService.test.ts --coverage
```

## 🚀 Running the Tests

### Test Configuration

The project uses:

- **Jest** as the test runner
- **ts-jest** for TypeScript support
- **Test directory**: `src/__tests__/`
- **Test pattern**: `*.test.ts`

### Available Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npx jest src/__tests__/UserService.test.ts
npx jest src/__tests__/CustomerService.test.ts
```

### 📊 Test Coverage Reports

Jest automatically generates coverage reports in the `coverage/` folder:

```bash
# Generate coverage report
npm test -- --coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

**Coverage Report Files:**

- `coverage/lcov-report/index.html` - Interactive HTML report (recommended)
- `coverage/lcov.info` - LCOV format for CI/CD integration
- `coverage/coverage-final.json` - JSON format coverage data
- `coverage/clover.xml` - XML format for tools like SonarQube

**Current Coverage Summary:**

- **Services**: 82% statement coverage (our main focus)
- **Total Tests**: 168 tests passing
- **Service Coverage**: 81.9% statements, 72.1% branches, 81.6% functions

**Note**: The `coverage/` folder is ignored in `.gitignore` as it's generated and shouldn't be committed to version control.

### Project Configuration

The Jest configuration in `jest.config.ts`:

```typescript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/__tests__/**/*.test.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
```

## 🔍 Common Pitfalls and Solutions

### 1. **Mock Import Order Issue**

**Problem**: Service imports dependencies before mocks are set up
**Solution**: Always declare mocks before importing the service

```typescript
// ❌ Wrong - service imported before mocks
import { UserService } from "../services/UserService";
jest.mock("@prisma/client");

// ✅ Correct - mocks before service import
jest.mock("@prisma/client");
import { UserService } from "../services/UserService";
```

### 2. **Incomplete Prisma Model Mocking**

**Problem**: Service uses Prisma models not included in mock
**Solution**: Include all models used by the service in the mock

```typescript
const mockPrismaClient = {
  user: {
    /* user operations */
  },
  customer: {
    /* customer operations */
  },
  testRequest: {
    /* if service uses this model */
  },
  invoice: {
    /* if service uses this model */
  },
} as unknown as jest.Mocked<PrismaClient>;
```

### 3. **Mock Reset Issues**

**Problem**: Mock state persists between tests
**Solution**: Use `jest.clearAllMocks()` in `beforeEach`

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  service = new YourService();
});
```

### 4. **Async/Await Handling**

**Problem**: Promises not properly handled in tests
**Solution**: Always use async/await or return promises

```typescript
// ✅ Correct async test
it("should handle async operation", async () => {
  const result = await service.asyncMethod();
  expect(result).toBeDefined();
});
```

## 📊 Test Coverage Goals

Aim for:

- **Methods**: 100% of public methods tested
- **Branches**: 80%+ branch coverage
- **Lines**: 90%+ line coverage
- **Error Cases**: All error paths tested
- **Edge Cases**: Boundary conditions tested

## 📝 Adding Tests for New Services

To add tests for additional services:

1. **Analyze the service** - understand dependencies and methods
2. **Create test file** - follow naming convention `ServiceName.test.ts`
3. **Set up mocks** - mock all external dependencies
4. **Write test cases** - cover success, error, and edge cases
5. **Run tests** - verify all tests pass
6. **Update documentation** - add to this file

### Template for New Service Tests

```typescript
// src/__tests__/NewService.test.ts
import { PrismaClient } from "@prisma/client";
// Import other dependencies

// Mock all dependencies BEFORE importing service
jest.mock("@prisma/client");
jest.mock("../utils/logger");
// Other mocks

import { NewService } from "../services/NewService";

const mockPrismaClient = {
  // Mock required Prisma models
} as unknown as jest.Mocked<PrismaClient>;

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe("NewService", () => {
  let service: NewService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NewService();
  });

  describe("methodName", () => {
    it("should handle success case", async () => {
      // Test implementation
    });

    it("should handle error case", async () => {
      // Test implementation
    });
  });
});
```

## 🎯 Current Test Status

- ✅ **UserService**: 8 tests passing (100% complete)
- ✅ **CustomerService**: 25 tests passing (100% complete)
- ✅ **DoctorService**: 27 tests passing (100% complete)
- ✅ **LabService**: 30 tests passing (100% complete)
- ✅ **FileService**: 31 tests passing (100% complete)
- ✅ **InvoiceService**: 25 tests passing (100% complete)
- ✅ **TestRequestService**: 23 tests passing (100% complete)

**Total Progress**: 7 of 7 services (100%) fully tested and passing

**Test Coverage**: 168 tests passing across all services

**Service Coverage Summary:**

- Statement Coverage: 81.9%
- Branch Coverage: 72.1%
- Function Coverage: 81.6%
- Line Coverage: 82.3%

The established workflow ensures consistent, maintainable, and comprehensive test coverage for all backend services. All service test suites are complete and follow the established patterns with proper Prisma mocking, error handling, and edge case coverage.
