import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("receipt_addresses").del();

  // Inserts seed entries
  await knex("receipt_addresses").insert([
    {
      address: "100/75 หมู่ที่ 2",
      province: "ปทุมธานี",
      district: "อำเภอเมืองปทุมธานี",
      sub_district: "ตำบลหลักหก",
      postal_code: "12000",
      telephone: "02-222-1234",
      fax_number: "02-222-1234",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      address: "99/123 หมู่ที่ 5",
      province: "กรุงเทพมหานคร",
      district: "เขตดอนเมือง",
      sub_district: "แขวงสีกัน",
      postal_code: "10210",
      telephone: "02-555-9876",
      fax_number: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
