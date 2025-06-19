import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("worker_profiles", (table) => {
    table.increments("id").primary();
    table
      .string("id_card_number", 20)
      .notNullable()
      .unique()
      .comment("หมายเลขบัตรประชาชน");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .comment("Foreign key อ้างอิง user_id จากตาราง users");
    table.string("title", 50).nullable().comment("คำนำหน้าชื่อ");
    table.string("first_name", 100).notNullable().comment("ชื่อ");
    table.string("last_name", 100).notNullable().comment("นามสกุล");
    table.string("phone_number", 20).nullable().comment("เบอร์โทรศัพท์");
    table
      .string("mobile_phone_number", 20)
      .notNullable()
      .comment("เบอร์โทรศัพท์มือถือ");
    table.string("email", 255).nullable().comment("อีเมล");
    table
      .string("id_card_file_path", 255)
      .nullable()
      .comment("path ไฟล์บัตรประชาชน"); // เพิ่มฟิลด์สำหรับ path ของไฟล์
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("worker_profiles");
}
