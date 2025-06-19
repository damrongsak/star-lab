import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("companies", (table) => {
    table.increments("id").primary();
    table
      .string("company_name_en", 255)
      .notNullable()
      .comment("ชื่อบริษัท (ภาษาอังกฤษ)");
    table
      .string("company_name_th", 255)
      .notNullable()
      .comment("ชื่อบริษัท (ภาษาไทย)");
    table.string("tax_id", 50).nullable().comment("เลขประจำตัวผู้เสียภาษี"); // อาจเป็น null ได้ถ้ายังไม่มีการอัพโหลด
    table.string("address", 255).notNullable().comment("ที่อยู่"); // รวม บ้านเลขที่/หมู่ที่
    table.string("sub_district", 100).notNullable().comment("ตำบล/แขวง");
    table.string("district", 100).notNullable().comment("อำเภอ/เขต");
    table.string("province", 100).notNullable().comment("จังหวัด");
    table.string("postal_code", 10).notNullable().comment("รหัสไปรษณีย์");
    table.string("telephone", 20).nullable().comment("เบอร์โทรศัพท์");
    table.string("fax_number", 20).nullable().comment("เบอร์โทรสาร");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("companies");
}
