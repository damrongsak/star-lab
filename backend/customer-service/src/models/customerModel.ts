import pool from "../config/database"; // If you are directly accessing DB
import { redisClient } from "../utils/redisClient"; // For Redis caching (example)

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // ... other customer fields
}

class CustomerModel {
  static async createCustomer(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<Customer> {
    const query = `
            INSERT INTO customers (first_name, last_name, email)
            VALUES ($1, $2, $3)
            RETURNING id, first_name, last_name, email;
        `;
    const values = [firstName, lastName, email];
    const result = await pool.query(query, values); // Using PostgreSQL pool
    const newCustomer = result.rows[0];
    // Example: Invalidate cache after creating a new customer (if caching is used)
    if (redisClient) {
      await redisClient.del("all_customers_cache"); // Example cache key invalidation
    }
    return newCustomer;
  }

  static async getCustomerById(id: number): Promise<Customer | undefined> {
    // Example: Caching customer by ID
    if (redisClient) {
      const cachedCustomer = await redisClient.get(`customer:${id}`);
      if (cachedCustomer) {
        return JSON.parse(cachedCustomer) as Customer;
      }
    }

    const query = `
            SELECT id, first_name, last_name, email FROM customers WHERE id = $1;
        `;
    const values = [id];
    const result = await pool.query(query, values);
    const customer = result.rows[0];
    if (customer && redisClient) {
      await redisClient.setEx(`customer:${id}`, 3600, JSON.stringify(customer)); // Cache for 1 hour
    }
    return customer;
  }

  static async getAllCustomers(): Promise<Customer[]> {
    // Example: Caching all customers
    if (redisClient) {
      const cachedCustomers = await redisClient.get("all_customers_cache");
      if (cachedCustomers) {
        return JSON.parse(cachedCustomers) as Customer[];
      }
    }

    const query = `
            SELECT id, first_name, last_name, email FROM customers;
        `;
    const result = await pool.query(query);
    const customers = result.rows;
    if (redisClient) {
      await redisClient.setEx(
        "all_customers_cache",
        3600,
        JSON.stringify(customers),
      ); // Cache for 1 hour
    }
    return customers;
  }

  static async updateCustomer(
    id: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ): Promise<Customer | undefined> {
    const query = `
            UPDATE customers
            SET
                first_name = COALESCE($2, first_name),
                last_name = COALESCE($3, last_name),
                email = COALESCE($4, email),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, first_name, last_name, email;
        `;
    const values = [id, firstName, lastName, email];
    const result = await pool.query(query, values);
    const updatedCustomer = result.rows[0];
    if (updatedCustomer && redisClient) {
      await redisClient.del(`customer:${id}`); // Invalidate cache for this customer
      await redisClient.del("all_customers_cache"); // Invalidate all customers cache
    }
    return updatedCustomer;
  }

  static async deleteCustomer(id: number): Promise<boolean> {
    const query = `
            DELETE FROM customers WHERE id = $1
            RETURNING id;
        `;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length > 0 && redisClient) {
      await redisClient.del(`customer:${id}`); // Invalidate cache
      await redisClient.del("all_customers_cache");
    }
    return result.rows.length > 0; // Returns true if a customer was deleted
  }
}

export default CustomerModel;

// --- SQL to create 'customers' table (run in your PostgreSQL database) ---
/*
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/
