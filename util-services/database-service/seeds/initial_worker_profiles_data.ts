import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("worker_profiles").del();

  // Inserts seed entries
  await knex("worker_profiles").insert([
    {
      id_card_number: "1101100000001",
      user_id: 1, // Assuming user_id 1 exists in the users table
      title: "Mr.",
      first_name: "John",
      last_name: "Doe",
      phone_number: "02-111-1111",
      mobile_phone_number: "081-111-1111",
      email: "john.doe@example.com",
      id_card_file_path: "/path/to/john_doe_id.jpg",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id_card_number: "2202200000002",
      user_id: 2, // Assuming user_id 2 exists in the users table
      title: "Ms.",
      first_name: "Jane",
      last_name: "Smith",
      phone_number: "02-222-2222",
      mobile_phone_number: "082-222-2222",
      email: "jane.smith@example.com",
      id_card_file_path: "/path/to/jane_smith_id.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id_card_number: "3303300000003",
      user_id: 3, // Assuming user_id 3 exists in the users table
      title: "Dr.",
      first_name: "David",
      last_name: "Lee",
      phone_number: "02-333-3333",
      mobile_phone_number: "083-333-3333",
      email: "david.lee@example.com",
      id_card_file_path: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
