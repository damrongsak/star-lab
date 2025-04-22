import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("customers").del();

  // Inserts seed entries
  await knex("customers").insert([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice.johnson@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
