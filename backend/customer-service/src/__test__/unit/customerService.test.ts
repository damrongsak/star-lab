// backend/customer-service/src/__tests__/unit/customerService.test.ts
import CustomerService from "../../services/customerService";
import CustomerModel from "../../models/customerModel";

// Mock the CustomerModel methods to isolate unit tests
jest.mock("../../models/customerModel");

describe("CustomerService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("createCustomer", () => {
    it("should successfully create a customer", async () => {
      const mockCustomer = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      (CustomerModel.createCustomer as jest.Mock).mockResolvedValue(
        mockCustomer,
      );

      const customerData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      const createdCustomer = await CustomerService.createCustomer(
        customerData.firstName,
        customerData.lastName,
        customerData.email,
      );

      expect(CustomerModel.createCustomer).toHaveBeenCalledTimes(1);
      expect(CustomerModel.createCustomer).toHaveBeenCalledWith(
        customerData.firstName,
        customerData.lastName,
        customerData.email,
      );
      expect(createdCustomer).toEqual(mockCustomer);
    });

    it("should throw an error if required fields are missing", async () => {
      await expect(
        CustomerService.createCustomer("", "Doe", "john.doe@example.com"),
      ).rejects.toThrowError("First name, last name, and email are required.");
      await expect(
        CustomerService.createCustomer("John", "", "john.doe@example.com"),
      ).rejects.toThrowError("First name, last name, and email are required.");
      await expect(
        CustomerService.createCustomer("John", "Doe", ""),
      ).rejects.toThrowError("First name, last name, and email are required.");
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer if found", async () => {
      const mockCustomer = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      (CustomerModel.getCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer,
      );

      const customer = await CustomerService.getCustomerById(1);

      expect(CustomerModel.getCustomerById).toHaveBeenCalledTimes(1);
      expect(CustomerModel.getCustomerById).toHaveBeenCalledWith(1);
      expect(customer).toEqual(mockCustomer);
    });

    it("should throw an error if ID is invalid", async () => {
      await expect(CustomerService.getCustomerById(NaN)).rejects.toThrowError(
        "Valid customer ID is required.",
      );
      await expect(CustomerService.getCustomerById(0)).rejects.toThrowError(
        "Valid customer ID is required.",
      );
    });

    it("should return undefined if customer is not found", async () => {
      (CustomerModel.getCustomerById as jest.Mock).mockResolvedValue(undefined);
      const customer = await CustomerService.getCustomerById(999); // Non-existent ID
      expect(customer).toBeUndefined();
    });
  });

  // Add similar test suites for getAllCustomers, updateCustomer, deleteCustomer
  // ... (You can follow the pattern above for other service methods)
});
