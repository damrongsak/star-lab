// backend/customer-service/knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const dbUrl = process.env.DATABASE_URL; // Get DATABASE_URL from environment variables

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure your .env file.",
  );
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: dbUrl, // Use DB_URL from environment variables
    migrations: {
      directory: "../database/migrations", // Directory for migration files
    },
    seeds: {
      directory: "../database/seeds", // Directory for seed files (optional for now)
    },
  },

  // You can add configurations for staging and production if needed
  staging: {
    client: "pg",
    connection: {
      database: "your_staging_database", // Replace with your staging database name
      user: "your_staging_user", // Replace with your staging database user
      password: "your_staging_password", // Replace with your staging database password
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "your_prod_database", // Replace with your production database name
      user: "your_prod_user", // Replace with your production database user
      password: "your_prod_password", // Replace with your production database password
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
