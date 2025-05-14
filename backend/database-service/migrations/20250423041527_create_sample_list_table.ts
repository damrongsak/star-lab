import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sample_list", (table) => {
    table.increments("id").primary();
    table
      .string("request_no", 50)
      .notNullable()
      .references("request_no")
      .inTable("document_request")
      .onDelete("CASCADE")
      .comment("Foreign key อ้างอิง request_no จากตาราง document_request");
    table.date("sent_sample_date").nullable().comment("วันที่ส่งตัวอย่าง");
    table.string("animal_type", 100).nullable().comment("ชนิดสัตว์");
    table.string("sample_specimen", 255).nullable().comment("ชนิดตัวอย่าง");
    table.string("panel", 255).nullable().comment("Panel");
    table.string("method", 100).nullable().comment("Method");
    table.integer("sample_qty").nullable().comment("ปริมาณตัวอย่าง");
    table
      .boolean("is_deleted")
      .defaultTo(false)
      .notNullable()
      .comment("สถานะว่าถูกลบหรือไม่");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sample_list");
}
