import pool from "../config/database";
import bcrypt from "bcrypt";

const saltRounds = 10; // For bcrypt hashing

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CreateUserResult {
  id: number;
  username: string;
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
  ): Promise<CreateUserResult> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `
                        INSERT INTO users (username, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, username, email;
                `;
    const values = [username, email, hashedPassword];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly created user (without password)
    } catch (error) {
      if ((error as any).code === "23505") {
        // Unique violation error code
        throw new Error("Username or email already exists."); // Custom error for duplicate entry
      }
      throw error; // Re-throw other errors
    }
  }

  static async findUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<User | undefined> {
    const query = `
                        SELECT id, username, email, role FROM users WHERE email = $1;
                `;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0]; // Returns user object or undefined if not found
  }

  static async findUserById(id: number): Promise<User | undefined> {
    const query = `
                        SELECT id, username, email, role FROM users WHERE id = $1;
                `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0]; // Returns user object (without password) or undefined if not found
  }
}

export default UserModel;

// --- SQL to create the 'users' table (run this in your PostgreSQL database) ---
/*
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/
