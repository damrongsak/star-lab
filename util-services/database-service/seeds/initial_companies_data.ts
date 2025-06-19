import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("companies").del();

  // Inserts seed entries
  await knex("companies").insert([
    {
      company_name_en: "Example Co., Ltd.",
      company_name_th: "บริษัท ตัวอย่าง จำกัด",
      tax_id: "1234567890123",
      address: "123/45 Example Building, Example Road",
      sub_district: "Example Sub-district",
      district: "Example District",
      province: "Example Province",
      postal_code: "10110",
      telephone: "02-123-4567",
      fax_number: "02-123-4568",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      company_name_en: "Sample Corporation",
      company_name_th: "บริษัท แซมเปิล จำกัด",
      tax_id: "9876543210987",
      address: "99/9 Sample Tower, Sample Street",
      sub_district: "Sample Sub-district",
      district: "Sample District",
      province: "Sample Province",
      postal_code: "20220",
      telephone: "038-987-654",
      fax_number: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      company_name_en: "Test Company Limited",
      company_name_th: "บริษัท ทดสอบ จำกัด",
      tax_id: null, // Example with null tax_id
      address: "789 Test Avenue, Test City",
      sub_district: "Test Sub-district",
      district: "Test District",
      province: "Test Province",
      postal_code: "30330",
      telephone: "044-555-1212",
      fax_number: "044-555-1213",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
