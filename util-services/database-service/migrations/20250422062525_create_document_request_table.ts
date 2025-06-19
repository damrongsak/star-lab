import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("document_request", (table) => {
    table.increments("id").primary();
    table.string("request_no", 50).unique().notNullable();
    table.timestamp("request_date", { useTz: true }).defaultTo(knex.fn.now());
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .comment("Foreign key อ้างอิง user_id จากตาราง users");
    table.integer("company_id").notNullable();
    table.string("document_type", 50).notNullable();
    table.text("description").nullable();
    table.string("status", 20).defaultTo("pending");
    table.boolean("paid_status").defaultTo(false);
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("document_request");
}
