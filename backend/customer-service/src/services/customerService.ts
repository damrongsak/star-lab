import CustomerModel from "../models/customerModel";

class CustomerService {
  static async createCustomer(
    firstName: string,
    lastName: string,
    email: string,
  ) {
    if (!firstName || !lastName || !email) {
      throw new Error("First name, last name, and email are required.");
    }
    // You can add more validation here (e.g., email format)
    return CustomerModel.createCustomer(firstName, lastName, email);
  }

  static async getCustomerById(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new Error("Valid customer ID is required.");
    }
    return CustomerModel.getCustomerById(Number(id));
  }

  static async getAllCustomers() {
    return CustomerModel.getAllCustomers();
  }

  static async updateCustomer(
    id: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ) {
    if (!id || isNaN(Number(id))) {
      throw new Error("Valid customer ID is required for update.");
    }
    // You might want to add validation for updated fields here if necessary
    return CustomerModel.updateCustomer(Number(id), firstName, lastName, email);
  }

  static async deleteCustomer(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new Error("Valid customer ID is required for deletion.");
    }
    return CustomerModel.deleteCustomer(Number(id));
  }
}

export default CustomerService;
