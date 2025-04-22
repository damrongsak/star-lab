import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      username: "admin",
      first_name: "Supper",
      last_name: "Admin",
      email: "admin@example.com",
      password: "hashed_password_1",
      role: "admin",
      is_active: true,
    },
    {
      id: 2,
      username: "user1",
      first_name: "User1",
      last_name: "Surname1",
      email: "user1@example.com",
      password: "hashed_password_2",
      role: "customer",
      is_active: true,
    },
    {
      id: 3,
      username: "user2",
      first_name: "User2",
      last_name: "Surname2",
      email: "user2@example.com",
      password: "hashed_password_3",
      role: "customer",
      is_active: true,
    },
  ]);
}
