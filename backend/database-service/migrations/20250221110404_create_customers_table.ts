import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customers", (table) => {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 255).unique().notNullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("customers"); // Reverses the migration - drops the table
}
