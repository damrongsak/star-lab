import pool from "../config/database";
import bcrypt from "bcrypt";
import logger from "../utils/logger";

const saltRounds = 10; // For bcrypt hashing

export interface User {
  id: number;
  username: string;
  name?: string;
  email: string;
  role?: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CreateUserResult {
  id: number;
  username: string;
  name?: string;
  email: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

class UserModel {
  static async createUser(
    username: string,
    email: string,
    password: string,
    first_name: string = "",
    last_name: string = ""
  ): Promise<CreateUserResult> {
    const client = await pool.connect(); // Acquire a client from the pool
    try {
      await client.query("BEGIN"); // Start a transaction
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = `
        INSERT INTO users (username, first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, first_name, last_name, email, role, created_at, updated_at;
      `;
      const values = [username, first_name, last_name, email, hashedPassword];
      const result = await client.query(query, values);

      await client.query("COMMIT"); // Commit the transaction
      return result.rows[0]; // Return the newly created user (without password)
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback the transaction on error
      if ((error as any).code === "23505") {
        // Unique violation error code
        logger.error("Error creating user: Username or email already exists.");
        throw new Error("Username or email already exists."); // Custom error for duplicate entry
      }
      logger.error("Error creating user:", error);
      throw error; // Re-throw other errors
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const client = await pool.connect(); // Acquire a client from the pool
    try {
      const query = `
        SELECT 
          id, 
          username, 
          COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS name, 
          email, 
          role, 
          password 
        FROM users 
        WHERE email = $1 AND is_active = true;
      `;
      const values = [email];
      const result = await client.query(query, values);

      // Return the first row or undefined if no rows are found
      return result.rows[0];
    } catch (error) {
      logger.error("Error executing findByEmail query:", error);
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      client.release(); // Ensure the client is always released
    }
  }

  static async findById(id: number): Promise<User | undefined> {
    const client = await pool.connect(); // Acquire a client from the pool
    try {
      const query = `
      SELECT 
        id, 
        username, 
        COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS name, 
        email, 
        role 
      FROM users 
      WHERE id = $1 AND is_active = true;
    `;
      const values = [id];
      const result = await client.query(query, values);

      // Return the first row or undefined if no rows are found
      return result.rows[0];
    } catch (error) {
      logger.error("Error executing query:", error);
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      client.release(); // Ensure the client is always released
    }
  }
  static async changePassword(
    userId: number,
    newPassword: string
  ): Promise<boolean> {
    const client = await pool.connect(); // Acquire a client from the pool
    try {
      await client.query("BEGIN"); // Start the transaction
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const query = `
                        UPDATE users SET password = $1 WHERE id = $2 RETURNING id;
                `;
      const values = [hashedPassword, userId];
      const result = await client.query(query, values);

      if (result.rowCount !== null && result.rowCount > 0) {
        await client.query("COMMIT"); // Commit the transaction if successful
        return true;
      } else {
        await client.query("ROLLBACK"); // Rollback if no rows were updated
        return false;
      }
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback on any error
      logger.error("Error changing password (with transaction):", error);
      return false;
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  static async verifyPassword(
    hashedPassword1: string,
    hashedPassword2: string
  ): Promise<boolean> {
    return bcrypt.compare(hashedPassword1, hashedPassword2);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  static async updatePasswordByEmailWithTransaction(
    email: string,
    newPassword: string
  ): Promise<boolean> {
    const client = await pool.connect(); // Acquire a client from the pool
    try {
      await client.query("BEGIN"); // Start the transaction
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const query = `
                UPDATE users SET password = $1 WHERE email = $2 RETURNING id;
            `;
      const values = [hashedPassword, email];
      const result = await client.query(query, values);

      if (result.rowCount !== null && result.rowCount > 0) {
        await client.query("COMMIT"); // Commit the transaction if successful
        return true;
      } else {
        await client.query("ROLLBACK"); // Rollback if no rows were updated
        return false;
      }
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback on any error
      logger.error(
        "Error updating password by email (with transaction):",
        error
      );
      return false;
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
}

export default UserModel;

// --- SQL to create the 'users' table (run this in your PostgreSQL database) ---
/*
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    fist_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/
