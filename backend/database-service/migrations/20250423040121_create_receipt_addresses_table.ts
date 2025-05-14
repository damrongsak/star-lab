import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("receipt_addresses", (table) => {
    table.increments("id").primary();
    table
      .string("address", 255)
      .notNullable()
      .comment("ที่อยู่ อาคาร / ชั้น / เลขที่");
    table.string("province", 100).notNullable().comment("จังหวัด");
    table.string("district", 100).notNullable().comment("อำเภอ / แขวง");
    table.string("sub_district", 100).notNullable().comment("ตำบล / แขวง");
    table.string("postal_code", 10).notNullable().comment("รหัสไปรษณีย์");
    table.string("telephone", 20).nullable().comment("เบอร์โทรศัพท์");
    table.string("fax_number", 20).nullable().comment("เบอร์โทรสาร");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("receipt_addresses");
}
